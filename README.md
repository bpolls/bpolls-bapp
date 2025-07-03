# 🗳️ BPolls - Decentralized Polling on Citrea

A modern, decentralized polling application built for the Citrea blockchain. Create polls, vote, and earn rewards through transparent, on-chain governance.

## ✨ Features

- **🗳️ Decentralized Polling**: Create and participate in blockchain-secured polls
- **💰 Earn Rewards**: Get rewarded for participating in community governance
- **📊 Real-time Results**: Live poll results updated on the blockchain
- **🔗 Citrea Native**: Built specifically for the Citrea blockchain ecosystem
- **📱 Mobile Responsive**: Vote and create polls from any device
- **🔍 Transparent**: All voting is verifiable on-chain

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MetaMask or WalletConnect compatible wallet
- Access to Citrea Testnet

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd bpolls-bapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Edit `.env.local` and add your contract addresses:
   ```env
   NEXT_PUBLIC_POLLS_DAPP_ADDRESS=0x...
   NEXT_PUBLIC_POLL_MANAGER_ADDRESS=0x...
   NEXT_PUBLIC_FUNDING_MANAGER_ADDRESS=0x...
   NEXT_PUBLIC_RESPONSE_MANAGER_ADDRESS=0x...
   NEXT_PUBLIC_TOKEN_MANAGER_ADDRESS=0x...
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🔗 Smart Contract Integration

BPolls integrates with five main smart contracts:

- **POLLS_DAPP**: Main contract for poll operations
- **POLL_MANAGER**: Manages poll lifecycle and validation  
- **FUNDING_MANAGER**: Handles poll funding and rewards
- **RESPONSE_MANAGER**: Manages poll responses and voting
- **TOKEN_MANAGER**: Manages whitelisted tokens

## 🌐 Network Configuration

### Citrea Testnet
- **Chain ID**: 5115
- **RPC URL**: https://rpc.testnet.citrea.xyz
- **Explorer**: https://explorer.testnet.citrea.xyz

## 🔨 Troubleshooting

### Polls Not Loading

The app includes a debug panel that will help you identify issues:

1. **Check contract addresses**: Ensure all contract addresses are set in `.env.local`
2. **Verify network**: Make sure you're connected to Citrea Testnet (Chain ID: 5115)
3. **Check contracts**: Verify contracts are deployed and accessible
4. **Browser console**: Check for detailed error messages in developer tools

### Demo Mode

If contracts aren't configured, the app will automatically show demo polls for presentation purposes. This allows you to:
- See the full user interface
- Take screenshots for documentation
- Demonstrate the application without deployed contracts

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Web3**: Wagmi v1, Viem, Ethers.js v6
- **Blockchain**: Citrea (EVM-compatible)
- **State Management**: TanStack Query

---