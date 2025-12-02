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

const ModelViewer = dynamic(
  () => import('../../threejs-apps/3d-model-viewer').then((mod) => ({ default: mod.ModelViewer })),
  { ssr: false, loading: () => <LoadingCanvas /> }
);

const RogueGame = dynamic(
  () => import('../../threejs-apps/rogue').then((mod) => ({ default: mod.RogueGame })),
  { ssr: false, loading: () => <LoadingCanvas /> }
);

const BlockchainCityVisualization = dynamic(
  () =>
    import('../../threejs-apps/blockchain-city').then((mod) => ({
      default: mod.BlockchainCityVisualization,
    })),
  { ssr: false, loading: () => <LoadingCanvas /> }
);

const FroggyRoad = dynamic(
  () => import('../../threejs-apps/froggy-road').then((mod) => ({ default: mod.FroggyRoad })),
  { ssr: false, loading: () => <LoadingCanvas /> }
);

export function ProjectCanvas({ slug }: ProjectCanvasProps) {
  return (
    <ErrorBoundary>
      {(() => {
        switch (slug) {
          case 'blockchain-city':
            return <BlockchainCityVisualization />;
          case 'animated-scene':
            return <AnimatedScene />;
          case '3d-model-viewer':
            return <ModelViewer />;
          case 'froggy-road':
            return <FroggyRoad />;
          case 'rogue':
            return <RogueGame />;
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
