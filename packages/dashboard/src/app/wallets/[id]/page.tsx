'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { fetchWallet, fetchTransactions } from '@/lib/api';
import { TransactionList } from '@/components/TransactionList';

export default function WalletDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: wallet, isLoading: walletLoading } = useQuery({
    queryKey: ['wallet', id],
    queryFn: () => fetchWallet(id),
  });

  const { data: transactions, isLoading: txLoading } = useQuery({
    queryKey: ['transactions', id],
    queryFn: () => fetchTransactions(id),
    enabled: !!id,
  });

  if (walletLoading) {
    return <div className="text-gray-500">Loading wallet...</div>;
  }

  if (!wallet) {
    return <div className="text-red-500">Wallet not found</div>;
  }

  return (
    <div>
      <button
        onClick={() => router.back()}
        className="text-blue-600 mb-4 hover:underline"
      >
        ← Back
      </button>

      <div className="border rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">{wallet.agent_id}</h2>
        <div className="space-y-2 text-sm">
          <p>
            <span className="text-gray-500">Address:</span>{' '}
            <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              {wallet.address}
            </code>
          </p>
          <p>
            <span className="text-gray-500">Daily Limit:</span>{' '}
            {wallet.daily_limit ? `$${wallet.daily_limit}` : 'None'}
          </p>
          <p>
            <span className="text-gray-500">Per-Transaction Limit:</span>{' '}
            {wallet.per_tx_limit ? `$${wallet.per_tx_limit}` : 'None'}
          </p>
          <p>
            <span className="text-gray-500">Created:</span>{' '}
            {new Date(wallet.created_at * 1000).toLocaleString()}
          </p>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4">Transactions</h3>
      {txLoading ? (
        <p className="text-gray-500">Loading transactions...</p>
      ) : (
        <TransactionList transactions={transactions || []} />
      )}
    </div>
  );
}
