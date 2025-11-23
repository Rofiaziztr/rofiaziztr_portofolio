# Deployment & Ops Notes

## Build & Structure

- Pure static assets: `src/index.html`, `src/styles/main.css`, `src/scripts/main.js`, and `public/assets/*`.
- Use any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages). No build step required.
- Keep paths relative when copying to `/dist` (e.g., `styles/main.css`).

## Suggested Workflow

1. Export optimized screenshots (16:9, radius 24px, lavender border `#C8C6FF`, shared shadow `0 24px 48px rgba(33,44,77,0.16)`).
2. Drop assets into `public/assets/` and update `<img>` `src` if filenames change.
3. Run a quick HTML validation (`npx htmlhint src/index.html`) and Lighthouse/Pagespeed.
4. Deploy by copying `src` contents (plus `public`) to hosting provider.

## Performance Considerations

- Compress PNGs/JPEGs with `squoosh-cli` or `sharp` to keep each under 400KB.
- Preload the Inter font via system stack only (already done) to avoid FOIT.
- Lazy-load screenshots if page becomes media-heavy.
- Keep animations light (ease/duration <= 500ms) and avoid `will-change` misuse for better performance.

## Analytics & Monitoring

- Optional: add privacy-friendly analytics (Plausible, Fathom). Inject script near the end of `<body>`.
- Use UTM parameters on LinkedIn/WhatsApp CTAs to track campaign sources.

-## Animation Notes

- The hero gradient is static in the minimal theme.
- Badge shimmer: hover-only, non-essential for screen readers;
- Reveal-on-scroll: prefer IntersectionObserver; add CSS `reveal` class with `opacity`/`transform` transitions;
- Screenshot hover: slight translateY + scale on hover only, keep shadow small;
- CTA ripple: short and subtle; avoid large repaint areas.

## Maintenance Checklist

- Update project timelines and CTA copy every quarter.
- Swap screenshots when major UI refreshes ship.
- Keep contact info (email, LinkedIn, WhatsApp) in sync with actual availability.
