# One-Page Wireframe Notes

## Global

- Width: 1200px max with 48px gutters on desktop, 20px on mobile.
- Section spacing: 120px desktop / 72px tablet / 56px mobile.
- Background gradient anchors: top hero uses sky → lavender diagonal (`#E6F0FF` → `#E9E5FF`), middle sections get white cards, footer gradient reverses.
- Typography scale: 64/48 hero, 36 section headings, 20 body, 16 meta.

## Navigation (sticky)

- Left-aligned name + role.
- Right-aligned anchor links: About, Timeline, Projects, Tooling, Contact.
- CTA button "Work With Me" anchored to contact section.

## Hero Block

```
-------------------------------------------------
| Greeting text (left)      | Badge column      |
| Value statement           |  [Reliable]       |
| Action buttons (3)        |  [Transparent]    |
| Micro metrics row         |  [Budget-Friendly]|
-------------------------------------------------
```

- Micro metrics row lists "1 live deployment • 3 academic accelerators".

## Timeline Strip

- Horizontal card with three columns; each column shows duration, label, short note.
- Light border, subtle gradient background.

## Project Grid

- Two rows of cards (sikatrumah + eventflow on row1, tumas + kaloriku row2).
- Each card layout:

```
 ------------------------------
 | 16:9 screenshot (rounded)  |
 | Title + tag                |
 | Narrative paragraph        |
 | Highlight bullets (3)      |
 | Stack badges row           |
 ------------------------------
```

- Screenshot frame spec: 24px radius, lavender border `#C8C6FF`, shadow `0 24px 48px rgba(33,44,77,0.16)`.
- CTA chip ("View sprint log" placeholder) optional.

## Tooling Highlights

- Three columns featuring BladeWind, FilePckr, DatePickr.
- Each card uses icon circle, short blurb, note on where it’s used.

## Stack Badge Wall

- Monochrome shield-style SVG chips arranged in two rows; background `#f5f4ff` with 16px radius.

## Contact CTA

- Gradient panel + portrait placeholder circle.
- Headline + body copy left, buttons (Email, LinkedIn, WhatsApp) right.
- Footer includes resume download link and copyright.

## Mobile Notes

- Nav condenses to hamburger (optional, can stack anchors vertically).
- Project cards become single column with screenshot on top, content below.
- Timeline becomes stacked cards.
