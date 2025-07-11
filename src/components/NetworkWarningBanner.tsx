'use client';

import { useAccount, useNetwork } from 'wagmi';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SwitchNetworkButton } from './SwitchNetworkButton';
import { CITREA_CHAIN_CONFIG } from '@/constants/contracts';
import { useState } from 'react';

export function NetworkWarningBanner() {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const [isDismissed, setIsDismissed] = useState(false);

  // Don't show if not connected, on correct network, or dismissed
  if (!isConnected || chain?.id === CITREA_CHAIN_CONFIG.id || isDismissed) {
    return null;
  }

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-medium text-yellow-800">
                Wrong Network Detected
              </div>
              <div className="text-sm text-yellow-700">
                You're connected to {chain?.name || 'Unknown Network'}. Please switch to Citrea Testnet to use this app.
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <SwitchNetworkButton 
              variant="default"
              size="sm"
              className="bg-yellow-600 hover:bg-yellow-700 text-white border-0"
            >
              Switch to Citrea
            </SwitchNetworkButton>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDismissed(true)}
              className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}