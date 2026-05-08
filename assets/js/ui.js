// ─────────────────────────────────────────────────────────────────────────────
// ui.js — DOM refs, custom selects, render, table, cards, images, sort, view, chips, suggestions
// ─────────────────────────────────────────────────────────────────────────────

// ── DOM refs ──
const $ = id => document.getElementById(id);
const qEl = $('qEl'), catEl = $('catEl'), confEl = $('confEl'), tierEl = $('tierEl');
const suggEl = $('suggEl');
const tbody = $('tbody'), cgrid = $('cgrid');
const panel = $('detail-panel'), panelBackdrop = $('panel-backdrop');
const panelMeta = $('panel-meta');
const appShell = $('app');
const boot = $('boot-preloader'), bootTxt = $('boot-text');
const favOnlyBtn = $('favOnlyBtn'), dsBtn = $('dsBtn');
const cmpCountEl = $('cmpCount');
const compareModal = $('compareModal'), cmpBody = $('cmpBody');

// ── Boot helpers ──
function bootShow(msg) { if (!boot) return; if (msg && bootTxt) bootTxt.textContent = msg; boot.classList.add('on'); boot.classList.remove('off'); boot.setAttribute('aria-hidden', 'false'); }
function bootMsg(msg) { if (bootTxt) bootTxt.textContent = msg; }
function bootHide() { if (!boot) return; boot.classList.remove('on'); boot.classList.add('off'); boot.setAttribute('aria-hidden', 'true'); }

// ── Status / toast ──
function setSt(state, txt) { $('sdot').className = 'dot ' + state; $('stxt').textContent = txt; }
function toast(msg, err) {
  const t = $('toast'); t.textContent = msg; t.className = 'on' + (err ? ' err' : '');
  clearTimeout(toast._t); toast._t = setTimeout(() => t.className = '', 3500);
}

// ── Active selection markers ──
function markActiveSelection() {
  document.querySelectorAll('#tbody tr.active-row').forEach(el => el.classList.remove('active-row'));
  if (activeKey) { const tr = document.querySelector(`#tbody tr[data-key="${CSS.escape(activeKey)}"]`); if (tr) tr.classList.add('active-row'); }
  document.querySelectorAll('#cgrid .pcard.active-card').forEach(el => el.classList.remove('active-card'));
  if (activeKey) { const card = document.querySelector(`#cgrid .pcard[data-key="${CSS.escape(activeKey)}"]`); if (card) card.classList.add('active-card'); }
}

// ── Card grid FLIP animation ──
function captureCGridRects() {
  const map = new Map();
  if (!cgrid) return map;
  cgrid.querySelectorAll('.pcard[data-key]').forEach(el => map.set(el.dataset.key, el.getBoundingClientRect()));
  return map;
}
function playCGridFlip(firstRects) {
  if (!cgrid || !firstRects || !firstRects.size) return;
  requestAnimationFrame(() => {
    cgrid.querySelectorAll('.pcard[data-key]').forEach(el => {
      const first = firstRects.get(el.dataset.key); if (!first) return;
      const last = el.getBoundingClientRect();
      const dx = first.left - last.left, dy = first.top - last.top;
      if (!dx && !dy) return;
      el.style.willChange = 'transform';
      el.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'translate(0,0)' }], { duration: 320, easing: 'cubic-bezier(.2,.8,.2,1)' }).finished.finally(() => { el.style.willChange = ''; });
    });
  });
}
function withCGridFlip(mutator) {
  if (vw !== 'card' || !cgrid) { mutator(); return; }
  const first = captureCGridRects();
  if (appShell) appShell.classList.add('no-shell-anim');
  mutator();
  if (appShell) appShell.offsetWidth;
  if (appShell) appShell.classList.remove('no-shell-anim');
  playCGridFlip(first);
}

// ── Custom selects ──
const cselects = new Map();
function closeAllCSelects(exceptId = null) {
  for (const [id, cs] of cselects) { if (exceptId && id === exceptId) continue; cs.wrap.classList.remove('open'); }
  const ps = $('panelSortSel'); if (ps && (!exceptId || exceptId !== 'panelSortSel')) ps.classList.remove('open');
}
function enhanceSelect(selectEl) {
  if (!selectEl || !selectEl.id) return;
  const id = selectEl.id; if (cselects.has(id)) return;
  selectEl.classList.add('native-hidden');
  const wrap = document.createElement('div'); wrap.className = 'cselect'; wrap.dataset.for = id;
  const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'cselect-btn';
  btn.innerHTML = `<span class="cval"></span><span class="car">▾</span>`;
  const menu = document.createElement('div'); menu.className = 'cselect-menu';
  wrap.appendChild(btn); wrap.appendChild(menu);
  selectEl.insertAdjacentElement('afterend', wrap);
  function refresh() {
    const cur = selectEl.value;
    menu.innerHTML = [...selectEl.querySelectorAll('option')].map(o => {
      const v = o.value, lbl = o.textContent || v || '—', on = v === cur;
      return `<button type="button" class="copt ${on ? 'on' : ''}" data-value="${esc(v)}">${esc(lbl)}</button>`;
    }).join('');
    const selOpt = selectEl.querySelector(`option[value="${CSS.escape(cur)}"]`) || selectEl.options[selectEl.selectedIndex];
    btn.querySelector('.cval').textContent = selOpt ? (selOpt.textContent || selOpt.value || '—') : '—';
  }
  btn.addEventListener('click', e => { e.preventDefault(); const isOpen = wrap.classList.contains('open'); closeAllCSelects(isOpen ? null : id); wrap.classList.toggle('open', !isOpen); });
  menu.addEventListener('click', e => { const opt = e.target.closest('.copt[data-value]'); if (!opt) return; selectEl.value = opt.dataset.value ?? ''; selectEl.dispatchEvent(new Event('change', { bubbles: true })); refresh(); wrap.classList.remove('open'); });
  selectEl.addEventListener('change', refresh);
  refresh();
  cselects.set(id, { wrap, btn, menu, refresh });
}
function refreshCSelect(id) { const cs = cselects.get(id); if (cs && cs.refresh) cs.refresh(); }
document.addEventListener('click', e => { if (!e.target.closest('.cselect')) closeAllCSelects(); });

// ── Category filter ──
function buildCatFilter() {
  const want = catEl?.dataset?.restore || catEl.value || '';
  const cats = [...new Set(enriched.map(r => r.category))].sort((a, b) => enriched.filter(r => r.category === b).length - enriched.filter(r => r.category === a).length);
  catEl.innerHTML = '<option value="">All categories</option>';
  cats.forEach(c => { const o = document.createElement('option'); o.value = c; o.textContent = `${CAT_LABELS[c] || c} (${enriched.filter(r => r.category === c).length})`; catEl.appendChild(o); });
  catEl.value = want;
  if (catEl.dataset) delete catEl.dataset.restore;
  $('sCat').textContent = cats.length;
  refreshCSelect('catEl');
}

// ── Stats bar ──
function popStat(id, val) {
  const el = $(id); if (!el) return;
  el.textContent = val;
  el.classList.remove('pop');
  el.offsetWidth; // reflow to restart animation
  el.classList.add('pop');
}
function updateStats() {
  popStat('sTot', allPrices.length.toLocaleString());
  const maxR = enriched.reduce((a, b) => (b.median || 0) > (a.median || 0) ? b : a, { median: 0 });
  const avg = enriched.length ? Math.round(enriched.reduce((s, r) => s + (r.median || 0), 0) / enriched.length) : 0;
  popStat('sMax', fmt(maxR.median));
  $('sMaxN').textContent = maxR.displayName ? (maxR.displayName.length > 22 ? maxR.displayName.slice(0, 20) + '…' : maxR.displayName) : '';
  popStat('sAvg', fmt(avg));
  $('sUpd').textContent = fmtT(lastLoaded);
}

// ── Filter + sort ──
function applyFilters() {
  pg = 1;
  const q = qEl.value.trim().toLowerCase(), cat = catEl.value, conf = confEl.value, tier = tierEl.value;
  filtered = enriched.filter(r => {
    if (q && !(r._search || '').includes(q)) return false;
    if (favOnly && !isFav(r.rawKey)) return false;
    if (cat && r.category !== cat) return false;
    if (conf && r.confidence !== conf) return false;
    if (tier !== '') { if (tier === '0' && r.tier !== 0) return false; if (tier !== '0' && r.tier !== parseInt(tier)) return false; }
    return true;
  });
  filtered.sort((a, b) => {
    let av = a[sc], bv = b[sc];
    if (sc === 'confidence') { av = CONF_ORDER[av] ?? 5; bv = CONF_ORDER[bv] ?? 5; }
    else if (typeof av === 'string') { av = av.toLowerCase(); bv = (bv || '').toLowerCase(); }
    av = av ?? (sd === 'asc' ? Infinity : -Infinity); bv = bv ?? (sd === 'asc' ? Infinity : -Infinity);
    return sd === 'asc' ? (av > bv ? 1 : av < bv ? -1 : 0) : (av < bv ? 1 : av > bv ? -1 : 0);
  });
  updateChips(); render(); scheduleSaveUIState();
}

// ── Chips ──
function updateChips() {
  const el = $('chips'); el.innerHTML = '';
  const q = qEl.value.trim(), cat = catEl.value, conf = confEl.value, tier = tierEl.value;
  if (q) addChip('search: ' + q, () => { qEl.value = ''; $('xBtn').classList.remove('on'); applyFilters(); });
  if (favOnly) addChip('favorites', () => { favOnly = false; updateTopButtons(); applyFilters(); });
  if (cat) addChip(CAT_LABELS[cat] || cat, () => { catEl.value = ''; refreshCSelect('catEl'); applyFilters(); });
  if (conf) addChip('conf: ' + conf, () => { confEl.value = ''; refreshCSelect('confEl'); applyFilters(); });
  if (tier === '0') addChip('no tier', () => { tierEl.value = ''; refreshCSelect('tierEl'); applyFilters(); });
  else if (tier) addChip('tier ' + tier, () => { tierEl.value = ''; refreshCSelect('tierEl'); applyFilters(); });
}
function addChip(label, fn) {
  const d = document.createElement('div'); d.className = 'chip';
  d.innerHTML = `${esc(label)}<button class="chipx" title="Remove">×</button>`;
  d.querySelector('.chipx').addEventListener('click', fn);
  $('chips').appendChild(d);
}

// ── Suggestions ──
let suggItems = [], suggIndex = -1;
function hideSugg() { suggEl.classList.remove('on'); suggEl.innerHTML = ''; suggItems = []; suggIndex = -1; }
function showSugg(items) {
  suggItems = items || []; suggIndex = -1;
  if (!suggItems.length) { hideSugg(); return; }
  suggEl.innerHTML = suggItems.map((it, i) => `<button type="button" data-i="${i}"><span class="sname">${esc(it.displayName)}</span><span class="smeta">${esc(it.categoryLabel || '')}</span></button>`).join('');
  suggEl.classList.add('on');
}
function updateSugg() {
  const q = qEl.value.trim().toLowerCase(); if (!q) { hideSugg(); return; }
  const out = [], seen = new Set();
  for (const r of enriched) {
    const dn = r._dn_lc || '', rk = r._rk_lc || '';
    const idx = dn.indexOf(q) >= 0 ? dn.indexOf(q) : rk.indexOf(q);
    if (idx < 0 || seen.has(r.rawKey)) continue;
    seen.add(r.rawKey);
    out.push({ rawKey: r.rawKey, displayName: r.displayName, idx, starts: dn.startsWith(q), categoryLabel: CAT_LABELS[r.category] || r.category, median: r.median || 0 });
    if (out.length >= 30) break;
  }
  out.sort((a, b) => { if (a.starts !== b.starts) return a.starts ? -1 : 1; if (a.idx !== b.idx) return a.idx - b.idx; return (b.median || 0) - (a.median || 0); });
  showSugg(out.slice(0, 10));
}
function setSuggIndex(i) {
  suggIndex = i;
  const btns = [...suggEl.querySelectorAll('button[data-i]')];
  btns.forEach(b => b.classList.remove('on'));
  const btn = btns.find(b => parseInt(b.dataset.i) === suggIndex);
  if (btn) { btn.classList.add('on'); btn.scrollIntoView({ block: 'nearest' }); }
}
function applySugg(i) {
  const it = suggItems[i]; if (!it) return false;
  qEl.value = it.displayName; $('xBtn').classList.toggle('on', qEl.value.length > 0);
  hideSugg(); applyFilters(); qEl.focus(); return true;
}

// ── Render ──
function render() {
  const tot = filtered.length, pages = Math.max(1, Math.ceil(tot / PAGE));
  if (pg > pages) pg = pages;
  // Always restore pag visibility when we have results
  const pagEl = document.querySelector('.pag');
  if (pagEl) pagEl.classList.remove('pag-hidden');
  const hasF = qEl.value.trim() || catEl.value || confEl.value || (tierEl.value !== '');
  $('ri').textContent = hasF ? `${tot.toLocaleString()} of ${allPrices.length.toLocaleString()} items` : `${tot.toLocaleString()} items`;
  if (!tot) { showEmpty(hasF); renderPag(0); return; }
  const slice = filtered.slice((pg - 1) * PAGE, pg * PAGE);
  vw === 'table' ? renderTbl(slice) : renderCards(slice);
  renderPag(pages);
  if (lastLoaded) $('sUpd').textContent = fmtT(lastLoaded);
}
function adaptiveRange(r) {
  const n = r.samples || 0, median = r.median || 0, blend = Math.min(1, n / 50);
  const credWidth = median * (0.30 - 0.15 * (Math.min(n, 10) / 10));
  return { low: Math.round((r.iqr_low || 0) * blend + (Math.max(0, median - credWidth)) * (1 - blend)), high: Math.round((r.iqr_high || median) * blend + (median + credWidth) * (1 - blend)) };
}

// ── Table render ──
function renderTbl(rows) {
  tbody.classList.remove('rows-animating');
  tbody.innerHTML = rows.map(r => {
    const isActive = r.rawKey === activeKey, ar = adaptiveRange(r);
    const inCmp = compareKeys.includes(r.rawKey);
    const actions = `<span class="row-actions"><button class="fstar ${isFav(r.rawKey) ? 'on' : ''}" data-act="fav" data-key="${esc(r.rawKey)}" title="${isFav(r.rawKey) ? 'Remove from favorites' : 'Add to favorites'}">★</button><button class="cmp-star ${inCmp ? 'on' : ''}" data-act="cmp" data-key="${esc(r.rawKey)}" title="${inCmp ? 'Remove from compare' : 'Add to compare'}">⇄</button></span>`;
    return `<tr data-key="${esc(r.rawKey)}" class="${isActive ? 'active-row' : ''}">
      <td class="item-col"><span class="iname-wrap" title="${esc(r.rawKey)}">${actions}<span class="iname-txt">${esc(r.displayName)}</span>${skillTagH(r.skillTag)}</span></td>
      <td class="hsm hpanel">${catBadge(r.category)}${r.tier ? '&nbsp;' + tierBadge(r.tier) : ''}</td>
      <td><div class="price-main">${fmt(r.median)}</div><div class="price-range hmd">${fmt(ar.low)} — ${fmt(ar.high)}</div></td>
      <td class="hmd hpanel"><span class="price-range">${fmt(ar.low)} — ${fmt(ar.high)}</span></td>
      <td class="hsm hpanel"><span class="conf-b ${confCls(r.confidence)}">■ ${r.confidence || '—'}</span></td>
      <td class="hmd hpanel">${trendH(r.trend)}</td>
      <td>${sampH(r.samples)}</td>
    </tr>`;
  }).join('');
  // Trigger stagger animation — rAF ensures DOM is painted first
  requestAnimationFrame(() => {
    tbody.classList.add('rows-animating');
    // Remove class after longest possible delay so re-renders retrigger correctly
    clearTimeout(renderTbl._t);
    renderTbl._t = setTimeout(() => tbody.classList.remove('rows-animating'), 600);
  });
}

// ── Image helpers ──
function imageSlugFromRawKey(rawKey) {
  return String(rawKey || '').replace(/\|t[123]$/i, '').replace(/\s*\[[^\]]+\]\s*$/, '').trim().toLowerCase()
    .replace(/&/g, 'and').replace(/['"]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 120) || 'unknown';
}
function slugifyText(txt) {
  return String(txt || '').trim().toLowerCase()
    .replace(/&/g, 'and').replace(/['"]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'unknown';
}
function imagePathsForRow(r) {
  if (!r || r.category === 'misc') return [];
  const base = './assets/images/items', slug = imageSlugFromRawKey(r.rawKey), cat = String(r.category || 'misc'), paths = [];
  if (cat === 'set-gear' && r.setName) paths.push(`${base}/set-gear/${slugifyText(r.setName)}/${slug}.png`);
  paths.push(`${base}/${cat}/${slug}.png`);
  paths.push(`${base}/${slug}.png`);
  return [...new Set(paths)];
}
function imgFallback(imgEl) {
  try {
    const list = (imgEl.dataset.fallbacks || '').split('|').filter(Boolean), idx = parseInt(imgEl.dataset.fallbackIndex || '0', 10);
    if (idx >= list.length) { imgEl.onerror = null; imgEl.src = './assets/images/items/_placeholder.svg'; return; }
    imgEl.dataset.fallbackIndex = String(idx + 1); imgEl.src = list[idx];
  } catch (_e) { imgEl.onerror = null; imgEl.src = './assets/images/items/_placeholder.svg'; }
}
let _lazyImgObserver = null, _lazyQueue = [], _lazyTicking = false;
function _ensureLazyObserver() {
  if (_lazyImgObserver) return _lazyImgObserver;
  if (!('IntersectionObserver' in window)) return null;
  _lazyImgObserver = new IntersectionObserver(entries => {
    for (const e of entries) { if (!e.isIntersecting) continue; const img = e.target; _lazyImgObserver.unobserve(img); if (img.dataset.loaded === '1') continue; _lazyQueue.push(img); }
    _lazyPumpQueue();
  }, { root: null, rootMargin: '250px 0px', threshold: 0.01 });
  return _lazyImgObserver;
}
function _lazyPumpQueue() {
  if (_lazyTicking) return; _lazyTicking = true;
  requestAnimationFrame(() => {
    _lazyTicking = false;
    const batch = _lazyQueue.splice(0, 10); let hi = 0;
    for (const img of batch) { _loadLazyImg(img, hi < 3 ? 'high' : 'low'); if (hi < 3) hi++; }
    if (_lazyQueue.length) _lazyPumpQueue();
  });
}
function _loadLazyImg(img, priority = 'low') {
  if (!img || img.dataset.loaded === '1') return;
  const src = img.dataset.src; if (!src) return;
  img.dataset.loaded = '1'; try { img.setAttribute('fetchpriority', priority); } catch (_e) {}
  img.decoding = 'async'; img.src = src;
}
function observeLazyImages(rootEl) {
  const obs = _ensureLazyObserver(); if (!rootEl) return;
  if (!obs) { rootEl.querySelectorAll('img[data-src]').forEach(img => _loadLazyImg(img, 'low')); return; }
  rootEl.querySelectorAll('img[data-src]').forEach(img => { if (img.dataset.loaded === '1') return; obs.observe(img); });
}
function imageHTMLForRow(r, cls = '', opts = {}) {
  const paths = imagePathsForRow(r); if (!paths.length) return '';
  const eager = !!opts.eager, priority = opts.fetchPriority || 'low';
  const first = paths[0], fb = [...paths.slice(1), './assets/images/items/_placeholder.svg'].join('|');
  if (eager) return `<img loading="eager" fetchpriority="${esc(priority)}" decoding="async" class="${cls}" src="${esc(first)}" data-fallbacks="${esc(fb)}" data-fallback-index="0" alt="" onerror="imgFallback(this)" />`;
  return `<img loading="lazy" fetchpriority="${esc(priority)}" decoding="async" class="${cls} lazy-img" src="./assets/images/items/_placeholder.svg" data-src="${esc(first)}" data-fallbacks="${esc(fb)}" data-fallback-index="0" data-loaded="0" alt="" onerror="imgFallback(this)" />`;
}

// ── Card notes ──
function noteKeyFromRawKey(rawKey) { return String(rawKey || '').trim().replace(/\s+/g, ' ').toLowerCase(); }
function getCardNoteForRow(r) {
  const notes = window.CARD_NOTES || {}, raw = String(r?.rawKey || '').trim(); if (!raw) return null;
  const keyTier = noteKeyFromRawKey(raw); if (notes[keyTier]) return notes[keyTier];
  return notes[keyTier.replace(/\|t[123]$/i, '')] || null;
}
function cardExtraH(r) {
  if (!r || (r.category !== 'set-gear' && r.category !== 'unique-relic')) return '';
  const note = getCardNoteForRow(r); if (!note || !note.lines?.length) return '';
  const lines = note.lines.map(line => {
    const s = String(line || '');
    if (s.trim().startsWith('■')) return `<div class="cline"><span class="cdiamond" aria-hidden="true"></span><span>${esc(s.replace(/^■\s*/, ''))}</span></div>`;
    return `<div class="cline"><span class="cdot" aria-hidden="true"></span><span>${esc(s)}</span></div>`;
  }).join('');
  return `<div class="csub">${lines}</div>`;
}
function panelMetaHTML(r) {
  if (!r) return '';
  const note = getCardNoteForRow(r);
  const imgPaths = dataSaver ? [] : imagePathsForRow(r);
  const hasImg = imgPaths.length > 0, hasNote = !!(note && note.lines && note.lines.length);
  if (!hasImg && !hasNote) return '';
  const cols = (hasImg && hasNote) ? 'pm-two' : (hasImg ? 'pm-only-img' : 'pm-only-note');
  const img = hasImg ? `<div class="pm-img">${imageHTMLForRow(r, '', { eager: true, fetchPriority: 'high' })}</div>` : '';
  const lines = hasNote ? note.lines.map(line => {
    const s = String(line || '');
    if (s.trim().startsWith('■')) return `<div class="pm-line"><span class="pm-b">■</span><span>${esc(s.replace(/^■\s*/, ''))}</span></div>`;
    return `<div class="pm-line"><span class="pm-dot" aria-hidden="true"></span><span>${esc(s)}</span></div>`;
  }).join('') : '';
  const centerCls = (note && note.lines && note.lines.length <= 4) ? ' pm-center' : '';
  const noteHtml = hasNote ? `<div class="pm-note${centerCls}"><div class="pm-note-inner">${lines}</div></div>` : '';
  return `<div class="pmeta ${cols}">${img}${noteHtml}</div>`;
}

// ── Card render ──
function renderCards(rows) {
  cgrid.classList.remove('cards-animating');
  cgrid.innerHTML = rows.map(r => {
    const isActive = r.rawKey === activeKey, ar = adaptiveRange(r);
    const inCmp = compareKeys.includes(r.rawKey);
    const imgPaths = imagePathsForRow(r);
    const isMisc = r.category === 'misc';
    const showImg = !dataSaver && (imgPaths.length || isMisc);
    const imgHTML = showImg
      ? `<div class="cimgwrap${isMisc ? ' cimgwrap-misc' : ''}">${imgPaths.length ? imageHTMLForRow(r, '') : '<img src="./assets/images/items/_placeholder.svg" alt="" />'}</div>`
      : '';
    return `<div class="pcard ${isActive ? 'active-card' : ''}" data-key="${esc(r.rawKey)}">
      ${imgHTML}
      <div class="ccard-actions">
        <button class="fstar ${isFav(r.rawKey) ? 'on' : ''}" data-act="fav" data-key="${esc(r.rawKey)}" title="${isFav(r.rawKey) ? 'Remove from favorites' : 'Add to favorites'}">★</button>
        <button class="cmp-star ${inCmp ? 'on' : ''}" data-act="cmp" data-key="${esc(r.rawKey)}" title="${inCmp ? 'Remove from compare' : 'Add to compare'}">⇄</button>
      </div>
      <div class="ccard-head">
        <div class="ckey" title="${esc(r.rawKey)}"><span class="iname-wrap"><span class="iname-txt">${esc(r.displayName)}</span>${skillTagH(r.skillTag)}</span></div>
      </div>
      ${cardExtraH(r)}
      <div class="cprice">${fmt(r.median)}</div>
      <div class="crange">${fmt(ar.low)} — ${fmt(ar.high)}</div>
      <div class="cfoot">${catBadge(r.category)}${r.tier ? tierBadge(r.tier) : ''}<span class="conf-b ${confCls(r.confidence)}">■ ${r.confidence || '—'}</span>${trendH(r.trend)}</div>
    </div>`;
  }).join('');
  observeLazyImages(cgrid);
  requestAnimationFrame(() => {
    cgrid.classList.add('cards-animating');
    clearTimeout(renderCards._t);
    renderCards._t = setTimeout(() => cgrid.classList.remove('cards-animating'), 600);
  });
}

// ── Badge / indicator helpers ──
function catBadge(cat) { return `<span class="cb cat-${cat}">${CAT_LABELS[cat] || cat}</span>`; }
function skillTagH(tag) { if (!tag || !tag.cls || !tag.text) return ''; return `<span class="stag ${tag.cls}">${esc(tag.text)}</span>`; }
function tierBadge(tier) { return `<span class="tier-badge tier-${tier}">T${tier} ${tierStars(tier)}</span>`; }
function confCls(c) { return { high: 'ch', good: 'cg', fair: 'cf', low: 'cl', unreliable: 'cu' }[c] || 'cl'; }
function trendH(t) { if (t === 'up') return '<span class="trend tu">↑ rising</span>'; if (t === 'down') return '<span class="trend td">↓ falling</span>'; return '<span class="trend ts">→ stable</span>'; }
function sampH(n) { const pct = maxSamples > 0 ? Math.min(100, Math.round(((n || 0) / maxSamples) * 100)) : 0; return `<div class="swrap"><div class="sbg"><div class="sfill" style="width:${pct}%"></div></div><span class="snum">${n != null ? n.toLocaleString() : '—'}</span></div>`; }

// ── Copy price ──
// Rounds to nearest "clean" number matching Castia pricing convention:
// e.g. 4,646,646 → 4,650,000 | 87,300 → 87,500 | 1,234 → 1,250
function roundToCleanPrice(n) {
  if (!n || n <= 0) return 0;
  const magnitude = Math.pow(10, Math.max(0, Math.floor(Math.log10(n)) - 1));
  return Math.round(n / magnitude) * magnitude;
}
function copyPrice(n, btn) {
  const rounded = roundToCleanPrice(Math.round(n || 0));
  navigator.clipboard?.writeText(String(rounded)).then(() => {
    if (btn) { btn.classList.add('copied'); setTimeout(() => btn.classList.remove('copied'), 1800); }
    toast('Copied ' + rounded.toLocaleString());
  }).catch(() => toast('Could not copy', true));
}

// ── Empty / skeleton / error ──
function showEmpty(hasF) {
  // Hide pagination when showing empty state
  const pagEl = document.querySelector('.pag');
  if (pagEl) pagEl.classList.add('pag-hidden');
  if (favOnly && !favSet.size) {
    const inner = `<div class="estate"><div class="eicon">★</div><div class="emsg">No favorites yet</div><div class="esub">Click the ★ star on any item to add it to your watchlist.</div><div class="esub" style="margin-top:8px"><button onclick="toggleFavOnly()" style="background:none;border:none;color:var(--gold);cursor:pointer;font-family:inherit;font-size:12px;text-decoration:underline">Show all items</button></div></div>`;
    if (vw === 'table') tbody.innerHTML = `<tr><td colspan="7">${inner}</td></tr>`; else cgrid.innerHTML = `<div style="grid-column:1/-1">${inner}</div>`;
    return;
  }
  const msg = hasF ? 'No items match your filters' : 'No data loaded';
  const sub = hasF ? `<div class="esub"><button onclick="clearAll()" style="background:none;border:none;color:var(--gold);cursor:pointer;font-family:inherit;font-size:12px;text-decoration:underline">Clear all filters</button></div>` : '';
  const inner = `<div class="estate"><div class="eicon">⊘</div><div class="emsg">${msg}</div>${sub}</div>`;
  if (vw === 'table') tbody.innerHTML = `<tr><td colspan="7">${inner}</td></tr>`; else cgrid.innerHTML = `<div style="grid-column:1/-1">${inner}</div>`;
}
function showSkel() {
  tbody.innerHTML = Array.from({ length: 14 }, () => `<tr class="skel"><td><div class="sbar" style="width:${50 + Math.random() * 100 | 0}px"></div></td><td class="hsm hpanel"><div class="sbar" style="width:60px"></div></td><td><div class="sbar" style="width:55px"></div></td><td class="hmd hpanel"><div class="sbar" style="width:90px"></div></td><td class="hsm hpanel"><div class="sbar" style="width:60px"></div></td><td class="hmd hpanel"><div class="sbar" style="width:50px"></div></td><td><div class="sbar" style="width:70px;margin-left:auto"></div></td></tr>`).join('');
}
function showErr(msg) { tbody.innerHTML = `<tr><td colspan="7"><div class="estate"><div class="eicon" style="color:var(--red)">✕</div><div class="emsg" style="color:var(--red)">Failed to load</div><div class="esub">${esc(msg)}</div></div></td></tr>`; }

// ── Pagination ──
function renderPag(pages) {
  $('pmeta').textContent = filtered.length ? `Page ${pg} of ${pages} · ${filtered.length.toLocaleString()} results` : '';
  const el = $('pbtns'); if (pages <= 1) { el.innerHTML = ''; return; }
  const b = [];
  b.push(`<button class="pb" onclick="goPg(${pg - 1})" ${pg === 1 ? 'disabled' : ''}>←</button>`);
  let s = Math.max(1, pg - 2), e = Math.min(pages, s + 4); if (e - s < 4) s = Math.max(1, e - 4);
  if (s > 1) { b.push(`<button class="pb" onclick="goPg(1)">1</button>`); if (s > 2) b.push(`<span style="padding:0 3px;color:var(--text3);font-size:12px">…</span>`); }
  for (let i = s; i <= e; i++) b.push(`<button class="pb ${i === pg ? 'on' : ''}" onclick="goPg(${i})">${i}</button>`);
  if (e < pages) { if (e < pages - 1) b.push(`<span style="padding:0 3px;color:var(--text3);font-size:12px">…</span>`); b.push(`<button class="pb" onclick="goPg(${pages})">${pages}</button>`); }
  b.push(`<button class="pb" onclick="goPg(${pg + 1})" ${pg === pages ? 'disabled' : ''}>→</button>`);
  el.innerHTML = b.join('');
}
function goPg(n) { pg = n; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); }

// ── Sort ──
function setSort(col) {
  if (sc === col) sd = sd === 'asc' ? 'desc' : 'asc'; else { sc = col; sd = (col === 'median' || col === 'samples') ? 'desc' : 'asc'; }
  updateSortUI(); applyFilters(); scheduleSaveUIState();
}
function flipDir() { sd = sd === 'asc' ? 'desc' : 'asc'; updateSortUI(); applyFilters(); scheduleSaveUIState(); }
function updateSortUI() {
  ['displayName', 'median', 'confidence', 'trend', 'samples'].forEach(c => {
    const th = $('th-' + c), ar = $('ar-' + c);
    if (th) th.classList.toggle('on', c === sc);
    if (ar) ar.textContent = c === sc ? (sd === 'asc' ? '↑' : '↓') : '';
  });
  ['median', 'samples', 'displayName', 'confidence'].forEach(c => { const p = $('sp-' + c); if (p) p.classList.toggle('on', c === sc); });
  $('sp-dir').textContent = sd === 'asc' ? '↑' : '↓';
}

// ── View toggle ──
function setView(v) {
  vw = v;
  const tvw = $('tvw'), cvw = $('cvw');
  tvw.style.display = v === 'table' ? '' : 'none';
  cvw.style.display = v === 'card' ? '' : 'none';
  $('vt').classList.toggle('on', v === 'table');
  $('vc').classList.toggle('on', v === 'card');
  // Animate the entering view
  const entering = v === 'table' ? tvw : cvw;
  entering.classList.remove('view-entering');
  entering.offsetWidth; // reflow
  entering.classList.add('view-entering');
  setTimeout(() => entering.classList.remove('view-entering'), 300);
  render(); scheduleSaveUIState();
}

// ── Clear ──
function clearQ() { qEl.value = ''; $('xBtn').classList.remove('on'); hideSugg(); applyFilters(); qEl.focus(); }
function clearAll() { qEl.value = ''; catEl.value = ''; confEl.value = ''; tierEl.value = ''; $('xBtn').classList.remove('on'); refreshCSelect('catEl'); refreshCSelect('confEl'); refreshCSelect('tierEl'); applyFilters(); }