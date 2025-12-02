import { StateCreator } from 'zustand';

export type LoadingStage = 'idle' | 'fetching' | 'parsing' | 'processing' | 'complete' | 'error';

export interface LoadingSlice {
  isLoading: boolean;
  loadingStage: LoadingStage;
  loadingProgress: number;
  loadingMessage: string;
  loadingError: string | null;

  setLoading: (loading: boolean) => void;
  setLoadingStage: (stage: LoadingStage) => void;
  setLoadingProgress: (progress: number) => void;
  setLoadingMessage: (message: string) => void;
  setLoadingError: (error: string | null) => void;
  resetLoading: () => void;
}

export const createLoadingSlice: StateCreator<
  LoadingSlice,
  [],
  [],
  LoadingSlice
> = (set) => ({
  isLoading: false,
  loadingStage: 'idle',
  loadingProgress: 0,
  loadingMessage: '',
  loadingError: null,

  setLoading: (loading) => set({ isLoading: loading }),

  setLoadingStage: (stage) => set({ loadingStage: stage }),

  setLoadingProgress: (progress) => set({ loadingProgress: Math.min(100, Math.max(0, progress)) }),

  setLoadingMessage: (message) => set({ loadingMessage: message }),

  setLoadingError: (error) => set({ loadingError: error }),

  resetLoading: () =>
    set({
      isLoading: false,
      loadingStage: 'idle',
      loadingProgress: 0,
      loadingMessage: '',
      loadingError: null,
    }),
});
