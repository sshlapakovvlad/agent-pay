'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchWallets, type Wallet } from '@/lib/api';
import { WalletCard } from '@/components/WalletCard';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const { data: wallets, isLoading } = useQuery({
    queryKey: ['wallets'],
    queryFn: fetchWallets,
  });

  if (isLoading) {
    return <div className="text-gray-500">Loading wallets...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Agent Wallets</h2>
        <button
          onClick={() => router.push('/wallets/new')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Register Wallet
        </button>
      </div>

      {wallets?.length === 0 ? (
        <p className="text-gray-500">No wallets registered yet</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {wallets?.map((wallet) => (
            <WalletCard
              key={wallet.id}
              wallet={wallet}
              onClick={() => router.push(`/wallets/${wallet.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
