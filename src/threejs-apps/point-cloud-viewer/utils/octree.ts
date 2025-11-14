/**
 * Octree implementation for point cloud LOD
 * Each node divides space into 8 octants
 */

export interface OctreeNode {
  // Bounding box
  min: { x: number; y: number; z: number };
  max: { x: number; y: number; z: number };
  center: { x: number; y: number; z: number };
  size: number;

  // Points in this node (only for leaf nodes)
  pointIndices: number[];

  // Children (8 octants)
  children: OctreeNode[] | null;

  // Level in tree (0 = root)
  level: number;

  // Representative points for LOD
  lodPoints: Float32Array | null;
  lodColors: Float32Array | null;
}

export interface OctreeOptions {
  maxPointsPerNode: number; // Split if more points
  maxDepth: number; // Maximum tree depth
  minNodeSize: number; // Minimum node size to prevent over-subdivision
}

const DEFAULT_OPTIONS: OctreeOptions = {
  maxPointsPerNode: 1000,
  maxDepth: 10,
  minNodeSize: 0.1,
};

export class Octree {
  root: OctreeNode;
  points: Float32Array;
  colors: Float32Array | undefined;
  options: OctreeOptions;

  constructor(
    points: Float32Array,
    colors: Float32Array | undefined,
    bounds: { min: { x: number; y: number; z: number }; max: { x: number; y: number; z: number } },
    options: Partial<OctreeOptions> = {}
  ) {
    this.points = points;
    this.colors = colors;
    this.options = { ...DEFAULT_OPTIONS, ...options };

    // Create root node
    const center = {
      x: (bounds.min.x + bounds.max.x) / 2,
      y: (bounds.min.y + bounds.max.y) / 2,
      z: (bounds.min.z + bounds.max.z) / 2,
    };

    const size = Math.max(
      bounds.max.x - bounds.min.x,
      bounds.max.y - bounds.min.y,
      bounds.max.z - bounds.min.z
    );

    // All point indices initially
    const pointCount = points.length / 3;
    const allIndices = Array.from({ length: pointCount }, (_, i) => i);

    this.root = {
      min: bounds.min,
      max: bounds.max,
      center,
      size,
      pointIndices: allIndices,
      children: null,
      level: 0,
      lodPoints: null,
      lodColors: null,
    };

    // Build the tree
    this.subdivide(this.root);

    // Generate LOD representations
    this.generateLOD(this.root);
  }

  private subdivide(node: OctreeNode): void {
    // Stop conditions
    if (
      node.level >= this.options.maxDepth ||
      node.pointIndices.length <= this.options.maxPointsPerNode ||
      node.size < this.options.minNodeSize
    ) {
      return; // Leaf node
    }

    // Create 8 children
    node.children = [];

    const halfSize = node.size / 2;
    const quarterSize = halfSize / 2;

    // 8 octants: each combination of +/- on x, y, z from center
    const octants = [
      { x: -1, y: -1, z: -1 }, // 0: ---
      { x: 1, y: -1, z: -1 },  // 1: +--
      { x: -1, y: 1, z: -1 },  // 2: -+-
      { x: 1, y: 1, z: -1 },   // 3: ++-
      { x: -1, y: -1, z: 1 },  // 4: --+
      { x: 1, y: -1, z: 1 },   // 5: +-+
      { x: -1, y: 1, z: 1 },   // 6: -++
      { x: 1, y: 1, z: 1 },    // 7: +++
    ];

    for (const octant of octants) {
      const childCenter = {
        x: node.center.x + octant.x * quarterSize,
        y: node.center.y + octant.y * quarterSize,
        z: node.center.z + octant.z * quarterSize,
      };

      const childMin = {
        x: childCenter.x - quarterSize,
        y: childCenter.y - quarterSize,
        z: childCenter.z - quarterSize,
      };

      const childMax = {
        x: childCenter.x + quarterSize,
        y: childCenter.y + quarterSize,
        z: childCenter.z + quarterSize,
      };

      // Find points in this octant
      const childIndices = node.pointIndices.filter((idx) => {
        const x = this.points[idx * 3];
        const y = this.points[idx * 3 + 1];
        const z = this.points[idx * 3 + 2];

        return (
          x >= childMin.x && x < childMax.x &&
          y >= childMin.y && y < childMax.y &&
          z >= childMin.z && z < childMax.z
        );
      });

      if (childIndices.length > 0) {
        const child: OctreeNode = {
          min: childMin,
          max: childMax,
          center: childCenter,
          size: halfSize,
          pointIndices: childIndices,
          children: null,
          level: node.level + 1,
          lodPoints: null,
          lodColors: null,
        };

        node.children.push(child);

        // Recursively subdivide child
        this.subdivide(child);
      }
    }

    // If children were created, clear parent's point indices to save memory
    if (node.children.length > 0) {
      node.pointIndices = [];
    }
  }

  private generateLOD(node: OctreeNode): void {
    if (!node.children || node.children.length === 0) {
      // Leaf node - use all points as LOD
      const pointCount = node.pointIndices.length;
      node.lodPoints = new Float32Array(pointCount * 3);

      if (this.colors) {
        node.lodColors = new Float32Array(pointCount * 3);
      }

      for (let i = 0; i < pointCount; i++) {
        const idx = node.pointIndices[i];
        node.lodPoints[i * 3] = this.points[idx * 3];
        node.lodPoints[i * 3 + 1] = this.points[idx * 3 + 1];
        node.lodPoints[i * 3 + 2] = this.points[idx * 3 + 2];

        if (this.colors && node.lodColors) {
          node.lodColors[i * 3] = this.colors[idx * 3];
          node.lodColors[i * 3 + 1] = this.colors[idx * 3 + 1];
          node.lodColors[i * 3 + 2] = this.colors[idx * 3 + 2];
        }
      }
    } else {
      // Internal node - generate LOD from children recursively
      for (const child of node.children) {
        this.generateLOD(child);
      }

      // For internal node, downsample children's LOD points
      const targetPoints = Math.min(this.options.maxPointsPerNode, this.getTotalPoints(node));
      const sampledIndices = this.samplePointsFromChildren(node, targetPoints);

      node.lodPoints = new Float32Array(sampledIndices.length * 3);
      if (this.colors) {
        node.lodColors = new Float32Array(sampledIndices.length * 3);
      }

      for (let i = 0; i < sampledIndices.length; i++) {
        const idx = sampledIndices[i];
        node.lodPoints[i * 3] = this.points[idx * 3];
        node.lodPoints[i * 3 + 1] = this.points[idx * 3 + 1];
        node.lodPoints[i * 3 + 2] = this.points[idx * 3 + 2];

        if (this.colors && node.lodColors) {
          node.lodColors[i * 3] = this.colors[idx * 3];
          node.lodColors[i * 3 + 1] = this.colors[idx * 3 + 1];
          node.lodColors[i * 3 + 2] = this.colors[idx * 3 + 2];
        }
      }
    }
  }

  private getTotalPoints(node: OctreeNode): number {
    if (!node.children || node.children.length === 0) {
      return node.pointIndices.length;
    }

    return node.children.reduce((sum, child) => sum + this.getTotalPoints(child), 0);
  }

  private samplePointsFromChildren(node: OctreeNode, targetCount: number): number[] {
    if (!node.children || node.children.length === 0) {
      return node.pointIndices;
    }

    // Collect all point indices from children
    const allIndices: number[] = [];
    for (const child of node.children) {
      if (!child.children || child.children.length === 0) {
        allIndices.push(...child.pointIndices);
      } else {
        allIndices.push(...this.samplePointsFromChildren(child, targetCount));
      }
    }

    // Uniformly sample
    if (allIndices.length <= targetCount) {
      return allIndices;
    }

    const step = allIndices.length / targetCount;
    const sampled: number[] = [];
    for (let i = 0; i < targetCount; i++) {
      const idx = Math.floor(i * step);
      sampled.push(allIndices[idx]);
    }

    return sampled;
  }

  /**
   * Get visible nodes based on camera position and point budget
   */
  getVisibleNodes(
    cameraPosition: { x: number; y: number; z: number },
    pointBudget: number
  ): OctreeNode[] {
    const visibleNodes: Array<{ node: OctreeNode; distance: number; priority: number }> = [];

    const traverse = (node: OctreeNode) => {
      // Calculate distance from camera to node center
      const dx = cameraPosition.x - node.center.x;
      const dy = cameraPosition.y - node.center.y;
      const dz = cameraPosition.z - node.center.z;
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

      // Calculate priority based on distance and node size
      // Closer and larger nodes have higher priority
      const priority = node.size / Math.max(distance, 0.1);

      if (!node.children || node.children.length === 0) {
        // Leaf node
        visibleNodes.push({ node, distance, priority });
      } else {
        // Check if we should render this node or its children
        // If far enough, use this node's LOD instead of children
        const screenSize = node.size / distance;

        if (screenSize < 0.01) {
          // Far away - use this node's LOD
          visibleNodes.push({ node, distance, priority });
        } else {
          // Close enough - traverse children
          for (const child of node.children) {
            traverse(child);
          }
        }
      }
    };

    traverse(this.root);

    // Sort by priority (higher priority first)
    visibleNodes.sort((a, b) => b.priority - a.priority);

    // Select nodes until we hit the point budget
    const selected: OctreeNode[] = [];
    let totalPoints = 0;

    for (const { node } of visibleNodes) {
      const nodePoints = node.lodPoints ? node.lodPoints.length / 3 : 0;
      if (totalPoints + nodePoints <= pointBudget) {
        selected.push(node);
        totalPoints += nodePoints;
      }

      if (totalPoints >= pointBudget) {
        break;
      }
    }

    return selected;
  }
}
