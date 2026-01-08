'use client';

import type { Wallet } from '@/lib/api';

interface WalletCardProps {
  wallet: Wallet;
  onClick?: () => void;
}

export function WalletCard({ wallet, onClick }: WalletCardProps) {
  return (
    <div
      onClick={onClick}
      className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer"
    >
      <div className="flex justify-between items-start mb-2">
        <span className="font-mono text-sm text-gray-500">{wallet.agent_id}</span>
        <span className="text-xs text-gray-400">
          {new Date(wallet.created_at * 1000).toLocaleDateString()}
        </span>
      </div>
      <p className="font-mono text-xs truncate mb-2">{wallet.address}</p>
      <div className="flex gap-4 text-sm">
        {wallet.daily_limit && (
          <span>Daily: ${wallet.daily_limit}</span>
        )}
        {wallet.per_tx_limit && (
          <span>Per tx: ${wallet.per_tx_limit}</span>
        )}
      </div>
    </div>
  );
}
