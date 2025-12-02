import { ELaneType } from '../types';

export const LANES_BEHIND = 10;
export const LANES_AHEAD = 10;
export const TOTAL_LANES = LANES_BEHIND + 1 + LANES_AHEAD;

export const MAX_CONSECUTIVE_LANES: Record<ELaneType, number> = {
  [ELaneType.Road]: 8,
  [ELaneType.Water]: 6,
  [ELaneType.Grass]: 4,
};

export const SAFE_ZONE_CENTER = 0;
export const SAFE_ZONE_RANGE = 3;
export const SAFE_ZONE_MIN_WIDTH = 4;

export const TREE_DENSITY_OUTSIDE_SAFE_ZONE = 0.7;

export const LANE_TYPE_WEIGHTS: Record<ELaneType, number> = {
  [ELaneType.Grass]: 0.4,
  [ELaneType.Road]: 0.35,
  [ELaneType.Water]: 0.25,
};

export const LANE_POOL_SIZE = 10;
export const POOL_REGENERATION_INTERVAL = 10;
