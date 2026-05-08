// ─────────────────────────────────────────────────────────────────────────────
// state.js — runtime state, localStorage persistence, deep-link helpers
// ─────────────────────────────────────────────────────────────────────────────

// ── Runtime state ──
let allPrices = [], enriched = [], filtered = [];
let allSellers = {};
let vw = 'table', sc = 'median', sd = 'desc', pg = 1;
let maxSamples = 1, lastLoaded = null, debT = null;
let activeKey = null;
let panelCtx = null;
let panelSort = 'newest';
let panelIncludeFlagged = false;
let favOnly = false;
let dataSaver = false;
let favSet = new Set();
let compareKeys = [];

// ── Persistence ──
const UI_STATE_KEY = 'castia_ui_state_v1';
const PRISM_CACHE_KEY = 'castia_prismatic_tiers_v1';
const PRISM_CACHE_TTL = 60 * 60 * 1000;

function _readLS(key) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; }
  catch (_e) { return null; }
}
function _writeLS(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch (_e) {}
}

let _loadedUIState = _readLS(UI_STATE_KEY) || {};
let _saveUIT = null;

function scheduleSaveUIState() {
  clearTimeout(_saveUIT);
  _saveUIT = setTimeout(saveUIState, 300);
}

function saveUIState() {
  _writeLS(UI_STATE_KEY, {
    q: qEl?.value || '', cat: catEl?.value || '',
    conf: confEl?.value || '', tier: tierEl?.value || '',
    vw, sc, sd,
    favOnly: !!favOnly, dataSaver: !!dataSaver,
    fav: [...favSet], cmp: [...compareKeys],
    activeKey: activeKey || '',
    panelSort, panelIncludeFlagged: !!panelIncludeFlagged,
    scrollY: window.scrollY || 0,
  });
}

function applyLoadedUIState() {
  const st = _loadedUIState || {};
  if (qEl && typeof st.q === 'string') {
    qEl.value = st.q;
    if (st.q) $('xBtn')?.classList.add('on');
  }
  if (catEl && typeof st.cat === 'string') { catEl.value = st.cat; catEl.dataset.restore = st.cat; }
  if (confEl && typeof st.conf === 'string') confEl.value = st.conf;
  if (tierEl && typeof st.tier === 'string') tierEl.value = st.tier;
  if (st.vw === 'card' || st.vw === 'table') vw = st.vw;
  if (typeof st.sc === 'string') sc = st.sc;
  if (st.sd === 'asc' || st.sd === 'desc') sd = st.sd;
  favOnly = !!st.favOnly;
  dataSaver = !!st.dataSaver;
  favSet = new Set(Array.isArray(st.fav) ? st.fav : []);
  compareKeys = Array.isArray(st.cmp) ? st.cmp.slice(0, 3) : [];
  if (typeof st.panelSort === 'string') panelSort = st.panelSort;
  panelIncludeFlagged = !!st.panelIncludeFlagged;
}

// ── Prismatic cache ──
function _lsReadJson(key) {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : null; }
  catch (_e) { return null; }
}
function _lsWriteJson(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch (_e) {}
}
function _readPrismaticCache() {
  const c = _lsReadJson(PRISM_CACHE_KEY);
  if (!c || !c.ts || !c.byBase) return null;
  if (Date.now() - c.ts > PRISM_CACHE_TTL) return null;
  return c;
}
function _writePrismaticCache(byBase) {
  if (!byBase || typeof byBase !== 'object') return;
  _lsWriteJson(PRISM_CACHE_KEY, { ts: Date.now(), byBase });
}

// ── Deep link helpers ──
function getHashItemKey() {
  const h = String(location.hash || '').replace(/^#/, '');
  const m = h.match(/(?:^|&)item=([^&]+)/);
  if (!m) return null;
  try { return decodeURIComponent(m[1] || ''); } catch (_e) { return m[1] || null; }
}
function setHashItemKey(key) {
  const k = key ? encodeURIComponent(String(key)) : '';
  if (!k) {
    if (location.hash && location.hash.includes('item='))
      history.replaceState(null, '', location.pathname + location.search);
    return;
  }
  history.replaceState(null, '', location.pathname + location.search + `#item=${k}`);
}
