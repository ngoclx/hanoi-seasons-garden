# LUMIÈRE Hanoi Seasons Garden — Sales Landing Page

## Project Overview

Static marketing/sales website for **LUMIÈRE Hanoi Seasons Garden** (Masterise Homes), F1 sales-partner site operated by Phòng Kinh Doanh.

- **Live URL**: https://www.pkdhanoiseasonsgarden.com
- **Hosting**: Vercel (static, no build step)
- **Language**: Vietnamese (lang="vi")

## Tech Stack

- HTML5 static pages — no framework, no bundler for app code
- Tailwind CSS compiled via CLI to `/css/tw.min.css` (one-time build; output committed)
- Vanilla JS, no bundler
- SVN-Optima (display) self-hosted via @font-face; Inter (body) via Google Fonts; DFVN-Abygaer (decorative accent) self-hosted

### Tailwind build

The repo has `package.json`, `tailwind.config.js`, and `src/tailwind.css` for compiling Tailwind. The CDN Play script was removed (PageSpeed flagged it as render-blocking + heavy JIT runtime).

- `npm install` once after clone
- `npm run build:css` — minified one-shot build → `/css/tw.min.css` (~46 KB minified, ~10 KB gzipped)
- `npm run watch:css` — rebuilds on file changes during development

**You must run `npm run build:css` after any HTML/JS change that adds new Tailwind utility classes**, otherwise the new class will silently render unstyled. `tailwind.config.js` scans `./*.html`, `./blog/**/*.html`, `./js/**/*.js`, `./blog/**/*.js`. The `css/tw.min.css` artifact is committed (we deploy static — Vercel doesn't run the build).

Custom theme tokens (colors + fontFamily) live in `tailwind.config.js`. Do not re-introduce inline `tailwind.config` `<script>` blocks in HTML; they have no effect without the CDN script.

## File naming

**ASCII-only.** No Vietnamese diacritics in any committed file path. Kebab-case slugs. When importing material with non-ASCII names from `/materials/`, always rename on the way into the production tree.

## Structure

```
/
├── index.html              # 11-section one-page sales site
├── toa-l1.html             # Tower L1 detail
├── toa-l2.html             # Tower L2 detail
├── sitemap.xml
├── robots.txt
├── llms.txt
├── favicon.ico
├── fonts/                  # SVN-Optima + Abygaer
├── css/fonts.css           # @font-face declarations
├── js/main.js              # header, smooth scroll, amenity tabs, latest posts, lead form
├── js/tower.js             # floorplan tabs + lightbox (tower pages only)
├── images/                 # optimized renders + floorplans + logos
├── docs/                   # gated PDF downloads, design specs, plans
└── blog/                   # index.html, posts.json, blog-shared.js, posts
```

## Design tokens

Tailwind config (inline per page):

| Token              | Hex       | Usage                                |
|--------------------|-----------|--------------------------------------|
| `hsg-slate`        | `#30413B` | Body text, dark surfaces             |
| `hsg-slate-dark`   | `#1F2A26` | Hover, footer                        |
| `lum-green`        | `#455F39` | Primary CTA, accents (Tom Thumb)     |
| `lum-green-dark`   | `#36492C` | CTA hover                            |
| `sage`             | `#B7BA9F` | Eyebrows, secondary text on dark     |
| `sage-light`       | `#D6D8C5` | Soft surfaces                        |
| `sand`             | `#B89B7A` | Premium CTAs                         |
| `sand-dark`        | `#9E835F` | Sand hover                           |
| `ivory`            | `#F1EFE8` | Page bg                              |
| `warm-gray`        | `#E8E6DE` | Card backgrounds                     |
| `zalo`             | `#0068FF` | Zalo CTA                             |

Fonts:
- `font-display` — SVN-Optima → Cormorant Garamond → Georgia → serif
- `font-sans` — Inter → system-ui → sans-serif
- `font-accent` — DFVN-Abygaer → cursive (decorative, sparing)

## Blog System

Posts are static HTML with metadata in `blog/posts.json`.

### Adding a new post

1. Create `blog/your-slug.html` (copy template structure from an existing post)
2. Add entry to `blog/posts.json` with: `slug`, `title`, `excerpt`, `date` (YYYY-MM-DD, **must not be in the future**), `category`, `tags[]`, `image` (filename in `/images/`)
3. Add URL to `sitemap.xml`
4. Add the post to `llms.txt` under **Bài viết nổi bật**
5. Featured image **required**:
   - Specific `og:image` meta tag (not a generic default)
   - `<figure>` block immediately before the `.prose` div, with descriptive Vietnamese `alt`
6. Article schema.org JSON-LD block in `<head>`

### Categories

`Tổng quan`, `Phân tích`, `Bảng giá`, `Chính sách`, `Tiến độ`, `Pháp lý`, `Tiện ích`, `Sản phẩm` — full Vietnamese with diacritics, shown verbatim on card eyebrows and breadcrumbs.

## Content sources

- **PRIMARY**: https://masterisehomesland.vn/lumiere-hanoi-seasons-garden/
- Cross-check with masterisehomes.com when available

## Phone & contact

- Hotline: **0564.928.999** (tel:0564928999)
- Zalo: zalo.me/0564928999
- Phone validation regex (lead form): `/^0\d{9}$/`

## Image pipeline

Originals live in `/materials/` (gitignored). Optimized outputs live in `/images/`:
- Exteriors: max 1920w, JPEG q=82
- Interiors: max 1600w, JPEG q=82
- Floorplans: extracted from PDFs at 200 DPI, then resized to max 1600w q=85
- Logos: copy from materials, recolor when needed

PDF gated downloads (`docs/floorplans-l*-the-bloom.pdf`) committed at ~10–15MB each.

## SEO

- Open Graph (vi_VN locale) on every page
- Canonical URLs
- Schema.org: `RealEstateAgent` + `RealEstateListing` on index; `Apartment` per tower; `Article` per blog post
- Sitemap: `sitemap.xml`
- llms.txt: kept up-to-date when blog/pricing/contact changes
- `<link rel="llms">` in every page's `<head>`

## When to update `llms.txt`

| Event | What to update |
|-------|---------------|
| New blog post | Add to **Bài viết nổi bật** |
| Post removed/renamed | Remove or update line |
| Price change | Update **Sản phẩm** section |
| Hotline change | Update **Liên hệ** section |
| New top-level page | Add to **Trang chủ & Các trang chính** |

## Pre-launch checklist

- [ ] Replace `https://formspree.io/f/REPLACE_ME` in `js/main.js`
- [ ] Confirm bảo lãnh ngân hàng list with Masterise → update §Pháp lý of `index.html` and `llms.txt`
- [ ] Confirm Bảng giá table — adjust 11-row table in `index.html#bang-gia` if Masterise publishes corrected size ranges or prices
- [ ] DNS: point `pkdhanoiseasonsgarden.com` apex + `www` to Vercel
- [ ] (Optional) Add GTM container — paste snippets per langvan pattern into every page's `<head>` and `<body>` start

## Deployment

Push to `main` → Vercel auto-deploys. No build command on the Vercel side — `css/tw.min.css` is committed. If you added classes locally, run `npm run build:css` and commit the regenerated file before pushing.

## JavaScript Conventions

- Vanilla JS, no frameworks
- Use safe DOM (`createElement`, `textContent`, `appendChild`, `replaceChildren()`) — never `innerHTML` for user-supplied or remote content
- Phone regex: `/^0\d{9}$/`
- Lead form via `fetch` with `FormData`
- Smooth scroll for anchor navigation
- Honeypot `_gotcha` field on lead forms
