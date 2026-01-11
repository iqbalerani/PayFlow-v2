import { createPublicClient, http, decodeFunctionData } from 'viem';
import { sepolia } from 'viem/chains';
import PayFlowEscrowABI from '../../../src/lib/PayFlowEscrow.json';

async function examineSuccessfulTransaction() {
  const client = createPublicClient({
    chain: sepolia,
    transport: http('https://eth-sepolia.g.alchemy.com/v2/5Kzx0lH42Hb_iJhYlgpfL'),
  });

  console.log('====================================');
  console.log('Examining Successful Invoice Creation');
  console.log('====================================\n');

  const txHash = '0xb1fdebd881f77e33d9ff974be412d328d96d888aefad1b7526f199f2240ff017';

  const tx = await client.getTransaction({ hash: txHash as `0x${string}` });
  const receipt = await client.getTransactionReceipt({ hash: txHash as `0x${string}` });

  console.log('Transaction Details:');
  console.log(`  Hash: ${txHash}`);
  console.log(`  From: ${tx.from}`);
  console.log(`  To: ${tx.to}`);
  console.log(`  Value: ${tx.value.toString()} ETH`);
  console.log(`  Gas Limit: ${tx.gas.toString()}`);
  console.log(`  Status: ${receipt.status}\n`);

  // Decode the function call
  try {
    const decoded = decodeFunctionData({
      abi: PayFlowEscrowABI.abi,
      data: tx.input,
    });

    console.log('Function Call:');
    console.log(`  Function: ${decoded.functionName}`);
    console.log(`  Arguments:`);

    if (decoded.functionName === 'createInvoice') {
      const [invoiceId, freelancer, milestoneAmounts] = decoded.args as [string, string, bigint[]];
      console.log(`    Invoice ID: ${invoiceId}`);
      console.log(`    Freelancer: ${freelancer}`);
      console.log(`    Milestone Amounts:`);
      milestoneAmounts.forEach((amount: bigint, i: number) => {
        console.log(`      [${i}]: ${amount.toString()} wei (${Number(amount) / 1e18} MNEE)`);
      });
    }
  } catch (error: any) {
    console.error('Error decoding function data:', error.message);
  }

  console.log('\n====================================\n');
}

examineSuccessfulTransaction()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
