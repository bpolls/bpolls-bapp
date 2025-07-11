export const CONTRACT_ADDRESSES = {
  POLLS_DAPP: import.meta.env.VITE_POLLS_DAPP_ADDRESS_V2 || import.meta.env.VITE_POLLS_DAPP_ADDRESS || '',
  POLL_MANAGER: import.meta.env.VITE_POLL_MANAGER_ADDRESS_V2 || import.meta.env.VITE_POLL_MANAGER_ADDRESS || '',
  FUNDING_MANAGER: import.meta.env.VITE_FUNDING_MANAGER_ADDRESS_V2 || import.meta.env.VITE_FUNDING_MANAGER_ADDRESS || '',
  RESPONSE_MANAGER: import.meta.env.VITE_RESPONSE_MANAGER_ADDRESS_V2 || import.meta.env.VITE_RESPONSE_MANAGER_ADDRESS || '',
  TOKEN_MANAGER: import.meta.env.VITE_TOKEN_MANAGER_ADDRESS_V2 || import.meta.env.VITE_TOKEN_MANAGER_ADDRESS || '',
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