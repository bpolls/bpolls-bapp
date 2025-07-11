import { useState, useEffect } from 'react';
import { usePollsContract } from './useContract';
import { Poll } from '@/types/poll';

export interface PollResultData {
  option: string;
  votes: number;
  percentage: number;
  color: string;
}

export interface PollResults {
  poll: Poll;
  pollId: bigint;
  results: PollResultData[];
  totalVotes: number;
  topChoice: string;
  participationRate: number;
  isEnded: boolean;
}

// Color palette for charts
const CHART_COLORS = [
  '#3B82F6', // Blue
  '#EF4444', // Red  
  '#10B981', // Green
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#6366F1', // Indigo
];

export function usePollResults(pollId: bigint | undefined) {
  const [results, setResults] = useState<PollResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const contract = usePollsContract();

  const fetchPollResults = async () => {
    if (!contract || !pollId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch poll data
      const pollData = await contract.getPoll(pollId);
      
      // For now, we'll simulate poll results since we need response aggregation
      // In a real implementation, you'd add a contract method like getResultSummary(pollId)
      const mockResults = generateMockResults(pollData);
      
      setResults(mockResults);
    } catch (err) {
      console.error('Error fetching poll results:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch poll results');
    } finally {
      setLoading(false);
    }
  };

  const generateMockResults = (poll: Poll): PollResults => {
    const totalVotes = Number(poll.totalResponses);
    const maxResponses = Number(poll.maxResponses);
    
    // Generate realistic vote distribution
    const results: PollResultData[] = poll.options.map((option, index) => {
      // Create varied but realistic vote counts
      const baseVotes = Math.floor(totalVotes / poll.options.length);
      const variation = Math.floor(Math.random() * (totalVotes * 0.3));
      const votes = Math.max(0, baseVotes + (Math.random() > 0.5 ? variation : -variation));
      
      return {
        option,
        votes,
        percentage: 0, // Will calculate after all votes are determined
        color: CHART_COLORS[index % CHART_COLORS.length]
      };
    });

    // Adjust to match actual total votes
    const calculatedTotal = results.reduce((sum, r) => sum + r.votes, 0);
    if (calculatedTotal !== totalVotes && totalVotes > 0) {
      // Adjust the first option to match exact total
      results[0].votes += (totalVotes - calculatedTotal);
    }

    // Calculate percentages
    const finalTotal = Math.max(1, results.reduce((sum, r) => sum + r.votes, 0));
    results.forEach(result => {
      result.percentage = (result.votes / finalTotal) * 100;
    });

    // Sort by votes (descending)
    results.sort((a, b) => b.votes - a.votes);

    const topChoice = results[0]?.option || 'No votes yet';
    const participationRate = maxResponses > 0 ? (totalVotes / maxResponses) * 100 : 0;
    const now = BigInt(Math.floor(Date.now() / 1000));
    const isEnded = poll.endTime <= now || !poll.isOpen;

    return {
      poll,
      pollId,
      results,
      totalVotes,
      topChoice,
      participationRate,
      isEnded
    };
  };

  useEffect(() => {
    fetchPollResults();
  }, [contract, pollId]);

  return { results, loading, error, refetch: fetchPollResults };
}