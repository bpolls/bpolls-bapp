export interface Poll {
  creator: string;
  subject: string;
  description: string;
  category: string;
  status: string;
  viewType: string;
  options: string[];
  rewardPerResponse: bigint;
  maxResponses: bigint;
  durationDays: bigint;
  minContribution: bigint;
  fundingType: string;
  targetFund: bigint;
  endTime: bigint;
  isOpen: boolean;
  totalResponses: bigint;
  funds: bigint;
  rewardToken: string;
  rewardDistribution: string;
}

export interface PollResponse {
  responder: string;
  response: string;
  weight: bigint;
  timestamp: bigint;
  isClaimed: boolean;
  reward: bigint;
}

export interface CreatePollParams {
  creator: string;
  subject: string;
  description: string;
  category: string;
  viewType: string;
  options: string[];
  rewardPerResponse: bigint;
  durationDays: bigint;
  maxResponses: bigint;
  minContribution: bigint;
  fundingType: string;
  isOpenImmediately: boolean;
  targetFund: bigint;
  rewardToken: string;
  rewardDistribution: string;
}

export interface DonorHistory {
  token: string;
  amount: bigint;
  timestamp: bigint;
  donationType: string;
  pollId: bigint;
}

export interface ActivePoll {
  pollId: bigint;
  content: {
    creator: string;
    subject: string;
    description: string;
    category: string;
    status: string;
    viewType: string;
    options: string[];
    isOpen: boolean;
  };
  settings: {
    rewardPerResponse: bigint;
    maxResponses: bigint;
    durationDays: bigint;
    minContribution: bigint;
    fundingType: string;
    targetFund: bigint;
    endTime: bigint;
    funds: bigint;
    rewardToken: string;
    rewardDistribution: string;
    totalResponses: bigint;
  };
}