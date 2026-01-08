import { defineChain } from 'viem';

export const tempoTestnet = defineChain({
  id: 111557561,
  name: 'Tempo Testnet',
  nativeCurrency: { name: 'USD', symbol: 'USD', decimals: 6 },
  rpcUrls: {
    default: { http: ['https://rpc.testnet.tempo.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://explorer.testnet.tempo.xyz' },
  },
  testnet: true,
});

export const tempo = defineChain({
  id: 111557560,
  name: 'Tempo',
  nativeCurrency: { name: 'USD', symbol: 'USD', decimals: 6 },
  rpcUrls: {
    default: { http: ['https://rpc.tempo.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://explorer.tempo.xyz' },
  },
});

export type Network = 'mainnet' | 'testnet';

export function getChain(network: Network) {
  return network === 'mainnet' ? tempo : tempoTestnet;
}
