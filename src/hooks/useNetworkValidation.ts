import { useAccount, useChainId } from 'wagmi';
import { CITREA_CHAIN_CONFIG } from '@/constants/contracts';
import { showToast } from '@/lib/toast';

export function useNetworkValidation() {
  const { isConnected } = useAccount();
  const chainId = useChainId();

  const validateNetwork = () => {
    if (!isConnected) {
      showToast.error('Wallet not connected', 'Please connect your wallet first');
      return false;
    }

    if (chainId !== CITREA_CHAIN_CONFIG.id) {
      showToast.error('Wrong Network', 'Please switch to Citrea Testnet to use this app');
      return false;
    }

    return true;
  };

  const isCorrectNetwork = isConnected && chainId === CITREA_CHAIN_CONFIG.id;

  return {
    validateNetwork,
    isCorrectNetwork,
    isConnected,
    chainId,
    expectedChainId: CITREA_CHAIN_CONFIG.id
  };
}