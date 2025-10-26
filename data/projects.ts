import { Project } from '@/types';

export const Projects: Project[] = [
  {
    slug: 'animated-scene',
    title: 'Animated 3D Scene',
    description:
      'Interactive 3D model with orbital controls, custom shaders, and particle effects. Features smooth animations and dynamic lighting.',
    thumbnail: '/images/projects/animated-scene.jpg',
    tags: ['Three.js', 'GLSL', 'Particles', 'Animation'],
  },
  {
    slug: 'product-showcase',
    title: '3D Product Showcase',
    description:
      'Professional product viewer with zoom, rotate controls, and customizable materials. Perfect for e-commerce presentations.',
    thumbnail: '/images/projects/product-showcase.jpg',
    tags: ['Three.js', 'GLTF', 'Materials', 'Interactive'],
  },
  {
    slug: 'interactive-game',
    title: 'Interactive Game',
    description:
      '3D game with physics, user controls, and post-processing effects including bloom and chromatic aberration.',
    thumbnail: '/images/projects/interactive-game.jpg',
    tags: ['Three.js', 'Physics', 'Post-processing', 'Game'],
  },
];

