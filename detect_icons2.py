#!/usr/bin/env python3
"""Better icon detection: scan the icon strip, find each square, classify by edge color."""
from PIL import Image, ImageDraw, ImageFont
import numpy as np
from scipy import ndimage
import json

SRC = "07-16HAVEN_PlattegrondTijdschema.pdf.png"
img = Image.open(SRC).convert("RGB")
arr = np.array(img)
H, W, _ = arr.shape

# Background of map's "pavement" strip is roughly grayish-white (240,240,240)
# Icon squares are colored. Find any pixel that is NOT pavement and NOT teal-water
# in expected icon-strip rows.

# Define icon background colors (the FILL of the square, not the white pictogram)
PALETTE = [
    # name, (R,G,B), tolerance
    ('eten',           (247, 148, 51),  35),   # orange
    ('vuurwerk',       (247, 148, 51),  35),   # orange (same — distinguish by location/day)
    ('reddingsbrigade',(228,  40,  40), 50),   # red
    ('ehbo',           (228,  40,  40), 50),   # red (same color)
    ('koffie',         ( 20,  95, 104), 22),   # dark teal — koffie/dansen/fietsenstalling/reuzenrad
    ('wc',             (179, 219, 211), 28),   # mint/light teal
    ('zitplekken',     (179, 219, 211), 28),
    ('hinderattractie',(179, 219, 211), 28),
    ('streekmarkt',    (179, 219, 211), 28),
    ('drinks',         (179, 224, 158), 30),   # light green
    ('muziek',         (220, 165, 200), 45),   # pink/purple
    ('suppen',         (110, 166, 192), 28),   # blue
    ('waterpolo',      (110, 166, 192), 28),
    ('boegspriet',     (110, 166, 192), 28),
    ('zwemmen',        (110, 166, 192), 28),
]

# But we cannot tell apart eten vs vuurwerk by color alone. Detection finds positions; classification by row+context comes later.
# So for the FIRST PASS, we only need 7 unique colors:
COLORS = {
    'orange':   (247, 148, 51),
    'red':      (228, 40, 40),
    'darkteal': (20, 95, 104),
    'mint':     (204, 222, 222),
    'green':    (171, 225, 136),
    'pink':     (191, 154, 202),
    'blue':     (110, 166, 192),
    'cyan':     (57,  182, 207),
}
TOL = {
    'orange':   30,
    'red':      55,
    'darkteal': 22,
    'mint':     14,
    'green':    25,
    'pink':     30,
    'blue':     25,
    'cyan':     22,
}

# Skip legend area (top ~9%)
MAP_TOP = int(0.09 * H)

# Each icon square is roughly 70x70 in the 5000-wide image
# Size in pixels: ~4500 to 7500
def find_squares(mask, min_size=2800, max_size=8500):
    labels, n = ndimage.label(mask)
    blobs = []
    for i in range(1, n + 1):
        component = (labels == i)
        size = int(component.sum())
        if size < min_size or size > max_size:
            continue
        ys, xs = np.where(component)
        x0, x1 = xs.min(), xs.max()
        y0, y1 = ys.min(), ys.max()
        w = x1 - x0 + 1
        h = y1 - y0 + 1
        if not (0.7 < w / h < 1.45):
            continue
        if not (50 < w < 110 and 50 < h < 110):
            continue
        density = size / (w * h)
        if density < 0.55:
            continue
        cx = int((x0 + x1) / 2)
        cy = int((y0 + y1) / 2)
        blobs.append({
            'cx': cx, 'cy': cy,
            'x0': int(x0), 'y0': int(y0),
            'x1': int(x1), 'y1': int(y1),
            'w': int(w), 'h': int(h),
            'size': size,
        })
    return blobs

def classify_blob(blob, arr):
    """Sample the EDGES of the blob's bounding box to determine its background color."""
    x0, y0, x1, y1 = blob['x0'], blob['y0'], blob['x1'], blob['y1']
    # Sample a thin border ring inside the blob
    pad = 4
    samples = []
    # top row
    samples.extend(arr[y0+pad, x0+pad:x1-pad].tolist())
    # bottom row
    samples.extend(arr[y1-pad, x0+pad:x1-pad].tolist())
    # left col
    samples.extend(arr[y0+pad:y1-pad, x0+pad].tolist())
    # right col
    samples.extend(arr[y0+pad:y1-pad, x1-pad].tolist())
    samples = np.array(samples)
    avg = samples.mean(axis=0).astype(int)
    return tuple(avg)

def closest_color(rgb):
    best = None
    best_d = 1e9
    for name, target in COLORS.items():
        d = sum((rgb[i] - target[i]) ** 2 for i in range(3))
        if d < best_d:
            best_d = d
            best = name
    return best, best_d

map_mask = np.zeros((H, W), dtype=bool)
map_mask[MAP_TOP:, :] = True

all_blobs = []
seen_centers = []

for cname, cval in COLORS.items():
    tol = TOL[cname]
    diff = np.abs(arr.astype(int) - np.array(cval))
    cmask = np.all(diff <= tol, axis=2) & map_mask
    blobs = find_squares(cmask)
    for b in blobs:
        # de-dupe near centers
        dup = False
        for sc in seen_centers:
            if abs(sc[0] - b['cx']) < 25 and abs(sc[1] - b['cy']) < 25:
                dup = True
                break
        if dup:
            continue
        seen_centers.append((b['cx'], b['cy']))
        # classify by edge color
        edge_rgb = classify_blob(b, arr)
        cls, _ = closest_color(edge_rgb)
        b['color'] = cls
        b['edge_rgb'] = [int(x) for x in edge_rgb]
        all_blobs.append(b)
    print(f"  Pass {cname}: total so far {len(all_blobs)}")

# Sort by row (snap to ~30px) then x
all_blobs.sort(key=lambda b: (b['cy'] // 35, b['cx']))

print(f"\nTotal: {len(all_blobs)} icon squares")
for b in all_blobs:
    print(f"  ({b['cx']/W*100:5.1f}%, {b['cy']/H*100:5.1f}%) {b['w']}x{b['h']}  color={b['color']:10s} edge=rgb{tuple(b['edge_rgb'])}")

# Save JSON
out = []
for b in all_blobs:
    out.append({
        'cx_pct': round(b['cx'] / W * 100, 2),
        'cy_pct': round(b['cy'] / H * 100, 2),
        'w_pct':  round(b['w']  / W * 100, 2),
        'h_pct':  round(b['h']  / H * 100, 2),
        'color':  b['color'],
        'edge_rgb': b['edge_rgb'],
    })
with open('icons-detected.json', 'w') as f:
    json.dump(out, f, indent=2)

# Visual debug
overlay = img.copy()
draw = ImageDraw.Draw(overlay)
COLOR_VIS = {
    'orange':(255,80,0), 'red':(255,0,0), 'darkteal':(0,200,200),
    'mint':(150,240,230), 'green':(0,255,80), 'pink':(255,80,200),
    'blue':(0,80,255),
}
for b in all_blobs:
    c = COLOR_VIS.get(b['color'], (255,255,0))
    draw.rectangle([b['x0']-2, b['y0']-2, b['x1']+2, b['y1']+2], outline=c, width=5)
overlay.save('icons-debug.png')
print("Saved icons-detected.json and icons-debug.png")
