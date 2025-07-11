import { CITREA_CHAIN_CONFIG } from '@/constants/contracts';
import { showToast } from '@/lib/toast';

/**
 * Request network switch using MetaMask's native dialog
 * This will show the MetaMask confirmation popup to the user
 */
export async function requestNetworkSwitch(): Promise<boolean> {
  try {
    if (!window.ethereum) {
      showToast.error('MetaMask not found', 'Please install MetaMask to switch networks');
      return false;
    }

    // Convert chain ID to hex format
    const chainIdHex = `0x${CITREA_CHAIN_CONFIG.id.toString(16)}`;

    try {
      // First try to switch to the network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });
      
      showToast.success('Network switched', 'Successfully connected to Citrea Testnet');
      return true;
      
    } catch (switchError: any) {
      // If network doesn't exist (error 4902), add it first
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: chainIdHex,
              chainName: CITREA_CHAIN_CONFIG.name,
              nativeCurrency: {
                name: CITREA_CHAIN_CONFIG.nativeCurrency.name,
                symbol: CITREA_CHAIN_CONFIG.nativeCurrency.symbol,
                decimals: CITREA_CHAIN_CONFIG.nativeCurrency.decimals,
              },
              rpcUrls: CITREA_CHAIN_CONFIG.rpcUrls.default.http,
              blockExplorerUrls: [CITREA_CHAIN_CONFIG.blockExplorers.default.url],
            }],
          });
          
          showToast.success('Network added', 'Citrea Testnet has been added to your wallet and is now active');
          return true;
          
        } catch (addError: any) {
          console.error('Failed to add network:', addError);
          
          if (addError.code === 4001) {
            showToast.warning('Network addition cancelled', 'You cancelled adding Citrea Testnet to your wallet');
          } else {
            showToast.error('Failed to add network', 'Could not add Citrea Testnet to your wallet');
          }
          return false;
        }
      }
      
      // Handle user rejection or other errors
      if (switchError.code === 4001) {
        showToast.warning('Network switch cancelled', 'You cancelled the network switch request');
      } else {
        showToast.error('Failed to switch network', 'Could not switch to Citrea Testnet');
      }
      return false;
    }
    
  } catch (error) {
    console.error('Network switch error:', error);
    showToast.error('Network switch failed', 'An unexpected error occurred while switching networks');
    return false;
  }
}

/**
 * Check if the current network is Citrea Testnet
 */
export async function isOnCitreaNetwork(): Promise<boolean> {
  try {
    if (!window.ethereum) return false;
    
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    const expectedChainId = `0x${CITREA_CHAIN_CONFIG.id.toString(16)}`;
    
    return chainId === expectedChainId;
  } catch (error) {
    console.error('Failed to check network:', error);
    return false;
  }
}

/**
 * Add network change listener
 */
export function addNetworkChangeListener(callback: (chainId: string) => void) {
  if (window.ethereum) {
    window.ethereum.on('chainChanged', callback);
  }
}

/**
 * Remove network change listener
 */
export function removeNetworkChangeListener(callback: (chainId: string) => void) {
  if (window.ethereum) {
    window.ethereum.removeListener('chainChanged', callback);
  }
}