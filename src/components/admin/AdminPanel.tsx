'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { PollCreatorDashboard } from './PollCreatorDashboard';
import { PollResponderDashboard } from './PollResponderDashboard';
import { PollAdministration } from './PollAdministration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Users, Settings, User, Shield } from 'lucide-react';

type AdminView = 'creator' | 'responder' | 'administration';

export function AdminPanel() {
  const [currentView, setCurrentView] = useState<AdminView>('creator');
  const { address, isConnected } = useAccount();

  if (!isConnected || !address) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Admin Panel
            </CardTitle>
            <CardDescription>
              Connect your wallet to access administrative features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Please connect your wallet to view your polls, participation history, and manage poll statuses.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const views = [
    {
      key: 'creator' as const,
      title: 'Creator Dashboard',
      description: 'View polls you\'ve created',
      icon: BarChart3,
      badge: 'Creator'
    },
    {
      key: 'responder' as const,
      title: 'Responder Dashboard', 
      description: 'Your participation history',
      icon: Users,
      badge: 'Voter'
    },
    {
      key: 'administration' as const,
      title: 'Poll Administration',
      description: 'Manage poll statuses',
      icon: Settings,
      badge: 'Admin'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Admin Panel
          </h1>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <User className="h-4 w-4" />
            Connected as {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
        </div>
        <Badge variant="outline" className="gap-1">
          <Shield className="h-3 w-3" />
          Administrator
        </Badge>
      </div>

      {/* Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Navigation</CardTitle>
          <CardDescription>
            Choose your administrative view
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {views.map((view) => {
              const Icon = view.icon;
              const isActive = currentView === view.key;
              
              return (
                <Button
                  key={view.key}
                  variant={isActive ? "default" : "outline"}
                  className="h-auto p-4 flex flex-col items-start gap-2"
                  onClick={() => setCurrentView(view.key)}
                >
                  <div className="flex items-center gap-2 w-full">
                    <Icon className="h-5 w-5" />
                    <span className="font-semibold">{view.title}</span>
                    <Badge 
                      variant={isActive ? "secondary" : "outline"} 
                      className="ml-auto text-xs"
                    >
                      {view.badge}
                    </Badge>
                  </div>
                  <p className="text-sm text-left opacity-70">
                    {view.description}
                  </p>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <div className="min-h-[400px]">
        {currentView === 'creator' && <PollCreatorDashboard />}
        {currentView === 'responder' && <PollResponderDashboard />}
        {currentView === 'administration' && <PollAdministration />}
      </div>
    </div>
  );
}