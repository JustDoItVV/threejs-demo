export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  timestamp: number;
  fee: number;
}

export interface BlockData {
  index: number;
  timestamp: number;
  transactions: Transaction[];
  previousHash: string;
  hash: string;
  nonce: number;
  difficulty: number;
}

export interface BlockPosition {
  x: number;
  y: number;
  z: number;
}

export interface CityConfig {
  blockSpacing: number;
  blocksPerRow: number;
  baseHeight: number;
  heightPerTransaction: number;
}
