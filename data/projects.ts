import { Project } from '@/types';

export const Projects: Project[] = [
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

