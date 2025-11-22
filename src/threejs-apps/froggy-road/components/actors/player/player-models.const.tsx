'use client';

import React from 'react';

import { EPlayerModels } from '@/threejs-apps/froggy-road/types';

import { BoxModel } from '../../models/box.model';
import { ChickenModel } from '../../models/chicken.model';
import { FrogModel } from '../../models/frog.model';

export const PlayerModels: Record<EPlayerModels, React.ComponentType> = {
  [EPlayerModels.Box]: BoxModel,
  [EPlayerModels.Chiken]: ChickenModel,
  [EPlayerModels.Frog]: FrogModel,
};
