/**
 * Loader types and interfaces
 */

import { PointCloudData, PointCloudFormat, LoadingProgress } from './point-cloud.types';

export interface PointCloudLoader {
  format: PointCloudFormat;
  parse(file: File, onProgress?: (progress: LoadingProgress) => void): Promise<PointCloudData>;
}

export interface LoaderResult {
  success: boolean;
  data?: PointCloudData;
  error?: string;
}

export interface CloudStorageConfig {
  yandexDisk?: {
    enabled: boolean;
  };
  googleDrive?: {
    enabled: boolean;
  };
}

export interface FileLoadOptions {
  source: 'local' | 'url' | 'yandex' | 'google';
  file?: File;
  url?: string;
  maxFileSize?: number; // in bytes
}
