/**
 * PTX (Leica Point Cloud) Format Loader
 *
 * Format specification:
 * Lines 1-2: Number of columns and rows (width, height)
 * Lines 3-6: Scanner position and axes (X, Y, Z coordinates)
 * Lines 7-10: 4x4 transformation matrix
 * Following lines: x y z intensity [r g b]
 *
 * Note: Points with coordinates (0, 0, 0) are invalid scan points
 */

import { LoadingProgress, PointCloudData } from '../types';

export async function parsePTX(
  file: File,
  onProgress?: (progress: LoadingProgress) => void
): Promise<PointCloudData> {
  const startTime = performance.now();

  // Read file as text
  const text = await file.text();
  const lines = text.trim().split('\n');

  if (lines.length < 11) {
    throw new Error('Invalid PTX file: too few lines for header');
  }

  // Parse header
  const cols = parseInt(lines[0].trim(), 10);
  const rows = parseInt(lines[1].trim(), 10);

  if (isNaN(cols) || isNaN(rows) || cols <= 0 || rows <= 0) {
    throw new Error('Invalid PTX file: invalid dimensions');
  }

  const expectedCount = cols * rows;

  // Parse scanner position (lines 2-4: X, Y, Z)
  const scannerPosition = {
    x: parseFloat(lines[2].trim()),
    y: parseFloat(lines[3].trim()),
    z: parseFloat(lines[4].trim()),
  };

  // Parse transformation matrix (lines 6-9: 4x4 matrix)
  const transformMatrix: number[][] = [];
  for (let i = 6; i < 10; i++) {
    const row = lines[i].trim().split(/\s+/).map(parseFloat);
    if (row.length !== 4) {
      throw new Error(`Invalid PTX file: transformation matrix row ${i - 5} has ${row.length} values, expected 4`);
    }
    transformMatrix.push(row);
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
  let validPoints = 0;

  // Parse points (starting from line 10)
  for (let i = 10; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines

    const values = line.split(/\s+/).map(parseFloat);

    if (values.length < 4) {
      // PTX requires at least x, y, z, intensity
      continue;
    }

    const x = values[0];
    const y = values[1];
    const z = values[2];
    const intensity = values[3];

    // Skip invalid points (0, 0, 0) - these are non-scanned points
    if (x === 0 && y === 0 && z === 0) {
      continue;
    }

    // Validate coordinates
    if (isNaN(x) || isNaN(y) || isNaN(z)) {
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
    validPoints++;

    // Check for RGB color (after intensity)
    if (values.length >= 7) {
      // Has RGB color
      const r = values[4] / 255; // Normalize to [0, 1]
      const g = values[5] / 255;
      const b = values[6] / 255;
      colors.push(r, g, b);
      hasColor = true;
    } else {
      // Use intensity as grayscale
      const normalizedIntensity = Math.min(1, Math.max(0, intensity));
      colors.push(normalizedIntensity, normalizedIntensity, normalizedIntensity);
      hasColor = true;
    }

    // Report progress every 10000 points
    if (validPoints % 10000 === 0) {
      onProgress?.({
        loaded: validPoints,
        total: expectedCount,
        percentage: (validPoints / expectedCount) * 100,
        stage: 'parsing',
      });
    }
  }

  if (validPoints === 0) {
    throw new Error('No valid points found in PTX file');
  }

  onProgress?.({
    loaded: validPoints,
    total: validPoints,
    percentage: 100,
    stage: 'complete',
  });

  const loadTime = performance.now() - startTime;

  return {
    points: new Float32Array(points),
    colors: hasColor ? new Float32Array(colors) : undefined,
    count: validPoints,
    hasColor,
    bounds: {
      min: { x: minX, y: minY, z: minZ },
      max: { x: maxX, y: maxY, z: maxZ },
    },
    format: 'ptx',
    metadata: {
      loadTime,
      cols,
      rows,
      expectedCount,
      validPoints,
      scannerPosition,
      transformMatrix,
    },
  };
}
