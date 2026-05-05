// ============================================================
//  MODHUB — TES PLUGINS
//  Modifie ce fichier pour ajouter / modifier tes plugins
//  Chaque plugin a un price_id Stripe (voir README.md)
// ============================================================

const PLUGINS = [
  {
    id: 1,
    name: 'FPS BOOST X',
    icon: '⚡',
    ic: 'ic-c',
    badge: 'hot',       // new | hot | free | pro
    bc: 'b-hot',
    cat: 'performance', // performance | visuel | gameplay
    desc: 'Optimisation radicale — jusqu\'à +40% FPS sur CPU limité.',
    long: 'FPS Boost X analyse en temps réel la charge CPU et GPU de ton jeu pour injecter des optimisations dynamiques. Fonctionne avec la majorité des moteurs modernes (Unreal, Unity, Source). Aucune modification de fichiers système. Installation en 30 secondes, résultats immédiats.',
    tags: ['FPS', 'CPU', 'Multi-jeux'],
    price: 9.99,
    old: null,          // null = pas de prix barré
    stars: 5,
    reviews: 142,
    feats: [
      'Boost FPS jusqu\'à +40%',
      'Compatible Unreal / Unity / Source',
      'Dashboard temps réel',
      'Aucun ban détecté',
      'Mises à jour gratuites à vie'
    ],
    // ⚠️ Remplace par ton vrai Price ID Stripe (ex: price_1ABC...)
    stripe_price_id: 'price_REMPLACE_MOI_1',
    versions: [
      { v: '2.1', d: 'Mars 2025', n: 'Optimisation Unreal Engine 5.3, fix multi-thread' },
      { v: '2.0', d: 'Jan 2025',  n: 'Refonte moteur + support AMD Ryzen 7000' },
      { v: '1.5', d: 'Oct 2024',  n: 'Fix fuite mémoire + amélioration stabilité' }
    ]
  },
  {
    id: 2,
    name: 'SHADOW ULTRA',
    icon: '🌑',
    ic: 'ic-v',
    badge: 'new',
    bc: 'b-new',
    cat: 'visuel',
    desc: 'Pack d\'ombres dynamiques haute qualité pour moteurs modernes.',
    long: 'Shadow Ultra remplace le moteur d\'ombres natif par un système basé sur ray-tracing logiciel, compatible avec les cartes sans RT hardware. Résolution des ombres x4, distance d\'affichage doublée. Impact minimal sur les performances, personnalisation complète via fichier config.',
    tags: ['Ombres', 'Shader', 'Visuel'],
    price: 14.99,
    old: 19.99,
    stars: 4,
    reviews: 87,
    feats: [
      'Ray-tracing logiciel universel',
      'Résolution d\'ombres x4',
      'Compatible tous GPU (pas de RT requis)',
      'Config avancée par fichier JSON',
      'Preset haute perf inclus'
    ],
    stripe_price_id: 'price_REMPLACE_MOI_2',
    versions: [
      { v: '1.2', d: 'Avr 2025', n: 'Support GPU Intel Arc + fix artefacts' },
      { v: '1.1', d: 'Fév 2025', n: 'Fix artefacts AMD RX 6000 en 4K' },
      { v: '1.0', d: 'Déc 2024', n: 'Sortie initiale' }
    ]
  },
  {
    id: 3,
    name: 'AUTO AIM PRO',
    icon: '🎯',
    ic: 'ic-p',
    badge: 'pro',
    bc: 'b-pro',
    cat: 'gameplay',
    desc: 'Assistant de visée adaptatif et configurable par jeu.',
    long: 'Auto Aim Pro est un assistant de visée overlay sans modification de fichiers jeu. Profils prédéfinis pour 50+ FPS populaires. Réglage fin de la force, vitesse de snap, rayon de détection. Overlay discret activable par raccourci. Aucune injection de DLL, fonctionne en dehors du jeu.',
    tags: ['Aim', 'FPS', 'Config'],
    price: 19.99,
    old: null,
    stars: 5,
    reviews: 213,
    feats: [
      '50+ jeux FPS supportés',
      'Profils sauvegardés par jeu',
      'Activation par raccourci clavier',
      'Overlay discret plein-écran',
      'Mises à jour profils mensuelles'
    ],
    stripe_price_id: 'price_REMPLACE_MOI_3',
    versions: [
      { v: '3.4', d: 'Avr 2025', n: 'Ajout profil Valorant, XDefiant, Delta Force' },
      { v: '3.3', d: 'Fév 2025', n: 'Fix compatibilité anti-cheat EAC' },
      { v: '3.0', d: 'Nov 2024', n: 'Refonte complète système de profils' }
    ]
  },
  {
    id: 4,
    name: 'HUD FORGE',
    icon: '🖥️',
    ic: 'ic-a',
    badge: 'new',
    bc: 'b-new',
    cat: 'visuel',
    desc: 'Éditeur de HUD temps réel — couleurs, positions, opacité.',
    long: 'HUD Forge est un éditeur visuel drag-and-drop pour personnaliser l\'interface en jeu. Modifie couleurs, tailles, positions et opacité de chaque élément HUD en temps réel. Exporte tes configurations, importe celles de la communauté. Compatible avec les moteurs acceptant les overlays.',
    tags: ['HUD', 'UI', 'Overlay'],
    price: 7.99,
    old: null,
    stars: 4,
    reviews: 55,
    feats: [
      'Éditeur drag-and-drop temps réel',
      'Export / import de configurations',
      '50+ éléments HUD modifiables',
      'Thèmes communauté inclus',
      'Prévisualisation avant/après'
    ],
    stripe_price_id: 'price_REMPLACE_MOI_4',
    versions: [
      { v: '1.1', d: 'Mars 2025', n: 'Ajout de 20 thèmes communauté' },
      { v: '1.0', d: 'Jan 2025',  n: 'Première version publique' }
    ]
  },
  {
    id: 5,
    name: 'QUICK LOOT',
    icon: '💎',
    ic: 'ic-g',
    badge: 'free',
    bc: 'b-free',
    cat: 'gameplay',
    desc: 'Ramassage automatique des items rares en zone de combat.',
    long: 'Quick Loot détecte automatiquement les items au sol selon leur rareté (configurable) et les ramasse sans intervention. Fonctionne en overlay compatible avec les RPG et Battle Royale. Entièrement gratuit et open-source. Filtres par type d\'item, rareté minimale, distance maximale.',
    tags: ['Loot', 'Auto', 'RPG'],
    price: 0,
    old: null,
    stars: 4,
    reviews: 320,
    feats: [
      'Détection automatique par rareté',
      'Filtres personnalisables',
      'Compatible RPG & Battle Royale',
      '100% gratuit & open-source',
      'Config par fichier JSON'
    ],
    stripe_price_id: null, // gratuit = pas de Stripe
    versions: [
      { v: '2.3', d: 'Avr 2025', n: 'Support Elden Ring DLC + Path of Exile 2' },
      { v: '2.2', d: 'Jan 2025', n: 'Fix crash sur inventaire plein' }
    ]
  },
  {
    id: 6,
    name: 'NET SYNC',
    icon: '🌐',
    ic: 'ic-c',
    badge: 'pro',
    bc: 'b-pro',
    cat: 'performance',
    desc: 'Réduction de latence réseau et anti-rubber band intégré.',
    long: 'Net Sync optimise ta pile réseau Windows pour les jeux en ligne : priorisation des paquets UDP, réduction du buffer bloat, détection et correction du rubber band. Gain moyen de 15 à 30ms selon la configuration réseau. Rapport live de la qualité de connexion inclus.',
    tags: ['Réseau', 'Lag', 'Online'],
    price: 12.99,
    old: 16.99,
    stars: 5,
    reviews: 98,
    feats: [
      'Réduction latence moyenne -15 à -30ms',
      'Anti-rubber band automatique',
      'Optimisation paquets UDP prioritaires',
      'Rapport réseau en temps réel',
      'Compatible Ethernet & Wi-Fi'
    ],
    stripe_price_id: 'price_REMPLACE_MOI_6',
    versions: [
      { v: '1.8', d: 'Mars 2025', n: 'Support Wi-Fi 6E + fix routeurs Asus' },
      { v: '1.7', d: 'Jan 2025',  n: 'Fix compatibilité Xbox GameBar' },
      { v: '1.5', d: 'Nov 2024',  n: 'Ajout rapport réseau live' }
    ]
  }
];
