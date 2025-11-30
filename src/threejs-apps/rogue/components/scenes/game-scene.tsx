'use client';

import { useEffect } from 'react';

import { selectController, selectDebugSlice, selectRenderTrigger, useStore } from '../../store';
import { ICorridorEntity, IEnemyEntity, IItemEntity, IRoomEntity } from '../../types/entities';
import { PlayerCamera } from '../cameras/player-camera/player-camera';
import { GameControls } from '../controls/game-controls';
import { GameSceneDebug } from '../debug/game-scene-debug/game-scene-debug';
import { GameSceneLights } from '../lights/game-scene-lights';
import { CorridorMesh } from '../meshes/CorridorMesh';
import { RoomMesh } from '../meshes/RoomMesh';
import { CharacterSprite } from '../sprites/CharacterSprite';
import { DoorSprite } from '../sprites/DoorSprite';
import { EnemySprite } from '../sprites/EnemySprite';
import { ItemSprite } from '../sprites/ItemSprite';

export function GameScene() {
  useStore(selectRenderTrigger);
  const controller = useStore(selectController);
  const entities = controller?.getEntitiesToRender();
  const initGame = useStore((state) => state.init);
  const { disableFog } = useStore(selectDebugSlice);

  useEffect(() => {
    initGame();
  }, [initGame]);

  if (!entities) return null;

  const { character, rooms, corridors, door, enemies, items } = entities;
  const charRoom = character.position.room;

  if (!charRoom) return null;

  return (
    <>
      <GameControls />
      <PlayerCamera />
      <GameSceneLights />

      {rooms.map((room: IRoomEntity, idx: number) => (
        <RoomMesh
          key={`room-${idx}`}
          room={room}
          useBasicMaterial={false}
          disableFog={disableFog}
        />
      ))}

      {corridors.map((corridor: ICorridorEntity, idx: number) => (
        <CorridorMesh key={`corridor-${idx}`} corridor={corridor} disableFog={disableFog} />
      ))}

      {door && <DoorSprite door={door} />}

      {items.map((item: IItemEntity, idx: number) => (
        <ItemSprite key={`item-${idx}`} item={item} />
      ))}

      {enemies.map((enemy: IEnemyEntity, idx: number) => (
        <EnemySprite key={`enemy-${idx}`} enemy={enemy} />
      ))}

      {character && <CharacterSprite character={character} />}

      <GameSceneDebug />
    </>
  );
}
