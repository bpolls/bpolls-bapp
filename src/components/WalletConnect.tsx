'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useNetwork } from 'wagmi';
import { Button } from '@/components/ui/button';
import { formatAddress } from '@/lib/utils';
import { Wallet, LogOut, Menu, Copy, Check } from 'lucide-react';
import { CITREA_CHAIN_CONFIG } from '@/constants/contracts';
import { showToast } from '@/lib/toast';
import { SwitchNetworkButton } from './SwitchNetworkButton';

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

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

  const handleConnectClick = async (connector: any) => {
    setShowModal(false);
    await handleConnect(connector);
  };

  return (
    <div>
      {/* Single Connect Wallet Button */}
      <Button
        onClick={() => setShowModal(true)}
        variant="outline"
        className="gap-2"
      >
        <Wallet className="w-4 h-4" />
        Connect Wallet
      </Button>

      {/* Wallet Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => setShowModal(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Connect Wallet</h2>
              <Button
                onClick={() => setShowModal(false)}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-3">
              {connectors.map((connector) => {
                const isWalletConnect = connector.name.toLowerCase().includes('walletconnect');
                const isMetaMask = connector.name.toLowerCase().includes('metamask');
                const isInjected = connector.name.toLowerCase().includes('browser') || connector.name.toLowerCase().includes('injected');
                
                let buttonText = connector.name;
                let description = '';
                
                if (isWalletConnect) {
                  buttonText = 'Mobile Wallet';
                  description = 'Trust Wallet, Coinbase Wallet, Rainbow, etc.';
                } else if (isMetaMask) {
                  buttonText = 'MetaMask';
                  description = 'Connect using MetaMask browser extension';
                } else if (isInjected) {
                  buttonText = 'Browser Wallet';
                  description = 'Any injected wallet (if available)';
                }
                
                return (
                  <Button
                    key={connector.id}
                    onClick={() => handleConnectClick(connector)}
                    disabled={!connector.ready || isLoading}
                    variant="outline"
                    className="w-full justify-start p-4 h-auto"
                  >
                    <div className="flex flex-col items-start gap-1">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-5 h-5" />
                        <span className="font-medium">
                          {isLoading && connector.id === pendingConnector?.id
                            ? 'Connecting...'
                            : buttonText
                          }
                        </span>
                      </div>
                      {description && (
                        <span className="text-xs text-muted-foreground">
                          {description}
                        </span>
                      )}
                    </div>
                  </Button>
                );
              })}
            </div>
            
            {isMobile && (
              <p className="text-xs text-muted-foreground text-center mt-4">
                📱 For mobile: Use "Mobile Wallet" to connect via QR code or deep link
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}