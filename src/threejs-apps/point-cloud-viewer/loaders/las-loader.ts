/**
 * LAS/LAZ Format Loader
 * Using loaders.gl for parsing LAS and LAZ files
 */

import { load } from '@loaders.gl/core';
import { LASLoader } from '@loaders.gl/las';

import { LoadingProgress, PointCloudData } from '../types';

export async function parseLAS(
  file: File,
  onProgress?: (progress: LoadingProgress) => void
): Promise<PointCloudData> {
  const startTime = performance.now();

  onProgress?.({
    loaded: 0,
    total: file.size,
    percentage: 0,
    stage: 'downloading',
  });

  try {
    // Load using loaders.gl
    const data = await load(file, LASLoader, {
      las: {
        shape: 'mesh' as const,
        colorDepth: 8, // Convert colors to 8-bit
        fp64: false, // Use 32-bit floats for better performance
        skip: 1, // Don't skip any points
      },
      onProgress: (progress: { loaded?: number; total?: number; percent?: number }) => {
        onProgress?.({
          loaded: progress.loaded || 0,
          total: progress.total || file.size,
          percentage: progress.percent ? progress.percent * 100 : 0,
          stage: 'parsing',
        });
      },
    });

    if (!data || !data.attributes || !data.attributes.POSITION) {
      throw new Error('Invalid LAS/LAZ data: missing position attributes');
    }

    const positions = data.attributes.POSITION.value as Float32Array;
    const count = positions.length / 3;

    // Extract colors if available
    let colors: Float32Array | undefined;
    let hasColor = false;

    if (data.attributes.COLOR_0) {
      const colorData = data.attributes.COLOR_0.value;
      // Normalize colors to [0, 1] range
      colors = new Float32Array(colorData.length);
      for (let i = 0; i < colorData.length; i++) {
        colors[i] = colorData[i] / 255;
      }
      hasColor = true;
    }

    // Calculate bounds
    let minX = Infinity,
      minY = Infinity,
      minZ = Infinity;
    let maxX = -Infinity,
      maxY = -Infinity,
      maxZ = -Infinity;

    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];

      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      minZ = Math.min(minZ, z);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
      maxZ = Math.max(maxZ, z);
    }

    const loadTime = performance.now() - startTime;

    onProgress?.({
      loaded: count,
      total: count,
      percentage: 100,
      stage: 'complete',
    });

    const format = file.name.toLowerCase().endsWith('.laz') ? 'laz' : 'las';

    return {
      points: positions,
      colors,
      count,
      hasColor,
      bounds: {
        min: { x: minX, y: minY, z: minZ },
        max: { x: maxX, y: maxY, z: maxZ },
      },
      format,
      metadata: {
        loadTime,
        header: data.loaderData?.header,
      },
    };
  } catch (error) {
    console.error('Error loading LAS/LAZ file:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Check if it's a version issue
    if (errorMessage.includes('version') || errorMessage.includes('1.3') || errorMessage.includes('1.4')) {
      throw new Error(
        `LAS/LAZ version not supported.\n\n` +
        `This viewer supports LAS/LAZ versions 1.0-1.3 only.\n` +
        `Your file appears to be version 1.4+.\n\n` +
        `To convert your file:\n` +
        `1. Download LAStools: https://rapidlasso.de/lastools/\n` +
        `2. Run: las2las -i input.laz -o output.laz -set_version 1.2\n\n` +
        `Alternative online converters:\n` +
        `- CloudCompare (free): https://www.cloudcompare.org/\n` +
        `- PDAL: https://pdal.io/\n\n` +
        `Or use PTS format instead (simpler text format).`
      );
    }

    throw new Error(`Failed to load LAS/LAZ file: ${errorMessage}`);
  }
}
