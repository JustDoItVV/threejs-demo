'use client';

import { selectCharacter, selectLevelNumber, useRogueStore } from '../../store/rogue-store';

export function StatusBar() {
  const character = useRogueStore(selectCharacter);
  const levelNumber = useRogueStore(selectLevelNumber);

  if (!character) {
    return null;
  }

  const hpPercent = (character.hp / character.maxHp) * 100;

  return (
    <div className="absolute top-4 left-4 pointer-events-auto">
      <div className="bg-black/80 text-white p-4 rounded-lg border border-white/20 min-w-[250px]">
        <div className="flex flex-col gap-2 text-sm font-mono">
          <div className="flex justify-between">
            <span>Level:</span>
            <span className="font-bold text-yellow-400">{levelNumber}</span>
          </div>

          <div className="flex justify-between items-center">
            <span>HP:</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-3 bg-gray-700 rounded overflow-hidden">
                <div
                  className="h-full bg-red-500 transition-all"
                  style={{ width: `${hpPercent}%` }}
                />
              </div>
              <span className="text-red-400 font-bold">
                {character.hp}/{character.maxHp}
              </span>
            </div>
          </div>

          <div className="flex justify-between">
            <span>STR:</span>
            <span className="font-bold text-orange-400">{character.str}</span>
          </div>

          <div className="flex justify-between">
            <span>DEX:</span>
            <span className="font-bold text-blue-400">{character.dex}</span>
          </div>

          <div className="flex justify-between">
            <span>Gold:</span>
            <span className="font-bold text-yellow-400">{character.gold}</span>
          </div>

          <div className="flex justify-between">
            <span>Weapon:</span>
            <span className="font-bold text-cyan-400 capitalize">{character.weapon?.name}</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-white/20 text-xs text-gray-400">
          <div>WASD - Move</div>
          <div>H/J/K/E/B - Backpack</div>
          <div>Esc - Save & Quit</div>
        </div>
      </div>
    </div>
  );
}
