import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseUnits } from 'viem';
import { getPayFlowEscrowConfig } from '../lib/contracts';

/**
 * Custom hook for interacting with PayFlow Escrow contract
 */
export function usePayFlowEscrow() {
  const { address: userAddress, chainId } = useAccount();
  const { writeContractAsync, data: hash, isPending, error } = useWriteContract();

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  /**
   * Create an invoice on the smart contract
   */
  const createInvoice = async (
    invoiceId: string,
    freelancerAddress: string,
    milestoneAmounts: string[] // amounts as strings (e.g., "100.50")
  ) => {
    if (!chainId) throw new Error('No chain connected');

    const config = getPayFlowEscrowConfig(chainId);

    // Convert amounts to BigInt (wei)
    const amounts = milestoneAmounts.map(amount => parseUnits(amount, 18));

    const hash = await writeContractAsync({
      ...config,
      functionName: 'createInvoice',
      args: [invoiceId, freelancerAddress as `0x${string}`, amounts],
    });

    return hash;
  };

  /**
   * Deposit MNEE into a milestone (escrow)
   * Note: Amount is read from the milestone data stored in the contract
   */
  const depositMilestone = async (
    invoiceId: string,
    milestoneIndex: number
  ) => {
    if (!chainId) throw new Error('No chain connected');

    const config = getPayFlowEscrowConfig(chainId);

    const hash = await writeContractAsync({
      ...config,
      functionName: 'depositMilestone',
      args: [invoiceId, BigInt(milestoneIndex)],
    });

    return hash;
  };

  /**
   * Release a milestone to the freelancer
   */
  const releaseMilestone = async (
    invoiceId: string,
    milestoneIndex: number
  ) => {
    if (!chainId) throw new Error('No chain connected');

    const config = getPayFlowEscrowConfig(chainId);

    const hash = await writeContractAsync({
      ...config,
      functionName: 'releaseMilestone',
      args: [invoiceId, BigInt(milestoneIndex)],
    });

    return hash;
  };

  /**
   * Refund a milestone to the client (admin only)
   */
  const refundMilestone = async (
    invoiceId: string,
    milestoneIndex: number
  ) => {
    if (!chainId) throw new Error('No chain connected');

    const config = getPayFlowEscrowConfig(chainId);

    const hash = await writeContractAsync({
      ...config,
      functionName: 'refundMilestone',
      args: [invoiceId, BigInt(milestoneIndex)],
    });

    return hash;
  };

  /**
   * Read contract - Get invoice details
   */
  const getInvoice = (invoiceId: string) => {
    return useReadContract({
      ...getPayFlowEscrowConfig(chainId || 1),
      functionName: 'invoices',
      args: [invoiceId],
    });
  };

  return {
    // Write functions
    createInvoice,
    depositMilestone,
    releaseMilestone,
    refundMilestone,

    // Transaction state
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,

    // Read functions
    getInvoice,

    // User info
    userAddress,
    chainId,
  };
}
