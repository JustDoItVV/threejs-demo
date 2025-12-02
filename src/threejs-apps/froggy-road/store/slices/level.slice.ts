import { StateCreator } from 'zustand';

import { TILE_INDEX_MAX, TILE_INDEX_MIN, TILE_SIZE } from '../../config/game.coofig';
import {
    LANE_POOL_SIZE, LANE_TYPE_WEIGHTS, LANES_AHEAD, LANES_BEHIND, MAX_CONSECUTIVE_LANES,
    POOL_REGENERATION_INTERVAL, SAFE_ZONE_CENTER, SAFE_ZONE_MIN_WIDTH, SAFE_ZONE_RANGE,
    TREE_DENSITY_OUTSIDE_SAFE_ZONE
} from '../../config/level.config';
import {
    CAR_SPEED, LANE_WIDTH, LOG_SPEED, MAX_CARS_PER_LANE, MIN_CARS_PER_LANE
} from '../../config/movement.config';
import { ELaneObjectType, ELaneType, ILane, ILaneObject } from '../../types';

interface ILaneTemplate {
  objects: ILaneObject[];
}

interface ILanePool {
  grass: ILaneTemplate[];
  road: ILaneTemplate[];
  water: ILaneTemplate[];
}

interface IPoolUsage {
  grass: Set<number>;
  road: Set<number>;
  water: Set<number>;
}

export interface LevelSlice {
  lanes: ILane[];
  currentLaneIndex: number;
  laneIdCounter: number;
  consecutiveCounts: Record<ELaneType, number>;
  lanePool: ILanePool;
  poolUsage: IPoolUsage;
  lanesPassedSinceRegeneration: number;
  initializeLevel: () => void;
  addLaneAhead: () => void;
  removeLaneBehind: () => void;
  generateLane: (yIndex: number, currentCounter?: number, currentCounts?: Record<ELaneType, number>) => {
    lane: ILane;
    newLaneIdCounter: number;
    newConsecutiveCounts: Record<ELaneType, number>;
  };
  updateLaneObjectPosition: (laneId: number, objectIndex: number, worldX: number) => void;
  initializeLanePool: () => void;
  pickLaneFromPool: (laneType: ELaneType) => { template: ILaneTemplate; poolIndex: number };
  regenerateUnusedLanes: () => void;
}

function generateTreesForGrass(): ILaneObject[] {
  const trees: ILaneObject[] = [];
  const safeZoneStart = SAFE_ZONE_CENTER - SAFE_ZONE_RANGE;
  const safeZoneEnd = SAFE_ZONE_CENTER + SAFE_ZONE_RANGE;

  let safeFreeCount = 0;
  let inSafeZone = false;

  for (let x = TILE_INDEX_MIN; x <= TILE_INDEX_MAX; x++) {
    const isInSafeZone = x >= safeZoneStart && x <= safeZoneEnd;

    if (isInSafeZone) {
      if (!inSafeZone) {
        inSafeZone = true;
        safeFreeCount = 0;
      }

      if (safeFreeCount < SAFE_ZONE_MIN_WIDTH) {
        safeFreeCount++;
        continue;
      }

      if (Math.random() > 0.5) {
        trees.push({
          xIndex: x,
          type: ELaneObjectType.Tree,
          velocity: 0,
          direction: 1,
          speed: 0,
          worldX: x * TILE_SIZE,
        });
      }
    } else {
      if (Math.random() < TREE_DENSITY_OUTSIDE_SAFE_ZONE) {
        trees.push({
          xIndex: x,
          type: ELaneObjectType.Tree,
          velocity: 0,
          direction: 1,
          speed: 0,
          worldX: x * TILE_SIZE,
        });
      }
    }
  }

  return trees;
}

function generateLogsForWater(): ILaneObject[] {
  const logs: ILaneObject[] = [];
  const logInterval = 3;
  const direction = Math.random() > 0.5 ? 1 : -1;

  for (let x = TILE_INDEX_MIN; x <= TILE_INDEX_MAX; x += logInterval) {
    if (Math.random() > 0.3) {
      logs.push({
        xIndex: x,
        type: ELaneObjectType.Log,
        velocity: LOG_SPEED,
        direction,
        speed: LOG_SPEED,
        worldX: x * TILE_SIZE,
      });
    }
  }

  return logs;
}

function generateCarsForRoad(): ILaneObject[] {
  const cars: ILaneObject[] = [];
  const carCount = Math.floor(Math.random() * (MAX_CARS_PER_LANE - MIN_CARS_PER_LANE + 1)) + MIN_CARS_PER_LANE;
  const direction = Math.random() > 0.5 ? 1 : -1;
  const spacing = LANE_WIDTH / (carCount + 1);

  const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];

  for (let i = 0; i < carCount; i++) {
    const worldX = -LANE_WIDTH / 2 + spacing * (i + 1);
    const color = colors[Math.floor(Math.random() * colors.length)];

    cars.push({
      xIndex: Math.floor(worldX / TILE_SIZE),
      type: ELaneObjectType.Car,
      velocity: CAR_SPEED,
      direction,
      speed: CAR_SPEED,
      worldX,
      color,
    });
  }

  return cars;
}

function selectNextLaneType(consecutiveCounts: Record<ELaneType, number>): ELaneType {
  const availableTypes = (Object.keys(ELaneType) as Array<keyof typeof ELaneType>)
    .map((key) => ELaneType[key])
    .filter((type) => consecutiveCounts[type] < MAX_CONSECUTIVE_LANES[type]);

  if (availableTypes.length === 0) {
    return ELaneType.Grass;
  }

  const totalWeight = availableTypes.reduce(
    (sum, type) => sum + LANE_TYPE_WEIGHTS[type],
    0
  );

  let random = Math.random() * totalWeight;

  for (const type of availableTypes) {
    random -= LANE_TYPE_WEIGHTS[type];
    if (random <= 0) {
      return type;
    }
  }

  return availableTypes[0];
}

export const createLevelSlice: StateCreator<
  LevelSlice,
  [],
  [],
  LevelSlice
> = (set, get) => ({
  lanes: [],
  currentLaneIndex: 0,
  laneIdCounter: 0,
  consecutiveCounts: {
    [ELaneType.Grass]: 0,
    [ELaneType.Road]: 0,
    [ELaneType.Water]: 0,
  },
  lanePool: {
    grass: [],
    road: [],
    water: [],
  },
  poolUsage: {
    grass: new Set(),
    road: new Set(),
    water: new Set(),
  },
  lanesPassedSinceRegeneration: 0,

  generateLane: (
    yIndex: number,
    currentCounter?: number,
    currentCounts?: Record<ELaneType, number>
  ) => {
    const laneIdCounter = currentCounter ?? get().laneIdCounter;
    const consecutiveCounts = currentCounts ?? get().consecutiveCounts;

    const laneType = selectNextLaneType(consecutiveCounts);

    const { template, poolIndex } = get().pickLaneFromPool(laneType);

    const objects: ILaneObject[] = template.objects.map((obj) => ({ ...obj }));

    const newConsecutiveCounts = { ...consecutiveCounts };
    Object.keys(newConsecutiveCounts).forEach((key) => {
      const laneTypeKey = key as ELaneType;
      if (laneTypeKey === laneType) {
        newConsecutiveCounts[laneTypeKey] += 1;
      } else {
        newConsecutiveCounts[laneTypeKey] = 0;
      }
    });

    const currentId = laneIdCounter;

    return {
      lane: {
        id: currentId,
        type: laneType,
        yIndex,
        objects,
        poolIndex,
      },
      newLaneIdCounter: laneIdCounter + 1,
      newConsecutiveCounts,
    };
  },

  initializeLevel: () => {
    get().initializeLanePool();

    const lanes: ILane[] = [];
    let currentCounter = get().laneIdCounter;
    let currentCounts = { ...get().consecutiveCounts };

    for (let i = -LANES_BEHIND; i <= LANES_AHEAD; i++) {
      const { lane, newLaneIdCounter, newConsecutiveCounts } = get().generateLane(
        i,
        currentCounter,
        currentCounts
      );

      if (i === 0) {
        const { template, poolIndex } = get().pickLaneFromPool(ELaneType.Grass);
        lanes.push({
          ...lane,
          type: ELaneType.Grass,
          objects: template.objects.map((obj) => ({ ...obj })),
          poolIndex,
        });
      } else {
        lanes.push(lane);
      }

      currentCounter = newLaneIdCounter;
      currentCounts = newConsecutiveCounts;
    }

    set({
      lanes,
      currentLaneIndex: LANES_BEHIND,
      laneIdCounter: currentCounter,
      consecutiveCounts: currentCounts,
      lanesPassedSinceRegeneration: 0,
    });
  },

  addLaneAhead: () => {
    const { lanes, lanesPassedSinceRegeneration } = get();
    const lastLane = lanes[lanes.length - 1];
    const newYIndex = lastLane.yIndex + 1;
    const { lane: newLane, newLaneIdCounter, newConsecutiveCounts } = get().generateLane(newYIndex);

    const newLanesPassedCount = lanesPassedSinceRegeneration + 1;

    if (newLanesPassedCount >= POOL_REGENERATION_INTERVAL) {
      get().regenerateUnusedLanes();
      set({
        lanes: [...lanes, newLane],
        laneIdCounter: newLaneIdCounter,
        consecutiveCounts: newConsecutiveCounts,
        lanesPassedSinceRegeneration: 0,
      });
    } else {
      set({
        lanes: [...lanes, newLane],
        laneIdCounter: newLaneIdCounter,
        consecutiveCounts: newConsecutiveCounts,
        lanesPassedSinceRegeneration: newLanesPassedCount,
      });
    }
  },

  removeLaneBehind: () => {
    const { lanes, poolUsage } = get();
    if (lanes.length > 0) {
      const removedLane = lanes[0];

      if (removedLane.poolIndex !== undefined) {
        const poolKey = removedLane.type.toLowerCase() as keyof IPoolUsage;
        const newUsage = new Set(poolUsage[poolKey]);
        newUsage.delete(removedLane.poolIndex);

        set({
          lanes: lanes.slice(1),
          poolUsage: {
            ...poolUsage,
            [poolKey]: newUsage,
          },
        });
      } else {
        set({ lanes: lanes.slice(1) });
      }
    }
  },

  updateLaneObjectPosition: (laneId: number, objectIndex: number, worldX: number) => {
    const { lanes } = get();
    const laneIndex = lanes.findIndex((lane) => lane.id === laneId);

    if (laneIndex === -1) return;
    if (objectIndex < 0 || objectIndex >= lanes[laneIndex].objects.length) return;

    const updatedLanes = [...lanes];
    updatedLanes[laneIndex] = {
      ...updatedLanes[laneIndex],
      objects: updatedLanes[laneIndex].objects.map((obj, idx) =>
        idx === objectIndex ? { ...obj, worldX } : obj
      ),
    };

    set({ lanes: updatedLanes });
  },

  initializeLanePool: () => {
    const grassPool: ILaneTemplate[] = [];
    const roadPool: ILaneTemplate[] = [];
    const waterPool: ILaneTemplate[] = [];

    for (let i = 0; i < LANE_POOL_SIZE; i++) {
      grassPool.push({ objects: generateTreesForGrass() });
      roadPool.push({ objects: generateCarsForRoad() });
      waterPool.push({ objects: generateLogsForWater() });
    }

    set({
      lanePool: {
        grass: grassPool,
        road: roadPool,
        water: waterPool,
      },
      poolUsage: {
        grass: new Set(),
        road: new Set(),
        water: new Set(),
      },
    });
  },

  pickLaneFromPool: (laneType: ELaneType) => {
    const { lanePool, poolUsage } = get();
    const poolKey = laneType.toLowerCase() as keyof ILanePool;
    const pool = lanePool[poolKey];
    const usage = poolUsage[poolKey];

    const availableIndices = Array.from({ length: LANE_POOL_SIZE }, (_, i) => i).filter(
      (i) => !usage.has(i)
    );

    let poolIndex: number;
    if (availableIndices.length > 0) {
      poolIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    } else {
      poolIndex = Math.floor(Math.random() * LANE_POOL_SIZE);
    }

    const newUsage = new Set(usage);
    newUsage.add(poolIndex);

    set({
      poolUsage: {
        ...poolUsage,
        [poolKey]: newUsage,
      },
    });

    return {
      template: pool[poolIndex],
      poolIndex,
    };
  },

  regenerateUnusedLanes: () => {
    const { lanePool, poolUsage } = get();

    const newLanePool = { ...lanePool };

    (['grass', 'road', 'water'] as const).forEach((poolKey) => {
      const usage = poolUsage[poolKey];
      const pool = [...lanePool[poolKey]];

      for (let i = 0; i < LANE_POOL_SIZE; i++) {
        if (!usage.has(i)) {
          if (poolKey === 'grass') {
            pool[i] = { objects: generateTreesForGrass() };
          } else if (poolKey === 'road') {
            pool[i] = { objects: generateCarsForRoad() };
          } else {
            pool[i] = { objects: generateLogsForWater() };
          }
        }
      }

      newLanePool[poolKey] = pool;
    });

    set({ lanePool: newLanePool });
  },
});
