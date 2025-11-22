import { create } from 'zustand';

import { Blockchain, generateMultipleTransactions } from '../core/blockchain';
import { CircularLayout } from '../core/circular-layout';
import { BlockData, BlockPosition } from '../types';

// Mining speed presets (in milliseconds)
export const MINING_SPEEDS = {
  SLOW: 5000,
  NORMAL: 3000,
  FAST: 1500,
  VERY_FAST: 500,
} as const;

export type MiningSpeed = keyof typeof MINING_SPEEDS;

interface BlockchainStore {
  blockchain: Blockchain;
  blocks: BlockData[];
  blockPositions: Map<string, BlockPosition>;
  circularLayout: CircularLayout;
  selectedBlock: BlockData | null;
  isAutoMining: boolean;
  isMining: boolean;
  miningSpeed: MiningSpeed;
  pendingTransactionsCount: number;

  addRandomBlock: () => void;
  addBlockWithTransactionCount: (txCount: number) => void;
  selectBlock: (block: BlockData | null) => void;
  toggleAutoMining: () => void;
  setMiningSpeed: (speed: MiningSpeed) => void;
  reset: () => void;
  initializeWithBlocks: (count: number) => void;
  getBlockPosition: (hash: string) => BlockPosition | undefined;
}

const circularLayout = new CircularLayout({
  blockWidth: 2.5,
  initialRadius: 3,
  radiusIncrement: 3,
});

export const useBlockchainStore = create<BlockchainStore>((set, get) => ({
  blockchain: new Blockchain(2),
  blocks: [],
  blockPositions: new Map(),
  circularLayout,
  selectedBlock: null,
  isAutoMining: false,
  isMining: false,
  miningSpeed: 'NORMAL',
  pendingTransactionsCount: 0,

  addRandomBlock: () => {
    const { blockchain, circularLayout, blockPositions } = get();
    const txCount = Math.floor(Math.random() * 15) + 1;
    const transactions = generateMultipleTransactions(txCount);

    set({ isMining: true });

    setTimeout(() => {
      const newBlock = blockchain.addBlock(transactions);
      const position = circularLayout.getNextPosition();

      const newPositions = new Map(blockPositions);
      newPositions.set(newBlock.hash, position);

      set({
        blocks: blockchain.getAllBlocks(),
        blockPositions: newPositions,
        isMining: false,
      });
    }, 100);
  },

  addBlockWithTransactionCount: (txCount: number) => {
    const { blockchain, circularLayout, blockPositions } = get();
    const transactions = generateMultipleTransactions(txCount);

    set({ isMining: true });

    setTimeout(() => {
      const newBlock = blockchain.addBlock(transactions);
      const position = circularLayout.getNextPosition();

      const newPositions = new Map(blockPositions);
      newPositions.set(newBlock.hash, position);

      set({
        blocks: blockchain.getAllBlocks(),
        blockPositions: newPositions,
        isMining: false,
      });
    }, 100);
  },

  selectBlock: (block: BlockData | null) => {
    set({ selectedBlock: block });
  },

  toggleAutoMining: () => {
    set((state) => ({ isAutoMining: !state.isAutoMining }));
  },

  setMiningSpeed: (speed: MiningSpeed) => {
    set({ miningSpeed: speed });
  },

  reset: () => {
    const newBlockchain = new Blockchain(2);
    circularLayout.reset();

    // Add genesis block position
    const genesisBlock = newBlockchain.getAllBlocks()[0];
    const genesisPosition = circularLayout.getNextPosition();
    const newPositions = new Map<string, BlockPosition>();
    newPositions.set(genesisBlock.hash, genesisPosition);

    set({
      blockchain: newBlockchain,
      blocks: newBlockchain.getAllBlocks(),
      blockPositions: newPositions,
      selectedBlock: null,
      isAutoMining: false,
      isMining: false,
    });
  },

  initializeWithBlocks: (count: number) => {
    const { blockchain } = get();
    const newPositions = new Map<string, BlockPosition>();

    const genesisBlock = blockchain.getAllBlocks()[0];
    const genesisPosition = circularLayout.getNextPosition();
    newPositions.set(genesisBlock.hash, genesisPosition);

    for (let i = 0; i < count; i++) {
      const txCount = Math.floor(Math.random() * 15) + 1;
      const transactions = generateMultipleTransactions(txCount);
      const newBlock = blockchain.addBlock(transactions);
      const position = circularLayout.getNextPosition();
      newPositions.set(newBlock.hash, position);
    }

    set({
      blocks: blockchain.getAllBlocks(),
      blockPositions: newPositions,
    });
  },

  getBlockPosition: (hash: string) => {
    return get().blockPositions.get(hash);
  },
}));

let autoMiningInterval: NodeJS.Timeout | null = null;
let currentMiningSpeed: MiningSpeed = 'NORMAL';

if (typeof window !== 'undefined') {
  useBlockchainStore.subscribe((state) => {
    const speedChanged = currentMiningSpeed !== state.miningSpeed;

    if (state.isAutoMining && (!autoMiningInterval || speedChanged)) {
      if (autoMiningInterval) {
        clearInterval(autoMiningInterval);
      }

      currentMiningSpeed = state.miningSpeed;
      const interval = MINING_SPEEDS[state.miningSpeed];

      autoMiningInterval = setInterval(() => {
        if (!state.isMining) {
          state.addRandomBlock();
        }
      }, interval);
    } else if (!state.isAutoMining && autoMiningInterval) {
      clearInterval(autoMiningInterval);
      autoMiningInterval = null;
    }
  });
}
