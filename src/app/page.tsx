'use client';

import { useState } from 'react';
import { WalletConnect } from '@/components/WalletConnect';
import { PollList } from '@/components/PollList';
import { CreatePoll } from '@/components/CreatePoll';
import { DebugPanel } from '@/components/DebugPanel';
import { Button } from '@/components/ui/button';
import { PlusCircle, BarChart3, Home, Vote } from 'lucide-react';

type ViewMode = 'home' | 'browse' | 'create' | 'results';

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
          variant={currentView === 'browse' ? 'default' : 'ghost'}
          onClick={() => setCurrentView('browse')}
          className="gap-2"
        >
          <Vote className="w-4 h-4" />
          Browse & Vote
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
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-6 py-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome to BPolls
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Create and participate in decentralized polls on the Citrea blockchain. 
                Earn rewards for participating and help shape community decisions through transparent, 
                on-chain voting.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button 
                  onClick={() => setCurrentView('browse')} 
                  size="lg" 
                  className="gap-2"
                >
                  <Vote className="w-5 h-5" />
                  Browse Active Polls
                </Button>
                <Button 
                  onClick={() => setCurrentView('create')} 
                  variant="outline" 
                  size="lg" 
                  className="gap-2"
                >
                  <PlusCircle className="w-5 h-5" />
                  Create New Poll
                </Button>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 border rounded-lg">
                <div className="text-3xl mb-3">🗳️</div>
                <h3 className="font-semibold mb-2">Decentralized Voting</h3>
                <p className="text-sm text-muted-foreground">All votes are recorded on the Citrea blockchain for transparency</p>
              </div>
              <div className="text-center p-6 border rounded-lg">
                <div className="text-3xl mb-3">💰</div>
                <h3 className="font-semibold mb-2">Earn Rewards</h3>
                <p className="text-sm text-muted-foreground">Get paid in BTC for participating in community governance</p>
              </div>
              <div className="text-center p-6 border rounded-lg">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-semibold mb-2">Real-time Results</h3>
                <p className="text-sm text-muted-foreground">See poll results update live as votes are cast on-chain</p>
              </div>
            </div>

            {/* Recent Polls Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Recent Polls</h3>
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentView('browse')}
                  className="gap-2"
                >
                  <Vote className="w-4 h-4" />
                  View All Polls
                </Button>
              </div>
              <div className="text-muted-foreground text-sm">
                Quick preview of the latest community polls
              </div>
            </div>
          </div>
        )}

        {currentView === 'browse' && (
          <div className="space-y-6">
            <div className="text-center space-y-4 py-6">
              <h2 className="text-3xl font-bold">Browse Active Polls</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Participate in community governance and earn rewards by voting on active polls
              </p>
            </div>
            <PollList />
          </div>
        )}

        {currentView === 'create' && (
          <div className="space-y-6">
            <div className="text-center space-y-4 py-6">
              <h2 className="text-3xl font-bold">Create New Poll</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Start a new community discussion and reward participants for their input
              </p>
            </div>
            <CreatePoll />
          </div>
        )}
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