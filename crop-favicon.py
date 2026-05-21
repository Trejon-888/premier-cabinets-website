#!/usr/bin/env python3
"""Crop PCI monogram from full lockup and render favicons at multiple sizes."""

from PIL import Image
from pathlib import Path

SRC = Path("/Users/trejon/.openclaw/workspace-quique/departments/business-ops/clients/premiere-cabinets-innovation/brand/drive-sync/logos/pci-no-bg.png")
OUT_DIR = Path(__file__).parent / "images" / "brand"
OUT_DIR.mkdir(parents=True, exist_ok=True)


def find_monogram_bbox(img: Image.Image) -> tuple[int, int, int, int]:
    """Find the monogram bbox by alpha-scanning the upper half of the canvas.

    The 'PREMIER' wordmark begins roughly halfway down. We restrict the scan
    to roughly the top 55% of the image to capture only the gold P + black C.
    """
    w, h = img.size
    alpha = img.split()[-1]
    # Restrict scan to top ~55% of image (monogram region)
    top_cap = int(h * 0.55)
    cropped_scan = alpha.crop((0, 0, w, top_cap))

    # Find non-transparent bbox within that region
    bbox = cropped_scan.getbbox()
    if bbox is None:
        return (0, 0, w, top_cap)
    return bbox  # (left, top, right, bottom)


def square_canvas(monogram: Image.Image, padding_pct: float = 0.10) -> Image.Image:
    """Place monogram on a square transparent canvas with padding."""
    w, h = monogram.size
    side = max(w, h)
    # Add padding
    total = int(side * (1 + 2 * padding_pct))
    canvas = Image.new("RGBA", (total, total), (0, 0, 0, 0))
    off_x = (total - w) // 2
    off_y = (total - h) // 2
    canvas.paste(monogram, (off_x, off_y), monogram)
    return canvas


def main() -> None:
    print(f"Opening source: {SRC}")
    img = Image.open(SRC).convert("RGBA")
    print(f"Source size: {img.size}")

    bbox = find_monogram_bbox(img)
    print(f"Monogram bbox: {bbox}")

    monogram = img.crop(bbox)
    print(f"Cropped monogram size: {monogram.size}")

    square = square_canvas(monogram, padding_pct=0.10)
    print(f"Square canvas size: {square.size}")

    sizes = [32, 64, 128, 256, 512]
    rendered: dict[int, Image.Image] = {}
    for s in sizes:
        resized = square.resize((s, s), Image.LANCZOS)
        rendered[s] = resized
        out_path = OUT_DIR / f"favicon-{s}.png"
        resized.save(out_path, "PNG", optimize=True)
        print(f"Wrote {out_path} ({s}x{s})")

    # apple-touch-icon (180x180 standard, render from 512)
    apple = square.resize((180, 180), Image.LANCZOS)
    apple_path = OUT_DIR / "apple-touch-icon.png"
    apple.save(apple_path, "PNG", optimize=True)
    print(f"Wrote {apple_path} (180x180)")

    # Multi-res favicon.ico (16, 32, 48 are standard for ICO)
    # PIL can save .ico with multiple sizes from the largest source.
    ico_path = OUT_DIR / "favicon.ico"
    # Generate from 256 source, request standard ICO sizes
    rendered[256].save(
        ico_path,
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)],
    )
    print(f"Wrote {ico_path} (multi-res ICO)")


if __name__ == "__main__":
    main()
