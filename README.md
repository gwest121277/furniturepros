# Furniture Pros — Landing Page

One-page landing site for **Furniture Pros**, furniture restoration and
refinishing serving Roseville, Sacramento, and surrounding areas.

**Live:** https://furniturepros.shop
**Slogan:** Love Your Furniture Again.

Static HTML, CSS, and vanilla JavaScript. No build step, no dependencies, no
framework. Art direction follows [`design.md`](design.md) — treat that file as
the controlling design authority for any future change.

---

## Files

```
index.html            The landing page
thank-you.html        Post-submission confirmation
assets/css/styles.css All styling
assets/js/main.js     Photo compression, form, before/after slider, reveals
assets/images/        Your photos — see assets/images/README.md for names
netlify.toml          Publish settings + security headers
robots.txt            Crawl rules
sitemap.xml           Search engine index hints
design.md             Art direction brief
```

---

## Deploying to Netlify

1. In Netlify: **Add new site → Import an existing project → GitHub**
2. Pick the `furniturepros` repository
3. Leave the build command **empty** and set publish directory to `.`
   (`netlify.toml` already sets this)
4. Deploy

### After the first deploy — two things you must do in the dashboard

**1. Turn on form notifications.** This cannot be set from code.

> Site configuration → Forms → Form notifications → Add notification →
> Email notification → send to **FurniturePros.lincoln@gmail.com**

Without this, submissions still arrive but only appear inside the Netlify
dashboard — no email lands in your inbox.

**2. Point the domain.** Domain management → Add a domain → `furniturepros.shop`

### Test it end to end

Submit the form on the live site with three photos attached. Confirm the
submission shows up under **Forms → furniture-quote** with all three images,
and that you land on the thank-you page.

---

## The hero banner

The hero is your own banner artwork (`assets/images/hero/`), served as a
`<picture>`: the portrait version on phones and tablets, the landscape version at
992px and wider.

Because the headline, body copy and CTA are baked into those images as pixels,
Google and screen readers can't read them. So the same wording also sits in the
page as invisible `sr-only` text, and there's a real tappable button below the
banner. The banner itself links to the form, since the artwork shows a button and
people will tap it.

**If you edit a banner, edit the `sr-only` text in `index.html` to match.**

---

## How the photo upload works

Netlify Forms has two limits that shaped this:

- **One file per field.** The `multiple` attribute is not supported, so there
  are three separate inputs: `photo-1`, `photo-2`, `photo-3`.
- **8 MB maximum per submission**, with a 30-second upload timeout.

Phone photos routinely run 4–8 MB each, so three raw photos would be rejected
outright and the customer would never know why. Before anything is sent,
`assets/js/main.js` resizes each image to 1600px on its long edge and
re-encodes it as JPEG.

Measured on three 4032×3024 photos: **21.2 MB → 0.89 MB**, a 96% reduction.

If a browser can't decode an image (some HEIC cases), the original file is sent
unchanged rather than dropped. If the total still exceeds ~7.2 MB, the visitor
is told which photo to remove instead of getting a silent failure.

The form also degrades without JavaScript — it falls back to a normal POST,
though large photos may then hit the 8 MB ceiling.

### Spam protection

A honeypot field named `bot-field` is positioned off-screen (never
`display: none`, which some bots detect and skip). Netlify rejects any
submission that arrives with it filled in.

---

## Editing content

**Copy** — all text lives directly in `index.html`. Search for the section
comments (`1 · HERO`, `2 · TRANSFORMATION PROOF`, and so on).

**Photos** — see [`assets/images/README.md`](assets/images/README.md) for what's
wired where, and for the naming convention when you add a new before/after pair.
Four real projects are on the page; no placeholders remain.

**Phone and email** — `916-893-7467` and `FurniturePros.lincoln@gmail.com`
appear in the header, footer, form, thank-you page, and the `LocalBusiness`
schema. Search both HTML files if either ever changes.

**Colors and type** — every color is a CSS custom property at the top of
`styles.css`. Change one value there and it updates everywhere.

### Things deliberately left out

Per `design.md`, the page contains **no invented reviews, awards, project
counts, years in business, or certifications.** There is no testimonial
section. If you gather real reviews, the natural place for them is between
"The Plan" and the quote form.

Two spots are marked with HTML comments and are worth filling in when you can:

- A specific response time on `thank-you.html` ("we reply within one business
  day") — a real promise converts, a vague one doesn't
- Pickup/delivery, turnaround, and warranty FAQs in `index.html`, once those
  policies are settled

Captions on the before/after pairs are currently generic. Replacing them with
the real piece and the real work performed ("1940s walnut dresser, water damage
stripped and refinished") is the single highest-value copy edit on the page.

---

## Local preview

```bash
npx serve .
```

Then open http://localhost:3000.

---

## Local SEO

Targets commercial-intent local searches — people looking to hire, not to
research.

**Primary:** furniture restoration Roseville CA · furniture refinishing
Sacramento · furniture repair Roseville · antique furniture restoration
Sacramento

Implemented via a keyword-bearing title and meta description, an eyebrow label
and supporting line around the H1, geo-bearing section headings, descriptive
image alt text, and two JSON-LD blocks: a `LocalBusiness` configured as a
service-area business (`areaServed` lists ten cities, no street address
published) and a `FAQPage` matching the on-page questions.

The H1 stays the slogan — the keyword weight sits in the surrounding hero copy
so search targeting and art direction don't fight each other.

---

## Accessibility

- All 105 text elements verified against **WCAG 2.1 AA** contrast
- Before/after slider is a styled `input[type=range]` — drag *and* arrow keys
- Every form field labelled, with inline errors and an `aria-live` status region
- Skip link, visible focus rings, `prefers-reduced-motion` honored

Reveal animations start elements at `opacity: 0`. `main.js` includes a failsafe
that shows everything if the observer never fires (which happens when a tab is
opened in the background), so the page can never end up blank.
