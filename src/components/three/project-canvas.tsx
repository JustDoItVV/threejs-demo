'use client';

import dynamic from 'next/dynamic';

interface ProjectCanvasProps {
  slug: string;
}

const AnimatedScene = dynamic(
  () => import('./animated-scene').then((mod) => ({ default: mod.AnimatedScene })),
  { ssr: false }
);

const ProductShowcase = dynamic(
  () => import('./product-showcase').then((mod) => ({ default: mod.ProductShowcase })),
  { ssr: false }
);

const InteractiveGame = dynamic(
  () => import('./interactive-game').then((mod) => ({ default: mod.InteractiveGame })),
  { ssr: false }
);

export function ProjectCanvas({ slug }: ProjectCanvasProps) {
  switch (slug) {
    case 'animated-scene':
      return <AnimatedScene />;
    case 'product-showcase':
      return <ProductShowcase />;
    case 'interactive-game':
      return <InteractiveGame />;
    default:
      return (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-xl text-muted-foreground">Three.js Canvas - Coming Soon</p>
        </div>
      );
  }
}
