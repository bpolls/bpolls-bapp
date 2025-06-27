'use client';

import { useState } from 'react';
import { WalletConnect } from '@/components/WalletConnect';
import { PollList } from '@/components/PollList';
import { CreatePoll } from '@/components/CreatePoll';
import { Button } from '@/components/ui/button';
import { PlusCircle, BarChart3, Home } from 'lucide-react';

type ViewMode = 'home' | 'create' | 'results';

export default function HomePage() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">BPolls</h1>
          <p className="text-muted-foreground">Decentralized Polling on Citrea</p>
        </div>
        <WalletConnect />
      </header>

      {/* Navigation */}
      <nav className="flex gap-2 border-b">
        <Button
          variant={currentView === 'home' ? 'default' : 'ghost'}
          onClick={() => setCurrentView('home')}
          className="gap-2"
        >
          <Home className="w-4 h-4" />
          Home
        </Button>
        <Button
          variant={currentView === 'create' ? 'default' : 'ghost'}
          onClick={() => setCurrentView('create')}
          className="gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Create Poll
        </Button>
      </nav>

      {/* Content */}
      <div className="space-y-6">
        {currentView === 'home' && (
          <div className="space-y-6">
            <div className="text-center space-y-4 py-8">
              <h2 className="text-2xl font-semibold">Welcome to BPolls</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Create and participate in decentralized polls on the Citrea blockchain. 
                Earn rewards for participating and help shape community decisions through transparent, 
                on-chain voting.
              </p>
            </div>
            <PollList />
          </div>
        )}

        {currentView === 'create' && <CreatePoll />}
      </div>

      {/* Footer */}
      <footer className="border-t pt-8 mt-16">
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center gap-4 text-sm text-muted-foreground">
            <span>Built on Citrea</span>
            <span>•</span>
            <span>Powered by Blockchain</span>
            <span>•</span>
            <span>Decentralized Voting</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Connect your wallet to start creating and voting on polls
          </p>
        </div>
      </footer>
    </div>
  );
}