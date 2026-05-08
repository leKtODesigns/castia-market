// Item notes (enchants / descriptions) used by cards and the detail panel.
// Add more entries as needed — this file is intentionally separate so it can grow.

(function(){
  // Key format:
  // - lowercased raw key
  // - you MAY include a tier suffix (|t1/|t2/|t3) for tier-specific notes
  // - if you omit tier, it acts as a fallback for all tiers
  // - preserve bracket suffix if present (e.g. "christmas cap [smelting]")
  window.CARD_NOTES={
    // Prismatic set gear
    'prismatic helmet':{
      type:'enchants',
      lines:['Protection 10','Blast Protection 5','Fire Protection 5','Projectile Protection 5','Respiration 3','Aqua Affinity','Thorns 3','Unbreaking 10'],
    },
    'prismatic chestplate':{
      type:'enchants',
      lines:['Protection 10','Blast Protection 5','Fire Protection 5','Projectile Protection 5','Thorns 3','Unbreaking 10'],
    },
    'prismatic leggings':{
      type:'enchants',
      lines:['Protection 10','Blast Protection 5','Fire Protection 5','Projectile Protection 5','Swift Sneak 3','Thorns 3','Unbreaking 10'],
    },
    'prismatic boots':{
      type:'enchants',
      lines:['Protection 10','Blast Protection 5','Fire Protection 5','Projectile Protection 5','Feather Falling 4','Soul Speed 3','Depth Strider 3','Thorns 3','Unbreaking 10'],
    },
    // Mithril set gear example
    'daydream pickaxe':{
      type:'enchants',
      lines:['Fortune 5','Efficiency 9','Unbreaking 8','Mending'],
    },
    'prismatic shovel|t1':{
      type:'enchants',
      lines:['Efficiency 3','Unbreaking 4'],
    },
    'prismatic shovel|t2':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 6','Unbreaking 7','Mending'],
    },
    'prismatic shovel|t3':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 10','Unbreaking 10','Mending'],
    },
    'prismatic pickaxe|t1':{
      type:'enchants',
      lines:['Fortune 1','Efficiency 3','Unbreaking 4'],
    },
    'prismatic pickaxe|t2':{
      type:'enchants',
      lines:['Fortune 3','Efficiency 6','Unbreaking 7','Mending'],
    },
    'prismatic pickaxe|t3':{
      type:'enchants',
      lines:['Fortune 5','Efficiency 10','Unbreaking 10','Mending'],
    },
    'prismatic axe|t1':{
      type:'enchants',
      lines:['Fortune 1','Efficiency 3','Unbreaking 4'],
    },
    'prismatic axe|t2':{
      type:'enchants',
      lines:['Fortune 3','Efficiency 6','Unbreaking 7','Mending'],
    },
    'prismatic axe|t3':{
      type:'enchants',
      lines:['Fortune 5','Efficiency 10','Unbreaking 10','Mending'],
    },
    'prismatic hoe|t1':{
      type:'enchants',
      lines:['Fortune 1','Efficiency 3','Unbreaking 4'],
    },
    'prismatic hoe|t2':{
      type:'enchants',
      lines:['Fortune 3','Efficiency 6','Unbreaking 7','Mending'],
    },
    'prismatic hoe|t3':{
      type:'enchants',
      lines:['Fortune 5','Efficiency 10','Unbreaking 10','Mending'],
    },
    'prismatic sword|t1':{
      type:'enchants',
      lines:['Sharpness 2','Sweeping Edge 1','Looting 1','Unbreaking 4'],
    },
    'prismatic sword|t2':{
      type:'enchants',
      lines:['Sharpness 6','Sweeping Edge 2','Looting 3','Unbreaking 7','Mending'],
    },
    'prismatic sword|t3':{
      type:'enchants',
      lines:['Sharpness 10','Sweeping Edge 3','Looting 5','Unbreaking 10','Mending'],
    },
    'prismatic bow|t1':{
      type:'enchants',
      lines:['Power 3','Unbreaking 4'],
    },
    'prismatic bow|t2':{
      type:'enchants',
      lines:['Power 6','Unbreaking 7','Mending'],
    },
    'prismatic bow|t3':{
      type:'enchants',
      lines:['Power 10','Unbreaking 10','Infinity','Mending'],
    },
    'prismatic fishing rod|t1':{
      type:'enchants',
      lines:['Luck of the Sea 1','Lure 1','Unbreaking 4'],
    },
    'prismatic fishing rod|t2':{
      type:'enchants',
      lines:['Luck of the Sea 2','Lure 3','Unbreaking 7','Mending'],
    },
    'prismatic fishing rod|t3':{
      type:'enchants',
      lines:['Luck of the Sea 3','Lure 5','Unbreaking 10','Mending'],
    },
    'prismatic shears|t1':{
      type:'enchants',
      lines:['Efficiency 3','Unbreaking 4'],
    },
    'prismatic shears|t2':{
      type:'enchants',
      lines:['Efficiency 6','Unbreaking 7','Mending'],
    },
    'prismatic shears|t3':{
      type:'enchants',
      lines:['Efficiency 10','Unbreaking 10','Mending'],
    },
    'prismatic mace|t1':{
      type:'enchants',
      lines:['Wind Burst 1','Density 1','Breach 1','Unbreaking 4'],
    },
    'prismatic mace|t2':{
      type:'enchants',
      lines:['Wind Burst 3','Density 3','Breach 3','Unbreaking 7','Mending'],
    },
    'prismatic mace|t3':{
      type:'enchants',
      lines:['Wind Burst 5','Density 5','Breach 5','Unbreaking 10','Mending'],
    },
    // Daydream set
    'daydream helmet':{
      type:'enchants',
      lines:['Protection 9','Thorns 2','Unbreaking 8'],
    },
    'daydream chestplate':{
      type:'enchants',
      lines:['Protection 9','Thorns 2','Unbreaking 8'],
    },
    'daydream leggings':{
      type:'enchants',
      lines:['Protection 9','Swift Sneak 3','Thorns 2','Unbreaking 8'],
    },
    'daydream boots':{
      type:'enchants',
      lines:['Protection 9','Feather Falling 3','Depth Strider 3','Thorns 2','Unbreaking 8'],
    },
    'daydream sword':{
      type:'enchants',
      lines:['Sharpness 9','Looting 5','Unbreaking 8','Mending'],
    },
    'daydream bow':{
      type:'enchants',
      lines:['Power 9','Unbreaking 8','Mending'],
    },
    'daydream axe':{
      type:'enchants',
      lines:['Fortune 5','Efficiency 9','Unbreaking 8','Mending'],
    },
    'daydream shovel':{
      type:'enchants',
      lines:['Fortune 5','Efficiency 9','Unbreaking 8','Mending'],
    },
    'daydream hoe':{
      type:'enchants',
      lines:['Fortune 5','Efficiency 9','Unbreaking 8','Mending'],
    },
    'daydream fishing rod':{
      type:'enchants',
      lines:['Luck of the Sea 3','Lure 5','Unbreaking 8','Mending'],
    },
    // Eldritch set
    'eldritch helmet':{
      type:'enchants',
      lines:['Protection 9','Projectile Protection 4','Aqua Affinity','Unbreaking 6'],
    },
    'eldritch chestplate':{
      type:'enchants',
      lines:['Protection 9','Projectile Protection 4','Unbreaking 6'],
    },
    'eldritch leggings':{
      type:'enchants',
      lines:['Protection 9','Projectile Protection 4','Unbreaking 6'],
    },
    'eldritch boots':{
      type:'enchants',
      lines:['Protection 9','Projectile Protection 4','Feather Falling 4','Unbreaking 6'],
    },
    'eldritch sword':{
      type:'enchants',
      lines:['Sharpness 9','Bane of Arthropods','Fire Aspect 2','Unbreaking 6','Mending'],
    },
    'eldritch bow':{
      type:'enchants',
      lines:['Power 9','Flame 2','Unbreaking 9','Mending'],
    },
    'eldritch pickaxe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 9','Unbreaking 6','Mending'],
    },
    'eldritch axe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 9','Unbreaking 6','Mending'],
    },
    'eldritch shovel':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 9','Unbreaking 6','Mending'],
    },
    'eldritch hoe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 9','Unbreaking 6','Mending'],
    },
    'eldritch fishing rod':{
      type:'enchants',
      lines:['Lure 2','Unbreaking 6','Mending'],
    },
    // Halgrabind set
    'halgrabind helmet':{
      type:'enchants',
      lines:['Protection 4','Projectile Protection 9','Respiration 3','Aqua Affinity','Unbreaking 7'],
    },
    'halgrabind chestplate':{
      type:'enchants',
      lines:['Protection 4','Projectile Protection 9','Unbreaking 7'],
    },
    'halgrabind leggings':{
      type:'enchants',
      lines:['Protection 4','Projectile Protection 9','Unbreaking 7'],
    },
    'halgrabind boots':{
      type:'enchants',
      lines:['Protection 4','Projectile Protection 9','Soul Speed 3','Depth Strider 3','Unbreaking 7'],
    },
    'halgrabind sword':{
      type:'enchants',
      lines:['Sharpness 9','Sweeping Edge 3','Unbreaking 7','Mending'],
    },
    'halgrabind bow':{
      type:'enchants',
      lines:['Power 9','Unbreaking 7','Infinity','Mending'],
    },
    'halgrabind pickaxe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 9','Unbreaking 7','Mending'],
    },
    'halgrabind axe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 9','Unbreaking 7','Mending'],
    },
    'halgrabind shovel':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 9','Unbreaking 7','Mending'],
    },
    'halgrabind hoe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 9','Unbreaking 7','Mending'],
    },
    'halgrabind fishing rod':{
      type:'enchants',
      lines:['Luck of the Sea 2','Unbreaking 7','Mending'],
    },
    // Elven set
    'elven helmet':{
      type:'enchants',
      lines:['Protection 8','Fire Protection 5','Aqua Affinity','Unbreaking 6'],
    },
    'elven chestplate':{
      type:'enchants',
      lines:['Protection 8','Fire Protection 5','Unbreaking 6'],
    },
    'elven leggings':{
      type:'enchants',
      lines:['Protection 8','Fire Protection 5','Swift Sneak 3','Unbreaking 6'],
    },
    'elven boots':{
      type:'enchants',
      lines:['Protection 8','Fire Protection 5','Soul Speed 3','Unbreaking 6'],
    },
    'elven sword':{
      type:'enchants',
      lines:['Sharpness 8','Sweeping Edge 3','Unbreaking 6','Mending'],
    },
    'elven bow':{
      type:'enchants',
      lines:['Power 8','Unbreaking 6','Mending'],
    },
    'elven pickaxe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 8','Unbreaking 6','Mending'],
    },
    'elven axe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 8','Unbreaking 6','Mending'],
    },
    'elven shovel':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 8','Unbreaking 6','Mending'],
    },
    'elven hoe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 8','Unbreaking 6','Mending'],
    },
    'elven fishing rod':{
      type:'enchants',
      lines:['Lure 4','Unbreaking 6','Mending'],
    },
    // Erphis set
    'erphis helmet':{
      type:'enchants',
      lines:['Protection 8','Blast Protection 2','Respiration 3','Thorns 3','Unbreaking 5'],
    },
    'erphis chestplate':{
      type:'enchants',
      lines:['Protection 8','Blast Protection 2','Thorns 3','Unbreaking 5'],
    },
    'erphis leggings':{
      type:'enchants',
      lines:['Protection 8','Blast Protection 2','Thorns 3','Unbreaking 5'],
    },
    'erphis boots':{
      type:'enchants',
      lines:['Frost Walker 2','Protection 8','Blast Protection 2','Feather Falling 4','Soul Speed 3','Depth Strider 3','Thorns 3','Unbreaking 5'],
    },
    'erphis sword':{
      type:'enchants',
      lines:['Sharpness 8','Smite 7','Sweeping Edge 1','Unbreaking 5','Mending'],
    },
    'erphis bow':{
      type:'enchants',
      lines:['Power 8','Unbreaking 5','Infinity','Mending'],
    },
    'erphis pickaxe':{
      type:'enchants',
      lines:['Fortune 2','Efficiency 8','Unbreaking 5','Mending'],
    },
    'erphis axe':{
      type:'enchants',
      lines:['Fortune 2','Efficiency 8','Unbreaking 5','Mending'],
    },
    'erphis shovel':{
      type:'enchants',
      lines:['Fortune 2','Efficiency 8','Unbreaking 5','Mending'],
    },
    'erphis hoe':{
      type:'enchants',
      lines:['Fortune 2','Efficiency 8','Unbreaking 5','Mending'],
    },
    'erphis fishing rod':{
      type:'enchants',
      lines:['Luck of the Sea 2','Unbreaking 5','Mending'],
    },
    // Llanakin set
    'llanakin helmet':{
      type:'enchants',
      lines:['Protection 8','Respiration 3','Aqua Affinity','Unbreaking 8'],
    },
    'llanakin chestplate':{
      type:'enchants',
      lines:['Protection 8','Unbreaking 8'],
    },
    'llanakin leggings':{
      type:'enchants',
      lines:['Protection 8','Swift Sneak 2','Unbreaking 8'],
    },
    'llanakin boots':{
      type:'enchants',
      lines:['Protection 8','Feather Falling 4','Soul Speed 3','Depth Strider 3','Unbreaking 8'],
    },
    'llanakin sword':{
      type:'enchants',
      lines:['Sharpness 8','Knockback 1','Looting 3','Unbreaking 8','Mending'],
    },
    'llanakin bow':{
      type:'enchants',
      lines:['Power 8','Punch 1','Unbreaking 8','Infinity','Mending'],
    },
    'llanakin pickaxe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 8','Unbreaking 8','Mending'],
    },
    'llanakin axe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 8','Unbreaking 8','Mending'],
    },
    'llanakin shovel':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 8','Unbreaking 8','Mending'],
    },
    'llanakin hoe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 8','Unbreaking 8','Mending'],
    },
    'llanakin fishing rod':{
      type:'enchants',
      lines:['Luck of the Sea 1','Lure 5','Unbreaking 8','Mending'],
    },
    // Shoopon set
    'shoopon helmet':{
      type:'enchants',
      lines:['Protection 8','Respiration 3','Aqua Affinity','Unbreaking 8'],
    },
    'shoopon chestplate':{
      type:'enchants',
      lines:['Protection 8','Projectile Protection 4','Unbreaking 8'],
    },
    'shoopon leggings':{
      type:'enchants',
      lines:['Protection 8','Projectile Protection 4','Unbreaking 8'],
    },
    'shoopon boots':{
      type:'enchants',
      lines:['Protection 8','Projectile Protection 4','Feather Falling 4','Soul Speed 3','Depth Strider 3','Unbreaking 8'],
    },
    'shoopon sword':{
      type:'enchants',
      lines:['Sharpness 8','Sweeping Edge 3','Looting 4','Unbreaking 8','Mending'],
    },
    'shoopon bow':{
      type:'enchants',
      lines:['Power 8','Unbreaking 8','Infinity','Mending'],
    },
    'shoopon pickaxe':{
      type:'enchants',
      lines:['Fortune 4','Efficiency 8','Unbreaking 8','Mending'],
    },
    'shoopon axe':{
      type:'enchants',
      lines:['Fortune 4','Efficiency 8','Unbreaking 8','Mending'],
    },
    'shoopon shovel':{
      type:'enchants',
      lines:['Fortune 4','Efficiency 8','Unbreaking 8','Mending'],
    },
    'shoopon hoe':{
      type:'enchants',
      lines:['Fortune 4','Efficiency 8','Unbreaking 8','Mending'],
    },
    'shoopon fishing rod':{
      type:'enchants',
      lines:['Lure 4','Unbreaking 8','Mending'],
    },
    // Athanasia set
    'athanasia helmet':{
      type:'enchants',
      lines:['Blast Protection 7','Unbreaking 6'],
    },
    'athanasia chestplate':{
      type:'enchants',
      lines:['Blast Protection 7','Unbreaking 6'],
    },
    'athanasia leggings':{
      type:'enchants',
      lines:['Blast Protection 7','Unbreaking 6'],
    },
    'athanasia boots':{
      type:'enchants',
      lines:['Blast Protection 7','Unbreaking 6'],
    },
    'athanasia sword':{
      type:'enchants',
      lines:['Sharpness 7','Fire Aspect 2','Unbreaking 6','Mending'],
    },
    'athanasia bow':{
      type:'enchants',
      lines:['Power 7','Flame 2','Unbreaking 6','Infinity','Mending'],
    },
    'athanasia pickaxe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 7','Unbreaking 6','Mending'],
    },
    'athanasia axe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 7','Unbreaking 6','Mending'],
    },
    'athanasia shovel':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 7','Unbreaking 6','Mending'],
    },
    'athanasia hoe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 7','Unbreaking 6','Mending'],
    },
    'athanasia fishing rod':{
      type:'enchants',
      lines:['Lure 3','Unbreaking 6','Mending'],
    },
    // Bogmath set
    'bogmath helmet':{
      type:'enchants',
      lines:['Protection 7','Blast Protection 3','Fire Protection 3','Projectile Protection 3','Respiration 3','Aqua Affinity','Unbreaking 6'],
    },
    'bogmath chestplate':{
      type:'enchants',
      lines:['Protection 7','Blast Protection 3','Fire Protection 3','Projectile Protection 3','Unbreaking 6'],
    },
    'bogmath leggings':{
      type:'enchants',
      lines:['Protection 7','Blast Protection 3','Fire Protection 3','Projectile Protection 3','Unbreaking 6'],
    },
    'bogmath boots':{
      type:'enchants',
      lines:['Protection 7','Blast Protection 3','Fire Protection 3','Feather Falling 3','Depth Strider 3','Unbreaking 6'],
    },
    'bogmath sword':{
      type:'enchants',
      lines:['Sharpness 7','Smite 3','Bane of Arthropods 3','Sweeping Edge 3','Looting 3','Unbreaking 6','Mending'],
    },
    'bogmath bow':{
      type:'enchants',
      lines:['Power 7','Unbreaking 6','Infinity','Mending'],
    },
    'bogmath pickaxe':{
      type:'enchants',
      lines:['Fortune 3','Efficiency 7','Unbreaking 6','Mending'],
    },
    'bogmath axe':{
      type:'enchants',
      lines:['Fortune 3','Efficiency 7','Unbreaking 6','Mending'],
    },
    'bogmath shovel':{
      type:'enchants',
      lines:['Fortune 3','Efficiency 7','Unbreaking 6','Mending'],
    },
    'bogmath hoe':{
      type:'enchants',
      lines:['Fortune 3','Efficiency 7','Unbreaking 6','Mending'],
    },
    'bogmath fishing rod':{
      type:'enchants',
      lines:['Luck of the Sea 3','Lure 5','Unbreaking 6','Mending'],
    },
    // Curtana set
    'curtana helmet':{
      type:'enchants',
      lines:['Protection 7','Fire Protection 4','Unbreaking 7'],
    },
    'curtana chestplate':{
      type:'enchants',
      lines:['Protection 7','Fire Protection 4','Unbreaking 7'],
    },
    'curtana leggings':{
      type:'enchants',
      lines:['Protection 7','Fire Protection 4','Swift Sneak 3','Unbreaking 7'],
    },
    'curtana boots':{
      type:'enchants',
      lines:['Protection 7','Fire Protection 4','Depth Strider 3','Unbreaking 7'],
    },
    'curtana sword':{
      type:'enchants',
      lines:['Sharpness 7','Fire Aspect 2','Knockback 2','Looting 4','Unbreaking 7','Mending'],
    },
    'curtana bow':{
      type:'enchants',
      lines:['Power 7','Flame 2','Punch 2','Unbreaking 7','Mending'],
    },
    'curtana pickaxe':{
      type:'enchants',
      lines:['Fortune 3','Efficiency 7','Unbreaking 7','Mending'],
    },
    'curtana axe':{
      type:'enchants',
      lines:['Fortune 3','Efficiency 7','Unbreaking 7','Mending'],
    },
    'curtana shovel':{
      type:'enchants',
      lines:['Fortune 3','Efficiency 7','Unbreaking 7','Mending'],
    },
    'curtana hoe':{
      type:'enchants',
      lines:['Fortune 3','Efficiency 7','Unbreaking 7','Mending'],
    },
    'curtana fishing rod':{
      type:'enchants',
      lines:['Luck of the Sea 3','Lure 4','Unbreaking 7','Mending'],
    },
    // Kayran set
    'kayran helmet':{
      type:'enchants',
      lines:['Protection 7','Respiration 3','Thorns 3','Unbreaking 9'],
    },
    'kayran chestplate':{
      type:'enchants',
      lines:['Protection 7','Thorns 3','Unbreaking 9'],
    },
    'kayran leggings':{
      type:'enchants',
      lines:['Protection 7','Thorns 3','Unbreaking 9'],
    },
    'kayran boots':{
      type:'enchants',
      lines:['Frost Walker 2','Protection 7','Feather Falling 4','Thorns 3','Unbreaking 9'],
    },
    'kayran sword':{
      type:'enchants',
      lines:['Sharpness 7','Smite 6','Unbreaking 9','Mending'],
    },
    'kayran bow':{
      type:'enchants',
      lines:['Power 7','Unbreaking 9','Mending'],
    },
    'kayran pickaxe':{
      type:'enchants',
      lines:['Fortune 3','Efficiency 7','Unbreaking 9','Mending'],
    },
    'kayran axe':{
      type:'enchants',
      lines:['Fortune 3','Efficiency 7','Unbreaking 9','Mending'],
    },
    'kayran shovel':{
      type:'enchants',
      lines:['Fortune 3','Efficiency 7','Unbreaking 9','Mending'],
    },
    'kayran hoe':{
      type:'enchants',
      lines:['Fortune 3','Efficiency 7','Unbreaking 9','Mending'],
    },
    'kayran fishing rod':{
      type:'enchants',
      lines:['Luck of the Sea 3','Unbreaking 9','Mending'],
    },
    // Malediction set
    'malediction helmet':{
      type:'enchants',
      lines:['Projectile Protection 7','Aqua Affinity','Thorns 2','Unbreaking 8'],
    },
    'malediction chestplate':{
      type:'enchants',
      lines:['Projectile Protection 7','Thorns 2','Unbreaking 8'],
    },
    'malediction leggings':{
      type:'enchants',
      lines:['Projectile Protection 7','Thorns 2','Unbreaking 8'],
    },
    'malediction boots':{
      type:'enchants',
      lines:['Projectile Protection 7','Depth Strider 3','Thorns 2','Unbreaking 8'],
    },
    'malediction sword':{
      type:'enchants',
      lines:['Sharpness 7','Looting 4','Unbreaking 8','Mending'],
    },
    'malediction bow':{
      type:'enchants',
      lines:['Power 7','Unbreaking 8','Infinity','Mending'],
    },
    'malediction pickaxe':{
      type:'enchants',
      lines:['Fortune 4','Efficiency 7','Unbreaking 8','Mending'],
    },
    'malediction axe':{
      type:'enchants',
      lines:['Fortune 4','Efficiency 7','Unbreaking 8','Mending'],
    },
    'malediction shovel':{
      type:'enchants',
      lines:['Fortune 4','Efficiency 7','Unbreaking 8','Mending'],
    },
    'malediction hoe':{
      type:'enchants',
      lines:['Fortune 4','Efficiency 7','Unbreaking 8','Mending'],
    },
    'malediction fishing rod':{
      type:'enchants',
      lines:['Unbreaking 8','Mending'],
    },
    // Oceanis set
    'oceanis helmet':{
      type:'enchants',
      lines:['Protection 7','Projectile Protection 5','Respiration 3','Aqua Affinity','Unbreaking 6'],
    },
    'oceanis chestplate':{
      type:'enchants',
      lines:['Protection 7','Projectile Protection 5','Unbreaking 6'],
    },
    'oceanis leggings':{
      type:'enchants',
      lines:['Protection 7','Projectile Protection 5','Unbreaking 6'],
    },
    'oceanis boots':{
      type:'enchants',
      lines:['Protection 7','Projectile Protection 5','Feather Falling 4','Soul Speed 3','Depth Strider 3','Unbreaking 6'],
    },
    'oceanis sword':{
      type:'enchants',
      lines:['Sharpness 7','Knockback 2','Looting 5','Unbreaking 6','Mending'],
    },
    'oceanis bow':{
      type:'enchants',
      lines:['Power 7','Punch 2','Unbreaking 6','Mending'],
    },
    'oceanis pickaxe':{
      type:'enchants',
      lines:['Fortune 5','Efficiency 7','Unbreaking 6','Mending'],
    },
    'oceanis axe':{
      type:'enchants',
      lines:['Fortune 5','Efficiency 7','Unbreaking 6','Mending'],
    },
    'oceanis shovel':{
      type:'enchants',
      lines:['Fortune 5','Efficiency 7','Unbreaking 6','Mending'],
    },
    'oceanis hoe':{
      type:'enchants',
      lines:['Fortune 5','Efficiency 7','Unbreaking 6','Mending'],
    },
    'oceanis fishing rod':{
      type:'enchants',
      lines:['Luck of the Sea 3','Lure 5','Unbreaking 6','Mending'],
    },
    // Phezar set
    'phezar helmet':{
      type:'enchants',
      lines:['Protection 7','Blast Protection 1','Respiration 3','Aqua Affinity','Thorns 3','Unbreaking 6'],
    },
    'phezar chestplate':{
      type:'enchants',
      lines:['Protection 7','Blast Protection 1','Thorns 3','Unbreaking 6'],
    },
    'phezar leggings':{
      type:'enchants',
      lines:['Protection 7','Blast Protection 1','Swift Sneak 3','Thorns 3','Unbreaking 6'],
    },
    'phezar boots':{
      type:'enchants',
      lines:['Frost Walker 2','Protection 7','Blast Protection 1','Feather Falling 4','Soul Speed 3','Depth Strider 3','Thorns 3','Unbreaking 6'],
    },
    'phezar sword':{
      type:'enchants',
      lines:['Sharpness 7','Smite 6','Bane of Arthropods 5','Sweeping Edge 3','Fire Aspect 1','Knockback 2','Looting 1','Unbreaking 6','Mending'],
    },
    'phezar bow':{
      type:'enchants',
      lines:['Power 7','Flame','Punch 2','Unbreaking 6','Infinity','Mending'],
    },
    'phezar pickaxe':{
      type:'enchants',
      lines:['Fortune 1','Efficiency 7','Unbreaking 6','Mending'],
    },
    'phezar axe':{
      type:'enchants',
      lines:['Fortune 1','Efficiency 7','Unbreaking 6','Mending'],
    },
    'phezar shovel':{
      type:'enchants',
      lines:['Fortune 1','Efficiency 7','Unbreaking 6','Mending'],
    },
    'phezar hoe':{
      type:'enchants',
      lines:['Fortune 1','Efficiency 7','Unbreaking 6','Mending'],
    },
    'phezar fishing rod':{
      type:'enchants',
      lines:['Luck of the Sea 3','Unbreaking 6','Mending'],
    },
    // Saprophyte set
    'saprophyte helmet':{
      type:'enchants',
      lines:['Protection 7','Fire Protection 5','Respiration 2','Aqua Affinity','Unbreaking 6'],
    },
    'saprophyte chestplate':{
      type:'enchants',
      lines:['Protection 7','Fire Protection 5','Unbreaking 6'],
    },
    'saprophyte leggings':{
      type:'enchants',
      lines:['Protection 7','Fire Protection 5','Swift Sneak 2','Unbreaking 6'],
    },
    'saprophyte boots':{
      type:'enchants',
      lines:['Protection 7','Fire Protection 5','Feather Falling 4','Depth Strider 3','Unbreaking 6'],
    },
    'saprophyte sword':{
      type:'enchants',
      lines:['Sharpness 7','Sweeping Edge 3','Fire Aspect 2','Looting 2','Unbreaking 6','Mending'],
    },
    'saprophyte bow':{
      type:'enchants',
      lines:['Power 7','Flame 2','Unbreaking 6','Mending'],
    },
    'saprophyte pickaxe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 7','Unbreaking 6','Mending'],
    },
    'saprophyte axe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 7','Unbreaking 6','Mending'],
    },
    'saprophyte shovel':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 7','Unbreaking 6','Mending'],
    },
    'saprophyte hoe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 7','Unbreaking 6','Mending'],
    },
    'saprophyte fishing rod':{
      type:'enchants',
      lines:['Lure 4','Unbreaking 6','Mending'],
    },
    // Vurgohk set
    'vurgohk helmet':{
      type:'enchants',
      lines:['Blast Protection 3','Projectile Protection 7','Respiration 3','Aqua Affinity','Thorns 3','Unbreaking 7'],
    },
    'vurgohk chestplate':{
      type:'enchants',
      lines:['Blast Protection 3','Projectile Protection 7','Thorns 3','Unbreaking 7'],
    },
    'vurgohk leggings':{
      type:'enchants',
      lines:['Blast Protection 3','Projectile Protection 7','Thorns 3','Unbreaking 7'],
    },
    'vurgohk boots':{
      type:'enchants',
      lines:['Frost Walker 2','Blast Protection 3','Projectile Protection 7','Depth Strider 3','Thorns 3','Unbreaking 7'],
    },
    'vurgohk sword':{
      type:'enchants',
      lines:['Sharpness 7','Smite 7','Bane of Arthropods 7','Fire Aspect 1','Knockback 2','Looting 4','Unbreaking 7','Mending'],
    },
    'vurgohk bow':{
      type:'enchants',
      lines:['Power 7','Flame','Punch 2','Unbreaking 7','Infinity','Mending'],
    },
    'vurgohk pickaxe':{
      type:'enchants',
      lines:['Fortune 4','Efficiency 7','Unbreaking 7','Mending'],
    },
    'vurgohk axe':{
      type:'enchants',
      lines:['Fortune 4','Efficiency 7','Unbreaking 7','Mending'],
    },
    'vurgohk shovel':{
      type:'enchants',
      lines:['Fortune 4','Efficiency 7','Unbreaking 7','Mending'],
    },
    'vurgohk hoe':{
      type:'enchants',
      lines:['Fortune 4','Efficiency 7','Unbreaking 7','Mending'],
    },
    'vurgohk fishing rod':{
      type:'enchants',
      lines:['Luck of the Sea 2','Lure 3','Unbreaking 7','Mending'],
    },
    // Azertuan set
    'azertuan helmet':{
      type:'enchants',
      lines:['Protection 6','Blast Protection 4','Projectile Protection 4','Unbreaking 9'],
    },
    'azertuan chestplate':{
      type:'enchants',
      lines:['Protection 6','Blast Protection 4','Projectile Protection 4','Unbreaking 9'],
    },
    'azertuan leggings':{
      type:'enchants',
      lines:['Protection 6','Blast Protection 4','Projectile Protection 4','Swift Sneak 3','Unbreaking 9'],
    },
    'azertuan boots':{
      type:'enchants',
      lines:['Protection 6','Blast Protection 4','Projectile Protection 4','Feather Falling 4','Unbreaking 9'],
    },
    'azertuan sword':{
      type:'enchants',
      lines:['Sharpness 6','Bane of Arthropods 6','Sweeping Edge 2','Unbreaking 9','Mending'],
    },
    'azertuan bow':{
      type:'enchants',
      lines:['Power 6','Unbreaking 9','Infinity','Mending'],
    },
    'azertuan pickaxe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 6','Unbreaking 9','Mending'],
    },
    'azertuan axe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 6','Unbreaking 9','Mending'],
    },
    'azertuan shovel':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 6','Unbreaking 9','Mending'],
    },
    'azertuan hoe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 6','Unbreaking 9','Mending'],
    },
    'azertuan fishing rod':{
      type:'enchants',
      lines:['Unbreaking 9','Mending'],
    },
    // Hulia set
    'hulia helmet':{
      type:'enchants',
      lines:['Fire Protection 5','Projectile Protection 6','Unbreaking 7'],
    },
    'hulia chestplate':{
      type:'enchants',
      lines:['Fire Protection 5','Projectile Protection 6','Unbreaking 7'],
    },
    'hulia leggings':{
      type:'enchants',
      lines:['Fire Protection 5','Projectile Protection 6','Unbreaking 7'],
    },
    'hulia boots':{
      type:'enchants',
      lines:['Fire Protection 5','Projectile Protection 6','Unbreaking 7'],
    },
    'hulia sword':{
      type:'enchants',
      lines:['Sharpness 6','Unbreaking 7','Mending'],
    },
    'hulia bow':{
      type:'enchants',
      lines:['Power 6','Unbreaking 7','Mending'],
    },
    'hulia pickaxe':{
      type:'enchants',
      lines:['Fortune 3','Efficiency 6','Unbreaking 7','Mending'],
    },
    'hulia axe':{
      type:'enchants',
      lines:['Fortune 3','Efficiency 6','Unbreaking 7','Mending'],
    },
    'hulia shovel':{
      type:'enchants',
      lines:['Fortune 3','Efficiency 6','Unbreaking 7','Mending'],
    },
    'hulia hoe':{
      type:'enchants',
      lines:['Fortune 3','Efficiency 6','Unbreaking 7','Mending'],
    },
    'hulia fishing rod':{
      type:'enchants',
      lines:['Lure 3','Unbreaking 7','Mending'],
    },
    // Igru set
    'igru helmet':{
      type:'enchants',
      lines:['Fire Protection 8','Aqua Affinity','Thorns 3','Unbreaking 5'],
    },
    'igru chestplate':{
      type:'enchants',
      lines:['Fire Protection 8','Thorns 3','Unbreaking 5'],
    },
    'igru leggings':{
      type:'enchants',
      lines:['Fire Protection 8','Swift Sneak 3','Thorns 3','Unbreaking 5'],
    },
    'igru boots':{
      type:'enchants',
      lines:['Fire Protection 8','Feather Falling 5','Soul Speed 2','Thorns 3','Unbreaking 5'],
    },
    'igru sword':{
      type:'enchants',
      lines:['Sharpness 6','Smite 8','Fire Aspect 2','Unbreaking 5','Mending'],
    },
    'igru bow':{
      type:'enchants',
      lines:['Power 6','Flame 2','Unbreaking 5','Mending'],
    },
    'igru pickaxe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 6','Unbreaking 5','Mending'],
    },
    'igru axe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 6','Unbreaking 5','Mending'],
    },
    'igru shovel':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 6','Unbreaking 5','Mending'],
    },
    'igru hoe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 6','Unbreaking 5','Mending'],
    },
    'igru fishing rod':{
      type:'enchants',
      lines:['Luck of the Sea 3','Unbreaking 5','Mending'],
    },
    // Oldus set
    'oldus helmet':{
      type:'enchants',
      lines:['Protection 6','Projectile Protection 6','Thorns 3','Unbreaking 7'],
    },
    'oldus chestplate':{
      type:'enchants',
      lines:['Protection 6','Projectile Protection 6','Thorns 3','Unbreaking 7'],
    },
    'oldus leggings':{
      type:'enchants',
      lines:['Frost Walker 2','Protection 6','Projectile Protection 6','Swift Sneak 3','Thorns 3','Unbreaking 7'],
    },
    'oldus boots':{
      type:'enchants',
      lines:['Protection 6','Projectile Protection 6','Feather Falling 4','Thorns 3','Unbreaking 7'],
    },
    'oldus sword':{
      type:'enchants',
      lines:['Sharpness 6','Smite 8','Sweeping Edge 3','Fire Aspect 2','Unbreaking 5','Mending'],
    },
    'oldus bow':{
      type:'enchants',
      lines:['Power 6','Flame 2','Unbreaking 7','Mending'],
    },
    'oldus pickaxe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 6','Unbreaking 7','Mending'],
    },
    'oldus axe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 6','Unbreaking 7','Mending'],
    },
    'oldus shovel':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 6','Unbreaking 7','Mending'],
    },
    'oldus hoe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 6','Unbreaking 7','Mending'],
    },
    'oldus fishing rod':{
      type:'enchants',
      lines:['Unbreaking 7','Mending'],
    },
    // Opulent set
    'opulent helmet':{
      type:'enchants',
      lines:['Blast Protection 5','Fire Protection 5','Respiration 3','Unbreaking 8'],
    },
    'opulent chestplate':{
      type:'enchants',
      lines:['Blast Protection 5','Fire Protection 5','Unbreaking 8'],
    },
    'opulent leggings':{
      type:'enchants',
      lines:['Blast Protection 5','Fire Protection 5','Unbreaking 8'],
    },
    'opulent boots':{
      type:'enchants',
      lines:['Blast Protection 5','Fire Protection 5','Feather Falling 3','Depth Strider 1','Unbreaking 8'],
    },
    'opulent sword':{
      type:'enchants',
      lines:['Sharpness 6','Knockback 1','Looting 4','Unbreaking 8','Mending'],
    },
    'opulent bow':{
      type:'enchants',
      lines:['Power 6','Punch 1','Unbreaking 8','Infinity','Mending'],
    },
    'opulent pickaxe':{
      type:'enchants',
      lines:['Fortune 4','Efficiency 6','Unbreaking 8','Mending'],
    },
    'opulent axe':{
      type:'enchants',
      lines:['Fortune 4','Efficiency 6','Unbreaking 8','Mending'],
    },
    'opulent shovel':{
      type:'enchants',
      lines:['Fortune 4','Efficiency 6','Unbreaking 8','Mending'],
    },
    'opulent hoe':{
      type:'enchants',
      lines:['Fortune 4','Efficiency 6','Unbreaking 8','Mending'],
    },
    'opulent fishing rod':{
      type:'enchants',
      lines:['Lure 4','Unbreaking 8','Mending'],
    },
    // Paragon set
    'paragon helmet':{
      type:'enchants',
      lines:['Protection 6','Aqua Affinity','Thorns 3','Unbreaking 6'],
    },
    'paragon chestplate':{
      type:'enchants',
      lines:['Protection 6','Thorns 3','Unbreaking 6'],
    },
    'paragon leggings':{
      type:'enchants',
      lines:['Protection 6','Swift Sneak 3','Thorns 3','Unbreaking 6'],
    },
    'paragon boots':{
      type:'enchants',
      lines:['Frost Walker 2','Protection 6','Feather Falling 4','Thorns 3','Unbreaking 6'],
    },
    'paragon sword':{
      type:'enchants',
      lines:['Sharpness 6','Smite 7','Fire Aspect 2','Unbreaking 6','Mending'],
    },
    'paragon bow':{
      type:'enchants',
      lines:['Power 6','Flame 2','Unbreaking 6','Mending'],
    },
    'paragon pickaxe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 6','Unbreaking 6','Mending'],
    },
    'paragon axe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 6','Unbreaking 6','Mending'],
    },
    'paragon shovel':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 6','Unbreaking 6','Mending'],
    },
    'paragon hoe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 6','Unbreaking 6','Mending'],
    },
    'paragon fishing rod':{
      type:'enchants',
      lines:['Luck of the Sea 2','Lure 5','Unbreaking 6','Mending'],
    },
    // Requinox set
    'requinox helmet':{
      type:'enchants',
      lines:['Blast Protection 6','Unbreaking 7'],
    },
    'requinox chestplate':{
      type:'enchants',
      lines:['Blast Protection 6','Unbreaking 7'],
    },
    'requinox leggings':{
      type:'enchants',
      lines:['Blast Protection 6','Swift Sneak 3','Unbreaking 7'],
    },
    'requinox boots':{
      type:'enchants',
      lines:['Blast Protection 6','Depth Strider 3','Unbreaking 7'],
    },
    'requinox sword':{
      type:'enchants',
      lines:['Sharpness 6','Bane of Arthropods 7','Sweeping edge 2','Unbreaking 7','Mending'],
    },
    'requinox bow':{
      type:'enchants',
      lines:['Power 6','Unbreaking 7','Infinity','Mending'],
    },
    'requinox pickaxe':{
      type:'enchants',
      lines:['Fortune 4','Efficiency 6','Unbreaking 7','Mending'],
    },
    'requinox axe':{
      type:'enchants',
      lines:['Fortune 4','Efficiency 6','Unbreaking 7','Mending'],
    },
    'requinox shovel':{
      type:'enchants',
      lines:['Fortune 4','Efficiency 6','Unbreaking 7','Mending'],
    },
    'requinox hoe':{
      type:'enchants',
      lines:['Fortune 4','Efficiency 6','Unbreaking 7','Mending'],
    },
    'requinox fishing rod':{
      type:'enchants',
      lines:['Lure 2','Unbreaking 7','Mending'],
    },
    // Serpent set
    'serpent helmet':{
      type:'enchants',
      lines:['Protection 6','Fire Protection 5','Respiration 3','Unbreaking 8'],
    },
    'serpent chestplate':{
      type:'enchants',
      lines:['Protection 6','Fire Protection 5','Unbreaking 8'],
    },
    'serpent leggings':{
      type:'enchants',
      lines:['Protection 6','Fire Protection 5','Unbreaking 8'],
    },
    'serpent boots':{
      type:'enchants',
      lines:['Protection 6','Fire Protection 5','Unbreaking 8'],
    },
    'serpent sword':{
      type:'enchants',
      lines:['Sharpness 6','Bane of Arthropods 5','Looting 5','Unbreaking 8','Mending'],
    },
    'serpent bow':{
      type:'enchants',
      lines:['Power 6','Unbreaking 8','Infinity','Mending'],
    },
    'serpent pickaxe':{
      type:'enchants',
      lines:['Fortune 5','Efficiency 6','Unbreaking 8','Mending'],
    },
    'serpent axe':{
      type:'enchants',
      lines:['Fortune 5','Efficiency 6','Unbreaking 8','Mending'],
    },
    'serpent shovel':{
      type:'enchants',
      lines:['Fortune 5','Efficiency 6','Unbreaking 8','Mending'],
    },
    'serpent hoe':{
      type:'enchants',
      lines:['Fortune 5','Efficiency 6','Unbreaking 8','Mending'],
    },
    'serpent fishing rod':{
      type:'enchants',
      lines:['Luck of the Sea 3','Lure 3','Unbreaking 8','Mending'],
    },
    // Vertigo set
    'vertigo helmet':{
      type:'enchants',
      lines:['Protection 6','Fire Protection 3','Respiration 3','Aqua Affinity','Thorns 3','Unbreaking 7'],
    },
    'vertigo chestplate':{
      type:'enchants',
      lines:['Protection 6','Fire Protection 3','Thorns 3','Unbreaking 7'],
    },
    'vertigo leggings':{
      type:'enchants',
      lines:['Protection 6','Fire Protection 3','Thorns 3','Unbreaking 7'],
    },
    'vertigo boots':{
      type:'enchants',
      lines:['Frost Walker 3','Protection 6','Fire Protection 3','Soul Speed 3','Thorns 3','Unbreaking 7'],
    },
    'vertigo sword':{
      type:'enchants',
      lines:['Sharpness 6','Sweeping Edge 3','Fire Aspect 2','Knockback 2','Unbreaking 7','Mending'],
    },
    'vertigo bow':{
      type:'enchants',
      lines:['Power 6','Flame 2','Punch 2','Unbreaking 7','Mending'],
    },
    'vertigo pickaxe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 6','Unbreaking 7','Mending'],
    },
    'vertigo axe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 6','Unbreaking 7','Mending'],
    },
    'vertigo shovel':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 6','Unbreaking 7','Mending'],
    },
    'vertigo hoe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 6','Unbreaking 7','Mending'],
    },
    'vertigo fishing rod':{
      type:'enchants',
      lines:['Luck of the Sea 2','Lure 2','Unbreaking 7','Mending'],
    },
    // Aerondight set
    'aerondight helmet':{
      type:'enchants',
      lines:['Protection 5','Aqua Affinity','Thorns 3','Unbreaking 7'],
    },
    'aerondight chestplate':{
      type:'enchants',
      lines:['Protection 5','Thorns 3','Unbreaking 7'],
    },
    'aerondight leggings':{
      type:'enchants',
      lines:['Protection 5','Thorns 3','Unbreaking 7'],
    },
    'aerondight boots':{
      type:'enchants',
      lines:['Frost Walker 2','Protection 5','Soul Speed 3','Depth Strider 3','Thorns 3','Unbreaking 7'],
    },
    'aerondight sword':{
      type:'enchants',
      lines:['Sharpness 5','Smite 6','Fire Aspect 2','Looting 3','Unbreaking 7','Mending'],
    },
    'aerondight bow':{
      type:'enchants',
      lines:['Power 5','Flame 2','Unbreaking 7','Mending'],
    },
    'aerondight pickaxe':{
      type:'enchants',
      lines:['Fortune 3','Efficiency 5','Unbreaking 7','Mending'],
    },
    'aerondight axe':{
      type:'enchants',
      lines:['Fortune 3','Efficiency 5','Unbreaking 7','Mending'],
    },
    'aerondight shovel':{
      type:'enchants',
      lines:['Fortune 3','Efficiency 5','Unbreaking 7','Mending'],
    },
    'aerondight hoe':{
      type:'enchants',
      lines:['Fortune 3','Efficiency 5','Unbreaking 7','Mending'],
    },
    'aerondight fishing rod':{
      type:'enchants',
      lines:['Luck of the Sea 3','Unbreaking 7','Mending'],
    },
    // Fluorite set
    'fluorite helmet':{
      type:'enchants',
      lines:['Protection 5','Blast Protection 2','Fire Protection 2','Projectile Protection 2','Respiration 3','Unbreaking 5'],
    },
    'fluorite chestplate':{
      type:'enchants',
      lines:['Protection 5','Blast Protection 2','Fire Protection 2','Projectile Protection 2','Unbreaking 5'],
    },
    'fluorite leggings':{
      type:'enchants',
      lines:['Protection 5','Blast Protection 2','Fire Protection 2','Projectile Protection 2','Unbreaking 5'],
    },
    'fluorite boots':{
      type:'enchants',
      lines:['Protection 5','Blast Protection 2','Fire Protection 2','Projectile Protection 2','Depth Strider 3','Unbreaking 5'],
    },
    'fluorite sword':{
      type:'enchants',
      lines:['Sharpness 6','Fire Aspect 2','Looting 5','Unbreaking 5','Mending'],
    },
    'fluorite bow':{
      type:'enchants',
      lines:['Power 5','Flame 2','Unbreaking 5','Infinity','Mending'],
    },
    'fluorite pickaxe':{
      type:'enchants',
      lines:['Fortune 5','Efficiency 5','Unbreaking 5','Mending'],
    },
    'fluorite axe':{
      type:'enchants',
      lines:['Fortune 5','Efficiency 5','Unbreaking 5','Mending'],
    },
    'fluorite shovel':{
      type:'enchants',
      lines:['Fortune 5','Efficiency 5','Unbreaking 5','Mending'],
    },
    'fluorite hoe':{
      type:'enchants',
      lines:['Fortune 5','Efficiency 5','Unbreaking 5','Mending'],
    },
    'fluorite fishing rod':{
      type:'enchants',
      lines:['Lure 3','Unbreaking 5','Mending'],
    },
    // Witherbone set
    'witherbone helmet':{
      type:'enchants',
      lines:['Protection 8','Fire Protection 5','Respiration 3','Aqua Affinity','Unbreakable'],
    },
    'witherbone chestplate':{
      type:'enchants',
      lines:['Protection 8','Fire Protection 5','Unbreakable'],
    },
    'witherbone leggings':{
      type:'enchants',
      lines:['Protection 8','Fire Protection 5','Swift Sneak 3','Unbreakable'],
    },
    'witherbone boots':{
      type:'enchants',
      lines:['Protection 8','Fire Protection 5','Feather Falling 4','Soul Speed 3','Depth Strider 3','Unbreakable'],
    },
    'witherbone sword':{
      type:'enchants',
      lines:['Sharpness 8','Smite 5','Bane of Arthropods 5','Sweeping Edge 3','Fire Aspect 2','Looting 3','Unbreakable'],
    },
    'witherbone bow':{
      type:'enchants',
      lines:['Infinity','Power 8','Punch 2','Unbreakable'],
    },
    'witherbone pickaxe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 8','Unbreakable'],
    },
    'witherbone axe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 8','Unbreakable'],
    },
    'witherbone shovel':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 8','Unbreakable'],
    },
    'witherbone hoe':{
      type:'enchants',
      lines:['Sharpness 8','Fortune 1','Efficiency 8','Unbreakable'],
    },
    'witherbone fishing rod':{
      type:'enchants',
      lines:['Luck of the Sea 3','Lure 5','Unbreakable'],
    },
    // Lunar set
    'lunar helmet':{
      type:'enchants',
      lines:['Protection 8','Blast Protection 2','Fire Protection 2','Projectile Protection 2','Respiration 3','Thorns 3','Unbreaking 7'],
    },
    'lunar chestplate':{
      type:'enchants',
      lines:['Protection 8','Blast Protection 2','Fire Protection 2','Projectile Protection 2','Thorns 3','Unbreaking 7'],
    },
    'lunar leggings':{
      type:'enchants',
      lines:['Protection 8','Blast Protection 2','Fire Protection 2','Projectile Protection 2','Thorns 3','Unbreaking 7'],
    },
    'lunar boots':{
      type:'enchants',
      lines:['Protection 8','Blast Protection 2','Fire Protection 2','Projectile Protection 2','Feather Falling 3','Thorns 3','Unbreaking 7'],
    },
    'lunar sword':{
      type:'enchants',
      lines:['Sharpness 8','Sweeping Edge 3','Knockback 2','Looting 3','Unbreaking 7','Mending'],
    },
    'lunar bow':{
      type:'enchants',
      lines:['Power 8','Punch 2','Unbreaking 7','Infinity','Mending'],
    },
    'lunar pickaxe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 8','Unbreaking 7','Mending'],
    },
    'lunar axe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 8','Unbreaking 7','Mending'],
    },
    'lunar shovel':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 8','Unbreaking 7','Mending'],
    },
    'lunar hoe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 8','Unbreaking 7','Mending'],
    },
    'lunar fishing rod':{
      type:'enchants',
      lines:['Luck of the Sea 2','Lure 4','Unbreaking 7','Mending'],
    },
    // Nightfall set
    'nightfall helmet':{
      type:'enchants',
      lines:['Protection 8','Fire Protection 5','Respiration 3','Aqua Affinity','Unbreakable'],
    },
    'nightfall chestplate':{
      type:'enchants',
      lines:['Protection 8','Fire Protection 5','Unbreakable'],
    },
    'nightfall leggings':{
      type:'enchants',
      lines:['Protection 8','Fire Protection 5','Swift Sneak 3','Unbreakable'],
    },
    'nightfall boots':{
      type:'enchants',
      lines:['Protection 8','Fire Protection 5','Feather Falling 4','Soul Speed 3','Depth Strider 3','Unbreakable'],
    },
    'nightfall sword':{
      type:'enchants',
      lines:['Sharpness 8','Smite 5','Bane of Arthropods 5','Sweeping Edge 3','Fire Aspect 2','Looting 3','Unbreakable'],
    },
    'nightfall bow':{
      type:'enchants',
      lines:['Infinity','Power 8','Punch 2','Unbreakable'],
    },
    'nightfall pickaxe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 8','Unbreakable'],
    },
    'nightfall axe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 8','Unbreakable'],
    },
    'nightfall shovel':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 8','Unbreakable'],
    },
    'nightfall hoe':{
      type:'enchants',
      lines:['Sharpness 8','Fortune 1','Efficiency 8','Unbreakable'],
    },
    'nightfall fishing rod':{
      type:'enchants',
      lines:['Luck of the Sea 3','Lure 5','Unbreakable'],
    },
    // Jolly set
    'jolly helmet':{
      type:'enchants',
      lines:['Protection 7','Fire Protection 5','Respiration 2','Aqua Affinity','Unbreaking 6'],
    },
    'jolly chestplate':{
      type:'enchants',
      lines:['Protection 7','Fire Protection 5','Unbreaking 6'],
    },
    'jolly leggings':{
      type:'enchants',
      lines:['Protection 7','Fire Protection 5','Swift Sneak 3','Unbreaking 6'],
    },
    'jolly boots':{
      type:'enchants',
      lines:['Protection 7','Fire Protection 5','Feather Falling 4','Depth Strider 3','Unbreaking 6'],
    },
    'jolly sword':{
      type:'enchants',
      lines:['Sharpness 7','Sweeping Edge 3','Fire Aspect 2','Looting 2','Unbreaking 6','Mending'],
    },
    'jolly bow':{
      type:'enchants',
      lines:['Power 7','Flame 2','Unbreaking 6','Mending'],
    },
    'jolly pickaxe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 7','Unbreaking 6','Mending'],
    },
    'jolly axe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 7','Unbreaking 6','Mending'],
    },
    'jolly shovel':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 7','Unbreaking 6','Mending'],
    },
    'jolly hoe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 7','Unbreaking 6','Mending'],
    },
    'jolly fishing rod':{
      type:'enchants',
      lines:['Lure 4','Unbreaking 6','Mending'],
    },
    // Rosewood set
    'rosewood helmet':{
      type:'enchants',
      lines:['Protection 8','Blast Protection 5','Fire Protection 5','Projectile Protection 5','Unbreaking 5'],
    },
    'rosewood chestplate':{
      type:'enchants',
      lines:['Protection 8','Blast Protection 5','Fire Protection 5','Projectile Protection 5','Unbreaking 5'],
    },
    'rosewood leggings':{
      type:'enchants',
      lines:['Protection 8','Blast Protection 5','Fire Protection 5','Projectile Protection 5','Unbreaking 5'],
    },
    'rosewood boots':{
      type:'enchants',
      lines:['Protection 8','Blast Protection 5','Fire Protection 5','Projectile Protection 5','Unbreaking 5'],
    },
    'rosewood sword':{
      type:'enchants',
      lines:['Sharpness 8','Smite 5','Bane of Arthropods 5','Sweeping Edge 3','Looting 3','Unbreaking 5','Mending'],
    },
    'rosewood bow':{
      type:'enchants',
      lines:['Power 8','Punch 2','Unbreaking 5','Mending'],
    },
    'rosewood pickaxe':{
      type:'enchants',
      lines:['Fortune 4','Efficiency 8','Unbreaking 5','Mending'],
    },
    'rosewood axe':{
      type:'enchants',
      lines:['Fortune 4','Efficiency 8','Unbreaking 5','Mending'],
    },
    'rosewood shovel':{
      type:'enchants',
      lines:['Fortune 4','Efficiency 8','Unbreaking 5','Mending'],
    },
    'rosewood hoe':{
      type:'enchants',
      lines:['Fortune 4','Efficiency 8','Unbreaking 5','Mending'],
    },
    'rosewood fishing rod':{
      type:'enchants',
      lines:['Luck of the Sea 4','Lure 5','Unbreaking 5','Mending'],
    },
    // Springtide set
    'springtide helmet':{
      type:'enchants',
      lines:['Protection 6','Blast Protection 5','Respiration 5','Aqua Affinity','Unbreaking 5'],
    },
    'springtide chestplate':{
      type:'enchants',
      lines:['Protection 6','Blast Protection 5','Thorns 3','Unbreaking 5'],
    },
    'springtide leggings':{
      type:'enchants',
      lines:['Protection 6','Blast Protection 5','Swift Sneak 3','Thorns 3','Unbreaking 5'],
    },
    'springtide boots':{
      type:'enchants',
      lines:['Protection 6','Blast Protection 5','Feather Falling 4','Soul Speed 3','Depth Strider 3','Thorns 3','Unbreaking 5'],
    },
    'springtide sword':{
      type:'enchants',
      lines:['Sharpness 8','Smite 5','Bane of Arthropods 5','Sweeping Edge 3','Fire Aspect 2','Looting 3','Unbreaking 5','Mending'],
    },
    'springtide bow':{
      type:'enchants',
      lines:['Power 8','Flame 2','Unbreaking 5','Infinity','Mending'],
    },
    'springtide pickaxe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 8','Unbreaking 5','Mending'],
    },
    'springtide axe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 8','Unbreaking 5','Mending'],
    },
    'springtide shovel':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 8','Unbreaking 5','Mending'],
    },
    'springtide hoe':{
      type:'enchants',
      lines:['Sharpness 8','Fortune 1','Efficiency 8','Unbreaking 5','Mending'],
    },
    'springtide fishing rod':{
      type:'enchants',
      lines:['Luck of the Sea 3','Lure 5','Unbreaking 5','Mending'],
    },
    // Manticore set
    'manticore sword':{
      type:'enchants',
      lines:['Sharpness 7','Looting 4','Unbreaking 5','Mending'],
    },
    'manticore bow':{
      type:'enchants',
      lines:['Power 7','Unbreaking 5','Mending'],
    },
    'manticore pickaxe':{
      type:'enchants',
      lines:['Fortune 4','Efficiency 7','Unbreaking 5','Mending'],
    },
    'manticore axe':{
      type:'enchants',
      lines:['Efficiency 7','Unbreaking 5','Mending'],
    },
    'manticore shovel':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 7','Unbreaking 5','Mending'],
    },
    'manticore hoe':{
      type:'enchants',
      lines:['Fortune 4','Efficiency 7','Unbreaking 5','Mending'],
    },
    'manticore fishing rod':{
      type:'enchants',
      lines:['Luck of the Sea 3','Lure 4','Unbreaking 5','Mending'],
    },
    'manticore elytra':{
      type:'enchants',
      lines:['Protection 5','Unbreaking 5','Mending'],
    },
    // Pandora set
    'pandora helmet':{
      type:'enchants',
      lines:['Protection 9','Fire Protection 5','Respiration 3','Aqua Affinity','Mending'],
    },
    'pandora chestplate':{
      type:'enchants',
      lines:['Protection 9','Fire Protection 5','Unbreaking 8','Mending'],
    },
    'pandora leggings':{
      type:'enchants',
      lines:['Protection 9','Fire Protection 5','Swift Sneek 3','Unbreaking 8','Mending'],
    },
    'pandora boots':{
      type:'enchants',
      lines:['Protection 9','Fire Protection 5','Feather Falling 5','Soul Speed 2','Depth Strider 3','Unbreaking 8','Mending'],
    },
    'pandora sword':{
      type:'enchants',
      lines:['Sharpness 9','Smite 5','Bane of Arthropods 5','Fire Aspect 3','Knockback 2','Looting 3','Unbreaking 8','Mending'],
    },
    'pandora bow':{
      type:'enchants',
      lines:['Power 9','Flame 3','Unbreaking 8','Infinity','Mending'],
    },
    'pandora pickaxe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 9','Unbreaking 8','Mending'],
    },
    'pandora axe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 9','Unbreaking 8','Mending'],
    },
    'pandora shovel':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 9','Unbreaking 8','Mending'],
    },
    'pandora hoe':{
      type:'enchants',
      lines:['Silk Touch','Efficiency 9','Unbreaking 8','Mending'],
    },
    'pandora fishing rod':{
      type:'enchants',
      lines:['Luck of the Sea 4','Lure 4','Unbreaking 8','Mending'],
    },
    // Silversnow set
    'silversnow helmet':{
      type:'enchants',
      lines:['Protection 7','Blast Protection 5','Respiration 3','Aqua Affinity','Unbreaking 6','Mending'],
    },
    'silversnow chestplate':{
      type:'enchants',
      lines:['Protection 7','Blast Protection 5','Unbreaking 6','Mending'],
    },
    'silversnow leggings':{
      type:'enchants',
      lines:['Protection 7','Blast Protection 5','Swift Sneak 2','Unbreaking 6','Mending'],
    },
    'silversnow boots':{
      type:'enchants',
      lines:['Protection 7','Blast Protection 5','Feather Falling 4','Soul Speed 3','Frost Walker 3','Unbreaking 6','Mending'],
    },
    'silversnow sword':{
      type:'enchants',
      lines:['Sharpness 7','Smite 6','Sweeping Edge 3','Knockback 2','Looting 4','Unbreaking 6','Mending'],
    },
    'silversnow bow':{
      type:'enchants',
      lines:['Power 7','Punch 2','Unbreaking 6','Infinity','Mending'],
    },
    'silversnow pickaxe':{
      type:'enchants',
      lines:['Efficiency 7','Fortune 4','Unbreaking 6','Mending'],
    },
    'silversnow axe':{
      type:'enchants',
      lines:['Efficiency 7','Fortune 4','Unbreaking 6','Mending'],
    },
    'silversnow shovel':{
      type:'enchants',
      lines:['Efficiency 7','Fortune 4','Unbreaking 6','Mending'],
    },
    'silversnow hoe':{
      type:'enchants',
      lines:['Efficiency 7','Fortune 4','Unbreaking 6','Mending'],
    },
    'silversnow fishing rod':{
      type:'enchants',
      lines:['Luck of the Sea 4','Lure 5','Unbreaking 6','Mending'],
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