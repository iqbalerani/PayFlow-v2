import PayFlowEscrowArtifact from './PayFlowEscrow.json';
import ERC20Artifact from './ERC20.json';
import { getContractAddresses } from './wagmi';

// Export ABIs
export const PayFlowEscrowABI = PayFlowEscrowArtifact.abi;
export const ERC20ABI = ERC20Artifact.abi;

// Contract configuration helper
export function getPayFlowEscrowConfig(chainId: number) {
  const addresses = getContractAddresses(chainId);
  return {
    address: addresses.payflowEscrow,
    abi: PayFlowEscrowABI,
  } as const;
}

// MNEE Token configuration helper
export function getMNEETokenConfig(chainId: number) {
  const addresses = getContractAddresses(chainId);
  return {
    address: addresses.mneeToken,
    abi: ERC20ABI,
  } as const;
}

// Type for milestone status (matches smart contract enum)
export enum MilestoneStatus {
  EMPTY = 0,
  DEPOSITED = 1,
  RELEASED = 2,
  REFUNDED = 3,
}
