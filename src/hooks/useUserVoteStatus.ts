import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { usePollsContract } from './useContract';

export function useUserVoteStatus(pollId: bigint | undefined) {
  const [hasVoted, setHasVoted] = useState(false);
  const [userResponse, setUserResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { address } = useAccount();
  const contract = usePollsContract();

  const checkVoteStatus = async () => {
    if (!contract || !address || !pollId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get all responses for this poll and check if user has already voted
      try {
        const responses = await contract.getPollResponses(pollId);
        
        // Find if the current user has already responded
        const userResponseData = responses.find((response: any) => 
          response.responder.toLowerCase() === address.toLowerCase()
        );
        
        if (userResponseData) {
          setHasVoted(true);
          setUserResponse(userResponseData.response);
        } else {
          setHasVoted(false);
          setUserResponse(null);
        }
      } catch (contractError: any) {
        // If getPollResponses method fails, use localStorage as fallback
        console.warn('Contract method failed, using localStorage fallback:', contractError);
        const storageKey = `poll_vote_${pollId}_${address}`;
        const storedVote = localStorage.getItem(storageKey);
        if (storedVote) {
          setHasVoted(true);
          setUserResponse(storedVote);
        } else {
          setHasVoted(false);
          setUserResponse(null);
        }
      }
    } catch (err) {
      console.error('Error checking vote status:', err);
      setError(err instanceof Error ? err.message : 'Failed to check vote status');
      setHasVoted(false);
      setUserResponse(null);
    } finally {
      setLoading(false);
    }
  };

  // Function to mark user as voted (to be called after successful vote)
  const markAsVoted = (response: string) => {
    setHasVoted(true);
    setUserResponse(response);
    
    // Also store in localStorage as backup
    if (pollId && address) {
      const storageKey = `poll_vote_${pollId}_${address}`;
      localStorage.setItem(storageKey, response);
    }
  };

  useEffect(() => {
    checkVoteStatus();
  }, [contract, address, pollId]);

  return {
    hasVoted,
    userResponse,
    loading,
    error,
    markAsVoted,
    refetch: checkVoteStatus
  };
}