'use client';

import { useAccount, useChainId, usePublicClient } from 'wagmi';
import { usePollsContract } from '@/hooks/useContract';
import { CONTRACT_ADDRESSES } from '@/constants/contracts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function DebugPanel() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const contract = usePollsContract();

  return (
    <Card className="mb-6 border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="text-orange-800">🐛 Debug Information</CardTitle>
        <CardDescription>Diagnostic information to help troubleshoot issues</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Wallet Status</h4>
            <p>Connected: {isConnected ? '✅ Yes' : '❌ No'}</p>
            <p>Address: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Network Status</h4>
            <p>Chain ID: {chainId || 'Unknown'}</p>
            <p>Chain Name: {chainId === 5115 ? 'Citrea Testnet' : 'Unknown'}</p>
            <p>Expected: Citrea Testnet (5115)</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Client Status</h4>
            <p>Public Client: {publicClient ? '✅ Available' : '❌ Not available'}</p>
            <p>Contract: {contract ? '✅ Initialized' : '❌ Not initialized'}</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Contract Addresses</h4>
            <p className="break-all">POLLS_DAPP: {CONTRACT_ADDRESSES.POLLS_DAPP || '❌ Not set'}</p>
            <p className="text-xs text-gray-600">Check your .env.local file</p>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-2">Environment Variables</h4>
          <div className="space-y-1 text-xs font-mono bg-gray-100 p-3 rounded">
            <p>VITE_POLLS_DAPP_ADDRESS: {import.meta.env.VITE_POLLS_DAPP_ADDRESS_V2 ? '✅ Set' : '❌ Missing'}</p>
            <p>VITE_POLL_MANAGER_ADDRESS: {import.meta.env.VITE_POLL_MANAGER_ADDRESS_V2 ? '✅ Set' : '❌ Missing'}</p>
            <p>VITE_FUNDING_MANAGER_ADDRESS: {import.meta.env.VITE_FUNDING_MANAGER_ADDRESS_V2 ? '✅ Set' : '❌ Missing'}</p>
            <p>VITE_RESPONSE_MANAGER_ADDRESS: {import.meta.env.VITE_RESPONSE_MANAGER_ADDRESS_V2  ? '✅ Set' : '❌ Missing'}</p>
            <p>VITE_TOKEN_MANAGER_ADDRESS: {import.meta.env.VITE_TOKEN_MANAGER_ADDRESS_V2 ? '✅ Set' : '❌ Missing'}</p>
          </div>
        </div>
        
        <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
          <h4 className="font-semibold text-blue-800 mb-1">Troubleshooting Steps</h4>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. Check that all contract addresses are set in .env.local</li>
            <li>2. Verify you're connected to Citrea Testnet (Chain ID: 5115)</li>
            <li>3. Make sure the contracts are deployed and accessible</li>
            <li>4. Check browser console for detailed error messages</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}