#!/usr/bin/env python3
# Render all PCI OG images from the parameterized template via headless Chrome.
# Keeps existing filenames so HTML references don't change.
import json, os, subprocess, sys, urllib.parse, pathlib

OG_DIR = pathlib.Path(__file__).resolve().parent          # .../images/og
ROOT   = OG_DIR.parent.parent                             # repo root
TEMPLATE = OG_DIR / "_og-template.html"
PROJ_PHOTO = "file:///" + str((ROOT / "images" / "projects")).replace("\\", "/")
CHROME = r"C:/Program Files/Google/Chrome/Application/chrome.exe"

SUB_PROJECT = "Custom Cabinetry · Premier Cabinets Innovations"

# --- 5 main pages (curated headlines, matched to legacy OG art) ---
PAGES = [
  dict(out="og-home.png",     photo="kitchen-matte-black-walnut.jpg",
       eyebrow="Citrus Heights · Since 1985",
       head="Custom Cabinetry", accent="& Millwork",
       subline="Sacramento · Bay Area · Northern California"),
  dict(out="og-about.png",    photo="paneled-game-room.jpg",
       eyebrow="Forty-One Years of Craft",
       head="About the", accent="Workshop",
       subline="Drawn · Built · Installed · One Shop"),
  dict(out="og-contact.png",  photo="paneled-game-room.jpg",
       eyebrow="Citrus Heights Workshop · (916) 550-2228",
       head="Start Your", accent="Project",
       subline="Felix Replies Within One Business Day"),
  dict(out="og-services.png", photo="kitchen-gothic-arch-marble.jpg",
       eyebrow="What We Build",
       head="Kitchens · Baths ·", accent="Millwork",
       subline="Libraries · Built-Ins · Paneled Rooms"),
  dict(out="og-projects.png", photo="kitchen-marble-chandelier.jpg",
       eyebrow="Custom Cabinetry · 1985 to Today",
       head="Our", accent="Work",
       subline="Kitchens · Baths · Libraries · Built-Ins",
       hsize="72"),
]

def split_accent(title):
    """Last word -> gold accent, rest -> head (matches legacy project OG style)."""
    words = title.split()
    if len(words) == 1:
        return "", words[0]
    return " ".join(words[:-1]), words[-1]

# --- 10 project OGs from projects-index.json ---
proj = json.loads((ROOT / "projects-index.json").read_text(encoding="utf-8"))
JOBS = list(PAGES)
for p in proj:
    head, accent = split_accent(p["title"])
    # headline size: scale down for long titles
    n = len(p["title"])
    hsize = "58" if n > 46 else ("62" if n > 34 else "66")
    JOBS.append(dict(
        out=f"og-project-{p['slug']}.png",
        photo=p["photo"],
        eyebrow=f"{p['category']} · {p['location']}",
        head=head, accent=accent,
        subline=SUB_PROJECT,
        hsize=hsize,
    ))

def build_url(job):
    photo_url = f"{PROJ_PHOTO}/{job['photo']}"
    q = {
        "photo":   photo_url,
        "eyebrow": job["eyebrow"],
        "head":    job["head"],
        "accent":  job["accent"],
        "subline": job["subline"],
    }
    if job.get("hsize"): q["hsize"] = job["hsize"]
    if job.get("logo"):  q["logo"]  = job["logo"]
    qs = "&".join(f"{k}={urllib.parse.quote(str(v), safe='')}" for k, v in q.items())
    return "file:///" + str(TEMPLATE).replace("\\", "/") + "?" + qs

def render(job):
    out = OG_DIR / job["out"]
    url = build_url(job)
    cmd = [CHROME, "--headless=new", "--disable-gpu", "--no-sandbox",
           "--window-size=1200,630",
           f"--screenshot={out}",
           "--hide-scrollbars", "--force-device-scale-factor=1",
           "--virtual-time-budget=6000", url]
    r = subprocess.run(cmd, capture_output=True, text=True)
    ok = out.exists()
    print(("OK  " if ok else "FAIL") + f" {job['out']}")
    if not ok:
        print(r.stderr[-500:])
    return ok

if __name__ == "__main__":
    only = sys.argv[1] if len(sys.argv) > 1 else None
    n = 0
    for job in JOBS:
        if only and only not in job["out"]:
            continue
        render(job); n += 1
    print(f"--- rendered {n} ---")
