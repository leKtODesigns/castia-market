// ─────────────────────────────────────────────────────────────────────────────
// data.js — key parsing, enrichment, Supabase fetching, Prismatic tiers
// ─────────────────────────────────────────────────────────────────────────────

// ── Formatters ──
function fmt(n) {
  if (n == null || n === '') return '—';
  const v = +n; if (isNaN(v)) return '—';
  if (v >= 1e9) return (v / 1e9).toFixed(2) + 'B';
  if (v >= 1e6) return (v / 1e6).toFixed(2) + 'M';
  if (v >= 1e3) return (v / 1e3).toFixed(1) + 'K';
  return v.toLocaleString();
}
function fmtFull(n) { return n == null ? '—' : Math.round(n).toLocaleString(); }
function fmtT(d) {
  if (!d) return '—';
  const s = (Date.now() - new Date(d).getTime()) / 1000;
  if (s < 60) return 'just now';
  if (s < 3600) return Math.floor(s / 60) + 'm ago';
  if (s < 86400) return Math.floor(s / 3600) + 'h ago';
  if (s < 86400 * 7) return Math.floor(s / 86400) + 'd ago';
  return new Date(d).toLocaleDateString();
}
function esc(s) {
  return s ? String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;') : '';
}

// ── Title case ──
function titleCase(str) {
  if (!str) return str;
  return str.split(' ').map((w, i) => {
    const wl = w.toLowerCase();
    if (/^(?=[ivxlcdm]+$)[ivxlcdm]+$/i.test(w)) return w.toUpperCase();
    if (i > 0 && LOWER_WORDS.has(wl)) return wl;
    return wl.charAt(0).toUpperCase() + wl.slice(1);
  }).join(' ');
}

// ── Listing stat helpers ──
function isBadSeller(seller) {
  if (!seller) return false;
  const sd = allSellers[String(seller).toLowerCase()];
  return !!(sd && (sd.is_blacklisted || sd.is_flagged));
}
function getUnitPrice(l) {
  if (l == null) return 0;
  if (l.unit_price != null) return +l.unit_price || 0;
  const p = +l.price || 0, c = +l.count || 1;
  return c ? Math.round(p / c) : p;
}
function quantileSorted(sorted, p) {
  if (!sorted.length) return 0;
  const idx = (sorted.length - 1) * p, lo = Math.floor(idx), hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] * (1 - (idx - lo)) + sorted[hi] * (idx - lo);
}
function statsFromListings(listings) {
  const vals = listings.map(getUnitPrice).filter(v => v > 0).sort((a, b) => a - b);
  const n = vals.length;
  if (!n) return { n: 0, median: 0, q1: 0, q3: 0 };
  return {
    n,
    median: Math.round(quantileSorted(vals, 0.5)),
    q1: Math.round(quantileSorted(vals, 0.25)),
    q3: Math.round(quantileSorted(vals, 0.75)),
  };
}
function confidenceFromSamples(n) {
  if (n >= 30) return 'high'; if (n >= 15) return 'good';
  if (n >= 7) return 'fair'; if (n >= 3) return 'low';
  return 'unreliable';
}
function trendFromListings(listings) {
  const byTime = [...listings].filter(l => l.timestamp).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  if (byTime.length < 6) return 'stable';
  const mid = Math.floor(byTime.length / 2);
  const old = statsFromListings(byTime.slice(0, mid)).median || 0;
  const neu = statsFromListings(byTime.slice(mid)).median || 0;
  if (!old || !neu) return 'stable';
  if (neu > old * 1.10) return 'up';
  if (neu < old * 0.90) return 'down';
  return 'stable';
}
function sellerRatingInfo(seller) {
  const sd = allSellers[String(seller || '').toLowerCase()];
  const isFlagged = !!(sd && (sd.is_blacklisted || sd.is_flagged));
  const label = isFlagged ? 'Flagged' : (sd?.accuracy_label || 'Neutral');
  return { sd, label, order: SELLER_ORDER[label] ?? SELLER_ORDER.Neutral, isFlagged, isBlacklisted: !!sd?.is_blacklisted };
}

// ── Key parser ──
function parseKey(raw) {
  if (!raw) return { displayName: '—', category: 'misc', tier: 0, setName: null, rawKey: raw };
  let baseKey = raw.trim(), tier = 0;
  const tierMatch = baseKey.match(/\|t([123])$/i);
  if (tierMatch) { tier = parseInt(tierMatch[1]); baseKey = baseKey.slice(0, baseKey.lastIndexOf('|t')).trim(); }
  const kl = baseKey.toLowerCase();
  if (kl.startsWith('book:')) {
    // Collapse any extra whitespace after the colon (e.g. "book:  Swift Sneak" → "Book: Swift Sneak")
    const bookName = baseKey.replace(/^book:\s*/i, '').replace(/\s+/g, ' ').trim();
    return { displayName: 'Book: ' + titleCase(bookName), category: 'enchanted-book', tier: 0, setName: null, rawKey: raw };
  }
  for (const setName of MITHRIL_SETS) {
    const prefix = setName.toLowerCase();
    if (kl === prefix || kl.startsWith(prefix + ' ')) {
      const remainder = kl.slice(prefix.length).trim();
      const lastWord = remainder.split(' ').pop();
      if (remainder === '' || GEAR_SUFFIXES.has(remainder) || GEAR_SUFFIXES.has(lastWord)) {
        let display = titleCase(baseKey);
        if (tier > 0) { if (prefix === 'prismatic') display += ` ${tierStars(tier)}`; else display += ` (T${tier})`; }
        return { displayName: display, category: 'set-gear', tier, setName: titleCase(setName), rawKey: raw };
      }
    }
  }
  if (UNIQUE_RELICS_EXACT.has(kl))
    return { displayName: titleCase(baseKey), category: 'unique-relic', tier: 0, setName: null, rawKey: raw };
  if (UNIQUE_RELICS_VARIANT.some(r => kl === r || kl.startsWith(r + ' ['))) {
    const bracketMatch = baseKey.match(/^(.+?)\s*\[(.+)\]$/);
    if (bracketMatch) {
      const base = titleCase(bracketMatch[1]), skill = (bracketMatch[2] || '').trim().toLowerCase();
      const tagClass = SKILL_TAG_CLASS[skill] || null;
      return { displayName: base, category: 'unique-relic', tier: 0, setName: null, rawKey: raw, skillTag: tagClass ? { text: titleCase(skill), cls: tagClass } : null };
    }
    return { displayName: titleCase(baseKey), category: 'unique-relic', tier: 0, setName: null, rawKey: raw, skillTag: null };
  }
  const klNoSuffix = kl.replace(/\s*\([\d.]+%\)\s*$/, '').trim();
  if (RUNESTONES.has(kl) || RUNESTONES.has(klNoSuffix))
    return { displayName: titleCase(baseKey), category: 'runestone', tier: 0, setName: null, rawKey: raw };
  if (kl.endsWith(' spawner'))
    return { displayName: titleCase(baseKey), category: 'spawner', tier: 0, setName: null, rawKey: raw };
  if (kl.endsWith(' spawn egg'))
    return { displayName: titleCase(baseKey), category: 'spawn-egg', tier: 0, setName: null, rawKey: raw };
  if (kl.startsWith('music disc') || kl.startsWith('goat horn'))
    return { displayName: titleCase(baseKey), category: 'music-disc', tier: 0, setName: null, rawKey: raw };
  if (RESOURCES.has(kl))
    return { displayName: titleCase(baseKey), category: 'resource', tier: 0, setName: null, rawKey: raw };
  if (UTILITY.has(kl))
    return { displayName: titleCase(baseKey), category: 'utility', tier: 0, setName: null, rawKey: raw };
  return { displayName: titleCase(baseKey), category: 'misc', tier: 0, setName: null, rawKey: raw };
}

function enrich(rows) {
  return (rows || []).map(r => {
    const parsed = parseKey(r.key);
    const dn = String(parsed.displayName || ''), rk = String(parsed.rawKey || '');
    const dnLc = dn.toLowerCase(), rkLc = rk.toLowerCase();
    return { ...r, ...parsed, _dn_lc: dnLc, _rk_lc: rkLc, _search: dnLc + ' ' + rkLc };
  });
}

// ── Supabase fetch ──
const HEADERS = { 'apikey': SB_KEY, 'Authorization': 'Bearer ' + SB_KEY };
async function sbGet(table, params = '') {
  const r = await fetch(`${SB_URL}/rest/v1/${table}${params}`, { headers: HEADERS });
  if (!r.ok) throw new Error(`HTTP ${r.status} on ${table}`);
  return r.json();
}

// ── Prismatic tier cache helpers ──
function _hasPrismaticBaseRows() { return enriched.some(r => r.setName === 'Prismatic' && r.tier === 0); }
function _idle(fn) {
  if ('requestIdleCallback' in window) window.requestIdleCallback(fn, { timeout: 1500 });
  else setTimeout(fn, 250);
}
function applyPrismaticTierCache() {
  const c = _readPrismaticCache(); if (!c) return false;
  const byBase = c.byBase || {}, byKey = {};
  for (const r of allPrices) byKey[r.key] = r;
  let applied = false;
  const newRows = [];
  for (const r of enriched) {
    if (r.setName === 'Prismatic' && r.tier === 0) {
      const tierRows = byBase[r.rawKey];
      if (Array.isArray(tierRows) && tierRows.length) { tierRows.forEach(tr => newRows.push(tr)); applied = true; continue; }
    }
    newRows.push(byKey[r.rawKey] || byKey[r.key] || { key: r.rawKey, median: r.median, samples: r.samples, confidence: r.confidence, iqr_low: r.iqr_low, iqr_high: r.iqr_high, trend: r.trend, last_seen: r.last_seen });
  }
  if (!applied) return false;
  allPrices = newRows; enriched = enrich(allPrices); maxSamples = Math.max(1, ...enriched.map(r => r.samples || 0)); prismaticTiersReady = true;
  return true;
}

// ── fetchAll ──
async function fetchAll(silent) {
  if (!silent) { bootShow('Loading market data…'); setSt('loading', 'Loading...'); showSkel(); }
  $('rBtn').classList.add('spinning');
  try {
    prismaticTiersReady = false; prismaticTiersPromise = null;
    let priceRows = [], off = 0;
    while (true) {
      const batch = await sbGet('price_data', `?select=key,median,samples,confidence,iqr_low,iqr_high,trend,last_seen&limit=1000&offset=${off}&order=median.desc`);
      priceRows = priceRows.concat(batch);
      if (batch.length < 1000) break;
      off += 1000;
    }
    let sellerRows = [];
    try { sellerRows = await sbGet('seller_data', '?select=seller,total_listings,valid_listings,avg_markup_percent,overpriced_ratio,accuracy_label,is_blacklisted,is_flagged'); }
    catch (_e) { sellerRows = await sbGet('seller_data', '?select=seller,total_listings,valid_listings,avg_markup_percent,overpriced_ratio,accuracy_label,is_blacklisted'); }
    allPrices = priceRows; enriched = enrich(allPrices);
    const cacheApplied = applyPrismaticTierCache();
    maxSamples = Math.max(1, ...enriched.map(r => r.samples || 0));
    allSellers = {};
    for (const s of sellerRows) { if (s.seller) allSellers[s.seller.toLowerCase()] = s; }
    lastLoaded = new Date();
    buildCatFilter(); updateStats(); applyFilters(); updateSortUI();
    $('tvw').style.display = vw === 'table' ? '' : 'none';
    $('cvw').style.display = vw === 'card' ? '' : 'none';
    $('vt').classList.toggle('on', vw === 'table');
    $('vc').classList.toggle('on', vw === 'card');
    const needsPrismatic = _hasPrismaticBaseRows();
    if (!silent && needsPrismatic && !cacheApplied) { bootMsg('Loading Prismatic tiers…'); await ensurePrismaticTiers({ force: true, silentToast: true }); }
    else if (needsPrismatic) { _idle(() => ensurePrismaticTiers({ force: true, silentToast: true }).catch(() => {})); }
    if (!silent) {
      updateTopButtons();
      const sy = Number(_loadedUIState?.scrollY || 0);
      if (sy > 0) setTimeout(() => window.scrollTo(0, sy), 0);
      const targetKey = getHashItemKey() || (_loadedUIState?.activeKey || '');
      if (targetKey) _idle(() => openPanel(targetKey));
    }
    setSt('live', allPrices.length.toLocaleString() + ' items');
    $('rlsb').style.display = 'none';
    if (!silent) toast('Loaded ' + allPrices.length.toLocaleString() + ' items');
  } catch (e) {
    setSt('error', 'Error'); toast('Failed: ' + e.message, true);
    if (!allPrices.length) { showErr(e.message); $('rlsb').style.display = 'block'; }
  } finally {
    $('rBtn').classList.remove('spinning');
    if (!silent) bootHide();
  }
}
function manualRefresh() { fetchAll(false); }

// ── Prismatic tier splitting ──
let prismaticTiersReady = false, prismaticTiersPromise = null;
async function ensurePrismaticTiers(opts = {}) {
  if (prismaticTiersReady && !opts.force) return;
  if (prismaticTiersPromise) return prismaticTiersPromise;
  prismaticTiersPromise = buildPrismaticTiers(opts).finally(() => { prismaticTiersReady = true; prismaticTiersPromise = null; });
  return prismaticTiersPromise;
}
async function buildPrismaticTiers(opts = {}) {
  const base = enriched.filter(r => r.setName === 'Prismatic' && r.tier === 0);
  if (!base.length) return;
  if (!opts.silentToast) toast('Loading Prismatic tiers…');
  const byKey = {};
  for (const r of allPrices) byKey[r.key] = r;
  const tierRowsByBase = {}, LIMIT = 4;
  let i = 0;
  const workers = Array.from({ length: LIMIT }, async () => {
    while (i < base.length) {
      const idx = i++, r = base[idx];
      try {
        const rows = await sbGet('auctions', `?select=seller,unit_price,price,count,timestamp,tier,item_name,set_name&set_name=eq.Prismatic&item_name=ilike.${encodeURIComponent(r.displayName)}&tier=in.(1,2,3)&order=timestamp.desc&limit=1500`);
        const cleanAll = rows.filter(l => !isBadSeller(l.seller));
        const grouped = { 1: [], 2: [], 3: [] };
        for (const l of cleanAll) { const t = parseInt(l.tier, 10); if (t === 1 || t === 2 || t === 3) grouped[t].push(l); }
        const out = [];
        for (const t of [1, 2, 3]) {
          const list = grouped[t] || [], st = statsFromListings(list);
          if (!st.n) continue;
          out.push({ key: `${r.rawKey}|t${t}`, median: st.median, samples: st.n, confidence: confidenceFromSamples(st.n), iqr_low: st.q1, iqr_high: st.q3, trend: trendFromListings(list), last_seen: list[0]?.timestamp || null });
        }
        if (out.length) tierRowsByBase[r.rawKey] = out;
      } catch (e) { console.warn('Tier fetch failed:', e.message); }
    }
  });
  await Promise.all(workers);
  const newRows = [];
  for (const r of enriched) {
    if (r.setName === 'Prismatic' && r.tier === 0) {
      const tierRows = tierRowsByBase[r.rawKey] || [];
      if (tierRows.length) { tierRows.forEach(tr => newRows.push(tr)); }
      else { newRows.push(byKey[r.rawKey] || byKey[r.key] || { key: r.rawKey, median: r.median, samples: r.samples, confidence: r.confidence, iqr_low: r.iqr_low, iqr_high: r.iqr_high, trend: r.trend, last_seen: r.last_seen }); }
      continue;
    }
    newRows.push(byKey[r.rawKey] || byKey[r.key] || { key: r.rawKey, median: r.median, samples: r.samples, confidence: r.confidence, iqr_low: r.iqr_low, iqr_high: r.iqr_high, trend: r.trend, last_seen: r.last_seen });
  }
  allPrices = newRows; enriched = enrich(allPrices); maxSamples = Math.max(1, ...enriched.map(r => r.samples || 0));
  buildCatFilter(); updateStats(); applyFilters();
  if (Object.keys(tierRowsByBase).length) _writePrismaticCache(tierRowsByBase);
  if (!opts.silentToast) toast('Prismatic tiers ready');
}

// ── Fetch listings ──
async function fetchListings(itemKey) {
  const tierMatch = itemKey.match(/\|t([123])$/i);
  const tier = tierMatch ? parseInt(tierMatch[1]) : null;
  const baseName = itemKey.replace(/\|t[123]$/i, '').trim();
  try {
    const tierFilter = tier ? `&tier=eq.${tier}` : '';
    const prismaticFilter = tier ? `&set_name=eq.Prismatic` : '';
    return await sbGet('auctions', `?select=seller,price,count,unit_price,timestamp,set_name,item_name&item_name=ilike.${encodeURIComponent(baseName)}${prismaticFilter}${tierFilter}&order=timestamp.desc&limit=25`);
  } catch (e) { console.warn('Could not fetch listings:', e.message); return []; }
}
