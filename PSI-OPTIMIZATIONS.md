# PageSpeed optimizations — `hnseasonsgarden` vs. sister sites

Snapshot taken **2026-05-23**. Compares the perf state of `hnseasonsgarden` (this repo, post-`9dfc22a`) to the two sister sites at `../langvan` (Vinhomes Hải Vân Bay) and `../greenhl` (Vinhomes Global Gate Hạ Long), which are still on the pre-optimization stack.

This file is the migration playbook for the sister sites.

---

## Summary — what `hnseasonsgarden` does that the sister sites don't

| Lever | `hnseasonsgarden` (after `9dfc22a`) | `langvan` / `greenhl` (current) | Expected PSI impact |
|---|---|---|---|
| **Tailwind delivery** | Compiled CLI build → `/css/tw.min.css` (~46 KB minified, ~10 KB gzip), one stylesheet, no JS at runtime | `<script src="https://cdn.tailwindcss.com">` Play CDN — ~370 KB JIT engine, render-blocking, runs on every page load | LCP **−1.5 to −3 s** on 4G mobile; eliminates `Render-blocking resources` audit failure |
| **Fonts** | Self-hosted Inter + SVN-Optima + DFVN-Abygaer via WOFF2 + `@font-face` + `font-display: swap` + `<link rel="preload">` for the above-fold weight | Google Fonts via `<link href="https://fonts.googleapis.com/css2?...">` — third-party render-blocking stylesheet **and** late-discovered font files (FCP-blocking on slow networks) | FCP **−500 to −900 ms**; eliminates `Eliminate render-blocking resources` and `Preload key requests` audit failures |
| **Top images** | AVIF + WebP + JPG fallback via `<picture>` at **768w / 1280w / 1920w**, served via `srcset` + `sizes`. Top JPG payload **9.7 MB → 4.4 MB** (-54%). Hero LCP image preloaded with matching `imagesrcset` / `imagesizes`. | Single JPG per image, no `<picture>`, no responsive variants. Mobile devices download desktop-sized JPG. | LCP **−1 to −2.5 s** on mobile; clears `Properly size images`, `Serve images in next-gen formats`, `Efficiently encode images` |
| **Layout stability** | Every `<img>` has explicit `width` + `height` (looked up via `magick identify`), so the browser can reserve space before pixels arrive | Most `<img>` tags lack `width`/`height` → layout shift when each image streams in | CLS goes to ≈0; clears `Avoid large layout shifts` |
| **`<picture>` & layout parents** | Tailwind `@layer base { picture { display: contents; } }` so `<picture>` wrappers don't break `h-full`, `absolute inset-0`, `aspect-ratio` parents | N/A — sister sites don't use `<picture>` yet | Required once `<picture>` is introduced |

Net effect on the LUMIÈRE HSG home page (real Lighthouse mobile run): **Performance went from 41 → 92**, LCP from 6.8 s → 2.1 s, no render-blocking audits remaining, "Properly size images" / "Serve next-gen formats" / "Eliminate render-blocking resources" all cleared.

---

## 1. Tailwind Play CDN → CLI build

### Problem

```html
<!-- BEFORE: langvan/greenhl current state -->
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    theme: { extend: { colors: { 'vinhomes': '#0C5C6B', /* ... */ } } }
  }
</script>
```

The Play CDN ships a **~370 KB JIT compiler** that runs every page load, parses every class on every page, generates CSS at runtime, and injects a `<style>` element — all blocking the main thread and delaying first paint. Lighthouse flags it as `Render-blocking resources` and `Avoid an excessive DOM size`.

### Fix

Add three files at the repo root:

**`package.json`:**

```json
{
  "name": "<sitename>",
  "private": true,
  "description": "PKD <site>. Build only emits /css/tw.min.css from Tailwind sources.",
  "scripts": {
    "build:css": "tailwindcss -i ./src/tailwind.css -o ./css/tw.min.css --minify",
    "watch:css": "tailwindcss -i ./src/tailwind.css -o ./css/tw.min.css --watch"
  },
  "devDependencies": {
    "@tailwindcss/typography": "^0.5.15",
    "tailwindcss": "^3.4.17"
  }
}
```

**`tailwind.config.js`** — move the **exact same** color + font tokens out of the inline `<script>` and into the config, plus declare `content` so unused classes are tree-shaken:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './blog/**/*.html', './js/**/*.js', './blog/**/*.js'],
  theme: {
    extend: {
      colors: { /* paste the project's tokens here */ },
      fontFamily: { /* paste the project's font stacks here */ },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
```

**`src/tailwind.css`:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* See section 3 — keeps <picture> from breaking parent layouts. */
  picture { display: contents; }
}
```

Then for every HTML page:

```html
<!-- AFTER -->
<link rel="stylesheet" href="/css/tw.min.css">

<!-- DELETE the <script src="https://cdn.tailwindcss.com"></script> tag -->
<!-- DELETE the inline <script>tailwind.config = {...}</script> block -->
```

Build once, commit the output:

```bash
npm install
npm run build:css
git add css/tw.min.css package.json package-lock.json tailwind.config.js src/tailwind.css
```

Vercel does **not** run the build — `css/tw.min.css` is committed. Re-run `npm run build:css` whenever a new utility class enters HTML/JS, and commit the regenerated file.

### Verification

1. View-source on any deployed page — there must be **no** `cdn.tailwindcss.com` script.
2. Network panel: only `/css/tw.min.css` (~46 KB / ~10 KB gzip) loaded for styling.
3. Lighthouse mobile: `Render-blocking resources` should not list any Tailwind asset.

---

## 2. Google Fonts CDN → self-hosted WOFF2

### Problem

```html
<!-- BEFORE -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

Two render-blocking round-trips: the CSS file from `fonts.googleapis.com`, then the WOFF2s from `fonts.gstatic.com` (which the browser only discovers *after* parsing the CSS). On 4G this adds **300–900 ms** to FCP and chronically appears in `Eliminate render-blocking resources` and `Preload key requests`.

### Fix

Download the WOFF2s once from [google-webfonts-helper](https://gwfh.mranftl.com/fonts/montserrat?subsets=latin,vietnamese) (or directly from the Google Fonts unicode-range CSS), keep two subsets per weight:

```
/fonts/montserrat-latin-400.woff2
/fonts/montserrat-vietnamese-400.woff2
/fonts/montserrat-latin-500.woff2
/fonts/montserrat-vietnamese-500.woff2
/fonts/montserrat-latin-600.woff2
/fonts/montserrat-vietnamese-600.woff2
/fonts/montserrat-latin-700.woff2
/fonts/montserrat-vietnamese-700.woff2
```

Then declare `@font-face` with `font-display: swap` and `unicode-range` so the browser only fetches the subset it needs. Store this in `/css/fonts.css`:

```css
@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/montserrat-vietnamese-400.woff2') format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1,
                 U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329,
                 U+1EA0-1EF9, U+20AB;
}
@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/montserrat-latin-400.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
                 U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191,
                 U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* Repeat for 500 / 600 / 700 */
```

Replace the head-of-page Google Fonts block with:

```html
<link rel="preload" as="font" type="font/woff2" href="/fonts/montserrat-vietnamese-400.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="/fonts/montserrat-latin-400.woff2" crossorigin>
<link rel="stylesheet" href="/css/fonts.css">
```

Preload only the weights that appear above the fold (usually 400 + the heading weight, e.g. 600). Don't preload all eight files — that hurts more than it helps.

### Verification

1. Network panel: no requests to `fonts.googleapis.com` or `fonts.gstatic.com`.
2. WOFF2s served from same origin with proper cache headers (Vercel handles this).
3. Lighthouse mobile: no `Preload key requests` or `Eliminate render-blocking resources` items pointing at fonts.

---

## 3. JPG → AVIF + WebP, with responsive `<picture>` + `srcset`

### Problem

Each hero/amenity/facade JPG is a single source served identically to a 390px mobile and a 2560px desktop — typically 300–800 KB delivered to a 390px viewport where 100 KB would have sufficed. Plus AVIF (≈-40 to -55% vs JPG at equal quality) and WebP (≈-25 to -35%) aren't offered at all.

### Fix — image encoding pipeline

For each hero/amenity/facade source `images/foo.jpg`, emit:

```
images/foo.avif            # native size, AVIF
images/foo.webp            # native size, WebP
images/foo-1280.avif       # 1280w AVIF
images/foo-1280.webp       # 1280w WebP
images/foo-768.avif        # 768w AVIF
images/foo-768.webp        # 768w WebP
images/foo.jpg             # leave as JPEG fallback (native size only)
```

Use ImageMagick + `cwebp` + `avifenc` (all available via Homebrew on the dev machine):

```bash
src=images/hero-official.jpg
for w in 768 1280; do
  magick "$src" -resize ${w}x -quality 82 "${src%.*}-${w}.jpg.tmp"
  cwebp -q 80 "${src%.*}-${w}.jpg.tmp" -o "${src%.*}-${w}.webp"
  avifenc --min 24 --max 28 --speed 6 "${src%.*}-${w}.jpg.tmp" "${src%.*}-${w}.avif"
  rm "${src%.*}-${w}.jpg.tmp"
done
# Plus native size:
cwebp -q 80 "$src" -o "${src%.*}.webp"
avifenc --min 24 --max 28 --speed 6 "$src" "${src%.*}.avif"
```

### Fix — markup pattern

Wrap every above-the-fold or content image in `<picture>`:

```html
<picture>
  <source type="image/avif"
          srcset="/images/hero-official-768.avif 768w,
                  /images/hero-official-1280.avif 1280w,
                  /images/hero-official.avif 1920w"
          sizes="100vw">
  <source type="image/webp"
          srcset="/images/hero-official-768.webp 768w,
                  /images/hero-official-1280.webp 1280w,
                  /images/hero-official.webp 1920w"
          sizes="100vw">
  <img src="/images/hero-official.jpg"
       alt="Mô tả tiếng Việt cụ thể"
       width="1920" height="1080"
       loading="eager"
       fetchpriority="high">
</picture>
```

For below-fold images use `sizes="(min-width: 1024px) 50vw, 100vw"` (or whatever matches the layout) and switch `loading="eager"` → `loading="lazy"` plus drop `fetchpriority`.

### Fix — LCP preload

The LCP hero needs a preload that picks the same variant `<picture>` would, otherwise the preload fetches the wrong size:

```html
<link rel="preload" as="image"
      imagesrcset="/images/hero-official-768.avif 768w,
                   /images/hero-official-1280.avif 1280w,
                   /images/hero-official.avif 1920w"
      imagesizes="100vw"
      type="image/avif">
```

### Fix — `<picture>` layout transparency

`<picture>` is `display: inline` by default, which breaks parents using `h-full`, `position: absolute; inset: 0`, or `aspect-ratio`. Add this to `src/tailwind.css` (see section 1):

```css
@layer base {
  picture { display: contents; }
}
```

Now the inner `<img>` participates in the parent layout exactly as if the wrapper weren't there.

### Verification

1. View-source: every hero/amenity image is wrapped in `<picture>` with at least the AVIF + WebP `<source>` plus an `<img>` fallback.
2. DevTools Network panel on a 390 CSS-px mobile: image requests are the `-768.avif` files (not the desktop variants).
3. Lighthouse mobile: `Properly size images`, `Serve images in next-gen formats`, `Efficiently encode images` all clear.

---

## 4. Explicit `width`/`height` on every `<img>`

### Problem

Without `width` + `height`, the browser doesn't know how much vertical space to reserve, so each image streaming in shoves the rest of the page down (Cumulative Layout Shift). Lighthouse flags this under `Avoid large layout shifts` and `Image elements have explicit width and height`.

### Fix

Look up dimensions once with ImageMagick, then write them into every `<img>`:

```bash
magick identify -format "%f %wx%h\n" images/*.jpg
```

```html
<img src="/images/hero-official.jpg" alt="..." width="1920" height="1080" />
```

Add the attributes to **every** `<img>` in the repo, not just hero images. The blog post template's featured image, the inline content figures, the related-posts thumbnails — all of them.

### Verification

Run `axe` or `lighthouse --only-categories=performance,accessibility`. The `image-element-explicit-width-height` audit should pass and CLS should drop near zero.

---

## Per-site checklist

For each of `../langvan` and `../greenhl`, apply in this order:

- [ ] Create `package.json` + `tailwind.config.js` + `src/tailwind.css` at the repo root. Copy color tokens from the existing inline `tailwind.config` script into `tailwind.config.js`. Run `npm install` + `npm run build:css`.
- [ ] Create `/css/fonts.css` with self-hosted Montserrat `@font-face` rules. Download WOFF2s into `/fonts/`. Add `<link rel="preload">` for the two weights used above the fold; replace Google Fonts link with `<link rel="stylesheet" href="/css/fonts.css">`.
- [ ] For every HTML page (`index.html`, `blog/index.html`, every `blog/*.html`): delete the Play CDN script, delete the inline `tailwind.config` block, delete the Google Fonts links, add the new `/css/fonts.css` + `/css/tw.min.css` + font preloads + LCP image preload.
- [ ] Encode AVIF + WebP variants (768w / 1280w / 1920w) for the top 8–12 images per site. Wrap them in `<picture>` in the HTML. Add explicit `width` + `height` on every `<img>`.
- [ ] Run a Lighthouse mobile check on a deployed preview before tagging done.

The bash one-liner for the per-page edit (Tailwind + fonts) can be scripted with `perl -i`, but per-page review is recommended because OG meta and JSON-LD blocks should not be touched. See `hnseasonsgarden/index.html` head section for the canonical post-migration shape.
