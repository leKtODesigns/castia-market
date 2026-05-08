// ─────────────────────────────────────────────────────────────────────────────
// features.js — favorites, compare, data saver, events, keyboard, auto-refresh, boot
// ─────────────────────────────────────────────────────────────────────────────

// ── Favorites ──
function isFav(key) { return favSet.has(String(key || '')); }

function toggleFavorite(key) {
  const k = String(key || ''); if (!k) return;
  if (favSet.has(k)) favSet.delete(k); else favSet.add(k);
  toast(favSet.has(k) ? 'Added to favorites' : 'Removed from favorites');
  scheduleSaveUIState();
  updateTopButtons();
  // Update all star buttons in the current view without a full re-render
  document.querySelectorAll(`[data-act="fav"][data-key="${CSS.escape(k)}"]`).forEach(btn => {
    btn.classList.toggle('on', favSet.has(k));
    btn.title = favSet.has(k) ? 'Remove from favorites' : 'Add to favorites';
  });
  renderPanelFromCtx({ partial: true });
  // When in favOnly mode, immediately remove the item from the view
  if (favOnly) withCGridFlip(() => render());
}

function toggleFavOnly() {
  favOnly = !favOnly;
  updateTopButtons();
  scheduleSaveUIState();
  applyFilters();
}

// ── Data saver ──
function toggleDataSaver() {
  dataSaver = !dataSaver;
  updateTopButtons();
  scheduleSaveUIState();
  render();
  if (panel && panel.classList.contains('open')) panelMeta.innerHTML = panelMetaHTML(panelCtx?.item);
}

// ── Compare ──
function toggleCompare(key) {
  const k = String(key || ''); if (!k) return;
  const idx = compareKeys.indexOf(k);
  if (idx >= 0) { compareKeys.splice(idx, 1); toast('Removed from compare'); }
  else {
    if (compareKeys.length >= 3) { toast('Compare is limited to 3 items', true); return; }
    compareKeys.push(k); toast('Added to compare');
  }
  updateTopButtons();
  updateCmpTooltip();
  scheduleSaveUIState();
  // Live-update compare buttons in current view without full re-render
  const inCmp = compareKeys.includes(k);
  document.querySelectorAll(`[data-act="cmp"][data-key="${CSS.escape(k)}"]`).forEach(btn => {
    btn.classList.toggle('on', inCmp);
    btn.title = inCmp ? 'Remove from compare' : 'Add to compare';
  });
  // Live-update panel compare pill if open
  const panelCmpBtn = $('panelCmpBtn');
  if (panelCmpBtn) panelCmpBtn.classList.toggle('on', inCmp);
}

function updateTopButtons() {
  if (favOnlyBtn) favOnlyBtn.classList.toggle('on', !!favOnly);
  if (dsBtn) dsBtn.classList.toggle('on', !!dataSaver);
  const banner = $('dsBanner'); if (banner) banner.classList.toggle('on', !!dataSaver);
  if (cmpCountEl) {
    const n = compareKeys.length;
    cmpCountEl.textContent = String(n);
    cmpCountEl.classList.toggle('off', n <= 0);
  }
}

function openCompare() {
  if (!compareModal || !cmpBody) return;
  if (!compareKeys.length) {
    cmpBody.innerHTML = `<div class="cmp-empty">
      <div class="eicon">⇄</div>
      <div class="emsg">No items selected for comparison</div>
      <div class="esub">Open any item’s detail panel and click <strong style="color:var(--text2)">⇄ Compare</strong> to add up to 3 items.</div>
    </div>`;
  } else {
    const items = compareKeys.map(k => enriched.find(r => r.rawKey === k)).filter(Boolean);
    const grid = items.map(r => {
      const ar = adaptiveRange(r), inFav = isFav(r.rawKey);
      // Image + notes block (same logic as panelMetaHTML but compact)
      const note = getCardNoteForRow(r);
      const imgPaths = dataSaver ? [] : imagePathsForRow(r);
      const hasImg = imgPaths.length > 0;
      const hasNote = !!(note && note.lines && note.lines.length);
      let metaHTML = '';
      if (hasImg || hasNote) {
        const imgHTML = hasImg
          ? `<div class="cmp-meta-img">${imageHTMLForRow(r, '', { eager: true, fetchPriority: 'high' })}</div>`
          : '';
        const noteHTML = hasNote
          ? `<div class="cmp-meta-note">${note.lines.map(line => {
              const s = String(line || '');
              if (s.trim().startsWith('\u25a0')) return `<div class="cmp-meta-line"><span class="cmp-meta-diamond"></span><span>${esc(s.replace(/^\u25a0\s*/, ''))}</span></div>`;
              return `<div class="cmp-meta-line"><span class="cmp-meta-dot"></span><span>${esc(s)}</span></div>`;
            }).join('')}</div>`
          : '';
        metaHTML = `<div class="cmp-meta">${imgHTML}${noteHTML}</div>`;
      }
      return `<div class="cmp-item">
        <div class="cmp-item-head">
          <div style="min-width:0;flex:1">
            <div class="cmp-item-name" title="${esc(r.rawKey)}">${esc(r.displayName)}${skillTagH(r.skillTag)}</div>
            <div style="margin-top:4px;display:flex;gap:4px;flex-wrap:wrap">${catBadge(r.category)}${r.tier ? tierBadge(r.tier) : ''}</div>
          </div>
          <div class="cmp-item-actions">
            <button class="fstar ${inFav ? 'on' : ''}" data-act="fav" data-key="${esc(r.rawKey)}" title="${inFav ? 'Remove from favorites' : 'Add to favorites'}">★</button>
          </div>
        </div>
        ${metaHTML}
        <div class="cmp-price-row">
          <div class="cmp-price">${fmt(r.median)}</div>
          <button class="copy-price-btn" onclick="copyPriceFromCmp(${r.median}, this)" title="Copy price">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3.5" y="3.5" width="6" height="6" rx="1"/><path d="M1.5 7.5V1.5h6"/></svg>
          </button>
        </div>
        <div class="cmp-range">${fmt(ar.low)} — ${fmt(ar.high)}</div>
        <div class="cmp-row"><span class="rl">Trend</span><span>${trendH(r.trend)}</span></div>
        <div class="cmp-row"><span class="rl">Confidence</span><span class="conf-b ${confCls(r.confidence)}" style="padding:1px 6px">■ ${r.confidence || '—'}</span></div>
        <div class="cmp-row"><span class="rl">Samples</span><span style="font-family:'Space Mono',monospace">${r.samples?.toLocaleString() || '—'}</span></div>
        <div class="cmp-row"><span class="rl">Last seen</span><span style="font-family:'Space Mono',monospace">${fmtT(r.last_seen)}</span></div>
        <div class="cmp-footer">
          <button class="hbtn" data-act="cmp-open" data-key="${esc(r.rawKey)}">Open detail</button>
          <button class="hbtn" data-act="cmp-remove" data-key="${esc(r.rawKey)}">Remove</button>
        </div>
      </div>`;
    }).join('');
    cmpBody.innerHTML = `<div class="cmp-grid">${grid}</div>`;
    observeLazyImages(cmpBody);
  }
  compareModal.classList.add('on');
  compareModal.setAttribute('aria-hidden', 'false');
  // Trigger fresh CSS animation on the card each open
  const card = compareModal.querySelector('.cmp-card');
  if (card) { card.style.animation = 'none'; card.offsetWidth; card.style.animation = ''; }
}

function closeCompare() {
  if (!compareModal) return;
  compareModal.classList.remove('on');
  compareModal.setAttribute('aria-hidden', 'true');
}

// Copy price variant for compare modal — targets the clicked button directly
function copyPriceFromCmp(n, btn) {
  const rounded = roundToCleanPrice(Math.round(n || 0));
  navigator.clipboard?.writeText(String(rounded)).then(() => {
    if (btn) { btn.classList.add('copied'); setTimeout(() => btn.classList.remove('copied'), 1800); }
    toast('Copied ' + rounded.toLocaleString());
  }).catch(() => toast('Could not copy', true));
}

function clearCompare() {
  compareKeys = [];
  updateTopButtons();
  updateCmpTooltip();
  scheduleSaveUIState();
  openCompare();
}

// ── Event delegation ──
tbody.addEventListener('click', e => {
  const act = e.target.closest('[data-act]');
  if (act) {
    e.preventDefault(); e.stopPropagation();
    if (act.dataset.act === 'fav') { toggleFavorite(act.dataset.key); return; }
    if (act.dataset.act === 'cmp') { toggleCompare(act.dataset.key); return; }
  }
  const tr = e.target.closest('tr[data-key]'); if (tr) openPanel(tr.dataset.key);
});

cgrid.addEventListener('click', e => {
  const act = e.target.closest('[data-act]');
  if (act) {
    e.preventDefault(); e.stopPropagation();
    if (act.dataset.act === 'fav') { toggleFavorite(act.dataset.key); return; }
    if (act.dataset.act === 'cmp') { toggleCompare(act.dataset.key); return; }
  }
  const card = e.target.closest('.pcard[data-key]'); if (card) openPanel(card.dataset.key);
});

panel.addEventListener('click', e => {
  const act = e.target.closest('[data-act]'); if (!act) return;
  const key = act.dataset.key;
  if (act.dataset.act === 'fav') { e.preventDefault(); toggleFavorite(key); return; }
  if (act.dataset.act === 'cmp') { e.preventDefault(); toggleCompare(key); return; }
});

if (compareModal) {
  compareModal.addEventListener('click', e => {
    const act = e.target.closest('[data-act]'); if (!act) return;
    const key = act.dataset.key;
    if (act.dataset.act === 'fav')        { e.preventDefault(); toggleFavorite(key); openCompare(); return; }
    if (act.dataset.act === 'cmp-open')   { e.preventDefault(); closeCompare(); openPanel(key); return; }
    if (act.dataset.act === 'cmp-remove') { e.preventDefault(); toggleCompare(key); openCompare(); return; }
  });
}

// ── Search input events ──
qEl.addEventListener('input', () => {
  $('xBtn').classList.toggle('on', qEl.value.length > 0);
  updateSugg();
  clearTimeout(debT); debT = setTimeout(applyFilters, 60);
  scheduleSaveUIState();
});
qEl.addEventListener('keydown', e => {
  const open = suggEl.classList.contains('on'); if (!open) return;
  if (e.key === 'ArrowDown') { e.preventDefault(); setSuggIndex(Math.min(suggItems.length - 1, suggIndex < 0 ? 0 : suggIndex + 1)); return; }
  if (e.key === 'ArrowUp')   { e.preventDefault(); setSuggIndex(Math.max(0, suggIndex < 0 ? 0 : suggIndex - 1)); return; }
  if (e.key === 'Enter')     { if (suggIndex >= 0) { e.preventDefault(); applySugg(suggIndex); } return; }
  if (e.key === 'Escape')    { e.preventDefault(); hideSugg(); return; }
});
qEl.addEventListener('blur', () => setTimeout(hideSugg, 150));
suggEl.addEventListener('mousedown', e => {
  const btn = e.target.closest('button[data-i]'); if (!btn) return;
  e.preventDefault(); applySugg(parseInt(btn.dataset.i));
});

// ── Filter select events ──
catEl.addEventListener('change', applyFilters);
confEl.addEventListener('change', applyFilters);
tierEl.addEventListener('change', async () => {
  if (tierEl.value && tierEl.value !== '0') await ensurePrismaticTiers();
  applyFilters();
});

// ── Scroll persistence ──
window.addEventListener('scroll', scheduleSaveUIState, { passive: true });

// ── Hash deep-link ──
window.addEventListener('hashchange', () => {
  const hk = getHashItemKey();
  if (!hk) { if (panel.classList.contains('open')) closePanel(); return; }
  if (hk === activeKey && panel.classList.contains('open')) return;
  if (enriched && enriched.length) openPanel(hk);
});

// ── Keyboard shortcuts ──
document.addEventListener('keydown', e => {
  const active = document.activeElement;
  const inInput = active === qEl || active.tagName === 'INPUT' || active.tagName === 'SELECT' || active.tagName === 'TEXTAREA';
  if ((e.key === '/' || e.key === 't' || e.key === 'T') && !inInput) { e.preventDefault(); qEl.focus(); qEl.select(); return; }
  if (e.key === 'Escape') {
    if (compareModal && compareModal.classList.contains('on')) { closeCompare(); return; }
    if (panel.classList.contains('open')) { closePanel(); return; }
    if (document.activeElement === qEl) {
      if (suggEl.classList.contains('on')) { hideSugg(); return; }
      if (qEl.value) { clearQ(); } else { qEl.blur(); }
      return;
    }
  }
});

document.addEventListener('click', e => { if (!e.target.closest('.sw')) hideSugg(); });

// ── Upgrade native selects ──
enhanceSelect(catEl);
enhanceSelect(confEl);
enhanceSelect(tierEl);

// ── Auto-refresh ──
const REFRESH_MS = 5 * 60 * 1000;
let nextRefresh = Date.now() + REFRESH_MS;
function scheduleRefresh() {
  const delay = Math.max(0, nextRefresh - Date.now());
  setTimeout(() => { fetchAll(true); nextRefresh = Date.now() + REFRESH_MS; scheduleRefresh(); }, delay);
}
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && Date.now() >= nextRefresh) { fetchAll(true); nextRefresh = Date.now() + REFRESH_MS; }
});

// ── Scroll-to-top button ──
const scrollTopBtn = $('scrollTopBtn');
window.addEventListener('scroll', () => {
  if (scrollTopBtn) scrollTopBtn.classList.toggle('on', window.scrollY > 300);
}, { passive: true });

// ── Compare tooltip ──
function updateCmpTooltip() {
  const btn = $('cmpBtn'); if (!btn) return;
  let tip = btn.querySelector('.cmp-tip');
  if (!tip) { tip = document.createElement('div'); tip.className = 'cmp-tip'; btn.appendChild(tip); }
  if (!compareKeys.length) {
    tip.innerHTML = `<span class="cmp-tip-empty">No items selected yet</span>`;
  } else {
    tip.innerHTML = compareKeys.map(k => {
      const r = enriched.find(e => e.rawKey === k);
      return `<div class="cmp-tip-item">${esc(r ? r.displayName : k)}</div>`;
    }).join('');
  }
}

// ── Row hover tooltip ──
let _rowTip = null;
function getRowTip() {
  if (!_rowTip) { _rowTip = document.createElement('div'); _rowTip.className = 'row-tip'; document.body.appendChild(_rowTip); }
  return _rowTip;
}
function showRowTip(e, r) {
  const tip = getRowTip();
  const ar = adaptiveRange(r);
  tip.innerHTML = `
    <div class="row-tip-row"><span class="row-tip-label">Range</span><span class="row-tip-val">${fmt(ar.low)} — ${fmt(ar.high)}</span></div>
    <div class="row-tip-row"><span class="row-tip-label">Trend</span><span class="row-tip-val">${trendH(r.trend)}</span></div>
    <div class="row-tip-row"><span class="row-tip-label">Confidence</span><span class="row-tip-val conf-b ${confCls(r.confidence)}" style="padding:0">■ ${r.confidence || '—'}</span></div>
    <div class="row-tip-row"><span class="row-tip-label">Samples</span><span class="row-tip-val">${r.samples?.toLocaleString() || '—'}</span></div>`;
  positionRowTip(e);
  tip.classList.add('on');
}
function positionRowTip(e) {
  const tip = getRowTip(); if (!tip.classList.contains('on')) return;
  const x = e.clientX + 16, y = e.clientY - 10;
  const maxX = window.innerWidth - tip.offsetWidth - 12;
  const maxY = window.innerHeight - tip.offsetHeight - 12;
  tip.style.left = Math.min(x, maxX) + 'px';
  tip.style.top = Math.min(y, maxY) + 'px';
}
function hideRowTip() { const tip = getRowTip(); tip.classList.remove('on'); }

tbody.addEventListener('mouseover', e => {
  const tr = e.target.closest('tr[data-key]'); if (!tr) return;
  const r = enriched.find(x => x.rawKey === tr.dataset.key); if (!r) return;
  showRowTip(e, r);
});
tbody.addEventListener('mousemove', e => { positionRowTip(e); });
tbody.addEventListener('mouseout', e => { if (!e.target.closest('tr[data-key]')) hideRowTip(); });
tbody.addEventListener('mouseleave', hideRowTip);

// Card view tooltip
cgrid.addEventListener('mouseover', e => {
  const card = e.target.closest('.pcard[data-key]'); if (!card) return;
  // Don't show if hovering action buttons
  if (e.target.closest('.ccard-actions')) return;
  const r = enriched.find(x => x.rawKey === card.dataset.key); if (!r) return;
  showRowTip(e, r);
});
cgrid.addEventListener('mousemove', e => { positionRowTip(e); });
cgrid.addEventListener('mouseout', e => { if (!e.target.closest('.pcard[data-key]')) hideRowTip(); });
cgrid.addEventListener('mouseleave', hideRowTip);

// ── Empty favorites state ──
function showEmptyFavs() {
  const inner = `<div class="estate">
    <div class="eicon">★</div>
    <div class="emsg">No favorites yet</div>
    <div class="esub">Click the ★ star on any item to add it to your watchlist.</div>
    <div class="esub" style="margin-top:8px"><button onclick="toggleFavOnly()" style="background:none;border:none;color:var(--gold);cursor:pointer;font-family:inherit;font-size:12px;text-decoration:underline">Show all items</button></div>
  </div>`;
  if (vw === 'table') tbody.innerHTML = `<tr><td colspan="7">${inner}</td></tr>`;
  else cgrid.innerHTML = `<div style="grid-column:1/-1">${inner}</div>`;
}

// ── Boot ──
applyLoadedUIState();
fetchAll(false);
scheduleRefresh();
setInterval(() => { if (lastLoaded) $('sUpd').textContent = fmtT(lastLoaded); }, 30000);
// Init compare tooltip
_idle(() => updateCmpTooltip());
