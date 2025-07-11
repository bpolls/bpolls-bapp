import { ethers } from 'ethers';
import { configureChains, createConfig } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { publicProvider } from 'wagmi/providers/public';
import { CITREA_CHAIN_CONFIG } from '@/constants/contracts';

const { chains, publicClient } = configureChains(
  [CITREA_CHAIN_CONFIG],
  [publicProvider()]
);

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

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
    new WalletConnectConnector({
      chains,
      options: {
        projectId,
        metadata: {
          name: 'BPolls - Decentralized Polling',
          description: 'Create and participate in decentralized polls on Citrea',
          url: 'https://bpolls.citrea.io',
          icons: ['https://bpolls.citrea.io/favicon.ico'],
        },
        showQrModal: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Browser Wallet',
        shimDisconnect: true,
      },
    }),
  ],
  publicClient,
}) as any;

export { chains };

// Create ethers provider
export const getEthersProvider = () => {
  return new ethers.JsonRpcProvider(CITREA_CHAIN_CONFIG.rpcUrls.default.http[0]);
};