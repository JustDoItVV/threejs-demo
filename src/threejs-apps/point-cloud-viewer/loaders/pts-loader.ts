/**
 * PTS (Point Cloud) Format Loader
 *
 * Format specification:
 * Line 1: Number of points
 * Following lines: x y z [intensity] [r g b]
 */

import { LoadingProgress, PointCloudData } from '../types';

export async function parsePTS(
  file: File,
  onProgress?: (progress: LoadingProgress) => void
): Promise<PointCloudData> {
  const startTime = performance.now();

  // Read file as text
  const text = await file.text();
  const lines = text.trim().split('\n').filter(line => line.trim().length > 0);

  if (lines.length === 0) {
    throw new Error('Invalid PTS file: empty file');
  }

  // Try to detect if first line is a header (point count) or data
  const firstLine = lines[0].trim();
  const firstValues = firstLine.split(/\s+/);

  let startIndex = 0;
  let expectedCount = lines.length;

  // If first line has only one number, it's likely a header with point count
  if (firstValues.length === 1) {
    const headerCount = parseInt(firstValues[0], 10);
    if (!isNaN(headerCount) && headerCount > 0) {
      expectedCount = headerCount;
      startIndex = 1; // Skip header line
    }
  }

  if (lines.length - startIndex === 0) {
    throw new Error('Invalid PTS file: no point data found');
  }

  onProgress?.({
    loaded: 0,
    total: expectedCount,
    percentage: 0,
    stage: 'parsing',
  });

  const points: number[] = [];
  const colors: number[] = [];
  let hasColor = false;
  let minX = Infinity,
    minY = Infinity,
    minZ = Infinity;
  let maxX = -Infinity,
    maxY = -Infinity,
    maxZ = -Infinity;

  // Parse points
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines

    const values = line.split(/\s+/).map(parseFloat);

    if (values.length < 3) {
      console.warn(`Skipping invalid line ${i}: ${line}`);
      continue;
    }

    const x = values[0];
    const y = values[1];
    const z = values[2];

    // Validate coordinates
    if (isNaN(x) || isNaN(y) || isNaN(z)) {
      console.warn(`Skipping line ${i} with invalid coordinates`);
      continue;
    }

    // Update bounds
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    minZ = Math.min(minZ, z);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
    maxZ = Math.max(maxZ, z);

    // Store coordinates
    points.push(x, y, z);

    // Check for colors (r, g, b) or intensity
    if (values.length >= 6) {
      // Has RGB color
      const r = values[values.length - 3] / 255; // Normalize to [0, 1]
      const g = values[values.length - 2] / 255;
      const b = values[values.length - 1] / 255;
      colors.push(r, g, b);
      hasColor = true;
    } else if (values.length >= 4) {
      // Has intensity, use it as grayscale
      const intensity = values[3];
      const normalizedIntensity = Math.min(1, Math.max(0, intensity));
      colors.push(normalizedIntensity, normalizedIntensity, normalizedIntensity);
      hasColor = true;
    } else {
      // No color info, use default white
      colors.push(1, 1, 1);
    }

    // Report progress every 10000 points
    if (i % 10000 === 0) {
      const processed = i - startIndex;
      const total = lines.length - startIndex;
      onProgress?.({
        loaded: processed,
        total: total,
        percentage: (processed / total) * 100,
        stage: 'parsing',
      });
    }
  }

  const actualCount = points.length / 3;

  if (actualCount === 0) {
    throw new Error('No valid points found in PTS file');
  }

  onProgress?.({
    loaded: actualCount,
    total: actualCount,
    percentage: 100,
    stage: 'complete',
  });

  const loadTime = performance.now() - startTime;

  return {
    points: new Float32Array(points),
    colors: hasColor ? new Float32Array(colors) : undefined,
    count: actualCount,
    hasColor,
    bounds: {
      min: { x: minX, y: minY, z: minZ },
      max: { x: maxX, y: maxY, z: maxZ },
    },
    format: 'pts',
    metadata: {
      loadTime,
      expectedCount,
      actualCount,
    },
  };
}
