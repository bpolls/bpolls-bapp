# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BPolls is a decentralized polling application built for the Citrea blockchain. It allows users to create polls, vote on existing polls, and earn rewards for participation. The application interacts with a comprehensive smart contract system that manages poll creation, funding, responses, and rewards.

## Technology Stack

- **Frontend**: Next.js 14 with React 18, TypeScript
- **Styling**: Tailwind CSS with custom component library
- **Web3 Integration**: Wagmi v1, Viem, Ethers.js v6
- **Blockchain**: Citrea Testnet (EVM-compatible)
- **State Management**: TanStack Query for server state

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type checking
npm run type-check
```

## Smart Contract Integration

The application interacts with five main contracts:
- **POLLS_DAPP**: Main contract for poll operations
- **POLL_MANAGER**: Manages poll lifecycle and validation
- **FUNDING_MANAGER**: Handles poll funding and rewards
- **RESPONSE_MANAGER**: Manages poll responses and voting
- **TOKEN_MANAGER**: Manages whitelisted tokens

Contract addresses are configured in `src/constants/contracts.ts` and should be set in `.env.local`.

## Architecture

```
src/
├── app/                 # Next.js app directory
│   ├── layout.tsx      # Root layout with providers
│   ├── page.tsx        # Home page
│   ├── providers.tsx   # Wagmi and React Query providers
│   └── globals.css     # Global styles
├── components/
│   ├── ui/             # Reusable UI components
│   ├── WalletConnect.tsx
│   ├── CreatePoll.tsx
│   ├── PollCard.tsx
│   ├── PollList.tsx
│   └── PollResults.tsx
├── hooks/
│   ├── useContract.ts  # Contract interaction hooks
│   └── usePoll.ts      # Poll data hooks
├── lib/
│   ├── wagmi.ts        # Wagmi configuration
│   └── utils.ts        # Utility functions
├── types/
│   └── poll.ts         # TypeScript interfaces
└── constants/
    ├── abi.ts          # Smart contract ABIs
    └── contracts.ts    # Contract addresses and chain config
```

## Key Features

1. **Wallet Connection**: MetaMask and WalletConnect support
2. **Poll Creation**: Create polls with multiple options, funding, and rewards
3. **Voting System**: Vote on active polls with optional minimum contributions
4. **Results Display**: Real-time poll results with vote counts and percentages
5. **Reward System**: Earn rewards for participating in polls

## Environment Variables

Required environment variables in `.env.local`:
- `NEXT_PUBLIC_POLLS_DAPP_ADDRESS`: Main contract address
- `NEXT_PUBLIC_POLL_MANAGER_ADDRESS`: Poll manager contract
- `NEXT_PUBLIC_FUNDING_MANAGER_ADDRESS`: Funding manager contract
- `NEXT_PUBLIC_RESPONSE_MANAGER_ADDRESS`: Response manager contract
- `NEXT_PUBLIC_TOKEN_MANAGER_ADDRESS`: Token manager contract
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: WalletConnect project ID

## Development Notes

- The app is configured for Citrea Testnet (Chain ID: 5115)
- Uses BigInt for handling large numbers and wei conversions
- All contract interactions are typed with proper TypeScript interfaces
- Error handling is implemented for wallet connection and contract calls
- Responsive design works on mobile and desktop

## Common Tasks

- **Adding new contract methods**: Update ABI in `src/constants/abi.ts` and add hooks in `src/hooks/useContract.ts`
- **Adding new poll types**: Extend interfaces in `src/types/poll.ts`
- **Styling changes**: Modify Tailwind classes or add custom CSS in `globals.css`
- **Chain configuration**: Update `CITREA_CHAIN_CONFIG` in `src/constants/contracts.ts`