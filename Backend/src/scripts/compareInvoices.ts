import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import PayFlowEscrowABI from '../../../src/lib/PayFlowEscrow.json';

async function compareInvoices() {
  const client = createPublicClient({
    chain: sepolia,
    transport: http('https://eth-sepolia.g.alchemy.com/v2/5Kzx0lH42Hb_iJhYlgpfL'),
  });

  const contractAddress = '0xAB5F75c828F474492A48fEEd4836999D7dF7b4dE' as `0x${string}`;

  console.log('====================================');
  console.log('Comparing Invoices on Blockchain');
  console.log('====================================\n');

  const invoices = [
    'INV-2026-245', // Should exist (found in events)
    'INV-2026-517', // User created - should NOT exist
    'INV-2026-578', // User created - should NOT exist
    'INV-2026-860', // User created - should NOT exist
  ];

  for (const id of invoices) {
    try {
      const result = await client.readContract({
        address: contractAddress,
        abi: PayFlowEscrowABI.abi,
        functionName: 'getInvoice',
        args: [id],
      }) as [string, string, bigint, boolean];

      const [freelancer, clientAddr, milestoneCount, exists] = result;

      console.log(`${id}:`);
      console.log(`  Status: ${exists ? '✅ EXISTS' : '❌ NOT FOUND'}`);
      if (exists) {
        console.log(`  Freelancer: ${freelancer}`);
        console.log(`  Client: ${clientAddr || 'None'}`);
        console.log(`  Milestones: ${milestoneCount.toString()}`);
      }
      console.log('');
    } catch (error: any) {
      console.log(`${id}: ❌ ERROR - ${error.message}\n`);
    }
  }

  console.log('====================================\n');
}

compareInvoices()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
