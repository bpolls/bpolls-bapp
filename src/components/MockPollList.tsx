'use client';

import { PollCard } from './PollCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivePoll } from '@/types/poll';

const mockPolls: ActivePoll[] = [
  {
    content: {
      creator: '0x1234567890123456789012345678901234567890',
      subject: 'What\'s the future of Web3 voting?',
      description: 'Help shape the future of decentralized governance by sharing your thoughts on Web3 voting mechanisms.',
      category: 'Technology',
      status: 'active',
      viewType: 'public',
      options: [
        'On-chain voting with tokens',
        'Zero-knowledge proof voting', 
        'Hybrid on/off-chain systems',
        'Traditional systems are fine'
      ],
      isOpen: true
    },
    settings: {
      rewardPerResponse: BigInt('1000000000000000'), // 0.001 BTC
      maxResponses: BigInt(500),
      durationDays: BigInt(7),
      minContribution: BigInt(0),
      fundingType: 'community',
      targetFund: BigInt('100000000000000000'), // 0.1 BTC
      endTime: BigInt(Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60), // 7 days from now
      funds: BigInt('75000000000000000'), // 0.075 BTC
      rewardToken: '0x0000000000000000000000000000000000000000',
      rewardDistribution: 'equal'
    }
  },
  {
    content: {
      creator: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      subject: 'Best blockchain for DeFi applications?',
      description: 'Which blockchain do you think offers the best infrastructure for decentralized finance applications?',
      category: 'Finance',
      status: 'active',
      viewType: 'public',
      options: [
        'Ethereum',
        'Citrea',
        'Polygon', 
        'Solana',
        'Other'
      ],
      isOpen: true
    },
    settings: {
      rewardPerResponse: BigInt('2000000000000000'), // 0.002 BTC
      maxResponses: BigInt(1000),
      durationDays: BigInt(14),
      minContribution: BigInt(0),
      fundingType: 'creator',
      targetFund: BigInt('500000000000000000'), // 0.5 BTC
      endTime: BigInt(Math.floor(Date.now() / 1000) + 11 * 24 * 60 * 60), // 11 days from now
      funds: BigInt('350000000000000000'), // 0.35 BTC
      rewardToken: '0x0000000000000000000000000000000000000000',
      rewardDistribution: 'weighted'
    }
  },
  {
    content: {
      creator: '0x9876543210987654321098765432109876543210',
      subject: 'Community Fund Allocation Priority',
      description: 'How should we prioritize the allocation of our community development fund?',
      category: 'Governance',
      status: 'active',
      viewType: 'public',
      options: [
        'Developer incentives',
        'Marketing and adoption',
        'Infrastructure improvements',
        'Community events'
      ],
      isOpen: true
    },
    settings: {
      rewardPerResponse: BigInt('1500000000000000'), // 0.0015 BTC
      maxResponses: BigInt(750),
      durationDays: BigInt(10),
      minContribution: BigInt('10000000000000000'), // 0.01 BTC min contribution
      fundingType: 'community',
      targetFund: BigInt('250000000000000000'), // 0.25 BTC
      endTime: BigInt(Math.floor(Date.now() / 1000) + 3 * 24 * 60 * 60 + 18 * 60 * 60), // 3d 18h from now
      funds: BigInt('200000000000000000'), // 0.2 BTC
      rewardToken: '0x0000000000000000000000000000000000000000',
      rewardDistribution: 'equal'
    }
  }
];

export function MockPollList() {
  return (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">📝 Demo Mode</CardTitle>
          <CardDescription>
            Showing mock polls for demonstration. Connect to Citrea and configure contract addresses to see real polls.
          </CardDescription>
        </CardHeader>
      </Card>
      
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Demo Polls ({mockPolls.length})</h2>
      </div>
      
      <div className="grid gap-6">
        {mockPolls.map((poll, index) => (
          <PollCard 
            key={`demo-poll-${index}`} 
            poll={poll} 
            onVote={() => alert('Demo mode: Connect your wallet and configure contracts to vote on real polls!')}
          />
        ))}
      </div>
    </div>
  );
}