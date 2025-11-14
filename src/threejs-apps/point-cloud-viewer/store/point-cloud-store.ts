'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import {
  CameraMode,
  FirstPersonCameraConfig,
  LoadingProgress,
  OrthographicCameraConfig,
  PointCloudData,
  PointCloudMetrics,
  ViewMode,
} from '../types';
import {
  DEFAULT_FIRST_PERSON_CONFIG,
  DEFAULT_ORTHOGRAPHIC_CONFIG,
  VIEWER_CONFIG,
} from '../config/viewer.config';

interface PointCloudStore {
  // === Point Cloud Data ===
  pointCloud: PointCloudData | null;
  isLoading: boolean;
  loadingProgress: LoadingProgress | null;
  error: string | null;
  metrics: PointCloudMetrics | null;

  // === Camera State ===
  cameraMode: CameraMode;
  orthographicConfig: OrthographicCameraConfig;
  firstPersonConfig: FirstPersonCameraConfig;

  // === Rendering Settings ===
  pointSize: number;
  pointBudget: number;
  showBounds: boolean;
  showGrid: boolean;
  showStats: boolean;
  useLOD: 'simple' | 'octree';

  // === UI State ===
  showControlPanel: boolean;
  showFileLoader: boolean;
  showHelp: boolean;
  viewMode: ViewMode;

  // === Actions ===
  setPointCloud: (data: PointCloudData | null) => void;
  setLoading: (loading: boolean) => void;
  setLoadingProgress: (progress: LoadingProgress | null) => void;
  setError: (error: string | null) => void;
  setMetrics: (metrics: PointCloudMetrics | null) => void;

  // Camera actions
  setCameraMode: (mode: CameraMode) => void;
  updateOrthographicConfig: (config: Partial<OrthographicCameraConfig>) => void;
  updateFirstPersonConfig: (config: Partial<FirstPersonCameraConfig>) => void;
  resetCamera: () => void;

  // Rendering actions
  setPointSize: (size: number) => void;
  setPointBudget: (budget: number) => void;
  toggleBounds: () => void;
  toggleGrid: () => void;
  toggleStats: () => void;
  setUseLOD: (mode: 'simple' | 'octree') => void;

  // UI actions
  toggleControlPanel: () => void;
  toggleFileLoader: () => void;
  toggleHelp: () => void;
  setViewMode: (mode: ViewMode) => void;

  // Reset
  reset: () => void;
}

// Custom serializer for devtools to avoid JSON.stringify errors with large Float32Arrays
const devtoolsOptions = {
  name: 'PointCloudStore',
  enabled: process.env.NODE_ENV === 'development',
  serialize: {
    options: {
      // Prevent serialization of large objects
      maxDepth: 2,
      replacer: (_key: string, value: unknown) => {
        // Replace Float32Array with metadata to avoid serialization errors
        if (value instanceof Float32Array) {
          return `[Float32Array: ${value.length} elements]`;
        }
        // Also handle regular arrays that are too large
        if (Array.isArray(value) && value.length > 1000) {
          return `[Array: ${value.length} elements]`;
        }
        return value;
      },
    },
  },
};

export const usePointCloudStore = create<PointCloudStore>()(
  devtools(
    (set) => ({
      // === Initial State ===
      pointCloud: null,
      isLoading: false,
      loadingProgress: null,
      error: null,
      metrics: null,

      cameraMode: 'orthographic',
      orthographicConfig: { ...DEFAULT_ORTHOGRAPHIC_CONFIG },
      firstPersonConfig: { ...DEFAULT_FIRST_PERSON_CONFIG },

      pointSize: VIEWER_CONFIG.defaultPointSize,
      pointBudget: VIEWER_CONFIG.defaultPointBudget,
      showBounds: false,
      showGrid: true,
      showStats: true,
      useLOD: 'simple',

      showControlPanel: true,
      showFileLoader: false,
      showHelp: false,
      viewMode: 'normal',

      // === Actions ===
      setPointCloud: (data) => set({ pointCloud: data }),

      setLoading: (loading) => set({ isLoading: loading }),

      setLoadingProgress: (progress) => set({ loadingProgress: progress }),

      setError: (error) => set({ error }),

      setMetrics: (metrics) => set({ metrics }),

      // Camera actions
      setCameraMode: (mode) => set({ cameraMode: mode }),

      updateOrthographicConfig: (config) =>
        set((state) => ({
          orthographicConfig: { ...state.orthographicConfig, ...config },
        })),

      updateFirstPersonConfig: (config) =>
        set((state) => ({
          firstPersonConfig: { ...state.firstPersonConfig, ...config },
        })),

      resetCamera: () =>
        set((state) => {
          if (state.cameraMode === 'orthographic') {
            return { orthographicConfig: { ...DEFAULT_ORTHOGRAPHIC_CONFIG } };
          } else {
            return { firstPersonConfig: { ...DEFAULT_FIRST_PERSON_CONFIG } };
          }
        }),

      // Rendering actions
      setPointSize: (size) =>
        set({
          pointSize: Math.max(
            VIEWER_CONFIG.minPointSize,
            Math.min(VIEWER_CONFIG.maxPointSize, size)
          ),
        }),

      setPointBudget: (budget) =>
        set({
          pointBudget: Math.max(
            VIEWER_CONFIG.minPointBudget,
            Math.min(VIEWER_CONFIG.maxPointBudget, budget)
          ),
        }),

      toggleBounds: () => set((state) => ({ showBounds: !state.showBounds })),

      toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),

      toggleStats: () => set((state) => ({ showStats: !state.showStats })),

      setUseLOD: (mode) => set({ useLOD: mode }),

      // UI actions
      toggleControlPanel: () =>
        set((state) => ({ showControlPanel: !state.showControlPanel })),

      toggleFileLoader: () =>
        set((state) => ({ showFileLoader: !state.showFileLoader })),

      toggleHelp: () => set((state) => ({ showHelp: !state.showHelp })),

      setViewMode: (mode) => set({ viewMode: mode }),

      // Reset
      reset: () =>
        set({
          pointCloud: null,
          isLoading: false,
          loadingProgress: null,
          error: null,
          metrics: null,
          cameraMode: 'orthographic',
          orthographicConfig: { ...DEFAULT_ORTHOGRAPHIC_CONFIG },
          firstPersonConfig: { ...DEFAULT_FIRST_PERSON_CONFIG },
          pointSize: VIEWER_CONFIG.defaultPointSize,
          pointBudget: VIEWER_CONFIG.defaultPointBudget,
          showBounds: false,
          showGrid: true,
          showStats: true,
        }),
    }),
    devtoolsOptions
  )
);

// === Selectors ===
export const selectPointCloud = (state: PointCloudStore) => state.pointCloud;
export const selectIsLoading = (state: PointCloudStore) => state.isLoading;
export const selectLoadingProgress = (state: PointCloudStore) => state.loadingProgress;
export const selectError = (state: PointCloudStore) => state.error;
export const selectMetrics = (state: PointCloudStore) => state.metrics;

export const selectCameraMode = (state: PointCloudStore) => state.cameraMode;
export const selectOrthographicConfig = (state: PointCloudStore) => state.orthographicConfig;
export const selectFirstPersonConfig = (state: PointCloudStore) => state.firstPersonConfig;

export const selectPointSize = (state: PointCloudStore) => state.pointSize;
export const selectPointBudget = (state: PointCloudStore) => state.pointBudget;
export const selectShowBounds = (state: PointCloudStore) => state.showBounds;
export const selectShowGrid = (state: PointCloudStore) => state.showGrid;
export const selectShowStats = (state: PointCloudStore) => state.showStats;
export const selectUseLOD = (state: PointCloudStore) => state.useLOD;

export const selectShowControlPanel = (state: PointCloudStore) => state.showControlPanel;
export const selectShowFileLoader = (state: PointCloudStore) => state.showFileLoader;
export const selectShowHelp = (state: PointCloudStore) => state.showHelp;
export const selectViewMode = (state: PointCloudStore) => state.viewMode;
