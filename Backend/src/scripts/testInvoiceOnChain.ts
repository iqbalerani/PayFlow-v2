import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import dotenv from 'dotenv';
import PayFlowEscrowABI from '../../../src/lib/PayFlowEscrow.json';

dotenv.config();

async function testInvoiceOnBlockchain() {
  console.log('====================================');
  console.log('🔍 Testing Invoice on Blockchain');
  console.log('====================================\n');

  // Configuration
  const contractAddress = process.env.PAYFLOW_ESCROW_ADDRESS as `0x${string}`;
  const alchemyKey = process.env.VITE_ALCHEMY_API_KEY || process.env.API_KEY_Alchemy;
  const rpcUrl = `https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`;

  console.log('Configuration:');
  console.log(`  Contract: ${contractAddress}`);
  console.log(`  RPC: ${rpcUrl.substring(0, 50)}...`);
  console.log(`  Network: Sepolia\n`);

  if (!contractAddress) {
    console.error('❌ PAYFLOW_ESCROW_ADDRESS not found in environment');
    process.exit(1);
  }

  // Create client
  const client = createPublicClient({
    chain: sepolia,
    transport: http(rpcUrl),
  });

  // Test invoices
  const testInvoices = [
    'INV-2026-720',  // NEWEST - created after fix (should exist!)
    'INV-2026-489',  // Created before fix (orphaned)
    'INV-2026-298',  // Created before fix (orphaned)
    'INV-2026-245',  // Known good invoice (should exist)
  ];

  for (const invoiceId of testInvoices) {
    console.log(`\n🔍 Checking invoice: ${invoiceId}`);
    console.log('─'.repeat(50));

    try {
      const result = await client.readContract({
        address: contractAddress,
        abi: PayFlowEscrowABI.abi,
        functionName: 'getInvoice',
        args: [invoiceId],
      }) as [string, string, bigint, boolean];

      const [freelancer, clientAddress, milestoneCount, exists] = result;

      console.log(`  Freelancer: ${freelancer}`);
      console.log(`  Client: ${clientAddress}`);
      console.log(`  Milestone Count: ${milestoneCount.toString()}`);
      console.log(`  Exists: ${exists ? '✅ YES' : '❌ NO'}\n`);

      if (exists) {
        console.log(`✅ Invoice ${invoiceId} IS registered on blockchain!`);

        // Get milestone details
        console.log(`\n  📊 Milestone Details:`);
        for (let i = 0; i < Number(milestoneCount); i++) {
          try {
            const milestone = await client.readContract({
              address: contractAddress,
              abi: PayFlowEscrowABI.abi,
              functionName: 'getMilestone',
              args: [invoiceId, BigInt(i)],
            }) as [bigint, number, bigint, bigint];

            const [amount, status, depositedAt, releasedAt] = milestone;
            const statusNames = ['EMPTY', 'DEPOSITED', 'RELEASED', 'REFUNDED'];

            console.log(`    Milestone ${i}: ${Number(amount) / 1e18} MNEE - Status: ${statusNames[status]}`);
          } catch (err) {
            console.error(`    Error reading milestone ${i}:`, err);
          }
        }
      } else {
        console.log(`❌ Invoice ${invoiceId} is NOT registered on blockchain`);
      }
    } catch (error: any) {
      console.error(`  ❌ Error reading invoice: ${error.message}`);
      console.error(`  Details:`, error);
    }
  }

  console.log('\n====================================');
  console.log('✅ Test Complete');
  console.log('====================================\n');
}

testInvoiceOnBlockchain()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
