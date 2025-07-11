import { ethers } from 'ethers';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import type { Config } from 'wagmi';
import { CITREA_CHAIN_CONFIG } from '@/constants/contracts';

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID_V2 || 'c997c6e26fe695b1c5cf49ea9466d6e6';

console.log('WalletConnect Project ID:', projectId);
console.log('All env vars:', import.meta.env);

export const config: Config = getDefaultConfig({
  appName: 'BPolls - Decentralized Polling',
  projectId,
  chains: [CITREA_CHAIN_CONFIG],
  ssr: false,
});

export const chains = [CITREA_CHAIN_CONFIG];

// Create ethers provider
export const getEthersProvider = () => {
  return new ethers.JsonRpcProvider(CITREA_CHAIN_CONFIG.rpcUrls.default.http[0]);
};