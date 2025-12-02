'use client';

import Image from 'next/image';
import { useState } from 'react';

import { Button } from '@/ui/button';

import { selectController, selectRenderTrigger, useStore } from '../../store';
import { Item } from '../../types/game-types';
import { getItemSpritePath } from '../../utils/utils';

export function BackpackModal() {
  const [filter, setFilter] = useState<string>('all');
  useStore(selectRenderTrigger);
  const controller = useStore(selectController);
  const character = controller?.getEntitiesToRender().character;
  const makeTurn = useStore((state) => state.makeTurn);
  const closeBackpack = useStore((state) => state.closeBackpack);
  const updateDebugInfo = useStore((state) => state.updateDebugOnModel);
  const triggerRender = useStore((state) => state._triggerRender);

  const items = character?.backpack?.items || [];

  const itemsWithIndices = items.map((item, idx) => ({ item, originalIndex: idx }));
  const filteredItems = (
    filter === 'all'
      ? itemsWithIndices
      : itemsWithIndices.filter(({ item }) => item && item.type === filter)
  ) as { originalIndex: number; item: Item }[];

  const handleUseItem = (filteredIndex: number) => {
    if (!controller || !character?.backpack) return;

    const filterType = filter === 'all' ? 'any' : filter;

    useStore.setState((state) => {
      if (state.controller?.model?.gameSession?.character?.backpack) {
        state.controller.model.gameSession.character.backpack.filter = filterType;
      }
      return state;
    });

    const command = `${filteredIndex + 1}`;
    makeTurn(command);

    updateDebugInfo();
    triggerRender();
  };

  const handleDropItem = (filteredIndex: number, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!controller || !character?.backpack) return;

    const filterType = filter === 'all' ? 'any' : filter;

    useStore.setState((state) => {
      if (state.controller?.model?.gameSession?.character?.backpack) {
        state.controller.model.gameSession.character.backpack.filter = filterType;
      }
      return state;
    });

    const command = `d${filteredIndex + 1}`;
    makeTurn(command);

    updateDebugInfo();
    triggerRender();
  };

  const handleCloseButtonClick = () => {
    closeBackpack();
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80 pointer-events-auto">
      <div className="bg-black/90 text-white p-6 rounded-lg border-2 border-yellow-600 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-yellow-400">Backpack</h2>
          <Button variant="ghost" onClick={handleCloseButtonClick}>
            Close (Esc)
          </Button>
        </div>

        <div className="mb-4">
          <div className="flex gap-2">
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
          <div className="mt-2 text-xs text-gray-400 font-mono">
            Keyboard: Press <span className="text-yellow-400">1-9</span> to use item,{' '}
            <span className="text-red-400">d1-d9</span> to drop
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {filteredItems.map(({ item, originalIndex }, filteredIndex) => {
            if (!item) {
              return (
                <div
                  key={originalIndex}
                  className="bg-gray-800/50 rounded p-3 border border-gray-700"
                >
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

            const itemSpritePath = getItemSpritePath(item);

            return (
              <div
                key={originalIndex}
                className="bg-gray-800/80 rounded p-3 border border-gray-600 hover:border-yellow-500 transition flex flex-col gap-2"
              >
                <div className="flex gap-2">
                  {/* Item Sprite Icon */}
                  {itemSpritePath && (
                    <div className="shrink-0 w-12 h-12 bg-gray-900/50 rounded flex items-center justify-center">
                      <Image
                        src={itemSpritePath}
                        alt={item.subtype || item.type}
                        className="max-w-full max-h-full object-contain pixelated"
                        style={{ imageRendering: 'pixelated' }}
                        width={24}
                        height={24}
                      />
                    </div>
                  )}

                  {/* Item Info */}
                  <div className="flex-1 flex flex-col gap-1 min-w-0">
                    <div className={`font-bold capitalize text-sm ${typeColor} truncate`}>
                      {item.subtype || item.type}
                    </div>
                    <div className="text-xs text-gray-400 capitalize">Type: {item.type}</div>
                    <div className="flex flex-wrap gap-1">
                      {item.type === 'treasure' && item.cost > 0 && (
                        <div className="text-xs text-yellow-400">Value: {item.cost} gold</div>
                      )}
                      {item.strengthUp && (
                        <div className="text-xs text-orange-400">+{item.strengthUp} STR</div>
                      )}
                      {item.dexterityUp && (
                        <div className="text-xs text-blue-400">+{item.dexterityUp} DEX</div>
                      )}
                      {item.healthUp && (
                        <div className="text-xs text-red-400">+{item.healthUp} HP</div>
                      )}
                      {item.maxHealthUp && (
                        <div className="text-xs text-red-400">+{item.maxHealthUp} Max HP</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => handleUseItem(filteredIndex)}
                    className="flex-1 h-7 text-xs bg-green-700 hover:bg-green-600"
                  >
                    Use ({filteredIndex + 1})
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => handleDropItem(filteredIndex, e)}
                    className="flex-1 h-7 text-xs border-red-600 text-red-400 hover:bg-red-900/30"
                  >
                    Drop (d{filteredIndex + 1})
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
