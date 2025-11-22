import { Badge } from '@/libs/ui/badge';
import { Card } from '@/libs/ui/card';

import { useBlockchainStore } from '../store';

export function BlockDetailsPanel() {
  const selectedBlock = useBlockchainStore((state) => state.selectedBlock);
  const selectBlock = useBlockchainStore((state) => state.selectBlock);

  if (!selectedBlock) return null;

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getTotalAmount = () => {
    return selectedBlock.transactions.reduce((sum, tx) => sum + tx.amount, 0).toFixed(2);
  };

  const getTotalFees = () => {
    return selectedBlock.transactions.reduce((sum, tx) => sum + tx.fee, 0).toFixed(4);
  };

  return (
    <div className="absolute top-4 right-4 w-80 max-h-[80vh] overflow-y-auto">
      <Card className="bg-gray-900/95 backdrop-blur-sm border-gray-700 text-white p-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold">Block #{selectedBlock.index}</h3>
          <button onClick={() => selectBlock(null)} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="space-y-3 text-sm">
          {/* Hash */}
          <div>
            <p className="text-gray-400 text-xs mb-1">Hash</p>
            <p className="font-mono text-xs bg-gray-800 p-2 rounded break-all">
              {selectedBlock.hash}
            </p>
          </div>

          {/* Previous Hash */}
          <div>
            <p className="text-gray-400 text-xs mb-1">Previous Hash</p>
            <p className="font-mono text-xs bg-gray-800 p-2 rounded break-all">
              {selectedBlock.previousHash}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-800 p-2 rounded">
              <p className="text-gray-400 text-xs">Transactions</p>
              <p className="text-lg font-bold text-blue-400">{selectedBlock.transactions.length}</p>
            </div>
            <div className="bg-gray-800 p-2 rounded">
              <p className="text-gray-400 text-xs">Nonce</p>
              <p className="text-lg font-bold text-purple-400">{selectedBlock.nonce}</p>
            </div>
            <div className="bg-gray-800 p-2 rounded">
              <p className="text-gray-400 text-xs">Total Amount</p>
              <p className="text-lg font-bold text-green-400">{getTotalAmount()}</p>
            </div>
            <div className="bg-gray-800 p-2 rounded">
              <p className="text-gray-400 text-xs">Total Fees</p>
              <p className="text-lg font-bold text-amber-400">{getTotalFees()}</p>
            </div>
          </div>

          {/* Timestamp */}
          <div>
            <p className="text-gray-400 text-xs mb-1">Timestamp</p>
            <p className="text-sm">{formatTimestamp(selectedBlock.timestamp)}</p>
          </div>

          {/* Transactions */}
          <div>
            <p className="text-gray-400 text-xs mb-2">
              Transactions ({selectedBlock.transactions.length})
            </p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {selectedBlock.transactions.map((tx) => (
                <div key={tx.id} className="bg-gray-800 p-2 rounded text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <Badge className="bg-blue-600 text-white text-xs">{tx.amount} ETH</Badge>
                    <span className="text-gray-400">Fee: {tx.fee}</span>
                  </div>
                  <div className="font-mono text-gray-300">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500">From:</span>
                      <span>{tx.from}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500">To:</span>
                      <span>{tx.to}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
