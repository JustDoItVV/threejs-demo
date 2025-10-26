'use client';

import dynamic from 'next/dynamic';

interface ProjectCanvasProps {
  slug: string;
}

const AnimatedScene = dynamic(
  () => import('./animated-scene').then((mod) => ({ default: mod.AnimatedScene })),
  { ssr: false }
);

export function ProjectCanvas({ slug }: ProjectCanvasProps) {
  switch (slug) {
    case 'animated-scene':
      return <AnimatedScene />;
    case 'product-showcase':
      return (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-xl text-muted-foreground">Product Showcase - Coming Soon</p>
        </div>
      );
    case 'interactive-game':
      return (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-xl text-muted-foreground">Interactive Game - Coming Soon</p>
        </div>
      );
    default:
      return (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-xl text-muted-foreground">Three.js Canvas - Coming Soon</p>
        </div>
      );
  }
}
