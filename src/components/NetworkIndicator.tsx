'use client';

import { useAccount, useNetwork } from 'wagmi';
import { AlertTriangle, CheckCircle, Globe } from 'lucide-react';
import { CITREA_CHAIN_CONFIG } from '@/constants/contracts';

export function NetworkIndicator() {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();

  if (!isConnected) {
    return (
      <div className="flex items-center gap-2 text-gray-500 text-sm">
        <Globe className="w-4 h-4" />
        <span>Not connected</span>
      </div>
    );
  }

  const isCorrectNetwork = chain?.id === CITREA_CHAIN_CONFIG.id;

  return (
    <div className={`flex items-center gap-2 text-sm ${
      isCorrectNetwork 
        ? 'text-green-600' 
        : 'text-yellow-600'
    }`}>
      {isCorrectNetwork ? (
        <CheckCircle className="w-4 h-4" />
      ) : (
        <AlertTriangle className="w-4 h-4" />
      )}
      <span>
        {isCorrectNetwork 
          ? 'Citrea Testnet' 
          : `Wrong Network (${chain?.id || 'Unknown'})`
        }
      </span>
    </div>
  );
}