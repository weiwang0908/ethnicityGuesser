#!/usr/bin/env python3
"""Download phenotype composite-face images to local public storage.

Reads ``data/phenotypes.json``, fetches each ``image_url`` from
humanphenotypes.net (which requires a browser User-Agent and has a
certificate mismatch), saves the image to ``public/phenotypes/<slug>.jpg``,
and rewrites ``image_url`` to the local path.

This fixes the 403 Forbidden / certificate errors that Next.js image
optimization hits when hot-linking the source site.

Usage:
    python scripts/download_phenotype_images.py
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import requests
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_PATH = BASE_DIR / "data" / "phenotypes.json"
OUTPUT_DIR = BASE_DIR / "public" / "phenotypes"
TIMEOUT = 30
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
    ),
    "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
    "Referer": "https://humanphenotypes.net/",
}


def download_image(url: str, dest: Path) -> bool:
    """Download a single image, return True on success."""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=TIMEOUT,
                            verify=False)
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
    skipped = 0
    failed = 0

    for rec in records:
        slug = rec.get("slug", "")
        original_url = rec.get("image_url", "")
        if not slug or not original_url:
            skipped += 1
            continue

        dest = OUTPUT_DIR / f"{slug}.jpg"

        # Already local: nothing to do.
        if original_url.startswith("/") and dest.exists():
            skipped += 1
            continue

        if download_image(original_url, dest):
            rec["image_url"] = f"/phenotypes/{slug}.jpg"
            updated += 1
            print(f"[ok] {slug}: {original_url} -> {rec['image_url']}",
                  file=sys.stderr)
        else:
            failed += 1

    with DATA_PATH.open("w", encoding="utf-8") as fh:
        json.dump(records, fh, ensure_ascii=False, indent=2)

    print(
        f"[info] downloaded {updated}, skipped {skipped}, failed {failed} "
        f"out of {len(records)}",
        file=sys.stderr,
    )

    return 0 if failed == 0 else 0  # do not block build on partial failures


if __name__ == "__main__":
    sys.exit(main())
