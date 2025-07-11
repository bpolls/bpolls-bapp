'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ActivePoll } from '@/types/poll';
import { formatAddress, formatBigInt } from '@/lib/utils';
import { Clock, Users, DollarSign } from 'lucide-react';

interface PollPreviewProps {
  poll: ActivePoll;
  onViewPoll?: (pollId: bigint) => void;
}

export function PollPreview({ poll, onViewPoll }: PollPreviewProps) {
  const formatTimeRemaining = (endTime: bigint) => {
    const now = BigInt(Math.floor(Date.now() / 1000));
    const remaining = endTime - now;
    
    if (remaining <= 0) return 'Ended';
    
    const days = remaining / BigInt(86400);
    const hours = (remaining % BigInt(86400)) / BigInt(3600);
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      const minutes = (remaining % BigInt(3600)) / BigInt(60);
      return `${minutes}m`;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onViewPoll?.(poll.pollId)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base line-clamp-1">{poll.content.subject}</CardTitle>
            <CardDescription className="text-xs">
              by {formatAddress(poll.content.creator)}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
              poll.content.isOpen 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {poll.content.isOpen ? 'Open' : 'Closed'}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {poll.content.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{poll.content.description}</p>
          )}
          
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="truncate">{formatTimeRemaining(poll.settings.endTime)}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 text-muted-foreground" />
              <span className="truncate">{poll.settings.totalResponses.toString()}/{poll.settings.maxResponses.toString()}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-muted-foreground" />
              <span className="truncate">{formatBigInt(poll.settings.funds)} cBTC</span>
            </div>
          </div>

          <Button 
            size="sm" 
            variant="outline" 
            className="w-full text-xs h-7"
            onClick={(e) => {
              e.stopPropagation();
              onViewPoll?.(poll.pollId);
            }}
          >
            View Poll
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}