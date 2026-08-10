#!/usr/bin/env python3
"""Generate local placeholder images for the Countries game mode.

Reads ``data/countries.json``, creates a 400x400 JPG for each country in
``public/countries/<slug>.jpg`` and rewrites ``image_url`` to the local path.

This removes the dependency on placehold.co, which can be blocked or slow
in some networks.

Usage:
    python scripts/generate_country_placeholders.py
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_PATH = BASE_DIR / "data" / "countries.json"
OUTPUT_DIR = BASE_DIR / "public" / "countries"
IMAGE_SIZE = (400, 400)

REGION_BG = {
    "Europe": "#dbeafe",
    "South Asia": "#fef3c7",
    "East Asia": "#fce7f3",
    "Sub-Saharan Africa": "#d1fae5",
    "North Africa": "#f3e8ff",
    "Middle East": "#ffedd5",
    "North America": "#e0e7ff",
    "South America": "#ccfbf1",
    "Southeast Asia": "#fecaca",
    "Oceania": "#fef9c3",
    "Central Asia": "#fae8ff",
    "Arctic": "#e5e7eb",
    "Australia": "#fef9c3",
    "Americas": "#ccfbf1",
}
TEXT_COLOR = "#374151"
DEFAULT_BG = "#f3f4f6"


def get_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    """Try to load a TrueType font, fall back to default bitmap font."""
    candidates = [
        "arial.ttf",
        "Arial.ttf",
        "DejaVuSans.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    ]
    for cand in candidates:
        try:
            return ImageFont.truetype(cand, size)
        except OSError:
            continue
    return ImageFont.load_default()


def wrap_text(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont,
              max_width: int) -> str:
    """Insert line breaks so text fits within max_width."""
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        test = f"{current} {word}".strip()
        bbox = draw.textbbox((0, 0), test, font=font)
        if bbox[2] - bbox[0] <= max_width:
            current = test
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return "\n".join(lines)


def generate_image(name: str, region: str, dest: Path) -> None:
    """Render a centered-text placeholder JPG."""
    img = Image.new("RGB", IMAGE_SIZE, REGION_BG.get(region, DEFAULT_BG))
    draw = ImageDraw.Draw(img)

    title_font = get_font(42)
    subtitle_font = get_font(28)

    title = wrap_text(draw, name, title_font, IMAGE_SIZE[0] - 40)
    subtitle = "Average Face"

    # Measure combined block height
    title_bbox = draw.multiline_textbbox((0, 0), title, font=title_font, spacing=8)
    subtitle_bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
    title_h = title_bbox[3] - title_bbox[1]
    subtitle_h = subtitle_bbox[3] - subtitle_bbox[1]
    gap = 16
    total_h = title_h + gap + subtitle_h

    y = (IMAGE_SIZE[1] - total_h) // 2

    draw.multiline_text(
        (IMAGE_SIZE[0] // 2, y),
        title,
        font=title_font,
        fill=TEXT_COLOR,
        anchor="mm",
        spacing=8,
        align="center",
    )
    y += title_h + gap + subtitle_h // 2
    draw.text(
        (IMAGE_SIZE[0] // 2, y),
        subtitle,
        font=subtitle_font,
        fill=TEXT_COLOR,
        anchor="mm",
    )

    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest, "JPEG", quality=90)


def main() -> int:
    if not DATA_PATH.exists():
        print(f"[error] {DATA_PATH} not found", file=sys.stderr)
        return 1

    with DATA_PATH.open("r", encoding="utf-8") as fh:
        records: list[dict] = json.load(fh)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    updated = 0
    for rec in records:
        slug = rec.get("slug", "")
        name = rec.get("name", "")
        region = rec.get("region", "")
        if not slug or not name:
            continue
        dest = OUTPUT_DIR / f"{slug}.jpg"
        generate_image(name, region, dest)
        rec["image_url"] = f"/countries/{slug}.jpg"
        updated += 1
        print(f"[ok] {slug} -> {rec['image_url']}", file=sys.stderr)

    with DATA_PATH.open("w", encoding="utf-8") as fh:
        json.dump(records, fh, ensure_ascii=False, indent=2)

    print(f"[info] generated {updated} country placeholders", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
