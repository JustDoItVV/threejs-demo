export interface RGB {
  r: number;
  g: number;
  b: number;
}

// Jet-like color palette
const GRADIENT_STOPS: RGB[] = [
  { r: 75, g: 0, b: 130 },      // 0.0 - Dark Purple (Indigo) - Oldest
  { r: 0, g: 0, b: 255 },       // 0.16 - Blue
  { r: 0, g: 127, b: 255 },     // 0.33 - Cyan
  { r: 0, g: 255, b: 127 },     // 0.5 - Spring Green
  { r: 255, g: 255, b: 0 },     // 0.66 - Yellow
  { r: 255, g: 127, b: 0 },     // 0.83 - Orange
  { r: 255, g: 0, b: 0 },       // 1.0 - Red - Newest
];

function lerpColor(color1: RGB, color2: RGB, t: number): RGB {
  return {
    r: Math.round(color1.r + (color2.r - color1.r) * t),
    g: Math.round(color1.g + (color2.g - color1.g) * t),
    b: Math.round(color1.b + (color2.b - color1.b) * t),
  };
}

function rgbToHex(rgb: RGB): string {
  const r = rgb.r.toString(16).padStart(2, '0');
  const g = rgb.g.toString(16).padStart(2, '0');
  const b = rgb.b.toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

export function getGradientColor(t: number): string {
  t = Math.max(0, Math.min(1, t));

  const segmentCount = GRADIENT_STOPS.length - 1;
  const scaledT = t * segmentCount;
  const segmentIndex = Math.floor(scaledT);
  const segmentT = scaledT - segmentIndex;

  if (segmentIndex >= segmentCount) {
    return rgbToHex(GRADIENT_STOPS[GRADIENT_STOPS.length - 1]);
  }

  const color1 = GRADIENT_STOPS[segmentIndex];
  const color2 = GRADIENT_STOPS[segmentIndex + 1];
  const interpolatedColor = lerpColor(color1, color2, segmentT);

  return rgbToHex(interpolatedColor);
}

export function getBlockColor(blockIndex: number, totalBlocks: number): string {
  const t = totalBlocks > 1 ? blockIndex / (totalBlocks - 1) : 0;
  return getGradientColor(t);
}

export function adjustColorByActivity(baseColor: string, activityLevel: number): string {
  const r = parseInt(baseColor.slice(1, 3), 16);
  const g = parseInt(baseColor.slice(3, 5), 16);
  const b = parseInt(baseColor.slice(5, 7), 16);

  const brightnessFactor = 1 + activityLevel * 0.3;

  const newR = Math.min(255, Math.round(r * brightnessFactor));
  const newG = Math.min(255, Math.round(g * brightnessFactor));
  const newB = Math.min(255, Math.round(b * brightnessFactor));

  return rgbToHex({ r: newR, g: newG, b: newB });
}
