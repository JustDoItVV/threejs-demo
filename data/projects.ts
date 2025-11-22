import { Project } from '@/types';

export const Projects: Project[] = [
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
      'Advanced 3D model viewer supporting multiple formats (GLB, GLTF, FBX, OBJ) with file upload and URL loading (max 2GB). Features component-level material customization (color, metalness, roughness, custom textures), perspective/orthographic camera modes, preset camera views, and default iPhone 14 Pro model library. Professional lighting with environment reflections.',
    thumbnail: '/projects-screens/product-showcase.png',
    tags: ['GLTF', 'Multi-Format', 'Materials', 'Camera Modes', 'Upload', 'Textures'],
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

