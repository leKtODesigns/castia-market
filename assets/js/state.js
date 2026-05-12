/**
 * State management and persistence for the application.
 * Handles localStorage state, UI state persistence, prismatic tier caching,
 * and hash-based item tracking.
 */

let allPrices = [],
  enriched = [],
  filtered = [];
let allSellers = {};
let vw = "table",
  sc = "median",
  sd = "desc",
  pg = 1;
let maxSamples = 1,
  lastLoaded = null,
  debT = null;
let activeKey = null;
let panelCtx = null;
let panelSort = "newest";
let panelIncludeFlagged = false;
let favOnly = false;
let dataSaver = false;
let favSet = new Set();
let compareKeys = [];

const UI_STATE_KEY = "castia_ui_state_v1";
const PRISM_CACHE_KEY = "castia_prismatic_tiers_v1";
const PRISM_CACHE_TTL = 60 * 60 * 1000; // 1 hour

/**
 * Reads and parses a value from localStorage.
 * @param {string} key - The storage key
 * @returns {*} The parsed value or null if error/not found
 */
function _readLS(key) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : null;
  } catch (_e) {
    return null;
  }
}

/**
 * Serializes and writes a value to localStorage.
 * @param {string} key - The storage key
 * @param {*} val - The value to store
 */
function _writeLS(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (_e) {}
}

/**
 * Loads UI state from localStorage and applies it to the application.
 * Restores filters, view state, favorites, comparisons, and panel state.
 */
let _loadedUIState = null;
let _saveUIT = null;

// Debounce UI state saving to reduce localStorage writes during rapid changes
function scheduleSaveUIState() {
  clearTimeout(_saveUIT);
  _saveUIT = setTimeout(saveUIState, 300);
}

/**
 * Saves current UI state to localStorage.
 * Persists: search query, filters, view mode, toggles, favorites, comparisons,
 * active item, panel state, and scroll position.
 */
function saveUIState() {
  _writeLS(UI_STATE_KEY, {
    q: qEl?.value || "",
    cat: catEl?.value || "", // Search and category filters
    conf: confEl?.value || "",
    tier: tierEl?.value || "", // Confidence and tier filters
    vw,
    sc,
    sd, // View state: table/cards view, sort column, sort direction
    favOnly: !!favOnly,
    dataSaver: !!dataSaver, // UI toggle states
    fav: [...favSet],
    cmp: [...compareKeys], // Persist favorites and comparison selections
    activeKey: activeKey || "", // Persist currently selected item
    panelSort,
    panelIncludeFlagged: !!panelIncludeFlagged, // Detail panel state
    scrollY: window.scrollY || 0, // Persist scroll position
  });
}

/**
 * Applies loaded UI state from localStorage to the application.
 * Restores all persisted UI settings.
 */
function applyLoadedUIState() {
  const st = _loadedUIState || {};
  if (qEl && typeof st.q === "string") {
    qEl.value = st.q;
    if (st.q) $("xBtn")?.classList.add("on");
  }
  if (catEl && typeof st.cat === "string") {
    catEl.value = st.cat;
    catEl.dataset.restore = st.cat;
  }
  if (confEl && typeof st.conf === "string") confEl.value = st.conf;
  if (tierEl && typeof st.tier === "string") tierEl.value = st.tier;
  if (st.vw === "card" || st.vw === "table") vw = st.vw;
  if (typeof st.sc === "string") sc = st.sc;
  if (st.sd === "asc" || st.sd === "desc") sd = st.sd;
  favOnly = !!st.favOnly;
  dataSaver = !!st.dataSaver;
  favSet = new Set(Array.isArray(st.fav) ? st.fav : []);
  compareKeys = Array.isArray(st.cmp) ? st.cmp.slice(0, 3) : [];
  if (typeof st.panelSort === "string") panelSort = st.panelSort;
  panelIncludeFlagged = !!st.panelIncludeFlagged;
}

/**
 * Reads prismatic tier cache from localStorage.
 * @returns {Object|null} Cached prismatic tier data or null if invalid/expired
 */
function _readPrismaticCache() {
  const c = _readLS(PRISM_CACHE_KEY);
  if (!c || !c.ts || !c.byBase) return null;
  if (Date.now() - c.ts > PRISM_CACHE_TTL) return null;
  return c;
}

/**
 * Writes prismatic tier cache to localStorage.
 * @param {Object} byBase - Object mapping base keys to tier data arrays
 */
function _writePrismaticCache(byBase) {
  if (!byBase || typeof byBase !== "object") return;
  _writeLS(PRISM_CACHE_KEY, { ts: Date.now(), byBase });
}

/**
 * Gets the item key from the URL hash.
 * @returns {string|null} The item key or null if not present
 */
function getHashItemKey() {
  const h = String(location.hash || "").replace(/^#/, "");
  const m = h.match(/(?:^|&)item=([^&]+)/);
  if (!m) return null;
  try {
    return decodeURIComponent(m[1] || "");
  } catch (_e) {
    return m[1] || null;
  }
}

/**
 * Sets the item key in the URL hash.
 * @param {string|null} key - The item key to set (null to remove)
 */
function setHashItemKey(key) {
  const k = key ? encodeURIComponent(String(key)) : "";
  if (!k) {
    if (location.hash && location.hash.includes("item="))
      history.replaceState(null, "", location.pathname + location.search);
    return;
  }
  history.replaceState(
    null,
    "",
    location.pathname + location.search + `#item=${k}`,
  );
}

/**
 * Application initialization - waits for render function to be defined
 * to prevent "render is not defined" error on initial load
 */
function initApp() {
  if (typeof render === "function") {
    _loadedUIState = _readLS(UI_STATE_KEY) || {};
    applyLoadedUIState();
    fetchAll(false);
    scheduleRefresh();
    setInterval(() => {
      if (lastLoaded) $("sUpd").textContent = fmtT(lastLoaded);
    }, 30000);
    // Init compare tooltip after data is loaded
    _idle(() => updateCmpTooltip());
    updateOverlayUI();
  } else {
    setTimeout(initApp, 100);
  }
}
initApp();
