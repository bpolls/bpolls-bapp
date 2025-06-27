import { useMemo } from 'react';
import { usePublicClient, useWalletClient } from 'wagmi';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES } from '@/constants/contracts';
import { POLLS_DAPP_ABI, POLL_MANAGER_ABI, FUNDING_MANAGER_ABI, RESPONSE_MANAGER_ABI, TOKEN_MANAGER_ABI } from '@/constants/abi';
import { getEthersProvider } from '@/lib/wagmi';

export function usePollsContract() {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  return useMemo(() => {
    console.log('Contract address:', CONTRACT_ADDRESSES.POLLS_DAPP);
    console.log('Public client:', !!publicClient);
    console.log('Wallet client:', !!walletClient);
    
    if (!CONTRACT_ADDRESSES.POLLS_DAPP) {
      console.error('POLLS_DAPP contract address not configured');
      return null;
    }

    if (!publicClient) {
      console.error('Public client not available');
      return null;
    }

    try {
      const provider = getEthersProvider();
      
      // For now, always use provider - we'll handle signer in the component
      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES.POLLS_DAPP,
        POLLS_DAPP_ABI,
        provider
      );
      console.log('Contract initialized with provider');
      
      return contract;
    } catch (error) {
      console.error('Error initializing contract:', error);
      return null;
    }
  }, [publicClient, walletClient]);
}

export function usePollManagerContract() {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  return useMemo(() => {
    if (!CONTRACT_ADDRESSES.POLL_MANAGER) return null;

    const provider = getEthersProvider();
    return new ethers.Contract(
      CONTRACT_ADDRESSES.POLL_MANAGER,
      POLL_MANAGER_ABI,
      provider
    );
  }, [publicClient, walletClient]);
}

export function useFundingManagerContract() {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  return useMemo(() => {
    if (!CONTRACT_ADDRESSES.FUNDING_MANAGER) return null;

    const provider = getEthersProvider();
    return new ethers.Contract(
      CONTRACT_ADDRESSES.FUNDING_MANAGER,
      FUNDING_MANAGER_ABI,
      provider
    );
  }, [publicClient, walletClient]);
}

export function useResponseManagerContract() {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  return useMemo(() => {
    if (!CONTRACT_ADDRESSES.RESPONSE_MANAGER) return null;

    const provider = getEthersProvider();
    return new ethers.Contract(
      CONTRACT_ADDRESSES.RESPONSE_MANAGER,
      RESPONSE_MANAGER_ABI,
      provider
    );
  }, [publicClient, walletClient]);
}

export function useTokenManagerContract() {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  return useMemo(() => {
    if (!CONTRACT_ADDRESSES.TOKEN_MANAGER) return null;

    const provider = getEthersProvider();
    return new ethers.Contract(
      CONTRACT_ADDRESSES.TOKEN_MANAGER,
      TOKEN_MANAGER_ABI,
      provider
    );
  }, [publicClient, walletClient]);
}