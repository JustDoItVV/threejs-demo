'use client';

import dynamic from 'next/dynamic';

import { ErrorBoundary } from '../error-boundary';

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
  () => import('../../threejs-apps/animated-scene').then((mod) => ({ default: mod.AnimatedScene })),
  { ssr: false, loading: () => <LoadingCanvas /> }
);

const ProductShowcase = dynamic(
  () =>
    import('../../threejs-apps/product-showcase').then((mod) => ({ default: mod.ProductShowcase })),
  { ssr: false, loading: () => <LoadingCanvas /> }
);

const InteractiveGame = dynamic(
  () => import('../../threejs-apps/froggy-road').then((mod) => ({ default: mod.InteractiveGame })),
  { ssr: false, loading: () => <LoadingCanvas /> }
);

const RogueGame = dynamic(
  () => import('../../threejs-apps/rogue').then((mod) => ({ default: mod.RogueGame })),
  { ssr: false, loading: () => <LoadingCanvas /> }
);

const PointCloudViewer = dynamic(
  () => import('../../threejs-apps/point-cloud-viewer').then((mod) => ({ default: mod.PointCloudViewer })),
  { ssr: false, loading: () => <LoadingCanvas /> }
);

export function ProjectCanvas({ slug }: ProjectCanvasProps) {
  return (
    <ErrorBoundary>
      {(() => {
        switch (slug) {
          case 'animated-scene':
            return <AnimatedScene />;
          case 'product-showcase':
            return <ProductShowcase />;
          case 'froggy-road':
            return <InteractiveGame />;
          case 'rogue':
            return <RogueGame />;
          case 'point-cloud-viewer':
            return <PointCloudViewer />;
          default:
            return (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-xl text-muted-foreground">Three.js Canvas - Coming Soon</p>
              </div>
            );
        }
      })()}
    </ErrorBoundary>
  );
}
