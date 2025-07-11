'use client';

import { usePolls } from '@/hooks/usePoll';
import { PollPreview } from './PollPreview';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, RefreshCw, Vote } from 'lucide-react';
import { Button } from './ui/button';

interface RecentPollsProps {
  limit?: number;
  onViewAllPolls?: () => void;
  onViewPoll?: (pollId: bigint) => void;
}

export function RecentPolls({ limit = 3, onViewAllPolls, onViewPoll }: RecentPollsProps) {
  const { polls, loading, error, refetch } = usePolls();

  // Debug logging
  console.log('RecentPolls Debug:', {
    polls: polls.length,
    loading,
    error,
    pollsData: polls
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm text-muted-foreground">Loading recent polls...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Unable to Load Polls</CardTitle>
          <CardDescription className="text-sm">
            {error.includes('Contract not initialized') || error.includes('environment variables') 
              ? 'Contract not configured. Demo polls would be shown here.' 
              : 'Failed to fetch polls from the blockchain.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button onClick={refetch} variant="outline" size="sm" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
            {onViewAllPolls && (
              <Button onClick={onViewAllPolls} variant="outline" size="sm" className="gap-2">
                <Vote className="w-4 h-4" />
                Browse Demo Polls
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (polls.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground text-sm mb-4">
          No polls found. Be the first to create one!
        </div>
        {onViewAllPolls && (
          <Button onClick={onViewAllPolls} variant="outline" size="sm" className="gap-2">
            <Vote className="w-4 h-4" />
            Create Your First Poll
          </Button>
        )}
      </div>
    );
  }

  // Sort polls by creation time (newest first) and limit the results
  const recentPolls = polls
    .sort((a, b) => {
      // Sort by endTime in descending order (most recent first)
      // Since newer polls will have later end times
      return Number(b.settings.endTime - a.settings.endTime);
    })
    .slice(0, limit);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recentPolls.map((poll) => (
          <PollPreview 
            key={poll.pollId.toString()} 
            poll={poll} 
            onViewPoll={onViewPoll}
          />
        ))}
      </div>
      
      {polls.length > limit && onViewAllPolls && (
        <div className="text-center pt-2">
          <Button onClick={onViewAllPolls} variant="outline" size="sm" className="gap-2">
            <Vote className="w-4 h-4" />
            View All {polls.length} Polls
          </Button>
        </div>
      )}
    </div>
  );
}