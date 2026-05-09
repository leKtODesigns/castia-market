// ─────────────────────────────────────────────────────────────────────────────
// constants.js — all static lookup tables and config
// ─────────────────────────────────────────────────────────────────────────────
const SB_URL = 'https://opxorasggouuzzsvzlvm.supabase.co';
const SB_KEY = 'sb_publishable_PjpxLcSpHeOt2MCgl3fUUw_RUFOAb5w';
const PAGE = 50;

function tierStars(tier) { return (['', '★', '★★', '★★★'][tier] || ''); }

const MITHRIL_SETS = [
  'Springtide','Jolly','Rosewood','Nightfall','Lunar','Silversnow',
  'Prismatic','Pandora','Daydream','Eldritch','Aerondight','Fluorite','Witherbone',
  'Halgrabind','Elven','Erphis','Llanakin','Shoopon','Athanasia','Bogmath',
  'Curtana','Kayran','Malediction','Oceanis','Phezar','Saprophyte','Vurgohk',
  'Azertuan','Hulia','Igru','Oldus','Opulent','Paragon','Requinox',
  'Serpent','Vertigo','Manticore','Mistle','Posh',
];

const GEAR_SUFFIXES = new Set([
  'helmet','chestplate','leggings','boots',
  'sword','axe','pickaxe','shovel','hoe','mace',
  'bow','crossbow','trident','shield','shears',
  'fishing rod','staff','wand','elytra',
]);

const UNIQUE_RELICS_EXACT = new Set(['mistle toes','posh wellies','pet rock','bamboozle']);
const UNIQUE_RELICS_VARIANT = ['christmas cap','knowledge cap'];

const RUNESTONES = new Set([
  "ruby's fire",'end veil','sculk smite','dune walker','decapitation',
  'obby breaker','deepfry','comb cutter','cat eyes','bait',
  'potent poison','mint breath','magma walker','vein miner','treefeller',
  'collection','fire react','solar lure','lunar lure',
]);

const SPAWNER_MOBS = new Set([
  'spider','zombie','skeleton','creeper','witch','blaze','silverfish',
  'pig','rabbit','chicken','cow','sheep','goat','cave spider','iron golem',
]);

const RESOURCES = new Set([
  'mithril core','mithril essence','legendary essence','epic essence',
  'rare essence','common essence','essence fragment','essence fragments',
  'echo shard','end crystal','heavy core','golden apple','enchanted golden apple',
  'beacon','wither skeleton skull','nether star',"bottle o' enchanting",
  'budding amethyst','heart of the sea','netherite scrap','netherite ingot',
  'ominous trial key','trial key','shulker shell','dragon egg','dragon head',
  'totem of undying','nautilus shell','prismarine shard','prismarine crystals',
  'blaze rod','blaze powder','ghast tear','magma cream','slimeball','spider eye',
  'fermented spider eye','rabbit foot','rabbit hide','ancient debris','block of netherite',
  'block of coal','block of raw copper','block of diamond','block of emerald','block of gold',
  'block of iron','block of lapis lazuli','block of raw copper','block of raw gold',
  'block of raw iron','block of redstone','block of copper','ink sac','glow ink sac',
]);

const UTILITY = new Set([
  'elite quest crystal','quest crystal','ore seed','spawner spinner','uranium nugget',
  'tracking oil','block tracking oil','kill tracking oil','fish tracking oil',
  'hostile mystery egg', 'passive mystery egg','glass cutter','begrimed item','historical codex',
  'liquid exp', 'blessing dust','mob catcher','essence','rename kit','repair oil',
  'the grand scrambler','elytra','saddle','lead','name tag','mystic mushroom',
  'mining mushroom','woodcutting mushroom','hunting mushroom','farming mushroom',
  'fishing mushroom','smelting mushroom','arcane mushroom','netherite upgrade','mace',
  'sentry armor trim','vex armor trim','wild armor trim','coast armor trim','dune armor trim',
  'wayfinder armor trim', 'raiser armor trim','shaper armor trim','host armor trim',
  'ward armor trim','silence armor trim','tide armor trim', 'snout armor trim','rib armor trim',
  'eye armor trim','spire armor trim','flow armor trim','bolt armor trim','dried ghast',
  'coal ore seed','copper ore seed','iron ore seed','gold ore seed','lapis ore seed',
  'redstone ore seed','diamond ore seed','emerald ore seed','field masoned banner pattern',
  'bordure indented banner pattern','flower charge banner pattern','creeper charge banner pattern',
  'skull charge banner pattern', 'thing banner pattern','globe banner pattern',
  'snout banner pattern','flow banner pattern','guster banner pattern',
]);

const FISH = new Set([
  'anthias', 'blue eel', 'blue grenadier', 'bream', 'bubblefish', 'catfish', 'chromis',
  'coralfish','cod', 'fire eel', 'gastropod shell', 'gemfish', 'golden wahoo', 'green barb',
  'greenfish', 'ice fish', 'jellyfish','pufferfish', 'purple firefish', 'rosy barb','salmon',
  'shrimp', 'slimefish', 'starfish', 'stingray', 'sunfish', 'token','tropical fish', 'trout',
  'tuna', 'battery', 'dirty sock', 'metal can', 'plastic bottle', 'rope', 'bucket of axolotl',
  'bucket of cod', 'bucket of pufferfish','bucket of salmon','bucket of tadpole','bucket of tropical fish',
  'bucket of sulfur cube',
]);

const CAT_LABELS = {
  'set-gear':'Set Gear','enchanted-book':'Enchanted Book',
  'spawner':'Spawner','spawn-egg':'Spawn Egg',
  'runestone':'Runestone','unique-relic':'Unique Relic',
  'resource':'Resource','utility':'Utility',
  'music-disc':'Music Disc','fish':'Fish','misc':'Misc',
};

const CONF_ORDER = { high:0, good:1, fair:2, low:3, unreliable:4 };

const SELLER_COLORS = {
  Trustworthy: { bg:'rgba(70,214,121,.1)',  color:'#46d679', border:'rgba(70,214,121,.25)' },
  Neutral:     { bg:'rgba(133,138,160,.08)',color:'#858aa0', border:'rgba(133,138,160,.2)' },
  Suspicious:  { bg:'rgba(237,184,74,.1)',  color:'#edb84a', border:'rgba(237,184,74,.25)' },
  Flagged:     { bg:'rgba(240,100,100,.1)', color:'#f06464', border:'rgba(240,100,100,.25)' },
};

const SELLER_ORDER = { Trustworthy:0, Neutral:1, Suspicious:2, Flagged:3 };

const SKILL_TAG_CLASS = {
  mining:'st-mining', woodcutting:'st-woodcutting', hunting:'st-hunting',
  farming:'st-farming', fishing:'st-fishing', smelting:'st-smelting', arcane:'st-arcane',
};

const LOWER_WORDS = new Set(['a','an','the','and','but','or','for','nor','on','at','to','by','in','of','up','as','vs','via']);
