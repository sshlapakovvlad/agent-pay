const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Wallet {
  id: string;
  agent_id: string;
  address: string;
  daily_limit: number | null;
  per_tx_limit: number | null;
  created_at: number;
}

export interface Transaction {
  id: string;
  wallet_id: string;
  tx_hash: string;
  to_address: string;
  amount: number;
  token: string;
  metadata: string | null;
  status: string;
  created_at: number;
}

export async function fetchWallets(): Promise<Wallet[]> {
  const res = await fetch(`${API_URL}/wallets`);
  const data = await res.json();
  return data.wallets;
}

export async function fetchWallet(id: string): Promise<Wallet> {
  const res = await fetch(`${API_URL}/wallets/${id}`);
  const data = await res.json();
  return data.wallet;
}

export async function fetchTransactions(walletId: string): Promise<Transaction[]> {
  const res = await fetch(`${API_URL}/transactions?walletId=${walletId}`);
  const data = await res.json();
  return data.transactions;
}

export async function createWallet(params: {
  agentId: string;
  address: string;
  dailyLimit?: number;
  perTxLimit?: number;
}): Promise<Wallet> {
  const res = await fetch(`${API_URL}/wallets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  return data.wallet;
}
