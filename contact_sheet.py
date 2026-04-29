#!/usr/bin/env python3
"""Build a contact sheet of all detected icons so we can identify their pictograms."""
from PIL import Image, ImageDraw, ImageFont
import json

src = Image.open("07-16HAVEN_PlattegrondTijdschema.pdf.png").convert("RGB")
W, H = src.size

with open("icons-detected.json") as f:
    icons = json.load(f)

# Filter out legend (cy < 16%)
icons = [i for i in icons if i['cy_pct'] >= 16.0]
print(f"Filtered to {len(icons)} icons (excluded legend)")

# Sort by row then x for readable layout
icons.sort(key=lambda i: (round(i['cy_pct']), i['cx_pct']))

# Build contact sheet — 8 columns, ICON_SIZE px each, with labels
COLS = 6
ICON_PX = 320
LABEL_H = 60
PAD = 12
rows = (len(icons) + COLS - 1) // COLS
sheet_w = COLS * (ICON_PX + PAD) + PAD
sheet_h = rows * (ICON_PX + LABEL_H + PAD) + PAD
sheet = Image.new("RGB", (sheet_w, sheet_h), (40, 40, 40))
draw = ImageDraw.Draw(sheet)
try:
    font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 16)
except Exception:
    font = ImageFont.load_default()

for idx, icon in enumerate(icons):
    cx = int(icon['cx_pct'] / 100 * W)
    cy = int(icon['cy_pct'] / 100 * H)
    half = 55  # crop tight around icon
    left = max(0, cx - half)
    top = max(0, cy - half)
    right = min(W, cx + half)
    bottom = min(H, cy + half)
    crop = src.crop((left, top, right, bottom))
    crop = crop.resize((ICON_PX, ICON_PX), Image.LANCZOS)
    col = idx % COLS
    row = idx // COLS
    px = PAD + col * (ICON_PX + PAD)
    py = PAD + row * (ICON_PX + LABEL_H + PAD)
    sheet.paste(crop, (px, py))
    label = f"#{idx} {icon['color']}"
    label2 = f"({icon['cx_pct']:.1f}%, {icon['cy_pct']:.1f}%)"
    draw.text((px + 4, py + ICON_PX + 4),  label,  fill=(255, 255, 255), font=font)
    draw.text((px + 4, py + ICON_PX + 24), label2, fill=(200, 200, 200), font=font)

sheet.save("contact-sheet.png")
print(f"Saved contact-sheet.png ({sheet_w}x{sheet_h})")
