import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { getMNEETokenConfig, getPayFlowEscrowConfig } from '../lib/contracts';

/**
 * Custom hook for interacting with MNEE ERC20 token
 */
export function useMNEEToken() {
  const { address: userAddress, chainId } = useAccount();
  const { writeContractAsync, data: hash, isPending } = useWriteContract();

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  /**
   * Get MNEE balance for connected wallet
   */
  const { data: balance, refetch: refetchBalance } = useReadContract({
    ...getMNEETokenConfig(chainId || 1),
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    },
  });

  /**
   * Get allowance for PayFlow Escrow contract
   */
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    ...getMNEETokenConfig(chainId || 1),
    functionName: 'allowance',
    args: userAddress && chainId ? [userAddress, getPayFlowEscrowConfig(chainId).address] : undefined,
    query: {
      enabled: !!userAddress && !!chainId,
    },
  });

  /**
   * Approve MNEE tokens for PayFlow Escrow contract
   */
  const approveMNEE = async (amount: string) => {
    if (!chainId) throw new Error('No chain connected');

    const config = getMNEETokenConfig(chainId);
    const escrowConfig = getPayFlowEscrowConfig(chainId);

    // Convert amount to BigInt (wei)
    const amountWei = parseUnits(amount, 18);

    const hash = await writeContractAsync({
      ...config,
      functionName: 'approve',
      args: [escrowConfig.address, amountWei],
    });

    return hash;
  };

  /**
   * Check if user has sufficient balance
   */
  const hasSufficientBalance = (requiredAmount: string): boolean => {
    if (!balance) return false;
    const required = parseUnits(requiredAmount, 18);
    return balance >= required;
  };

  /**
   * Check if user has sufficient allowance
   */
  const hasSufficientAllowance = (requiredAmount: string): boolean => {
    if (!allowance) return false;
    const required = parseUnits(requiredAmount, 18);
    return allowance >= required;
  };

  /**
   * Get formatted balance (human-readable)
   */
  const formattedBalance = balance ? formatUnits(balance, 18) : '0';

  /**
   * Get formatted allowance (human-readable)
   */
  const formattedAllowance = allowance ? formatUnits(allowance, 18) : '0';

  return {
    // Read functions
    balance,
    allowance,
    formattedBalance,
    formattedAllowance,

    // Write functions
    approveMNEE,

    // Helper functions
    hasSufficientBalance,
    hasSufficientAllowance,
    refetchBalance,
    refetchAllowance,

    // Transaction state
    hash,
    isPending,
    isConfirming,
    isSuccess,

    // User info
    userAddress,
    chainId,
  };
}
