// ─────────────────────────────────────────────────────────────────────────────
// Credentials
// ─────────────────────────────────────────────────────────────────────────────
const SB_URL='https://opxorasggouuzzsvzlvm.supabase.co';
const SB_KEY='sb_publishable_PjpxLcSpHeOt2MCgl3fUUw_RUFOAb5w';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const PAGE=50;

function tierStars(tier){return(['','★','★★','★★★'][tier]||'');}

// Mithril set names — order matters: longer/more-specific prefixes first so
// "Mistle Toes" (relic) isn't caught before we check relics, and "Posh Wellies"
// doesn't match the "Posh" set prefix.
const MITHRIL_SETS=[
  // Seasonal / event
  'Springtide','Jolly','Rosewood','Nightfall','Lunar','Silversnow',
  // Unique sets
  'Prismatic','Pandora','Daydream','Eldritch','Aerondight','Fluorite','Witherbone',
  'Halgrabind','Elven','Erphis','Llanakin','Shoopon','Athanasia','Bogmath',
  'Curtana','Kayran','Malediction','Oceanis','Phezar','Saprophyte','Vurgohk',
  'Azertuan','Hulia','Igru','Oldus','Opulent','Paragon','Requinox',
  'Serpent','Vertigo','Manticore',
  // Short names last — avoid prefix-matching before more specific checks
  'Mistle','Posh',
];

// Known gear piece suffixes for Mithril sets (exact lowercase remainder after set name)
// Multi-word suffixes must be listed in full — e.g. "fishing rod", not just "rod"
const GEAR_SUFFIXES=new Set([
  // Armour
  'helmet','chestplate','leggings','boots',
  // Melee weapons & tools
  'sword','axe','pickaxe','shovel','hoe','mace',
  // Ranged / special
  'bow','crossbow','trident','shield',
  // Shears (Prismatic Shears exists)
  'shears',
  // Custom suffixes found in actual auction data
  'fishing rod','staff','wand',
  // Elytra and other wearables as set pieces (e.g. Manticore Elytra)
  'elytra','chestplate',
]);

// Unique relics — base names (lowercase). Skill-variant relics like
// "Christmas Cap [Smelting]" are stored with a bracket suffix in the DB key,
// so we check startsWith rather than exact equality for these.
const UNIQUE_RELICS_EXACT=new Set([
  'mistle toes','posh wellies','pet rock','bamboozle',
]);
// Skill-variant relics: stored as "<name> [<skill>]" in price_data keys
const UNIQUE_RELICS_VARIANT=['christmas cap','knowledge cap'];

// Runestones — exact lowercase full names
const RUNESTONES=new Set([
  "ruby's fire",'end veil','sculk smite','dune walker','decapitation',
  'obby breaker','deepfry','comb cutter','cat eyes','bait',
  'potent poison','mint breath','magma walker','vein miner','treefeller',
  'collection','fire react','solar lure','lunar lure',
]);

// Spawner mob prefixes — the word before " spawner" in the item name
const SPAWNER_MOBS=new Set([
  'spider','zombie','skeleton','creeper','witch','blaze','silverfish',
  'pig','rabbit','chicken','cow','sheep','goat','cave spider','iron golem',
]);

// Resources — exact lowercase names (raw/tradeable materials, NOT mobility tools)
// Elytra is intentionally NOT here — vanilla elytra are utility, Manticore Elytra
// is set-gear (caught by MITHRIL_SETS before this check).
const RESOURCES=new Set([
  // Castia custom materials
  'mithril core','mithril essence','essence fragment','essence fragments',
  // High-value vanilla drops
  'echo shard','end crystal','heavy core',
  'golden apple','enchanted golden apple','beacon',
  'wither skeleton skull','nether star',
  "bottle o' enchanting",
  'budding amethyst','heart of the sea',
  'netherite scrap','netherite ingot',
  'ominous trial key','trial key',
  'shulker shell','dragon egg','dragon head',
  'totem of undying','nautilus shell',
  // Stackable trade goods
  'prismarine shard','prismarine crystals','blaze rod','blaze powder',
  'ghast tear','magma cream','slimeball','spider eye',
  'fermented spider eye','rabbit foot','rabbit hide',
]);

// Utility — exact lowercase names (tools, consumables, server-specific items)
// Also includes mobility items like elytra and saddle since they're "used", not "farmed"
const UTILITY=new Set([
  // Castia-specific
  'quest crystal','ore seed','spawner spinner','uranium nugget','tracking oil',
  'mystery egg','glass cutter','begrimed item','historical codex','liquid exp',
  'blessing dust','mob catcher','essence','rename kit','repair oil',
  'the grand scrambler',
  // Vanilla utility with a "use" not a "farm" purpose
  'elytra','saddle','lead','name tag',
  // Mushroom / food items that appear in the market
  'mushroom','mystic mushroom',
]);

const CAT_LABELS={
  'set-gear':'Set Gear','enchanted-book':'Enchanted Book',
  'spawner':'Spawner','spawn-egg':'Spawn Egg',
  'runestone':'Runestone','unique-relic':'Unique Relic',
  'resource':'Resource','utility':'Utility',
  'music-disc':'Music Disc','misc':'Misc',
};
const CONF_ORDER={high:0,good:1,fair:2,low:3,unreliable:4};
const SELLER_COLORS={
  Trustworthy:{bg:'rgba(70,214,121,.1)',color:'#46d679',border:'rgba(70,214,121,.25)'},
  Neutral:{bg:'rgba(133,138,160,.08)',color:'#858aa0',border:'rgba(133,138,160,.2)'},
  Suspicious:{bg:'rgba(237,184,74,.1)',color:'#edb84a',border:'rgba(237,184,74,.25)'},
  Flagged:{bg:'rgba(240,100,100,.1)',color:'#f06464',border:'rgba(240,100,100,.25)'},
};
const SELLER_ORDER={Trustworthy:0,Neutral:1,Suspicious:2,Flagged:3};

// Skill tags for caps (lowercase keys)
const SKILL_TAG_CLASS={
  mining:'st-mining',
  woodcutting:'st-woodcutting',
  hunting:'st-hunting',
  farming:'st-farming',
  fishing:'st-fishing',
  smelting:'st-smelting',
  arcane:'st-arcane',
};

// ─────────────────────────────────────────────────────────────────────────────
// State
// ─────────────────────────────────────────────────────────────────────────────
let allPrices=[], enriched=[], filtered=[];
let allSellers={};   // key=seller lowercase -> seller_data row
let vw='table', sc='median', sd='desc', pg=1;
let maxSamples=1, lastLoaded=null, debT=null;
let activeKey=null;  // currently open panel item key

// Detail panel state (for sorting/filtering without refetch)
let panelCtx=null; // { key, item, listingsRaw, listingsClean, removed, samplesFromListings }
let panelSort='newest'; // newest | price_asc | price_desc | seller
let panelIncludeFlagged=false;

// ─────────────────────────────────────────────────────────────────────────────
// DOM
// ─────────────────────────────────────────────────────────────────────────────
const $=id=>document.getElementById(id);
const qEl=$('qEl'), catEl=$('catEl'), confEl=$('confEl'), tierEl=$('tierEl');
const suggEl=$('suggEl');
const tbody=$('tbody'), cgrid=$('cgrid');
const panel=$('detail-panel'), panelBackdrop=$('panel-backdrop');
const panelMeta=$('panel-meta');
const appShell=$('app');
const boot=$('boot-preloader');
const bootTxt=$('boot-text');

function bootShow(msg){
  if(!boot)return;
  if(msg && bootTxt)bootTxt.textContent=msg;
  boot.classList.add('on');
  boot.classList.remove('off');
  boot.setAttribute('aria-hidden','false');
}
function bootMsg(msg){
  if(!bootTxt)return;
  bootTxt.textContent=msg;
}
function bootHide(){
  if(!boot)return;
  boot.classList.remove('on');
  boot.classList.add('off');
  boot.setAttribute('aria-hidden','true');
}

function markActiveSelection(){
  // Table rows
  document.querySelectorAll('#tbody tr.active-row').forEach(el=>el.classList.remove('active-row'));
  if(activeKey){
    const tr=document.querySelector(`#tbody tr[data-key="${CSS.escape(activeKey)}"]`);
    if(tr)tr.classList.add('active-row');
  }
  // Card grid
  document.querySelectorAll('#cgrid .pcard.active-card').forEach(el=>el.classList.remove('active-card'));
  if(activeKey){
    const card=document.querySelector(`#cgrid .pcard[data-key="${CSS.escape(activeKey)}"]`);
    if(card)card.classList.add('active-card');
  }
}

function captureCGridRects(){
  const map=new Map();
  if(!cgrid)return map;
  cgrid.querySelectorAll('.pcard[data-key]').forEach(el=>{
    map.set(el.dataset.key, el.getBoundingClientRect());
  });
  return map;
}
function playCGridFlip(firstRects){
  if(!cgrid || !firstRects || !firstRects.size)return;
  requestAnimationFrame(()=>{
    cgrid.querySelectorAll('.pcard[data-key]').forEach(el=>{
      const first=firstRects.get(el.dataset.key);
      if(!first)return;
      const last=el.getBoundingClientRect();
      const dx=first.left-last.left;
      const dy=first.top-last.top;
      if(!dx && !dy)return;
      el.style.willChange='transform';
      el.animate(
        [{transform:`translate(${dx}px,${dy}px)`},{transform:'translate(0,0)'}],
        {duration:320,easing:'cubic-bezier(.2,.8,.2,1)'}
      ).finished.finally(()=>{el.style.willChange='';});
    });
  });
}
function withCGridFlip(mutator){
  if(vw!=='card' || !cgrid){mutator();return;}
  const first=captureCGridRects();
  // The shell (#app) normally animates margin-right; during that transition the grid
  // keeps reflowing, which makes card movement look "rugged". For card view we
  // snap the shell width instantly and animate the cards themselves (FLIP).
  if(appShell)appShell.classList.add('no-shell-anim');
  mutator();
  // Force layout so "last" rects are stable before animating.
  if(appShell)appShell.offsetWidth;
  if(appShell)appShell.classList.remove('no-shell-anim');
  playCGridFlip(first);
}

// ─────────────────────────────────────────────────────────────────────────────
// Custom UI components (selects / toggles)
// ─────────────────────────────────────────────────────────────────────────────
const cselects=new Map(); // selectEl.id -> {wrap,btn,menu,refresh}

function closeAllCSelects(exceptId=null){
  for(const [id,cs] of cselects){
    if(exceptId && id===exceptId)continue;
    cs.wrap.classList.remove('open');
  }
  // Panel custom select (not native-based)
  const ps=$('panelSortSel');
  if(ps && (!exceptId || exceptId!=='panelSortSel'))ps.classList.remove('open');
}

function enhanceSelect(selectEl){
  if(!selectEl || !selectEl.id)return;
  const id=selectEl.id;
  if(cselects.has(id))return; // one-time

  selectEl.classList.add('native-hidden');

  const wrap=document.createElement('div');
  wrap.className='cselect';
  wrap.dataset.for=id;

  const btn=document.createElement('button');
  btn.type='button';
  btn.className='cselect-btn';
  btn.innerHTML=`<span class="cval"></span><span class="car">▾</span>`;

  const menu=document.createElement('div');
  menu.className='cselect-menu';

  wrap.appendChild(btn);
  wrap.appendChild(menu);

  // Insert after select
  selectEl.insertAdjacentElement('afterend',wrap);

  function refresh(){
    // Build menu options from native select options
    const cur=selectEl.value;
    const opts=[...selectEl.querySelectorAll('option')];
    menu.innerHTML=opts.map(o=>{
      const v=o.value;
      const lbl=o.textContent||v||'—';
      const on=v===cur;
      return `<button type="button" class="copt ${on?'on':''}" data-value="${esc(v)}">${esc(lbl)}</button>`;
    }).join('');

    const selOpt=selectEl.querySelector(`option[value="${CSS.escape(cur)}"]`) || selectEl.options[selectEl.selectedIndex];
    const label=selOpt ? (selOpt.textContent||selOpt.value||'—') : '—';
    btn.querySelector('.cval').textContent=label;
  }

  btn.addEventListener('click',(e)=>{
    e.preventDefault();
    const isOpen=wrap.classList.contains('open');
    closeAllCSelects(isOpen?null:id);
    wrap.classList.toggle('open',!isOpen);
  });
  menu.addEventListener('click',(e)=>{
    const opt=e.target.closest('.copt[data-value]');
    if(!opt)return;
    const v=opt.dataset.value ?? '';
    selectEl.value=v;
    selectEl.dispatchEvent(new Event('change',{bubbles:true}));
    refresh();
    wrap.classList.remove('open');
  });
  selectEl.addEventListener('change',refresh);

  // Initial render
  refresh();

  cselects.set(id,{wrap,btn,menu,refresh});
}

function refreshCSelect(id){
  const cs=cselects.get(id);
  if(cs && cs.refresh)cs.refresh();
}

document.addEventListener('click',(e)=>{
  // Close selects when clicking outside
  if(!e.target.closest('.cselect'))closeAllCSelects();
});

// ─────────────────────────────────────────────────────────────────────────────
// Formatters
// ─────────────────────────────────────────────────────────────────────────────
function fmt(n){
  if(n==null||n==='')return'—';
  const v=+n; if(isNaN(v))return'—';
  if(v>=1e9)return(v/1e9).toFixed(2)+'B';
  if(v>=1e6)return(v/1e6).toFixed(2)+'M';
  if(v>=1e3)return(v/1e3).toFixed(1)+'K';
  return v.toLocaleString();
}
function fmtFull(n){
  if(n==null)return'—';
  return Math.round(n).toLocaleString();
}
function fmtT(d){
  if(!d)return'—';
  const s=(Date.now()-new Date(d).getTime())/1000;
  if(s<60)return'just now';
  if(s<3600)return Math.floor(s/60)+'m ago';
  if(s<86400)return Math.floor(s/3600)+'h ago';
  if(s<86400*7)return Math.floor(s/86400)+'d ago';
  return new Date(d).toLocaleDateString();
}
function esc(s){return s?String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'):''}

// ─────────────────────────────────────────────────────────────────────────────
// Listing helpers (stats + seller filtering)
// ─────────────────────────────────────────────────────────────────────────────
function isBadSeller(seller){
  if(!seller)return false;
  const sd=allSellers[String(seller).toLowerCase()];
  return !!(sd && (sd.is_blacklisted||sd.is_flagged));
}
function getUnitPrice(l){
  if(l==null)return 0;
  if(l.unit_price!=null)return +l.unit_price||0;
  const p=+l.price||0, c=+l.count||1;
  return c?Math.round(p/c):p;
}
function quantileSorted(sorted,p){
  if(!sorted.length)return 0;
  const idx=(sorted.length-1)*p;
  const lo=Math.floor(idx), hi=Math.ceil(idx);
  if(lo===hi)return sorted[lo];
  const w=idx-lo;
  return sorted[lo]*(1-w)+sorted[hi]*w;
}
function statsFromListings(listings){
  const vals=listings.map(getUnitPrice).filter(v=>v>0).sort((a,b)=>a-b);
  const n=vals.length;
  if(!n)return{n:0,median:0,q1:0,q3:0};
  return{
    n,
    median:Math.round(quantileSorted(vals,0.5)),
    q1:Math.round(quantileSorted(vals,0.25)),
    q3:Math.round(quantileSorted(vals,0.75)),
  };
}
function confidenceFromSamples(n){
  if(n>=30)return'high';
  if(n>=15)return'good';
  if(n>=7)return'fair';
  if(n>=3)return'low';
  return'unreliable';
}
function trendFromListings(listings){
  // Compare median of newest half vs oldest half (by timestamp)
  const byTime=[...listings].filter(l=>l.timestamp).sort((a,b)=>new Date(a.timestamp)-new Date(b.timestamp));
  if(byTime.length<6)return'stable';
  const mid=Math.floor(byTime.length/2);
  const old=statsFromListings(byTime.slice(0,mid)).median||0;
  const neu=statsFromListings(byTime.slice(mid)).median||0;
  if(!old||!neu)return'stable';
  if(neu>old*1.10)return'up';
  if(neu<old*0.90)return'down';
  return'stable';
}

function sellerRatingInfo(seller){
  const sd=allSellers[String(seller||'').toLowerCase()];
  const isFlagged=!!(sd && (sd.is_blacklisted||sd.is_flagged));
  const baseLabel=sd?.accuracy_label||'Neutral';
  const label=isFlagged?'Flagged':baseLabel;
  const order=SELLER_ORDER[label]??SELLER_ORDER.Neutral;
  return{sd,label,order,isFlagged,isBlacklisted:!!sd?.is_blacklisted};
}

// ─────────────────────────────────────────────────────────────────────────────
// Title-case
// ─────────────────────────────────────────────────────────────────────────────
const LOWER_WORDS=new Set(['a','an','the','and','but','or','for','nor','on','at','to','by','in','of','up','as','vs','via']);
function titleCase(str){
  if(!str)return str;
  return str.split(' ').map((w,i)=>{
    const wl=w.toLowerCase();
    // Keep roman numerals fully uppercase (e.g. III, IV, XII)
    if(/^(?=[ivxlcdm]+$)[ivxlcdm]+$/i.test(w))return w.toUpperCase();
    if(i>0&&LOWER_WORDS.has(wl))return wl;
    return wl.charAt(0).toUpperCase()+wl.slice(1);
  }).join(' ');
}

// ─────────────────────────────────────────────────────────────────────────────
// Key parser — classifies a raw DB key into display name + category + metadata
// ─────────────────────────────────────────────────────────────────────────────
function parseKey(raw){
  if(!raw)return{displayName:'—',category:'misc',tier:0,setName:null,rawKey:raw};

  // Strip tier suffix e.g. "elven sword|t2"
  let baseKey=raw.trim(), tier=0;
  const tierMatch=baseKey.match(/\|t([123])$/i);
  if(tierMatch){tier=parseInt(tierMatch[1]);baseKey=baseKey.slice(0,baseKey.lastIndexOf('|t')).trim();}

  const kl=baseKey.toLowerCase();

  // 1. Enchanted books
  if(kl.startsWith('book:')){
    const bookName=baseKey.replace(/^book:\s*/i,'').trim();
    return{displayName:'Book: '+titleCase(bookName),category:'enchanted-book',tier:0,setName:null,rawKey:raw};
  }

  // 2. Mithril set gear — checked FIRST so "Manticore Elytra" → set-gear,
  //    not utility, even though "elytra" is also in UTILITY.
  for(const setName of MITHRIL_SETS){
    const prefix=setName.toLowerCase();
    if(kl===prefix||kl.startsWith(prefix+' ')){
      const remainder=kl.slice(prefix.length).trim(); // "" or "sword" or "fishing rod" etc.
      // Accept if remainder is empty (bare set name) or is a known gear suffix.
      // Check both the full remainder AND just the last word (handles multi-word suffixes).
      const lastWord=remainder.split(' ').pop();
      const isGear=remainder===''||GEAR_SUFFIXES.has(remainder)||GEAR_SUFFIXES.has(lastWord);
      if(isGear){
        let display=titleCase(baseKey);
        if(tier>0){
          // Prismatic tiered items show stars in the name (instead of "(T3)")
          if(prefix==='prismatic')display+=` ${tierStars(tier)}`;
          else display+=` (T${tier})`;
        }
        return{displayName:display,category:'set-gear',tier,setName:titleCase(setName),rawKey:raw};
      }
    }
  }

  // 3. Unique relics — exact match for fixed relics, startsWith for skill-variant ones
  // Skill-variant relics are stored as e.g. "christmas cap [smelting]" in price_data
  if(UNIQUE_RELICS_EXACT.has(kl))
    return{displayName:titleCase(baseKey),category:'unique-relic',tier:0,setName:null,rawKey:raw};
  if(UNIQUE_RELICS_VARIANT.some(r=>kl===r||kl.startsWith(r+' ['))){
    // Display name: "Christmas Cap [Smelting]" → show a colored skill tag instead of brackets
    const bracketMatch=baseKey.match(/^(.+?)\s*\[(.+)\]$/);
    if(bracketMatch){
      const base=titleCase(bracketMatch[1]);
      const skillRaw=(bracketMatch[2]||'').trim();
      const skill=skillRaw.toLowerCase();
      const tagClass=SKILL_TAG_CLASS[skill]||null;
      return{
        displayName:base,
        category:'unique-relic',
        tier:0,
        setName:null,
        rawKey:raw,
        skillTag:tagClass?{text:titleCase(skill),cls:tagClass}:null,
      };
    }
    return{displayName:titleCase(baseKey),category:'unique-relic',tier:0,setName:null,rawKey:raw,skillTag:null};
  }

  // 4. Runestones — exact match
  // Runestones with a percentage suffix e.g. "Treefeller (12%)" — strip the suffix first
  const klNoSuffix=kl.replace(/\s*\([\d.]+%\)\s*$/, '').trim();
  if(RUNESTONES.has(kl)||RUNESTONES.has(klNoSuffix))
    return{displayName:titleCase(baseKey),category:'runestone',tier:0,setName:null,rawKey:raw};

  // 5. Spawners — "<mob> spawner" format
  if(kl.endsWith(' spawner')){
    const mob=kl.slice(0,-8).trim();
    if(SPAWNER_MOBS.has(mob))
      return{displayName:titleCase(baseKey),category:'spawner',tier:0,setName:null,rawKey:raw};
    // Unknown mob spawner — still classify as spawner category
    return{displayName:titleCase(baseKey),category:'spawner',tier:0,setName:null,rawKey:raw};
  }

  // 6. Spawn eggs — "<anything> spawn egg"
  if(kl.endsWith(' spawn egg'))
    return{displayName:titleCase(baseKey),category:'spawn-egg',tier:0,setName:null,rawKey:raw};

  // 7. Music discs
  if(kl.startsWith('music disc')||kl.startsWith('goat horn'))
    return{displayName:titleCase(baseKey),category:'music-disc',tier:0,setName:null,rawKey:raw};

  // 8. Resources — exact match
  if(RESOURCES.has(kl))
    return{displayName:titleCase(baseKey),category:'resource',tier:0,setName:null,rawKey:raw};

  // 9. Utility — exact match
  if(UTILITY.has(kl))
    return{displayName:titleCase(baseKey),category:'utility',tier:0,setName:null,rawKey:raw};

  // 10. Fallback
  return{displayName:titleCase(baseKey),category:'misc',tier:0,setName:null,rawKey:raw};
}

function enrich(rows){
  return (rows||[]).map(r=>{
    const parsed=parseKey(r.key);
    const dn=String(parsed.displayName||'');
    const rk=String(parsed.rawKey||'');
    // Precompute lowercase search fields once (faster filtering/suggestions).
    const dnLc=dn.toLowerCase();
    const rkLc=rk.toLowerCase();
    return {
      ...r,
      ...parsed,
      _dn_lc: dnLc,
      _rk_lc: rkLc,
      _search: (dnLc + ' ' + rkLc),
    };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Status
// ─────────────────────────────────────────────────────────────────────────────
function setSt(state,txt){$('sdot').className='dot '+state;$('stxt').textContent=txt}
function toast(msg,err){
  const t=$('toast');t.textContent=msg;t.className='on'+(err?' err':'');
  clearTimeout(toast._t);toast._t=setTimeout(()=>t.className='',3500);
}

// ─────────────────────────────────────────────────────────────────────────────
// Fetch helpers
// ─────────────────────────────────────────────────────────────────────────────
const HEADERS={'apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY};

async function sbGet(table,params=''){
  const r=await fetch(`${SB_URL}/rest/v1/${table}${params}`,{headers:HEADERS});
  if(!r.ok)throw new Error(`HTTP ${r.status} on ${table}`);
  return r.json();
}

// ─────────────────────────────────────────────────────────────────────────────
// Prismatic tier cache (localStorage)
// ─────────────────────────────────────────────────────────────────────────────
const PRISM_CACHE_KEY='castia_prismatic_tiers_v1';
const PRISM_CACHE_TTL=60*60*1000; // 1 hour

function _lsReadJson(key){
  try{
    const raw=localStorage.getItem(key);
    if(!raw)return null;
    return JSON.parse(raw);
  }catch(_e){return null;}
}
function _lsWriteJson(key,val){
  try{localStorage.setItem(key, JSON.stringify(val));}catch(_e){}
}
function _readPrismaticCache(){
  const c=_lsReadJson(PRISM_CACHE_KEY);
  if(!c||!c.ts||!c.byBase)return null;
  if(Date.now()-c.ts>PRISM_CACHE_TTL)return null;
  return c;
}
function _writePrismaticCache(byBase){
  if(!byBase||typeof byBase!=='object')return;
  _lsWriteJson(PRISM_CACHE_KEY,{ts:Date.now(),byBase});
}
function _hasPrismaticBaseRows(){
  return enriched.some(r=>r.setName==='Prismatic' && r.tier===0);
}
function _idle(fn){
  if('requestIdleCallback' in window)window.requestIdleCallback(fn,{timeout:1500});
  else setTimeout(fn,250);
}
function applyPrismaticTierCache(){
  const c=_readPrismaticCache();
  if(!c)return false;
  const byBase=c.byBase||{};

  const byKey={};
  for(const r of allPrices)byKey[r.key]=r;

  let applied=false;
  const newRows=[];
  for(const r of enriched){
    if(r.setName==='Prismatic' && r.tier===0){
      const tierRows=byBase[r.rawKey];
      if(Array.isArray(tierRows) && tierRows.length){
        tierRows.forEach(tr=>newRows.push(tr));
        applied=true;
        continue;
      }
    }
    newRows.push(byKey[r.rawKey]||byKey[r.key]||{key:r.rawKey,median:r.median,samples:r.samples,confidence:r.confidence,iqr_low:r.iqr_low,iqr_high:r.iqr_high,trend:r.trend,last_seen:r.last_seen});
  }

  if(!applied)return false;
  allPrices=newRows;
  enriched=enrich(allPrices);
  maxSamples=Math.max(1,...enriched.map(r=>r.samples||0));
  prismaticTiersReady=true;
  return true;
}

async function fetchAll(silent){
  if(!silent){
    bootShow('Loading market data…');
    setSt('loading','Loading...');
    showSkel();
  }
  $('rBtn').classList.add('spinning');
  try{
    // Reset derived state (built from auctions)
    prismaticTiersReady=false;
    prismaticTiersPromise=null;

    // Fetch price_data (paginated) and seller_data in parallel
    let priceRows=[],off=0;
    while(true){
      const batch=await sbGet('price_data',
        `?select=key,median,samples,confidence,iqr_low,iqr_high,trend,last_seen&limit=1000&offset=${off}&order=median.desc`);
      priceRows=priceRows.concat(batch);
      if(batch.length<1000)break;
      off+=1000;
    }

    let sellerRows=[];
    try{
      sellerRows=await sbGet('seller_data',
        '?select=seller,total_listings,valid_listings,avg_markup_percent,overpriced_ratio,accuracy_label,is_blacklisted,is_flagged');
    }catch(_e){
      // Backwards-compatible if is_flagged doesn't exist
      sellerRows=await sbGet('seller_data',
        '?select=seller,total_listings,valid_listings,avg_markup_percent,overpriced_ratio,accuracy_label,is_blacklisted');
    }

    allPrices=priceRows;
    enriched=enrich(allPrices);

    // Apply cached Prismatic tier rows (makes stars/search instant on repeat visits).
    const cacheApplied=applyPrismaticTierCache();
    // Ensure maxSamples is correct regardless of cache usage.
    maxSamples=Math.max(1,...enriched.map(r=>r.samples||0));

    // Index sellers by lowercase name
    allSellers={};
    for(const s of sellerRows){
      if(s.seller)allSellers[s.seller.toLowerCase()]=s;
    }

    lastLoaded=new Date();
    buildCatFilter();
    updateStats();
    applyFilters();

    // Prismatic tiers:
    // - if we have a cache, refresh them in the background (quietly)
    // - if we don't, and this is a visible (non-silent) load, block behind the
    //   preloader so users don't see names changing a few seconds later.
    const needsPrismatic=_hasPrismaticBaseRows();
    const shouldBlockForPrismatic=(!silent && needsPrismatic && !cacheApplied);
    if(shouldBlockForPrismatic){
      bootMsg('Loading Prismatic tiers…');
      await ensurePrismaticTiers({force:true,silentToast:true});
    }else if(needsPrismatic){
      _idle(()=>ensurePrismaticTiers({force:true,silentToast:true}).catch(()=>{}));
    }

    setSt('live',allPrices.length.toLocaleString()+' items');
    $('rlsb').style.display='none';
    if(!silent)toast('Loaded '+allPrices.length.toLocaleString()+' items');
  }catch(e){
    setSt('error','Error');
    toast('Failed: '+e.message,true);
    if(!allPrices.length){showErr(e.message);$('rlsb').style.display='block'}
  }finally{
    $('rBtn').classList.remove('spinning');
    if(!silent)bootHide();
  }
}
function manualRefresh(){fetchAll(false)}

// ─────────────────────────────────────────────────────────────────────────────
// Prismatic tier splitting (client-side, from auctions.tier)
// ─────────────────────────────────────────────────────────────────────────────
let prismaticTiersReady=false;
let prismaticTiersPromise=null;
async function ensurePrismaticTiers(opts={}){
  const force=!!opts.force;
  if(prismaticTiersReady && !force)return;
  if(prismaticTiersPromise)return prismaticTiersPromise;
  prismaticTiersPromise=buildPrismaticTiers(opts).finally(()=>{
    prismaticTiersReady=true;
    prismaticTiersPromise=null;
  });
  return prismaticTiersPromise;
}

async function buildPrismaticTiers(opts={}){
  // Only split if we still have unsuffixed Prismatic base rows
  const base=enriched.filter(r=>r.setName==='Prismatic'&&r.tier===0);
  if(!base.length)return;
  const silentToast=!!opts.silentToast;
  if(!silentToast)toast('Loading Prismatic tiers…');

  // Map original price rows by key so we can keep non-Prismatic rows intact
  const byKey={};
  for(const r of allPrices)byKey[r.key]=r;

  // Fetch tiers with limited concurrency.
  const tierRowsByBase={}; // base rawKey -> [price_data-like rows]
  const LIMIT=4;
  let i=0;
  const workers=Array.from({length:LIMIT},async()=>{
    while(i<base.length){
      const idx=i++;
      const r=base[idx];
      const baseName=r.displayName; // e.g. "Prismatic Pickaxe"
      try{
        // One request per base item (instead of 3) using PostgREST `in` filter.
        const rows=await sbGet('auctions',
          `?select=seller,unit_price,price,count,timestamp,tier,item_name,set_name`+
          `&set_name=eq.Prismatic`+
          `&item_name=ilike.${encodeURIComponent(baseName)}`+
          `&tier=in.(1,2,3)`+
          `&order=timestamp.desc&limit=1500`);
        const cleanAll=rows.filter(l=>!isBadSeller(l.seller));
        const grouped={1:[],2:[],3:[]};
        for(const l of cleanAll){
          const t=parseInt(l.tier,10);
          if(t===1||t===2||t===3)grouped[t].push(l);
        }
        const out=[];
        for(const t of [1,2,3]){
          const list=grouped[t]||[];
          const st=statsFromListings(list);
          if(!st.n)continue;
          out.push({
            key:`${r.rawKey}|t${t}`,
            median:st.median,
            samples:st.n,
            confidence:confidenceFromSamples(st.n),
            iqr_low:st.q1,
            iqr_high:st.q3,
            trend:trendFromListings(list),
            last_seen:list[0]?.timestamp||null,
          });
        }
        if(out.length)tierRowsByBase[r.rawKey]=out;
      }catch(e){
        console.warn('Tier fetch failed:', e.message);
      }
    }
  });
  await Promise.all(workers);

  const newRows=[];
  for(const r of enriched){
    // Replace Prismatic base row with computed tier rows
    if(r.setName==='Prismatic'&&r.tier===0){
      const tierRows=tierRowsByBase[r.rawKey]||[];
      if(tierRows.length){
        tierRows.forEach(tr=>newRows.push(tr));
      }else{
        // Fall back to the original unsplit row if we couldn't compute anything
        newRows.push(byKey[r.rawKey]||byKey[r.key]||{key:r.rawKey,median:r.median,samples:r.samples,confidence:r.confidence,iqr_low:r.iqr_low,iqr_high:r.iqr_high,trend:r.trend,last_seen:r.last_seen});
      }
      continue;
    }
    // Keep all other rows
    newRows.push(byKey[r.rawKey]||byKey[r.key]||{key:r.rawKey,median:r.median,samples:r.samples,confidence:r.confidence,iqr_low:r.iqr_low,iqr_high:r.iqr_high,trend:r.trend,last_seen:r.last_seen});
  }

  allPrices=newRows;
  enriched=enrich(allPrices);
  maxSamples=Math.max(1,...enriched.map(r=>r.samples||0));
  buildCatFilter();
  updateStats();
  applyFilters();
  if(Object.keys(tierRowsByBase).length)_writePrismaticCache(tierRowsByBase);
  if(!silentToast)toast('Prismatic tiers ready');
}

// ─────────────────────────────────────────────────────────────────────────────
// Fetch recent listings for an item from auctions table
// ─────────────────────────────────────────────────────────────────────────────
async function fetchListings(itemKey){
  const tierMatch=itemKey.match(/\|t([123])$/i);
  const tier=tierMatch?parseInt(tierMatch[1]):null;
  const baseName=itemKey.replace(/\|t[123]$/i,'').trim();
  try{
    const tierFilter=tier?`&tier=eq.${tier}`:'';
    const prismaticFilter=tier?`&set_name=eq.Prismatic`:''; // tiered rows are only used for Prismatics
    const rows=await sbGet('auctions',
      `?select=seller,price,count,unit_price,timestamp,set_name,item_name`+
      `&item_name=ilike.${encodeURIComponent(baseName)}`+
      `${prismaticFilter}${tierFilter}`+
      `&order=timestamp.desc&limit=25`);
    return rows;
  }catch(e){
    console.warn('Could not fetch listings:',e.message);
    return[];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Category filter
// ─────────────────────────────────────────────────────────────────────────────
function buildCatFilter(){
  const cats=[...new Set(enriched.map(r=>r.category))].sort((a,b)=>{
    const ca=enriched.filter(r=>r.category===a).length;
    const cb=enriched.filter(r=>r.category===b).length;
    return cb-ca;
  });
  catEl.innerHTML='<option value="">All categories</option>';
  cats.forEach(c=>{
    const o=document.createElement('option');
    o.value=c;o.textContent=`${CAT_LABELS[c]||c} (${enriched.filter(r=>r.category===c).length})`;
    catEl.appendChild(o);
  });
  $('sCat').textContent=cats.length;
  refreshCSelect('catEl');
}

// ─────────────────────────────────────────────────────────────────────────────
// Stats bar
// ─────────────────────────────────────────────────────────────────────────────
function updateStats(){
  $('sTot').textContent=allPrices.length.toLocaleString();
  const maxR=enriched.reduce((a,b)=>(b.median||0)>(a.median||0)?b:a,{median:0});
  const avg=enriched.length?Math.round(enriched.reduce((s,r)=>s+(r.median||0),0)/enriched.length):0;
  $('sMax').textContent=fmt(maxR.median);
  $('sMaxN').textContent=maxR.displayName?(maxR.displayName.length>22?maxR.displayName.slice(0,20)+'…':maxR.displayName):'';
  $('sAvg').textContent=fmt(avg);
  $('sUpd').textContent=fmtT(lastLoaded);
}

// ─────────────────────────────────────────────────────────────────────────────
// Filter + sort
// ─────────────────────────────────────────────────────────────────────────────
function applyFilters(){
  pg=1;
  const q=qEl.value.trim().toLowerCase();
  const cat=catEl.value, conf=confEl.value, tier=tierEl.value;
  filtered=enriched.filter(r=>{
    if(q && !(r._search||'').includes(q))return false;
    if(cat&&r.category!==cat)return false;
    if(conf&&r.confidence!==conf)return false;
    if(tier!==''){
      if(tier==='0'&&r.tier!==0)return false;
      if(tier!=='0'&&r.tier!==parseInt(tier))return false;
    }
    return true;
  });
  filtered.sort((a,b)=>{
    let av=a[sc],bv=b[sc];
    if(sc==='confidence'){av=CONF_ORDER[av]??5;bv=CONF_ORDER[bv]??5}
    else if(typeof av==='string'){av=av.toLowerCase();bv=(bv||'').toLowerCase()}
    av=av??(sd==='asc'?Infinity:-Infinity);
    bv=bv??(sd==='asc'?Infinity:-Infinity);
    return sd==='asc'?(av>bv?1:av<bv?-1:0):(av<bv?1:av>bv?-1:0);
  });
  updateChips();render();
}

// ─────────────────────────────────────────────────────────────────────────────
// Search suggestions (typeahead)
// ─────────────────────────────────────────────────────────────────────────────
let suggItems=[], suggIndex=-1;
function hideSugg(){suggEl.classList.remove('on');suggEl.innerHTML='';suggItems=[];suggIndex=-1}
function showSugg(items){
  suggItems=items||[];
  suggIndex=-1;
  if(!suggItems.length){hideSugg();return}
  suggEl.innerHTML=suggItems.map((it,i)=>
    `<button type="button" data-i="${i}"><span class="sname">${esc(it.displayName)}</span><span class="smeta">${esc(it.categoryLabel||'')}</span></button>`
  ).join('');
  suggEl.classList.add('on');
}
function updateSugg(){
  const q=qEl.value.trim().toLowerCase();
  if(!q){hideSugg();return}
  const out=[];
  const seen=new Set();
  for(const r of enriched){
    const dn=r._dn_lc||'';
    const rk=r._rk_lc||'';
    const idx=dn.indexOf(q)>=0?dn.indexOf(q):rk.indexOf(q);
    if(idx<0)continue;
    if(seen.has(r.rawKey))continue;
    seen.add(r.rawKey);
    out.push({
      rawKey:r.rawKey,
      displayName:r.displayName,
      idx,
      starts:dn.startsWith(q),
      categoryLabel:CAT_LABELS[r.category]||r.category,
      median:r.median||0,
    });
    if(out.length>=30)break;
  }
  out.sort((a,b)=>{
    if(a.starts!==b.starts)return a.starts?-1:1;
    if(a.idx!==b.idx)return a.idx-b.idx;
    return (b.median||0)-(a.median||0);
  });
  showSugg(out.slice(0,10));
}
function setSuggIndex(i){
  suggIndex=i;
  const btns=[...suggEl.querySelectorAll('button[data-i]')];
  btns.forEach(b=>b.classList.remove('on'));
  const btn=btns.find(b=>parseInt(b.dataset.i)===suggIndex);
  if(btn){btn.classList.add('on');btn.scrollIntoView({block:'nearest'})}
}
function applySugg(i){
  const it=suggItems[i];
  if(!it)return false;
  qEl.value=it.displayName;
  $('xBtn').classList.toggle('on',qEl.value.length>0);
  hideSugg();
  applyFilters();
  qEl.focus();
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// Chips
// ─────────────────────────────────────────────────────────────────────────────
function updateChips(){
  const el=$('chips');el.innerHTML='';
  const q=qEl.value.trim(),cat=catEl.value,conf=confEl.value,tier=tierEl.value;
  if(q)addChip('search: '+q,()=>{qEl.value='';$('xBtn').classList.remove('on');applyFilters()});
  if(cat)addChip(CAT_LABELS[cat]||cat,()=>{catEl.value='';applyFilters()});
  if(conf)addChip('conf: '+conf,()=>{confEl.value='';applyFilters()});
  if(tier==='0')addChip('no tier',()=>{tierEl.value='';applyFilters()});
  else if(tier)addChip('tier '+tier,()=>{tierEl.value='';applyFilters()});
}
function addChip(label,fn){
  const d=document.createElement('div');d.className='chip';
  d.innerHTML=`${esc(label)}<button class="chipx" title="Remove">×</button>`;
  d.querySelector('.chipx').addEventListener('click',fn);
  $('chips').appendChild(d);
}

// ─────────────────────────────────────────────────────────────────────────────
// Render
// ─────────────────────────────────────────────────────────────────────────────
function render(){
  const tot=filtered.length,pages=Math.max(1,Math.ceil(tot/PAGE));
  if(pg>pages)pg=pages;
  const hasF=qEl.value.trim()||catEl.value||confEl.value||(tierEl.value!=='');
  $('ri').textContent=hasF?`${tot.toLocaleString()} of ${allPrices.length.toLocaleString()} items`:`${tot.toLocaleString()} items`;
  if(!tot){showEmpty(hasF);renderPag(0);return}
  const slice=filtered.slice((pg-1)*PAGE,pg*PAGE);
  vw==='table'?renderTbl(slice):renderCards(slice);
  renderPag(pages);
  if(lastLoaded)$('sUpd').textContent=fmtT(lastLoaded);
}

function adaptiveRange(r){
  // Returns {low, high} blended between IQR and credibility interval
  const n=r.samples||0, median=r.median||0;
  const blend=Math.min(1,n/50);
  const credWidth=median*(0.30-0.15*(Math.min(n,10)/10));
  return{
    low :Math.round((r.iqr_low ||0)*blend+(Math.max(0,median-credWidth))*(1-blend)),
    high:Math.round((r.iqr_high||median)*blend+(median+credWidth)*(1-blend))
  };
}

function renderTbl(rows){
  tbody.innerHTML=rows.map(r=>{
    const isActive=r.rawKey===activeKey;
    const ar=adaptiveRange(r);
    return`<tr data-key="${esc(r.rawKey)}" class="${isActive?'active-row':''}">
      <td class="item-col"><span class="iname-wrap" title="${esc(r.rawKey)}"><span class="iname-txt">${esc(r.displayName)}</span>${skillTagH(r.skillTag)}</span></td>
      <td class="hsm hpanel">${catBadge(r.category)}${r.tier?'&nbsp;'+tierBadge(r.tier):''}</td>
      <td><div class="price-main">${fmt(r.median)}</div><div class="price-range hmd">${fmt(ar.low)} — ${fmt(ar.high)}</div></td>
      <td class="hmd hpanel"><span class="price-range">${fmt(ar.low)} — ${fmt(ar.high)}</span></td>
      <td class="hsm hpanel"><span class="conf-b ${confCls(r.confidence)}">■ ${r.confidence||'—'}</span></td>
      <td class="hmd hpanel">${trendH(r.trend)}</td>
      <td>${sampH(r.samples)}</td>
    </tr>`;
  }).join('');
}

function imageSlugFromRawKey(rawKey){
  const k=String(rawKey||'')
    .replace(/\|t[123]$/i,'')
    .replace(/\s*\[[^\]]+\]\s*$/,'') // strip trailing [skill]
    .trim()
    .toLowerCase();
  return k
    .replace(/&/g,'and')
    .replace(/['"]/g,'')
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/^-+|-+$/g,'')
    .slice(0,120) || 'unknown';
}

function slugifyText(txt){
  const s=String(txt||'').trim().toLowerCase();
  return s
    .replace(/&/g,'and')
    .replace(/['"]/g,'')
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/^-+|-+$/g,'')
    .slice(0,80) || 'unknown';
}

function imagePathsForRow(r){
  // GitHub Pages-friendly relative paths.
  // Preferred structure:
  //   assets/images/items/<category>/<slug>.png
  //   assets/images/items/set-gear/<set>/<slug>.png   (if setName exists)
  // Legacy fallback (still supported):
  //   assets/images/items/<slug>.png
  if(!r || r.category==='misc')return [];
  const base='./assets/images/items';
  const slug=imageSlugFromRawKey(r.rawKey);
  const cat=String(r.category||'misc');
  const paths=[];

  if(cat==='set-gear' && r.setName){
    const setSlug=slugifyText(r.setName);
    paths.push(`${base}/set-gear/${setSlug}/${slug}.png`);
  }

  // Category-based path (works for non-set items as well)
  paths.push(`${base}/${cat}/${slug}.png`);

  // Legacy flat folder support
  paths.push(`${base}/${slug}.png`);

  // Deduplicate while preserving order
  return [...new Set(paths)];
}

function imgFallback(imgEl){
  try{
    const list=(imgEl.dataset.fallbacks||'').split('|').filter(Boolean);
    const idx=parseInt(imgEl.dataset.fallbackIndex||'0',10);
    if(idx>=list.length){
      imgEl.onerror=null;
      imgEl.src='./assets/images/items/_placeholder.svg';
      return;
    }
    imgEl.dataset.fallbackIndex=String(idx+1);
    imgEl.src=list[idx];
  }catch(_e){
    imgEl.onerror=null;
    imgEl.src='./assets/images/items/_placeholder.svg';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Image loading (true lazy loading with IntersectionObserver)
// ─────────────────────────────────────────────────────────────────────────────
let _lazyImgObserver=null;
let _lazyQueue=[];
let _lazyTicking=false;

function _ensureLazyObserver(){
  if(_lazyImgObserver)return _lazyImgObserver;
  if(!('IntersectionObserver' in window))return null;

  _lazyImgObserver=new IntersectionObserver((entries)=>{
    // Batch loads to avoid suddenly firing 50+ image requests at once.
    for(const e of entries){
      if(!e.isIntersecting)continue;
      const img=e.target;
      _lazyImgObserver.unobserve(img);
      if(img.dataset.loaded==='1')continue;
      _lazyQueue.push(img);
    }
    _lazyPumpQueue();
  },{
    root:null,
    // Preload before the image is visible.
    rootMargin:'250px 0px',
    threshold:0.01,
  });

  return _lazyImgObserver;
}

function _lazyPumpQueue(){
  if(_lazyTicking)return;
  _lazyTicking=true;
  requestAnimationFrame(()=>{
    _lazyTicking=false;
    const MAX_PER_FRAME=10;
    const batch=_lazyQueue.splice(0,MAX_PER_FRAME);
    // Promote the first few images being brought on-screen.
    let hi=0;
    for(const img of batch){
      const priority=(hi<3)?'high':'low';
      if(hi<3)hi++;
      _loadLazyImg(img, priority);
    }
    if(_lazyQueue.length)_lazyPumpQueue();
  });
}

function _loadLazyImg(img, priority='low'){
  if(!img||img.dataset.loaded==='1')return;
  const src=img.dataset.src;
  if(!src)return;
  img.dataset.loaded='1';
  try{img.setAttribute('fetchpriority', priority);}catch(_e){}
  img.decoding='async';
  img.src=src;
}

function observeLazyImages(rootEl){
  const obs=_ensureLazyObserver();
  if(!rootEl)return;

  // Fallback: no IO support -> load immediately.
  if(!obs){
    rootEl.querySelectorAll('img[data-src]').forEach(img=>_loadLazyImg(img,'low'));
    return;
  }
  rootEl.querySelectorAll('img[data-src]').forEach(img=>{
    if(img.dataset.loaded==='1')return;
    obs.observe(img);
  });
}

function imageHTMLForRow(r, cls='', opts={}){
  const paths=imagePathsForRow(r);
  if(!paths.length)return '';

  const eager=!!opts.eager;
  const priority=opts.fetchPriority||'low';

  const first=paths[0];
  const rest=paths.slice(1);
  const fb=[...rest,'./assets/images/items/_placeholder.svg'].join('|');

  if(eager){
    return `<img loading="eager" fetchpriority="${esc(priority)}" decoding="async" class="${cls}" src="${esc(first)}" data-fallbacks="${esc(fb)}" data-fallback-index="0" alt="" onerror="imgFallback(this)" />`;
  }

  // True lazy: keep a placeholder in `src` so no network request is started until we
  // decide to set `src` (via IntersectionObserver).
  return `<img loading="lazy" fetchpriority="${esc(priority)}" decoding="async" class="${cls} lazy-img" src="./assets/images/items/_placeholder.svg" data-src="${esc(first)}" data-fallbacks="${esc(fb)}" data-fallback-index="0" data-loaded="0" alt="" onerror="imgFallback(this)" />`;
}

function noteKeyFromRawKey(rawKey){
  return String(rawKey||'')
    .trim()
    .replace(/\s+/g,' ')
    .toLowerCase();
}

function getCardNoteForRow(r){
  const notes=window.CARD_NOTES||{};
  const raw=String(r?.rawKey||'').trim();
  if(!raw)return null;

  // 1) Tier-specific note: e.g. "prismatic shovel|t1"
  const keyTier=noteKeyFromRawKey(raw);
  if(notes[keyTier])return notes[keyTier];

  // 2) Fallback without tier suffix: e.g. "prismatic shovel"
  const keyBase=keyTier.replace(/\|t[123]$/i,'');
  return notes[keyBase]||null;
}

function cardExtraH(r){
  if(!r)return'';
  // Only show extras for set gear or unique relics (never Misc)
  if(r.category!=='set-gear' && r.category!=='unique-relic')return'';
  const nk=noteKeyFromRawKey(r.rawKey);
  const note=getCardNoteForRow(r);
  if(!note || !note.lines?.length)return'';

  const lines=note.lines.map(line=>{
    const s=String(line||'');
    if(s.trim().startsWith('■')){
      const rest=s.replace(/^■\s*/,'');
      return `<div class="cline"><span class="cdiamond" aria-hidden="true"></span><span>${esc(rest)}</span></div>`;
    }
    return `<div class="cline"><span class="cdot" aria-hidden="true"></span><span>${esc(s)}</span></div>`;
  }).join('');

  return `<div class="csub">${lines}</div>`;
}

function panelMetaHTML(r){
  if(!r)return'';
  const note=getCardNoteForRow(r);
  const imgPaths=imagePathsForRow(r);
  const hasImg=imgPaths.length>0;
  const hasNote=!!(note && note.lines && note.lines.length);
  if(!hasImg && !hasNote)return'';

  // If we only have one side, render it full-width to avoid awkward empty space.
  const cols=(hasImg && hasNote)?'pm-two':(hasImg?'pm-only-img':'pm-only-note');

  const img=hasImg
    ? `<div class="pm-img">${imageHTMLForRow(r,'',{eager:true,fetchPriority:'high'})}</div>`
    : '';

  const lines=hasNote
    ? note.lines.map(line=>{
        const s=String(line||'');
        if(s.trim().startsWith('■')){
          const rest=s.replace(/^■\s*/,'');
          return `<div class="pm-line"><span class="pm-b">■</span><span>${esc(rest)}</span></div>`;
        }
        return `<div class="pm-line"><span class="pm-dot" aria-hidden="true"></span><span>${esc(s)}</span></div>`;
      }).join('')
    : '';
  const centerCls=(note && note.lines && note.lines.length<=4)?' pm-center':'';
  const noteHtml=hasNote?`<div class="pm-note${centerCls}"><div class="pm-note-inner">${lines}</div></div>`:'';

  return `<div class="pmeta ${cols}">${img}${noteHtml}</div>`;
}

function renderCards(rows){
  cgrid.innerHTML=rows.map(r=>{
    const isActive=r.rawKey===activeKey;
    const ar=adaptiveRange(r);
    const img=imagePathsForRow(r).length?`<div class="cimgwrap">${imageHTMLForRow(r,'')}</div>`:'';
    return`<div class="pcard ${isActive?'active-card':''}" data-key="${esc(r.rawKey)}">
      ${img}
      <div class="ckey" title="${esc(r.rawKey)}"><span class="iname-wrap"><span class="iname-txt">${esc(r.displayName)}</span>${skillTagH(r.skillTag)}</span></div>
      ${cardExtraH(r)}
      <div class="cprice">${fmt(r.median)}</div>
      <div class="crange">${fmt(ar.low)} — ${fmt(ar.high)}</div>
      <div class="cfoot">${catBadge(r.category)}${r.tier?tierBadge(r.tier):''}
        <span class="conf-b ${confCls(r.confidence)}">■ ${r.confidence||'—'}</span>
        ${trendH(r.trend)}</div>
    </div>`;
  }).join('');
  observeLazyImages(cgrid);
}

function catBadge(cat){return`<span class="cb cat-${cat}">${CAT_LABELS[cat]||cat}</span>`}
function skillTagH(tag){
  if(!tag||!tag.cls||!tag.text)return'';
  return`<span class="stag ${tag.cls}">${esc(tag.text)}</span>`;
}
function tierBadge(tier){return`<span class="tier-badge tier-${tier}">T${tier} ${tierStars(tier)}</span>`}
function confCls(c){return{high:'ch',good:'cg',fair:'cf',low:'cl',unreliable:'cu'}[c]||'cl'}
function trendH(t){
  if(t==='up')return'<span class="trend tu">↑ rising</span>';
  if(t==='down')return'<span class="trend td">↓ falling</span>';
  return'<span class="trend ts">→ stable</span>';
}
function sampH(n){
  const pct=maxSamples>0?Math.min(100,Math.round(((n||0)/maxSamples)*100)):0;
  return`<div class="swrap"><div class="sbg"><div class="sfill" style="width:${pct}%"></div></div><span class="snum">${n!=null?n.toLocaleString():'—'}</span></div>`;
}

function showEmpty(hasF){
  const msg=hasF?'No items match your filters':'No data loaded';
  const sub=hasF?`<div class="esub"><button onclick="clearAll()" style="background:none;border:none;color:var(--gold);cursor:pointer;font-family:inherit;font-size:12px;text-decoration:underline">Clear all filters</button></div>`:'';
  const inner=`<div class="estate"><div class="eicon">⊘</div><div class="emsg">${msg}</div>${sub}</div>`;
  if(vw==='table')tbody.innerHTML=`<tr><td colspan="7">${inner}</td></tr>`;
  else cgrid.innerHTML=`<div style="grid-column:1/-1">${inner}</div>`;
}
function showSkel(){
  tbody.innerHTML=Array.from({length:14},()=>`<tr class="skel">
    <td><div class="sbar" style="width:${50+Math.random()*100|0}px"></div></td>
    <td class="hsm hpanel"><div class="sbar" style="width:60px"></div></td>
    <td><div class="sbar" style="width:55px"></div></td>
    <td class="hmd hpanel"><div class="sbar" style="width:90px"></div></td>
    <td class="hsm hpanel"><div class="sbar" style="width:60px"></div></td>
    <td class="hmd hpanel"><div class="sbar" style="width:50px"></div></td>
    <td><div class="sbar" style="width:70px;margin-left:auto"></div></td>
  </tr>`).join('');
}
function showErr(msg){
  tbody.innerHTML=`<tr><td colspan="7"><div class="estate"><div class="eicon" style="color:var(--red)">✕</div><div class="emsg" style="color:var(--red)">Failed to load</div><div class="esub">${esc(msg)}</div></div></td></tr>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Pagination
// ─────────────────────────────────────────────────────────────────────────────
function renderPag(pages){
  $('pmeta').textContent=filtered.length?`Page ${pg} of ${pages} · ${filtered.length.toLocaleString()} results`:'';
  const el=$('pbtns');
  if(pages<=1){el.innerHTML='';return}
  const b=[];
  b.push(`<button class="pb" onclick="goPg(${pg-1})" ${pg===1?'disabled':''}>←</button>`);
  let s=Math.max(1,pg-2),e=Math.min(pages,s+4);
  if(e-s<4)s=Math.max(1,e-4);
  if(s>1){b.push(`<button class="pb" onclick="goPg(1)">1</button>`);if(s>2)b.push(`<span style="padding:0 3px;color:var(--text3);font-size:12px">…</span>`)}
  for(let i=s;i<=e;i++)b.push(`<button class="pb ${i===pg?'on':''}" onclick="goPg(${i})">${i}</button>`);
  if(e<pages){if(e<pages-1)b.push(`<span style="padding:0 3px;color:var(--text3);font-size:12px">…</span>`);b.push(`<button class="pb" onclick="goPg(${pages})">${pages}</button>`)}
  b.push(`<button class="pb" onclick="goPg(${pg+1})" ${pg===pages?'disabled':''}>→</button>`);
  el.innerHTML=b.join('');
}
function goPg(n){pg=n;render();window.scrollTo({top:0,behavior:'smooth'})}

// ─────────────────────────────────────────────────────────────────────────────
// Sort
// ─────────────────────────────────────────────────────────────────────────────
function setSort(col){
  if(sc===col)sd=sd==='asc'?'desc':'asc';
  else{sc=col;sd=(col==='median'||col==='samples')?'desc':'asc'}
  updateSortUI();applyFilters();
}
function flipDir(){sd=sd==='asc'?'desc':'asc';updateSortUI();applyFilters()}
function updateSortUI(){
  ['displayName','median','confidence','trend','samples'].forEach(c=>{
    const th=$('th-'+c),ar=$('ar-'+c);
    if(th)th.classList.toggle('on',c===sc);
    if(ar)ar.textContent=c===sc?(sd==='asc'?'↑':'↓'):'';
  });
  ['median','samples','displayName','confidence'].forEach(c=>{
    const p=$('sp-'+c);if(p)p.classList.toggle('on',c===sc);
  });
  $('sp-dir').textContent=sd==='asc'?'↑':'↓';
}

// ─────────────────────────────────────────────────────────────────────────────
// View toggle
// ─────────────────────────────────────────────────────────────────────────────
function setView(v){
  vw=v;
  $('tvw').style.display=v==='table'?'':'none';
  $('cvw').style.display=v==='card'?'':'none';
  $('vt').classList.toggle('on',v==='table');
  $('vc').classList.toggle('on',v==='card');
  render();
}

// ─────────────────────────────────────────────────────────────────────────────
// Clear
// ─────────────────────────────────────────────────────────────────────────────
function clearQ(){qEl.value='';$('xBtn').classList.remove('on');hideSugg();applyFilters();qEl.focus()}
function clearAll(){qEl.value='';catEl.value='';confEl.value='';tierEl.value='';$('xBtn').classList.remove('on');applyFilters()}

// ─────────────────────────────────────────────────────────────────────────────
// Detail Panel
// ─────────────────────────────────────────────────────────────────────────────
function setPanelSort(v){panelSort=v;renderPanelFromCtx({partial:true});}
function setPanelIncludeFlagged(v){panelIncludeFlagged=!!v;renderPanelFromCtx({partial:true});}
function togglePanelSortSel(){
  const el=$('panelSortSel');
  if(!el)return;
  const isOpen=el.classList.contains('open');
  closeAllCSelects(isOpen?null:'panelSortSel');
  el.classList.toggle('open',!isOpen);
}

let _panelAnimToken=0;
async function panelSwapAnimate(mutator){
  const hdr=panel?.querySelector('.panel-header');
  const body=$('panel-body');
  const els=[hdr, body].filter(Boolean);

  // Cancel any previous animations to prevent "glitchy" stacking.
  for(const el of els){
    try{el.getAnimations().forEach(a=>a.cancel());}catch(_e){}
  }

  const token=++_panelAnimToken;
  const out=els.map(el=>el.animate(
    [{opacity:1, transform:'translateY(0)'},{opacity:0, transform:'translateY(6px)'}],
    {duration:90, easing:'ease-out'}
  ));
  await Promise.all(out.map(a=>a.finished.catch(()=>{})));
  if(token!==_panelAnimToken)return;

  mutator();

  const inn=els.map(el=>el.animate(
    [{opacity:0, transform:'translateY(6px)'},{opacity:1, transform:'translateY(0)'}],
    {duration:140, easing:'cubic-bezier(.2,.8,.2,1)'}
  ));
  await Promise.all(inn.map(a=>a.finished.catch(()=>{})));
}

async function openPanel(key){
  const wasOpen=panel.classList.contains('open');
  if(activeKey===key && wasOpen){closePanel();return}
  activeKey=key;

  // Mark active row/card
  markActiveSelection();

  // Find enriched data for this key
  const item=enriched.find(r=>r.rawKey===key);
  if(!item){closePanel();return}

  // Show panel (only animate shell on first open)
  panel.classList.add('open');
  panelBackdrop.classList.add('on');
  if(!wasOpen)withCGridFlip(()=>appShell.classList.add('panel-open'));

  const swap=()=>{
    $('panel-title').innerHTML=`${esc(item.displayName)}${skillTagH(item.skillTag)}`;
    panelMeta.innerHTML=panelMetaHTML(item);
    $('panel-body').innerHTML=panelSkeleton();
  };
  if(wasOpen) await panelSwapAnimate(swap);
  else swap();

  // Fetch listings async
  const listingsRaw=await fetchListings(key);
  // If the user clicked a different item while we were loading, abort.
  if(activeKey!==key)return;
  const listingsClean=listingsRaw.filter(l=>!isBadSeller(l.seller));
  const removed=listingsRaw.length-listingsClean.length;
  const st=statsFromListings(listingsClean);

  panelCtx={
    key,
    item,
    listingsRaw,
    listingsClean,
    removed,
    samplesFromListings:st.n||0,
  };
  renderPanelFromCtx({partial:false});
}

function panelSortLabel(){
  return panelSort==='price_asc'?'Price ↑'
    :panelSort==='price_desc'?'Price ↓'
    :panelSort==='seller'?'Seller rating'
    :'Newest';
}

function buildPanelListingsHTML(pd, listings){
  if(!listings.length){
    return `<div class="no-listings">No recent listings found</div>`;
  }
  let html='';
  for(const l of listings){
    const info=sellerRatingInfo(l.seller);
    const cols=SELLER_COLORS[info.label]||SELLER_COLORS.Neutral;
    const sellerBadge=info.label
      ? `<span class="lr-seller-badge" style="background:${cols.bg};color:${cols.color};border-color:${cols.border}">${info.label}</span>`
      : '';
    const blacklistedBadge=info.isBlacklisted
      ? `<span class="lr-seller-badge" style="background:rgba(240,100,100,.1);color:#f06464;border-color:rgba(240,100,100,.25)">Blacklisted</span>`
      : '';

    let priceClass='';
    if(pd.iqr_high && l.unit_price>pd.iqr_high*1.5)priceClass='over';
    else if(pd.iqr_low && l.unit_price<pd.iqr_low*0.7)priceClass='under';

    html+=`<div class="listing-row">
      <div style="min-width:0;flex:1">
        <div style="display:flex;align-items:center;gap:4px;min-width:0;flex-wrap:wrap">
          <span class="lr-seller">${esc(l.seller||'Unknown')}</span>
          ${sellerBadge}
          ${blacklistedBadge}
        </div>
        ${l.count>1?`<div class="lr-count">×${l.count.toLocaleString()}</div>`:''}
      </div>
      <div style="text-align:right;flex-shrink:0">
        <div class="lr-price ${priceClass}">${fmt(l.unit_price)}</div>
        ${l.count>1?`<div class="lr-date">total ${fmt(l.price)}</div>`:''}
        <div class="lr-date">${fmtT(l.timestamp)}</div>
      </div>
    </div>`;
  }
  return html;
}

function buildPanelTopSellersHTML(listings){
  const sellerCounts={};
  for(const l of listings)if(l.seller)sellerCounts[l.seller]=(sellerCounts[l.seller]||0)+1;
  const topSellers=Object.entries(sellerCounts).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([s])=>s);
  if(!topSellers.length)return '';

  let html=`<div class="psec"><div class="psec-title">Sellers of This Item</div>`;
  for(const sellerName of topSellers){
    const sd=allSellers[sellerName.toLowerCase()];
    if(!sd)continue;
    const label=(sd.is_blacklisted||sd.is_flagged)?'Flagged':(sd.accuracy_label||'Neutral');
    const cols=SELLER_COLORS[label]||SELLER_COLORS.Neutral;
    html+=`<div class="seller-rep" style="margin-bottom:8px">
      <div class="sr-name" style="display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap">
        ${esc(sd.seller)}
        <span class="lr-seller-badge" style="background:${cols.bg};color:${cols.color};border-color:${cols.border}">${label}</span>
        ${sd.is_blacklisted?'<span class="lr-seller-badge" style="background:rgba(240,100,100,.1);color:#f06464;border-color:rgba(240,100,100,.25)">Blacklisted</span>':''}
      </div>
      <div class="sr-row"><span class="sr-label">Total Listings</span><span class="sr-value">${sd.total_listings?.toLocaleString()||'—'}</span></div>
      <div class="sr-row"><span class="sr-label">Avg Markup</span><span class="sr-value">${sd.avg_markup_percent!=null?sd.avg_markup_percent.toFixed(1)+'%':'—'}</span></div>
      <div class="sr-row"><span class="sr-label">Overpriced Ratio</span><span class="sr-value" style="${(sd.overpriced_ratio||0)>30?'color:var(--red)':''}">
        ${sd.overpriced_ratio!=null?sd.overpriced_ratio.toFixed(1)+'%':'—'}</span></div>
      <div class="sr-row"><span class="sr-label">Listings for this item</span><span class="sr-value">${sellerCounts[sellerName]||'—'}</span></div>
    </div>`;
  }
  html+=`</div>`;
  return html;
}

function updatePanelControls(){
  const val=$('panelSortVal');
  if(val)val.textContent=panelSortLabel();
  const tog=$('panelFlagTog');
  if(tog)tog.classList.toggle('on',!!panelIncludeFlagged);

  const menu=$('panelSortMenu');
  if(menu){
    menu.querySelectorAll('button[data-sort]').forEach(btn=>{
      btn.classList.toggle('on', btn.dataset.sort===panelSort);
    });
  }
}

function renderPanelFromCtx(opts={}){
  if(!panelCtx)return;
  const {item,listingsRaw,listingsClean,removed,samplesFromListings}=panelCtx;

  const pd={...item};
  const st=statsFromListings(listingsClean);

  // Override price stats using the cleaned recent listings so flagged/blacklisted sellers
  // don't inflate the panel's price range.
  // IMPORTANT: Keep the item's global samples/confidence so the "Range estimated" note
  // doesn't get stuck due to the listings fetch limit.
  if(st.n){
    pd.median=st.median;
    pd.iqr_low=st.q1;
    pd.iqr_high=st.q3;
    pd.trend=trendFromListings(listingsClean);
    pd.last_seen=listingsClean[0]?.timestamp||pd.last_seen;
  }

  const visible=panelIncludeFlagged?[...listingsRaw]:[...listingsClean];
  const sorted=sortPanelListings(visible, pd);

  const body=$('panel-body');
  const preserveScroll=opts.partial && body;
  const scrollTop=preserveScroll?body.scrollTop:0;

  // Partial update: don't rebuild the entire panel (avoids it feeling like a reload).
  if(opts.partial && $('panelListings') && $('panelRemovedNote') && $('panelTopSellers')){
    updatePanelControls();
    const note=$('panelRemovedNote');
    if(note){
      if(removed && !panelIncludeFlagged){
        note.style.display='';
        note.innerHTML=`Filtered out ${removed} listing${removed===1?'':'s'} from flagged/blacklisted sellers`;
      }else{
        note.style.display='none';
        note.innerHTML='';
      }
    }
    $('panelListings').innerHTML=buildPanelListingsHTML(pd,sorted);
    $('panelTopSellers').innerHTML=buildPanelTopSellersHTML(visible);
    if(preserveScroll)body.scrollTop=scrollTop;
    return;
  }

  body.innerHTML=buildPanelHTML(pd,sorted,{removed,samplesFromListings});
  updatePanelControls();
}

function sortPanelListings(listings, pd){
  const out=[...listings].map(l=>({
    ...l,
    unit_price:getUnitPrice(l),
    _ts:l.timestamp?new Date(l.timestamp).getTime():0,
    _rating:sellerRatingInfo(l.seller).order,
  }));
  if(panelSort==='price_asc')out.sort((a,b)=>(a.unit_price||0)-(b.unit_price||0) || (b._ts-a._ts));
  else if(panelSort==='price_desc')out.sort((a,b)=>(b.unit_price||0)-(a.unit_price||0) || (b._ts-a._ts));
  else if(panelSort==='seller')out.sort((a,b)=>(a._rating-b._rating) || (b._ts-a._ts) || ((a.unit_price||0)-(b.unit_price||0)));
  else out.sort((a,b)=>(b._ts-a._ts)); // newest
  return out;
}

function closePanel(){
  panel.classList.remove('open');
  panelBackdrop.classList.remove('on');
  withCGridFlip(()=>appShell.classList.remove('panel-open'));
  activeKey=null;
  panelCtx=null;
  if(panelMeta)panelMeta.innerHTML='';
  markActiveSelection();
}

function panelSkeleton(){
  return`<div class="panel-skel">
    <div class="pskel-block"></div>
    <div class="pskel-line" style="width:60%"></div>
    <div class="pskel-line" style="width:80%"></div>
    <div class="pskel-line" style="width:50%"></div>
  </div>`;
}

function buildPanelHTML(item,listings,meta={}){
  const pd=item;
  const removed=meta.removed||0;
  const samplesFromListings=meta.samplesFromListings||0;

  // ── Adaptive price range ──────────────────────────────────────────────────
  const nTotal=pd.samples||0;
  const n=(nTotal>0)?nTotal:samplesFromListings;
  const median=pd.median||0;
  const rawLow=pd.iqr_low||0;
  const rawHigh=pd.iqr_high||median;

  // Blend factor: 0 = fully credibility-based, 1 = fully IQR-based
  // Reaches ~0.9 at 30 samples, ~1.0 at 50+
  const blend=Math.min(1, n/50);
  // Credibility interval: ±30% of median for n=1, narrows to ±15% at n=10
  const credWidth=median*(0.30 - 0.15*(Math.min(n,10)/10));
  const credLow=Math.max(0, median-credWidth);
  const credHigh=median+credWidth;

  const displayLow =Math.round(rawLow *blend + credLow *(1-blend));
  const displayHigh=Math.round(rawHigh*blend + credHigh*(1-blend));
  const iqrSpan=displayHigh-displayLow;

  // IQR bar positioning within [0, displayHigh * 1.2]
  const rangeMax=displayHigh*1.2||1;
  const lowPct =Math.max(0,Math.min(100,(displayLow /rangeMax)*100));
  const highPct=Math.max(0,Math.min(100,(displayHigh/rangeMax)*100));
  const medPct =Math.max(0,Math.min(100,(median       /rangeMax)*100));
  const fillW  =Math.max(0,highPct-lowPct);

  // Range reliability label shown below the bar
  const rangeNote = n>=30 ? '' :
    n>=10 ? '<div style="font-size:10px;color:var(--text3);font-family:\\\'Space Mono\\\',monospace;margin-top:5px">⚠ Range estimated — fewer than 30 samples</div>' :
    n>=3  ? '<div style="font-size:10px;color:var(--gold2);font-family:\\\'Space Mono\\\',monospace;margin-top:5px">⚠ Low sample count — range is approximate</div>' :
             '<div style="font-size:10px;color:var(--red);font-family:\\\'Space Mono\\\',monospace;margin-top:5px">⚠ Very few samples — treat range as indicative only</div>';

  let html='';

  // ── Price hero ──
  html+=`<div class="price-hero">
    <div class="ph-label">Median Unit Price</div>
    <div class="ph-median">${fmt(median)}</div>
    <div class="iqr-bar-wrap">
      <div class="iqr-bar-bg">
        <div class="iqr-bar-fill" style="left:${lowPct}%;width:${fillW}%"></div>
        <div class="iqr-bar-median" style="left:${medPct}%"></div>
      </div>
      <div class="iqr-labels"><span>${fmt(displayLow)}</span><span>${fmt(displayHigh)}</span></div>
    </div>
    ${rangeNote}
    <div class="ph-range" style="margin-top:.75rem">
      <div class="ph-range-item"><div class="ph-rl">${n>=10?'IQR Low':'Est. Low'}</div><div class="ph-rv">${fmt(displayLow)}</div></div>
      <div class="ph-range-item"><div class="ph-rl">${n>=10?'IQR High':'Est. High'}</div><div class="ph-rv">${fmt(displayHigh)}</div></div>
      <div class="ph-range-item"><div class="ph-rl">Spread</div><div class="ph-rv">${fmt(iqrSpan)}</div></div>
    </div>
  </div>`;

  // ── Meta pills ──
  html+=`<div class="meta-pills">
    <div class="mpill"><span class="mplabel">Confidence</span> <span class="conf-b ${confCls(pd.confidence)}" style="padding:1px 5px">■ ${pd.confidence||'—'}</span></div>
    <div class="mpill"><span class="mplabel">Trend</span> ${trendH(pd.trend)}</div>
    <div class="mpill"><span class="mplabel">Samples</span> ${pd.samples?.toLocaleString()||'—'}</div>
    ${pd.tier?`<div class="mpill"><span class="mplabel">Tier</span> ${tierBadge(pd.tier)}</div>`:''}
    <div class="mpill"><span class="mplabel">Last seen</span> ${fmtT(pd.last_seen)}</div>
  </div>`;

  html+=`<div class="meta-pills">
    ${catBadge(pd.category)}
    ${pd.setName?`<div class="mpill"><span class="mplabel">Set</span> ${esc(pd.setName)}</div>`:''}
  </div>`;

  // ── Recent listings ──
  html+=`<div class="psec"><div class="psec-title">Recent Listings</div>`;

  const psLabel=panelSortLabel();
  html+=`<div class="pctrl">
    <span class="pcl">Sort</span>
    <div class="cselect" id="panelSortSel">
      <button type="button" class="cselect-btn" onclick="togglePanelSortSel()"><span class="cval" id="panelSortVal">${psLabel}</span><span class="car">▾</span></button>
      <div class="cselect-menu" id="panelSortMenu">
        <button type="button" class="copt ${panelSort==='newest'?'on':''}" data-sort="newest" onclick="setPanelSort('newest');closeAllCSelects();">Newest</button>
        <button type="button" class="copt ${panelSort==='price_asc'?'on':''}" data-sort="price_asc" onclick="setPanelSort('price_asc');closeAllCSelects();">Price ↑</button>
        <button type="button" class="copt ${panelSort==='price_desc'?'on':''}" data-sort="price_desc" onclick="setPanelSort('price_desc');closeAllCSelects();">Price ↓</button>
        <button type="button" class="copt ${panelSort==='seller'?'on':''}" data-sort="seller" onclick="setPanelSort('seller');closeAllCSelects();">Seller rating</button>
      </div>
    </div>

    <button type="button" class="ctoggle ${panelIncludeFlagged?'on':''}" id="panelFlagTog" onclick="setPanelIncludeFlagged(!panelIncludeFlagged)">
      <span class="ctog" aria-hidden="true"></span>
      Include flagged
    </button>
  </div>`;

  if(removed && !panelIncludeFlagged){
    html+=`<div id="panelRemovedNote" style="font-size:10px;color:var(--text3);font-family:'Space Mono',monospace;margin:-4px 0 10px">
      Filtered out ${removed} listing${removed===1?'':'s'} from flagged/blacklisted sellers
    </div>`;
  } else {
    html+=`<div id="panelRemovedNote" style="display:none"></div>`;
  }

  html+=`<div id="panelListings">${buildPanelListingsHTML(pd, listings)}</div>`;
  html+=`</div>`;

  // ── Top sellers for this item ──
  html+=`<div id="panelTopSellers">${buildPanelTopSellersHTML(listings)}</div>`;

  return html;
}

// ─────────────────────────────────────────────────────────────────────────────
// Events — event delegation for table rows and cards
// ─────────────────────────────────────────────────────────────────────────────
tbody.addEventListener('click',e=>{
  const tr=e.target.closest('tr[data-key]');
  if(tr)openPanel(tr.dataset.key);
});
cgrid.addEventListener('click',e=>{
  const card=e.target.closest('.pcard[data-key]');
  if(card)openPanel(card.dataset.key);
});

qEl.addEventListener('input',()=>{
  $('xBtn').classList.toggle('on',qEl.value.length>0);
  updateSugg();
  // Keep it feeling instant while still avoiding work on every keystroke.
  clearTimeout(debT);debT=setTimeout(applyFilters,60);
});
qEl.addEventListener('keydown',e=>{
  const open=suggEl.classList.contains('on');
  if(!open)return;
  if(e.key==='ArrowDown'){e.preventDefault();setSuggIndex(Math.min(suggItems.length-1,(suggIndex<0?0:suggIndex+1)));return;}
  if(e.key==='ArrowUp'){e.preventDefault();setSuggIndex(Math.max(0,(suggIndex<0?0:suggIndex-1)));return;}
  if(e.key==='Enter'){if(suggIndex>=0){e.preventDefault();applySugg(suggIndex);}return;}
  if(e.key==='Escape'){e.preventDefault();hideSugg();return;}
});
qEl.addEventListener('blur',()=>setTimeout(hideSugg,150));
suggEl.addEventListener('mousedown',e=>{
  const btn=e.target.closest('button[data-i]');
  if(!btn)return;
  e.preventDefault();
  applySugg(parseInt(btn.dataset.i));
});

catEl.addEventListener('change',applyFilters);
confEl.addEventListener('change',applyFilters);
tierEl.addEventListener('change',async()=>{
  if(tierEl.value && tierEl.value!=='0')await ensurePrismaticTiers();
  applyFilters();
});

// Upgrade native selects to custom themed dropdowns
enhanceSelect(catEl);
enhanceSelect(confEl);
enhanceSelect(tierEl);

document.addEventListener('keydown',e=>{
  const active=document.activeElement;
  const inInput=active===qEl||active.tagName==='INPUT'||active.tagName==='SELECT'||active.tagName==='TEXTAREA';

  // / or T → focus search
  if((e.key==='/'||e.key==='t'||e.key==='T')&&!inInput){
    e.preventDefault();qEl.focus();qEl.select();return;
  }
  // Escape — priority: close panel > blur search > clear search
  if(e.key==='Escape'){
    if(panel.classList.contains('open')){closePanel();return}
    if(document.activeElement===qEl){
      if(suggEl.classList.contains('on')){hideSugg();return;}
      if(qEl.value){clearQ();}
      else{qEl.blur();}
      return;
    }
  }
});

document.addEventListener('click',e=>{
  if(!e.target.closest('.sw'))hideSugg();
});

// Auto-refresh every 5 minutes
const REFRESH_MS=5*60*1000;
let nextRefresh=Date.now()+REFRESH_MS;

function scheduleRefresh(){
  const delay=Math.max(0,nextRefresh-Date.now());
  setTimeout(()=>{
    fetchAll(true);
    nextRefresh=Date.now()+REFRESH_MS;
    scheduleRefresh();
  },delay);
}

// When the tab becomes visible again, check if a refresh is overdue
document.addEventListener('visibilitychange',()=>{
  if(!document.hidden&&Date.now()>=nextRefresh){
    fetchAll(true);
    nextRefresh=Date.now()+REFRESH_MS;
  }
});

fetchAll(false);
scheduleRefresh();
// Keep "last updated" text fresh every 30s
setInterval(()=>{if(lastLoaded)$('sUpd').textContent=fmtT(lastLoaded)},30000);
