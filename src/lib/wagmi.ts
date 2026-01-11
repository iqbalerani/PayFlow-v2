import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, mainnet } from 'wagmi/chains';
import { http } from 'viem';

// Get environment variables
const alchemyApiKey = import.meta.env.VITE_ALCHEMY_API_KEY;
const walletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID';

// Configure supported chains
export const config = getDefaultConfig({
  appName: 'PayFlow',
  projectId: walletConnectProjectId,
  chains: [sepolia, mainnet],
  transports: {
    [sepolia.id]: http(
      alchemyApiKey
        ? `https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`
        : 'https://rpc.sepolia.org'
    ),
    [mainnet.id]: http(
      alchemyApiKey
        ? `https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`
        : 'https://eth.llamarpc.com'
    ),
  },
  ssr: false, // Not using server-side rendering
});

// MNEE Token Address (from environment - Mock MNEE on Sepolia)
export const MNEE_TOKEN_ADDRESS = (import.meta.env.VITE_MNEE_TOKEN_ADDRESS || '0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF') as `0x${string}`;

// PayFlow Escrow Contract Address (will be set after deployment)
export const PAYFLOW_ESCROW_ADDRESS = (import.meta.env.VITE_PAYFLOW_ESCROW_ADDRESS || '') as `0x${string}`;

// Contract Addresses by Network
export const CONTRACT_ADDRESSES = {
  [mainnet.id]: {
    mneeToken: '0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF' as `0x${string}`, // Real MNEE on mainnet
    payflowEscrow: PAYFLOW_ESCROW_ADDRESS,
  },
  [sepolia.id]: {
    // For testnet, use Mock MNEE from environment
    mneeToken: MNEE_TOKEN_ADDRESS,
    payflowEscrow: PAYFLOW_ESCROW_ADDRESS,
  },
} as const;

// Helper to get contract addresses for current chain
export function getContractAddresses(chainId: number) {
  return CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES] || CONTRACT_ADDRESSES[sepolia.id];
}
