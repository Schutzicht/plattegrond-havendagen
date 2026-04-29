#!/usr/bin/env python3
"""Detect icon squares in the plattegrond by color, output JSON of positions."""
from PIL import Image, ImageDraw
import numpy as np
from scipy import ndimage
import json

SRC = "07-16HAVEN_PlattegrondTijdschema.pdf.png"
img = Image.open(SRC).convert("RGB")
arr = np.array(img)
H, W, _ = arr.shape
print(f"Image: {W}x{H}")

# Color signatures (RGB target, tolerance, label)
COLOR_DEFS = [
    ('orange',     (247, 148, 51),  30),
    ('red',        (228, 70, 60),   40),
    ('darkteal',   (20, 95, 104),   18),
    ('mint',       (175, 218, 210), 25),  # WC/zitplekken/hinderattractie/streekmarkt - light teal/mint
    ('lightgreen', (182, 223, 166), 25),  # drinks
    ('pink',       (230, 175, 200), 35),  # live muziek
    ('blue',       (110, 168, 200), 22),  # water activities (suppen etc)
]

# Crop to map area only — exclude the legend at top
# Legend takes top ~12% of image
MAP_TOP = int(0.12 * H)
MAP_BOTTOM = H

def find_squares(mask, min_size=2500, max_size=9000):
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
        bbox_size = w * h
        density = size / bbox_size
        if density < 0.62:
            continue
        cx = int((x0 + x1) / 2)
        cy = int((y0 + y1) / 2)
        blobs.append({
            'cx': cx, 'cy': cy,
            'x': int(x0), 'y': int(y0),
            'w': int(w), 'h': int(h),
            'size': size,
        })
    return blobs

all_blobs = []
mask_workspace = np.zeros((H, W), dtype=bool)
mask_workspace[MAP_TOP:MAP_BOTTOM, :] = True

for label, target, tol in COLOR_DEFS:
    diff = np.abs(arr.astype(int) - np.array(target))
    color_mask = np.all(diff <= tol, axis=2) & mask_workspace
    blobs = find_squares(color_mask)
    print(f"  {label:12s} {target} tol={tol}: {len(blobs)} squares")
    for b in blobs:
        b['color'] = label
    all_blobs.extend(blobs)

# Dedupe — drop near-duplicates (multiple colors matching same blob)
def too_close(a, b, dist=30):
    return abs(a['cx'] - b['cx']) < dist and abs(a['cy'] - b['cy']) < dist

deduped = []
for b in all_blobs:
    dup = next((d for d in deduped if too_close(d, b)), None)
    if dup:
        # Keep the one with higher density / better match
        if b['size'] > dup['size']:
            deduped.remove(dup)
            deduped.append(b)
    else:
        deduped.append(b)

# Sort by y then x for readability
deduped.sort(key=lambda b: (b['cy'] // 30, b['cx']))
print(f"\nTotal unique icon squares: {len(deduped)}")

# Convert to percentages
result = []
for b in deduped:
    result.append({
        'cx_pct': round(b['cx'] / W * 100, 2),
        'cy_pct': round(b['cy'] / H * 100, 2),
        'w_pct':  round(b['w']  / W * 100, 2),
        'h_pct':  round(b['h']  / H * 100, 2),
        'color':  b['color'],
        'size':   b['size'],
    })

# Save JSON
with open('icons-detected.json', 'w') as f:
    json.dump(result, f, indent=2)

# Render visualization
overlay = img.copy()
draw = ImageDraw.Draw(overlay)
COLOR_VIS = {
    'orange': (255, 100, 0), 'red': (255, 0, 0),
    'darkteal': (0, 200, 200), 'mint': (180, 240, 240),
    'lightgreen': (0, 255, 0), 'pink': (255, 100, 200),
    'blue': (0, 100, 255),
}
for b in deduped:
    c = COLOR_VIS[b['color']]
    draw.rectangle([b['x'], b['y'], b['x']+b['w'], b['y']+b['h']],
                   outline=c, width=4)
overlay.save('icons-debug.png')
print("Saved icons-detected.json and icons-debug.png")
