import { Project } from '@/types';

export const Projects: Project[] = [
  {
    slug: 'blockchain-city',
    title: 'Blockchain City',
    description:
      'Interactive 3D blockchain visualization where each block is represented as a building in a growing city. Building height reflects transaction count, with color-coded activity levels. Features real-time block mining, auto-mining mode, transaction particles, and detailed block exploration. Click buildings to view transactions and block details.',
    thumbnail: '/projects-screens/blockchain-city.png',
    tags: ['Blockchain', 'Web3', 'Visualization', 'Interactive', 'Particles', 'Animation'],
  },
  {
    slug: 'rogue',
    title: 'Rogue',
    description:
      'Classic turn-based roguelike dungeon crawler with procedural level generation featuring 7 levels of increasing difficulty. Sprite-based visualization for character and enemies. Turn-based tactical combat with smooth attack animations. Character progression system (HP, Dex, Str). Full inventory management with backpack. Dynamic fog of war. Persistent save/load system with player leaderboard.',
    thumbnail: '/projects-screens/rogue.png',
    tags: ['Game', 'Roguelike', 'Turn-based', 'Sprites', 'Fog of War', 'Inventory', 'Procedural'],
    features: [
      'Entity-Component architecture with MVC pattern - separates game logic (entities), state management (Zustand store with modular slices), and view layer (React Three Fiber components)',
      'Procedural dungeon generation with intelligent enemy placement - creates random 3x3 room grid, guarantees minimum enemies per room based on size (1 for small ≤16 tiles, 2 for medium 17-35, 3 for large ≥36), ensuring balanced difficulty distribution',
      'Turn-based combat system with smooth attack animations - hit chance based on DEX stat, damage calculation (STR + weapon bonus), and fast attack animation (0.5 tile lunge forward/back in 200ms) for both character and 5 enemy types with unique AI patterns',
      'Advanced keyboard controls via @react-three/drei - subscription-based input handling instead of window events, supporting movement, inventory management, item usage (1-9 keys), and drop commands (d1-d9)',
      'Backpack system with persistent modal state - 10-slot inventory with real-time UI filter synchronization, stays open after item use/drop for convenient management, displays gold value for treasure items, and supports category filtering (weapons, food, elixirs, scrolls)',
      'Fog of war implementation with room discovery - tracks visited and seen rooms, reveals corridors on exploration, creating tactical visibility mechanics',
      'Sprite-based rendering pipeline - pixelated texture atlas system with hash-based sprite variants, optimized for retro aesthetic with CSS imageRendering property',
      'Custom save/load system with circular reference handling - serializes game state to localStorage with smart room reference conversion (room objects → IDs), preserves character position, inventory, stats, and level progress',
      'Player progression tracking with leaderboard - saves player name to localStorage, calculates weighted total score (gold + level×10 + enemies×5 + consumables), displays top 10 high scores with player names and dates',
      'Zustand state management with dependency injection - modular slice architecture (game, debug, camera, view-mode) with clean separation of concerns and testable controller pattern',
    ],
  },
  {
    slug: 'froggy-road',
    title: 'Froggy Road',
    description:
      'Crossy Road clone with isometric orthographic camera, procedural infinite lane generation, platform riding mechanics, and post-processing effects. Control with arrow keys or WASD, press R to restart or Esc to exit.',
    thumbnail: '/projects-screens/froggy-road.png',
    tags: ['Game', 'Isometric', 'Procedural'],
    features: [
      'Object Pool Pattern implementation - lane templates are pre-generated and reused, eliminating generation cost during critical jump animations and preventing FPS drops on weak systems',
      'Procedural infinite level generation with 3 lane types (grass, road, water)',
      'Platform riding mechanics - frog position syncs with moving logs and lilypads',
      'Collision detection system for obstacles and environmental hazards',
      'Post-processing effects stack: Bloom, Vignette, and Chromatic Aberration',
      'Smooth hop animation with cubic ease-out easing function',
      'Performance-optimized rendering with meshLambertMaterial and visibility culling',
      'Zustand state management with modular slice architecture',
      'Weighted randomization for lane type selection with consecutive limits',
    ],
  },
  {
    slug: 'product-showcase',
    title: '3D Product Showcase',
    description:
      'iPhone 14 Pro model viewer with interactive screen UI, swipeable app icons, camera view, and customizable materials (color, metalness, roughness). Professional lighting setup with environment reflections.',
    thumbnail: '/projects-screens/product-showcase.png',
    tags: ['GLTF', 'Interactive UI', 'Materials'],
  },
  {
    slug: 'animated-scene',
    title: 'Animated 3D Scene',
    description:
      'Interactive TorusKnot with custom GLSL vertex and fragment shaders, 3000 animated particles with color gradients, and orbital camera controls. Features smooth animations and dynamic lighting.',
    thumbnail: '/projects-screens/3d-animation.png',
    tags: ['GLSL', 'Particles', 'OrbitControls'],
  },
];

