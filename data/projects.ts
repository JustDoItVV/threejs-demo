import { Project } from '@/types';

export const Projects: Project[] = [
  {
    slug: 'animated-scene',
    title: 'Animated 3D Scene',
    description:
      'Interactive 3D model with orbital controls, custom shaders, and particle effects. Features smooth animations and dynamic lighting.',
    thumbnail: '/projects-screens/3d-animation.png',
    tags: ['Three.js', 'GLSL', 'Particles', 'Animation'],
  },
  {
    slug: 'product-showcase',
    title: '3D Product Showcase',
    description:
      'Professional product viewer with zoom, rotate controls, and customizable materials. Perfect for e-commerce presentations.',
    thumbnail: '/projects-screens/product-showcase.png',
    tags: ['Three.js', 'GLTF', 'Materials', 'Interactive'],
  },
  {
    slug: 'interactive-game',
    title: 'Froggy Road',
    description:
      'Crossy Road inspired 3D game with procedural generation, collision detection, and post-processing effects. Help the frog cross infinite lanes!',
    thumbnail: '',
    tags: ['Three.js', 'Game', 'Post-processing', 'Procedural'],
  },
];

