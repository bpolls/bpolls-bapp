import { configureChains, createConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { CITREA_CHAIN_CONFIG } from '@/constants/contracts';
import { ethers } from 'ethers';

const { chains, publicClient } = configureChains(
  [CITREA_CHAIN_CONFIG],
  [publicProvider()]
);

export const config = createConfig({
  autoConnect: false,  // Disable auto-connect to force signature prompt
  connectors: [
    new MetaMaskConnector({ 
      chains,
      options: {
        shimDisconnect: true,  // Properly handle disconnect
        UNSTABLE_shimOnConnectSelectAccount: true,  // Force account selection
      }
    }),
  ],
  publicClient,
}) as any;

export { chains };

// Create ethers provider
export const getEthersProvider = () => {
  return new ethers.JsonRpcProvider(CITREA_CHAIN_CONFIG.rpcUrls.default.http[0]);
};