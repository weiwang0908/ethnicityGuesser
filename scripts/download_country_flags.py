#!/usr/bin/env python3
"""Download country flag images as placeholders for the Countries game mode.

Replaces the text placeholders in ``public/countries/`` with real flag PNGs
from flagcdn.com and updates ``data/countries.json`` to point to the local
flag images.

Usage:
    python scripts/download_country_flags.py
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import requests

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_PATH = BASE_DIR / "data" / "countries.json"
OUTPUT_DIR = BASE_DIR / "public" / "countries"
TIMEOUT = 30

# ISO 3166-1 alpha-2 codes for the 48 countries in the dataset.
NAME_TO_CODE = {
    "Austria": "AT",
    "Bangladesh": "BD",
    "Belgium": "BE",
    "Brazil": "BR",
    "China": "CN",
    "Czech Republic": "CZ",
    "Denmark": "DK",
    "Egypt": "EG",
    "Ethiopia": "ET",
    "Finland": "FI",
    "France": "FR",
    "Germany": "DE",
    "Greece": "GR",
    "Hungary": "HU",
    "India": "IN",
    "Indonesia": "ID",
    "Iran": "IR",
    "Iraq": "IQ",
    "Ireland": "IE",
    "Israel": "IL",
    "Italy": "IT",
    "Japan": "JP",
    "Kenya": "KE",
    "Lebanon": "LB",
    "Malaysia": "MY",
    "Morocco": "MA",
    "Netherlands": "NL",
    "Nigeria": "NG",
    "Norway": "NO",
    "Pakistan": "PK",
    "Philippines": "PH",
    "Poland": "PL",
    "Portugal": "PT",
    "Romania": "RO",
    "Russia": "RU",
    "Saudi Arabia": "SA",
    "South Africa": "ZA",
    "South Korea": "KR",
    "Spain": "ES",
    "Sri Lanka": "LK",
    "Sweden": "SE",
    "Switzerland": "CH",
    "Thailand": "TH",
    "Turkey": "TR",
    "Ukraine": "UA",
    "United Kingdom": "GB",
    "United States": "US",
    "Vietnam": "VN",
}

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
    ),
    "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
}


def download_flag(code: str, dest: Path) -> bool:
    """Download a 640px-wide PNG flag from flagcdn.com."""
    url = f"https://flagcdn.com/256x192/{code.lower()}.png"
    try:
        resp = requests.get(url, headers=HEADERS, timeout=TIMEOUT)
        resp.raise_for_status()
        dest.write_bytes(resp.content)
        return True
    except requests.RequestException as exc:
        print(f"[warn] failed {url}: {exc}", file=sys.stderr)
        return False


def main() -> int:
    if not DATA_PATH.exists():
        print(f"[error] {DATA_PATH} not found", file=sys.stderr)
        return 1

    with DATA_PATH.open("r", encoding="utf-8") as fh:
        records: list[dict] = json.load(fh)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    updated = 0
    failed = 0
    for rec in records:
        name = rec.get("name", "")
        slug = rec.get("slug", "")
        code = NAME_TO_CODE.get(name)
        if not slug or not code:
            print(f"[warn] no flag code for {name}", file=sys.stderr)
            failed += 1
            continue

        dest = OUTPUT_DIR / f"{slug}.png"
        if download_flag(code, dest):
            rec["image_url"] = f"/countries/{slug}.png"
            updated += 1
            print(f"[ok] {slug} -> {rec['image_url']}", file=sys.stderr)
        else:
            failed += 1

    with DATA_PATH.open("w", encoding="utf-8") as fh:
        json.dump(records, fh, ensure_ascii=False, indent=2)

    print(
        f"[info] downloaded {updated} flags, failed {failed}",
        file=sys.stderr,
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
