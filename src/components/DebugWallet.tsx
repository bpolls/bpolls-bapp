'use client';

import { useAccount, useConnect, useChainId } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function DebugWallet() {
  const { address, isConnected, isConnecting, isDisconnected } = useAccount();
  const { connectors, isPending, variables } = useConnect();
  const chainId = useChainId();

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <Card className="mt-4 border-dashed">
      <CardHeader>
        <CardTitle className="text-sm">Debug: Wallet State</CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-2">
        <div>
          <strong>Connection Status:</strong>
          <ul className="ml-4">
            <li>isConnected: {isConnected.toString()}</li>
            <li>isConnecting: {isConnecting.toString()}</li>
            <li>isDisconnected: {isDisconnected.toString()}</li>
            <li>isPending: {isPending.toString()}</li>
          </ul>
        </div>
        
        <div>
          <strong>Account:</strong>
          <div className="ml-4">
            {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'None'}
          </div>
        </div>

        <div>
          <strong>Network:</strong>
          <div className="ml-4">
            {chainId ? `Chain ID: ${chainId}` : 'None'}
          </div>
        </div>

        <div>
          <strong>Connectors:</strong>
          <ul className="ml-4">
            {connectors.map((connector, index) => (
              <li key={index}>
                {connector.name} - Ready: {connector.ready?.toString()} 
                {variables?.connector === connector && ' (Pending)'}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <strong>LocalStorage:</strong>
          <ul className="ml-4">
            <li>wagmi.connected: {localStorage.getItem('wagmi.connected') || 'null'}</li>
            <li>wagmi.wallet: {localStorage.getItem('wagmi.wallet') || 'null'}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}