'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ActivePoll } from '@/types/poll';
import { formatAddress, formatBigInt } from '@/lib/utils';
import { usePollsContract } from '@/hooks/useContract';
import { Clock, Users, DollarSign, Vote } from 'lucide-react';

interface PollCardProps {
  poll: ActivePoll;
  onVote?: () => void;
}

export function PollCard({ poll, onVote }: PollCardProps) {
  const { address } = useAccount();
  const contract = usePollsContract();
  const [isVoting, setIsVoting] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [showVoteForm, setShowVoteForm] = useState(false);

  const handleVote = async () => {
    if (!contract || !address || !selectedOption) return;

    try {
      setIsVoting(true);
      
      // Get poll ID from contract - we'll need to implement this
      // For now, we'll use a placeholder
      const pollId = BigInt(0); // This should be fetched from the contract
      
      const minContribution = poll.settings.minContribution;
      await contract.write.submitResponse([pollId, selectedOption], { 
        value: minContribution 
      });
      
      setShowVoteForm(false);
      setSelectedOption('');
      onVote?.();
      alert('Vote submitted successfully!');
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to submit vote. Please try again.');
    } finally {
      setIsVoting(false);
    }
  };

  const formatTimeRemaining = (endTime: bigint) => {
    const now = BigInt(Math.floor(Date.now() / 1000));
    const remaining = endTime - now;
    
    if (remaining <= 0) return 'Ended';
    
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
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{poll.content.subject}</CardTitle>
            <CardDescription className="mt-1">
              by {formatAddress(poll.content.creator)}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              poll.content.isOpen 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {poll.content.isOpen ? 'Open' : 'Closed'}
            </span>
            <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
              {poll.content.category}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {poll.content.description && (
            <p className="text-sm text-muted-foreground">{poll.content.description}</p>
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>{formatTimeRemaining(poll.settings.endTime)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span>{poll.settings.maxResponses.toString()} max</span>
            </div>
            
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span>{formatBigInt(poll.settings.rewardPerResponse)} BTC</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Vote className="w-4 h-4 text-muted-foreground" />
              <span>{formatBigInt(poll.settings.funds)} BTC funded</span>
            </div>
          </div>

          {poll.content.options && poll.content.options.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Options:</h4>
              <div className="space-y-1">
                {poll.content.options.map((option, index) => (
                  <div key={index} className="text-sm text-muted-foreground">
                    • {option}
                  </div>
                ))}
              </div>
            </div>
          )}

          {poll.content.isOpen && address && (
            <div className="border-t pt-4">
              {!showVoteForm ? (
                <Button 
                  onClick={() => setShowVoteForm(true)}
                  className="w-full"
                  variant="outline"
                >
                  Vote on this Poll
                </Button>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Choose your option:</label>
                    <div className="space-y-2">
                      {poll.content.options.map((option, index) => (
                        <label key={index} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="pollOption"
                            value={option}
                            checked={selectedOption === option}
                            onChange={(e) => setSelectedOption(e.target.value)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {poll.settings.minContribution > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Minimum contribution: {formatBigInt(poll.settings.minContribution)} BTC
                    </p>
                  )}
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={handleVote}
                      disabled={isVoting || !selectedOption}
                      className="flex-1"
                    >
                      {isVoting ? 'Submitting...' : 'Submit Vote'}
                    </Button>
                    <Button
                      onClick={() => {
                        setShowVoteForm(false);
                        setSelectedOption('');
                      }}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}