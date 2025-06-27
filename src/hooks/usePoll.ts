import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { usePollsContract } from './useContract';
import { Poll, PollResponse, ActivePoll } from '@/types/poll';

export function usePolls() {
  const [polls, setPolls] = useState<ActivePoll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const contract = usePollsContract();

  useEffect(() => {
    async function fetchPolls() {
      if (!contract) {
        console.log('No contract available for fetching polls');
        setError('Contract not initialized. Please check your environment variables.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('Fetching all poll IDs from contract...');
        console.log('Contract object:', contract);
        
        // Get all poll IDs using ethers
        const allPollIds = await contract.getAllPollIds();
        console.log('All poll IDs fetched:', allPollIds);
        
        // Fetch individual polls for each ID
        const allPolls: Poll[] = [];
        for (const pollId of allPollIds) {
          try {
            const pollData = await contract.getPoll(pollId);
            allPolls.push(pollData);
          } catch (err) {
            console.error(`Error fetching poll ${pollId}:`, err);
          }
        }
        
        // Filter for active polls and transform to ActivePoll format
        const activePolls: ActivePoll[] = allPolls
          .filter(poll => poll.isOpen)
          .map(poll => ({
            content: {
              creator: poll.creator,
              subject: poll.subject,
              description: poll.description,
              category: poll.category,
              status: poll.status,
              viewType: poll.viewType,
              options: poll.options,
              isOpen: poll.isOpen
            },
            settings: {
              rewardPerResponse: poll.rewardPerResponse,
              maxResponses: poll.maxResponses,
              durationDays: poll.durationDays,
              minContribution: poll.minContribution,
              fundingType: poll.fundingType,
              targetFund: poll.targetFund,
              endTime: poll.endTime,
              funds: poll.funds,
              rewardToken: poll.rewardToken,
              rewardDistribution: poll.rewardDistribution
            }
          }));
        
        console.log('Active polls processed:', activePolls);
        setPolls(activePolls);
      } catch (err) {
        console.error('Error fetching polls:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch polls');
      } finally {
        setLoading(false);
      }
    }

    fetchPolls();
  }, [contract]);

  return { polls, loading, error, refetch: () => {
    if (contract) {
      setLoading(true);
      setError(null);
    }
  }};
}

export function usePoll(pollId: bigint | undefined) {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const contract = usePollsContract();

  useEffect(() => {
    async function fetchPoll() {
      if (!contract || !pollId) return;

      try {
        setLoading(true);
        const pollData = await contract.getPoll(pollId);
        setPoll(pollData as Poll);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch poll');
      } finally {
        setLoading(false);
      }
    }

    fetchPoll();
  }, [contract, pollId]);

  return { poll, loading, error };
}

export function usePollResponses(pollId: bigint | undefined) {
  const [responses, setResponses] = useState<PollResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const contract = usePollsContract();

  useEffect(() => {
    async function fetchResponses() {
      if (!contract || !pollId) return;

      try {
        setLoading(true);
        const responseData = await contract.getPollResponses(pollId);
        setResponses(responseData as PollResponse[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch responses');
      } finally {
        setLoading(false);
      }
    }

    fetchResponses();
  }, [contract, pollId]);

  return { responses, loading, error };
}

export function useUserPolls() {
  const [polls, setPolls] = useState<ActivePoll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { address } = useAccount();
  const contract = usePollsContract();

  useEffect(() => {
    async function fetchUserPolls() {
      if (!contract || !address) return;

      try {
        setLoading(true);
        const userPolls = await contract.getUserPolls(address);
        setPolls(userPolls as ActivePoll[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user polls');
      } finally {
        setLoading(false);
      }
    }

    fetchUserPolls();
  }, [contract, address]);

  return { polls, loading, error };
}