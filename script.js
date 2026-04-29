/* ============================================================
   Plattegrond Havendagen Zierikzee — interactive hotspots
   Coordinates are in % of the map image.
   Two layers: large named regions (foodstands/podia) +
   small icon-square hotspots auto-detected from the map.
   ============================================================ */

/* ---------- 1. Named hotspots: foodstands, podia, locations ---------- */
const NAMED_HOTSPOTS = [
  /* Foodstands (orange diagonal labels) */
  { id:'kebab',     name:'Kebab',                          cat:'food', x:13.0, y:23, w:4.5, h:8.5,
    days:['do','vr','za'], desc:'Vers gegrilde kebab — broodje of schotel met salade en saus.' },
  { id:'poffertjes',name:'Poffertjes',                     cat:'food', x:17.0, y:23, w:4.5, h:8.5,
    days:['do','vr','za'], desc:'Verse poffertjes met poedersuiker en boter. Klassieker op het festival.' },
  { id:'cocktail',  name:'Cocktailbar',                    cat:'food', x:21.5, y:24, w:5.0, h:8,
    days:['do','vr','za'], desc:'Tropische cocktails, mocktails en zomerse drankjes.' },
  { id:'paling',    name:'Paling',                         cat:'food', x:33.0, y:23, w:4.0, h:8.5,
    days:['do','vr','za'], desc:'Gerookte paling — vers gerookt op locatie.' },
  { id:'mosselen',  name:'Mosselen',                       cat:'food', x:36.5, y:23, w:5.0, h:8.5,
    days:['do','vr','za'], desc:'Zeeuwse mosselen, vers uit de pan met friet en saus.' },
  { id:'friet',     name:'Friet',                          cat:'food', x:51.5, y:23, w:4.0, h:8.5,
    days:['do','vr','za'], desc:'Verse friet, knapperig gebakken met klassieke sauzen.' },
  { id:'churros',   name:'Churros',                        cat:'food', x:55.0, y:23, w:5.0, h:8.5,
    days:['do','vr','za'], desc:'Warme churros met chocolade- of kaneelsaus.' },
  { id:'bubbletea', name:'Bubble tea',                     cat:'food', x:61.5, y:21, w:5.0, h:9,
    days:['do','vr','za'], desc:'Verfrissende bubble tea in diverse smaken.' },
  { id:'swenck',    name:'Duitse Swenck grill',            cat:'food', x:66.5, y:18, w:6.5, h:11,
    days:['do','vr','za'], desc:'Duitse worsten en grillspecialiteiten van de Swenck grill.' },
  { id:'pita',      name:'Griekse pita gyros',             cat:'food', x:73.0, y:18, w:6.5, h:11,
    days:['do','vr','za'], desc:'Authentieke Griekse pita gyros met tzatziki en verse groenten.' },
  { id:'kipgrill',  name:'Kip van de grill',               cat:'food', x:79.0, y:21, w:5.5, h:10,
    days:['do','vr','za'], desc:'Hele kip van de grill, kruidig en sappig.' },
  { id:'burgers',   name:'Burgers, kibbeling & broodjes',  cat:'food', x:84.5, y:18, w:8.5, h:12,
    days:['do','vr','za'], desc:'Verse burgers, knapperige kibbeling en huisgemaakte broodjes.' },
  { id:'frikandel', name:'Frikandel (FEBO muur)',          cat:'food', x:90.0, y:54, w:6.5, h:11,
    days:['do','vr','za'], desc:'Echte FEBO muur — frikandel, kroket en bal direct uit het muurtje.' },

  /* Podia / pleinen — coords from white-banner detection */
  { id:'lolopluitje',         name:"Lol op 't Luitje",            cat:'podium', x:11.5, y:55.7, w:9.0,  h:3.9,
    days:['do','vr','za'], desc:"Sfeervol podium aan de westkant — live muziek en gezelligheid in een knus hoekje van de haven." },
  { id:'vriendenvanzierikzee',name:'Vrienden van Zierikzee',      cat:'podium', x:21.0, y:55.7, w:13.5, h:3.9,
    days:['do','vr','za'], desc:'Het podium van de Vrienden van Zierikzee met regionale acts en koren.' },
  { id:'pleinvantoen-l',      name:'Plein van Toen (links)',      cat:'podium', x:34.9, y:55.7, w:11.5, h:3.9,
    days:['do','vr','za'], desc:'Hoofdpodium aan het Plein van Toen — grote acts en het hoofdprogramma.' },
  { id:'pleinvantoen-r',      name:'Plein van Toen (rechts)',     cat:'podium', x:54.8, y:55.7, w:12.2, h:3.9,
    days:['do','vr','za'], desc:'Tweede deel van het Plein van Toen, met extra zit- en eetgelegenheid.' },
  { id:'ibietzaplein',        name:'iBietzaplein',                 cat:'podium', x:67.0, y:55.7, w:15.0, h:3.9,
    days:['do','vr','za'], desc:'iBietzaplein — DJ-podium met dansvloer en uitzicht op de haven.' },
  { id:'losopdewal',          name:'Los op de Wal',                cat:'podium', x:62.1, y:65.2, w:15.3, h:4.0,
    days:['do','vr','za'], desc:'Los op de Wal — het podium aan het water met live muziek en strandvibe.' },

  /* Bijzondere locaties */
  { id:'molen',         name:'De Molen',                  cat:'facility', x:2.5, y:18, w:7,  h:20,
    days:['za'], desc:'De molen is alleen op zaterdag geopend voor bezoek. Klim naar boven voor het mooiste uitzicht over de haven.' },
  { id:'smwo',          name:'SMWO',                      cat:'facility', x:3.5, y:50, w:5.5, h:8,
    days:['do','vr','za'], desc:'Stand van Stichting Maatschappelijk Werk en Welzijn Oosterschelderegio.' },
  { id:'havenhangout',  name:'Haven Hang-Out (rodeo stier)', cat:'activity', x:2.5, y:62, w:10, h:18,
    days:['do','vr','za'], desc:'Haven Hang-Out met rodeo stier — alleen voor jongeren tussen 12 en 18 jaar. Klim erop en hou je vast!' },
  { id:'dansvloer',     name:'Dansvloer (overdekt)',      cat:'activity', x:58.5, y:70.5, w:21, h:13,
    days:['do','vr','za'], desc:"Overdekte dansvloer — DJ's, lichten en dansen tot diep in de nacht." },
];

/* ---------- 2. Icon hotspots: auto-detected colored squares ---------- */
const ICON_HOTSPOTS = [
  { id:'fietsenstalling-91-33', name:'Fietsenstalling',       cat:'facility', kind:'fietsenstalling', x:90.02, y:30.56, w:1.64, h:4.02, days:['do','vr','za'], desc:"Fietsenstalling — parkeer hier je fiets veilig." },
  { id:'ehbo-91-39',            name:'EHBO',                  cat:'facility', kind:'ehbo',            x:90.03, y:36.80, w:1.62, h:3.97, days:['do','vr','za'], desc:"EHBO-post — eerste hulp bij ongelukjes en kleine kwaaltjes." },
  { id:'muziek-86-46',          name:'Live muziek',           cat:'activity', kind:'muziek',          x:85.55, y:43.91, w:1.66, h:4.06, days:['do','vr','za'], desc:"Live muziek — luister naar bands en artiesten." },
  { id:'fietsenstalling-14-49', name:'Fietsenstalling',       cat:'facility', kind:'fietsenstalling', x:13.06, y:47.45, w:1.64, h:4.02, days:['do','vr','za'], desc:"Fietsenstalling — parkeer hier je fiets veilig." },
  { id:'eten-16-49',            name:'Eten',                  cat:'food',     kind:'eten',            x:15.04, y:47.45, w:1.64, h:4.02, days:['do','vr','za'], desc:"Foodstand — kies uit diverse gerechten en snacks." },
  { id:'eten-18-49',            name:'Eten',                  cat:'food',     kind:'eten',            x:17.02, y:47.45, w:1.64, h:4.02, days:['do','vr','za'], desc:"Foodstand — kies uit diverse gerechten en snacks." },
  { id:'zitplekken-20-49',      name:'Zitplekken',            cat:'facility', kind:'zitplekken',      x:19.03, y:47.48, w:1.62, h:3.97, days:['do','vr','za'], desc:"Zitplekken — neem even pauze met een drankje of hapje." },
  { id:'zitplekken-22-49',      name:'Zitplekken',            cat:'facility', kind:'zitplekken',      x:21.02, y:47.48, w:1.60, h:3.97, days:['do','vr','za'], desc:"Zitplekken — neem even pauze met een drankje of hapje." },
  { id:'drinks-24-49',          name:'Drinks',                cat:'food',     kind:'drinks',          x:22.99, y:47.43, w:1.66, h:4.06, days:['do','vr','za'], desc:"Drinks — frisdrank, bier, wijn en cocktails." },
  { id:'dansen-26-49',          name:'Dansen',                cat:'activity', kind:'dansen',          x:24.99, y:47.48, w:1.62, h:3.97, days:['do','vr','za'], desc:"Dansvloer — beweeg op de muziek van DJ's en bands." },
  { id:'muziek-28-49',          name:'Live muziek',           cat:'activity', kind:'muziek',          x:26.94, y:47.43, w:1.68, h:4.06, days:['do','vr','za'], desc:"Live muziek — luister naar bands en artiesten." },
  { id:'zitplekken-30-49',      name:'Zitplekken',            cat:'facility', kind:'zitplekken',      x:28.96, y:47.48, w:1.60, h:3.97, days:['do','vr','za'], desc:"Zitplekken — neem even pauze met een drankje of hapje." },
  { id:'drinks-32-49',          name:'Drinks',                cat:'food',     kind:'drinks',          x:30.93, y:47.43, w:1.66, h:4.06, days:['do','vr','za'], desc:"Drinks — frisdrank, bier, wijn en cocktails." },
  { id:'eten-37-49',            name:'Eten',                  cat:'food',     kind:'eten',            x:36.46, y:47.45, w:1.64, h:4.02, days:['do','vr','za'], desc:"Foodstand — kies uit diverse gerechten en snacks." },
  { id:'eten-39-49',            name:'Eten',                  cat:'food',     kind:'eten',            x:38.44, y:47.45, w:1.64, h:4.02, days:['do','vr','za'], desc:"Foodstand — kies uit diverse gerechten en snacks." },
  { id:'zitplekken-41-49',      name:'Zitplekken',            cat:'facility', kind:'zitplekken',      x:40.46, y:47.48, w:1.60, h:3.97, days:['do','vr','za'], desc:"Zitplekken — neem even pauze met een drankje of hapje." },
  { id:'muziek-43-49',          name:'Live muziek',           cat:'activity', kind:'muziek',          x:42.43, y:47.43, w:1.66, h:4.06, days:['do','vr','za'], desc:"Live muziek — luister naar bands en artiesten." },
  { id:'zitplekken-45-49',      name:'Zitplekken',            cat:'facility', kind:'zitplekken',      x:44.42, y:47.48, w:1.60, h:3.97, days:['do','vr','za'], desc:"Zitplekken — neem even pauze met een drankje of hapje." },
  { id:'drinks-47-49',          name:'Drinks',                cat:'food',     kind:'drinks',          x:46.39, y:47.43, w:1.66, h:4.06, days:['do','vr','za'], desc:"Drinks — frisdrank, bier, wijn en cocktails." },
  { id:'koffie-49-49',          name:'Koffie',                cat:'food',     kind:'koffie',          x:48.38, y:47.45, w:1.64, h:4.02, days:['do','vr','za'], desc:"Koffie & thee — warme drankjes en lekker baksel." },
  { id:'hinderattractie-51-49', name:'Kinderattractie',       cat:'activity', kind:'hinderattractie', x:50.38, y:47.48, w:1.60, h:3.97, days:['do','vr','za'], desc:"Kinderattractie — vermaak voor de allerkleinsten." },
  { id:'hinderattractie-53-49', name:'Kinderattractie',       cat:'activity', kind:'hinderattractie', x:52.37, y:47.48, w:1.62, h:3.97, days:['do','vr','za'], desc:"Kinderattractie — vermaak voor de allerkleinsten." },
  { id:'hinderattractie-55-49', name:'Kinderattractie',       cat:'activity', kind:'hinderattractie', x:54.35, y:47.48, w:1.62, h:3.97, days:['do','vr','za'], desc:"Kinderattractie — vermaak voor de allerkleinsten." },
  { id:'eten-58-49',            name:'Eten',                  cat:'food',     kind:'eten',            x:57.54, y:47.45, w:1.64, h:4.02, days:['do','vr','za'], desc:"Foodstand — kies uit diverse gerechten en snacks." },
  { id:'eten-60-49',            name:'Eten',                  cat:'food',     kind:'eten',            x:59.48, y:47.45, w:1.64, h:4.02, days:['do','vr','za'], desc:"Foodstand — kies uit diverse gerechten en snacks." },
  { id:'zitplekken-62-49',      name:'Zitplekken',            cat:'facility', kind:'zitplekken',      x:61.46, y:47.48, w:1.60, h:3.97, days:['do','vr','za'], desc:"Zitplekken — neem even pauze met een drankje of hapje." },
  { id:'eten-64-49',            name:'Eten',                  cat:'food',     kind:'eten',            x:63.39, y:47.45, w:1.66, h:4.02, days:['do','vr','za'], desc:"Foodstand — kies uit diverse gerechten en snacks." },
  { id:'drinks-66-49',          name:'Drinks',                cat:'food',     kind:'drinks',          x:65.35, y:47.43, w:1.66, h:4.06, days:['do','vr','za'], desc:"Drinks — frisdrank, bier, wijn en cocktails." },
  { id:'eten-68-49',            name:'Eten',                  cat:'food',     kind:'eten',            x:67.30, y:47.45, w:1.64, h:4.02, days:['do','vr','za'], desc:"Foodstand — kies uit diverse gerechten en snacks." },
  { id:'eten-70-49',            name:'Eten',                  cat:'food',     kind:'eten',            x:69.26, y:47.45, w:1.64, h:4.02, days:['do','vr','za'], desc:"Foodstand — kies uit diverse gerechten en snacks." },
  { id:'drinks-74-50',          name:'Drinks',                cat:'food',     kind:'drinks',          x:73.17, y:47.48, w:1.66, h:4.06, days:['do','vr','za'], desc:"Drinks — frisdrank, bier, wijn en cocktails." },
  { id:'zitplekken-76-49',      name:'Zitplekken',            cat:'facility', kind:'zitplekken',      x:75.15, y:47.48, w:1.62, h:3.97, days:['do','vr','za'], desc:"Zitplekken — neem even pauze met een drankje of hapje." },
  { id:'zitplekken-78-49',      name:'Zitplekken',            cat:'facility', kind:'zitplekken',      x:77.11, y:47.48, w:1.62, h:3.97, days:['do','vr','za'], desc:"Zitplekken — neem even pauze met een drankje of hapje." },
  { id:'eten-80-49',            name:'Eten',                  cat:'food',     kind:'eten',            x:79.05, y:47.45, w:1.66, h:4.02, days:['do','vr','za'], desc:"Foodstand — kies uit diverse gerechten en snacks." },
  { id:'fietsenstalling-10-51', name:'Fietsenstalling',       cat:'facility', kind:'fietsenstalling', x:9.08,  y:49.36, w:1.64, h:4.02, days:['do','vr','za'], desc:"Fietsenstalling — parkeer hier je fiets veilig." },
  { id:'reuzenrad-10-56',       name:'Reuzenrad',             cat:'activity', kind:'reuzenrad',       x:9.10,  y:53.92, w:1.60, h:3.92, days:['do','vr','za'], desc:"Reuzenrad — geniet van het uitzicht over de haven (12:00 – 01:00)." },
  { id:'hinderattractie-8-58',  name:'Kinderattractie',       cat:'activity', kind:'hinderattractie', x:7.11,  y:56.20, w:1.62, h:3.97, days:['do','vr','za'], desc:"Kinderattractie — vermaak voor de allerkleinsten." },
  { id:'voetganger-50-60',      name:'Wandelpad / oversteek', cat:'facility', kind:'voetganger',      x:48.82, y:57.59, w:1.60, h:3.92, days:['do','vr','za'], desc:"Voetgangersoversteek tussen de twee delen van Plein van Toen." },
  { id:'zitplekken-68-74',      name:'Zitplekken',            cat:'facility', kind:'zitplekken',      x:67.34, y:72.18, w:1.60, h:3.92, days:['do','vr','za'], desc:"Zitplekken — neem even pauze met een drankje of hapje." },
  { id:'eten-76-74',            name:'Eten',                  cat:'food',     kind:'eten',            x:75.26, y:72.13, w:1.64, h:4.02, days:['do','vr','za'], desc:"Foodstand — kies uit diverse gerechten en snacks." },
  { id:'muziek-63-77',          name:'Live muziek',           cat:'activity', kind:'muziek',          x:62.13, y:75.32, w:1.66, h:4.11, days:['do','vr','za'], desc:"Live muziek bij Los op de Wal." },
  { id:'drinks-66-80',          name:'Drinks',                cat:'food',     kind:'drinks',          x:64.99, y:78.23, w:1.66, h:4.06, days:['do','vr','za'], desc:"Drinks bij de overdekte dansvloer." },
  { id:'vuurwerk-18-81',        name:'Vuurwerk',              cat:'activity', kind:'vuurwerk',        x:17.67, y:78.75, w:1.62, h:3.92, days:['za'],            desc:"Vuurwerkshow — afsluiter op zaterdag om middernacht." },

  /* WC's — cyan-detected throughout the map */
  { id:'wc-23-33',  name:'Toiletten', cat:'facility', kind:'wc', x:22.58, y:30.97, w:1.64, h:4.06, days:['do','vr','za'], desc:"Openbare toiletten." },
  { id:'wc-86-38',  name:'Toiletten', cat:'facility', kind:'wc', x:85.57, y:35.49, w:1.66, h:4.02, days:['do','vr','za'], desc:"Openbare toiletten." },
  { id:'wc-34-49',  name:'Toiletten', cat:'facility', kind:'wc', x:32.88, y:47.47, w:1.64, h:4.06, days:['do','vr','za'], desc:"Openbare toiletten." },
  { id:'wc-72-49',  name:'Toiletten', cat:'facility', kind:'wc', x:71.18, y:47.47, w:1.64, h:4.06, days:['do','vr','za'], desc:"Openbare toiletten." },
  { id:'wc-8-54',   name:'Toiletten', cat:'facility', kind:'wc', x:7.08,  y:51.69, w:1.64, h:4.02, days:['do','vr','za'], desc:"Openbare toiletten." },
  { id:'wc-73-80',  name:'Toiletten', cat:'facility', kind:'wc', x:71.87, y:78.29, w:1.66, h:4.02, days:['do','vr','za'], desc:"Openbare toiletten bij de overdekte dansvloer." },
  { id:'wc-75-80',  name:'Toiletten', cat:'facility', kind:'wc', x:73.78, y:78.29, w:1.64, h:4.02, days:['do','vr','za'], desc:"Openbare toiletten bij de overdekte dansvloer." },
  { id:'wc-77-80',  name:'Toiletten', cat:'facility', kind:'wc', x:75.78, y:78.29, w:1.64, h:4.02, days:['do','vr','za'], desc:"Openbare toiletten bij de overdekte dansvloer." },
];

/* ---------- 3. Combine and add helpers ---------- */
const HOTSPOTS = [...NAMED_HOTSPOTS, ...ICON_HOTSPOTS];

const DAY_LABELS = { do: 'Donderdag', vr: 'Vrijdag', za: 'Zaterdag' };
const CAT_LABELS = { food: 'Foodstand', podium: 'Podium', activity: 'Activiteit', facility: 'Voorziening' };

/* ---------- Render hotspots ---------- */
const layer = document.getElementById('hotspot-layer');

function renderHotspots() {
  const frag = document.createDocumentFragment();
  // Render named (large) first so icons sit on top
  HOTSPOTS.forEach(h => {
    const el = document.createElement('button');
    el.className = 'hotspot' + (h.kind ? ' is-icon' : ' is-region');
    el.type = 'button';
    el.dataset.id = h.id;
    el.dataset.cat = h.cat;
    el.dataset.days = h.days.join(',');
    el.style.left   = h.x + '%';
    el.style.top    = h.y + '%';
    el.style.width  = h.w + '%';
    el.style.height = h.h + '%';
    el.setAttribute('aria-label', h.name + ' — ' + CAT_LABELS[h.cat]);
    frag.appendChild(el);
  });
  layer.appendChild(frag);
}
renderHotspots();

/* ---------- Tooltip (desktop hover) ---------- */
const tooltip = document.getElementById('tooltip');
const isTouch = matchMedia('(hover: none)').matches;

function showTooltip(hotspot, evt) {
  const data = HOTSPOTS.find(h => h.id === hotspot.dataset.id);
  if (!data) return;

  const dayList = data.days.map(d => DAY_LABELS[d]).join(' · ');
  tooltip.innerHTML = `
    <span class="tt-cat tt-cat-${data.cat}">${CAT_LABELS[data.cat]}</span>
    <strong>${data.name}</strong>
    <span>${data.desc}</span>
    <span class="tt-days">${dayList}</span>
  `;
  tooltip.classList.add('is-visible');
  tooltip.setAttribute('aria-hidden', 'false');
  positionTooltip(evt);
}

function positionTooltip(evt) {
  if (!tooltip.classList.contains('is-visible')) return;
  const pad = 14;
  const tw = tooltip.offsetWidth;
  const th = tooltip.offsetHeight;
  let x = evt.clientX + pad;
  let y = evt.clientY + pad;
  if (x + tw > innerWidth - 8)  x = evt.clientX - tw - pad;
  if (y + th > innerHeight - 8) y = evt.clientY - th - pad;
  tooltip.style.left = Math.max(8, x) + 'px';
  tooltip.style.top  = Math.max(8, y) + 'px';
}

function hideTooltip() {
  tooltip.classList.remove('is-visible');
  tooltip.setAttribute('aria-hidden', 'true');
}

if (!isTouch) {
  layer.addEventListener('mouseover', e => {
    const hs = e.target.closest('.hotspot');
    if (hs) showTooltip(hs, e);
  });
  layer.addEventListener('mousemove', positionTooltip);
  layer.addEventListener('mouseout', e => {
    if (e.target.closest('.hotspot')) hideTooltip();
  });
}

/* ---------- Modal (click & touch) ---------- */
const backdrop  = document.getElementById('modal-backdrop');
const modalCat  = document.getElementById('modal-cat');
const modalTitle= document.getElementById('modal-title');
const modalDays = document.getElementById('modal-days');
const modalDesc = document.getElementById('modal-desc');
const modalClose= document.getElementById('modal-close');

function openModal(data) {
  modalCat.textContent = CAT_LABELS[data.cat];
  modalCat.className = 'cat-badge cat-' + data.cat;
  modalTitle.textContent = data.name;
  modalDesc.textContent = data.desc;

  modalDays.innerHTML = '';
  ['do','vr','za'].forEach(d => {
    const pill = document.createElement('span');
    pill.className = 'day-pill' + (data.days.includes(d) ? ' is-on' : '');
    pill.textContent = DAY_LABELS[d];
    modalDays.appendChild(pill);
  });

  backdrop.hidden = false;
  modalClose.focus();
}
function closeModal() { backdrop.hidden = true; }

layer.addEventListener('click', e => {
  const hs = e.target.closest('.hotspot');
  if (!hs) return;
  const data = HOTSPOTS.find(h => h.id === hs.dataset.id);
  if (data) {
    hideTooltip();
    openModal(data);
  }
});
modalClose.addEventListener('click', closeModal);
backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !backdrop.hidden) closeModal();
});

/* ---------- Day filter ---------- */
const dayBtns = document.querySelectorAll('.day-btn');
let activeDay = 'all';

function applyFilter() {
  document.querySelectorAll('.hotspot').forEach(el => {
    const days = el.dataset.days.split(',');
    const match = activeDay === 'all' || days.includes(activeDay);
    el.classList.toggle('is-dim', !match);
  });
}
dayBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    dayBtns.forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    activeDay = btn.dataset.day;
    applyFilter();
  });
});
