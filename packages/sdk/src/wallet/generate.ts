import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

export interface GeneratedWallet {
  address: `0x${string}`;
  privateKey: `0x${string}`;
}

export function generateWallet(): GeneratedWallet {
  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);
  return {
    address: account.address,
    privateKey,
  };
}
