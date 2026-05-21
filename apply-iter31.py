#!/usr/bin/env python3
"""Apply iter 31 HTML changes:
1. Favicon meta tag refresh (7 link tags, cache-busted)
2. noindex meta on 3 utility pages
3. hreflang tags on all 19 pages (with per-page path)
4. Cache bust v=30 -> v=31 (HTML/CSS/JS refs)
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

SITE = Path(__file__).parent
BASE_URL = "https://premiercabinetsinnovations.com"

# Map: relative file path -> URL path (with trailing slash)
PAGE_PATHS = {
    "index.html": "/",
    "about/index.html": "/about/",
    "brand-bible/index.html": "/brand-bible/",
    "business-cards/index.html": "/business-cards/",
    "contact/index.html": "/contact/",
    "projects/index.html": "/projects/",
    "projects/arched-glass-display-marble-island/index.html": "/projects/arched-glass-display-marble-island/",
    "projects/cream-shaker-pantry/index.html": "/projects/cream-shaker-pantry/",
    "projects/live-edge-walnut-shelves/index.html": "/projects/live-edge-walnut-shelves/",
    "projects/marble-chandelier-kitchen/index.html": "/projects/marble-chandelier-kitchen/",
    "projects/matte-black-walnut-kitchen/index.html": "/projects/matte-black-walnut-kitchen/",
    "projects/painted-shaker-waterfall-island/index.html": "/projects/painted-shaker-waterfall-island/",
    "projects/regency-dual-vanity-fluted-columns/index.html": "/projects/regency-dual-vanity-fluted-columns/",
    "projects/walnut-library-paneling/index.html": "/projects/walnut-library-paneling/",
    "projects/white-inset-fridge-wall/index.html": "/projects/white-inset-fridge-wall/",
    "projects/white-shaker-vanity-wood-tile/index.html": "/projects/white-shaker-vanity-wood-tile/",
    "services/index.html": "/services/",
    "thank-you/index.html": "/thank-you/",
}

NOINDEX_PAGES = {
    "brand-bible/index.html",
    "business-cards/index.html",
    "thank-you/index.html",
}

FAVICON_BLOCK = """  <link rel="icon" type="image/png" sizes="32x32" href="/images/brand/favicon-32.png?v=31" />
  <link rel="icon" type="image/png" sizes="64x64" href="/images/brand/favicon-64.png?v=31" />
  <link rel="icon" type="image/png" sizes="128x128" href="/images/brand/favicon-128.png?v=31" />
  <link rel="icon" type="image/png" sizes="256x256" href="/images/brand/favicon-256.png?v=31" />
  <link rel="icon" type="image/png" sizes="512x512" href="/images/brand/favicon-512.png?v=31" />
  <link rel="apple-touch-icon" sizes="180x180" href="/images/brand/favicon-512.png?v=31" />
  <link rel="shortcut icon" type="image/x-icon" href="/images/brand/favicon.ico?v=31" />"""


def hreflang_block(url_path: str) -> str:
    full = f"{BASE_URL}{url_path}"
    return (
        f'  <link rel="alternate" hreflang="en" href="{full}" />\n'
        f'  <link rel="alternate" hreflang="es" href="{full}?lang=es" />\n'
        f'  <link rel="alternate" hreflang="x-default" href="{full}" />'
    )


# Regex to match the existing favicon block:
#   line for 32x32 favicon, 64x64 favicon, and apple-touch-icon (3 lines)
# Tolerates both ` />` and `>` style closing tags.
FAVICON_PATTERN = re.compile(
    r"  <link rel=\"icon\" type=\"image/png\" sizes=\"32x32\" href=\"[^\"]+\"\s*/?>\n"
    r"  <link rel=\"icon\" type=\"image/png\" sizes=\"64x64\" href=\"[^\"]+\"\s*/?>\n"
    r"  <link rel=\"apple-touch-icon\" href=\"[^\"]+\"\s*/?>"
)


def process_file(rel_path: str) -> dict:
    path = SITE / rel_path
    text = path.read_text(encoding="utf-8")
    original = text
    report: dict = {"file": rel_path}

    # Step 1: Replace favicon block
    new_text, n = FAVICON_PATTERN.subn(FAVICON_BLOCK, text)
    report["favicon_replaced"] = n
    if n != 1:
        report["WARN_favicon"] = f"expected 1 replacement, got {n}"
    text = new_text

    # Step 2: Insert hreflang block right after the favicon block
    if FAVICON_BLOCK in text:
        hreflang = hreflang_block(PAGE_PATHS[rel_path])
        # Only insert if not already present
        if 'rel="alternate" hreflang=' not in text:
            text = text.replace(
                FAVICON_BLOCK, FAVICON_BLOCK + "\n" + hreflang, 1
            )
            report["hreflang_added"] = True
        else:
            report["hreflang_added"] = "already present"
    else:
        report["hreflang_added"] = False
        report["WARN_hreflang"] = "favicon block not found, skipping hreflang insert"

    # Step 3: noindex on utility pages
    if rel_path in NOINDEX_PAGES:
        noindex_meta = '  <meta name="robots" content="noindex, follow" />'
        if 'name="robots"' in text:
            # Replace existing robots tag
            text = re.sub(
                r'  <meta name="robots" content="[^"]*" />',
                noindex_meta,
                text,
                count=1,
            )
            report["noindex"] = "replaced existing robots"
        else:
            # Insert before the favicon block
            text = text.replace(
                FAVICON_BLOCK, noindex_meta + "\n" + FAVICON_BLOCK, 1
            )
            report["noindex"] = "inserted"

    # Step 4: Cache bust v=30 -> v=31
    bust_count = text.count("?v=30") + text.count("&v=30")
    text = text.replace("?v=30", "?v=31").replace("&v=30", "&v=31")
    report["cache_bust_v30_to_v31"] = bust_count

    if text != original:
        path.write_text(text, encoding="utf-8")
        report["modified"] = True
    else:
        report["modified"] = False

    return report


def main() -> int:
    print("=== iter 31 HTML processor ===\n")
    all_reports = []
    for rel_path in PAGE_PATHS:
        report = process_file(rel_path)
        all_reports.append(report)
        warns = [v for k, v in report.items() if k.startswith("WARN")]
        flag = " ⚠ " if warns else "   "
        print(
            f"{flag}{report['file']:60s}  fav={report.get('favicon_replaced')}  "
            f"hreflang={report.get('hreflang_added')}  "
            f"noindex={report.get('noindex', '-')}  "
            f"bust={report.get('cache_bust_v30_to_v31')}"
        )
        for w in warns:
            print(f"     WARN: {w}")

    # Also bust v=30 in non-HTML files we still ship (none other than HTML use v=30 in src,
    # but check anyway):
    print("\n=== checking for stragglers ===")
    import subprocess
    result = subprocess.run(
        ["grep", "-rn", "v=30", str(SITE), "--include=*.html",
         "--include=*.css", "--include=*.js", "--include=*.json",
         "--exclude-dir=.git", "--exclude-dir=_dev-screenshots"],
        capture_output=True, text=True,
    )
    if result.stdout.strip():
        print("Remaining v=30 references:")
        print(result.stdout)
    else:
        print("No remaining v=30 references in HTML/CSS/JS/JSON.")

    return 0


if __name__ == "__main__":
    sys.exit(main())
