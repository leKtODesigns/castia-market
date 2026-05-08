// Item notes (enchants / descriptions) used by cards and the detail panel.
// Add more entries as needed — this file is intentionally separate so it can grow.

(function(){
  // Key format:
  // - lowercased raw key
  // - you MAY include a tier suffix (|t1/|t2/|t3) for tier-specific notes
  // - if you omit tier, it acts as a fallback for all tiers
  // - preserve bracket suffix if present (e.g. "christmas cap [smelting]")
  window.CARD_NOTES={
    // Mithril set gear example
    'daydream pickaxe':{
      type:'enchants',
      lines:['Fortune 5','Efficiency 9','Unbreaking 8','Mending'],
    },
    'prismatic shovel|t1':{
      type:'enchants',
      lines:['Efficiency 3','Unbreaking 4'],
    },
    'prismatic shovel|t3':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 10','Unbreaking 10','Mending'],
    },
    // Unique relic (skill-variant example)
    'christmas cap [smelting]':{
      type:'desc',
      lines:[
        'Protection 4',
        'Unbreakable',
        '\u25a0 2.5% Smelting Exp Boost',
        '\u25a0 1.5% Smelting Money Boost',
      ],
    },
  };
})();
