#!/usr/bin/env python3
"""Build hotspot JS array from detected icon positions, keyed by (cx_pct, cy_pct).
Filters legend (cy < 26%). Each entry is (kind, name, days, desc)."""
import json

# Map (cx_pct, cy_pct) -> classification (rounded to nearest 0.1)
# (visual reading of contact-sheet.png, after legend removal)
CLASSIFICATIONS = {
    # Right side icons (above main strip)
    (90.8, 32.6): ('fietsenstalling', 'Fietsenstalling',  ['do','vr','za'], 'Fietsenstalling — parkeer hier je fiets veilig.'),
    (90.8, 38.8): ('ehbo',             'EHBO',             ['do','vr','za'], 'EHBO-post — eerste hulp bij ongelukjes en kleine kwaaltjes.'),
    (86.4, 45.9): ('muziek',           'Live muziek',      ['do','vr','za'], 'Live muziek — luister naar bands en artiesten.'),

    # Main strip (cy ≈ 49.5%) — left to right
    (13.9, 49.5): ('fietsenstalling',  'Fietsenstalling',  ['do','vr','za'], 'Fietsenstalling — parkeer hier je fiets veilig.'),
    (15.9, 49.5): ('eten',             'Eten',             ['do','vr','za'], 'Foodstand — kies uit diverse gerechten en snacks.'),
    (17.8, 49.5): ('eten',             'Eten',             ['do','vr','za'], 'Foodstand — kies uit diverse gerechten en snacks.'),
    (19.8, 49.5): ('zitplekken',       'Zitplekken',       ['do','vr','za'], "Zitplekken — neem even pauze met een drankje of hapje."),
    (21.8, 49.5): ('zitplekken',       'Zitplekken',       ['do','vr','za'], "Zitplekken — neem even pauze met een drankje of hapje."),
    (23.8, 49.5): ('drinks',           'Drinks',           ['do','vr','za'], 'Drinks — frisdrank, bier, wijn en cocktails.'),
    (25.8, 49.5): ('dansen',           'Dansen',           ['do','vr','za'], "Dansvloer — beweeg op de muziek van DJ's en bands."),
    (27.8, 49.5): ('muziek',           'Live muziek',      ['do','vr','za'], 'Live muziek — luister naar bands en artiesten.'),
    (29.8, 49.5): ('zitplekken',       'Zitplekken',       ['do','vr','za'], 'Zitplekken — neem even pauze met een drankje of hapje.'),
    (31.8, 49.5): ('drinks',           'Drinks',           ['do','vr','za'], 'Drinks — frisdrank, bier, wijn en cocktails.'),
    (37.3, 49.5): ('eten',             'Eten',             ['do','vr','za'], 'Foodstand — kies uit diverse gerechten en snacks.'),
    (39.3, 49.5): ('eten',             'Eten',             ['do','vr','za'], 'Foodstand — kies uit diverse gerechten en snacks.'),
    (41.3, 49.5): ('zitplekken',       'Zitplekken',       ['do','vr','za'], 'Zitplekken — neem even pauze met een drankje of hapje.'),
    (43.3, 49.5): ('muziek',           'Live muziek',      ['do','vr','za'], 'Live muziek — luister naar bands en artiesten.'),
    (45.2, 49.5): ('zitplekken',       'Zitplekken',       ['do','vr','za'], 'Zitplekken — neem even pauze met een drankje of hapje.'),
    (47.2, 49.5): ('drinks',           'Drinks',           ['do','vr','za'], 'Drinks — frisdrank, bier, wijn en cocktails.'),
    (49.2, 49.5): ('koffie',           'Koffie',           ['do','vr','za'], 'Koffie & thee — warme drankjes en lekker baksel.'),
    (51.2, 49.5): ('hinderattractie',  'Kinderattractie',  ['do','vr','za'], 'Kinderattractie — vermaak voor de allerkleinsten.'),
    (53.2, 49.5): ('hinderattractie',  'Kinderattractie',  ['do','vr','za'], 'Kinderattractie — vermaak voor de allerkleinsten.'),
    (55.2, 49.5): ('hinderattractie',  'Kinderattractie',  ['do','vr','za'], 'Kinderattractie — vermaak voor de allerkleinsten.'),
    (58.4, 49.5): ('eten',             'Eten',             ['do','vr','za'], 'Foodstand — kies uit diverse gerechten en snacks.'),
    (60.3, 49.5): ('eten',             'Eten',             ['do','vr','za'], 'Foodstand — kies uit diverse gerechten en snacks.'),
    (62.3, 49.5): ('zitplekken',       'Zitplekken',       ['do','vr','za'], 'Zitplekken — neem even pauze met een drankje of hapje.'),
    (64.2, 49.5): ('eten',             'Eten',             ['do','vr','za'], 'Foodstand — kies uit diverse gerechten en snacks.'),
    (66.2, 49.5): ('drinks',           'Drinks',           ['do','vr','za'], 'Drinks — frisdrank, bier, wijn en cocktails.'),
    (68.1, 49.5): ('eten',             'Eten',             ['do','vr','za'], 'Foodstand — kies uit diverse gerechten en snacks.'),
    (70.1, 49.5): ('eten',             'Eten',             ['do','vr','za'], 'Foodstand — kies uit diverse gerechten en snacks.'),
    (74.0, 49.5): ('drinks',           'Drinks',           ['do','vr','za'], 'Drinks — frisdrank, bier, wijn en cocktails.'),
    (76.0, 49.5): ('zitplekken',       'Zitplekken',       ['do','vr','za'], 'Zitplekken — neem even pauze met een drankje of hapje.'),
    (77.9, 49.5): ('zitplekken',       'Zitplekken',       ['do','vr','za'], 'Zitplekken — neem even pauze met een drankje of hapje.'),
    (79.9, 49.5): ('eten',             'Eten',             ['do','vr','za'], 'Foodstand — kies uit diverse gerechten en snacks.'),

    # Left side (LOL OP 'T LUITJE area)
    (9.9,  51.4): ('fietsenstalling',  'Fietsenstalling',  ['do','vr','za'], 'Fietsenstalling — parkeer hier je fiets veilig.'),
    (9.9,  55.9): ('reuzenrad',        'Reuzenrad',        ['do','vr','za'], 'Reuzenrad — geniet van het uitzicht over de haven (12:00 – 01:00).'),
    (7.9,  58.2): ('hinderattractie',  'Kinderattractie',  ['do','vr','za'], 'Kinderattractie — vermaak voor de allerkleinsten.'),

    # Middle (between Plein van Toen sections — quay walkway)
    (49.6, 59.5): ('voetganger',       'Wandelpad / oversteek', ['do','vr','za'], 'Voetgangersoversteek tussen de twee delen van Plein van Toen.'),

    # Los op de Wal area (bottom right peninsula with overdekte dansvloer)
    (68.1, 74.1): ('zitplekken',       'Zitplekken',       ['do','vr','za'], 'Zitplekken — neem even pauze met een drankje of hapje.'),
    (76.1, 74.1): ('eten',             'Eten',             ['do','vr','za'], 'Foodstand — kies uit diverse gerechten en snacks.'),
    (63.0, 77.4): ('muziek',           'Live muziek',      ['do','vr','za'], 'Live muziek bij Los op de Wal.'),
    (65.8, 80.3): ('drinks',           'Drinks',           ['do','vr','za'], 'Drinks bij de overdekte dansvloer.'),

    # Bottom-left near Haven Hang-Out
    (18.5, 80.7): ('vuurwerk',         'Vuurwerk',         ['za'],            'Vuurwerkshow — afsluiter op zaterdag om middernacht.'),
}

KIND_TO_CAT = {
    'eten':            'food',
    'drinks':          'food',
    'koffie':          'food',
    'zitplekken':      'facility',
    'wc':              'facility',
    'streekmarkt':     'facility',
    'hinderattractie': 'activity',
    'reuzenrad':       'activity',
    'dansen':          'activity',
    'muziek':          'activity',
    'fietsenstalling': 'facility',
    'ehbo':            'facility',
    'reddingsbrigade': 'facility',
    'suppen':          'activity',
    'waterpolo':       'activity',
    'boegspriet':      'activity',
    'zwemmen':         'activity',
    'vuurwerk':        'activity',
    'voetganger':      'facility',
}

with open('icons-detected.json') as f:
    icons = json.load(f)

results = []
matched_keys = set()
for ic in icons:
    if ic['cy_pct'] < 26.0:
        continue
    # find matching classification (within 0.5% tolerance)
    match_key = None
    for k in CLASSIFICATIONS:
        if abs(k[0] - ic['cx_pct']) < 0.5 and abs(k[1] - ic['cy_pct']) < 0.5:
            match_key = k
            break
    if not match_key:
        print(f"WARN: no classification for ({ic['cx_pct']:.1f}%, {ic['cy_pct']:.1f}%) color={ic['color']}")
        continue
    matched_keys.add(match_key)
    kind, name, days, desc = CLASSIFICATIONS[match_key]
    cat = KIND_TO_CAT[kind]
    cx, cy = ic['cx_pct'], ic['cy_pct']
    w, h = ic['w_pct'], ic['h_pct']
    results.append({
        'id': f"{kind}-{cx:.0f}-{cy:.0f}",
        'name': name,
        'cat': cat,
        'kind': kind,
        'x': round(cx - w / 2, 2),
        'y': round(cy - h / 2, 2),
        'w': round(w, 2),
        'h': round(h, 2),
        'days': days,
        'desc': desc,
    })

unmatched = set(CLASSIFICATIONS.keys()) - matched_keys
if unmatched:
    print(f"\nClassifications without a match: {unmatched}")

print(f"\nBuilt {len(results)} icon hotspots")
with open('hotspots-icons.json', 'w') as f:
    json.dump(results, f, indent=2)
