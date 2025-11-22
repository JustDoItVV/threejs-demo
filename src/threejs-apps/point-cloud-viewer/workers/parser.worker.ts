/**
 * Point Cloud Parser Web Worker
 * Handles file parsing in a separate thread to avoid blocking the UI
 */

import { parseLAS } from '../loaders/las-loader';
import { parsePTS } from '../loaders/pts-loader';
import { parsePTX } from '../loaders/ptx-loader';
import { getFileFormat } from '../loaders/loader-factory';
import type { PointCloudData, LoadingProgress, PointCloudFormat } from '../types';

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

self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  const { type, file } = e.data;

  if (type === 'parse') {
    try {
      const format = getFileFormat(file.name);

      const onProgress = (progress: LoadingProgress) => {
        self.postMessage({
          type: 'progress',
          progress,
        } as WorkerResponse);
      };

      let pointCloudData: PointCloudData;

      switch (format) {
        case 'las':
        case 'laz':
          pointCloudData = await parseLAS(file, onProgress);
          break;
        case 'pts':
          pointCloudData = await parsePTS(file, onProgress);
          break;
        case 'ptx':
          pointCloudData = await parsePTX(file, onProgress);
          break;
        default:
          throw new Error(`Unsupported format: ${format}`);
      }

      self.postMessage({
        type: 'success',
        data: pointCloudData,
      } as WorkerResponse);
    } catch (error) {
      self.postMessage({
        type: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      } as WorkerResponse);
    }
  }
};

export {};
