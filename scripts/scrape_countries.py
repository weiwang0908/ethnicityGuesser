#!/usr/bin/env python3
"""Scrape country average-face composite data.

Primary source: https://thepostnationalmonitor.com (and its
``/average-face-*`` / country pages).  When scraping is hard or the
source is unreachable, the script falls back to a built-in 48-country
list with name + coordinates only (empty image_url, generic
description).

Output: ``data/countries.json`` (one entry per country).

Idempotent: every run overwrites the output file.  On total failure
(even the fallback could not produce data) it exits with code 1.

Usage:
    python scripts/scrape_countries.py
"""

from __future__ import annotations

import json
import re
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

# --------------------------------------------------------------------------- #
# Configuration
# --------------------------------------------------------------------------- #

PRIMARY_BASE = "https://thepostnationalmonitor.com"
OUTPUT_PATH = Path(__file__).resolve().parent.parent / "data" / "countries.json"
TIMEOUT = 30
MAX_WORKERS = 6
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (compatible; EthnoResearchBot/1.0; "
        "+https://github.com/ethno/ethno)"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}

# Region mapping used to classify the built-in country list.
COUNTRY_REGION = {
    # Europe
    "germany": "Europe", "france": "Europe", "united kingdom": "Europe",
    "italy": "Europe", "spain": "Europe", "poland": "Europe",
    "netherlands": "Europe", "belgium": "Europe", "sweden": "Europe",
    "norway": "Europe", "denmark": "Europe", "finland": "Europe",
    "ireland": "Europe", "portugal": "Europe", "austria": "Europe",
    "switzerland": "Europe", "czech republic": "Europe",
    "greece": "Europe", "russia": "Europe", "ukraine": "Europe",
    "romania": "Europe", "hungary": "Europe",
    # Middle East
    "turkey": "Middle East", "iran": "Middle East", "israel": "Middle East",
    "saudi arabia": "Middle East", "lebanon": "Middle East",
    "iraq": "Middle East",
    # South Asia
    "india": "South Asia", "pakistan": "South Asia",
    "bangladesh": "South Asia", "sri lanka": "South Asia",
    # East / Southeast Asia
    "china": "East Asia", "japan": "East Asia",
    "south korea": "East Asia", "north korea": "East Asia",
    "vietnam": "Southeast Asia", "thailand": "Southeast Asia",
    "indonesia": "Southeast Asia", "philippines": "Southeast Asia",
    "malaysia": "Southeast Asia", "cambodia": "Southeast Asia",
    # Africa
    "nigeria": "Sub-Saharan Africa", "ethiopia": "Sub-Saharan Africa",
    "kenya": "Sub-Saharan Africa", "south africa": "Sub-Saharan Africa",
    "ghana": "Sub-Saharan Africa", "morocco": "North Africa",
    "egypt": "North Africa", "algeria": "North Africa",
    # Americas
    "united states": "North America", "canada": "North America",
    "mexico": "North America", "brazil": "South America",
    "argentina": "South America", "colombia": "South America",
    "peru": "South America", "chile": "South America",
    # Oceania
    "australia": "Oceania", "new zealand": "Oceania",
}

# Built-in 48-country fallback: (name, lat, lng).  Coordinates are
# country centroids (approximate).  Used only when live scraping fails.
FALLBACK_COUNTRIES = [
    ("Germany", 51.1657, 10.4515),
    ("France", 46.2276, 2.2137),
    ("United Kingdom", 55.3781, -3.4360),
    ("Italy", 41.8719, 12.5674),
    ("Spain", 40.4637, -3.7492),
    ("Poland", 51.9194, 19.1451),
    ("Netherlands", 52.1326, 5.2913),
    ("Belgium", 50.5039, 4.4699),
    ("Sweden", 60.1282, 18.6435),
    ("Norway", 60.4720, 8.4689),
    ("Denmark", 56.2639, 9.5018),
    ("Finland", 61.9241, 25.7482),
    ("Ireland", 53.4129, -8.2439),
    ("Portugal", 39.3999, -8.2245),
    ("Austria", 47.5162, 14.5501),
    ("Switzerland", 46.8182, 8.2275),
    ("Czech Republic", 49.8175, 15.4730),
    ("Greece", 39.0742, 21.8243),
    ("Russia", 61.5240, 105.3188),
    ("Ukraine", 48.3794, 31.1656),
    ("Romania", 45.9432, 24.9668),
    ("Hungary", 47.1625, 19.5033),
    ("Turkey", 38.9637, 35.2433),
    ("Iran", 32.4279, 53.6880),
    ("Israel", 31.0461, 34.8516),
    ("Saudi Arabia", 23.8859, 45.0792),
    ("Lebanon", 33.8547, 35.8623),
    ("Iraq", 33.2232, 43.6793),
    ("India", 20.5937, 78.9629),
    ("Pakistan", 30.3753, 69.3451),
    ("Bangladesh", 23.6850, 90.3563),
    ("Sri Lanka", 7.8731, 80.7718),
    ("China", 35.8617, 104.1954),
    ("Japan", 36.2048, 138.2529),
    ("South Korea", 35.9078, 127.7669),
    ("Vietnam", 14.0583, 108.2772),
    ("Thailand", 15.8700, 100.9925),
    ("Indonesia", -0.7893, 113.9213),
    ("Philippines", 12.8797, 121.7740),
    ("Malaysia", 4.2105, 101.9758),
    ("Nigeria", 9.0820, 8.6753),
    ("Ethiopia", 9.1450, 40.4897),
    ("Kenya", -0.0236, 37.9062),
    ("South Africa", -30.5595, 22.9375),
    ("Morocco", 31.7917, -7.0926),
    ("Egypt", 26.8206, 30.8025),
    ("United States", 37.0902, -95.7129),
    ("Brazil", -14.2350, -51.9253),
]


# --------------------------------------------------------------------------- #
# Helpers
# --------------------------------------------------------------------------- #

def slugify(name: str) -> str:
    """Kebab-case slug: ``United Kingdom`` -> ``united-kingdom``."""
    slug = name.strip().lower()
    slug = re.sub(r"[^\w\s-]", "", slug)
    slug = re.sub(r"\s+", "-", slug)
    slug = re.sub(r"-+", "-", slug)
    return slug.strip("-")


def fetch(url: str) -> str:
    """Fetch a URL; raise RuntimeError on failure."""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=TIMEOUT)
        resp.raise_for_status()
        return resp.text
    except requests.RequestException as exc:
        raise RuntimeError(f"GET {url} failed: {exc}") from exc


def _absolutize_url(url: str, base: str = PRIMARY_BASE) -> str:
    if url.startswith(("http://", "https://")):
        return url
    if url.startswith("//"):
        return "https:" + url
    return urljoin(base + "/", url.lstrip("/"))


def _region_for_country(name: str) -> str:
    return COUNTRY_REGION.get(name.lower(), "Unknown")


# --------------------------------------------------------------------------- #
# Live scraping (best-effort)
# --------------------------------------------------------------------------- #

def discover_country_urls() -> list[str]:
    """Discover country page URLs from the primary source.

    Looks at the homepage + common index pages for internal links whose
    path mentions a country.  Returns an empty list on any failure so
    the caller can fall back to the built-in list.
    """
    candidates = [PRIMARY_BASE + "/", PRIMARY_BASE + "/countries",
                  PRIMARY_BASE + "/average-faces"]
    urls: set[str] = set()
    for page in candidates:
        try:
            html = fetch(page)
        except RuntimeError as exc:
            print(f"[warn] {exc}", file=sys.stderr)
            continue
        soup = BeautifulSoup(html, "lxml")
        for a in soup.find_all("a", href=True):
            href = a["href"]
            parsed = urlparse(href)
            path = parsed.path.lower()
            # heuristic: paths containing "country" / "average-face"
            if ("average-face" in path or "/country/" in path or
                    "/countries/" in path):
                urls.add(_absolutize_url(href))
    return sorted(urls)


def parse_country_page(url: str, html: str) -> dict | None:
    soup = BeautifulSoup(html, "lxml")

    # name
    name = ""
    h1 = soup.find("h1")
    if h1 and h1.get_text(strip=True):
        name = h1.get_text(strip=True)
    if not name:
        title = soup.find("title")
        if title and title.get_text(strip=True):
            name = re.split(r"\s*[-–|]\s*",
                            title.get_text(strip=True))[0].strip()
    if not name:
        return None

    # image
    image_url = ""
    main = soup.select_one("main") or soup.select_one("article") or soup
    img = main.find("img")
    if img and (img.get("src") or img.get("data-src")):
        image_url = _absolutize_url(img.get("src") or img.get("data-src"))

    # description
    description = ""
    paragraphs = [p.get_text(" ", strip=True) for p in main.find_all("p")]
    paragraphs = [p for p in paragraphs if len(p) > 40]
    if paragraphs:
        paragraphs.sort(key=len, reverse=True)
        description = paragraphs[0]
    if not description:
        meta = soup.find("meta", attrs={"name": "description"}) or \
            soup.find("meta", attrs={"property": "og:description"})
        if meta and meta.get("content"):
            description = meta["content"].strip()

    slug = slugify(name)
    return {
        "id": slug,
        "slug": slug,
        "name": name,
        "region": _region_for_country(name),
        "lat": None,
        "lng": None,
        "image_url": image_url,
        "description": description,
        "source_url": url,
    }


def scrape_live() -> list[dict]:
    """Attempt a live scrape. Returns [] on any hard failure."""
    try:
        urls = discover_country_urls()
    except Exception as exc:  # noqa: BLE001
        print(f"[warn] country URL discovery failed: {exc}", file=sys.stderr)
        return []
    if not urls:
        print("[info] no country URLs discovered on primary source",
              file=sys.stderr)
        return []

    print(f"[info] fetching {len(urls)} country pages ...", file=sys.stderr)
    records: list[dict] = []
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
        fut_to_url = {pool.submit(fetch, u): u for u in urls}
        for fut in as_completed(fut_to_url):
            url = fut_to_url[fut]
            try:
                html = fut.result()
            except RuntimeError as exc:
                print(f"[warn] {exc}", file=sys.stderr)
                continue
            try:
                rec = parse_country_page(url, html)
            except Exception as exc:  # noqa: BLE001
                print(f"[warn] parse failed for {url}: {exc}", file=sys.stderr)
                continue
            if rec:
                records.append(rec)

    # Enrich with coordinates from the built-in list where possible.
    coord_map = {slugify(n): (lat, lng) for n, lat, lng in FALLBACK_COUNTRIES}
    for rec in records:
        if rec["lat"] is None and rec["id"] in coord_map:
            rec["lat"], rec["lng"] = coord_map[rec["id"]]
        if not rec["description"]:
            rec["description"] = f"Average face composite for {rec['name']}."

    return records


# --------------------------------------------------------------------------- #
# Fallback
# --------------------------------------------------------------------------- #

def build_fallback() -> list[dict]:
    """Build records from the built-in 48-country list."""
    print("[info] using built-in 48-country fallback list", file=sys.stderr)
    records = []
    for name, lat, lng in FALLBACK_COUNTRIES:
        slug = slugify(name)
        records.append({
            "id": slug,
            "slug": slug,
            "name": name,
            "region": _region_for_country(name),
            "lat": lat,
            "lng": lng,
            "image_url": "",
            "description": f"Average face composite for {name}.",
            "source_url": "",
        })
    return records


# --------------------------------------------------------------------------- #
# Main
# --------------------------------------------------------------------------- #

def main() -> int:
    records = scrape_live()
    if len(records) < 48:
        print(f"[info] live scrape yielded {len(records)} (<48); "
              "falling back to built-in list", file=sys.stderr)
        records = build_fallback()

    # de-duplicate by id, keep first
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

    print(f"[info] wrote {len(unique)} countries to {OUTPUT_PATH}",
          file=sys.stderr)
    if not unique:
        print("[error] produced 0 records", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
