'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createWallet } from '@/lib/api';

export default function NewWalletPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [agentId, setAgentId] = useState('');
  const [address, setAddress] = useState('');
  const [dailyLimit, setDailyLimit] = useState('');
  const [perTxLimit, setPerTxLimit] = useState('');

  const mutation = useMutation({
    mutationFn: createWallet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
      router.push('/');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      agentId,
      address,
      dailyLimit: dailyLimit ? parseFloat(dailyLimit) : undefined,
      perTxLimit: perTxLimit ? parseFloat(perTxLimit) : undefined,
    });
  };

  return (
    <div className="max-w-md">
      <button
        onClick={() => router.back()}
        className="text-blue-600 mb-4 hover:underline"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold mb-6">Register Wallet</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Agent ID</label>
          <input
            type="text"
            value={agentId}
            onChange={(e) => setAgentId(e.target.value)}
            placeholder="research-agent"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Wallet Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="0x..."
            required
            className="w-full border rounded px-3 py-2 font-mono text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Daily Limit (USD, optional)
          </label>
          <input
            type="number"
            value={dailyLimit}
            onChange={(e) => setDailyLimit(e.target.value)}
            placeholder="100"
            step="0.01"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Per-Transaction Limit (USD, optional)
          </label>
          <input
            type="number"
            value={perTxLimit}
            onChange={(e) => setPerTxLimit(e.target.value)}
            placeholder="10"
            step="0.01"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {mutation.isPending ? 'Registering...' : 'Register Wallet'}
        </button>

        {mutation.isError && (
          <p className="text-red-500 text-sm">
            Error: {(mutation.error as Error).message}
          </p>
        )}
      </form>
    </div>
  );
}
