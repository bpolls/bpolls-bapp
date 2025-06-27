'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { formatAddress } from '@/lib/utils';
import { Wallet, LogOut } from 'lucide-react';

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{formatAddress(address)}</span>
        <Button
          onClick={() => disconnect()}
          variant="outline"
          size="sm"
          className="gap-1"
        >
          <LogOut className="w-4 h-4" />
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      {connectors.map((connector) => (
        <Button
          key={connector.id}
          onClick={() => connect({ connector })}
          disabled={!connector.ready || isLoading}
          variant="outline"
          className="gap-2"
        >
          <Wallet className="w-4 h-4" />
          {isLoading && connector.id === pendingConnector?.id
            ? 'Connecting...'
            : `Connect ${connector.name}`
          }
        </Button>
      ))}
    </div>
  );
}