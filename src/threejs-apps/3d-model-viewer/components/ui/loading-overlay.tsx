'use client';

import { useStore } from '../../store';

export function LoadingOverlay() {
  const isLoading = useStore((state) => state.isLoading);
  const loadingStage = useStore((state) => state.loadingStage);
  const loadingProgress = useStore((state) => state.loadingProgress);
  const loadingMessage = useStore((state) => state.loadingMessage);
  const loadingError = useStore((state) => state.loadingError);

  if (!isLoading && !loadingError) return null;

  const getStageLabel = () => {
    switch (loadingStage) {
      case 'fetching':
        return 'Fetching file...';
      case 'parsing':
        return 'Parsing model...';
      case 'processing':
        return 'Processing meshes...';
      case 'complete':
        return 'Complete!';
      case 'error':
        return 'Error';
      default:
        return 'Loading...';
    }
  };

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-background/95 border rounded-lg p-6 max-w-md w-full mx-4 space-y-4">
        {loadingError ? (
          <>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-destructive">Loading Failed</h3>
              <p className="text-sm text-muted-foreground">{loadingError}</p>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">{getStageLabel()}</h3>
              {loadingMessage && <p className="text-sm text-muted-foreground">{loadingMessage}</p>}
            </div>

            <div className="space-y-2">
              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-300 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{loadingProgress}%</span>
                <span>{getStageLabel()}</span>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
