'use client';

import type { Transaction } from '@/lib/api';

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return <p className="text-gray-500">No transactions yet</p>;
  }

  return (
    <div className="space-y-2">
      {transactions.map((tx) => (
        <div key={tx.id} className="border rounded p-3 text-sm">
          <div className="flex justify-between">
            <span className="font-mono text-xs truncate max-w-[200px]">
              {tx.tx_hash}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded ${
                tx.status === 'confirmed'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {tx.status}
            </span>
          </div>
          <div className="flex justify-between mt-2">
            <span>
              {tx.amount} {tx.token}
            </span>
            <span className="text-gray-500">
              → {tx.to_address.slice(0, 8)}...
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
