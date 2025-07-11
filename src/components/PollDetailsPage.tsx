'use client';

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAccount, useWalletClient } from 'wagmi';
import { usePoll } from '@/hooks/usePoll';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatAddress, formatBigInt } from '@/lib/utils';
import { Clock, Users, DollarSign, Vote, ArrowLeft, Calendar, User } from 'lucide-react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES } from '@/constants/contracts';
import { POLLS_DAPP_ABI } from '@/constants/abi';
import { showToast } from '@/lib/toast';

export function PollDetailsPage() {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { poll, loading, error } = usePoll(pollId ? BigInt(pollId) : undefined);
  
  const [isVoting, setIsVoting] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('');

  const handleVote = async () => {
    if (!address || !selectedOption || !walletClient || !poll || !pollId) return;

    try {
      setIsVoting(true);
      
      const minContribution = poll.minContribution;
      
      // Create a signer and contract for write operations
      const provider = new ethers.BrowserProvider(walletClient.transport);
      const signer = await provider.getSigner();
      const contractWithSigner = new ethers.Contract(
        CONTRACT_ADDRESSES.POLLS_DAPP,
        POLLS_DAPP_ABI,
        signer
      );
      
      // Use ethers.js syntax for contract interaction
      const tx = await contractWithSigner.submitResponse(BigInt(pollId), selectedOption, { 
        value: minContribution 
      });
      
      // Wait for transaction confirmation
      await tx.wait();
      
      setSelectedOption('');
      showToast.success('Vote submitted successfully!', `Your vote for "${selectedOption}" has been recorded.`);
      
      // Navigate back to browse page after successful vote
      setTimeout(() => {
        navigate('/browse');
      }, 2000);
    } catch (error) {
      console.error('Error voting:', error);
      showToast.error('Failed to submit vote', 'Please check your wallet and try again.');
    } finally {
      setIsVoting(false);
    }
  };

  const formatTimeRemaining = (endTime: bigint) => {
    const now = BigInt(Math.floor(Date.now() / 1000));
    const remaining = endTime - now;
    
    if (remaining <= 0) return 'Poll has ended';
    
    const days = remaining / BigInt(86400);
    const hours = (remaining % BigInt(86400)) / BigInt(3600);
    const minutes = (remaining % BigInt(3600)) / BigInt(60);
    
    if (days > 0) {
      return `${days} days, ${hours} hours remaining`;
    } else if (hours > 0) {
      return `${hours} hours, ${minutes} minutes remaining`;
    } else {
      return `${minutes} minutes remaining`;
    }
  };

  const formatCreatedDate = (endTime: bigint, durationDays: bigint) => {
    const endTimeMs = Number(endTime) * 1000;
    const durationMs = Number(durationDays) * 24 * 60 * 60 * 1000;
    const createdDate = new Date(endTimeMs - durationMs);
    return createdDate.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Button onClick={() => navigate(-1)} variant="outline" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
              <span>Loading poll details...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !poll) {
    return (
      <div className="space-y-6">
        <Button onClick={() => navigate(-1)} variant="outline" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Poll Not Found</CardTitle>
            <CardDescription>
              {error || 'The requested poll could not be found.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/browse')} className="gap-2">
              <Vote className="w-4 h-4" />
              Browse Other Polls
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isActive = poll.isOpen && poll.totalResponses < poll.maxResponses;
  const timeRemaining = formatTimeRemaining(poll.endTime);
  const isEnded = timeRemaining === 'Poll has ended';

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button onClick={() => navigate(-1)} variant="outline" className="gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      {/* Poll Details Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{poll.subject}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>by {formatAddress(poll.creator)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Created {formatCreatedDate(poll.endTime, poll.durationDays)}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isActive 
                  ? 'bg-green-100 text-green-800' 
                  : isEnded
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {isActive ? 'Active' : isEnded ? 'Ended' : 'Closed'}
              </span>
              <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                {poll.category}
              </span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            {/* Description */}
            {poll.description && (
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-muted-foreground">{poll.description}</p>
              </div>
            )}

            {/* Poll Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Duration</div>
                  <div className="text-sm text-muted-foreground">{timeRemaining}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Responses</div>
                  <div className="text-sm text-muted-foreground">
                    {poll.totalResponses.toString()}/{poll.maxResponses.toString()}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Reward</div>
                  <div className="text-sm text-muted-foreground">
                    {formatBigInt(poll.rewardPerResponse)} cBTC
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Vote className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Total Funds</div>
                  <div className="text-sm text-muted-foreground">
                    {formatBigInt(poll.funds)} cBTC
                  </div>
                </div>
              </div>
            </div>

            {/* Options */}
            {poll.options && poll.options.length > 0 && (
              <div>
                <h4 className="font-medium mb-4">Poll Options</h4>
                <div className="space-y-3">
                  {poll.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      {isActive && address ? (
                        <input
                          type="radio"
                          name="pollOption"
                          value={option}
                          checked={selectedOption === option}
                          onChange={(e) => setSelectedOption(e.target.value)}
                          className="w-4 h-4"
                          disabled={isVoting}
                        />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                      )}
                      <span className="text-sm font-medium">{option}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Voting Section */}
            {isActive && address ? (
              <div className="border-t pt-6">
                <div className="space-y-4">
                  {poll.totalResponses >= poll.maxResponses ? (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground mb-4">
                        This poll has reached the maximum number of responses ({poll.maxResponses.toString()})
                      </p>
                      <Button disabled variant="outline" className="w-full">
                        Poll Full
                      </Button>
                    </div>
                  ) : (
                    <>
                      {poll.minContribution > 0 && (
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Minimum contribution:</strong> {formatBigInt(poll.minContribution)} cBTC
                          </p>
                        </div>
                      )}
                      
                      <Button
                        onClick={handleVote}
                        disabled={isVoting || !selectedOption}
                        className="w-full"
                        size="lg"
                      >
                        {isVoting ? 'Submitting Vote...' : 'Submit Vote'}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ) : !address ? (
              <div className="border-t pt-6">
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">
                    Connect your wallet to participate in this poll
                  </p>
                </div>
              </div>
            ) : (
              <div className="border-t pt-6">
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">
                    This poll is no longer accepting responses
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}