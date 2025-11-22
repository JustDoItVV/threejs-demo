'use client';

import { useStore } from '../../../store';
import { AnimatedPlayer } from './animated-player';
import { PlayerModels } from './player-models.const';

export function Player() {
  const modelName = useStore((state) => state.model);

  const Model = PlayerModels[modelName];

  return (
    <AnimatedPlayer>
      <Model />
    </AnimatedPlayer>
  );
}
