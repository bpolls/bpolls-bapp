'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi';
import { Button } from '@/components/ui/button';
import { formatAddress } from '@/lib/utils';
import { Wallet, LogOut, Menu, Copy, Check, AlertTriangle, Network } from 'lucide-react';
import { CITREA_CHAIN_CONFIG } from '@/constants/contracts';
import { showToast } from '@/lib/toast';
import { requestNetworkSwitch } from '@/lib/networkUtils';
import { SwitchNetworkButton } from './SwitchNetworkButton';
import { DebugWallet } from './DebugWallet';
import { ForceDisconnect } from './ForceDisconnect';

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);

  // Check if connected to correct network
  useEffect(() => {
    if (isConnected && chain) {
      const wrongNetwork = chain.id !== CITREA_CHAIN_CONFIG.id;
      setIsWrongNetwork(wrongNetwork);
      if (wrongNetwork) {
        showToast.warning('Wrong Network', 'Please switch to Citrea Testnet to use this app');
      }
    }
  }, [isConnected, chain]);

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSwitchNetwork = async () => {
    const success = await requestNetworkSwitch();
    
    // Fallback to wagmi method if MetaMask method fails completely
    if (!success && switchNetwork) {
      try {
        await switchNetwork(CITREA_CHAIN_CONFIG.id);
        showToast.success('Network switched', 'Successfully connected to Citrea Testnet via wagmi');
      } catch (error) {
        console.error('Wagmi network switch also failed:', error);
        showToast.error('All network switch methods failed', 'Please manually switch to Citrea Testnet in your wallet');
      }
    }
  };

  const handleDisconnect = async () => {
    try {
      console.log('Disconnecting wallet...');
      await disconnect();
      
      // Clear any cached connection data
      localStorage.removeItem('wagmi.connected');
      localStorage.removeItem('wagmi.wallet');
      
      showToast.success('Wallet disconnected', 'Successfully disconnected from your wallet');
    } catch (error) {
      console.error('Failed to disconnect:', error);
      showToast.error('Failed to disconnect', 'Please manually disconnect in your wallet');
    }
  };

  if (isConnected && address) {
    return (
      <div className="relative">
        {/* Desktop View */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-sm font-medium">{formatAddress(address)}</span>
          {isWrongNetwork && (
            <SwitchNetworkButton 
              variant="outline"
              size="sm"
              className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
            >
              Switch Network
            </SwitchNetworkButton>
          )}
          <Button
            onClick={copyAddress}
            variant="outline"
            size="sm"
            className="gap-1"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button
            onClick={handleDisconnect}
            variant="outline"
            size="sm"
            className="gap-1"
          >
            <LogOut className="w-4 h-4" />
            Disconnect
          </Button>
        </div>

        {/* Mobile View */}
        <div className="sm:hidden">
          <Button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            variant="outline"
            size="sm"
            className="gap-1"
          >
            <Menu className="w-4 h-4" />
            <span className="text-xs">{formatAddress(address)}</span>
          </Button>

          {/* Mobile Menu Dropdown */}
          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
              <div className="p-3 border-b">
                <p className="text-xs text-muted-foreground mb-1">Wallet Address</p>
                <p className="text-sm font-mono break-all">{address}</p>
              </div>
              <div className="p-2 space-y-1">
                {isWrongNetwork && (
                  <div onClick={() => setIsMenuOpen(false)}>
                    <SwitchNetworkButton
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                    >
                      Switch to Citrea
                    </SwitchNetworkButton>
                  </div>
                )}
                <Button
                  onClick={() => {
                    copyAddress();
                    setIsMenuOpen(false);
                  }}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Address'}
                </Button>
                <Button
                  onClick={() => {
                    handleDisconnect();
                    setIsMenuOpen(false);
                  }}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  Disconnect
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Overlay to close menu when clicking outside */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </div>
    );
  }

  const handleConnect = async (connector: any) => {
    try {
      console.log('Attempting to connect with connector:', connector.name);
      await connect({ connector });
      showToast.success('Wallet Connected', `Successfully connected to ${connector.name}`);
    } catch (error) {
      console.error('Connection failed:', error);
      showToast.error('Connection Failed', 'Please try again and approve the connection in your wallet');
    }
  };

  return (
    <div>
      <div className="flex gap-2">
        {connectors.map((connector) => (
          <Button
            key={connector.id}
            onClick={() => handleConnect(connector)}
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
    </div>
  );
}