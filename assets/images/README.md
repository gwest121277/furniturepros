# Furniture Pros: Image Assets

## What's currently on the page

Five projects are wired in. Nothing here is a placeholder.

| Photo | Where it appears |
|---|---|
| `hero/desktop-hero.webp` | Hero banner, 992px and wider · social share card |
| `hero/mobile-hero.webp` | Hero banner, phones and tablets under 992px |
| `pine-dresser-after.webp` | Lead transformation |
| `pine-dresser-before.webp` | Lead transformation |
| `100-year-old-desk-before/after.webp` | Before/after grid |
| `EA-nightstand-before/after.webp` | Before/after grid |
| `desk-leg-before/after.webp` | Before/after grid, carved foot detail |
| `desk-leg-after.webp` | Craftsmanship detail, What We Do section |
| `combo-before/after.webp` | Before/after grid |
| `og/social-share.webp` | Social share card (link previews) |

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

### Frame ratios in the before/after section

Each pair sits in its own full-width row, and the two photos in a pair share one
frame so they always match. The ratio is chosen per pair, because the source
photos run all the way from 1.78 (landscape) to 0.56 (very tall portrait) and a
single shared ratio would badly crop something:

| Pair | Frame | Why |
|---|---|---|
| pine dresser | 3:2 | 1.78 and 1.00, the widest safe ratio that keeps the whole dresser in the before shot |
| secretary desk | 1:1 | 0.97 and 0.93, already near square |
| Ethan Allen nightstand | 2:3 | 0.80 and 0.56, only a tall frame keeps the feet |
| bedroom set | 1:1 | 1.14 and 1.03, near square |
| carved foot | 2:3 | 0.56 both, the one pair shot from a fixed position |

Rows differ in height because the photographs do, but every row starts and ends
on the same edges. If you add a pair, give both its photos the same
`fig--` class and pick the ratio closest to the source shape.

---

Each photo is cropped by CSS `object-fit`, and the crops have been checked so no
piece of furniture gets cut off. If you swap a file, keep roughly the same shape
(portrait vs landscape) or the crop may need adjusting in `styles.css`.

---

## The combo pair

Added to the transformation grid at your direction, labelled Before and After
like the others.

Worth knowing: the "after" reads as a styled interior rendering rather than a
photograph of those two pieces finished, and the furniture in it doesn't match
the before shot (different proportions, legs and hardware). If you'd rather it
carried a "Proposed design" label instead of "After", that's a one-line change to
the `pair__tag--after` span in `index.html`. Swapping in a real photo of the
finished pieces later needs nothing but a file with the same name.

---

## Social share card

`og/social-share.webp` is 1731 x 909, a 1.904 ratio, which is effectively the
1.91:1 that Facebook, LinkedIn and X want. It's wired to `og:image` and
`twitter:image` with matching width, height, type and alt tags.

One caveat: it's a WebP. Facebook and X handle WebP fine; some smaller link
scrapers and older LinkedIn paths still prefer JPEG or PNG. If a preview ever
comes up blank somewhere, export the same artwork as `og/social-share.jpg` and
change the two meta tags to point at it.

The `LocalBusiness` schema deliberately points its `image` at
`pine-dresser-after.webp` instead, because Google's rich results want a photo of
actual work rather than a text banner.

---

## Photos that would strengthen the page

In priority order:

**1. Hands actually working.** Sanding, staining, brushing on finish, fitting
hardware. Close and tactile, wood grain visible. This is the single most
valuable missing shot: it proves a person does this, not a factory. Would
replace the carved-foot close-up in section 3.

- Crop: 4:5 vertical · Export around 1200 × 1500

**2. A second room-styled "after".** Like the pine dresser, a finished piece in
an actual room rather than a garage or driveway. Warm light, no flash.

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
example to follow, both frames are 2252 x 4000 from the same spot, so the foot
sits in exactly the same place in both.

That matters beyond looking tidy. A drag-to-compare slider, where you pull a
handle across one frame to wipe between before and after, only works when the
two photos line up that precisely. There was one on the page and it has been
taken out, because only that single pair qualified and it left the other four
looking inconsistent. If you ever shoot a set from a tripod without moving it
between the before and the after, say so and the slider can come back for those
pairs. It is in the git history.

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
