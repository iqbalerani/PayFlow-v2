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
    console.log('🔧 [createInvoice] Called with:');
    console.log('  Invoice ID:', invoiceId);
    console.log('  Freelancer:', freelancerAddress);
    console.log('  Milestones:', milestoneAmounts);
    console.log('  ChainId:', chainId);

    if (!chainId) {
      console.error('  ❌ No chain connected!');
      throw new Error('No chain connected');
    }

    if (!freelancerAddress || freelancerAddress === '0x' || freelancerAddress.length !== 42) {
      console.error('  ❌ Invalid freelancer address!');
      throw new Error(`Invalid freelancer address: ${freelancerAddress}`);
    }

    if (!milestoneAmounts || milestoneAmounts.length === 0) {
      console.error('  ❌ No milestones provided!');
      throw new Error('At least one milestone is required');
    }

    const config = getPayFlowEscrowConfig(chainId);
    console.log('  Contract address:', config.address);

    // Convert amounts to BigInt (wei)
    const amounts = milestoneAmounts.map(amount => parseUnits(amount, 18));
    console.log('  Converted amounts (wei):', amounts.map(a => a.toString()));

    console.log('  Calling writeContractAsync...');
    const hash = await writeContractAsync({
      ...config,
      functionName: 'createInvoice',
      args: [invoiceId, freelancerAddress as `0x${string}`, amounts],
    });

    console.log('  ✅ Transaction hash:', hash);
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

  /**
   * Check if invoice exists on blockchain
   */
  const checkInvoiceExists = async (invoiceId: string): Promise<boolean> => {
    console.log('🔍 [checkInvoiceExists] Called for:', invoiceId);
    console.log('  ChainId:', chainId);

    if (!chainId) {
      console.log('  ❌ No chainId, returning false');
      return false;
    }

    try {
      const config = getPayFlowEscrowConfig(chainId);
      console.log('  Contract address:', config.address);

      const { readContract } = await import('viem/actions');
      const { createPublicClient, http } = await import('viem');
      const { sepolia, mainnet } = await import('viem/chains');

      // Get Alchemy RPC URL (same as CreateInvoice.tsx)
      const alchemyKey = import.meta.env.VITE_ALCHEMY_API_KEY;
      console.log('  Alchemy key exists:', !!alchemyKey);

      const rpcUrl = chainId === 11155111
        ? `https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`
        : `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`;

      console.log('  RPC URL:', rpcUrl.substring(0, 50) + '...');

      const client = createPublicClient({
        chain: chainId === 11155111 ? sepolia : mainnet,
        transport: http(rpcUrl),
      });

      console.log('  Calling getInvoice...');
      const result = await client.readContract({
        address: config.address,
        abi: config.abi,
        functionName: 'getInvoice',
        args: [invoiceId],
      });

      console.log('  Contract response:', result);
      console.log('  Exists field (result[3]):', result[3]);

      // getInvoice returns (address freelancer, address client, uint256 milestoneCount, bool exists)
      // If exists is true, invoice is registered on blockchain
      const exists = result[3] as boolean;
      console.log('  Final result:', exists ? '✅ EXISTS' : '❌ NOT FOUND');

      return exists;
    } catch (error) {
      console.error('  ❌ Error checking invoice existence:', error);
      return false;
    }
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
    checkInvoiceExists,

    // User info
    userAddress,
    chainId,
  };
}
