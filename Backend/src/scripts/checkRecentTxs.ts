import { createPublicClient, http, decodeEventLog } from 'viem';
import { sepolia } from 'viem/chains';
import dotenv from 'dotenv';
import PayFlowEscrowABI from '../../../src/lib/PayFlowEscrow.json';

dotenv.config();

async function checkRecentTransactions() {
  console.log('====================================');
  console.log('🔍 Checking Recent Transactions');
  console.log('====================================\n');

  const contractAddress = process.env.VITE_PAYFLOW_ESCROW_ADDRESS || process.env.PAYFLOW_ESCROW_ADDRESS as `0x${string}`;
  const alchemyKey = process.env.VITE_ALCHEMY_API_KEY || process.env.API_KEY_Alchemy;
  const rpcUrl = `https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`;

  console.log(`Contract: ${contractAddress}\n`);

  const client = createPublicClient({
    chain: sepolia,
    transport: http(rpcUrl),
  });

  // Get current block
  const currentBlock = await client.getBlockNumber();
  console.log(`Current block: ${currentBlock}\n`);

  // Check last 100 blocks for any events
  const fromBlock = currentBlock - 100n;

  console.log(`Scanning blocks ${fromBlock} to ${currentBlock} for events...\n`);

  try {
    // Try to get all logs from the contract (any event)
    const allLogs = await client.getLogs({
      address: contractAddress,
      fromBlock,
      toBlock: currentBlock,
    });

    console.log(`Found ${allLogs.length} total events in last 100 blocks\n`);

    if (allLogs.length > 0) {
      for (const log of allLogs) {
        console.log(`📝 Event at block ${log.blockNumber}:`);
        console.log(`   Transaction: ${log.transactionHash}`);
        console.log(`   Topics: ${log.topics.slice(0, 2).join(', ')}...\n`);
      }
    }
  } catch (error: any) {
    console.error('Error fetching logs:', error.message, '\n');
  }

  // Try to get InvoiceCreated events with smaller range (10 blocks at a time)
  console.log('Checking for InvoiceCreated events (last 100 blocks in batches)...\n');

  let totalInvoiceEvents = 0;
  for (let i = 0n; i < 100n; i += 10n) {
    const batchFrom = currentBlock - 100n + i;
    const batchTo = batchFrom + 9n;

    try {
      const logs = await client.getLogs({
        address: contractAddress,
        event: {
          type: 'event',
          name: 'InvoiceCreated',
          inputs: [
            { type: 'string', name: 'invoiceId', indexed: false },
            { type: 'address', name: 'freelancer', indexed: true },
            { type: 'uint256', name: 'totalAmount', indexed: false },
            { type: 'uint256', name: 'milestoneCount', indexed: false },
          ],
        },
        fromBlock: batchFrom,
        toBlock: batchTo,
      });

      if (logs.length > 0) {
        totalInvoiceEvents += logs.length;
        console.log(`✅ Found ${logs.length} InvoiceCreated events in blocks ${batchFrom}-${batchTo}:`);
        for (const log of logs) {
          console.log(`   Block ${log.blockNumber}, Tx: ${log.transactionHash}`);
          console.log(`     Invoice ID: ${log.args.invoiceId}`);
          console.log(`     Freelancer: ${log.args.freelancer}`);
          console.log(`     Amount: ${Number(log.args.totalAmount) / 1e18} MNEE\n`);
        }
      }
    } catch (error: any) {
      // Silently continue if batch fails
    }
  }

  if (totalInvoiceEvents === 0) {
    console.log('❌ NO InvoiceCreated events found in last 100 blocks!');
    console.log('   This means no invoices have been successfully created recently.\n');
  }

  // Now let's check a specific transaction if we can find it
  console.log('Looking for test invoice creation transactions...\n');

  // Check for transactions TO this contract
  console.log('Checking recent blocks for contract calls...');
  for (let i = 0; i < 5; i++) {
    const blockNum = currentBlock - BigInt(i);
    const block = await client.getBlock({ blockNumber: blockNum, includeTransactions: true });

    const contractTxs = block.transactions.filter((tx: any) =>
      tx.to?.toLowerCase() === contractAddress.toLowerCase()
    );

    if (contractTxs.length > 0) {
      console.log(`\n📦 Block ${blockNum} has ${contractTxs.length} transaction(s) to contract:`);
      for (const tx of contractTxs) {
        console.log(`   Tx: ${tx.hash}`);
        console.log(`   From: ${tx.from}`);

        // Get receipt to check if it succeeded
        const receipt = await client.getTransactionReceipt({ hash: tx.hash });
        console.log(`   Status: ${receipt.status === 'success' ? '✅ SUCCESS' : '❌ REVERTED'}`);
        console.log(`   Gas used: ${receipt.gasUsed.toString()}`);
      }
    }
  }

  console.log('\n====================================');
  console.log('✅ Check Complete');
  console.log('====================================\n');
}

checkRecentTransactions()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
