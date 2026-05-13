# Hanoi Seasons Garden PKD Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static F1 sales-partner website for **LUMIÈRE Hanoi Seasons Garden**, mirroring the langvan playbook with the Masterise brand kit.

**Architecture:** Static HTML + Tailwind CSS Play CDN + vanilla JS + self-hosted SVN-Optima `@font-face`. Hosted on Vercel from the GitHub `main` branch. No bundler, no `package.json`.

**Tech Stack:** HTML5, Tailwind CDN, vanilla JS, SVN-Optima + Inter, `sips`/`pdftoppm` for asset prep, Vercel for hosting.

**Spec:** [`docs/superpowers/specs/2026-05-13-hnseasonsgarden-website-design.md`](../specs/2026-05-13-hnseasonsgarden-website-design.md)

**Working directory:** `/Volumes/na2024/Passion/hnseasonsgarden/`

**Testing convention:** This is a static site with no test framework. "Tests" mean: run `python3 -m http.server 8000` from the project root, open the target URL in a browser, verify the visual & functional criteria stated in each step, and check the JS console for errors. If Playwright MCP tools are available, automate via `browser_navigate` + `browser_take_screenshot` + `browser_console_messages`.

**Commits:** Conventional Commits style. Every task ends with a commit. Co-Authored-By trailer if Claude assisted.

---

## Phase 0 — Pre-flight

### Task 0.1: Install missing image-pipeline tools

**Files:** none.

- [ ] **Step 1: Install ghostscript, qpdf, imagemagick via Homebrew**

```bash
brew install ghostscript qpdf imagemagick
```

- [ ] **Step 2: Verify each binary**

```bash
command -v gs && command -v qpdf && command -v magick && command -v sips && command -v pdftoppm
```

Expected: five absolute paths printed, no "not found".

- [ ] **Step 3: Confirm working directory**

```bash
cd /Volumes/na2024/Passion/hnseasonsgarden
git remote -v
```

Expected output contains: `origin git@github-ngoclx:ngoclx/hanoi-seasons-garden.git`.

### Task 0.2: Start a local dev server in the background

**Files:** none.

- [ ] **Step 1: Launch http.server on port 8000**

```bash
cd /Volumes/na2024/Passion/hnseasonsgarden
python3 -m http.server 8000 &
echo $! > /tmp/hsg-server.pid
```

- [ ] **Step 2: Verify**

```bash
curl -sI http://localhost:8000/ | head -1
```

Expected: `HTTP/1.0 200 OK` (or 404 — both fine, server is responding). Keep this process alive for the rest of the plan; kill at the end with `kill $(cat /tmp/hsg-server.pid)`.

---

## Phase 1 — Asset pipeline

### Task 1.1: Optimize exterior renders → `/images/`

**Files:**
- Create: `images/hero-aerial.jpg`, `images/overview-architecture.jpg`, `images/overview-masterplan.jpg`, `images/thebloom-l1-facade.jpg`, `images/thebloom-l2-facade.jpg`, `images/amenity-*.jpg` (×15)

- [ ] **Step 1: Resize and rename each raw exterior**

Run each `sips` command — max 1920px wide, JPEG quality 82, output to `/images/`:

```bash
SRC="materials/ẢNH PHỐI CẢNH DỰ ÁN/ẢNH PHỐI CẢNH NGOÀI NHÀ"
mkdir -p images

sips -Z 1920 -s format jpeg -s formatOptions 82 "$SRC/Ảnh phối cảnh tổng thể dự án.jpg"     --out images/hero-aerial.jpg
sips -Z 1920 -s format jpeg -s formatOptions 82 "$SRC/Ảnh phối cảnh kiến trúc dự án.jpg"    --out images/overview-architecture.jpg
sips -Z 1920 -s format jpeg -s formatOptions 82 "$SRC/Ảnh TMB phân khu.jpg"                 --out images/overview-masterplan.jpg
sips -Z 1920 -s format jpeg -s formatOptions 82 "$SRC/TMB dự án.jpg"                        --out images/overview-masterplan-detail.jpg
sips -Z 1920 -s format jpeg -s formatOptions 82 "$SRC/Ảnh facade dự án.jpg"                 --out images/thebloom-l1-facade.jpg
sips -Z 1920 -s format jpeg -s formatOptions 82 "$SRC/Ảnh phối cảnh tổng thể dự án .jpg"    --out images/thebloom-l2-facade.jpg
sips -Z 1920 -s format jpeg -s formatOptions 82 "$SRC/Ảnh phối cảnh biểu tượng thác nước.jpg" --out images/amenity-waterfall.jpg
sips -Z 1920 -s format jpeg -s formatOptions 82 "$SRC/Ảnh phối cảnh lối vào cổng chính.jpg" --out images/amenity-entrance-gate.jpg
sips -Z 1920 -s format jpeg -s formatOptions 82 "$SRC/Ảnh tiểu cảnh thác suối.jpg"          --out images/amenity-water-feature-lobby.jpg
sips -Z 1920 -s format jpeg -s formatOptions 82 "$SRC/Ảnh tiện ích mái vòm.jpg"             --out images/amenity-canopy.jpg
sips -Z 1920 -s format jpeg -s formatOptions 82 "$SRC/Tiểu cảnh nước sảnh đón.jpg"          --out images/amenity-entrance-water.jpg
sips -Z 1920 -s format jpeg -s formatOptions 82 "$SRC/CLUBHOUSE 2.jpg"                      --out images/amenity-clubhouse-pool.jpg
sips -Z 1920 -s format jpeg -s formatOptions 82 "$SRC/CLUBHOUSE 3.jpg"                      --out images/amenity-clubhouse-bar.jpg
sips -Z 1920 -s format jpeg -s formatOptions 82 "$SRC/CLUBHOUSE.png"                        --out images/amenity-clubhouse-overview.jpg
sips -Z 1920 -s format jpeg -s formatOptions 82 "$SRC/Family Pavilon.jpg"                   --out images/amenity-family-pavilion.jpg
sips -Z 1920 -s format jpeg -s formatOptions 82 "$SRC/Khu Skating.jpg"                      --out images/amenity-skating.jpg
sips -Z 1920 -s format jpeg -s formatOptions 82 "$SRC/Khu sân chơi cát sáng tạo.jpg"        --out images/amenity-sand-playground.jpg
sips -Z 1920 -s format jpeg -s formatOptions 82 "$SRC/Khu vui chơi Vườn diệu kỳ.jpg"        --out images/amenity-kids-garden.jpg
sips -Z 1920 -s format jpeg -s formatOptions 82 "$SRC/Khu vui chơi Vườn phiêu lưu.jpg"      --out images/amenity-adventure-garden.jpg
```

- [ ] **Step 2: Verify output size budget**

```bash
du -sh images/
ls images/ | wc -l
```

Expected: total under 8MB; 19 files listed.

- [ ] **Step 3: Spot-check one image**

Open `http://localhost:8000/images/hero-aerial.jpg` in browser. Confirm it loads, looks correct, and is < 1MB.

- [ ] **Step 4: Commit**

```bash
git add images/
git commit -m "chore: add optimized exterior renders" -m "Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push
```

### Task 1.2: Optimize interior renders → `/images/`

**Files:**
- Create: `images/interior-*.jpg` (×15)

- [ ] **Step 1: Resize and rename interiors (max 1600w, q82)**

```bash
SRC="materials/ẢNH PHỐI CẢNH DỰ ÁN/ẢNH PHỐI CẢNH TRONG NHÀ"

sips -Z 1600 -s format jpeg -s formatOptions 82 "$SRC/2BR LIVING + KITCHEN (1).jpg"         --out images/interior-2br-living-1.jpg
sips -Z 1600 -s format jpeg -s formatOptions 82 "$SRC/2BR LIVING + KITCHEN (2).jpg"         --out images/interior-2br-living-2.jpg
sips -Z 1600 -s format jpeg -s formatOptions 82 "$SRC/2BR_MASTER BEDROOM 1.jpg"             --out images/interior-2br-master.jpg
sips -Z 1600 -s format jpeg -s formatOptions 82 "$SRC/2BR_MSBR_VIEW1.jpg"                   --out images/interior-2br-master-view.jpg
sips -Z 1600 -s format jpeg -s formatOptions 82 "$SRC/4Br - Living room + Kitchen (Op1).jpg" --out images/interior-4br-living-op1.jpg
sips -Z 1600 -s format jpeg -s formatOptions 82 "$SRC/4Br - Living room + Kitchen (Op2).jpg" --out images/interior-4br-living-op2.jpg
sips -Z 1600 -s format jpeg -s formatOptions 82 "$SRC/4BR MASTERBEDROOM_2.jpg"              --out images/interior-4br-master.jpg
sips -Z 1600 -s format jpeg -s formatOptions 82 "$SRC/4BR_GUESTROOM copy.jpg"               --out images/interior-4br-guestroom.jpg
sips -Z 1600 -s format jpeg -s formatOptions 82 "$SRC/4BR_LIVKIT_view1_Post.jpg"            --out images/interior-4br-living-3.jpg
sips -Z 1600 -s format jpeg -s formatOptions 82 "$SRC/PC_4BR_Bedroom.jpg"                   --out images/interior-4br-bedroom.jpg
sips -Z 1600 -s format jpeg -s formatOptions 82 "$SRC/Pc_4br Mutilfuction.jpg"              --out images/interior-4br-multifunction.jpg
sips -Z 1600 -s format jpeg -s formatOptions 82 "$SRC/Bedroom1-1.jpg"                       --out images/interior-bedroom.jpg
sips -Z 1600 -s format jpeg -s formatOptions 82 "$SRC/MAIN_LOBBY 1.jpg"                     --out images/interior-main-lobby-1.jpg
sips -Z 1600 -s format jpeg -s formatOptions 82 "$SRC/MAIN_LOBBY 2.jpg"                     --out images/interior-main-lobby-2.jpg
sips -Z 1600 -s format jpeg -s formatOptions 82 "$SRC/MAIN_LOBBY 3.jpg"                     --out images/interior-main-lobby-3.jpg
sips -Z 1600 -s format jpeg -s formatOptions 82 "$SRC/SẢNH THANG MÁY.jpg"                   --out images/interior-elevator-hall.jpg
sips -Z 1600 -s format jpeg -s formatOptions 82 "$SRC/PC_Hanh Lang.jpg"                     --out images/interior-corridor.jpg
sips -Z 1600 -s format jpeg -s formatOptions 82 "$SRC/PC_Gym.jpg"                           --out images/interior-gym.jpg
sips -Z 1600 -s format jpeg -s formatOptions 82 "$SRC/PC_Kid.jpg"                           --out images/interior-kids.jpg
sips -Z 1600 -s format jpeg -s formatOptions 82 "$SRC/BUSINESS LOUNGE TÒA L1.jpg"           --out images/interior-business-lounge-l1.jpg
sips -Z 1600 -s format jpeg -s formatOptions 82 "$SRC/THƯ VIỆN TÒA L1.jpg"                  --out images/interior-library-l1.jpg
sips -Z 1600 -s format jpeg -s formatOptions 82 "$SRC/THƯ VIỆN TÒA L2.jpg"                  --out images/interior-library-l2.jpg
sips -Z 1600 -s format jpeg -s formatOptions 82 "$SRC/Bể bơi Clubhouse.jpg"                 --out images/interior-clubhouse-pool.jpg
```

- [ ] **Step 2: Verify**

```bash
ls images/interior-*.jpg | wc -l
du -sh images/
```

Expected: 23 interior files; total `/images/` under 12MB.

- [ ] **Step 3: Commit**

```bash
git add images/
git commit -m "chore: add optimized interior renders" -m "Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push
```

### Task 1.3: Extract floor-plan pages from PDFs → `/images/`

**Files:**
- Create: `images/floorplan-l1-*.jpg`, `images/floorplan-l2-*.jpg` (count TBD from PDF page count)
- Create: `docs/floorplans-l1-the-bloom.pdf`, `docs/floorplans-l2-the-bloom.pdf` (compressed)

- [ ] **Step 1: Inspect PDFs to learn page counts**

```bash
SRC="materials/LAYOUT - LUMIÈRE Hanoi Seasons Garden"
pdfinfo "$SRC/Tòa L1_Phân khu The Bloom_LUMIÈRE Hanoi Seasons Garden.pdf" | grep -i pages
pdfinfo "$SRC/Tòa L2_Phân khu The Bloom_LUMIÈRE Hanoi Seasons Garden.pdf" | grep -i pages
```

Note the page counts. Open both PDFs in Preview and visually identify which page numbers correspond to which unit type (Studio, 1BR, 2BR, 3BR, 4BR, Duplex, Penthouse, etc.). Record a mapping table per tower.

- [ ] **Step 2: Render every PDF page to JPG at 200 DPI**

```bash
mkdir -p /tmp/fp-l1 /tmp/fp-l2

pdftoppm -jpeg -r 200 "$SRC/Tòa L1_Phân khu The Bloom_LUMIÈRE Hanoi Seasons Garden.pdf" /tmp/fp-l1/page
pdftoppm -jpeg -r 200 "$SRC/Tòa L2_Phân khu The Bloom_LUMIÈRE Hanoi Seasons Garden.pdf" /tmp/fp-l2/page
```

Output: `/tmp/fp-l1/page-01.jpg`, `/tmp/fp-l1/page-02.jpg`, etc.

- [ ] **Step 3: Rename the relevant pages into `/images/`**

Using the mapping you recorded in Step 1, copy and rename the unit-type pages. Example pattern (adjust page numbers to match your mapping):

```bash
# L1 — adjust page-NN to actual page numbers
sips -Z 1600 -s format jpeg -s formatOptions 85 /tmp/fp-l1/page-03.jpg --out images/floorplan-l1-studio.jpg
sips -Z 1600 -s format jpeg -s formatOptions 85 /tmp/fp-l1/page-05.jpg --out images/floorplan-l1-1br.jpg
sips -Z 1600 -s format jpeg -s formatOptions 85 /tmp/fp-l1/page-07.jpg --out images/floorplan-l1-1br-plus.jpg
sips -Z 1600 -s format jpeg -s formatOptions 85 /tmp/fp-l1/page-09.jpg --out images/floorplan-l1-2br.jpg
sips -Z 1600 -s format jpeg -s formatOptions 85 /tmp/fp-l1/page-11.jpg --out images/floorplan-l1-2br-plus.jpg
sips -Z 1600 -s format jpeg -s formatOptions 85 /tmp/fp-l1/page-13.jpg --out images/floorplan-l1-3br.jpg
sips -Z 1600 -s format jpeg -s formatOptions 85 /tmp/fp-l1/page-15.jpg --out images/floorplan-l1-3br-plus.jpg
sips -Z 1600 -s format jpeg -s formatOptions 85 /tmp/fp-l1/page-17.jpg --out images/floorplan-l1-4br.jpg
sips -Z 1600 -s format jpeg -s formatOptions 85 /tmp/fp-l1/page-19.jpg --out images/floorplan-l1-duplex.jpg
sips -Z 1600 -s format jpeg -s formatOptions 85 /tmp/fp-l1/page-21.jpg --out images/floorplan-l1-penthouse.jpg

# L2 — repeat with /tmp/fp-l2/ and floorplan-l2-* names
```

If the PDF doesn't include a given unit type, omit that line — the tower page tabs will only render the unit types that have an image.

- [ ] **Step 4: Compress the source PDFs**

```bash
mkdir -p docs
gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH \
   -sOutputFile=docs/floorplans-l1-the-bloom.pdf \
   "$SRC/Tòa L1_Phân khu The Bloom_LUMIÈRE Hanoi Seasons Garden.pdf"
gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH \
   -sOutputFile=docs/floorplans-l2-the-bloom.pdf \
   "$SRC/Tòa L2_Phân khu The Bloom_LUMIÈRE Hanoi Seasons Garden.pdf"
```

- [ ] **Step 5: Verify**

```bash
ls -lh docs/floorplans-l*.pdf
ls images/floorplan-*.jpg | wc -l
du -sh images/ docs/
```

Expected: each compressed PDF under 20MB; floorplan JPGs cover every available unit type; total project still under 35MB.

- [ ] **Step 6: Clean up temp**

```bash
rm -rf /tmp/fp-l1 /tmp/fp-l2
```

- [ ] **Step 7: Commit**

```bash
git add images/floorplan-*.jpg docs/floorplans-l*.pdf
git commit -m "chore: extract floor plans + compress source PDFs" -m "Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push
```

### Task 1.4: Brand logos and favicon

**Files:**
- Create: `images/logo-hsg.png`, `images/logo-lumiere-hsg.png`, `images/logo-lumiere-hsg-white.png`, `images/pattern-rosette.png`, `favicon.ico`

- [ ] **Step 1: Copy logos from materials**

```bash
SRC="materials/BỘ NHẬN DIỆN THƯƠNG HIỆU/LOGO"
cp "$SRC/logo HSG.png"  images/logo-hsg.png
cp "$SRC/logo LHSG.png" images/logo-lumiere-hsg.png
cp "materials/BỘ NHẬN DIỆN THƯƠNG HIỆU/PATERN/pattern 1.png" images/pattern-rosette.png
```

- [ ] **Step 2: Generate the ivory/white variant of the Lumière lockup**

Open `images/logo-lumiere-hsg.png` in Preview → Tools → Adjust Color → invert; OR use ImageMagick to recolor the dark slate to ivory:

```bash
magick images/logo-lumiere-hsg.png -fuzz 25% -fill "#F1EFE8" -opaque "#455F39" images/logo-lumiere-hsg-white.png
```

Verify the output by opening in browser at `http://localhost:8000/images/logo-lumiere-hsg-white.png` on a dark `<div>` (use DevTools to set page background `#30413B`).

- [ ] **Step 3: Generate `favicon.ico` from the rosette mark**

```bash
magick images/logo-hsg.png -resize 64x64 -background none -gravity center -extent 64x64 favicon.ico
```

- [ ] **Step 4: Verify**

```bash
ls -lh images/logo-*.png images/pattern-rosette.png favicon.ico
```

Open `http://localhost:8000/favicon.ico` in browser — should load.

- [ ] **Step 5: Commit**

```bash
git add images/logo-*.png images/pattern-rosette.png favicon.ico
git commit -m "chore: add brand logos and favicon" -m "Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push
```

---

## Phase 2 — Foundations (fonts, shell)

### Task 2.1: Self-host SVN-Optima + Abygaer

**Files:**
- Create: `fonts/SVN-Optima-Regular.otf`, `fonts/SVN-Optima-Medium.otf`, `fonts/SVN-Optima-DemiBold.otf`, `fonts/SVN-Optima-Bold.otf`, `fonts/DFVN-Abygaer-Regular.otf`
- Create: `css/fonts.css`

- [ ] **Step 1: Copy `.otf` files into `/fonts/`**

```bash
mkdir -p fonts css
SRC="materials/BỘ NHẬN DIỆN THƯƠNG HIỆU/FONT"
cp "$SRC/SVN-Optima Regular.otf"   fonts/SVN-Optima-Regular.otf
cp "$SRC/SVN-Optima Medium Italic.otf" fonts/SVN-Optima-Medium.otf
cp "$SRC/SVN-Optima DemiBold.otf"  fonts/SVN-Optima-DemiBold.otf
cp "$SRC/SVN-Optima Bold.otf"      fonts/SVN-Optima-Bold.otf
cp "$SRC/DFVN-Abygaer-Regular.otf" fonts/DFVN-Abygaer-Regular.otf
```

Note: `SVN-Optima Medium.otf` does not exist as a non-italic file in `materials/` — we use the next-closest weight. Confirm by `ls "$SRC"/SVN-Optima*` and pick the available `Medium` variant; adjust the copy command if needed.

- [ ] **Step 2: Create `css/fonts.css`**

```css
/* SVN-Optima — display/headings */
@font-face {
  font-family: 'SVN-Optima';
  src: url('/fonts/SVN-Optima-Regular.otf') format('opentype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'SVN-Optima';
  src: url('/fonts/SVN-Optima-Medium.otf') format('opentype');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'SVN-Optima';
  src: url('/fonts/SVN-Optima-DemiBold.otf') format('opentype');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'SVN-Optima';
  src: url('/fonts/SVN-Optima-Bold.otf') format('opentype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

/* DFVN-Abygaer — sparing decorative accent */
@font-face {
  font-family: 'DFVN-Abygaer';
  src: url('/fonts/DFVN-Abygaer-Regular.otf') format('opentype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

- [ ] **Step 3: Verify in browser**

Create a temp file `/tmp/font-test.html` with:

```html
<!DOCTYPE html><html><head><link rel="stylesheet" href="http://localhost:8000/css/fonts.css">
<style>body{font-family:'SVN-Optima',serif;font-size:48px;padding:40px}
.a{font-family:'DFVN-Abygaer';color:#B89B7A}</style></head>
<body><div>Hanoi Seasons Garden</div><div class="a">Lumière</div></body></html>
```

Open in browser. Confirm headings render in Optima (not browser default serif) and the Abygaer line looks decorative.

- [ ] **Step 4: Commit**

```bash
git add fonts/ css/
git commit -m "feat: self-host SVN-Optima + Abygaer brand fonts" -m "Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push
```

### Task 2.2: `index.html` skeleton — head, header, footer, smooth-scroll JS

**Files:**
- Create: `index.html`
- Create: `js/main.js`

- [ ] **Step 1: Write `index.html` shell**

```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LUMIÈRE Hanoi Seasons Garden — Phân Phối Chính Thức | Phòng Kinh Doanh HSG</title>
  <meta name="description" content="LUMIÈRE Hanoi Seasons Garden — Phân khu The Bloom (Tòa L1 & L2) tại 233 Nguyễn Trãi, Hà Nội. Bảng giá, chính sách 2026. Hotline 0564.928.999.">
  <meta name="keywords" content="Hanoi Seasons Garden, Lumière HSG, Masterise Hanoi, The Bloom, căn hộ 233 Nguyễn Trãi, căn hộ Thanh Xuân, căn hộ cao cấp Hà Nội">
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="canonical" href="https://www.pkdhanoiseasonsgarden.com">

  <meta property="og:type" content="website">
  <meta property="og:locale" content="vi_VN">
  <meta property="og:title" content="LUMIÈRE Hanoi Seasons Garden — Phân khu The Bloom">
  <meta property="og:description" content="Phân phối chính thức — The Bloom (Tòa L1, L2) tại 233 Nguyễn Trãi, Hà Nội. Bảng giá, chính sách 2026.">
  <meta property="og:url" content="https://www.pkdhanoiseasonsgarden.com">
  <meta property="og:site_name" content="PKD Hanoi Seasons Garden">
  <meta property="og:image" content="https://www.pkdhanoiseasonsgarden.com/images/hero-aerial.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/fonts.css">

  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            'hsg-slate':      '#30413B',
            'hsg-slate-dark': '#1F2A26',
            'lum-green':      '#455F39',
            'lum-green-dark': '#36492C',
            'sage':           '#B7BA9F',
            'sage-light':     '#D6D8C5',
            'sand':           '#B89B7A',
            'sand-dark':      '#9E835F',
            'ivory':          '#F1EFE8',
            'warm-gray':      '#E8E6DE',
            'zalo':           '#0068FF',
          },
          fontFamily: {
            display: ['SVN-Optima', 'Cormorant Garamond', 'Georgia', 'serif'],
            sans:    ['Inter', 'system-ui', 'sans-serif'],
            accent:  ['DFVN-Abygaer', 'cursive'],
          },
        },
      },
    }
  </script>

  <link rel="llms" href="https://www.pkdhanoiseasonsgarden.com/llms.txt" type="text/plain">
</head>
<body class="font-sans text-hsg-slate bg-white">

  <!-- Sticky Header -->
  <header id="header" class="fixed top-0 left-0 right-0 z-50 bg-white shadow-md transition-all duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 lg:h-20">
        <a href="#" class="flex-shrink-0 flex items-center">
          <img src="/images/logo-lumiere-hsg.png" alt="LUMIÈRE Hanoi Seasons Garden" class="h-8 lg:h-10 w-auto">
        </a>
        <nav class="hidden lg:flex items-center space-x-6">
          <a href="#vi-tri" class="text-sm font-medium text-hsg-slate hover:text-lum-green transition-colors">Vị Trí</a>
          <a href="#tong-quan" class="text-sm font-medium text-hsg-slate hover:text-lum-green transition-colors">Tổng Quan</a>
          <a href="#the-bloom" class="text-sm font-medium text-hsg-slate hover:text-lum-green transition-colors">The Bloom</a>
          <a href="#tien-ich" class="text-sm font-medium text-hsg-slate hover:text-lum-green transition-colors">Tiện Ích</a>
          <a href="#bang-gia" class="text-sm font-medium text-hsg-slate hover:text-lum-green transition-colors">Bảng Giá</a>
          <a href="#chinh-sach" class="text-sm font-medium text-hsg-slate hover:text-lum-green transition-colors">Chính Sách</a>
          <a href="/blog/" class="text-sm font-medium text-hsg-slate hover:text-lum-green transition-colors">Tin Tức</a>
          <a href="#lien-he" class="text-sm font-medium text-hsg-slate hover:text-lum-green transition-colors">Liên Hệ</a>
        </nav>
        <div class="flex items-center space-x-3">
          <a href="tel:0564928999" class="hidden sm:inline-flex items-center px-4 py-2 bg-lum-green text-white text-sm font-medium tracking-wide rounded-full hover:bg-lum-green-dark transition-colors">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
            0564.928.999
          </a>
          <button id="mobile-menu-btn" class="lg:hidden p-2 rounded-md text-hsg-slate hover:bg-warm-gray" aria-label="Menu">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path id="menu-icon-open" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              <path id="menu-icon-close" class="hidden" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
      <nav id="mobile-menu" class="hidden lg:hidden pb-4 border-t border-warm-gray">
        <div class="flex flex-col space-y-2 pt-3">
          <a href="#vi-tri" class="mobile-nav-link px-3 py-2 text-sm font-medium text-hsg-slate hover:bg-warm-gray rounded-md">Vị Trí</a>
          <a href="#tong-quan" class="mobile-nav-link px-3 py-2 text-sm font-medium text-hsg-slate hover:bg-warm-gray rounded-md">Tổng Quan</a>
          <a href="#the-bloom" class="mobile-nav-link px-3 py-2 text-sm font-medium text-hsg-slate hover:bg-warm-gray rounded-md">The Bloom</a>
          <a href="#tien-ich" class="mobile-nav-link px-3 py-2 text-sm font-medium text-hsg-slate hover:bg-warm-gray rounded-md">Tiện Ích</a>
          <a href="#bang-gia" class="mobile-nav-link px-3 py-2 text-sm font-medium text-hsg-slate hover:bg-warm-gray rounded-md">Bảng Giá</a>
          <a href="#chinh-sach" class="mobile-nav-link px-3 py-2 text-sm font-medium text-hsg-slate hover:bg-warm-gray rounded-md">Chính Sách</a>
          <a href="/blog/" class="mobile-nav-link px-3 py-2 text-sm font-medium text-hsg-slate hover:bg-warm-gray rounded-md">Tin Tức</a>
          <a href="#lien-he" class="mobile-nav-link px-3 py-2 text-sm font-medium text-hsg-slate hover:bg-warm-gray rounded-md">Liên Hệ</a>
          <a href="tel:0564928999" class="px-3 py-2 text-sm font-semibold text-lum-green">0564.928.999</a>
        </div>
      </nav>
    </div>
  </header>

  <div class="h-16 lg:h-20"></div>

  <main>
    <!-- SECTIONS WILL BE INSERTED HERE BY TASKS 3.1 – 3.11 -->
  </main>

  <!-- Footer -->
  <footer class="bg-hsg-slate-dark text-ivory">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div>
          <img src="/images/logo-lumiere-hsg-white.png" alt="LUMIÈRE Hanoi Seasons Garden" class="h-10 w-auto mb-4">
          <p class="text-sm text-sage leading-relaxed">Phòng Kinh Doanh — Phân phối chính thức dự án LUMIÈRE Hanoi Seasons Garden tại 233 Nguyễn Trãi, Hà Nội.</p>
        </div>
        <div>
          <h4 class="font-display text-lg mb-3">Liên hệ</h4>
          <ul class="text-sm space-y-2 text-sage">
            <li><a href="tel:0564928999" class="hover:text-sand">Hotline: 0564.928.999</a></li>
            <li><a href="https://zalo.me/0564928999" class="hover:text-sand" rel="noopener">Zalo: zalo.me/0564928999</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-display text-lg mb-3">Liên kết</h4>
          <ul class="text-sm space-y-2 text-sage">
            <li><a href="#tong-quan" class="hover:text-sand">Tổng quan dự án</a></li>
            <li><a href="#the-bloom" class="hover:text-sand">Phân khu The Bloom</a></li>
            <li><a href="/toa-l1.html" class="hover:text-sand">Tòa L1</a></li>
            <li><a href="/toa-l2.html" class="hover:text-sand">Tòa L2</a></li>
            <li><a href="/blog/" class="hover:text-sand">Tin tức</a></li>
          </ul>
        </div>
      </div>
      <div class="border-t border-hsg-slate pt-6 text-xs text-sage leading-relaxed">
        <p class="mb-2">Website cung cấp bởi Phòng Kinh Doanh dự án LUMIÈRE Hanoi Seasons Garden — không phải trang thông tin chính thức từ Chủ đầu tư Masterise Homes. Thông tin có thể thay đổi theo chính sách của Chủ đầu tư.</p>
        <p>© <span id="year"></span> PKD Hanoi Seasons Garden. Phân phối chính thức.</p>
      </div>
    </div>
  </footer>

  <script src="/js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create `js/main.js`**

```javascript
// Hanoi Seasons Garden PKD — main JS
(() => {
  // Mobile menu toggle
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  const iconOpen = document.getElementById('menu-icon-open');
  const iconClose = document.getElementById('menu-icon-close');
  if (btn && menu) {
    btn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
      iconOpen.classList.toggle('hidden');
      iconClose.classList.toggle('hidden');
    });
    menu.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.add('hidden');
        iconOpen.classList.remove('hidden');
        iconClose.classList.add('hidden');
      });
    });
  }

  // Smooth scroll for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const headerOffset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
```

- [ ] **Step 3: Verify in browser**

Open `http://localhost:8000/`. You should see:
- Header with Lumière HSG logo + nav links + phone CTA
- Empty main area
- Footer with logo, contact, links, disclaimer
- No JS console errors
- Clicking a nav link doesn't crash (no anchors yet — page won't scroll, which is fine)

- [ ] **Step 4: Commit**

```bash
git add index.html js/main.js
git commit -m "feat: index.html shell — head, header, footer, smooth scroll" -m "Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push
```

---

## Phase 3 — `index.html` sections

For every section task: insert the `<section>` block inside `<main>` in `index.html`, preserving the section order shown here. After every task, reload `http://localhost:8000/`, scroll to the new section, verify it renders correctly, then commit.

### Task 3.1: Hero section

**Files:** Modify `index.html` — insert at the start of `<main>`.

- [ ] **Step 1: Append the hero block to `<main>`**

```html
    <!-- Hero -->
    <section id="hero" class="relative min-h-[88vh] flex items-end overflow-hidden">
      <div class="absolute inset-0">
        <img src="/images/hero-aerial.jpg" alt="LUMIÈRE Hanoi Seasons Garden — Phối cảnh tổng thể dự án" class="w-full h-full object-cover" width="1920" height="1080" loading="eager" fetchpriority="high">
        <div class="absolute inset-0 bg-gradient-to-b from-hsg-slate/40 via-hsg-slate/20 to-hsg-slate-dark/70"></div>
      </div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24 w-full">
        <div class="text-center text-ivory">
          <p class="text-xs lg:text-sm font-sans tracking-[0.4em] text-sage mb-6">PHÒNG KINH DOANH CHÍNH THỨC</p>
          <img src="/images/logo-lumiere-hsg-white.png" alt="LUMIÈRE Hanoi Seasons Garden" class="mx-auto h-20 lg:h-28 w-auto mb-6">
          <p class="font-sans text-base lg:text-xl text-sage tracking-wide mb-10">Phân khu <span class="text-ivory font-medium">The Bloom</span> — Tòa L1 &amp; L2 · 233 Nguyễn Trãi, Hà Nội</p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#lien-he" class="inline-flex items-center px-10 py-4 bg-sand text-hsg-slate-dark text-xs font-semibold tracking-[0.18em] uppercase hover:bg-sand-dark transition-colors min-w-[220px] justify-center rounded-sm">Nhận bảng giá</a>
            <a href="tel:0564928999" class="inline-flex items-center px-10 py-4 border border-sage/60 text-ivory text-xs font-semibold tracking-[0.18em] uppercase hover:bg-ivory/10 transition-colors min-w-[220px] justify-center rounded-sm">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
              0564.928.999
            </a>
          </div>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Verify**

Reload `http://localhost:8000/`. The hero should fill the viewport with the aerial render, show the white Lumière HSG logo centered with the eyebrow and subtitle, and have both CTAs working (Nhận bảng giá scrolls down — there's no `#lien-he` target yet, that's fine; phone CTA opens dial).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat(index): hero section" -m "Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push
```

### Task 3.2: Vị trí & kết nối

**Files:** Modify `index.html` — append inside `<main>` after the hero section.

- [ ] **Step 1: Append the section block**

```html
    <!-- Vị trí & kết nối -->
    <section id="vi-tri" class="py-20 lg:py-28 bg-ivory scroll-mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-14">
          <p class="text-xs tracking-[0.3em] text-sand uppercase mb-3">Vị trí vàng nội đô</p>
          <h2 class="font-display text-3xl lg:text-5xl text-hsg-slate mb-4">Vị trí &amp; kết nối</h2>
          <div class="w-14 h-px bg-sand mx-auto mb-5"></div>
          <p class="max-w-2xl mx-auto text-hsg-slate/80">Tọa lạc tại 233 Nguyễn Trãi — trục huyết mạch nối Thanh Xuân, Đống Đa, Hà Đông; chỉ vài bước chân đến tuyến Metro Cát Linh–Hà Đông.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-16">
          <ul class="space-y-5">
            <li class="flex items-start gap-4">
              <div class="flex-shrink-0 w-10 h-10 rounded-full bg-lum-green text-ivory flex items-center justify-center font-display text-lg">1</div>
              <div>
                <p class="font-display text-lg text-hsg-slate">3 phút đi bộ → Ga Thượng Đình (Metro Cát Linh–Hà Đông)</p>
                <p class="text-sm text-hsg-slate/70 mt-1">Kết nối nhanh tới Hồ Gươm và trung tâm Hà Nội.</p>
              </div>
            </li>
            <li class="flex items-start gap-4">
              <div class="flex-shrink-0 w-10 h-10 rounded-full bg-lum-green text-ivory flex items-center justify-center font-display text-lg">2</div>
              <div>
                <p class="font-display text-lg text-hsg-slate">500m → Nút giao Ngã Tư Sở</p>
                <p class="text-sm text-hsg-slate/70 mt-1">Cửa ngõ giao thông lớn nhất phía Tây Hà Nội.</p>
              </div>
            </li>
            <li class="flex items-start gap-4">
              <div class="flex-shrink-0 w-10 h-10 rounded-full bg-lum-green text-ivory flex items-center justify-center font-display text-lg">3</div>
              <div>
                <p class="font-display text-lg text-hsg-slate">Cận kề Royal City</p>
                <p class="text-sm text-hsg-slate/70 mt-1">Trung tâm thương mại, ẩm thực, giải trí đẳng cấp.</p>
              </div>
            </li>
            <li class="flex items-start gap-4">
              <div class="flex-shrink-0 w-10 h-10 rounded-full bg-lum-green text-ivory flex items-center justify-center font-display text-lg">4</div>
              <div>
                <p class="font-display text-lg text-hsg-slate">Tiếp cận Vành đai 2.5 &amp; Vành đai 3</p>
                <p class="text-sm text-hsg-slate/70 mt-1">Liên kết liền mạch với mọi quận nội đô và Sân bay Nội Bài.</p>
              </div>
            </li>
          </ul>
          <div class="rounded-3xl overflow-hidden shadow-xl">
            <img src="/images/amenity-entrance-gate.jpg" alt="Lối vào cổng chính LUMIÈRE Hanoi Seasons Garden tại 233 Nguyễn Trãi" class="w-full h-auto" loading="lazy">
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div class="bg-white rounded-2xl p-5 text-center">
            <p class="font-display text-2xl text-lum-green">5 phút</p>
            <p class="text-xs text-hsg-slate/70 mt-1">tới Times City</p>
          </div>
          <div class="bg-white rounded-2xl p-5 text-center">
            <p class="font-display text-2xl text-lum-green">7 phút</p>
            <p class="text-xs text-hsg-slate/70 mt-1">tới Hà Đông</p>
          </div>
          <div class="bg-white rounded-2xl p-5 text-center">
            <p class="font-display text-2xl text-lum-green">10 phút</p>
            <p class="text-xs text-hsg-slate/70 mt-1">tới Hồ Gươm</p>
          </div>
          <div class="bg-white rounded-2xl p-5 text-center">
            <p class="font-display text-2xl text-lum-green">10 phút</p>
            <p class="text-xs text-hsg-slate/70 mt-1">tới ĐH Bách Khoa</p>
          </div>
          <div class="bg-white rounded-2xl p-5 text-center">
            <p class="font-display text-2xl text-lum-green">12 phút</p>
            <p class="text-xs text-hsg-slate/70 mt-1">tới BV Bạch Mai</p>
          </div>
          <div class="bg-white rounded-2xl p-5 text-center">
            <p class="font-display text-2xl text-lum-green">30 phút</p>
            <p class="text-xs text-hsg-slate/70 mt-1">tới SB Nội Bài</p>
          </div>
        </div>

        <div class="mt-14 max-w-3xl mx-auto text-center text-hsg-slate/80 italic">
          <p>Tọa lạc trên khu đất "Cao–Xà–Lá" lịch sử — biểu tượng công nghiệp một thời của Hà Nội — nay được tái thiết thành tổ hợp đô thị xanh hiếm có giữa lòng nội đô.</p>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Verify**

Reload page, scroll past hero. Section should appear with sand-tone eyebrow, display heading, two-column layout (bullets + image), 6-tile distance grid, italic closing paragraph.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat(index): vị trí & kết nối section" -m "Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push
```

### Task 3.3: Tổng quan dự án

**Files:** Modify `index.html` — append after `#vi-tri`.

- [ ] **Step 1: Append the section block**

```html
    <!-- Tổng quan dự án -->
    <section id="tong-quan" class="py-20 lg:py-28 bg-white scroll-mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-14">
          <p class="text-xs tracking-[0.3em] text-sand uppercase mb-3">Quy mô &amp; định vị</p>
          <h2 class="font-display text-3xl lg:text-5xl text-hsg-slate mb-4">Tổng quan dự án</h2>
          <div class="w-14 h-px bg-sand mx-auto mb-5"></div>
          <p class="max-w-3xl mx-auto text-hsg-slate/80">LUMIÈRE Hanoi Seasons Garden — tổ hợp đô thị 10 tòa tháp do Masterise Homes phát triển trên khu đất 8,28 ha tại trung tâm Thanh Xuân.</p>
        </div>

        <div class="rounded-3xl overflow-hidden shadow-xl mb-14">
          <img src="/images/overview-architecture.jpg" alt="Phối cảnh kiến trúc tổng thể LUMIÈRE Hanoi Seasons Garden" class="w-full h-auto" loading="lazy">
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-3 gap-5">
          <div class="bg-warm-gray rounded-3xl p-6 text-center col-span-2 lg:col-span-1">
            <p class="font-display text-xl text-lum-green">Masterise Homes</p>
            <p class="text-xs text-hsg-slate/60 mt-2 tracking-wider uppercase">Chủ đầu tư</p>
          </div>
          <div class="bg-warm-gray rounded-3xl p-6 text-center">
            <p class="font-display text-3xl lg:text-4xl text-lum-green">82.820 <span class="text-base font-sans text-hsg-slate/60">m²</span></p>
            <p class="text-xs text-hsg-slate/60 mt-2 tracking-wider uppercase">Diện tích (~8,28 ha)</p>
          </div>
          <div class="bg-warm-gray rounded-3xl p-6 text-center">
            <p class="font-display text-3xl lg:text-4xl text-lum-green">10 <span class="text-base font-sans text-hsg-slate/60">tòa</span></p>
            <p class="text-xs text-hsg-slate/60 mt-2 tracking-wider uppercase">36–46 tầng · 3 hầm</p>
          </div>
          <div class="bg-warm-gray rounded-3xl p-6 text-center">
            <p class="font-display text-3xl lg:text-4xl text-lum-green">28,8<span class="text-base font-sans text-hsg-slate/60">%</span></p>
            <p class="text-xs text-hsg-slate/60 mt-2 tracking-wider uppercase">Mật độ xây dựng</p>
          </div>
          <div class="bg-warm-gray rounded-3xl p-6 text-center">
            <p class="font-display text-3xl lg:text-4xl text-lum-green">11 <span class="text-base font-sans text-hsg-slate/60">loại căn</span></p>
            <p class="text-xs text-hsg-slate/60 mt-2 tracking-wider uppercase">Studio → Penthouse Duplex</p>
          </div>
          <div class="bg-warm-gray rounded-3xl p-6 text-center">
            <p class="font-display text-3xl lg:text-4xl text-lum-green">Q2/2029</p>
            <p class="text-xs text-hsg-slate/60 mt-2 tracking-wider uppercase">Bàn giao The Bloom</p>
          </div>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Verify** — section appears with hero image + 6-tile metric grid.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat(index): tổng quan dự án section" -m "Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push
```

### Task 3.4: Phân khu The Bloom

**Files:** Modify `index.html` — append after `#tong-quan`.

- [ ] **Step 1: Append the section block**

```html
    <!-- Phân khu The Bloom -->
    <section id="the-bloom" class="py-20 lg:py-28 bg-sage-light/40 scroll-mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-14">
          <p class="text-xs tracking-[0.3em] text-sand uppercase mb-3">Phân khu mở bán đầu tiên</p>
          <h2 class="font-display text-3xl lg:text-5xl text-hsg-slate mb-4">Phân khu <span class="italic text-lum-green">The Bloom</span></h2>
          <div class="w-14 h-px bg-sand mx-auto mb-5"></div>
          <p class="max-w-2xl mx-auto text-hsg-slate/80">Hai tòa tháp đầu tiên của LUMIÈRE Hanoi Seasons Garden — kiến tạo mở đầu cho một tổ hợp đô thị xanh hiếm có giữa lòng Thủ đô.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
          <article class="bg-white rounded-3xl overflow-hidden shadow-lg flex flex-col">
            <img src="/images/thebloom-l1-facade.jpg" alt="Tòa L1 — Phân khu The Bloom" class="w-full aspect-[4/3] object-cover" loading="lazy">
            <div class="p-8 flex-1 flex flex-col">
              <p class="text-xs tracking-[0.3em] text-sand uppercase mb-2">Tòa L1</p>
              <h3 class="font-display text-2xl text-hsg-slate mb-3">The Bloom · L1</h3>
              <p class="text-sm text-hsg-slate/80 leading-relaxed mb-5">Bao gồm các loại căn từ Studio đến Penthouse Duplex, view nội khu và đường phố.</p>
              <div class="flex flex-wrap gap-2 mb-6">
                <span class="px-3 py-1 text-xs bg-warm-gray text-hsg-slate rounded-full">Studio</span>
                <span class="px-3 py-1 text-xs bg-warm-gray text-hsg-slate rounded-full">1BR</span>
                <span class="px-3 py-1 text-xs bg-warm-gray text-hsg-slate rounded-full">1BR+1</span>
                <span class="px-3 py-1 text-xs bg-warm-gray text-hsg-slate rounded-full">2BR</span>
                <span class="px-3 py-1 text-xs bg-warm-gray text-hsg-slate rounded-full">2BR+1</span>
                <span class="px-3 py-1 text-xs bg-warm-gray text-hsg-slate rounded-full">3BR</span>
                <span class="px-3 py-1 text-xs bg-warm-gray text-hsg-slate rounded-full">3BR+1</span>
                <span class="px-3 py-1 text-xs bg-warm-gray text-hsg-slate rounded-full">4BR</span>
                <span class="px-3 py-1 text-xs bg-warm-gray text-hsg-slate rounded-full">Duplex</span>
                <span class="px-3 py-1 text-xs bg-warm-gray text-hsg-slate rounded-full">Penthouse</span>
              </div>
              <a href="/toa-l1.html" class="mt-auto inline-flex items-center text-sm font-semibold tracking-wider uppercase text-lum-green hover:text-lum-green-dark">
                Xem chi tiết Tòa L1
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </a>
            </div>
          </article>

          <article class="bg-white rounded-3xl overflow-hidden shadow-lg flex flex-col">
            <img src="/images/thebloom-l2-facade.jpg" alt="Tòa L2 — Phân khu The Bloom" class="w-full aspect-[4/3] object-cover" loading="lazy">
            <div class="p-8 flex-1 flex flex-col">
              <p class="text-xs tracking-[0.3em] text-sand uppercase mb-2">Tòa L2</p>
              <h3 class="font-display text-2xl text-hsg-slate mb-3">The Bloom · L2</h3>
              <p class="text-sm text-hsg-slate/80 leading-relaxed mb-5">Tòa song hành cùng L1, giữ trọn ngôn ngữ thiết kế "tinh khôi" của LUMIÈRE — tối ưu ánh sáng tự nhiên và tầm nhìn nội khu.</p>
              <div class="flex flex-wrap gap-2 mb-6">
                <span class="px-3 py-1 text-xs bg-warm-gray text-hsg-slate rounded-full">Studio</span>
                <span class="px-3 py-1 text-xs bg-warm-gray text-hsg-slate rounded-full">1BR</span>
                <span class="px-3 py-1 text-xs bg-warm-gray text-hsg-slate rounded-full">2BR</span>
                <span class="px-3 py-1 text-xs bg-warm-gray text-hsg-slate rounded-full">2BR+1</span>
                <span class="px-3 py-1 text-xs bg-warm-gray text-hsg-slate rounded-full">3BR</span>
                <span class="px-3 py-1 text-xs bg-warm-gray text-hsg-slate rounded-full">4BR</span>
                <span class="px-3 py-1 text-xs bg-warm-gray text-hsg-slate rounded-full">Duplex</span>
                <span class="px-3 py-1 text-xs bg-warm-gray text-hsg-slate rounded-full">Penthouse Duplex</span>
              </div>
              <a href="/toa-l2.html" class="mt-auto inline-flex items-center text-sm font-semibold tracking-wider uppercase text-lum-green hover:text-lum-green-dark">
                Xem chi tiết Tòa L2
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </a>
            </div>
          </article>
        </div>

        <div class="bg-white/60 backdrop-blur rounded-3xl p-8 lg:p-10 border border-sage/40">
          <div class="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div class="flex-1">
              <p class="text-xs tracking-[0.3em] text-sand uppercase mb-3">Tiếp theo The Bloom</p>
              <h3 class="font-display text-2xl lg:text-3xl text-hsg-slate mb-2">8 phân khu kế tiếp đang được thiết kế</h3>
              <p class="text-sm text-hsg-slate/80">Sau The Bloom, các tòa L3 – L10 sẽ lần lượt mở bán theo lộ trình của Chủ đầu tư. Đăng ký để nhận thông tin sớm.</p>
            </div>
            <a href="#lien-he" class="flex-shrink-0 inline-flex items-center px-8 py-3 bg-lum-green text-ivory text-xs font-semibold tracking-[0.18em] uppercase rounded-sm hover:bg-lum-green-dark transition-colors">Đăng ký nhận tin</a>
          </div>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Verify** — two facade cards side-by-side, future-phases teaser below. Tower links shouldn't 404 yet (we build those pages in Phase 5) — that's fine.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat(index): phân khu The Bloom section" -m "Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push
```

### Task 3.5: Tiện ích (tabbed)

**Files:** Modify `index.html` — append after `#the-bloom`. Modify `js/main.js` — add tab handler.

- [ ] **Step 1: Append the section block**

```html
    <!-- Tiện ích -->
    <section id="tien-ich" class="py-20 lg:py-28 bg-hsg-slate text-ivory scroll-mt-20 relative overflow-hidden">
      <div class="absolute inset-0 opacity-[0.05] bg-no-repeat bg-center bg-contain pointer-events-none" style="background-image:url('/images/pattern-rosette.png')"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <p class="text-xs tracking-[0.3em] text-sand uppercase mb-3">Đặc quyền cư dân</p>
          <h2 class="font-display text-3xl lg:text-5xl mb-4">Tiện ích &amp; trải nghiệm</h2>
          <div class="w-14 h-px bg-sand mx-auto mb-5"></div>
          <p class="max-w-2xl mx-auto text-sage">Hệ sinh thái tiện ích vận hành theo chuẩn lưu trú Masterise Hospitality — từ clubhouse riêng tư đến quảng trường xanh ngoài trời.</p>
        </div>

        <div class="flex justify-center mb-10">
          <div class="inline-flex gap-1 bg-hsg-slate-dark/60 p-1 rounded-full" role="tablist">
            <button class="amenity-tab px-5 py-2 text-xs uppercase tracking-wider rounded-full transition-colors bg-sand text-hsg-slate-dark" data-tab="clubhouse">Clubhouse</button>
            <button class="amenity-tab px-5 py-2 text-xs uppercase tracking-wider rounded-full transition-colors text-sage hover:text-ivory" data-tab="outdoor">Ngoài trời</button>
            <button class="amenity-tab px-5 py-2 text-xs uppercase tracking-wider rounded-full transition-colors text-sage hover:text-ivory" data-tab="integrated">Tích hợp</button>
          </div>
        </div>

        <div class="amenity-panel grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-panel="clubhouse">
          <figure class="rounded-2xl overflow-hidden bg-hsg-slate-dark"><img src="/images/amenity-clubhouse-pool.jpg" alt="Bể bơi clubhouse 4 mùa" class="w-full aspect-[4/3] object-cover" loading="lazy"><figcaption class="p-4 text-sm">Bể bơi 4 mùa</figcaption></figure>
          <figure class="rounded-2xl overflow-hidden bg-hsg-slate-dark"><img src="/images/amenity-clubhouse-bar.jpg" alt="Rooftop bar" class="w-full aspect-[4/3] object-cover" loading="lazy"><figcaption class="p-4 text-sm">Rooftop bar</figcaption></figure>
          <figure class="rounded-2xl overflow-hidden bg-hsg-slate-dark"><img src="/images/interior-business-lounge-l1.jpg" alt="Business lounge" class="w-full aspect-[4/3] object-cover" loading="lazy"><figcaption class="p-4 text-sm">Business lounge</figcaption></figure>
          <figure class="rounded-2xl overflow-hidden bg-hsg-slate-dark"><img src="/images/interior-library-l1.jpg" alt="Thư viện tòa L1" class="w-full aspect-[4/3] object-cover" loading="lazy"><figcaption class="p-4 text-sm">Thư viện L1</figcaption></figure>
          <figure class="rounded-2xl overflow-hidden bg-hsg-slate-dark"><img src="/images/interior-library-l2.jpg" alt="Thư viện tòa L2" class="w-full aspect-[4/3] object-cover" loading="lazy"><figcaption class="p-4 text-sm">Thư viện L2</figcaption></figure>
          <figure class="rounded-2xl overflow-hidden bg-hsg-slate-dark"><img src="/images/interior-gym.jpg" alt="Gym & yoga" class="w-full aspect-[4/3] object-cover" loading="lazy"><figcaption class="p-4 text-sm">Gym &amp; Yoga</figcaption></figure>
          <figure class="rounded-2xl overflow-hidden bg-hsg-slate-dark"><img src="/images/interior-kids.jpg" alt="Kids club" class="w-full aspect-[4/3] object-cover" loading="lazy"><figcaption class="p-4 text-sm">Kids club</figcaption></figure>
          <figure class="rounded-2xl overflow-hidden bg-hsg-slate-dark"><img src="/images/amenity-clubhouse-overview.jpg" alt="Clubhouse tổng thể" class="w-full aspect-[4/3] object-cover" loading="lazy"><figcaption class="p-4 text-sm">Clubhouse tổng thể</figcaption></figure>
          <figure class="rounded-2xl overflow-hidden bg-hsg-slate-dark"><img src="/images/interior-clubhouse-pool.jpg" alt="Bể bơi clubhouse" class="w-full aspect-[4/3] object-cover" loading="lazy"><figcaption class="p-4 text-sm">Bể bơi indoor</figcaption></figure>
        </div>

        <div class="amenity-panel hidden grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-panel="outdoor">
          <figure class="rounded-2xl overflow-hidden bg-hsg-slate-dark"><img src="/images/amenity-waterfall.jpg" alt="Thác nước biểu tượng" class="w-full aspect-[4/3] object-cover" loading="lazy"><figcaption class="p-4 text-sm">Thác nước biểu tượng</figcaption></figure>
          <figure class="rounded-2xl overflow-hidden bg-hsg-slate-dark"><img src="/images/amenity-water-feature-lobby.jpg" alt="Tiểu cảnh nước" class="w-full aspect-[4/3] object-cover" loading="lazy"><figcaption class="p-4 text-sm">Tiểu cảnh nước</figcaption></figure>
          <figure class="rounded-2xl overflow-hidden bg-hsg-slate-dark"><img src="/images/amenity-canopy.jpg" alt="Tiện ích mái vòm" class="w-full aspect-[4/3] object-cover" loading="lazy"><figcaption class="p-4 text-sm">Mái vòm cộng đồng</figcaption></figure>
          <figure class="rounded-2xl overflow-hidden bg-hsg-slate-dark"><img src="/images/amenity-kids-garden.jpg" alt="Vườn diệu kỳ" class="w-full aspect-[4/3] object-cover" loading="lazy"><figcaption class="p-4 text-sm">Vườn diệu kỳ</figcaption></figure>
          <figure class="rounded-2xl overflow-hidden bg-hsg-slate-dark"><img src="/images/amenity-adventure-garden.jpg" alt="Vườn phiêu lưu" class="w-full aspect-[4/3] object-cover" loading="lazy"><figcaption class="p-4 text-sm">Vườn phiêu lưu</figcaption></figure>
          <figure class="rounded-2xl overflow-hidden bg-hsg-slate-dark"><img src="/images/amenity-skating.jpg" alt="Khu skating" class="w-full aspect-[4/3] object-cover" loading="lazy"><figcaption class="p-4 text-sm">Skating park</figcaption></figure>
          <figure class="rounded-2xl overflow-hidden bg-hsg-slate-dark"><img src="/images/amenity-sand-playground.jpg" alt="Khu sân chơi cát" class="w-full aspect-[4/3] object-cover" loading="lazy"><figcaption class="p-4 text-sm">Sân chơi cát sáng tạo</figcaption></figure>
          <figure class="rounded-2xl overflow-hidden bg-hsg-slate-dark"><img src="/images/amenity-family-pavilion.jpg" alt="Family Pavilion" class="w-full aspect-[4/3] object-cover" loading="lazy"><figcaption class="p-4 text-sm">Family Pavilion</figcaption></figure>
          <figure class="rounded-2xl overflow-hidden bg-hsg-slate-dark"><img src="/images/amenity-entrance-water.jpg" alt="Tiểu cảnh sảnh đón" class="w-full aspect-[4/3] object-cover" loading="lazy"><figcaption class="p-4 text-sm">Tiểu cảnh sảnh đón</figcaption></figure>
        </div>

        <div class="amenity-panel hidden grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-panel="integrated">
          <figure class="rounded-2xl overflow-hidden bg-hsg-slate-dark"><img src="/images/interior-main-lobby-1.jpg" alt="Sảnh đón chính" class="w-full aspect-[4/3] object-cover" loading="lazy"><figcaption class="p-4 text-sm">Sảnh đón chính</figcaption></figure>
          <figure class="rounded-2xl overflow-hidden bg-hsg-slate-dark"><img src="/images/interior-main-lobby-2.jpg" alt="Sảnh đón" class="w-full aspect-[4/3] object-cover" loading="lazy"><figcaption class="p-4 text-sm">Khu vực lễ tân</figcaption></figure>
          <figure class="rounded-2xl overflow-hidden bg-hsg-slate-dark"><img src="/images/interior-elevator-hall.jpg" alt="Sảnh thang máy" class="w-full aspect-[4/3] object-cover" loading="lazy"><figcaption class="p-4 text-sm">Sảnh thang máy</figcaption></figure>
          <figure class="rounded-2xl overflow-hidden bg-hsg-slate-dark"><img src="/images/interior-corridor.jpg" alt="Hành lang căn hộ" class="w-full aspect-[4/3] object-cover" loading="lazy"><figcaption class="p-4 text-sm">Hành lang căn hộ</figcaption></figure>
          <figure class="rounded-2xl overflow-hidden bg-hsg-slate-dark"><img src="/images/amenity-entrance-gate.jpg" alt="Cổng chính dự án" class="w-full aspect-[4/3] object-cover" loading="lazy"><figcaption class="p-4 text-sm">Cổng chính dự án</figcaption></figure>
          <figure class="rounded-2xl overflow-hidden bg-hsg-slate-dark"><img src="/images/overview-architecture.jpg" alt="Tổ hợp đô thị" class="w-full aspect-[4/3] object-cover" loading="lazy"><figcaption class="p-4 text-sm">Trường học · phòng khám · shophouse · shopping center · F&amp;B</figcaption></figure>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Add tab handler to `js/main.js`**

Append inside the IIFE in `js/main.js`, before the closing `})();`:

```javascript
  // Amenity tabs
  document.querySelectorAll('.amenity-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      document.querySelectorAll('.amenity-tab').forEach(t => {
        const active = t.dataset.tab === target;
        t.classList.toggle('bg-sand', active);
        t.classList.toggle('text-hsg-slate-dark', active);
        t.classList.toggle('text-sage', !active);
      });
      document.querySelectorAll('.amenity-panel').forEach(p => {
        const show = p.dataset.panel === target;
        p.classList.toggle('hidden', !show);
        p.classList.toggle('grid', show);
      });
    });
  });
```

- [ ] **Step 3: Verify**

Reload page. Section background is dark slate with rosette watermark. Click "Ngoài trời" tab → outdoor panel shows. Click "Tích hợp" → integrated panel shows. Click "Clubhouse" → back to clubhouse. All images load.

- [ ] **Step 4: Commit**

```bash
git add index.html js/main.js
git commit -m "feat(index): tiện ích section with tabbed render gallery" -m "Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push
```

### Task 3.6: Bảng giá & loại căn

**Files:** Modify `index.html` — append after `#tien-ich`.

- [ ] **Step 1: Append the section block**

```html
    <!-- Bảng giá & loại căn -->
    <section id="bang-gia" class="py-20 lg:py-28 bg-white scroll-mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <p class="text-xs tracking-[0.3em] text-sand uppercase mb-3">Tham khảo từ sự kiện khảo sát</p>
          <h2 class="font-display text-3xl lg:text-5xl text-hsg-slate mb-4">Bảng giá &amp; loại căn</h2>
          <div class="w-14 h-px bg-sand mx-auto mb-5"></div>
          <p class="max-w-2xl mx-auto text-hsg-slate/80">Khoảng giá tham khảo dao động từ 128 – 174 triệu/m². Vui lòng liên hệ để nhận bảng giá chi tiết theo từng căn cụ thể.</p>
        </div>

        <div class="overflow-x-auto rounded-3xl border border-warm-gray shadow-sm mb-8">
          <table class="w-full text-sm text-left">
            <thead class="bg-warm-gray text-hsg-slate text-xs uppercase tracking-wider">
              <tr>
                <th class="px-5 py-4">Loại căn</th>
                <th class="px-5 py-4">Diện tích thông thuỷ</th>
                <th class="px-5 py-4">Giá từ (triệu/m²)</th>
                <th class="px-5 py-4">Giá căn từ (tỷ)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-warm-gray">
              <tr><td class="px-5 py-3 font-medium">Studio</td><td class="px-5 py-3">~30 – 38 m²</td><td class="px-5 py-3">128 – 145</td><td class="px-5 py-3">~4,0 – 5,5</td></tr>
              <tr><td class="px-5 py-3 font-medium">1BR</td><td class="px-5 py-3">~46 – 55 m²</td><td class="px-5 py-3">132 – 150</td><td class="px-5 py-3">~6,5 – 8,2</td></tr>
              <tr><td class="px-5 py-3 font-medium">1BR + 1</td><td class="px-5 py-3">~55 – 62 m²</td><td class="px-5 py-3">135 – 155</td><td class="px-5 py-3">~7,5 – 9,5</td></tr>
              <tr><td class="px-5 py-3 font-medium">2BR</td><td class="px-5 py-3">~68 – 78 m²</td><td class="px-5 py-3">130 – 158</td><td class="px-5 py-3">~9,5 – 12,5</td></tr>
              <tr><td class="px-5 py-3 font-medium">2BR + 1</td><td class="px-5 py-3">~78 – 88 m²</td><td class="px-5 py-3">132 – 162</td><td class="px-5 py-3">~10,5 – 14,5</td></tr>
              <tr><td class="px-5 py-3 font-medium">3BR</td><td class="px-5 py-3">~95 – 110 m²</td><td class="px-5 py-3">128 – 165</td><td class="px-5 py-3">~13 – 18</td></tr>
              <tr><td class="px-5 py-3 font-medium">3BR + 1</td><td class="px-5 py-3">~110 – 125 m²</td><td class="px-5 py-3">132 – 170</td><td class="px-5 py-3">~15 – 21</td></tr>
              <tr><td class="px-5 py-3 font-medium">4BR</td><td class="px-5 py-3">~135 – 155 m²</td><td class="px-5 py-3">130 – 174</td><td class="px-5 py-3">~18 – 27</td></tr>
              <tr><td class="px-5 py-3 font-medium">Duplex</td><td class="px-5 py-3">~150 – 200 m²</td><td class="px-5 py-3">145 – 174</td><td class="px-5 py-3">~22 – 34</td></tr>
              <tr><td class="px-5 py-3 font-medium">Penthouse</td><td class="px-5 py-3">~200 – 280 m²</td><td class="px-5 py-3">150 – 174</td><td class="px-5 py-3">~30 – 42</td></tr>
              <tr><td class="px-5 py-3 font-medium">Penthouse Duplex</td><td class="px-5 py-3">~280 – 360 m²</td><td class="px-5 py-3">160 – 174</td><td class="px-5 py-3">~40 – 48</td></tr>
            </tbody>
          </table>
        </div>

        <div class="bg-ivory rounded-3xl p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center gap-5">
          <p class="text-sm text-hsg-slate/80 flex-1 italic">Giá tham khảo từ sự kiện khảo sát The Bloom. Mức giá thực tế có thể chênh lệch theo tầng, view và chính sách từng đợt mở bán. Vui lòng liên hệ để nhận bảng giá chi tiết và bảng hàng cập nhật theo từng căn.</p>
          <a href="#lien-he" class="flex-shrink-0 inline-flex items-center px-8 py-3 bg-sand text-hsg-slate-dark text-xs font-semibold tracking-[0.18em] uppercase rounded-sm hover:bg-sand-dark transition-colors">Tải bảng giá chi tiết</a>
        </div>
      </div>
    </section>
```

> **Note:** The size ranges per unit type above are reasonable estimates aligned with the Masterise survey-event pricing in §1 of the spec. Confirm with the developer before launch and update the table cells if any rows are inaccurate.

- [ ] **Step 2: Verify** — table renders responsively (horizontal scroll on mobile), 11 rows present, sand-tone CTA at bottom.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat(index): bảng giá & loại căn section" -m "Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push
```

### Task 3.7: Chính sách thanh toán

**Files:** Modify `index.html` — append after `#bang-gia`.

- [ ] **Step 1: Append the section block**

```html
    <!-- Chính sách thanh toán -->
    <section id="chinh-sach" class="py-20 lg:py-28 bg-ivory scroll-mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-14">
          <p class="text-xs tracking-[0.3em] text-sand uppercase mb-3">3 phương án linh hoạt</p>
          <h2 class="font-display text-3xl lg:text-5xl text-hsg-slate mb-4">Chính sách thanh toán</h2>
          <div class="w-14 h-px bg-sand mx-auto mb-5"></div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <article class="bg-white rounded-3xl p-8 border border-warm-gray flex flex-col">
            <p class="text-xs tracking-[0.3em] text-sand uppercase mb-3">Phương án 01</p>
            <h3 class="font-display text-2xl text-hsg-slate mb-4">Thanh toán sớm</h3>
            <p class="font-display text-5xl text-lum-green mb-4">7%<span class="font-sans text-base text-hsg-slate/60"> chiết khấu</span></p>
            <ul class="text-sm space-y-2 text-hsg-slate/80 leading-relaxed mt-2">
              <li>Chiết khấu lên đến 7% giá trị căn hộ.</li>
              <li>Thanh toán toàn bộ giá trị còn lại trong 30 ngày sau ký HĐMB.</li>
              <li>Phù hợp khách hàng có dòng tiền sẵn sàng.</li>
            </ul>
          </article>

          <article class="bg-white rounded-3xl p-8 border border-warm-gray flex flex-col">
            <p class="text-xs tracking-[0.3em] text-sand uppercase mb-3">Phương án 02</p>
            <h3 class="font-display text-2xl text-hsg-slate mb-4">Thanh toán theo đợt</h3>
            <p class="font-display text-5xl text-lum-green mb-4">12 đợt<span class="font-sans text-base text-hsg-slate/60"> trong ~3 năm</span></p>
            <ul class="text-sm space-y-2 text-hsg-slate/80 leading-relaxed mt-2">
              <li>12 đợt thanh toán trải đều khoảng 3 năm kể từ ký HĐMB.</li>
              <li>Linh hoạt theo tiến độ xây dựng và bàn giao.</li>
              <li>Phù hợp dòng tiền dần tích lũy.</li>
            </ul>
          </article>

          <article class="bg-lum-green text-ivory rounded-3xl p-8 flex flex-col relative overflow-hidden">
            <p class="text-xs tracking-[0.3em] text-sand uppercase mb-3">Phương án 03</p>
            <h3 class="font-display text-2xl mb-4">Vay ngân hàng 70%</h3>
            <p class="font-display text-5xl mb-4">0%<span class="font-sans text-base text-sage"> đến Q2/2029</span></p>
            <ul class="text-sm space-y-2 text-sage leading-relaxed mt-2">
              <li>Hỗ trợ vay đến 70% giá trị căn hộ.</li>
              <li><strong class="text-ivory">Lãi suất 0%</strong> tới thời điểm bàn giao Q2/2029.</li>
              <li>Ân hạn nợ gốc 24 tháng. Lãi suất 7,5%/năm sau ân hạn.</li>
            </ul>
          </article>
        </div>

        <div class="bg-white rounded-3xl p-6 lg:p-8 border border-sage/40">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p class="font-display text-3xl text-lum-green mb-1">24 tháng</p>
              <p class="text-xs text-hsg-slate/70 tracking-wider uppercase">Miễn phí quản lý — khách mới</p>
            </div>
            <div class="md:border-x border-warm-gray">
              <p class="font-display text-3xl text-lum-green mb-1">48 tháng</p>
              <p class="text-xs text-hsg-slate/70 tracking-wider uppercase">Miễn phí quản lý — cư dân Masterise</p>
            </div>
            <div>
              <p class="font-display text-3xl text-lum-green mb-1">+1% &amp; +12 tháng</p>
              <p class="text-xs text-hsg-slate/70 tracking-wider uppercase">Ưu đãi Early Bird</p>
            </div>
          </div>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Verify, then commit**

```bash
git add index.html
git commit -m "feat(index): chính sách thanh toán section" -m "Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push
```

### Task 3.8: Pháp lý

**Files:** Modify `index.html` — append after `#chinh-sach`.

- [ ] **Step 1: Append the section block**

```html
    <!-- Pháp lý -->
    <section id="phap-ly" class="py-20 lg:py-28 bg-white scroll-mt-20">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <p class="text-xs tracking-[0.3em] text-sand uppercase mb-3">Minh bạch &amp; an toàn</p>
          <h2 class="font-display text-3xl lg:text-5xl text-hsg-slate mb-4">Pháp lý dự án</h2>
          <div class="w-14 h-px bg-sand mx-auto mb-5"></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-ivory rounded-3xl p-7"><p class="text-xs tracking-[0.3em] text-sand uppercase mb-3">Người mua Việt Nam</p><h3 class="font-display text-xl text-hsg-slate mb-3">Sở hữu lâu dài</h3><p class="text-sm text-hsg-slate/80 leading-relaxed">Sổ đỏ riêng từng căn theo Luật Nhà ở Việt Nam, đảm bảo quyền sở hữu vô thời hạn.</p></div>
          <div class="bg-ivory rounded-3xl p-7"><p class="text-xs tracking-[0.3em] text-sand uppercase mb-3">Người mua nước ngoài</p><h3 class="font-display text-xl text-hsg-slate mb-3">Sở hữu 50 năm</h3><p class="text-sm text-hsg-slate/80 leading-relaxed">Quyền sở hữu 50 năm theo quy định Luật Nhà ở dành cho cá nhân/tổ chức nước ngoài.</p></div>
          <div class="bg-ivory rounded-3xl p-7"><p class="text-xs tracking-[0.3em] text-sand uppercase mb-3">Bảo lãnh ngân hàng</p><h3 class="font-display text-xl text-hsg-slate mb-3">Đang cập nhật</h3><p class="text-sm text-hsg-slate/80 leading-relaxed">Thông tin ngân hàng bảo lãnh sẽ được Chủ đầu tư công bố trong thời gian tới — vui lòng liên hệ để được cập nhật sớm.</p></div>
          <div class="bg-ivory rounded-3xl p-7"><p class="text-xs tracking-[0.3em] text-sand uppercase mb-3">Tình trạng GPMB</p><h3 class="font-display text-xl text-hsg-slate mb-3">Đã hoàn tất di dời 3/8 nhà máy</h3><p class="text-sm text-hsg-slate/80 leading-relaxed">Khu Cao–Xà–Lá đang được di dời theo lộ trình, hoạt động công nghiệp chuyển ra khu vực ngoại thành.</p></div>
        </div>
      </div>
    </section>
```

> **Open item:** swap the "Đang cập nhật" bank-guarantee card with the actual list once Masterise publishes it (spec §16).

- [ ] **Step 2: Verify, then commit**

```bash
git add index.html
git commit -m "feat(index): pháp lý section" -m "Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push
```

### Task 3.9: Tiến độ

**Files:** Modify `index.html` — append after `#phap-ly`.

- [ ] **Step 1: Append the section block**

```html
    <!-- Tiến độ -->
    <section id="tien-do" class="py-20 lg:py-28 bg-ivory scroll-mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-14">
          <p class="text-xs tracking-[0.3em] text-sand uppercase mb-3">Lộ trình triển khai</p>
          <h2 class="font-display text-3xl lg:text-5xl text-hsg-slate mb-4">Tiến độ &amp; bàn giao</h2>
          <div class="w-14 h-px bg-sand mx-auto mb-5"></div>
        </div>

        <div class="rounded-3xl overflow-hidden shadow-xl mb-14">
          <img src="/images/overview-masterplan.jpg" alt="Mặt bằng tổng thể phân khu LUMIÈRE Hanoi Seasons Garden" class="w-full h-auto" loading="lazy">
        </div>

        <ol class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <li class="bg-white rounded-3xl p-6 border border-warm-gray"><p class="text-xs tracking-[0.3em] text-sand uppercase mb-2">Đang triển khai</p><h3 class="font-display text-xl text-hsg-slate mb-1">Booking The Bloom</h3><p class="text-sm text-hsg-slate/70">Nhận đặt chỗ phân khu L1 &amp; L2.</p></li>
          <li class="bg-white rounded-3xl p-6 border border-warm-gray"><p class="text-xs tracking-[0.3em] text-sand uppercase mb-2">10/2026</p><h3 class="font-display text-xl text-hsg-slate mb-1">Ký HĐMB</h3><p class="text-sm text-hsg-slate/70">Khách booking ký Hợp đồng mua bán chính thức.</p></li>
          <li class="bg-white rounded-3xl p-6 border border-warm-gray"><p class="text-xs tracking-[0.3em] text-sand uppercase mb-2">2027 – 2028</p><h3 class="font-display text-xl text-hsg-slate mb-1">Thi công &amp; cất nóc</h3><p class="text-sm text-hsg-slate/70">Triển khai xây dựng và cất nóc các tòa The Bloom.</p></li>
          <li class="bg-lum-green text-ivory rounded-3xl p-6"><p class="text-xs tracking-[0.3em] text-sand uppercase mb-2">Q2/2029</p><h3 class="font-display text-xl mb-1">Bàn giao</h3><p class="text-sm text-sage">Bàn giao căn hộ The Bloom đến cư dân.</p></li>
        </ol>
      </div>
    </section>
```

- [ ] **Step 2: Verify, then commit**

```bash
git add index.html
git commit -m "feat(index): tiến độ section" -m "Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push
```

### Task 3.10: Tin tức (latest 3 from blog)

**Files:** Modify `index.html` — append after `#tien-do`. Modify `js/main.js` — add loader.

- [ ] **Step 1: Append the section block**

```html
    <!-- Tin tức -->
    <section id="tin-tuc" class="py-20 lg:py-28 bg-sage-light/40 scroll-mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-14">
          <p class="text-xs tracking-[0.3em] text-sand uppercase mb-3">Cập nhật mới</p>
          <h2 class="font-display text-3xl lg:text-5xl text-hsg-slate mb-4">Tin tức &amp; phân tích</h2>
          <div class="w-14 h-px bg-sand mx-auto mb-5"></div>
        </div>
        <div id="latest-posts" class="grid grid-cols-1 md:grid-cols-3 gap-6"></div>
        <div class="text-center mt-12">
          <a href="/blog/" class="inline-flex items-center px-8 py-3 border border-lum-green text-lum-green text-xs font-semibold tracking-[0.18em] uppercase rounded-sm hover:bg-lum-green hover:text-ivory transition-colors">Xem tất cả tin tức</a>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Add the latest-posts loader to `js/main.js`** — append inside the IIFE, before the closing `})();`

```javascript
  // Latest posts on index — uses safe DOM methods, no innerHTML
  const latestEl = document.getElementById('latest-posts');
  if (latestEl) {
    fetch('/blog/posts.json')
      .then(r => r.json())
      .then(posts => {
        const top = posts.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
        top.forEach(p => {
          const card = document.createElement('a');
          card.href = `/blog/${p.slug}`;
          card.className = 'bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col';
          const img = document.createElement('img');
          img.src = `/images/${p.image}`;
          img.alt = p.title;
          img.loading = 'lazy';
          img.className = 'w-full aspect-[16/9] object-cover';
          card.appendChild(img);
          const body = document.createElement('div');
          body.className = 'p-5 flex flex-col flex-1';
          const meta = document.createElement('p');
          meta.className = 'text-xs tracking-[0.3em] uppercase text-sand mb-2';
          meta.textContent = p.category;
          body.appendChild(meta);
          const title = document.createElement('h3');
          title.className = 'font-display text-lg text-hsg-slate mb-2 leading-snug';
          title.textContent = p.title;
          body.appendChild(title);
          const excerpt = document.createElement('p');
          excerpt.className = 'text-sm text-hsg-slate/70 leading-relaxed flex-1';
          excerpt.textContent = p.excerpt;
          body.appendChild(excerpt);
          const cta = document.createElement('span');
          cta.className = 'mt-4 text-xs uppercase tracking-wider text-lum-green font-semibold';
          cta.textContent = 'Đọc tiếp →';
          body.appendChild(cta);
          card.appendChild(body);
          latestEl.appendChild(card);
        });
      })
      .catch(() => { /* posts.json not yet present — silent */ });
  }
```

- [ ] **Step 3: Verify, then commit**

```bash
git add index.html js/main.js
git commit -m "feat(index): tin tức section + latest posts loader" -m "Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push
```

### Task 3.11: Liên hệ + lead form markup

**Files:** Modify `index.html` — append after `#tin-tuc`.

- [ ] **Step 1: Append the section block**

```html
    <!-- Liên hệ -->
    <section id="lien-he" class="py-20 lg:py-28 bg-hsg-slate text-ivory scroll-mt-20 relative overflow-hidden">
      <div class="absolute inset-0 opacity-[0.06] bg-no-repeat bg-right-bottom bg-contain pointer-events-none" style="background-image:url('/images/pattern-rosette.png')"></div>
      <div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-14">
          <p class="text-xs tracking-[0.3em] text-sand uppercase mb-3">Phòng Kinh Doanh chính thức</p>
          <h2 class="font-display text-3xl lg:text-5xl mb-4">Đăng ký nhận thông tin</h2>
          <div class="w-14 h-px bg-sand mx-auto mb-5"></div>
          <p class="max-w-2xl mx-auto text-sage">Để lại thông tin để nhận bảng giá, mặt bằng và chính sách mới nhất từ PKD LUMIÈRE Hanoi Seasons Garden.</p>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div class="lg:col-span-2 space-y-6">
            <div><p class="text-xs tracking-[0.3em] text-sand uppercase mb-2">Hotline tư vấn</p><a href="tel:0564928999" class="font-display text-3xl lg:text-4xl text-ivory hover:text-sand transition-colors">0564.928.999</a></div>
            <div><p class="text-xs tracking-[0.3em] text-sand uppercase mb-2">Zalo</p><a href="https://zalo.me/0564928999" rel="noopener" class="text-lg text-ivory hover:text-sand transition-colors">zalo.me/0564928999</a></div>
            <div><p class="text-xs tracking-[0.3em] text-sand uppercase mb-2">Dự án</p><p class="text-base text-sage leading-relaxed">LUMIÈRE Hanoi Seasons Garden<br>233 Nguyễn Trãi, Thanh Xuân, Hà Nội</p></div>
          </div>
          <form id="lead-form" class="lg:col-span-3 bg-hsg-slate-dark/60 backdrop-blur rounded-3xl p-6 lg:p-8 border border-sage/20 space-y-4" novalidate>
            <input type="text" name="_gotcha" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px">
            <div><label for="lf-name" class="block text-xs uppercase tracking-wider text-sage mb-2">Họ và tên *</label><input id="lf-name" name="name" type="text" required minlength="2" class="w-full bg-hsg-slate-dark border border-sage/30 rounded-lg px-4 py-3 text-ivory placeholder-sage/40 focus:outline-none focus:border-sand" placeholder="Nguyễn Văn A"></div>
            <div><label for="lf-phone" class="block text-xs uppercase tracking-wider text-sage mb-2">Số điện thoại *</label><input id="lf-phone" name="phone" type="tel" required pattern="0[0-9]{9}" class="w-full bg-hsg-slate-dark border border-sage/30 rounded-lg px-4 py-3 text-ivory placeholder-sage/40 focus:outline-none focus:border-sand" placeholder="09xx xxx xxx"></div>
            <div><label for="lf-msg" class="block text-xs uppercase tracking-wider text-sage mb-2">Nội dung quan tâm</label><textarea id="lf-msg" name="message" rows="3" class="w-full bg-hsg-slate-dark border border-sage/30 rounded-lg px-4 py-3 text-ivory placeholder-sage/40 focus:outline-none focus:border-sand" placeholder="Loại căn quan tâm, ngân sách dự kiến..."></textarea></div>
            <label class="flex items-start gap-3 text-sm text-sage"><input type="checkbox" name="want_pricelist" value="1" checked class="mt-1 accent-sand"><span>Tôi muốn nhận bảng giá &amp; mặt bằng The Bloom qua email/Zalo.</span></label>
            <button type="submit" class="w-full inline-flex items-center justify-center px-8 py-4 bg-sand text-hsg-slate-dark text-xs font-semibold tracking-[0.18em] uppercase rounded-sm hover:bg-sand-dark transition-colors">Gửi đăng ký</button>
            <p id="lf-status" class="text-sm text-center hidden"></p>
          </form>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Verify, then commit**

```bash
git add index.html
git commit -m "feat(index): liên hệ section + lead form markup" -m "Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push
```

---

## Phase 4 — Lead form behavior

### Task 4.1: Wire lead form to Formspree

**Files:** Modify `js/main.js`, `README.md`.

- [ ] **Step 1: Append the form handler inside the IIFE in `js/main.js`** (before closing `})();`)

```javascript
  // Lead form — uses safe DOM, no innerHTML
  const leadForm = document.getElementById('lead-form');
  if (leadForm) {
    const status = document.getElementById('lf-status');
    const PHONE_RE = /^0\d{9}$/;
    leadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.classList.remove('hidden', 'text-sand', 'text-red-300');
      const data = new FormData(leadForm);
      if (data.get('_gotcha')) return;
      const name = (data.get('name') || '').toString().trim();
      const phone = (data.get('phone') || '').toString().trim();
      if (name.length < 2) {
        status.classList.add('text-red-300');
        status.textContent = 'Vui lòng nhập họ tên (ít nhất 2 ký tự).';
        status.classList.remove('hidden');
        return;
      }
      if (!PHONE_RE.test(phone)) {
        status.classList.add('text-red-300');
        status.textContent = 'Số điện thoại không hợp lệ. Định dạng: 0XXXXXXXXX';
        status.classList.remove('hidden');
        return;
      }
      try {
        const resp = await fetch('https://formspree.io/f/REPLACE_ME', {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' },
        });
        if (!resp.ok) throw new Error('submit_failed');
        status.classList.add('text-sand');
        status.textContent = 'Cảm ơn — Phòng Kinh Doanh sẽ liên hệ trong thời gian sớm nhất.';
        status.classList.remove('hidden');
        leadForm.reset();
      } catch (err) {
        status.classList.add('text-red-300');
        status.textContent = 'Có lỗi khi gửi. Vui lòng gọi 0564.928.999.';
        status.classList.remove('hidden');
      }
    });
  }
```

- [ ] **Step 2: Document the Formspree swap in `README.md`** — append:

```markdown
## Pre-launch checklist

- Replace `https://formspree.io/f/REPLACE_ME` in `js/main.js` (search & replace) with the production Formspree endpoint.
- Verify lead form submissions land in the Formspree inbox before going live.
```

- [ ] **Step 3: Verify**

Open `http://localhost:8000/#lien-he`. Submit empty form → name-validation error. Type "Test" + "12345" → phone error. Type valid phone → submit hits `REPLACE_ME` (returns 404 — expected) → "Có lỗi khi gửi..." appears. Inspect Network tab to confirm the POST hit formspree.io.

- [ ] **Step 4: Commit**

```bash
git add js/main.js README.md
git commit -m "feat: lead form handler with phone validation + honeypot" -m "Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push
```

---

## Phase 5 — Tower detail pages

### Task 5.1: `toa-l1.html`

**Files:** Create `toa-l1.html`, `js/tower.js`.

- [ ] **Step 1: Build `toa-l1.html`** by copying the entire shell of `index.html` (head + header + footer + closing tags). Replace these `<head>` values:

```
<title>Tòa L1 — Phân khu The Bloom | LUMIÈRE Hanoi Seasons Garden</title>
<meta name="description" content="Chi tiết Tòa L1 The Bloom — mặt bằng điển hình, phối cảnh nội thất và liên hệ tư vấn căn cụ thể. Hotline 0564.928.999.">
<link rel="canonical" href="https://www.pkdhanoiseasonsgarden.com/toa-l1.html">
<meta property="og:url" content="https://www.pkdhanoiseasonsgarden.com/toa-l1.html">
<meta property="og:title" content="Tòa L1 — Phân khu The Bloom | LUMIÈRE Hanoi Seasons Garden">
```

Replace the `<main>` body with:

```html
    <!-- Sub-hero -->
    <section id="hero" class="relative min-h-[60vh] flex items-end overflow-hidden">
      <div class="absolute inset-0">
        <img src="/images/thebloom-l1-facade.jpg" alt="Phối cảnh facade Tòa L1 — The Bloom" class="w-full h-full object-cover" loading="eager">
        <div class="absolute inset-0 bg-gradient-to-b from-hsg-slate/30 via-transparent to-hsg-slate-dark/80"></div>
      </div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 w-full text-ivory">
        <nav class="text-xs tracking-wider uppercase text-sage mb-4"><a href="/" class="hover:text-sand">PKD HSG</a> · <a href="/#the-bloom" class="hover:text-sand">Phân khu The Bloom</a> · <span class="text-ivory">Tòa L1</span></nav>
        <p class="text-xs tracking-[0.4em] text-sand mb-3">PHÂN KHU THE BLOOM</p>
        <h1 class="font-display text-5xl lg:text-7xl mb-3">Tòa L1</h1>
        <p class="text-base lg:text-lg text-sage max-w-2xl">Tòa tháp mở đầu phân khu The Bloom — kiến tạo ngôn ngữ thiết kế "tinh khôi" cho LUMIÈRE Hanoi Seasons Garden.</p>
      </div>
    </section>

    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-warm-gray rounded-3xl p-6 text-center"><p class="font-display text-3xl text-lum-green">36–46</p><p class="text-xs uppercase tracking-wider text-hsg-slate/60 mt-2">tầng (xác nhận với CĐT)</p></div>
        <div class="bg-warm-gray rounded-3xl p-6 text-center"><p class="font-display text-3xl text-lum-green">10</p><p class="text-xs uppercase tracking-wider text-hsg-slate/60 mt-2">loại căn</p></div>
        <div class="bg-warm-gray rounded-3xl p-6 text-center"><p class="font-display text-3xl text-lum-green">3 hầm</p><p class="text-xs uppercase tracking-wider text-hsg-slate/60 mt-2">đỗ xe</p></div>
        <div class="bg-warm-gray rounded-3xl p-6 text-center"><p class="font-display text-3xl text-lum-green">Q2/2029</p><p class="text-xs uppercase tracking-wider text-hsg-slate/60 mt-2">bàn giao</p></div>
      </div>
    </section>

    <section id="mat-bang" class="py-20 bg-ivory">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <p class="text-xs tracking-[0.3em] text-sand uppercase mb-3">Layout điển hình</p>
          <h2 class="font-display text-3xl lg:text-5xl text-hsg-slate mb-4">Mặt bằng từng loại căn</h2>
          <div class="w-14 h-px bg-sand mx-auto"></div>
        </div>
        <div class="flex flex-wrap justify-center gap-2 mb-10" role="tablist">
          <button class="fp-tab px-4 py-2 text-xs uppercase tracking-wider rounded-full bg-lum-green text-ivory" data-fp="studio">Studio</button>
          <button class="fp-tab px-4 py-2 text-xs uppercase tracking-wider rounded-full bg-warm-gray text-hsg-slate" data-fp="1br">1BR</button>
          <button class="fp-tab px-4 py-2 text-xs uppercase tracking-wider rounded-full bg-warm-gray text-hsg-slate" data-fp="1br-plus">1BR+1</button>
          <button class="fp-tab px-4 py-2 text-xs uppercase tracking-wider rounded-full bg-warm-gray text-hsg-slate" data-fp="2br">2BR</button>
          <button class="fp-tab px-4 py-2 text-xs uppercase tracking-wider rounded-full bg-warm-gray text-hsg-slate" data-fp="2br-plus">2BR+1</button>
          <button class="fp-tab px-4 py-2 text-xs uppercase tracking-wider rounded-full bg-warm-gray text-hsg-slate" data-fp="3br">3BR</button>
          <button class="fp-tab px-4 py-2 text-xs uppercase tracking-wider rounded-full bg-warm-gray text-hsg-slate" data-fp="3br-plus">3BR+1</button>
          <button class="fp-tab px-4 py-2 text-xs uppercase tracking-wider rounded-full bg-warm-gray text-hsg-slate" data-fp="4br">4BR</button>
          <button class="fp-tab px-4 py-2 text-xs uppercase tracking-wider rounded-full bg-warm-gray text-hsg-slate" data-fp="duplex">Duplex</button>
          <button class="fp-tab px-4 py-2 text-xs uppercase tracking-wider rounded-full bg-warm-gray text-hsg-slate" data-fp="penthouse">Penthouse</button>
        </div>

        <div class="fp-panel" data-fp-panel="studio"><figure class="bg-white rounded-3xl shadow-sm overflow-hidden cursor-zoom-in" data-lightbox><img src="/images/floorplan-l1-studio.jpg" alt="Mặt bằng điển hình Studio Tòa L1" class="w-full h-auto"><figcaption class="p-5 text-sm text-hsg-slate/80">Studio · ~30 – 38 m²</figcaption></figure></div>
        <div class="fp-panel hidden" data-fp-panel="1br"><figure class="bg-white rounded-3xl shadow-sm overflow-hidden cursor-zoom-in" data-lightbox><img src="/images/floorplan-l1-1br.jpg" alt="Mặt bằng điển hình 1BR Tòa L1" class="w-full h-auto"><figcaption class="p-5 text-sm text-hsg-slate/80">1 phòng ngủ · ~46 – 55 m²</figcaption></figure></div>
        <div class="fp-panel hidden" data-fp-panel="1br-plus"><figure class="bg-white rounded-3xl shadow-sm overflow-hidden cursor-zoom-in" data-lightbox><img src="/images/floorplan-l1-1br-plus.jpg" alt="Mặt bằng điển hình 1BR+1 Tòa L1" class="w-full h-auto"><figcaption class="p-5 text-sm text-hsg-slate/80">1 phòng ngủ + 1 đa năng · ~55 – 62 m²</figcaption></figure></div>
        <div class="fp-panel hidden" data-fp-panel="2br"><figure class="bg-white rounded-3xl shadow-sm overflow-hidden cursor-zoom-in" data-lightbox><img src="/images/floorplan-l1-2br.jpg" alt="Mặt bằng điển hình 2BR Tòa L1" class="w-full h-auto"><figcaption class="p-5 text-sm text-hsg-slate/80">2 phòng ngủ · ~68 – 78 m²</figcaption></figure></div>
        <div class="fp-panel hidden" data-fp-panel="2br-plus"><figure class="bg-white rounded-3xl shadow-sm overflow-hidden cursor-zoom-in" data-lightbox><img src="/images/floorplan-l1-2br-plus.jpg" alt="Mặt bằng điển hình 2BR+1 Tòa L1" class="w-full h-auto"><figcaption class="p-5 text-sm text-hsg-slate/80">2 phòng ngủ + 1 đa năng · ~78 – 88 m²</figcaption></figure></div>
        <div class="fp-panel hidden" data-fp-panel="3br"><figure class="bg-white rounded-3xl shadow-sm overflow-hidden cursor-zoom-in" data-lightbox><img src="/images/floorplan-l1-3br.jpg" alt="Mặt bằng điển hình 3BR Tòa L1" class="w-full h-auto"><figcaption class="p-5 text-sm text-hsg-slate/80">3 phòng ngủ · ~95 – 110 m²</figcaption></figure></div>
        <div class="fp-panel hidden" data-fp-panel="3br-plus"><figure class="bg-white rounded-3xl shadow-sm overflow-hidden cursor-zoom-in" data-lightbox><img src="/images/floorplan-l1-3br-plus.jpg" alt="Mặt bằng điển hình 3BR+1 Tòa L1" class="w-full h-auto"><figcaption class="p-5 text-sm text-hsg-slate/80">3 phòng ngủ + 1 đa năng · ~110 – 125 m²</figcaption></figure></div>
        <div class="fp-panel hidden" data-fp-panel="4br"><figure class="bg-white rounded-3xl shadow-sm overflow-hidden cursor-zoom-in" data-lightbox><img src="/images/floorplan-l1-4br.jpg" alt="Mặt bằng điển hình 4BR Tòa L1" class="w-full h-auto"><figcaption class="p-5 text-sm text-hsg-slate/80">4 phòng ngủ · ~135 – 155 m²</figcaption></figure></div>
        <div class="fp-panel hidden" data-fp-panel="duplex"><figure class="bg-white rounded-3xl shadow-sm overflow-hidden cursor-zoom-in" data-lightbox><img src="/images/floorplan-l1-duplex.jpg" alt="Mặt bằng điển hình Duplex Tòa L1" class="w-full h-auto"><figcaption class="p-5 text-sm text-hsg-slate/80">Duplex · ~150 – 200 m²</figcaption></figure></div>
        <div class="fp-panel hidden" data-fp-panel="penthouse"><figure class="bg-white rounded-3xl shadow-sm overflow-hidden cursor-zoom-in" data-lightbox><img src="/images/floorplan-l1-penthouse.jpg" alt="Mặt bằng điển hình Penthouse Tòa L1" class="w-full h-auto"><figcaption class="p-5 text-sm text-hsg-slate/80">Penthouse · ~200 – 280 m²</figcaption></figure></div>

        <div class="mt-12 bg-white rounded-3xl p-6 lg:p-8 border border-sage/40 flex flex-col md:flex-row items-start md:items-center gap-5">
          <p class="text-sm text-hsg-slate/80 flex-1 italic">Để xem mặt bằng đầy đủ tất cả các tầng/căn của Tòa L1, vui lòng để lại thông tin — file PDF sẽ được gửi qua email/Zalo.</p>
          <a href="/docs/floorplans-l1-the-bloom.pdf" download class="flex-shrink-0 inline-flex items-center px-8 py-3 bg-sand text-hsg-slate-dark text-xs font-semibold tracking-[0.18em] uppercase rounded-sm hover:bg-sand-dark transition-colors">Tải mặt bằng đầy đủ (PDF)</a>
        </div>
      </div>
    </section>

    <section id="noi-that" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <p class="text-xs tracking-[0.3em] text-sand uppercase mb-3">Bộ sưu tập phối cảnh</p>
          <h2 class="font-display text-3xl lg:text-5xl text-hsg-slate mb-4">Phối cảnh nội thất</h2>
          <div class="w-14 h-px bg-sand mx-auto"></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <figure class="rounded-2xl overflow-hidden cursor-zoom-in" data-lightbox><img src="/images/interior-2br-living-1.jpg" alt="2BR Living + Kitchen" class="w-full aspect-[4/3] object-cover" loading="lazy"></figure>
          <figure class="rounded-2xl overflow-hidden cursor-zoom-in" data-lightbox><img src="/images/interior-2br-master.jpg" alt="2BR Master bedroom" class="w-full aspect-[4/3] object-cover" loading="lazy"></figure>
          <figure class="rounded-2xl overflow-hidden cursor-zoom-in" data-lightbox><img src="/images/interior-4br-living-op1.jpg" alt="4BR Living + Kitchen — Option 1" class="w-full aspect-[4/3] object-cover" loading="lazy"></figure>
          <figure class="rounded-2xl overflow-hidden cursor-zoom-in" data-lightbox><img src="/images/interior-4br-master.jpg" alt="4BR Master bedroom" class="w-full aspect-[4/3] object-cover" loading="lazy"></figure>
          <figure class="rounded-2xl overflow-hidden cursor-zoom-in" data-lightbox><img src="/images/interior-main-lobby-1.jpg" alt="Sảnh đón chính Tòa L1" class="w-full aspect-[4/3] object-cover" loading="lazy"></figure>
          <figure class="rounded-2xl overflow-hidden cursor-zoom-in" data-lightbox><img src="/images/interior-business-lounge-l1.jpg" alt="Business lounge Tòa L1" class="w-full aspect-[4/3] object-cover" loading="lazy"></figure>
          <figure class="rounded-2xl overflow-hidden cursor-zoom-in" data-lightbox><img src="/images/interior-library-l1.jpg" alt="Thư viện Tòa L1" class="w-full aspect-[4/3] object-cover" loading="lazy"></figure>
          <figure class="rounded-2xl overflow-hidden cursor-zoom-in" data-lightbox><img src="/images/interior-corridor.jpg" alt="Hành lang căn hộ" class="w-full aspect-[4/3] object-cover" loading="lazy"></figure>
          <figure class="rounded-2xl overflow-hidden cursor-zoom-in" data-lightbox><img src="/images/interior-elevator-hall.jpg" alt="Sảnh thang máy" class="w-full aspect-[4/3] object-cover" loading="lazy"></figure>
        </div>
      </div>
    </section>

    <!-- Copy the entire <section id="lien-he">…</section> from index.html and paste it here. Keep id="lien-he" — it's only on this page now. -->

    <div class="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-hsg-slate text-ivory px-3 py-2 flex gap-2 shadow-2xl">
      <a href="tel:0564928999" class="flex-1 text-center bg-lum-green py-3 text-xs uppercase tracking-wider rounded-sm">Gọi PKD</a>
      <a href="https://zalo.me/0564928999" class="flex-1 text-center bg-zalo py-3 text-xs uppercase tracking-wider rounded-sm">Zalo</a>
      <a href="#lien-he" class="flex-1 text-center bg-sand text-hsg-slate-dark py-3 text-xs uppercase tracking-wider rounded-sm">Tư vấn</a>
    </div>

    <div id="lightbox" class="hidden fixed inset-0 z-50 bg-hsg-slate-dark/95 items-center justify-center p-4">
      <button id="lightbox-close" class="absolute top-4 right-4 text-ivory text-3xl">&times;</button>
      <img id="lightbox-img" src="" alt="" class="max-w-full max-h-full object-contain rounded-lg">
    </div>
```

Add `<script src="/js/tower.js"></script>` right after the existing `<script src="/js/main.js"></script>` line.

- [ ] **Step 2: Create `js/tower.js`**

```javascript
// Tower page — floorplan tabs + image lightbox
(() => {
  document.querySelectorAll('.fp-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.fp;
      document.querySelectorAll('.fp-tab').forEach(t => {
        const active = t.dataset.fp === target;
        t.classList.toggle('bg-lum-green', active);
        t.classList.toggle('text-ivory', active);
        t.classList.toggle('bg-warm-gray', !active);
        t.classList.toggle('text-hsg-slate', !active);
      });
      document.querySelectorAll('.fp-panel').forEach(p => {
        p.classList.toggle('hidden', p.dataset.fpPanel !== target);
      });
    });
  });

  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbClose = document.getElementById('lightbox-close');
  if (lb && lbImg && lbClose) {
    document.querySelectorAll('[data-lightbox] img').forEach(img => {
      img.parentElement.addEventListener('click', () => {
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        lb.classList.remove('hidden');
        lb.classList.add('flex');
      });
    });
    const close = () => { lb.classList.add('hidden'); lb.classList.remove('flex'); lbImg.src = ''; };
    lbClose.addEventListener('click', close);
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }
})();
```

- [ ] **Step 3: Verify**

Open `http://localhost:8000/toa-l1.html`. Sub-hero shows L1 facade + breadcrumb, 4 stat tiles, floor-plan tabs switch images, "Tải mặt bằng đầy đủ" downloads the PDF (or 404s until Task 1.3 PDFs are produced — that's expected order; if PDFs already exist it downloads), interior gallery clicks open lightbox, Esc closes, mobile bar appears on narrow viewport.

- [ ] **Step 4: Commit**

```bash
git add toa-l1.html js/tower.js
git commit -m "feat: tower L1 detail page" -m "Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push
```

### Task 5.2: `toa-l2.html`

**Files:** Create `toa-l2.html`.

- [ ] **Step 1: Duplicate and adapt**

```bash
cp toa-l1.html toa-l2.html
```

Apply find-and-replace in `toa-l2.html`:

| Find | Replace |
|------|---------|
| `Tòa L1 — Phân khu The Bloom` | `Tòa L2 — Phân khu The Bloom` |
| `Tòa L1` | `Tòa L2` |
| `toa-l1.html` | `toa-l2.html` |
| `/images/thebloom-l1-facade.jpg` | `/images/thebloom-l2-facade.jpg` |
| `/images/floorplan-l1-` | `/images/floorplan-l2-` |
| `/docs/floorplans-l1-the-bloom.pdf` | `/docs/floorplans-l2-the-bloom.pdf` |
| `/images/interior-business-lounge-l1.jpg` | `/images/interior-library-l2.jpg` |
| `Business lounge Tòa L1` | `Thư viện Tòa L2` |
| `Thư viện Tòa L1` | `Thư viện Tòa L2` |
| `/images/interior-library-l1.jpg` | `/images/interior-library-l2.jpg` |
| `Sảnh đón chính Tòa L1` | `Sảnh đón chính Tòa L2` |
| `Tòa tháp mở đầu phân khu The Bloom — kiến tạo ngôn ngữ thiết kế "tinh khôi" cho LUMIÈRE Hanoi Seasons Garden.` | `Tòa tháp song hành cùng L1 trong phân khu The Bloom — tối ưu ánh sáng tự nhiên và tầm nhìn nội khu.` |

Remove the `data-fp="1br-plus"` button + its `.fp-panel` block, and the `data-fp="3br-plus"` button + its panel — the spec's L2 pill list excludes those types. Double-check against your PDF mapping from Task 1.3.

- [ ] **Step 2: Verify, then commit**

```bash
git add toa-l2.html
git commit -m "feat: tower L2 detail page" -m "Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push
```

---

## Phase 6 — Blog

### Task 6.1: Blog scaffold

**Files:** Create `blog/index.html`, `blog/posts.json`, `blog/blog-shared.js`.

- [ ] **Step 1: Create `blog/posts.json`**

```json
[
  {
    "slug": "tong-quan-lumiere-hanoi-seasons-garden.html",
    "title": "Tổng quan LUMIÈRE Hanoi Seasons Garden — Tổ hợp 10 tòa tháp Masterise giữa lòng Thanh Xuân",
    "excerpt": "Dự án 8,28 ha, 10 tòa tháp 36–46 tầng tại khu đất Cao–Xà–Lá lịch sử (233 Nguyễn Trãi), do Masterise Homes phát triển. Phân khu The Bloom mở bán Tòa L1 và L2.",
    "date": "2026-05-13",
    "category": "Tong quan",
    "tags": ["Lumière HSG", "Masterise", "Tổng quan", "The Bloom"],
    "image": "hero-aerial.jpg"
  },
  {
    "slug": "vi-tri-lumiere-hanoi-seasons-garden.html",
    "title": "Vị trí LUMIÈRE Hanoi Seasons Garden — 3 phút đi bộ tới Metro Cát Linh–Hà Đông",
    "excerpt": "Tọa lạc tại 233 Nguyễn Trãi — trục huyết mạch phía Tây Hà Nội, cận kề Ngã Tư Sở, Royal City, kết nối Vành đai 2.5 và Vành đai 3.",
    "date": "2026-05-13",
    "category": "Phan tich",
    "tags": ["Vị trí", "233 Nguyễn Trãi", "Metro Cát Linh"],
    "image": "amenity-entrance-gate.jpg"
  },
  {
    "slug": "bang-gia-lumiere-hanoi-seasons-garden-2026.html",
    "title": "Bảng giá LUMIÈRE Hanoi Seasons Garden 2026 — Phân khu The Bloom",
    "excerpt": "Giá tham khảo 128 – 174 triệu/m², các loại căn từ Studio đến Penthouse Duplex, ngưỡng giá căn từ ~4 đến 48 tỷ. Hỗ trợ vay 70% lãi suất 0% đến Q2/2029.",
    "date": "2026-05-13",
    "category": "Bang gia",
    "tags": ["Bảng giá", "The Bloom", "2026"],
    "image": "thebloom-l1-facade.jpg"
  },
  {
    "slug": "chinh-sach-thanh-toan-lumiere-hsg-2026.html",
    "title": "Chính sách thanh toán LUMIÈRE Hanoi Seasons Garden 2026",
    "excerpt": "Ba phương án linh hoạt: chiết khấu 7% thanh toán sớm, 12 đợt trong ~3 năm, hoặc vay ngân hàng 70% lãi suất 0% đến bàn giao Q2/2029. Cộng thêm Early Bird 1% + 12 tháng phí quản lý.",
    "date": "2026-05-13",
    "category": "Chinh sach",
    "tags": ["Chính sách", "Thanh toán", "Vay 70%"],
    "image": "amenity-clubhouse-pool.jpg"
  }
]
```

- [ ] **Step 2: Create `blog/blog-shared.js`** (related-posts for each post page)

```javascript
(() => {
  const relatedEl = document.getElementById('related-posts');
  if (!relatedEl) return;
  const currentSlug = relatedEl.dataset.currentSlug;
  fetch('/blog/posts.json')
    .then(r => r.json())
    .then(posts => {
      const others = posts.filter(p => p.slug !== currentSlug);
      const picks = others.sort(() => Math.random() - 0.5).slice(0, 3);
      picks.forEach(p => {
        const card = document.createElement('a');
        card.href = `/blog/${p.slug}`;
        card.className = 'bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col';
        const img = document.createElement('img');
        img.src = `/images/${p.image}`;
        img.alt = p.title; img.loading = 'lazy';
        img.className = 'w-full aspect-[16/9] object-cover';
        card.appendChild(img);
        const body = document.createElement('div');
        body.className = 'p-4 flex-1 flex flex-col';
        const cat = document.createElement('p');
        cat.className = 'text-xs tracking-[0.3em] uppercase text-sand mb-2';
        cat.textContent = p.category;
        body.appendChild(cat);
        const title = document.createElement('h4');
        title.className = 'font-display text-base text-hsg-slate leading-snug';
        title.textContent = p.title;
        body.appendChild(title);
        card.appendChild(body);
        relatedEl.appendChild(card);
      });
    });
})();
```

- [ ] **Step 3: Create `blog/index.html`**

Use the same shell as `index.html` (same `<head>`, swap title to `Tin tức & phân tích | PKD LUMIÈRE Hanoi Seasons Garden`, same header & footer). Replace `<main>` content with:

```html
  <main>
    <section class="py-16 lg:py-20 bg-ivory">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <p class="text-xs tracking-[0.3em] text-sand uppercase mb-3">Cập nhật &amp; phân tích</p>
          <h1 class="font-display text-4xl lg:text-6xl text-hsg-slate mb-4">Tin tức dự án</h1>
          <div class="w-14 h-px bg-sand mx-auto"></div>
        </div>
        <div id="posts-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
        <div id="pagination" class="flex justify-center gap-2 mt-12"></div>
      </div>
    </section>
  </main>

  <script>
  (() => {
    const PAGE_SIZE = 9;
    const grid = document.getElementById('posts-grid');
    const pag = document.getElementById('pagination');
    let posts = [];
    let page = 1;
    fetch('/blog/posts.json').then(r => r.json()).then(data => {
      posts = data.slice().sort((a, b) => b.date.localeCompare(a.date));
      render();
    });
    function render() {
      grid.replaceChildren();
      const start = (page - 1) * PAGE_SIZE;
      const slice = posts.slice(start, start + PAGE_SIZE);
      slice.forEach(p => grid.appendChild(card(p)));
      renderPagination();
    }
    function card(p) {
      const a = document.createElement('a');
      a.href = `/blog/${p.slug}`;
      a.className = 'bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col';
      const img = document.createElement('img');
      img.src = `/images/${p.image}`; img.alt = p.title; img.loading = 'lazy';
      img.className = 'w-full aspect-[16/9] object-cover';
      a.appendChild(img);
      const body = document.createElement('div');
      body.className = 'p-5 flex flex-col flex-1';
      const meta = document.createElement('p');
      meta.className = 'text-xs tracking-[0.3em] uppercase text-sand mb-2';
      meta.textContent = `${p.category} · ${p.date}`;
      body.appendChild(meta);
      const t = document.createElement('h3');
      t.className = 'font-display text-lg text-hsg-slate mb-2 leading-snug';
      t.textContent = p.title;
      body.appendChild(t);
      const ex = document.createElement('p');
      ex.className = 'text-sm text-hsg-slate/70 flex-1 leading-relaxed';
      ex.textContent = p.excerpt;
      body.appendChild(ex);
      a.appendChild(body);
      return a;
    }
    function renderPagination() {
      pag.replaceChildren();
      const pages = Math.ceil(posts.length / PAGE_SIZE);
      if (pages <= 1) return;
      for (let i = 1; i <= pages; i++) {
        const b = document.createElement('button');
        b.textContent = i;
        b.className = 'px-3 py-1 rounded ' + (i === page ? 'bg-lum-green text-ivory' : 'bg-warm-gray text-hsg-slate');
        b.addEventListener('click', () => { page = i; render(); window.scrollTo({top:0,behavior:'smooth'}); });
        pag.appendChild(b);
      }
    }
  })();
  </script>
```

- [ ] **Step 4: Verify, then commit**

```bash
git add blog/index.html blog/posts.json blog/blog-shared.js
git commit -m "feat: blog scaffold — index, posts.json, shared JS" -m "Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push
```

### Task 6.2: Blog post template + first two posts

**Files:** Create `blog/tong-quan-lumiere-hanoi-seasons-garden.html`, `blog/vi-tri-lumiere-hanoi-seasons-garden.html`.

- [ ] **Step 1: Establish the post template**

Each post HTML file uses this structure (copy & customize per post). Tokens in `<<>>` get replaced per post.

```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><<TITLE>> | PKD Hanoi Seasons Garden</title>
  <meta name="description" content="<<DESCRIPTION>>">
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="canonical" href="https://www.pkdhanoiseasonsgarden.com/blog/<<SLUG>>">
  <meta property="og:type" content="article">
  <meta property="og:locale" content="vi_VN">
  <meta property="og:title" content="<<TITLE>>">
  <meta property="og:description" content="<<DESCRIPTION>>">
  <meta property="og:url" content="https://www.pkdhanoiseasonsgarden.com/blog/<<SLUG>>">
  <meta property="og:image" content="https://www.pkdhanoiseasonsgarden.com/images/<<OG_IMAGE>>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/fonts.css">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = { theme: { extend: {
      colors: { 'hsg-slate':'#30413B','hsg-slate-dark':'#1F2A26','lum-green':'#455F39','lum-green-dark':'#36492C','sage':'#B7BA9F','sage-light':'#D6D8C5','sand':'#B89B7A','sand-dark':'#9E835F','ivory':'#F1EFE8','warm-gray':'#E8E6DE','zalo':'#0068FF' },
      fontFamily: { display:['SVN-Optima','Cormorant Garamond','Georgia','serif'], sans:['Inter','system-ui','sans-serif'], accent:['DFVN-Abygaer','cursive'] }
    }}}
  </script>
  <link rel="llms" href="https://www.pkdhanoiseasonsgarden.com/llms.txt" type="text/plain">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "<<TITLE>>",
    "image": "https://www.pkdhanoiseasonsgarden.com/images/<<OG_IMAGE>>",
    "datePublished": "<<DATE>>",
    "author": { "@type": "Organization", "name": "Phòng Kinh Doanh Hanoi Seasons Garden" },
    "publisher": { "@type": "Organization", "name": "PKD Hanoi Seasons Garden", "logo": { "@type": "ImageObject", "url": "https://www.pkdhanoiseasonsgarden.com/images/logo-lumiere-hsg.png" } }
  }
  </script>
</head>
<body class="font-sans text-hsg-slate bg-white">
  <!-- HEADER: copy entire <header>…</header> from index.html -->

  <div class="h-16 lg:h-20"></div>

  <main>
    <article class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <nav class="text-xs tracking-wider uppercase text-hsg-slate/60 mb-6"><a href="/" class="hover:text-lum-green">PKD HSG</a> · <a href="/blog/" class="hover:text-lum-green">Tin tức</a> · <span class="text-hsg-slate"><<CATEGORY>></span></nav>
      <p class="text-xs tracking-[0.3em] uppercase text-sand mb-3"><<CATEGORY>> · <<DATE>></p>
      <h1 class="font-display text-3xl lg:text-5xl text-hsg-slate mb-6 leading-tight"><<TITLE>></h1>
      <figure class="rounded-3xl overflow-hidden mb-10">
        <img src="/images/<<OG_IMAGE>>" alt="<<IMAGE_ALT>>" class="w-full h-auto" loading="eager" width="1200" height="630">
      </figure>
      <div class="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-hsg-slate prose-a:text-lum-green">
        <<ARTICLE_BODY>>
      </div>
    </article>

    <section class="bg-ivory py-16">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="font-display text-2xl lg:text-3xl text-hsg-slate text-center mb-10">Bài viết liên quan</h2>
        <div id="related-posts" data-current-slug="<<SLUG>>" class="grid grid-cols-1 md:grid-cols-3 gap-6"></div>
      </div>
    </section>

    <!-- LIÊN HỆ: copy entire <section id="lien-he">…</section> from index.html -->
  </main>

  <!-- FOOTER: copy entire <footer>…</footer> from index.html -->

  <script src="/js/main.js"></script>
  <script src="/blog/blog-shared.js"></script>
</body>
</html>
```

- [ ] **Step 2: Write `blog/tong-quan-lumiere-hanoi-seasons-garden.html`** using the template with these tokens:

```
<<TITLE>>        Tổng quan LUMIÈRE Hanoi Seasons Garden — Tổ hợp 10 tòa tháp Masterise giữa lòng Thanh Xuân
<<DESCRIPTION>>  Dự án 8,28 ha, 10 tòa tháp 36–46 tầng tại khu đất Cao–Xà–Lá lịch sử (233 Nguyễn Trãi), do Masterise Homes phát triển. Phân khu The Bloom mở bán Tòa L1 và L2.
<<SLUG>>         tong-quan-lumiere-hanoi-seasons-garden.html
<<DATE>>         2026-05-13
<<CATEGORY>>     Tổng quan
<<OG_IMAGE>>     hero-aerial.jpg
<<IMAGE_ALT>>    Phối cảnh tổng thể LUMIÈRE Hanoi Seasons Garden tại 233 Nguyễn Trãi
```

For `<<ARTICLE_BODY>>` write ~900 Vietnamese words using `<h2>`, `<h3>`, `<p>`, `<ul>`, `<strong>` covering: (1) bối cảnh khu Cao–Xà–Lá tái thiết tại 233 Nguyễn Trãi; (2) quy mô 82.820 m² / 10 tòa / 36–46 tầng / 3 hầm / 28,8% mật độ; (3) phân khu The Bloom mở bán đầu tiên — Tòa L1 và L2 với 11 loại căn từ Studio đến Penthouse Duplex; (4) ngôn ngữ thiết kế "tinh khôi" của LUMIÈRE; (5) tiện ích Masterise Hospitality; (6) pháp lý sổ đỏ lâu dài / 50 năm; (7) tiến độ HĐMB ~10/2026 → bàn giao Q2/2029; (8) CTA liên hệ 0564.928.999. Include internal links to `/blog/vi-tri-lumiere-hanoi-seasons-garden.html`, `/blog/bang-gia-lumiere-hanoi-seasons-garden-2026.html`, `/toa-l1.html`.

- [ ] **Step 3: Write `blog/vi-tri-lumiere-hanoi-seasons-garden.html`** with:

```
<<TITLE>>        Vị trí LUMIÈRE Hanoi Seasons Garden — 3 phút đi bộ tới Metro Cát Linh–Hà Đông
<<DESCRIPTION>>  Tọa lạc tại 233 Nguyễn Trãi — trục huyết mạch phía Tây Hà Nội, cận kề Ngã Tư Sở, Royal City, kết nối Vành đai 2.5 và Vành đai 3.
<<SLUG>>         vi-tri-lumiere-hanoi-seasons-garden.html
<<DATE>>         2026-05-13
<<CATEGORY>>     Phân tích
<<OG_IMAGE>>     amenity-entrance-gate.jpg
<<IMAGE_ALT>>    Lối vào cổng chính LUMIÈRE Hanoi Seasons Garden tại 233 Nguyễn Trãi
```

`<<ARTICLE_BODY>>` ~900 VI words covering: (1) tọa độ 233/233B/235 Nguyễn Trãi + câu chuyện Cao–Xà–Lá; (2) trục Nguyễn Trãi nối Đống Đa – Thanh Xuân – Hà Đông; (3) Metro Cát Linh–Hà Đông (ga Thượng Đình, 3 phút đi bộ); (4) cận kề Ngã Tư Sở 500m, Royal City, BV Bạch Mai, ĐH Bách Khoa, Times City, Hồ Gươm 10 phút; (5) Vành đai 2.5 và 3 → Sân bay Nội Bài; (6) phân tích đầu tư: nội đô 8,28 ha hiếm có; (7) CTA. Include links to `/toa-l1.html` and `/blog/bang-gia-lumiere-hanoi-seasons-garden-2026.html`.

- [ ] **Step 4: Verify, then commit**

```bash
git add blog/tong-quan-lumiere-hanoi-seasons-garden.html blog/vi-tri-lumiere-hanoi-seasons-garden.html
git commit -m "feat(blog): tổng quan + vị trí starter posts" -m "Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push
```

### Task 6.3: Bảng giá + Chính sách posts

**Files:** Create `blog/bang-gia-lumiere-hanoi-seasons-garden-2026.html`, `blog/chinh-sach-thanh-toan-lumiere-hsg-2026.html`. Use the same template from Task 6.2 Step 1.

- [ ] **Step 1: Write `blog/bang-gia-lumiere-hanoi-seasons-garden-2026.html`** with tokens:

```
<<TITLE>>        Bảng giá LUMIÈRE Hanoi Seasons Garden 2026 — Phân khu The Bloom
<<DESCRIPTION>>  Giá tham khảo 128 – 174 triệu/m², các loại căn từ Studio đến Penthouse Duplex, ngưỡng giá căn từ ~4 đến 48 tỷ. Hỗ trợ vay 70% lãi suất 0% đến Q2/2029.
<<SLUG>>         bang-gia-lumiere-hanoi-seasons-garden-2026.html
<<DATE>>         2026-05-13
<<CATEGORY>>     Bảng giá
<<OG_IMAGE>>     thebloom-l1-facade.jpg
<<IMAGE_ALT>>    Phối cảnh facade Tòa L1 phân khu The Bloom
```

`<<ARTICLE_BODY>>` ~1000 VI words. Embed the same 11-row pricing table as in index `#bang-gia` (Tailwind-styled, table inside `.overflow-x-auto`). Cover: (1) bối cảnh khảo sát Masterise đầu 2026; (2) khoảng giá theo view (nội khu 136–174, đường phố 128–161); (3) bảng chi tiết 11 loại căn; (4) so sánh mặt bằng giá Thanh Xuân/Đống Đa; (5) yếu tố làm nên giá; (6) phân tích hỗ trợ vay 70% lãi 0% đến bàn giao Q2/2029; (7) lưu ý giá tham khảo có thể thay đổi; (8) CTA. Link to `/toa-l1.html`, `/toa-l2.html`, `/blog/chinh-sach-thanh-toan-lumiere-hsg-2026.html`.

- [ ] **Step 2: Write `blog/chinh-sach-thanh-toan-lumiere-hsg-2026.html`** with tokens:

```
<<TITLE>>        Chính sách thanh toán LUMIÈRE Hanoi Seasons Garden 2026
<<DESCRIPTION>>  Ba phương án linh hoạt: chiết khấu 7% thanh toán sớm, 12 đợt trong ~3 năm, hoặc vay ngân hàng 70% lãi suất 0% đến bàn giao Q2/2029. Cộng thêm Early Bird 1% + 12 tháng phí quản lý.
<<SLUG>>         chinh-sach-thanh-toan-lumiere-hsg-2026.html
<<DATE>>         2026-05-13
<<CATEGORY>>     Chính sách
<<OG_IMAGE>>     amenity-clubhouse-pool.jpg
<<IMAGE_ALT>>    Bể bơi clubhouse LUMIÈRE Hanoi Seasons Garden
```

`<<ARTICLE_BODY>>` ~1000 VI words covering: (1) overview 3 phương án; (2) phương án 01 chiết khấu 7% — ai phù hợp + ví dụ tính toán cụ thể trên căn 8 tỷ; (3) phương án 02 12 đợt thanh toán — lịch trình điển hình; (4) phương án 03 vay 70% lãi 0% đến Q2/2029 + ân hạn 24 tháng + 7,5%/năm sau ân hạn; (5) hỗ trợ phí quản lý 24/48 tháng; (6) Early Bird +1% +12 tháng; (7) so sánh 3 nhóm khách (đầu tư ngắn / ở thực / cho thuê); (8) CTA hotline. Link to `/blog/bang-gia-lumiere-hanoi-seasons-garden-2026.html` and `/toa-l1.html`.

- [ ] **Step 3: Verify**

Reload `/blog/` — all 4 cards present. Click each → article loads, related-posts grid shows 3 random other posts.

- [ ] **Step 4: Commit**

```bash
git add blog/bang-gia-lumiere-hanoi-seasons-garden-2026.html blog/chinh-sach-thanh-toan-lumiere-hsg-2026.html
git commit -m "feat(blog): bảng giá + chính sách starter posts" -m "Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push
```

---

## Phase 7 — SEO, schema.org, AI discoverability

### Task 7.1: `sitemap.xml`

**Files:** Create `sitemap.xml`.

- [ ] **Step 1: Write `sitemap.xml`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.pkdhanoiseasonsgarden.com/</loc>
    <lastmod>2026-05-13</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.pkdhanoiseasonsgarden.com/toa-l1.html</loc>
    <lastmod>2026-05-13</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.pkdhanoiseasonsgarden.com/toa-l2.html</loc>
    <lastmod>2026-05-13</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.pkdhanoiseasonsgarden.com/blog/</loc>
    <lastmod>2026-05-13</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.pkdhanoiseasonsgarden.com/blog/tong-quan-lumiere-hanoi-seasons-garden.html</loc>
    <lastmod>2026-05-13</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.pkdhanoiseasonsgarden.com/blog/vi-tri-lumiere-hanoi-seasons-garden.html</loc>
    <lastmod>2026-05-13</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.pkdhanoiseasonsgarden.com/blog/bang-gia-lumiere-hanoi-seasons-garden-2026.html</loc>
    <lastmod>2026-05-13</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.pkdhanoiseasonsgarden.com/blog/chinh-sach-thanh-toan-lumiere-hsg-2026.html</loc>
    <lastmod>2026-05-13</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

- [ ] **Step 2: Verify** — open `http://localhost:8000/sitemap.xml`; XML must parse without errors (no red squiggle in DevTools).

- [ ] **Step 3: Commit**

```bash
git add sitemap.xml
git commit -m "feat(seo): sitemap.xml" -m "Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push
```

### Task 7.2: `robots.txt`

**Files:** Create `robots.txt`.

- [ ] **Step 1: Write `robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://www.pkdhanoiseasonsgarden.com/sitemap.xml
```

- [ ] **Step 2: Verify** — open `http://localhost:8000/robots.txt`.

- [ ] **Step 3: Commit**

```bash
git add robots.txt
git commit -m "feat(seo): robots.txt" -m "Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push
```

### Task 7.3: `llms.txt`

**Files:** Create `llms.txt`.

- [ ] **Step 1: Write `llms.txt`**

```markdown
# PKD Hanoi Seasons Garden — LUMIÈRE Hanoi Seasons Garden (Masterise Homes)

> Phòng Kinh Doanh phân phối chính thức dự án LUMIÈRE Hanoi Seasons Garden — tổ hợp 10 tòa tháp cao tầng do Masterise Homes phát triển trên khu đất Cao–Xà–Lá lịch sử (233 Nguyễn Trãi, Thanh Xuân, Hà Nội). Phân khu mở bán đầu tiên: The Bloom (Tòa L1 & L2).

Hotline tư vấn: 0564.928.999 | Zalo: zalo.me/0564928999 | Website: https://www.pkdhanoiseasonsgarden.com

## Thông tin dự án

- Tên dự án: LUMIÈRE Hanoi Seasons Garden
- Chủ đầu tư: Masterise Homes (Masterise Group)
- Vị trí: 233, 233B, 235 Nguyễn Trãi, phường Thượng Đình, quận Thanh Xuân, Hà Nội
- Quy mô: 82.820 m² (~8,28 ha), 10 tòa tháp 36–46 tầng, 3 hầm
- Mật độ xây dựng: 28,8%
- Phân khu mở bán đầu tiên: The Bloom (Tòa L1 và Tòa L2)
- Kết nối: 3 phút đi bộ tới Metro Cát Linh–Hà Đông (ga Thượng Đình), 500m tới Ngã Tư Sở, cận kề Royal City, kết nối Vành đai 2.5 và Vành đai 3

## Sản phẩm — Phân khu The Bloom

- 11 loại căn: Studio, 1BR, 1BR+1, 2BR, 2BR+1, 3BR, 3BR+1, 4BR, Duplex, Penthouse, Penthouse Duplex
- Giá tham khảo: 128 – 174 triệu/m² (nội khu 136–174, đường phố 128–161)
- Ngưỡng giá căn: ~4 – 48 tỷ VNĐ
- Bàn giao: Q2/2029

## Chính sách thanh toán

- Phương án 01 — Thanh toán sớm: chiết khấu lên đến 7%
- Phương án 02 — Thanh toán 12 đợt trong ~3 năm
- Phương án 03 — Vay ngân hàng 70%, lãi suất 0% đến Q2/2029, ân hạn nợ gốc 24 tháng, 7,5%/năm sau ân hạn
- Hỗ trợ phí quản lý: 24 tháng cho khách mới, 48 tháng cho cư dân Masterise
- Ưu đãi Early Bird: thêm 1% chiết khấu + miễn 12 tháng phí quản lý

## Pháp lý

- Người mua Việt Nam: Sở hữu lâu dài (Sổ đỏ riêng từng căn)
- Người mua nước ngoài: Sở hữu 50 năm theo Luật Nhà ở Việt Nam

## Trang chủ & Các trang chính

- [Trang chủ](https://www.pkdhanoiseasonsgarden.com/): Tổng quan dự án, vị trí, The Bloom, tiện ích, bảng giá, chính sách, liên hệ
- [Tòa L1](https://www.pkdhanoiseasonsgarden.com/toa-l1.html): Mặt bằng điển hình + phối cảnh nội thất Tòa L1
- [Tòa L2](https://www.pkdhanoiseasonsgarden.com/toa-l2.html): Mặt bằng điển hình + phối cảnh nội thất Tòa L2
- [Tin tức & Blog](https://www.pkdhanoiseasonsgarden.com/blog/): Cập nhật và phân tích về dự án

## Bài viết nổi bật

- [Tổng quan LUMIÈRE Hanoi Seasons Garden](https://www.pkdhanoiseasonsgarden.com/blog/tong-quan-lumiere-hanoi-seasons-garden.html): Tổ hợp 10 tòa tháp Masterise 8,28 ha tại Cao–Xà–Lá (233 Nguyễn Trãi)
- [Vị trí LUMIÈRE Hanoi Seasons Garden](https://www.pkdhanoiseasonsgarden.com/blog/vi-tri-lumiere-hanoi-seasons-garden.html): 3 phút đi bộ tới Metro Cát Linh–Hà Đông, kết nối Vành đai 2.5 & 3
- [Bảng giá LUMIÈRE Hanoi Seasons Garden 2026](https://www.pkdhanoiseasonsgarden.com/blog/bang-gia-lumiere-hanoi-seasons-garden-2026.html): Giá từ 128 – 174 triệu/m², căn từ ~4 đến 48 tỷ
- [Chính sách thanh toán 2026](https://www.pkdhanoiseasonsgarden.com/blog/chinh-sach-thanh-toan-lumiere-hsg-2026.html): 3 phương án, vay 70% lãi 0% đến bàn giao Q2/2029

## Liên hệ

- Hotline: 0564.928.999
- Zalo: https://zalo.me/0564928999
- Website: https://www.pkdhanoiseasonsgarden.com
```

- [ ] **Step 2: Verify** — open `http://localhost:8000/llms.txt`.

- [ ] **Step 3: Commit**

```bash
git add llms.txt
git commit -m "feat(seo): llms.txt for AI discoverability" -m "Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push
```

### Task 7.4: Schema.org JSON-LD in `index.html`

**Files:** Modify `index.html`.

- [ ] **Step 1: Insert two JSON-LD blocks into `<head>` of `index.html`** — just before `<link rel="llms">`:

```html
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "Phòng Kinh Doanh Hanoi Seasons Garden",
    "description": "Phân phối chính thức dự án LUMIÈRE Hanoi Seasons Garden — Masterise Homes — tại 233 Nguyễn Trãi, Hà Nội.",
    "url": "https://www.pkdhanoiseasonsgarden.com",
    "telephone": "+84564928999",
    "image": "https://www.pkdhanoiseasonsgarden.com/images/hero-aerial.jpg",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "233 Nguyễn Trãi",
      "addressLocality": "Thanh Xuân",
      "addressRegion": "Hà Nội",
      "addressCountry": "VN"
    },
    "areaServed": { "@type": "City", "name": "Hà Nội" },
    "priceRange": "$$$$"
  }
  </script>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": "LUMIÈRE Hanoi Seasons Garden — Phân khu The Bloom",
    "description": "Tổ hợp 10 tòa tháp tại 233 Nguyễn Trãi, Hà Nội. Phân khu The Bloom (Tòa L1 & L2) mở bán đầu tiên — Studio, 1BR, 2BR, 3BR, 4BR, Duplex, Penthouse, Penthouse Duplex.",
    "url": "https://www.pkdhanoiseasonsgarden.com",
    "image": {
      "@type": "ImageObject",
      "url": "https://www.pkdhanoiseasonsgarden.com/images/hero-aerial.jpg",
      "width": 1920,
      "height": 1080
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "233 Nguyễn Trãi",
      "addressLocality": "Thanh Xuân",
      "addressRegion": "Hà Nội",
      "addressCountry": "VN"
    }
  }
  </script>
```

- [ ] **Step 2: Add an `Apartment` schema to each tower page**

In `toa-l1.html` and `toa-l2.html`, insert before the `<link rel="llms">` line:

```html
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Apartment",
    "name": "Tòa L1 — Phân khu The Bloom · LUMIÈRE Hanoi Seasons Garden",
    "description": "Tòa tháp đầu tiên thuộc phân khu The Bloom — 36–46 tầng, 10 loại căn từ Studio đến Penthouse Duplex.",
    "url": "https://www.pkdhanoiseasonsgarden.com/toa-l1.html",
    "image": "https://www.pkdhanoiseasonsgarden.com/images/thebloom-l1-facade.jpg",
    "numberOfRooms": 1,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "233 Nguyễn Trãi",
      "addressLocality": "Thanh Xuân",
      "addressRegion": "Hà Nội",
      "addressCountry": "VN"
    }
  }
  </script>
```

For `toa-l2.html`, change `"Tòa L1"` → `"Tòa L2"`, `toa-l1.html` → `toa-l2.html`, `thebloom-l1-facade.jpg` → `thebloom-l2-facade.jpg`.

- [ ] **Step 3: Verify**

Open `https://search.google.com/test/rich-results` and paste each URL once deployed, or use a local tool like `npx structured-data-testing-tool` against `localhost:8000` if available. At minimum, validate the JSON-LD is well-formed by opening DevTools → Console → no parse errors.

- [ ] **Step 4: Commit**

```bash
git add index.html toa-l1.html toa-l2.html
git commit -m "feat(seo): schema.org JSON-LD (RealEstateAgent, RealEstateListing, Apartment)" -m "Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push
```

---

## Phase 8 — Project conventions doc

### Task 8.1: `CLAUDE.md`

**Files:** Create `CLAUDE.md`.

- [ ] **Step 1: Write `CLAUDE.md`** modeled on langvan's, with these project-specific values.

```markdown
# LUMIÈRE Hanoi Seasons Garden — Sales Landing Page

## Project Overview

Static marketing/sales website for **LUMIÈRE Hanoi Seasons Garden** (Masterise Homes), F1 sales-partner site operated by Phòng Kinh Doanh.

- **Live URL**: https://www.pkdhanoiseasonsgarden.com
- **Hosting**: Vercel (static, no build step)
- **Language**: Vietnamese (lang="vi")

## Tech Stack

- HTML5 static pages — no framework, no build tools, no package.json
- Tailwind CSS via Play CDN — config inline per page
- Vanilla JS, no bundler
- SVN-Optima (display) self-hosted via @font-face; Inter (body) via Google Fonts; DFVN-Abygaer (decorative accent) self-hosted

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

`Tong quan`, `Phan tich`, `Bang gia`, `Chinh sach`, `Tien do`, `Phap ly`, `Tien ich` — used as filter keys (no diacritics).

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

Push to `main` → Vercel auto-deploys. No build command. Static serve.

## JavaScript Conventions

- Vanilla JS, no frameworks
- Use safe DOM (`createElement`, `textContent`, `appendChild`, `replaceChildren()`) — never `innerHTML` for user-supplied or remote content
- Phone regex: `/^0\d{9}$/`
- Lead form via `fetch` with `FormData`
- Smooth scroll for anchor navigation
- Honeypot `_gotcha` field on lead forms
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: CLAUDE.md project conventions" -m "Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push
```

---

## Phase 9 — Deployment

### Task 9.1: Link Vercel + configure domain

**Files:** none committed (DNS happens externally).

- [ ] **Step 1: Install Vercel CLI if missing**

```bash
command -v vercel || npm i -g vercel
```

- [ ] **Step 2: Link the project**

```bash
cd /Volumes/na2024/Passion/hnseasonsgarden
vercel link
```

Follow prompts: choose your Vercel account, accept defaults for project name (`hanoi-seasons-garden`) and directory (`./`). This creates `.vercel/project.json` (gitignored).

- [ ] **Step 3: First production deploy**

```bash
vercel --prod
```

Output includes the production URL (e.g. `https://hanoi-seasons-garden.vercel.app`). Visit it and confirm everything renders identically to `http://localhost:8000/`.

- [ ] **Step 4: Attach custom domain**

```bash
vercel domains add pkdhanoiseasonsgarden.com
vercel domains add www.pkdhanoiseasonsgarden.com
vercel alias set hanoi-seasons-garden.vercel.app www.pkdhanoiseasonsgarden.com
```

At your DNS registrar, set:
- Apex `pkdhanoiseasonsgarden.com` → A record `76.76.21.21` (or whatever Vercel shows in the dashboard)
- `www` → CNAME `cname.vercel-dns.com`

Wait ~5 minutes for propagation; Vercel auto-provisions Let's Encrypt SSL.

- [ ] **Step 5: Verify**

```bash
curl -sI https://www.pkdhanoiseasonsgarden.com | head -3
```

Expected: `HTTP/2 200`, `content-type: text/html`. Visit the URL in browser; verify the live site looks identical to local. Check `https://www.pkdhanoiseasonsgarden.com/sitemap.xml` and `/llms.txt` both serve.

- [ ] **Step 6: Stop the local dev server**

```bash
kill $(cat /tmp/hsg-server.pid) 2>/dev/null
rm /tmp/hsg-server.pid
```

- [ ] **Step 7: Final commit (`README.md` status update)**

Update the **Status** line in `README.md` from "Pre-scaffold" to "Live at https://www.pkdhanoiseasonsgarden.com — first launch."

```bash
git add README.md
git commit -m "docs: mark site live" -m "Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push
```

---

## Self-review

Run this checklist after the plan is written. Cross-reference each spec section against tasks.

| Spec section | Implemented in |
|--------------|----------------|
| §3 Stack | Task 2.2 (Tailwind+Inter+SVN-Optima), Task 4.1 (vanilla JS form), Task 9.1 (Vercel) |
| §4 File layout | Phases 1–6 each task lists `Files: Create` |
| §5 Design tokens | Task 2.2 (Tailwind config block) |
| §6 index.html 11 sections | Tasks 3.1 – 3.11 |
| §7 Tower pages | Tasks 5.1 (L1), 5.2 (L2) |
| §8 Blog (4 starter posts) | Tasks 6.1 – 6.3 |
| §9 Lead form | Task 3.11 (markup) + Task 4.1 (handler) |
| §10 SEO + llms.txt | Tasks 7.1 (sitemap), 7.2 (robots), 7.3 (llms.txt), 7.4 (schema.org) |
| §11 Image pipeline | Tasks 1.1 (exteriors), 1.2 (interiors), 1.3 (floorplans + PDF compression), 1.4 (logos+favicon) |
| §12 Deployment | Task 9.1 (Vercel link + domain) |
| §13 CLAUDE.md | Task 8.1 |
| §14 Disclaimer | Task 2.2 (footer markup in shell) |
| §15 Build sequence | Phases 0–9 follow the same order |
| §16 Open items | Tracked: Formspree URL (Task 4.1 + README), bank guarantees (Task 3.8), DNS (Task 9.1), Masterise repo confirmation (manual) |
| §17 Out of scope | GTM (skipped, ready to add later — pattern noted in CLAUDE.md), EN locale (not built), L3-L10 phases (teased only — Task 3.4) |

**Placeholder scan:** Only `REPLACE_ME` (Formspree) is intentional and tracked. No "TODO"/"TBD" inside tasks (only inside §16 open items which is the right place for them).

**Type consistency:** CSS class names (`bg-hsg-slate`, `bg-lum-green`, `bg-sand`, `font-display`) match across all tasks. JS function/method names consistent. `data-fp` / `data-fp-panel` / `data-lightbox` / `.amenity-tab` / `.amenity-panel` / `.fp-tab` / `.fp-panel` used identically across tasks 3.5, 5.1, 5.2.

**Cross-task dependencies validated:** the latest-posts loader in Task 3.10 silent-fails until Task 6.1 lands; the tower page floor-plan PDF link in Task 5.1 silent-404s until Task 1.3 lands; the related-posts loader on each blog post requires `blog/posts.json` from Task 6.1.

---

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-13-hnseasonsgarden-website.md`. Two execution options:

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** — Execute tasks in this session using `executing-plans`, batch execution with checkpoints.

Which approach?
