'use client';

import { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { formatAddress } from '@/lib/utils';
import { Wallet, LogOut, Menu, Copy, Check } from 'lucide-react';

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isConnected && address) {
    return (
      <div className="relative">
        {/* Desktop View */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-sm font-medium">{formatAddress(address)}</span>
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
            onClick={() => disconnect()}
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
                    disconnect();
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