import { useMemo } from 'react';
import { usePublicClient, useWalletClient } from 'wagmi';
import { getContract } from 'viem';
import { CONTRACT_ADDRESSES } from '@/constants/contracts';
import { POLLS_DAPP_ABI, POLL_MANAGER_ABI, FUNDING_MANAGER_ABI, RESPONSE_MANAGER_ABI, TOKEN_MANAGER_ABI } from '@/constants/abi';

export function usePollsContract() {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  return useMemo(() => {
    console.log('Contract address:', CONTRACT_ADDRESSES.POLLS_DAPP);
    console.log('Public client:', !!publicClient);
    
    if (!CONTRACT_ADDRESSES.POLLS_DAPP) {
      console.error('POLLS_DAPP contract address not configured');
      return null;
    }

    if (!publicClient) {
      console.error('Public client not available');
      return null;
    }

    try {
      const contract = getContract({
        address: CONTRACT_ADDRESSES.POLLS_DAPP as `0x${string}`,
        abi: POLLS_DAPP_ABI,
        publicClient,
        walletClient: walletClient || undefined,
      });
      console.log('Contract initialized successfully');
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

    return getContract({
      address: CONTRACT_ADDRESSES.POLL_MANAGER as `0x${string}`,
      abi: POLL_MANAGER_ABI,
      publicClient,
      walletClient: walletClient || undefined,
    });
  }, [publicClient, walletClient]);
}

export function useFundingManagerContract() {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  return useMemo(() => {
    if (!CONTRACT_ADDRESSES.FUNDING_MANAGER) return null;

    return getContract({
      address: CONTRACT_ADDRESSES.FUNDING_MANAGER as `0x${string}`,
      abi: FUNDING_MANAGER_ABI,
      publicClient,
      walletClient: walletClient || undefined,
    });
  }, [publicClient, walletClient]);
}

export function useResponseManagerContract() {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  return useMemo(() => {
    if (!CONTRACT_ADDRESSES.RESPONSE_MANAGER) return null;

    return getContract({
      address: CONTRACT_ADDRESSES.RESPONSE_MANAGER as `0x${string}`,
      abi: RESPONSE_MANAGER_ABI,
      publicClient,
      walletClient: walletClient || undefined,
    });
  }, [publicClient, walletClient]);
}

export function useTokenManagerContract() {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  return useMemo(() => {
    if (!CONTRACT_ADDRESSES.TOKEN_MANAGER) return null;

    return getContract({
      address: CONTRACT_ADDRESSES.TOKEN_MANAGER as `0x${string}`,
      abi: TOKEN_MANAGER_ABI,
      publicClient,
      walletClient: walletClient || undefined,
    });
  }, [publicClient, walletClient]);
}