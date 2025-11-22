import { useState } from 'react';

import { Button } from '@/libs/ui/button';
import { Card } from '@/libs/ui/card';

import { MINING_SPEEDS, MiningSpeed, useBlockchainStore } from '../store';

interface CityControlsProps {
  autoTour: boolean;
  onToggleAutoTour: () => void;
}

export function CityControls({ autoTour, onToggleAutoTour }: CityControlsProps) {
  const blocks = useBlockchainStore((state) => state.blocks);
  const isAutoMining = useBlockchainStore((state) => state.isAutoMining);
  const isMining = useBlockchainStore((state) => state.isMining);
  const miningSpeed = useBlockchainStore((state) => state.miningSpeed);
  const addRandomBlock = useBlockchainStore((state) => state.addRandomBlock);
  const addBlockWithTransactionCount = useBlockchainStore(
    (state) => state.addBlockWithTransactionCount
  );
  const toggleAutoMining = useBlockchainStore((state) => state.toggleAutoMining);
  const setMiningSpeed = useBlockchainStore((state) => state.setMiningSpeed);
  const reset = useBlockchainStore((state) => state.reset);

  const [txCount, setTxCount] = useState(5);

  const getMiningSpeedText = (speed: MiningSpeed) => {
    const speedMs = MINING_SPEEDS[speed];
    const speedSec = speedMs / 1000;
    return `${speedSec}s`;
  };

  const handleAddBlock = () => {
    addBlockWithTransactionCount(txCount);
  };

  const isChainValid = () => {
    const blockchain = useBlockchainStore.getState().blockchain;
    return blockchain.isChainValid();
  };

  return (
    <div className="absolute top-4 left-4 w-72">
      <Card className="bg-gray-900/95 backdrop-blur-sm border-gray-700 text-white p-4">
        <h3 className="text-lg font-bold mb-4">Blockchain City Controls</h3>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-gray-800 p-2 rounded text-center">
            <p className="text-gray-400 text-xs">Total Blocks</p>
            <p className="text-2xl font-bold text-blue-400">{blocks.length}</p>
          </div>
          <div className="bg-gray-800 p-2 rounded text-center">
            <p className="text-gray-400 text-xs">Chain Status</p>
            <p
              className={`text-sm font-bold ${isChainValid() ? 'text-green-400' : 'text-red-400'}`}
            >
              {isChainValid() ? '✓ Valid' : '✗ Invalid'}
            </p>
          </div>
        </div>

        {/* Auto Mining */}
        <div className="space-y-2 mb-4">
          <Button
            onClick={toggleAutoMining}
            className={`w-full ${
              isAutoMining ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isAutoMining ? '⏸ Stop Auto Mining' : '▶️ Start Auto Mining'}
          </Button>

          {/* Mining Speed Controls */}
          {isAutoMining && (
            <div className="space-y-2">
              <p className="text-xs text-gray-400 text-center">
                Mining Speed: {getMiningSpeedText(miningSpeed)} per block
              </p>
              <div className="grid grid-cols-4 gap-1">
                <Button
                  onClick={() => setMiningSpeed('SLOW')}
                  className={`text-xs px-2 py-1 ${
                    miningSpeed === 'SLOW'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  5s
                </Button>
                <Button
                  onClick={() => setMiningSpeed('NORMAL')}
                  className={`text-xs px-2 py-1 ${
                    miningSpeed === 'NORMAL'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  3s
                </Button>
                <Button
                  onClick={() => setMiningSpeed('FAST')}
                  className={`text-xs px-2 py-1 ${
                    miningSpeed === 'FAST'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  1.5s
                </Button>
                <Button
                  onClick={() => setMiningSpeed('VERY_FAST')}
                  className={`text-xs px-2 py-1 ${
                    miningSpeed === 'VERY_FAST'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  0.5s
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Manual Block Creation */}
        <div className="space-y-2 mb-4">
          <label className="block">
            <span className="text-sm text-gray-400">Transactions Count</span>
            <input
              type="range"
              min="1"
              max="15"
              value={txCount}
              onChange={(e) => setTxCount(Number(e.target.value))}
              className="w-full mt-1"
              disabled={isAutoMining}
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>1</span>
              <span className="text-blue-400 font-bold">{txCount}</span>
              <span>15</span>
            </div>
          </label>

          <Button
            onClick={handleAddBlock}
            disabled={isAutoMining || isMining}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600"
          >
            + Add Block
          </Button>

          <Button
            onClick={addRandomBlock}
            disabled={isAutoMining || isMining}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600"
          >
            + Add Random Block
          </Button>
        </div>

        {/* Camera Controls */}
        <div className="space-y-2 mb-4">
          <Button
            onClick={onToggleAutoTour}
            className={`w-full ${
              autoTour ? 'bg-amber-600 hover:bg-amber-700' : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            {autoTour ? '🎥 Stop Tour' : '🎥 Start Auto Tour'}
          </Button>
        </div>

        {/* Reset */}
        <Button onClick={reset} className="w-full bg-gray-700 hover:bg-gray-800">
          🔄 Reset Blockchain
        </Button>

        {/* Info */}
        <div className="mt-4 p-2 bg-gray-800 rounded text-xs text-gray-400 space-y-1">
          <p>
            <span className="text-blue-400">Click</span> buildings for details
          </p>
          <p>Height = transaction count</p>
          <p>City grows in circular rings</p>
          <div className="mt-2 pt-2 border-t border-gray-700">
            <p className="text-gray-500 mb-1">Color Gradient:</p>
            <div className="flex items-center gap-1 text-[10px]">
              <span className="text-purple-400">🟣 Old</span>
              <span>→</span>
              <span className="text-blue-400">🔵</span>
              <span>→</span>
              <span className="text-green-400">🟢</span>
              <span>→</span>
              <span className="text-yellow-400">🟡</span>
              <span>→</span>
              <span className="text-red-400">🔴 New</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
