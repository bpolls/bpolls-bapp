'use client';

import { Button } from '@/components/ui/button';
import { useDisconnect } from 'wagmi';
import { showToast } from '@/lib/toast';
import { Trash2 } from 'lucide-react';

export function ForceDisconnect() {
  const { disconnect } = useDisconnect();

  const handleForceDisconnect = async () => {
    try {
      // Disconnect wagmi
      await disconnect();
      
      // Clear all possible localStorage keys
      localStorage.removeItem('wagmi.connected');
      localStorage.removeItem('wagmi.wallet');
      localStorage.removeItem('wagmi.store');
      localStorage.removeItem('wagmi.cache');
      localStorage.removeItem('wagmi.eager');
      
      // Clear MetaMask connection if it exists
      if (window.ethereum) {
        try {
          // Try to disconnect from MetaMask
          await window.ethereum.request({
            method: 'wallet_requestPermissions',
            params: [{ eth_accounts: {} }]
          });
        } catch (e) {
          // Ignore errors from this attempt
        }
      }
      
      showToast.success('Force Disconnected', 'All wallet connections cleared. Refresh the page and try connecting again.');
      
      // Force reload after a delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error('Force disconnect failed:', error);
      showToast.error('Force disconnect failed', 'Please manually disconnect in MetaMask and refresh the page');
    }
  };

  // Only show in development or when there are connection issues
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <Button
      onClick={handleForceDisconnect}
      variant="destructive"
      size="sm"
      className="gap-2 mt-2"
    >
      <Trash2 className="w-4 h-4" />
      Force Disconnect & Refresh
    </Button>
  );
}