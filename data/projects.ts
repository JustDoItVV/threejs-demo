import { Project } from '@/types';

export const Projects: Project[] = [
  {
    slug: 'city-map',
    title: '3D City Map',
    description:
      'Interactive 3D map of Moscow center (Red Square area) with switchable 2D/3D camera views. Features include real buildings with heights, roads, parks, and water. Dynamic weather system (rain, snow, fog), animated traffic, 3D landmark markers, and distance measurement tool. Built with OpenStreetMap data.',
    thumbnail: '/projects-screens/city-map.png',
    tags: ['Map', '3D', 'OSM', 'Interactive', 'Weather', 'Traffic', 'Measurement'],
  },
  {
    slug: 'rogue',
    title: 'Rogue',
    description:
      'Classic turn-based roguelike dungeon crawler with procedural level generation featuring 7 levels of increasing difficulty. Sprite-based visualization for character and enemies. Turn-based tactical combat and character progression system (HP, Dex, Str). Full inventory management with backpack. Dynamic fog of war.',
    thumbnail: '/projects-screens/rogue.png',
    tags: ['Game', 'Roguelike', 'Turn-based', 'Sprites', 'Fog of War', 'Inventory', 'Procedural'],
  },
  {
    slug: 'froggy-road',
    title: 'Froggy Road',
    description:
      'Crossy Road clone with isometric orthographic camera, procedural infinite lane generation, platform riding mechanics, and post-processing effects. Control with arrow keys or WASD, press R to restart or Esc to exit.',
    thumbnail: '/projects-screens/froggy-road.png',
    tags: ['Game', 'Isometric', 'Procedural'],
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

