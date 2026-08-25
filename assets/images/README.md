# Furniture Pros: Image Assets

## What's currently on the page

Four real projects are wired in. Nothing here is a placeholder.

| Photo | Where it appears |
|---|---|
| `hero/desktop-hero.webp` | Hero banner, 992px and wider · social share card |
| `hero/mobile-hero.webp` | Hero banner, phones and tablets under 992px |
| `pine-dresser-after.webp` | Lead transformation |
| `pine-dresser-before.webp` | Lead transformation |
| `100-year-old-desk-before/after.webp` | Before/after grid |
| `EA-nightstand-before/after.webp` | Before/after grid |
| `EA-nightstand-after.webp` | Featured project (section 4) |
| `desk-leg-before/after.webp` | Drag-to-compare detail slider |
| `desk-leg-after.webp` | Craftsmanship detail (section 3) |

### About the hero banners

Both banners have the headline, body copy, CTA and service strip baked in as
pixels. Search engines and screen readers can't read pixels, so the same wording
is repeated in the page as invisible text (`sr-only`), identical to what the
image shows, which keeps the H1 and hero copy working for local SEO. There's
also a real, tappable "Send Us a Photo" button below the banner, and the banner
itself links to the form, because the artwork depicts a button and people will
tap it.

**Why the breakpoint is 992px, not 768px.** The desktop banner is 1672px wide.
Rendered on a 768px tablet, its service-strip text scales down to about 8px , 
unreadable. So tablets get the portrait banner instead, capped at 544px wide so
it doesn't run over 1300px tall. Its background is warm ivory, the same as the
page, so it reads as floating rather than boxed.

**If you ever edit the banners, edit the page text to match.** The invisible
text and the pixels need to say the same thing.

A third banner cropped for tablet (roughly 4:3, around 1200 × 900, text sized to
stay readable at 768px) would let tablets use a landscape layout. Optional, most
traffic is phone and desktop, and both are already right.

---

Each photo is cropped by CSS `object-fit`, and the crops have been checked so no
piece of furniture gets cut off. If you swap a file, keep roughly the same shape
(portrait vs landscape) or the crop may need adjusting in `styles.css`.

---

## Not used: `combo-before.webp` / `combo-after.webp`

**These are left out of the page on purpose.**

`combo-before.webp` is a genuine photo of two real pieces, the taped-up
waterfall tallboy and nightstand. But `combo-after.webp` is a styled interior
rendering, not a photograph of those pieces finished. The furniture in it
doesn't match the furniture in the before shot: different proportions, different
legs, different hardware.

Publishing it under an "After" label would show prospective customers a result
that wasn't produced in the shop. Everything else on this page is real work, and
that's the page's entire persuasive power, so this pair stays out until there's
a real photo of the finished pieces.

If the render is a **design concept** you showed a client, it can absolutely go
on the page, but labelled as a proposed design, not as completed work. Say the
word and it'll be added that way.

The files are still here; nothing has been deleted.

---

## Photos that would strengthen the page

In priority order:

**1. Hands actually working.** Sanding, staining, brushing on finish, fitting
hardware. Close and tactile, wood grain visible. This is the single most
valuable missing shot: it proves a person does this, not a factory. Would
replace the carved-foot close-up in section 3.

- Crop: 4:5 vertical · Export around 1200 × 1500

**2. A second room-styled "after".** Like the pine dresser, a finished piece in
an actual room rather than a garage or driveway. Warm light, no flash. Would give
the featured-project section its own image instead of reusing the nightstand.

- Crop: 4:5 vertical or square · Export around 1400 × 1750

**3. A tablet banner.** See the note above. Only worth doing if you see real
tablet traffic.

---

## Adding a new before/after pair

Name the files `piece-name-before.webp` and `piece-name-after.webp` and drop
them in `transformations/`. Then copy an existing `<figure class="pair">` block
in `index.html`, point it at the new filenames, and update the caption and alt
text.

**The one rule that matters most:** within a pair, match the angle, the
distance, and the lighting as closely as you can. The `desk-leg` pair is the
example to follow, both frames were shot from the same spot, which is exactly
why the drag slider works on it. The other pairs are shot too differently to
slide, so they're shown side by side instead.

Don't clean the piece up before the "before" shot. Genuine damage is the proof.

---

## Export settings

- **Format:** `.webp` (what you're already using, and the smallest) or
  `.jpg`. If your phone shoots HEIC, convert first.
- **File size:** keep each under about 400 KB. Page speed is a direct Google
  ranking factor for local search. <https://squoosh.app>: drag the file in, set
  quality around 80, download.
- Current files run 44 KB to 716 KB. `EA-nightstand-after.webp` (716 KB) and
  `desk-leg-before.webp` (539 KB) are the two worth re-exporting smaller.
