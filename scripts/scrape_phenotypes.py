#!/usr/bin/env python3
"""Scrape phenotype data from https://humanphenotypes.net.

The site lists ~240 phenotypes organized under 38 main phenotype types.
Each phenotype page exposes: name, region, composite face image, short
description, references and rough geographic origin.

Output: ``data/phenotypes.json`` (one entry per phenotype).

The script is idempotent: every run overwrites the output file.  On
network failure it logs to stderr and exits with code 1.

Usage:
    python scripts/scrape_phenotypes.py
"""

from __future__ import annotations

import json
import re
import sys
import hashlib
import tempfile
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import urljoin, urlparse

import requests
import urllib3
from bs4 import BeautifulSoup

# humanphenotypes.net serves a certificate whose CN/SAN does not match the
# host (hostname mismatch). The site is legit and reachable, so for this
# specific scraping target we disable TLS verification and silence the
# resulting urllib3 warnings.
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# --------------------------------------------------------------------------- #
# Configuration
# --------------------------------------------------------------------------- #

BASE_URL = "https://humanphenotypes.net"
SITEMAP_URLS = [
    f"{BASE_URL}/sitemap.xml",
    f"{BASE_URL}/sitemap_index.xml",
]
OUTPUT_PATH = Path(__file__).resolve().parent.parent / "data" / "phenotypes.json"
TIMEOUT = 30
MAX_WORKERS = 6
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (compatible; EthnoResearchBot/1.0; "
        "+https://github.com/ethno/ethno)"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}

# Fallback coordinates keyed by lowercase region / keyword.  When the page
# text does not yield precise coordinates we map the region string to one
# of these canonical points.
REGION_COORDS = {
    "europe": (50.0, 10.0),
    "northern europe": (60.0, 15.0),
    "western europe": (47.0, 2.0),
    "southern europe": (41.0, 12.0),
    "eastern europe": (52.0, 25.0),
    "north africa": (26.0, 17.0),
    "sub-saharan africa": (2.0, 20.0),
    "west africa": (8.0, -5.0),
    "east africa": (0.0, 35.0),
    "south africa": (-29.0, 24.0),
    "middle east": (29.0, 45.0),
    "central asia": (45.0, 65.0),
    "south asia": (22.0, 78.0),
    "east asia": (35.0, 110.0),
    "southeast asia": (5.0, 110.0),
    "north america": (45.0, -100.0),
    "south america": (-15.0, -60.0),
    "oceania": (-25.0, 140.0),
    "arctic": (78.0, 15.0),
    "siberia": (60.0, 100.0),
    "americas": (15.0, -90.0),
    "central europe": (49.0, 15.0),
    "southeastern europe": (42.0, 22.0),
    "central africa": (-1.0, 22.0),
    "polynesia": (-15.0, -140.0),
    "melanesia": (-10.0, 155.0),
    "australia": (-25.0, 135.0),
    "caucasus": (42.0, 44.0),
}

# Map of "basic type" (the 38 meta-types linked as basic/<Name>.html) to a
# canonical region string.  Used to derive region + coordinates for each
# detailed phenotype, since phenotype pages do not carry an explicit region
# label.
BASIC_TYPE_REGION = {
    "Nordid": "Northern Europe",
    "Mediterranid": "Southern Europe",
    "Alpinid": "Central Europe",
    "Dinarid": "Southeastern Europe",
    "Armenid": "Caucasus",
    "Baltid": "Eastern Europe",
    "EastBaltid": "Eastern Europe",
    "Lapponoid": "Arctic",
    "Borreby": "Northern Europe",
    "Brunn": "Northern Europe",
    "Faelid": "Northern Europe",
    "Tronder": "Northern Europe",
    "Hallstatt": "Northern Europe",
    "KelticNordid": "Northern Europe",
    "AngloSaxon": "Northern Europe",
    "Sudanid": "West Africa",
    "Bantuid": "Sub-Saharan Africa",
    "Aethiopid": "East Africa",
    "Khoisanid": "South Africa",
    "Pygmid": "Central Africa",
    "Melanid": "West Africa",
    "Nilotid": "East Africa",
    "Arabid": "Middle East",
    "Iranid": "Middle East",
    "Orientalid": "North Africa",
    "Turanid": "Central Asia",
    "Indid": "South Asia",
    "Indobrachid": "South Asia",
    "Sinid": "East Asia",
    "Tungid": "Siberia",
    "Americid": "Americas",
    "Polynid": "Polynesia",
    "Melanesid": "Melanesia",
    "Australid": "Australia",
    "DesertAustralid": "Australia",
    "Caribbean": "South America",
}

# Six phenotype pages linked from the homepage image map.  Used as BFS seeds.
SEED_URLS = [
    f"{BASE_URL}/Hallstatt.html",
    f"{BASE_URL}/Gobid.html",
    f"{BASE_URL}/Sudanid.html",
    f"{BASE_URL}/Planid.html",
    f"{BASE_URL}/DesertAustralid.html",
    f"{BASE_URL}/Karroid.html",
]

# Keyword -> region fallback.  When a phenotype's basic type is not in
# BASIC_TYPE_REGION (e.g. rare local subtypes), the description text is
# scanned for these geographic keywords.  Only the first ~400 chars of the
# description are considered (the opening summary states the primary
# distribution).  Keywords are checked in listed order, so more specific /
# distinctive terms should come first.  All regions here must exist as keys
# in REGION_COORDS (case-insensitive substring match).
PLACE_KEYWORDS: list[tuple[str, str]] = [
    # Oceania / SE Asia islands (specific first)
    ("philippine", "Southeast Asia"),
    ("negrito", "Southeast Asia"),
    ("aeta", "Southeast Asia"),
    ("semang", "Southeast Asia"),
    ("andalus", "Southern Europe"),  # keep before generic spain? Andalus=Spain
    ("melanesia", "Melanesia"),
    ("papua", "Melanesia"),
    ("new guinea", "Melanesia"),
    ("new hebrides", "Melanesia"),
    ("fiji", "Melanesia"),
    ("polynesia", "Polynesia"),
    ("hawaii", "Polynesia"),
    ("maori", "Polynesia"),
    ("samoa", "Polynesia"),
    ("micronesia", "Polynesia"),
    ("australia", "Australia"),
    ("aboriginal", "Australia"),
    ("aborigine", "Australia"),
    # East / Southeast Asia
    ("japan", "East Asia"),
    ("ainu", "East Asia"),
    ("korea", "East Asia"),
    ("tibet", "East Asia"),
    ("china", "East Asia"),
    ("chinese", "East Asia"),
    ("borneo", "Southeast Asia"),
    ("dayak", "Southeast Asia"),
    ("malay", "Southeast Asia"),
    ("indonesia", "Southeast Asia"),
    ("java", "Southeast Asia"),
    ("sumatra", "Southeast Asia"),
    ("sunda", "Southeast Asia"),
    ("khmer", "Southeast Asia"),
    ("vietnam", "Southeast Asia"),
    # Siberia / Arctic
    ("chukchi", "Siberia"),
    ("koryak", "Siberia"),
    ("yakut", "Siberia"),
    ("tungus", "Siberia"),
    ("samoyed", "Siberia"),
    ("nenets", "Siberia"),
    ("yamal", "Siberia"),
    ("siberia", "Siberia"),
    ("inuit", "Arctic"),
    ("eskimo", "Arctic"),
    ("aleut", "Arctic"),
    ("arctic", "Arctic"),
    # Africa
    ("ethiopia", "East Africa"),
    ("eritrean", "East Africa"),
    ("eritrea", "East Africa"),
    ("somali", "East Africa"),
    ("danakil", "East Africa"),
    ("afar", "East Africa"),
    ("maasai", "East Africa"),
    ("kenya", "East Africa"),
    ("tanzania", "East Africa"),
    ("nilotic", "East Africa"),
    ("nilotid", "East Africa"),
    ("nigeria", "West Africa"),
    ("senegal", "West Africa"),
    ("guinea", "West Africa"),
    ("ghana", "West Africa"),
    ("mali", "West Africa"),
    ("cameroon", "West Africa"),
    ("congo", "Sub-Saharan Africa"),
    ("bantu", "Sub-Saharan Africa"),
    ("kalahari", "South Africa"),
    ("khoisan", "South Africa"),
    ("bushmen", "South Africa"),
    ("san people", "South Africa"),
    ("algeria", "North Africa"),
    ("tunisia", "North Africa"),
    ("morocco", "North Africa"),
    ("atlas mountains", "North Africa"),
    ("maghreb", "North Africa"),
    ("berber", "North Africa"),
    ("sahara", "North Africa"),
    ("egypt", "North Africa"),
    ("nubia", "North Africa"),
    # Americas
    ("patagonia", "South America"),
    ("tierra del fuego", "South America"),
    ("fuegid", "South America"),
    ("chile", "South America"),
    ("andes", "South America"),
    ("peru", "South America"),
    ("bolivia", "South America"),
    ("amazon", "South America"),
    ("brazil", "South America"),
    ("argentina", "South America"),
    ("colombia", "South America"),
    ("caribbean", "South America"),
    ("native american", "North America"),
    ("amerind", "North America"),
    ("north america", "North America"),
    ("united states", "North America"),
    ("alaska", "North America"),
    ("athabask", "North America"),
    ("yukon", "North America"),
    ("british columbia", "North America"),
    ("california", "North America"),
    ("arizona", "North America"),
    ("sonora", "North America"),
    ("mexico", "North America"),
    ("mexican", "North America"),
    ("apache", "North America"),
    ("navajo", "North America"),
    ("sioux", "North America"),
    # South Asia
    ("dravidian", "South Asia"),
    ("vedda", "South Asia"),
    ("veddoid", "South Asia"),
    ("andaman", "South Asia"),
    ("sri lanka", "South Asia"),
    ("pakistan", "South Asia"),
    ("bangladesh", "South Asia"),
    ("india", "South Asia"),
    ("ganges", "South Asia"),
    # Middle East / Caucasus
    ("caucasus", "Caucasus"),
    ("armenia", "Caucasus"),
    ("georgian", "Caucasus"),
    ("anatolia", "Middle East"),
    ("turkey", "Middle East"),
    ("arabia", "Middle East"),
    ("arabian", "Middle East"),
    ("arab ", "Middle East"),
    ("iran", "Middle East"),
    ("persia", "Middle East"),
    ("kurd", "Middle East"),
    ("mesopotamia", "Middle East"),
    # Europe (specific regions before generic)
    ("scandinavia", "Northern Europe"),
    ("sweden", "Northern Europe"),
    ("norway", "Northern Europe"),
    ("denmark", "Northern Europe"),
    ("finland", "Northern Europe"),
    ("iceland", "Northern Europe"),
    ("baltic", "Northern Europe"),
    ("britain", "Northern Europe"),
    ("ireland", "Northern Europe"),
    ("balkan", "Southeastern Europe"),
    ("greece", "Southern Europe"),
    ("italy", "Southern Europe"),
    ("spain", "Southern Europe"),
    ("iberia", "Southern Europe"),
    ("portugal", "Southern Europe"),
    ("hungary", "Central Europe"),
    ("germany", "Central Europe"),
    ("austria", "Central Europe"),
    ("switzerland", "Central Europe"),
    ("france", "Western Europe"),
    ("russia", "Eastern Europe"),
    ("slavic", "Eastern Europe"),
    ("poland", "Eastern Europe"),
    ("ukraine", "Eastern Europe"),
    # Central Asia
    ("mongol", "Central Asia"),
    ("turkic", "Central Asia"),
    ("turkestan", "Central Asia"),
    ("central asia", "Central Asia"),
]


# --------------------------------------------------------------------------- #
# Helpers
# --------------------------------------------------------------------------- #

def slugify(name: str) -> str:
    """Convert a phenotype name to a kebab-case slug.

    Examples:
        ``Nordid``        -> ``nordid``
        ``East Nordid``   -> ``east-nordid``
        ``Atlanto-Med``   -> ``atlanto-med``
    """
    slug = name.strip().lower()
    slug = re.sub(r"[^\w\s-]", "", slug)
    slug = re.sub(r"\s+", "-", slug)
    slug = re.sub(r"-+", "-", slug)
    return slug.strip("-")


def fetch(url: str) -> str:
    """Fetch a URL and return its text body.

    Successful responses are cached on disk (in the system temp dir, keyed by
    URL hash) so that re-runs during development do not hammer the source
    site.  Raises ``RuntimeError`` on any network / HTTP error so the caller
    can decide how to handle it (log + exit, retry, skip, ...).
    """
    cache_dir = Path(tempfile.gettempdir()) / "ethno_scrape_cache"
    cache_file = cache_dir / (hashlib.sha1(url.encode("utf-8")).hexdigest() + ".html")
    if cache_file.exists():
        try:
            return cache_file.read_text(encoding="utf-8", errors="replace")
        except OSError:
            pass  # ignore read errors, fall through to network
    try:
        resp = requests.get(url, headers=HEADERS, timeout=TIMEOUT, verify=False)
        resp.raise_for_status()
        text = resp.text
    except requests.RequestException as exc:
        raise RuntimeError(f"GET {url} failed: {exc}") from exc
    try:
        cache_dir.mkdir(parents=True, exist_ok=True)
        cache_file.write_text(text, encoding="utf-8")
    except OSError:
        pass  # caching is best-effort
    return text


def looks_like_phenotype_url(href: str) -> bool:
    """Heuristic: does this URL look like a phenotype page?

    We accept absolute or root-relative URLs whose path is a single
    non-empty segment that is NOT one of the known structural pages
    (sitemap, about, contact, ...).
    """
    if not href:
        return False
    parsed = urlparse(href)
    path = parsed.path
    if not path:
        return False
    # strip leading/trailing slashes
    path = path.strip("/")
    if not path or "/" in path:
        return False
    # skip anchors / query-only links
    if path in {
        "sitemap", "sitemap.xml", "about", "contact", "privacy",
        "privacy-policy", "terms", "disclaimer", "search", "blog",
        "news", "category", "categories", "index", "index-2",
        "index-2.html", "index.html",
    }:
        return False
    # skip file-like URLs except .html pages (this site uses .html URLs)
    if "." in path:
        ext = path.rsplit(".", 1)[1].lower()
        if ext != "html":
            return False
    return True


def _coords_from_text(text: str):
    """Try to extract a (lat, lng) pair from free-form page text.

    Looks for patterns such as ``12.34, -56.78`` or ``lat 12.34 lng -56.78``
    or ``12°N 56°W``.  Returns ``None`` when nothing plausible is found.
    """
    if not text:
        return None

    # decimal degrees: ``12.34, -56.78`` / ``12.34,-56.78``
    m = re.search(
        r"(-?\d{1,3}\.\d+)\s*,\s*(-?\d{1,3}\.\d+)", text
    )
    if m:
        lat = float(m.group(1))
        lng = float(m.group(2))
        if -90 <= lat <= 90 and -180 <= lng <= 180:
            return lat, lng

    # ``lat 12.34 lng -56.78`` / ``latitude: 12.34 longitude: -56.78``
    # two-step search for latitude then longitude
    lat_m = re.search(
        r"lat(?:itude)?\s*[:=]?\s*(-?\d{1,3}(?:\.\d+)?)", text, re.IGNORECASE
    )
    lng_m = re.search(
        r"lng|long(?:itude)?\s*[:=]?\s*(-?\d{1,3}(?:\.\d+)?)", text, re.IGNORECASE
    )
    if lat_m and lng_m:
        lat = float(lat_m.group(1))
        lng = float(lng_m.group(1))
        if -90 <= lat <= 90 and -180 <= lng <= 180:
            return lat, lng

    # DMS: ``12°34'N 56°78'W``
    m = re.search(
        r"(\d{1,3})°(\d{1,2})?['']?\s*([NS])"
        r"\s*(\d{1,3})°(\d{1,2})?['']?\s*([EW])",
        text,
    )
    if m:
        lat = int(m.group(1)) + (int(m.group(2) or 0) / 60.0)
        if m.group(3) == "S":
            lat = -lat
        lng = int(m.group(4)) + (int(m.group(5) or 0) / 60.0)
        if m.group(6) == "W":
            lng = -lng
        return lat, lng

    return None


def _coords_from_region(region: str):
    """Map a region string to fallback coordinates via REGION_COORDS."""
    if not region:
        return None
    r = region.strip().lower()
    if r in REGION_COORDS:
        return REGION_COORDS[r]
    # try substring matches (longest first for specificity)
    for key in sorted(REGION_COORDS, key=len, reverse=True):
        if key in r:
            return REGION_COORDS[key]
    return None


def _absolutize_url(url: str) -> str:
    """Make a possibly-relative URL absolute against BASE_URL."""
    if url.startswith("//"):
        return "https:" + url
    if url.startswith("http://") or url.startswith("https://"):
        return url
    return urljoin(BASE_URL + "/", url.lstrip("/"))


# --------------------------------------------------------------------------- #
# Discovery
# --------------------------------------------------------------------------- #

def _has_description_cell(soup: BeautifulSoup) -> bool:
    """A real phenotype page contains a <td> cell beginning with 'Description:'.

    Structural pages (index, list, contact, ...) do not, so this is a robust
    way to tell a phenotype page apart from a navigation page after fetching.
    """
    for td in soup.find_all("td"):
        if td.get_text(" ", strip=True).lower().startswith("description:"):
            return True
    return False


def build_reference_map() -> dict[str, str]:
    """Fetch the literature page once and map citation codes to full text.

    Phenotype pages cite references as ``links.html#<code>`` anchors.  The
    literature page defines each ``<a name="code">`` (or ``id="code"``)
    immediately followed by the citation text.  Returns ``{code: citation}``.
    """
    print("[info] building reference map from literature page ...",
          file=sys.stderr)
    ref_map: dict[str, str] = {}
    try:
        html = fetch(f"{BASE_URL}/links.html")
    except RuntimeError as exc:
        print(f"[warn] could not fetch literature page: {exc}", file=sys.stderr)
        return ref_map
    soup = BeautifulSoup(html, "lxml")
    for a in soup.find_all("a"):
        code = a.get("name") or a.get("id")
        if not code:
            continue
        # citation text is the next non-empty string after the anchor
        nxt = a.find_next(string=True)
        citation = nxt.strip() if nxt else ""
        # fall back to the anchor's own text or the parent list-item text
        if not citation:
            own = a.get_text(" ", strip=True)
            citation = own if own and own != code else ""
        if not citation:
            li = a.find_parent("li")
            if li:
                txt = li.get_text(" ", strip=True)
                citation = txt if txt and txt != code else ""
        ref_map[code] = citation or code
    print(f"[info] reference map: {len(ref_map)} entries", file=sys.stderr)
    return ref_map


def discover_phenotype_pages() -> dict[str, str]:
    """BFS from the seed phenotype pages, returning ``{url: html}``.

    Only root-level single-segment ``.html`` links are followed (the
    "Similar types" links on each phenotype page).  A fetched page is kept
    only when it looks like a real phenotype page (has a Description cell),
    so structural pages linked from phenotypes (index, list, ...) are
    fetched at most once and then discarded.
    """
    print("[info] discovering phenotype pages via BFS ...", file=sys.stderr)
    cache: dict[str, str] = {}
    visited: set[str] = set()
    queue: list[str] = list(SEED_URLS)
    while queue:
        url = queue.pop(0)
        if url in visited:
            continue
        visited.add(url)
        if not looks_like_phenotype_url(url):
            continue
        try:
            html = fetch(url)
        except RuntimeError as exc:
            print(f"[warn] {exc}", file=sys.stderr)
            continue
        soup = BeautifulSoup(html, "lxml")
        if not _has_description_cell(soup):
            continue  # structural page; do not cache, do not follow its links
        cache[url] = html
        if len(cache) % 25 == 0:
            print(f"[info]   ... {len(cache)} phenotype pages collected so far",
                  file=sys.stderr)
        for a in soup.find_all("a", href=True):
            href = a["href"]
            if looks_like_phenotype_url(href):
                abs_url = _absolutize_url(href)
                if abs_url not in visited:
                    queue.append(abs_url)
    print(f"[info] discovered {len(cache)} phenotype pages", file=sys.stderr)
    return cache


# --------------------------------------------------------------------------- #
# Page parsing
# --------------------------------------------------------------------------- #

def _extract_name(soup: BeautifulSoup) -> str:
    h1 = soup.find("h1")
    if h1 and h1.get_text(strip=True):
        return h1.get_text(strip=True)
    title = soup.find("title")
    if title and title.get_text(strip=True):
        # strip trailing site suffix like " - Human Phenotypes"
        text = title.get_text(strip=True)
        return re.split(r"\s*[-–|]\s*", text)[0].strip()
    return ""


def _extract_image(soup: BeautifulSoup, page_url: str) -> str:
    # prefer <img> inside <main> / article / figure
    containers = []
    for sel in ["main", "article", "figure", ".phenotype", ".content",
                ".entry-content", ".post"]:
        containers.extend(soup.select(sel))
    candidates = []
    for c in containers or [soup]:
        for img in c.find_all("img"):
            src = img.get("src") or img.get("data-src")
            if not src:
                continue
            # skip tiny icons / logos / avatars
            alt = (img.get("alt") or "").lower()
            if any(x in alt for x in ("logo", "icon", "avatar", "banner")):
                continue
            candidates.append(_absolutize_url(src))
    if candidates:
        return candidates[0]
    # last resort: first <img> on the page
    img = soup.find("img")
    if img and (img.get("src") or img.get("data-src")):
        return _absolutize_url(img.get("src") or img.get("data-src"))
    return ""


def _extract_description(soup: BeautifulSoup) -> str:
    # humanphenotypes.net uses 1990s-style <table> layout: the description
    # lives in a <td> cell whose text starts with "Description:".
    for td in soup.find_all("td"):
        t = td.get_text(" ", strip=True)
        if t.lower().startswith("description:"):
            return t.split(":", 1)[1].strip()
    # fallback: longest <td> text > 40 chars, excluding the "Similar types:" cell
    tds = [td.get_text(" ", strip=True) for td in soup.find_all("td")]
    tds = [t for t in tds
           if len(t) > 40 and not t.lower().startswith("similar types")]
    if tds:
        tds.sort(key=len, reverse=True)
        return tds[0]
    # Try common content containers, then pick the longest <p> block.
    for sel in ["main", "article", ".phenotype", ".content",
                ".entry-content", ".post-content", "#content"]:
        container = soup.select_one(sel)
        if container:
            paragraphs = [p.get_text(" ", strip=True)
                          for p in container.find_all("p")]
            paragraphs = [p for p in paragraphs if len(p) > 40]
            if paragraphs:
                paragraphs.sort(key=len, reverse=True)
                return paragraphs[0]
    # fallback: longest <p> anywhere
    paragraphs = [p.get_text(" ", strip=True) for p in soup.find_all("p")]
    paragraphs = [p for p in paragraphs if len(p) > 40]
    if paragraphs:
        paragraphs.sort(key=len, reverse=True)
        return paragraphs[0]
    # final fallback: meta description
    meta = soup.find("meta", attrs={"name": "description"}) or \
        soup.find("meta", attrs={"property": "og:description"})
    if meta and meta.get("content"):
        return meta["content"].strip()
    return ""


def _extract_basic_type(soup: BeautifulSoup) -> str:
    """Return the basic (meta) type name linked as ``basic/<Name>.html``.

    Each detailed phenotype page links to its parent basic type, e.g.
    ``basic/Nordid.html``.  Returns the bare name (``Nordid``) or ``""``.
    """
    for a in soup.find_all("a", href=True):
        m = re.match(r"basic/([A-Za-z0-9_\-]+)\.html", a["href"])
        if m:
            return m.group(1)
    return ""


def _region_from_keywords(text: str) -> str:
    """Scan the distribution section of a description for a geographic keyword.

    Returns the matching region string (a key in REGION_COORDS), or ``""``.
    Only the text before the "Physical Traits" / "Literature" markers is
    considered: that is the phenotype's primary distribution summary, while
    the later sections (physical traits, citations) would cause false matches.
    """
    if not text:
        return ""
    low = text.lower()
    cut = len(low)
    for marker in ("physical traits", "literature:", "similar types"):
        i = low.find(marker)
        if 0 <= i < cut:
            cut = i
    head = low[:cut]
    for keyword, region in PLACE_KEYWORDS:
        if keyword in head:
            return region
    return ""


def _extract_region(soup: BeautifulSoup, text: str,
                    description: str = "") -> str:
    # Primary signal: the parent basic type (basic/<Name>.html) maps to a
    # canonical region.  This is the most reliable region indicator on
    # humanphenotypes.net phenotype pages, which lack an explicit region label.
    basic = _extract_basic_type(soup)
    if basic and basic in BASIC_TYPE_REGION:
        return BASIC_TYPE_REGION[basic]
    # Some basic-type pages themselves are named after the type; map directly.
    name = ""
    h1 = soup.find("h1")
    if h1:
        name = h1.get_text(strip=True)
    if name in BASIC_TYPE_REGION:
        return BASIC_TYPE_REGION[name]
    # Look for explicit region labels first.
    for label in ("region", "area", "origin", "geographic origin",
                  "geographical origin", "distribution"):
        for el in soup.find_all(
            ["dt", "th", "strong", "b", "span", "li", "p"]
        ):
            t = el.get_text(" ", strip=True).lower()
            if t.startswith(label):
                # value may be in the same element after a colon, or in the
                # next sibling.
                after_colon = re.split(r":\s*", el.get_text(" ", strip=True), 1)
                if len(after_colon) == 2 and after_colon[1].strip():
                    return after_colon[1].strip()
                nxt = el.find_next_sibling()
                if nxt and nxt.get_text(strip=True):
                    return nxt.get_text(" ", strip=True)
    # fallback: search text for "Region:" patterns
    m = re.search(
        r"(?:region|area|origin|distribution)\s*[:\-]\s*([^\n.<]{3,60})",
        text, re.IGNORECASE,
    )
    if m:
        return m.group(1).strip()
    # fallback: scan the description opening for geographic keywords
    kw = _region_from_keywords(description)
    if kw:
        return kw
    return ""


def _extract_references(soup: BeautifulSoup,
                        ref_map: dict[str, str] | None = None) -> list[str]:
    """Extract references from a phenotype page.

    On humanphenotypes.net, references are encoded as ``links.html#<code>``
    anchors.  Each ``<code>`` (e.g. ``K96``) resolves to a full citation via
    the literature page map built by :func:`build_reference_map`.  When the
    map is unavailable or a code is missing, the raw code is kept.
    """
    ref_map = ref_map or {}
    refs: list[str] = []
    seen: set[str] = set()
    for a in soup.find_all("a", href=True):
        m = re.search(r"links\.html#([A-Za-z0-9]+)", a["href"])
        if not m:
            continue
        code = m.group(1)
        if code in seen:
            continue
        seen.add(code)
        citation = ref_map.get(code, "")
        # keep only meaningful citations; fall back to the bare code
        if citation and citation != code:
            refs.append(citation)
        else:
            refs.append(code)
    if refs:
        return refs
    # generic fallbacks for any other site structure
    for sel in [".references", "#references", ".bibliography",
                "#bibliography", ".refs", "#refs"]:
        container = soup.select_one(sel)
        if container:
            for li in container.find_all("li"):
                txt = li.get_text(" ", strip=True)
                if txt:
                    refs.append(txt)
            if refs:
                return refs
    for ol in soup.find_all("ol"):
        items = [li.get_text(" ", strip=True) for li in ol.find_all("li")]
        items = [i for i in items if re.search(r"\(\d{4}\)", i) or
                 re.search(r"\b(?:et al\.?|vol\.|pp\.|doi|isbn)\b", i,
                           re.IGNORECASE)]
        if len(items) >= 2:
            return items
    return refs


def parse_phenotype_page(url: str, html: str,
                         ref_map: dict[str, str] | None = None) -> dict | None:
    """Parse a single phenotype page into a record dict."""
    soup = BeautifulSoup(html, "lxml")
    name = _extract_name(soup)
    if not name:
        return None
    slug = slugify(name)
    image_url = _extract_image(soup, url)
    description = _extract_description(soup)
    page_text = soup.get_text(" ", strip=True)
    region = _extract_region(soup, page_text, description)
    references = _extract_references(soup, ref_map)

    # coordinates: try page text first, then region fallback
    coords = _coords_from_text(page_text)
    if coords is None:
        coords = _coords_from_region(region)
    if coords is None:
        coords = _coords_from_region(description)
    lat, lng = (coords if coords else (None, None))

    return {
        "id": slug,
        "slug": slug,
        "name": name,
        "region": region,
        "lat": lat,
        "lng": lng,
        "image_url": image_url,
        "description": description,
        "references": references,
        "source_url": url,
    }


# --------------------------------------------------------------------------- #
# Main
# --------------------------------------------------------------------------- #

def main() -> int:
    cache = discover_phenotype_pages()
    if not cache:
        print("[error] could not discover any phenotype pages", file=sys.stderr)
        return 1

    ref_map = build_reference_map()

    records: list[dict] = []
    failures: list[tuple[str, str]] = []

    print(f"[info] parsing {len(cache)} phenotype pages ...", file=sys.stderr)

    for url, html in cache.items():
        try:
            rec = parse_phenotype_page(url, html, ref_map)
        except Exception as exc:  # noqa: BLE001 - parse must not abort run
            failures.append((url, f"parse error: {exc}"))
            print(f"[warn] parse failed for {url}: {exc}", file=sys.stderr)
            continue
        if rec is None:
            failures.append((url, "no name found"))
            print(f"[warn] no name found on {url}", file=sys.stderr)
            continue
        records.append(rec)

    # de-duplicate by id, keep first occurrence
    seen: set[str] = set()
    unique: list[dict] = []
    for rec in records:
        if rec["id"] in seen:
            continue
        seen.add(rec["id"])
        unique.append(rec)
    unique.sort(key=lambda r: r["slug"])

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT_PATH.open("w", encoding="utf-8") as fh:
        json.dump(unique, fh, ensure_ascii=False, indent=2)

    print(f"[info] wrote {len(unique)} phenotypes to {OUTPUT_PATH}",
          file=sys.stderr)
    if failures:
        print(f"[warn] {len(failures)} pages failed:", file=sys.stderr)
        for u, msg in failures:
            print(f"        - {u}: {msg}", file=sys.stderr)

    # Non-zero exit only when we produced *no* records at all.
    if not unique:
        print("[error] produced 0 records", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
