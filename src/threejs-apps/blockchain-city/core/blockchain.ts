import { BlockData, Transaction } from '../types';

export class Block implements BlockData {
  index: number;
  timestamp: number;
  transactions: Transaction[];
  previousHash: string;
  hash: string;
  nonce: number;
  difficulty: number;

  constructor(
    index: number,
    timestamp: number,
    transactions: Transaction[],
    previousHash: string = '',
    difficulty: number = 2
  ) {
    this.index = index;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.difficulty = difficulty;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash(): string {
    const data = JSON.stringify({
      index: this.index,
      timestamp: this.timestamp,
      transactions: this.transactions,
      previousHash: this.previousHash,
      nonce: this.nonce,
    });

    return this.simpleHash(data);
  }

  private simpleHash(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }

    return Math.abs(hash).toString(16).padStart(16, '0');
  }

  mine(): void {
    const target = '0'.repeat(this.difficulty);

    while (this.hash.substring(0, this.difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }

  isValid(): boolean {
    if (this.hash !== this.calculateHash()) {
      return false;
    }

    const target = '0'.repeat(this.difficulty);
    return this.hash.substring(0, this.difficulty) === target;
  }
}

export class Blockchain {
  chain: Block[];
  difficulty: number;
  pendingTransactions: Transaction[];

  constructor(difficulty: number = 2) {
    this.difficulty = difficulty;
    this.chain = [this.createGenesisBlock()];
    this.pendingTransactions = [];
  }

  private createGenesisBlock(): Block {
    const genesisTransactions: Transaction[] = [
      {
        id: 'genesis-tx',
        from: 'system',
        to: 'network',
        amount: 0,
        timestamp: Date.now(),
        fee: 0,
      },
    ];

    const block = new Block(0, Date.now(), genesisTransactions, '0', this.difficulty);
    block.mine();
    return block;
  }

  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  addBlock(transactions: Transaction[]): Block {
    const newBlock = new Block(
      this.chain.length,
      Date.now(),
      transactions,
      this.getLatestBlock().hash,
      this.difficulty
    );

    newBlock.mine();
    this.chain.push(newBlock);
    return newBlock;
  }

  addTransaction(transaction: Transaction): void {
    this.pendingTransactions.push(transaction);
  }

  minePendingTransactions(): Block | null {
    if (this.pendingTransactions.length === 0) {
      return null;
    }

    const block = this.addBlock([...this.pendingTransactions]);
    this.pendingTransactions = [];
    return block;
  }

  isChainValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (!currentBlock.isValid()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }

  getAllBlocks(): Block[] {
    return [...this.chain];
  }
}

// Helper functions
export function generateRandomTransaction(): Transaction {
  const wallets = [
    '0x1a2b3c',
    '0x4d5e6f',
    '0x7g8h9i',
    '0xjklmno',
    '0xpqrstu',
    '0xvwxyza',
  ];

  const from = wallets[Math.floor(Math.random() * wallets.length)];
  let to = wallets[Math.floor(Math.random() * wallets.length)];

  while (to === from) {
    to = wallets[Math.floor(Math.random() * wallets.length)];
  }

  return {
    id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    from,
    to,
    amount: parseFloat((Math.random() * 10).toFixed(2)),
    timestamp: Date.now(),
    fee: parseFloat((Math.random() * 0.1).toFixed(4)),
  };
}

export function generateMultipleTransactions(count: number): Transaction[] {
  return Array.from({ length: count }, () => generateRandomTransaction());
}
