'use client';

import { useStore } from '../../store';
import { Lane } from './lane';

export function LevelRenderer() {
  const lanes = useStore((state) => state.lanes);

  return (
    <group>
      {lanes.map((lane) => (
        <Lane key={lane.id} lane={lane} />
      ))}
    </group>
  );
}
