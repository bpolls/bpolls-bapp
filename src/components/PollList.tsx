'use client';

import { usePolls } from '@/hooks/usePoll';
import { PollCard } from './PollCard';
import { MockPollList } from './MockPollList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

interface PollListProps {
  onViewPoll?: (pollId: bigint) => void;
}

export function PollList({ onViewPoll }: PollListProps) {
  const { polls, loading, error, refetch } = usePolls();

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading polls...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    // If there's a contract error, show mock polls for demo purposes
    if (error.includes('Contract not initialized') || error.includes('environment variables')) {
      return <MockPollList />;
    }
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Polls</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button onClick={refetch} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
            <p className="text-sm text-muted-foreground">
              Or view demo polls below:
            </p>
            <MockPollList />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (polls.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Active Polls</CardTitle>
          <CardDescription>
            There are currently no active polls. Create the first one!
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Active Polls ({polls.length})</h2>
        <Button onClick={refetch} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>
      
      <div className="grid gap-6">
        {polls.map((poll) => (
          <PollCard 
            key={poll.pollId.toString()} 
            poll={poll} 
            onVote={refetch}
            onViewPoll={onViewPoll}
          />
        ))}
      </div>
    </div>
  );
}