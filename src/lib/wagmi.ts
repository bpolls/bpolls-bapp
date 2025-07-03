import { configureChains, createConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { CITREA_CHAIN_CONFIG } from '@/constants/contracts';
import { ethers } from 'ethers';

const { chains, publicClient } = configureChains(
  [CITREA_CHAIN_CONFIG],
  [publicProvider()]
);

export const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
      },
    }),
  ],
  publicClient,
});

export { chains };

// Create ethers provider
export const getEthersProvider = () => {
  return new ethers.JsonRpcProvider(CITREA_CHAIN_CONFIG.rpcUrls.default.http[0]);
};