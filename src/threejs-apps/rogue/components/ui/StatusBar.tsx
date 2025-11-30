'use client';

import Image from 'next/image';
import { useMemo } from 'react';

import { getItemSprite } from '../../config/assets';
import { selectController, selectRenderTrigger, useStore } from '../../store';

export function StatusBar() {
  useStore(selectRenderTrigger);
  const controller = useStore(selectController);
  const statuses = controller?.getStatuses();
  const character = controller?.getEntitiesToRender().character;
  const levelNumber = statuses?.level;

  const weaponSpritePath = useMemo(() => {
    if (!character?.weapon?.name) return null;
    let hash = 0;
    for (let i = 0; i < character.weapon.name.length; i++) {
      hash = (hash << 5) - hash + character.weapon.name.charCodeAt(i);
      hash = hash & hash;
    }
    const variant = Math.abs(hash);
    return getItemSprite('weapon', variant);
  }, [character?.weapon?.name]);

  if (!character) {
    return null;
  }

  const hpPercent = (character.hp / character.maxHp) * 100;
  const weaponName = character.weapon?.subtype || character.weapon?.name || 'None';

  return (
    <div className="absolute bottom-0 left-0 right-0 pointer-events-auto">
      <div className="bg-black/90 text-white px-6 py-3 border-t border-white/20">
        <div className="flex items-center justify-between gap-6 text-sm font-mono max-w-7xl mx-auto">
          {/* Level */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Level:</span>
            <span className="font-bold text-yellow-400 text-lg">{levelNumber}</span>
          </div>

          {/* Health Bar */}
          <div className="flex items-center gap-3 flex-1 max-w-xs">
            <span className="text-gray-400">HP:</span>
            <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
              <div
                className="h-full bg-linear-to-r from-red-600 to-red-500 transition-all duration-300"
                style={{ width: `${hpPercent}%` }}
              />
            </div>
            <span className="text-red-400 font-bold min-w-16 text-right">
              {character.hp}/{character.maxHp}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">STR:</span>
              <span className="font-bold text-orange-400">{character.str}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">DEX:</span>
              <span className="font-bold text-blue-400">{character.dex}</span>
            </div>
          </div>

          {/* Gold */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Gold:</span>
            <span className="font-bold text-yellow-400">{character.gold}</span>
          </div>

          {/* Weapon with icon */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Weapon:</span>
            <div className="flex items-center gap-1.5">
              {weaponSpritePath && (
                <div className="w-6 h-6 bg-gray-900/50 rounded flex items-center justify-center">
                  <Image
                    src={weaponSpritePath}
                    alt={weaponName}
                    className="max-w-full max-h-full object-contain"
                    style={{ imageRendering: 'pixelated' }}
                    width={24}
                    height={24}
                  />
                </div>
              )}
              <span className="font-bold text-cyan-400 capitalize">{weaponName}</span>
            </div>
          </div>

          {/* Controls hint */}
          <div className="text-xs text-gray-500 border-l border-gray-700 pl-6">
            <div>WASD - Move | B - Backpack | Esc - Menu</div>
          </div>
        </div>
      </div>
    </div>
  );
}
