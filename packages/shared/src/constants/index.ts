export const TEMPO_MAINNET_CHAIN_ID = 111557560;
export const TEMPO_TESTNET_CHAIN_ID = 111557561;

export const TOKENS = {
  USDC: {
    mainnet: '0x0000000000000000000000000000000000000001', // placeholder
    testnet: '0x0000000000000000000000000000000000000001',
    decimals: 6,
  },
  USDT: {
    mainnet: '0x0000000000000000000000000000000000000002', // placeholder
    testnet: '0x0000000000000000000000000000000000000002',
    decimals: 6,
  },
} as const;

export const DEFAULT_TOKEN = 'USDC' as const;

export const ESTIMATED_TX_FEE_USD = 0.001;

export const SPENDING_ALERT_THRESHOLD = 80; // percentage
