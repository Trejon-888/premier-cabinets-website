# Premier Cabinets Innovations — Website

Static marketing site for Premier Cabinets Innovations (Citrus Heights, CA · since 1985).

**Stack:** Pure HTML + CSS + vanilla JS. No build step. No npm install. Just open the files.

**Design reference:** [somervilles.co.uk](https://somervilles.co.uk/) — restrained editorial luxury, photography-led.

---

## What's in this folder

```
site/
  index.html          ← homepage
  projects.html       ← full project gallery with filter
  services.html       ← five service-line breakdowns
  about.html          ← Felix's story, workshop, service area
  contact.html        ← contact card, intake form, embedded map
  styles.css          ← all styles (single file)
  scripts.js          ← all JS behaviors (single file)
  sitemap.xml         ← XML sitemap for search engines
  robots.txt          ← allow-all crawl directive
  llms.txt            ← machine-readable summary for AI search
  favicon.ico         ← favicon
  images/
    logo-primary.png      ← full wordmark
    logo-reverse.png      ← wordmark on dark
    logo-monogram.png     ← monogram for header / footer
    favicon.png           ← favicon source
    projects/             ← 16 portfolio photos (kebab-case names)
  README.md           ← this file
```

---

## Preview locally

From this `site/` folder:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000

Any static server works (`npx serve`, `php -S localhost:8000`, etc).

---

## Deploy to GitHub Pages

Suggested repo name: `premier-cabinets-website`

1. **Initialize the repo locally**
   ```bash
   cd /Users/trejon/.openclaw/workspace-quique/departments/business-ops/clients/premiere-cabinets-innovation/website/site
   git init
   git add .
   git commit -m "Initial site"
   ```

2. **Create the GitHub repo** (via web or `gh`)
   ```bash
   gh repo create premier-cabinets-website --public --source=. --remote=origin --push
   ```

3. **Enable Pages**
   - Repo Settings → Pages → Source: `Deploy from a branch`
   - Branch: `main` · Folder: `/ (root)`
   - Save

4. **Wait ~60 seconds.** The site will publish to:
   ```
   https://<your-username>.github.io/premier-cabinets-website/
   ```

   Send that URL to Felix for review.

### Important note about base URLs

This site uses **relative paths** everywhere (`href="projects.html"`, `src="images/..."`), so it works both at a custom domain root and at a `github.io/repo-name/` sub-path with no config changes.

The only absolute URLs are in:
- `<link rel="canonical">` tags
- Open Graph `og:url` and `og:image` tags
- JSON-LD schema (`url`, `image`, `logo`)
- `sitemap.xml`
- `llms.txt`

These all point at `https://premiercabinetsinnovations.com/`. They're harmless on the GitHub Pages preview (canonical just tells search engines about the eventual production URL) but should be left as-is so search engines properly canonicalize to the real domain once it launches.

---

## Later: add the custom domain

When `premiercabinetsinnovations.com` is purchased:

1. **Repo Settings → Pages → Custom domain** → enter `premiercabinetsinnovations.com`
2. GitHub will generate a `CNAME` file in the repo
3. **At your DNS provider** (Cloudflare / Namecheap / Google Domains):
   - Add 4 A records on the apex domain pointing to GitHub Pages IPs:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - Add a `CNAME` record for `www` pointing to `<your-username>.github.io`
4. Wait for DNS propagation (5 min to 1 hour)
5. Enable **Enforce HTTPS** in the Pages settings
6. Done. Site is live at https://premiercabinetsinnovations.com

---

## Editing content

- **Copy changes** → edit the HTML files directly. Each page is self-contained.
- **Photo swaps** → drop new JPGs into `images/projects/` with kebab-case names, then update the `<img src>` references in the relevant HTML files.
- **Adding a service line** → duplicate one of the `.service-detail` sections in `services.html` and tweak.
- **Styling** → all in `styles.css`. The design system is driven by CSS custom properties at the top of the file (`--ink`, `--paper`, `--walnut`, etc).
- **Animation** → handled by `scripts.js` via IntersectionObserver for reveals + GSAP (CDN-loaded) for hero parallax.

---

## What's intentionally missing (Month 2-3 follow-ups)

- **Form backend** — the contact form currently opens the user's email client with the brief pre-filled via `mailto:`. Direct intake (GHL, Formspree, Netlify Forms, etc) wires in once a backend is chosen.
- **Founder portrait** — placeholder. Add when Felix sits for a headshot.
- **Workshop interior shots** — currently using project photos. Half-day workshop shoot will fill this gap.
- **Spanish version** — Month 2-3, given Citrus Heights demographics.
- **Project metadata (city / year)** — captions currently carry "Year TBC" placeholders. Felix to annotate.
- **Real reviews / testimonials section** — Lauren Schmidt, Malahat Tavassoli, Dustin Moore exist on the old site. Add once Felix confirms permission.
- **Multi-city landing pages** — `/san-francisco/`, `/oakland/`, etc. for local SEO. Month 2.
- **GA4 / Google Tag** — add once domain is live and a GA4 property is created.

---

## Browser support

Tested mental model: latest Chrome, Safari, Firefox, Edge. Mobile-first responsive at 375px, 768px, 1440px. Graceful degradation: if GSAP fails to load, the hero just doesn't parallax. If IntersectionObserver is missing, all `.reveal` elements show immediately.
