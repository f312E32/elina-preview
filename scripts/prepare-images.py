"""Deterministic crops of approved source photos; no face retouching."""

from pathlib import Path
from math import ceil
from PIL import Image, ImageOps, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SOURCES = ROOT / "assets" / "source"
REVIEWS = ROOT / "public" / "reviews"
ELINA = ROOT / "public" / "images" / "elina"

# Each crop isolates the named client from the specific approved Instagram post.
CROPS = {
    "maxim": None,
    "dmitry": (325, 390, 605, 670),
    "anna": (210, 55, 1060, 905),
    "margarita": (680, 440, 1430, 1190),
    "yuri": (70, 520, 690, 1140),
    "kristina": (860, 410, 1430, 980),
    "inna": (700, 330, 1300, 930),
}

REVIEWS.mkdir(parents=True, exist_ok=True)
ELINA.mkdir(parents=True, exist_ok=True)

tiles = []
for name, box in CROPS.items():
    with Image.open(SOURCES / "reviews" / f"{name}.jpg") as source:
        image = ImageOps.exif_transpose(source).convert("RGB")
        image = image.crop(box) if box else image
        image = ImageOps.fit(image, (640, 640), method=Image.Resampling.LANCZOS)
        image.save(REVIEWS / f"{name}.webp", "WEBP", quality=84, method=6)
        tiles.append((name, image.copy()))

for name, source_name in (
    ("cover", "Изображение ChatGPT 1 окт. 2026 г., 05_17_44.png"),
    ("about", "Изображение ChatGPT 1 окт. 2026 г., 05_17_31.png"),
):
    with Image.open(SOURCES / "elina" / source_name) as source:
        image = ImageOps.exif_transpose(source).convert("RGB")
        if max(image.size) > 1600:
            image.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
        image.save(ELINA / f"{name}.webp", "WEBP", quality=86, method=6)

sheet = Image.new("RGB", (960, ceil(len(tiles) / 3) * 355), "#EFE2BA")
draw = ImageDraw.Draw(sheet)
for index, (name, image) in enumerate(tiles):
    x = (index % 3) * 320
    y = (index // 3) * 355
    sheet.paste(image.resize((300, 300), Image.Resampling.LANCZOS), (x + 10, y + 10))
    draw.text((x + 12, y + 318), name, fill="#172033")
sheet.save(ROOT / "review" / "avatar-crop-check.png")

for asset in sorted([*REVIEWS.glob("*.webp"), *ELINA.glob("*.webp")]):
    print(f"{asset.relative_to(ROOT)} {asset.stat().st_size:,} bytes")
