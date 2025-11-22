'use client';

import { Player } from '../actors/player/player';
import { PlayerCamera } from '../cameras/player-camera/player-camera';
import { GameControls } from '../controls/game-controls';
import { GameSceneDebug } from '../debug/game-scene-debug/game-scene-debug';
import { LevelRenderer } from '../level/level-renderer';
import { GameSceneLights } from '../lights/game-scene-lights/game-scene-lights';
import { CollisionChecker } from '../systems/collision-checker';

export function GameScene() {
  return (
    <>
      <GameControls />
      <Player />
      <PlayerCamera />
      <GameSceneLights />
      <LevelRenderer />
      <CollisionChecker />

      <GameSceneDebug />
    </>
  );
}
