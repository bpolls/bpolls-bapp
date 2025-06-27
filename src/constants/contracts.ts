export const CONTRACT_ADDRESSES = {
  POLLS_DAPP: process.env.NEXT_PUBLIC_POLLS_DAPP_ADDRESS || '',
  POLL_MANAGER: process.env.NEXT_PUBLIC_POLL_MANAGER_ADDRESS || '',
  FUNDING_MANAGER: process.env.NEXT_PUBLIC_FUNDING_MANAGER_ADDRESS || '',
  RESPONSE_MANAGER: process.env.NEXT_PUBLIC_RESPONSE_MANAGER_ADDRESS || '',
  TOKEN_MANAGER: process.env.NEXT_PUBLIC_TOKEN_MANAGER_ADDRESS || '',
} as const;

export const CITREA_CHAIN_CONFIG = {
  id: 5115,
  name: 'Citrea Testnet',
  network: 'citrea-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Citrea Bitcoin',
    symbol: 'cBTC',
  },
  rpcUrls: {
    public: { http: ['https://rpc.testnet.citrea.xyz'] },
    default: { http: ['https://rpc.testnet.citrea.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Citrea Explorer', url: 'https://explorer.testnet.citrea.xyz' },
  },
} as const;