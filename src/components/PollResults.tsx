'use client';

import { usePoll, usePollResponses } from '@/hooks/usePoll';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatAddress, formatBigInt } from '@/lib/utils';
import { Loader2, BarChart3, Clock, Users } from 'lucide-react';

interface PollResultsProps {
  pollId: bigint;
}

export function PollResults({ pollId }: PollResultsProps) {
  const { poll, loading: pollLoading } = usePoll(pollId);
  const { responses, loading: responsesLoading } = usePollResponses(pollId);

  const loading = pollLoading || responsesLoading;

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading poll results...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!poll) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Poll Not Found</CardTitle>
          <CardDescription>The requested poll could not be found.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Calculate vote counts for each option
  const voteCounts = poll.options.reduce((acc, option) => {
    acc[option] = responses.filter(response => response.response === option).length;
    return acc;
  }, {} as Record<string, number>);

  const totalVotes = responses.length;
  const maxVotes = Math.max(...Object.values(voteCounts));

  const formatTimeRemaining = (endTime: bigint) => {
    const now = BigInt(Math.floor(Date.now() / 1000));
    const remaining = endTime - now;
    
    if (remaining <= 0) return 'Poll has ended';
    
    const days = remaining / BigInt(86400);
    const hours = (remaining % BigInt(86400)) / BigInt(3600);
    
    if (days > 0) {
      return `${days}d ${hours}h remaining`;
    } else if (hours > 0) {
      return `${hours}h remaining`;
    } else {
      const minutes = (remaining % BigInt(3600)) / BigInt(60);
      return `${minutes}m remaining`;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{poll.subject}</CardTitle>
              <CardDescription className="mt-1">
                Created by {formatAddress(poll.creator)}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                poll.isOpen ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {poll.isOpen ? 'Open' : 'Closed'}
              </span>
              <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                {poll.category}
              </span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {poll.description && (
              <p className="text-muted-foreground">{poll.description}</p>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{formatTimeRemaining(poll.endTime)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span>{totalVotes} / {poll.maxResponses.toString()} responses</span>
              </div>
              
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-muted-foreground" />
                <span>{formatBigInt(poll.funds)} BTC total funds</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Poll Results
          </CardTitle>
          <CardDescription>
            {totalVotes} total votes • Updated in real-time
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {poll.options.map((option, index) => {
              const votes = voteCounts[option] || 0;
              const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
              const isWinning = votes === maxVotes && votes > 0;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`font-medium ${isWinning ? 'text-green-600' : ''}`}>
                      {option}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{votes} votes</span>
                      <span>({percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isWinning ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            
            {totalVotes === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No votes yet. Be the first to vote!
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {responses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Responses</CardTitle>
            <CardDescription>
              Latest {Math.min(responses.length, 10)} responses
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              {responses
                .slice(-10)
                .reverse()
                .map((response, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{response.response}</span>
                      <span className="text-sm text-muted-foreground">
                        by {formatAddress(response.responder)}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatBigInt(response.reward)} BTC reward
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}