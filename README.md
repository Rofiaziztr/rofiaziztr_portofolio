# Rofi Aziz Taufik Rahmat — Portfolio

Static one-page portfolio showcasing projects: Sikatrumah.co.id, Tumas, Eventflow, and Kaloriku.

Local preview: open `src/index.html` in a browser or use a small static server for local testing:

```bash
# Option A: Serve site from the project root (recommended for image assets under `public/`):
cd d:/portofolio/rofiaziztr_portofolio
python -m http.server 8080

# Option B: Serve just the `src/` folder (works if images are moved into src/assets):
cd d:/portofolio/rofiaziztr_portofolio
python -m http.server 8080 --directory src
```

Deployment: use GitHub Pages, Netlify, or Vercel. See `docs/deployment.md` for deployment guidance.

Design tokens: sky–lavender gradients, `#C8C6FF` border for screenshots, `0 24px 48px rgba(33,44,77,0.16)` shadow, screenshot corner radius 24px.

## Hero background (static)

The hero uses a simple static gradient background for a minimal, modern look. If you'd prefer to reintroduce an animation, please open an issue or ask so we can rework a lightweight, accessible approach.

Tips: The hero is static. To re-enable a lightweight animation later, reduce motion amplitudes and durations and ensure `prefers-reduced-motion` is respected.

Notes on hero:

- The hero uses a static gradient background; the decorative SVG shell is not included to maintain a minimal visual layout. If you want a dynamic hero (particles/Lottie), we can reintroduce a lightweight safe solution with lazy loading.

## If you prefer to serve `src/` only (optional)

If you run the dev server with `--directory src`, the `public/assets/` folder is outside the server root. Run the helper script to copy `public/assets` into `src/assets` and optionally create safe hyphenated filenames:

```bash
python scripts/copy_assets_to_src.py
# then start server  (option B)
python -m http.server 8080 --directory src
```

This provides a developer-friendly way to preview the site while keeping the canonical paths in `public/` intact.

Tip: If screenshots still do not appear, try renaming files to remove spaces (e.g. `halaman-home-Kaloriku.png`) and update references in `src/index.html`. Avoid spaces and special chars in asset file names when possible for cross-platform compatibility.

Project labels:

- Production: Sikatrumah.co.id is marked as a production project.\
- Academic prototype: Eventflow, Tumas, and Kaloriku are marked as academic prototypes with a small badge in the project cards.

## Code optimizations added

- Consolidated all `DOMContentLoaded` handlers in `src/scripts/main.js` into a single `initAll()` function to reduce redundant event listeners and improve startup ordering.
- Added `loading="lazy"` and `decoding="async"` to project screenshot images for improved page load performance.
- `resolveBrokenAssets()` has been optimized to check multiple candidate paths in parallel and now includes a timeout to avoid waiting on unreachable hosts.
  Note: Hero animations (Lottie/Particles) are not included by default to keep the site minimal; they can be added later with lazy-loading and accessibility safeguards.
- Scroll listeners use `{ passive: true }` to improve scrolling performance.
- Added a helper script `scripts/copy_assets_to_src.py` to copy `public/assets` into `src/assets` for local servers serving `src/` only.
 - Project cards reveal strictly one-by-one (sequential) when they enter the viewport; handles reduced-motion preferences gracefully.
  - The per-card reveal is sequenced with a short pause between cards (150ms by default). Change `REVEAL_PAUSE_MS` in `src/scripts/main.js` to customize.
