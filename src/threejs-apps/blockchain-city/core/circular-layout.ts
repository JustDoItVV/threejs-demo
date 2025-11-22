import { BlockPosition } from '../types';

interface CircularLayoutConfig {
  blockWidth: number;
  initialRadius: number;
  radiusIncrement: number;
}

export class CircularLayout {
  private config: CircularLayoutConfig;
  private occupiedSegments: Map<number, Set<number>>;
  private currentRadius: number;
  private usedSegmentsOnCurrentRadius: number;

  constructor(config: CircularLayoutConfig) {
    this.config = config;
    this.occupiedSegments = new Map();
    this.currentRadius = config.initialRadius;
    this.usedSegmentsOnCurrentRadius = 0;
  }

  private getSegmentCountForRadius(radius: number): number {
    if (radius === 0) return 1; // Центральный блок

    // Окружность = 2πr
    const circumference = 2 * Math.PI * radius;

    // Количество сегментов = окружность / ширина блока
    const segmentCount = Math.floor(circumference / this.config.blockWidth);

    // Минимум 4 сегмента для красоты
    return Math.max(4, segmentCount);
  }

  private getFreeSegmentsOnRadius(radius: number): number[] {
    const totalSegments = this.getSegmentCountForRadius(radius);
    const occupiedSet = this.occupiedSegments.get(radius) || new Set();

    const freeSegments: number[] = [];
    for (let i = 0; i < totalSegments; i++) {
      if (!occupiedSet.has(i)) {
        freeSegments.push(i);
      }
    }

    return freeSegments;
  }

  private occupySegment(radius: number, segmentIndex: number): void {
    if (!this.occupiedSegments.has(radius)) {
      this.occupiedSegments.set(radius, new Set());
    }
    this.occupiedSegments.get(radius)!.add(segmentIndex);
  }

  getNextPosition(): BlockPosition {
    if (!this.occupiedSegments.has(0)) {
      this.occupySegment(0, 0);
      this.currentRadius = this.config.initialRadius;
      return { x: 0, y: 0, z: 0 };
    }

    let freeSegments = this.getFreeSegmentsOnRadius(this.currentRadius);

    while (freeSegments.length === 0) {
      this.currentRadius += this.config.radiusIncrement;
      this.usedSegmentsOnCurrentRadius = 0;
      freeSegments = this.getFreeSegmentsOnRadius(this.currentRadius);
    }

    const randomIndex = Math.floor(Math.random() * freeSegments.length);
    const selectedSegment = freeSegments[randomIndex];

    const position = this.calculatePosition(this.currentRadius, selectedSegment);

    // Занимаем сегмент
    this.occupySegment(this.currentRadius, selectedSegment);
    this.usedSegmentsOnCurrentRadius++;

    return position;
  }

  private calculatePosition(radius: number, segmentIndex: number): BlockPosition {
    if (radius === 0) {
      return { x: 0, y: 0, z: 0 };
    }

    const totalSegments = this.getSegmentCountForRadius(radius);
    const angleStep = (2 * Math.PI) / totalSegments;
    const angle = segmentIndex * angleStep;

    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    return { x, y: 0, z };
  }

  getLayoutInfo() {
    const totalSegmentsOnCurrentRadius = this.getSegmentCountForRadius(this.currentRadius);
    const freeSegmentsOnCurrentRadius = this.getFreeSegmentsOnRadius(this.currentRadius).length;

    return {
      currentRadius: this.currentRadius,
      totalSegmentsOnCurrentRadius,
      usedSegmentsOnCurrentRadius: totalSegmentsOnCurrentRadius - freeSegmentsOnCurrentRadius,
      freeSegmentsOnCurrentRadius,
    };
  }

  reset(): void {
    this.occupiedSegments.clear();
    this.currentRadius = this.config.initialRadius;
    this.usedSegmentsOnCurrentRadius = 0;
  }

  restoreLayout(count: number): BlockPosition[] {
    this.reset();
    const positions: BlockPosition[] = [];

    for (let i = 0; i < count; i++) {
      positions.push(this.getNextPosition());
    }

    return positions;
  }
}
