'use client';

import { ReactNode } from 'react';

import { TILE_SIZE } from '../../config/game.coofig';
import { ELaneObjectType, ELaneType, ILane } from '../../types';
import { Car } from '../actors/car/car';
import { Log } from '../actors/log/log';
import { GrassModel } from '../models/grass.model';
import { RoadModel } from '../models/road.model';
import { TreeModel } from '../models/tree.model';
import { WaterModel } from '../models/water.model';

interface LaneProps {
  lane: ILane;
}

export function Lane({ lane }: LaneProps) {
  const yPos = lane.yIndex * TILE_SIZE;

  let LaneModel: React.ComponentType<{ y: number; children: ReactNode[] }> | null = null;
  if (lane.type == ELaneType.Grass) LaneModel = GrassModel;
  if (lane.type == ELaneType.Road) LaneModel = RoadModel;
  if (lane.type == ELaneType.Water) LaneModel = WaterModel;
  if (!LaneModel) return null;

  const renderObjects = () => {
    return lane.objects.map((obj, index) => {
      const uniqueKey = `${lane.id}-${obj.type}-${obj.xIndex}-${index}`;

      switch (obj.type) {
        case ELaneObjectType.Tree:
          if (lane.type !== ELaneType.Grass) return null;
          return <TreeModel key={uniqueKey} tileIndex={obj.xIndex} height={50} />;
        case ELaneObjectType.Log:
          if (lane.type !== ELaneType.Water) return null;
          return (
            <Log key={uniqueKey} log={obj} laneId={lane.id} objectIndex={index} />
          );
        case ELaneObjectType.Car:
          if (lane.type !== ELaneType.Road) return null;
          return (
            <Car key={uniqueKey} car={obj} laneId={lane.id} objectIndex={index} />
          );
        default:
          return null;
      }
    });
  };

  return <LaneModel y={yPos}>{renderObjects()}</LaneModel>;
}
