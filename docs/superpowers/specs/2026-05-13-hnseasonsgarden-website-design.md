# Design Spec — pkdhanoiseasonsgarden.com

**Date:** 2026-05-13
**Project:** Sales landing site for **LUMIÈRE Hanoi Seasons Garden** (Masterise Homes), positioned from a Phòng Kinh Doanh (F1 sales partner) standpoint.
**Live URL (target):** https://www.pkdhanoiseasonsgarden.com
**Working directory:** `/Volumes/na2024/Passion/hnseasonsgarden/`
**Reference site:** `/Volumes/na2024/Passion/langvan/` (pkdvinhomeshaivanbay.com) — same author, same stack, same playbook.

---

## 1. Project facts

- **Project name:** LUMIÈRE Hanoi Seasons Garden (HSG)
- **Developer:** Masterise Homes (Masterise Group)
- **Location:** 233, 233B, 235 Nguyễn Trãi, Hà Nội — historic Cao–Xà–Lá industrial site
- **Scale:** 82,820 m² (~8.28 ha) · 10 towers · 36–46 floors · 3 basement levels · 28.8% building density
- **Phase 1 (sellable now):** *The Bloom* — Towers **L1** and **L2**
- **Unit types in The Bloom:** Studio, 1BR, 1BR+1, 2BR, 2BR+1, 3BR, 3BR+1, 4BR, Duplex, Penthouse, Penthouse Duplex
- **Pricing (from official survey event):**
  - Range: 9.x – 48.x tỷ VND per unit
  - Average: 128–174 triệu/m²
  - Interior view: 136–174 triệu/m²
  - Street view: 128–161 triệu/m²
- **Payment plans:**
  - Early payment: discount up to **7%**, balance due 30 days post-contract
  - Standard installment: **12 đợt** over ~3 years from contract
  - Bank loan **70%**: **0%** interest until handover (Q2/2029), 7.5%/year after, 24-month principal deferment
- **Management fee waiver:** 24 months for new buyers · 48 months for Masterise resident buyers · +12 months early-bird
- **Early-bird:** additional 1% discount
- **Legal:** Vietnamese buyers — long-term ownership (Sổ đỏ); foreigners — 50-year leasehold
- **Schedule:** HĐMB ~10/2026 · handover **Q2/2029**
- **Connectivity:** Cát Linh–Hà Đông metro (3 min đi bộ), Ngã Tư Sở (500m), Royal City adjacent, Vành đai 2.5 & 3
- **Sales hotline (PKD):** **0564.928.999** · Zalo `zalo.me/0564928999`

## 2. Scope decisions (locked)

| Decision | Choice |
|---|---|
| Site structure | One-page `index.html` + dedicated `toa-l1.html` and `toa-l2.html` + `blog/` |
| Phase positioning | Bloom-detailed; future towers shown as "Sắp ra mắt" teaser |
| Approach | **B — Restructured for high-rise condo** (11 sections re-cut from langvan to fit the product) |
| Language | Vietnamese only (VI). EN deferred to a future phase; copy written so a `/en/` mirror can be added without restructure. |
| Typography | **Self-host SVN-Optima** (`.otf`) for headings + Inter (Google Fonts) for body |
| Brand palette | From official Masterise/HSG brand kit (Dark Slate, Tom Thumb, Dry Sage, Warm Sand, Ivory) |
| Analytics | **No GTM at launch** — added in a later pass |
| Filenames | **ASCII-only**, kebab-case. No Vietnamese diacritics in any committed path. |
| Floor plans | Convert key PDF pages to JPGs for in-page galleries + gated PDF download |
| Initial blog | 4 starter posts (Tổng quan · Vị trí · Bảng giá · Chính sách) |
| Hosting | Vercel, auto-deploy from `main` |
| Lead form | Formspree endpoint (placeholder until user provides) |

## 3. Stack

- HTML5 static, `lang="vi"`
- **Tailwind CSS** via Play CDN, inline `tailwind.config` per page
- **Vanilla JS** — no bundler, no `package.json`
- **SVN-Optima** self-hosted via `@font-face` (headings) + **Inter** via Google Fonts (body) + **DFVN-Abygaer** self-hosted (sparing decorative accent)
- **Vercel** static hosting

## 4. File layout

```
/
├── index.html                        # one-page sales site, 11 sections
├── toa-l1.html                       # L1 tower detail
├── toa-l2.html                       # L2 tower detail
├── sitemap.xml
├── robots.txt
├── llms.txt
├── favicon.ico
├── CLAUDE.md
├── .gitignore                        # materials/, .superpowers/, .vercel/, .DS_Store
├── fonts/
│   ├── SVN-Optima-Regular.otf
│   ├── SVN-Optima-Medium.otf
│   ├── SVN-Optima-DemiBold.otf
│   ├── SVN-Optima-Bold.otf
│   └── DFVN-Abygaer-Regular.otf
├── css/
│   └── fonts.css                     # @font-face declarations
├── js/
│   ├── main.js                       # mobile menu, smooth scroll, lead form, modal
│   └── tower.js                      # tower-page floorplan tabs + image lightbox
├── images/
│   ├── hero-aerial.jpg               # < 1920w, q=82
│   ├── overview-architecture.jpg
│   ├── overview-masterplan.jpg
│   ├── location-map.jpg
│   ├── thebloom-l1-facade.jpg
│   ├── thebloom-l2-facade.jpg
│   ├── amenity-clubhouse-pool.jpg
│   ├── amenity-rooftop-bar.jpg
│   ├── amenity-business-lounge.jpg
│   ├── amenity-library-l1.jpg
│   ├── amenity-library-l2.jpg
│   ├── amenity-event-plaza.jpg
│   ├── amenity-waterfall.jpg
│   ├── amenity-family-pavilion.jpg
│   ├── amenity-kids-garden.jpg
│   ├── amenity-skating.jpg
│   ├── amenity-sand-playground.jpg
│   ├── amenity-canopy.jpg
│   ├── amenity-water-feature-lobby.jpg
│   ├── amenity-entrance-gate.jpg
│   ├── interior-2br-living-1.jpg
│   ├── interior-2br-living-2.jpg
│   ├── interior-2br-master.jpg
│   ├── interior-2br-master-view.jpg
│   ├── interior-4br-living-op1.jpg
│   ├── interior-4br-living-op2.jpg
│   ├── interior-4br-master.jpg
│   ├── interior-4br-guestroom.jpg
│   ├── interior-4br-multifunction.jpg
│   ├── interior-main-lobby-1.jpg     # +2,3 variants
│   ├── interior-elevator-hall.jpg
│   ├── interior-corridor.jpg
│   ├── interior-gym.jpg
│   ├── interior-kids.jpg
│   ├── floorplan-l1-studio.jpg       # extracted from L1 PDF
│   ├── floorplan-l1-1br.jpg
│   ├── floorplan-l1-2br.jpg
│   ├── floorplan-l1-3br.jpg
│   ├── floorplan-l1-4br.jpg
│   ├── floorplan-l2-* (same set)
│   ├── logo-hsg.png                  # rosette mark
│   ├── logo-lumiere-hsg.png          # full lockup
│   ├── logo-lumiere-hsg-white.png    # ivory for dark surfaces
│   └── pattern-rosette.png           # decorative motif, ~8% opacity use
├── docs/
│   ├── floorplans-l1-the-bloom.pdf   # gated download (compressed ~10–15MB)
│   ├── floorplans-l2-the-bloom.pdf
│   └── superpowers/specs/            # this spec lives here
└── blog/
    ├── index.html                    # paginated listing (JS)
    ├── posts.json                    # 4 entries
    ├── blog-shared.js                # modal contact form, related articles
    ├── tong-quan-lumiere-hanoi-seasons-garden.html
    ├── vi-tri-lumiere-hanoi-seasons-garden.html
    ├── bang-gia-lumiere-hanoi-seasons-garden-2026.html
    └── chinh-sach-thanh-toan-lumiere-hsg-2026.html
```

Originals in `/materials/` are NOT committed — `.gitignore` excludes them.

## 5. Design tokens

### 5.1 Color (Tailwind config, inline per page)

```js
colors: {
  'hsg-slate':       '#30413B',  // Dark Slate Grey — body text, dark surfaces
  'hsg-slate-dark':  '#1F2A26',  // hover/footer
  'lum-green':       '#455F39',  // Tom Thumb — primary CTA, accents
  'lum-green-dark':  '#36492C',
  'sage':            '#B7BA9F',  // Dry Sage — secondary surfaces, eyebrows on dark
  'sage-light':      '#D6D8C5',
  'sand':            '#B89B7A',  // Warm Sand — premium CTAs
  'sand-dark':       '#9E835F',
  'ivory':           '#F1EFE8',  // page bg, soft surfaces
  'warm-gray':       '#E8E6DE',  // card backgrounds
  'zalo':            '#0068FF',
}
```

Body text default: `#30413B` on `#FFFFFF` / `#F1EFE8`. Hero is Slate→Green gradient with ivory text. CTAs: **Sand** primary, **Lum-green outline** secondary.

### 5.2 Typography

```js
fontFamily: {
  display: ['SVN-Optima', 'Cormorant Garamond', 'Georgia', 'serif'],
  sans:    ['Inter', 'system-ui', 'sans-serif'],
  accent:  ['DFVN-Abygaer', 'cursive'],   // sparing decorative
}
```

Scale:
- Hero h1 — `clamp(40px, 6vw, 72px)`, font-display, tracking-tight
- Section h2 — `text-3xl lg:text-5xl`, font-display
- Subhead — `text-base lg:text-lg`, font-sans
- Body — `text-base`, font-sans, leading-relaxed
- Eyebrow/label — `text-xs tracking-[0.3em] uppercase`, sand or sage tone

### 5.3 Spacing & rhythm

- Section padding: `py-20 lg:py-28`
- Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Card radius: `rounded-3xl` (feature) / `rounded-2xl` (grid)
- Section divider: 56px sand-tone horizontal rule, centered
- Decorative rosette pattern at 8–12% opacity between major sections, used sparingly

## 6. `index.html` — 11 sections

1. **Hero** — `min-h-[88vh]`. Background = `images/hero-aerial.jpg`. Slate gradient overlay. Centered Lumière HSG logo. Eyebrow "PHÒNG KINH DOANH CHÍNH THỨC". H1 "Hanoi Seasons Garden". Subhead "Phân khu **The Bloom** — Tòa L1 & L2 · 233 Nguyễn Trãi, Hà Nội". CTAs: Sand "NHẬN BẢNG GIÁ" (#lien-he) + outline "0564.928.999".
2. **Vị trí & kết nối** (`#vi-tri`) — Ivory bg. Left: 4 connectivity bullets (Metro Cát Linh–Hà Đông 3 min đi bộ; Ngã Tư Sở 500m; Royal City cận kề; Vành đai 2.5 & 3). Right: `images/location-map.jpg`. Below: 6-tile "Khoảng cách" grid (sân bay Nội Bài, Hồ Gươm, BV Bạch Mai, ĐH Bách Khoa, Times City, Hà Đông). Closing paragraph on the Cao–Xà–Lá heritage revitalization context.
3. **Tổng quan dự án** (`#tong-quan`) — White. Hero image `images/overview-architecture.jpg`. 6 metric tiles: Chủ đầu tư · 82.820 m² · 10 tòa / 36–46 tầng / 3 hầm · 28,8% mật độ · ~5.000 căn · Bàn giao Q2/2029.
4. **Phân khu The Bloom** (`#the-bloom`) — Sage-tinted bg. Two facade cards (L1, L2) with floor count + unit-type pill list + "Xem chi tiết Tòa L*" CTA. Followed by a "Phía sau The Bloom — các phân khu tiếp theo" teaser block; future towers labeled "Sắp ra mắt".
5. **Tiện ích** (`#tien-ich`) — Dark slate bg, ivory text. Tabs: Clubhouse · Ngoài trời · Tích hợp. 3-col render grid per tab; click → lightbox. Distributes ~20 amenity renders.
6. **Bảng giá & loại căn** (`#bang-gia`) — White. 11-row table (Loại căn / Diện tích thông thuỷ / Giá từ tr/m² / Giá căn từ tỷ). Footer disclaimer. "Tải bảng giá chi tiết" Sand CTA → opens lead form modal.
7. **Chính sách thanh toán** (`#chinh-sach`) — Ivory. Three cards: Thanh toán sớm (CK 7%) · Thanh toán đợt (12 đợt/~3 năm) · Vay 70% (0% đến Q2/2029, 7,5% sau ân hạn). Below: phí quản lý 24/48 tháng + early-bird 1% + miễn 12 tháng phí QL.
8. **Pháp lý** (`#phap-ly`) — White, compact. VN — sổ đỏ lâu dài · nước ngoài — 50 năm leasehold · GPMB status · bảo lãnh ngân hàng (placeholder — confirm before launch).
9. **Tiến độ** (`#tien-do`) — Ivory. Horizontal timeline: Booking → HĐMB 10/2026 → Cất nóc → **Bàn giao Q2/2029**. Image `images/overview-masterplan.jpg`.
10. **Tin tức** (`#tin-tuc`) — Sage. Inline JS pulls latest 3 from `blog/posts.json`. "Xem tất cả → /blog/" CTA.
11. **Liên hệ** (`#lien-he`) — Dark slate bg + rosette pattern at 8% opacity. Left = contact info. Right = lead form (Họ tên · SĐT · Nội dung · "nhận bảng giá The Bloom" checkbox).

**Header:** sticky, white shadow on scroll. Lumière HSG lockup (~32px height) + nav (Tổng Quan · Vị Trí · The Bloom · Tiện Ích · Bảng Giá · Chính Sách · Tin Tức · Liên Hệ) + phone pill "0564.928.999".

**Footer:** Slate-dark. Logo (white variant) + PKD disclaimer + sitemap links + © year.

## 7. Tower detail pages (`toa-l1.html`, `toa-l2.html`)

Shared template, tower-specific data:

1. **Sub-hero** (`min-h-[60vh]`) — facade render bg, breadcrumb back to `index.html#the-bloom`.
2. **Tổng quan tòa** — 4 metric tiles: số tầng · số căn dự kiến · số loại căn · view hướng (values populated once PDFs are extracted).
3. **Mặt bằng điển hình** — tabbed gallery per unit type (Studio · 1BR · 1BR+1 · 2BR · 2BR+1 · 3BR · 3BR+1 · 4BR · Duplex · Penthouse — whichever apply). Each tab: floorplan JPG + diện tích range. Click → lightbox. "Tải mặt bằng đầy đủ (PDF)" Sand CTA opens lead modal; on submit → serves `docs/floorplans-l*-the-bloom.pdf`.
4. **Phối cảnh nội thất** — masonry grid from the 23 interior renders, segmented by unit type (2BR set, 4BR set, common areas).
5. **Tiện ích tại tòa** — bullet list (lobby riêng, business lounge, library tower-specific).
6. **Liên hệ tư vấn căn cụ thể** — sticky mobile CTA bar (phone + Zalo + "Đăng ký tư vấn").

Reuses header, footer, lead form, `js/main.js`. Adds `js/tower.js` for tabs + lightbox.

## 8. Blog (4 starter posts)

Same shape as langvan: `posts.json` schema (`slug`, `title`, `excerpt`, `date`, `category`, `tags[]`), `blog/index.html` listing with JS pagination, per-post static HTML files.

| Slug | Category | Featured image |
|---|---|---|
| `tong-quan-lumiere-hanoi-seasons-garden.html` | Tong quan | `hero-aerial.jpg` |
| `vi-tri-lumiere-hanoi-seasons-garden.html` | Phan tich | `location-map.jpg` |
| `bang-gia-lumiere-hanoi-seasons-garden-2026.html` | Bang gia | `thebloom-l1-facade.jpg` |
| `chinh-sach-thanh-toan-lumiere-hsg-2026.html` | Chinh sach | `amenity-clubhouse-pool.jpg` |

Each post: ~800–1200 VI words, `<figure>` + `og:image` + Article schema. Dates ≤ today.

Categories: `Tong quan`, `Phan tich`, `Bang gia`, `Chinh sach`, `Tien do`, `Phap ly`, `Tien ich` (no diacritics in category strings — they're used as filter keys).

## 9. Lead form

- Fields: Họ tên (required, ≥2 chars) · Số điện thoại (required, regex `/^0\d{9}$/`) · Tin nhắn (optional) · checkbox "Tôi muốn nhận bảng giá / mặt bằng The Bloom" (default checked)
- Submit: vanilla `fetch` + `FormData` → **Formspree** endpoint (placeholder `https://formspree.io/f/REPLACE_ME` until user provides)
- Success state: green inline confirmation. For PDF-gated flow (tower page floorplan CTA), on success trigger `<a download>` of the relevant `docs/floorplans-l*-the-bloom.pdf`
- Anti-spam: `<input name="_gotcha" style="display:none">` honeypot
- DOM-safe rendering (`createElement` + `textContent`), no `innerHTML`

## 10. SEO & AI discoverability

### 10.1 Per-page meta
- Page-specific `<title>` ending with " | PKD Hanoi Seasons Garden"
- `<meta name="description">` ≤155 chars
- `<meta name="keywords">` — kept for parity with langvan
- Open Graph (`vi_VN` locale) + Twitter Card
- Canonical link

### 10.2 Structured data
- `RealEstateAgent` on index — `name: "Phòng Kinh Doanh Hanoi Seasons Garden"`, `telephone: "+84564928999"`, `addressLocality: "Hà Nội"`
- `RealEstateListing` on index — project entity at `233 Nguyễn Trãi, Hà Nội`
- `Apartment` per tower page
- `Article` per blog post

### 10.3 sitemap.xml
URLs: `/`, `/toa-l1.html`, `/toa-l2.html`, `/blog/`, and the 4 blog post URLs. `<lastmod>` = launch date.

### 10.4 robots.txt
Allow all; `Sitemap:` line pointing to absolute `sitemap.xml` URL.

### 10.5 llms.txt
Same shape as langvan's: H1 + project summary + product summary (Bloom L1/L2 pricing) + main page index + featured posts list + contact. Updated whenever a new blog post lands.

### 10.6 `<link rel="llms">` tag
Included in every page's `<head>`.

## 11. Image pipeline (one-time, local)

Run before first commit. Outputs go in `/images/`.

1. **Map raw → target** per the file layout in §4.
2. **Resize:** exteriors max **1920w**, interiors max **1600w**. JPEG q=82, progressive.
3. **Mobile srcset:** generate `1024w` variants where `srcset` matters (hero, amenity grid).
4. **Total budget:** ~5MB across `/images/`.
5. **Tools:** macOS `sips` for resize, `magick mogrify` if available, `qpdf`/`gs` for PDF compression.
6. **Floor-plan extraction:** for each PDF, render per-unit-type pages to JPG via `pdftoppm` or `magick convert`, named `floorplan-l{1,2}-{unitType}.jpg`.
7. **Compressed PDFs** (`docs/floorplans-l*-the-bloom.pdf`) are committed (gated download targets) at ~10–15MB each.

## 12. Deployment

- `git init` in project root (no remote yet)
- GitHub: user creates repo `pkdhanoiseasonsgarden`; gives URL or accepts default
- Vercel: link to `main`; no build command; static serve
- Domain: `pkdhanoiseasonsgarden.com` apex + `www.` (default redirect `apex → www`); DNS configured by user
- No SSL/runtime config beyond Vercel defaults

## 13. CLAUDE.md (project conventions)

Mirrors langvan's structure, project-specific values:
- Stack & deployment
- Design tokens (colors, type)
- Blog workflow (adding new post, featured-image rule, date rule, llms.txt update)
- Required tracking snippets (GTM placeholder block ready but commented out at launch)
- Hotline, project facts
- Content sources (Masterise official page primary)
- **ASCII-only filename rule**
- Image pipeline reminder
- Schema.org templates
- Vercel deploy instructions

## 14. Disclaimer (footer, every page)

> Website cung cấp bởi Phòng Kinh Doanh dự án LUMIÈRE Hanoi Seasons Garden — không phải trang thông tin chính thức từ Chủ đầu tư Masterise Homes. Thông tin có thể thay đổi theo chính sách của Chủ đầu tư.

## 15. Build sequence (input for the implementation plan)

1. `git init` + `.gitignore` (already done as part of writing this spec).
2. Run image pipeline: optimize 19 exterior + 23 interior renders, extract floorplan JPGs, compress PDFs.
3. Place `SVN-Optima*.otf` + `DFVN-Abygaer-Regular.otf` in `/fonts/`; write `/css/fonts.css`.
4. Scaffold `index.html` shell (head, header, footer, section anchors, smooth-scroll JS).
5. Build sections 1→11 of `index.html`.
6. Build `toa-l1.html` + `toa-l2.html` from shared template.
7. Build `blog/index.html` + `blog-shared.js` + `posts.json` + the 4 post HTML files.
8. Wire lead form to Formspree placeholder; document the swap step.
9. Add SEO: `sitemap.xml`, `robots.txt`, `llms.txt`, schema.org JSON-LDs, OG images, `<link rel="llms">` in all heads.
10. Write `CLAUDE.md`.
11. First commit, push to GitHub, link Vercel, configure domain.

## 16. Open items to confirm before launch (not blocking spec)

- Formspree endpoint URL (or alternative form provider) → user provides
- GitHub repo URL → user provides or accepts proposed name
- DNS at registrar → user configures CNAME to Vercel
- `pkdhanoiseasonsgarden.com` registration status → user confirms
- Bảo lãnh ngân hàng (which banks) → user confirms with Masterise before populating §6.8
- Exact unit-type breakdown per tower (counts + sizes) → extracted from PDFs during image pipeline step

## 17. Out of scope (explicit)

- GTM / GA / Meta Pixel tracking — added in v1.1
- EN language version — added in a future phase
- Future tower phases (L3+) — only teased, not detailed
- CMS — content stays static HTML
- WordPress, React, or any framework — explicitly avoided
- Build tooling — no bundler, no package.json
- Backend — Formspree (or equivalent SaaS) handles form submission; no server we own
