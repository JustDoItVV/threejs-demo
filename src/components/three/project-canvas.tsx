'use client';

import dynamic from 'next/dynamic';

interface ProjectCanvasProps {
  slug: string;
}

function LoadingCanvas() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-muted/50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="text-sm text-muted-foreground">Loading Three.js scene...</p>
    </div>
  );
}

const AnimatedScene = dynamic(
  () => import('./animated-scene').then((mod) => ({ default: mod.AnimatedScene })),
  { ssr: false, loading: () => <LoadingCanvas /> }
);

const ProductShowcase = dynamic(
  () => import('./product-showcase').then((mod) => ({ default: mod.ProductShowcase })),
  { ssr: false, loading: () => <LoadingCanvas /> }
);

const InteractiveGame = dynamic(
  () => import('./interactive-game').then((mod) => ({ default: mod.InteractiveGame })),
  { ssr: false, loading: () => <LoadingCanvas /> }
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
