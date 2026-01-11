import { createWalletClient, createPublicClient, http, parseUnits } from 'viem';
import { sepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import dotenv from 'dotenv';
import PayFlowEscrowABI from '../../../src/lib/PayFlowEscrow.json';

dotenv.config();

async function createTestInvoice() {
  console.log('====================================');
  console.log('🧪 Creating Test Invoice on Blockchain');
  console.log('====================================\n');

  // Configuration
  const contractAddress = process.env.PAYFLOW_ESCROW_ADDRESS as `0x${string}`;
  const privateKey = process.env.PRIVATE_KEY as `0x${string}`;
  const alchemyKey = process.env.VITE_ALCHEMY_API_KEY || process.env.API_KEY_Alchemy;
  const rpcUrl = `https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`;

  if (!contractAddress || !privateKey || !alchemyKey) {
    console.error('❌ Missing environment variables');
    console.error('Need: PAYFLOW_ESCROW_ADDRESS, PRIVATE_KEY, VITE_ALCHEMY_API_KEY');
    process.exit(1);
  }

  console.log('Configuration:');
  console.log(`  Contract: ${contractAddress}`);
  console.log(`  RPC: ${rpcUrl.substring(0, 50)}...`);
  console.log(`  Network: Sepolia\n`);

  // Create account from private key
  const account = privateKeyToAccount(privateKey);
  console.log(`  Deployer Address: ${account.address}\n`);

  // Create clients
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(rpcUrl),
  });

  const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(rpcUrl),
  });

  // Test invoice data
  const testInvoiceId = `TEST-${Date.now()}`;
  const freelancerAddress = account.address; // Use deployer as freelancer for testing
  const milestoneAmounts = [
    parseUnits('10', 18), // 10 MNEE
    parseUnits('20', 18), // 20 MNEE
    parseUnits('30', 18), // 30 MNEE
  ];

  console.log(`📝 Creating invoice: ${testInvoiceId}`);
  console.log(`  Freelancer: ${freelancerAddress}`);
  console.log(`  Milestones: ${milestoneAmounts.length}`);
  console.log(`  Total: ${(Number(milestoneAmounts.reduce((a, b) => a + b, 0n)) / 1e18)} MNEE\n`);

  try {
    console.log('⏳ Submitting transaction...');

    const hash = await walletClient.writeContract({
      address: contractAddress,
      abi: PayFlowEscrowABI.abi,
      functionName: 'createInvoice',
      args: [testInvoiceId, freelancerAddress, milestoneAmounts],
    });

    console.log(`✅ Transaction submitted: ${hash}`);
    console.log(`  Etherscan: https://sepolia.etherscan.io/tx/${hash}\n`);

    console.log('⏳ Waiting for confirmation...');
    const receipt = await publicClient.waitForTransactionReceipt({
      hash,
      confirmations: 1,
    });

    console.log(`✅ Transaction confirmed!`);
    console.log(`  Status: ${receipt.status}`);
    console.log(`  Block: ${receipt.blockNumber}`);
    console.log(`  Gas Used: ${receipt.gasUsed.toString()}\n`);

    // Check if invoice was created
    console.log('🔍 Verifying invoice on blockchain...');
    const result = await publicClient.readContract({
      address: contractAddress,
      abi: PayFlowEscrowABI.abi,
      functionName: 'getInvoice',
      args: [testInvoiceId],
    }) as [string, string, bigint, boolean];

    const [freelancer, client, milestoneCount, exists] = result;

    console.log(`  Freelancer: ${freelancer}`);
    console.log(`  Client: ${client}`);
    console.log(`  Milestone Count: ${milestoneCount.toString()}`);
    console.log(`  Exists: ${exists ? '✅ YES' : '❌ NO'}\n`);

    if (exists) {
      console.log('🎉 SUCCESS! Invoice was created on blockchain!');
    } else {
      console.log('❌ FAILURE! Invoice was NOT created despite successful transaction!');
      console.log('This indicates the transaction reverted or failed.');
    }

  } catch (error: any) {
    console.error('\n❌ Error creating invoice:', error.message);
    if (error.message.includes('revert')) {
      console.error('\n📝 Transaction reverted. Possible reasons:');
      console.error('  - Invoice ID already exists');
      console.error('  - Invalid freelancer address');
      console.error('  - Invalid milestone amounts');
      console.error('  - Contract execution failed');
    }
    throw error;
  }

  console.log('\n====================================');
  console.log('✅ Test Complete');
  console.log('====================================\n');
}

createTestInvoice()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
