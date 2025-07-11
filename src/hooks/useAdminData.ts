import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { usePollsContract } from './useContract';
import { ActivePoll } from '@/types/poll';

export interface CreatorStats {
  totalPolls: number;
  openPolls: number;
  fundingPolls: number;
  closedPolls: number;
  totalFunding: bigint;
  totalResponses: number;
}

export interface ResponderStats {
  totalParticipated: number;
  totalRewardsEarned: bigint;
  recentActivity: Array<{
    pollId: bigint;
    response: string;
    reward: bigint;
    timestamp: bigint;
  }>;
}

export interface PollAdminData extends ActivePoll {
  canManage: boolean;
}

export function useCreatorStats() {
  const [stats, setStats] = useState<CreatorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { address } = useAccount();
  const contract = usePollsContract();

  const fetchCreatorStats = async () => {
    if (!contract || !address) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get all poll IDs
      const allPollIds = await contract.getAllPollIds();
      
      // Fetch polls created by current user
      const creatorPolls: ActivePoll[] = [];
      for (const pollId of allPollIds) {
        try {
          const pollData = await contract.getPoll(pollId);
          if (pollData.creator.toLowerCase() === address.toLowerCase()) {
            creatorPolls.push({
              pollId,
              content: {
                creator: pollData.creator,
                subject: pollData.subject,
                description: pollData.description,
                category: pollData.category,
                status: pollData.status,
                viewType: pollData.viewType,
                options: pollData.options,
                isOpen: pollData.isOpen
              },
              settings: {
                rewardPerResponse: pollData.rewardPerResponse,
                maxResponses: pollData.maxResponses,
                durationDays: pollData.durationDays,
                minContribution: pollData.minContribution,
                fundingType: pollData.fundingType,
                targetFund: pollData.targetFund,
                endTime: pollData.endTime,
                funds: pollData.funds,
                rewardToken: pollData.rewardToken,
                rewardDistribution: pollData.rewardDistribution,
                totalResponses: pollData.totalResponses
              }
            });
          }
        } catch (err) {
          console.error(`Error fetching poll ${pollId}:`, err);
        }
      }

      // Calculate stats
      const now = BigInt(Math.floor(Date.now() / 1000));
      const openPolls = creatorPolls.filter(p => {
        const isTimeValid = p.settings.endTime > now;
        const isNotFull = p.settings.totalResponses < p.settings.maxResponses;
        return p.content.isOpen && isTimeValid && isNotFull;
      }).length;
      const fundingPolls = creatorPolls.filter(p => p.content.status === 'funding').length;
      const closedPolls = creatorPolls.filter(p => {
        const isTimeExpired = p.settings.endTime <= now;
        const isFull = p.settings.totalResponses >= p.settings.maxResponses;
        return !p.content.isOpen || isTimeExpired || isFull;
      }).length;
      const totalFunding = creatorPolls.reduce((sum, p) => sum + p.settings.funds, BigInt(0));
      const totalResponses = creatorPolls.reduce((sum, p) => sum + Number(p.settings.totalResponses), 0);

      setStats({
        totalPolls: creatorPolls.length,
        openPolls,
        fundingPolls,
        closedPolls,
        totalFunding,
        totalResponses
      });
    } catch (err) {
      console.error('Error fetching creator stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch creator stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreatorStats();
  }, [contract, address]);

  return { stats, loading, error, refetch: fetchCreatorStats };
}

export function useResponderStats() {
  const [stats, setStats] = useState<ResponderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { address } = useAccount();
  const contract = usePollsContract();

  const fetchResponderStats = async () => {
    if (!contract || !address) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // For now, we'll use mock data since we need additional contract methods
      // to track user responses. In a real implementation, you'd add methods like:
      // - getUserResponses(address user)
      // - getUserRewards(address user)
      
      setStats({
        totalParticipated: 5, // Mock data
        totalRewardsEarned: BigInt('1500000000000000000'), // 1.5 cBTC
        recentActivity: [
          {
            pollId: BigInt(1),
            response: "Option A",
            reward: BigInt('300000000000000000'),
            timestamp: BigInt(Math.floor(Date.now() / 1000))
          },
          {
            pollId: BigInt(2),
            response: "Option B",
            reward: BigInt('500000000000000000'),
            timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400) // 1 day ago
          },
          {
            pollId: BigInt(3),
            response: "Option C",
            reward: BigInt('700000000000000000'),
            timestamp: BigInt(Math.floor(Date.now() / 1000) - 172800) // 2 days ago
          }
        ]
      });
    } catch (err) {
      console.error('Error fetching responder stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch responder stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResponderStats();
  }, [contract, address]);

  return { stats, loading, error, refetch: fetchResponderStats };
}

export function useAdminPolls() {
  const [polls, setPolls] = useState<PollAdminData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { address } = useAccount();
  const contract = usePollsContract();

  const fetchAdminPolls = async () => {
    if (!contract) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get all poll IDs
      const allPollIds = await contract.getAllPollIds();
      
      // Fetch all polls with admin info
      const adminPolls: PollAdminData[] = [];
      for (const pollId of allPollIds) {
        try {
          const pollData = await contract.getPoll(pollId);
          const canManage = address && pollData.creator.toLowerCase() === address.toLowerCase();
          
          // Determine actual poll status based on time and responses
          const now = BigInt(Math.floor(Date.now() / 1000));
          const isTimeExpired = pollData.endTime <= now;
          const isFull = pollData.totalResponses >= pollData.maxResponses;
          const actualStatus = isTimeExpired || isFull ? 'ended' : pollData.status;
          
          adminPolls.push({
            pollId,
            content: {
              creator: pollData.creator,
              subject: pollData.subject,
              description: pollData.description,
              category: pollData.category,
              status: actualStatus,
              viewType: pollData.viewType,
              options: pollData.options,
              isOpen: pollData.isOpen && !isTimeExpired && !isFull
            },
            settings: {
              rewardPerResponse: pollData.rewardPerResponse,
              maxResponses: pollData.maxResponses,
              durationDays: pollData.durationDays,
              minContribution: pollData.minContribution,
              fundingType: pollData.fundingType,
              targetFund: pollData.targetFund,
              endTime: pollData.endTime,
              funds: pollData.funds,
              rewardToken: pollData.rewardToken,
              rewardDistribution: pollData.rewardDistribution,
              totalResponses: pollData.totalResponses
            },
            canManage: !!canManage
          });
        } catch (err) {
          console.error(`Error fetching poll ${pollId}:`, err);
        }
      }

      setPolls(adminPolls);
    } catch (err) {
      console.error('Error fetching admin polls:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch polls');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminPolls();
  }, [contract, address]);

  return { polls, loading, error, refetch: fetchAdminPolls };
}