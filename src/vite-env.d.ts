/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_POLLS_DAPP_ADDRESS: string
  readonly VITE_POLL_MANAGER_ADDRESS: string
  readonly VITE_FUNDING_MANAGER_ADDRESS: string
  readonly VITE_RESPONSE_MANAGER_ADDRESS: string
  readonly VITE_TOKEN_MANAGER_ADDRESS: string
  readonly VITE_WALLETCONNECT_PROJECT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// MetaMask Ethereum Provider Types
interface EthereumProvider {
  request(args: { method: string; params?: any[] }): Promise<any>;
  on(event: string, callback: Function): void;
  removeListener(event: string, callback: Function): void;
  isMetaMask?: boolean;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}