import { Project } from '@/types';

export const Projects: Project[] = [
  {
    slug: 'blockchain-city',
    title: 'Blockchain City',
    description:
      'Interactive 3D blockchain visualization where each block is represented as a building in a growing city. Building height reflects transaction count, with color-coded activity levels. Features real-time block mining, auto-mining mode, transaction particles, and detailed block exploration. Click buildings to view transactions and block details.',
    thumbnail: '/projects-screens/blockchain-city.png',
    tags: ['Blockchain', 'Web3', 'Interactive', 'Particles'],
  },
  {
    slug: 'rogue',
    title: 'Rogue',
    description:
      'Classic turn-based roguelike dungeon crawler with procedural level generation featuring 7 levels of increasing difficulty. Sprite-based visualization for character and enemies. Turn-based tactical combat with smooth attack animations. Character progression system (HP, Dex, Str). Full inventory management with backpack. Dynamic fog of war. Persistent save/load system with player leaderboard.',
    thumbnail: '/projects-screens/rogue.png',
    tags: ['Game', 'Roguelike', 'Turn-based', 'Sprites', 'Procedural'],
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
    slug: '3d-model-viewer',
    title: '3D Model Viewer',
    description:
      'Professional 3D model viewer supporting multiple formats (GLB, GLTF, FBX, OBJ) with async file upload. Features real-time loading progress, component-level material customization (color, metalness, roughness, custom textures with debounced updates), perspective/orthographic camera modes with CameraControls, preset camera views (Front, Side, Top, Angle), automatic model framing with fitToBox, and default model library. Professional lighting with environment reflections.',
    thumbnail: '/projects-screens/3d-model-viewer.png',
    tags: ['GLTF', 'Multi-Format', 'Materials', 'Camera Modes', 'Upload'],
    features: [
      'Multi-format 3D model loading system - supports GLB, GLTF, FBX, and OBJ formats with dedicated loaders from three-stdlib, handles large files up to 2GB with streaming, and includes format detection from file extensions',
      'Async file upload with real-time progress tracking - uses FileReader API for local files, displays loading stages (fetching, parsing, processing, complete), shows percentage progress with visual feedback, and handles errors with user-friendly messages',
      'Component-level material customization system - extracts and tracks individual meshes from loaded models with unique IDs, allows per-component material settings (color, metalness, roughness, texture), and supports material type presets (metallic, matte, glossy, standard)',
      'Performance-optimized color picker with throttling - throttled updates at 16ms (~60fps) to prevent lag during color dragging, checks material property changes before applying (color.equals, metalness/roughness comparison), and only triggers needsUpdate for texture changes',
      'Advanced camera system with CameraControls - dual camera modes (perspective/orthographic) with smooth transitions, preset views (Front, Side, Top, Angle) with animated camera movements, automatic model framing using fitToBox with padding, and angle preset triggered automatically on model load',
      'Intelligent model bounds calculation - computes bounding box from all meshes, centers camera target on model center, calculates optimal distance based on max dimension, and maintains consistent framing across different model sizes',
      'Custom texture upload system - supports image files up to 10MB with validation, converts to base64 data URLs for immediate display, uses TextureLoader with caching to prevent reload, and shows live preview with proper cleanup on removal',
      'Zustand state management with functional updates - supports both direct and callback-based state updates (setComponentsSettings with prev => pattern), modular slice architecture (model, mesh, camera, settings, loading, view-mode), and proper TypeScript typing for state mutations',
      'Flexible model source system - handles both local file uploads and URL-based loading, validates file formats before processing, manages loading states and error messages, and includes 12 default models sorted by file size for quick testing',
      'Material application optimization - traverses scene only once per update, caches mesh references by userData.meshId, applies settings only when values change (color.copy instead of new Color), and batches material updates efficiently',
    ],
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

