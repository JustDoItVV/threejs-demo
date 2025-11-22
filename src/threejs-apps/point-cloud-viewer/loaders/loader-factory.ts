/**
 * Loader Factory
 * Selects appropriate loader based on file extension
 */

import { LoadingProgress, PointCloudData, PointCloudFormat } from '../types';
import { parseLAS } from './las-loader';
import { parsePTS } from './pts-loader';
import { parsePTX } from './ptx-loader';

export function getFileFormat(filename: string): PointCloudFormat {
  const ext = filename.toLowerCase().split('.').pop();
  switch (ext) {
    case 'las':
      return 'las';
    case 'laz':
      return 'laz';
    case 'pts':
      return 'pts';
    case 'ptx':
      return 'ptx';
    default:
      throw new Error(`Unsupported file format: .${ext}`);
  }
}

export async function loadPointCloudFile(
  file: File,
  onProgress?: (progress: LoadingProgress) => void
): Promise<PointCloudData> {
  const format = getFileFormat(file.name);

  switch (format) {
    case 'las':
    case 'laz':
      return parseLAS(file, onProgress);
    case 'pts':
      return parsePTS(file, onProgress);
    case 'ptx':
      return parsePTX(file, onProgress);
    default:
      throw new Error(`No loader available for format: ${format}`);
  }
}
