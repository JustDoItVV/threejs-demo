import { useCallback, useRef } from 'react';

import type { LoadingProgress, PointCloudData } from '../types';

interface WorkerMessage {
  type: 'parse';
  file: File;
}

interface WorkerResponse {
  type: 'success' | 'error' | 'progress';
  data?: PointCloudData;
  progress?: LoadingProgress;
  error?: string;
}

export function usePointCloudWorker() {
  const workerRef = useRef<Worker | null>(null);

  const parseFile = useCallback(
    (
      file: File,
      onProgress?: (progress: LoadingProgress) => void,
      onSuccess?: (data: PointCloudData) => void,
      onError?: (error: string) => void
    ) => {
      // Create worker if it doesn't exist
      if (!workerRef.current) {
        // Note: For Next.js with Turbopack, we need to use the worker directly
        // In production, this should be bundled properly
        workerRef.current = new Worker(
          new URL('../workers/parser.worker.ts', import.meta.url),
          { type: 'module' }
        );
      }

      const worker = workerRef.current;

      // Set up message handler
      const handleMessage = (e: MessageEvent<WorkerResponse>) => {
        const { type, data, progress, error } = e.data;

        switch (type) {
          case 'progress':
            if (progress && onProgress) {
              onProgress(progress);
            }
            break;

          case 'success':
            if (data && onSuccess) {
              onSuccess(data);
            }
            // Clean up listener
            worker.removeEventListener('message', handleMessage);
            break;

          case 'error':
            if (error && onError) {
              onError(error);
            }
            // Clean up listener
            worker.removeEventListener('message', handleMessage);
            break;
        }
      };

      worker.addEventListener('message', handleMessage);

      // Send file to worker for parsing
      worker.postMessage({ type: 'parse', file } as WorkerMessage);
    },
    []
  );

  const terminate = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
  }, []);

  return { parseFile, terminate };
}
