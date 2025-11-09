'use client';

import { useState } from 'react';

import { Button } from '@/ui/button';

import { useRogueStore } from '../../store/rogue-store';

export function BackpackModal() {
  const [filter, setFilter] = useState<string>('all');
  const character = useRogueStore((state) => state.character);
  const makeTurn = useRogueStore((state) => state.makeTurn);
  const setGameState = useRogueStore((state) => state.setGameState);

  const items = character?.backpack.items || [];
  const filteredItems =
    filter === 'all' ? items : items.filter((item) => item && item.type === filter);
  const handleUseItem = (itemIndex: number) => {
    makeTurn(`${itemIndex + 1}`);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80 pointer-events-auto">
      <div className="bg-black/90 text-white p-6 rounded-lg border-2 border-yellow-600 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-yellow-400">Backpack</h2>
          <Button variant="ghost" onClick={() => setGameState('game')}>
            Close (Esc)
          </Button>
        </div>

        <div className="flex gap-2 mb-4">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'weapon' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('weapon')}
          >
            Weapons
          </Button>
          <Button
            variant={filter === 'food' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('food')}
          >
            Food
          </Button>
          <Button
            variant={filter === 'elixir' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('elixir')}
          >
            Elixirs
          </Button>
          <Button
            variant={filter === 'scroll' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('scroll')}
          >
            Scrolls
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {filteredItems.map((item, idx) => {
            if (!item) {
              return (
                <div key={idx} className="bg-gray-800/50 rounded p-3 border border-gray-700">
                  <div className="text-center text-gray-600 text-sm">Empty Slot</div>
                </div>
              );
            }

            const typeColor =
              item.type === 'weapon'
                ? 'text-cyan-400'
                : item.type === 'food'
                ? 'text-red-400'
                : item.type === 'elixir'
                ? 'text-purple-400'
                : item.type === 'scroll'
                ? 'text-blue-400'
                : 'text-yellow-400';

            return (
              <div
                key={idx}
                className="bg-gray-800/80 rounded p-3 border border-gray-600 hover:border-yellow-500 cursor-pointer transition"
                onClick={() => handleUseItem(idx)}
              >
                <div className="flex flex-col gap-1">
                  <div className={`font-bold capitalize ${typeColor}`}>
                    {item.subtype || item.type}
                  </div>
                  <div className="text-xs text-gray-400 capitalize">Type: {item.type}</div>
                  {item.strengthUp && (
                    <div className="text-xs text-orange-400">+{item.strengthUp} STR</div>
                  )}
                  {item.dexterityUp && (
                    <div className="text-xs text-blue-400">+{item.dexterityUp} DEX</div>
                  )}
                  {item.healthUp && <div className="text-xs text-red-400">+{item.healthUp} HP</div>}
                  {item.maxHealthUp && (
                    <div className="text-xs text-red-400">+{item.maxHealthUp} Max HP</div>
                  )}
                  <div className="text-xs text-yellow-400 mt-1">Press {idx + 1} to use</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
