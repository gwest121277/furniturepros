# -*- coding: utf-8 -*-
"""Render the FP monogram to favicon assets.

Follows the inline <symbol id="fp-mark"> in index.html: a ring at cx/cy 50
r 45.5 on a 0-100 grid, with an F set high-left and a P dropped low-right so
the two overlap. Two deliberate departures from the on-page logo:

  * Georgia Bold rather than DM Serif Display. A high-contrast display serif
    loses its thin strokes entirely at 16px; Georgia keeps the serif character
    and survives the downscale.
  * The ring is drawn heavier, and heavier still on the 16px frame.

The glyph pair is measured and re-centred rather than positioned by eye, since
Georgia's metrics differ from DM Serif Display's.
"""
from PIL import Image, ImageDraw, ImageFont
import os

BASE  = r"C:\Users\gwest\Desktop\Furniture Pros\assets\images\favicon"
IVORY = (242, 235, 221)
OLIVE = (70, 85, 58)
FONT  = r"C:\Windows\Fonts\georgiab.ttf"
TYPE_SIZE = 50.0
F_POS, P_POS = (26.0, 62.0), (60.0, 79.0)

os.makedirs(BASE, exist_ok=True)


def centring_offset():
    """Measure the F+P pair and return the shift that centres it in the ring."""
    S = 1000
    k = S / 100.0
    f = ImageFont.truetype(FONT, int(round(TYPE_SIZE * k)))
    probe = Image.new("L", (S, S), 0)
    d = ImageDraw.Draw(probe)
    d.text((F_POS[0] * k, F_POS[1] * k), "F", font=f, fill=255, anchor="ms")
    d.text((P_POS[0] * k, P_POS[1] * k), "P", font=f, fill=255, anchor="ms")
    x0, y0, x1, y1 = probe.getbbox()
    cx = (x0 + x1) / 2 / k
    cy = (y0 + y1) / 2 / k
    return 50 - cx, 50 - cy


DX, DY = centring_offset()


def render(size, ring_weight):
    k = size / 100.0
    img = Image.new("RGB", (size, size), IVORY)
    d = ImageDraw.Draw(img)

    r = 45.5 * k
    d.ellipse([50 * k - r, 50 * k - r, 50 * k + r, 50 * k + r],
              outline=OLIVE, width=max(1, int(round(ring_weight * k))))

    f = ImageFont.truetype(FONT, int(round(TYPE_SIZE * k)))
    d.text(((F_POS[0] + DX) * k, (F_POS[1] + DY) * k), "F", font=f, fill=OLIVE, anchor="ms")
    d.text(((P_POS[0] + DX) * k, (P_POS[1] + DY) * k), "P", font=f, fill=OLIVE, anchor="ms")
    return img


SS = 8  # supersample, then LANCZOS down


def at(size, ring_weight=3.0):
    return render(size * SS, ring_weight).resize((size, size), Image.LANCZOS)


at(180).save(os.path.join(BASE, "apple-touch-icon.png"), optimize=True)
at(32).save(os.path.join(BASE, "favicon-32.png"), optimize=True)
at(16, ring_weight=4.5).save(os.path.join(BASE, "favicon-16.png"), optimize=True)

frames = [at(48), at(32), at(16, ring_weight=4.5)]
frames[0].save(os.path.join(BASE, "favicon.ico"), format="ICO",
               sizes=[(48, 48), (32, 32), (16, 16)], append_images=frames[1:])

svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="Furniture Pros">
  <rect width="100" height="100" fill="#F2EBDD"/>
  <circle cx="50" cy="50" r="45.5" fill="none" stroke="#46553A" stroke-width="3"/>
  <g fill="#46553A" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="{ts}" text-anchor="middle">
    <text x="{fx:.1f}" y="{fy:.1f}">F</text>
    <text x="{px:.1f}" y="{py:.1f}">P</text>
  </g>
</svg>
'''.format(ts=int(TYPE_SIZE),
           fx=F_POS[0] + DX, fy=F_POS[1] + DY,
           px=P_POS[0] + DX, py=P_POS[1] + DY)

with open(os.path.join(BASE, "favicon.svg"), "w", encoding="utf-8") as fh:
    fh.write(svg)

print("centring shift applied: dx %+.1f  dy %+.1f" % (DX, DY))
for n in sorted(os.listdir(BASE)):
    print("  %-24s %6d bytes" % (n, os.path.getsize(os.path.join(BASE, n))))
