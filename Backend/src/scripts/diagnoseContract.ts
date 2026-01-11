import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import dotenv from 'dotenv';
import PayFlowEscrowABI from '../../../src/lib/PayFlowEscrow.json';

dotenv.config();

async function diagnoseContract() {
  console.log('====================================');
  console.log('🔍 Contract Diagnostic');
  console.log('====================================\n');

  // Configuration
  const contractAddress = process.env.VITE_PAYFLOW_ESCROW_ADDRESS || process.env.PAYFLOW_ESCROW_ADDRESS as `0x${string}`;
  const alchemyKey = process.env.VITE_ALCHEMY_API_KEY || process.env.API_KEY_Alchemy;
  const rpcUrl = `https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`;

  console.log('Configuration:');
  console.log(`  Contract: ${contractAddress}`);
  console.log(`  RPC: ${rpcUrl.substring(0, 50)}...`);
  console.log(`  Network: Sepolia\n`);

  if (!contractAddress) {
    console.error('❌ No contract address found in environment');
    process.exit(1);
  }

  // Create client
  const client = createPublicClient({
    chain: sepolia,
    transport: http(rpcUrl),
  });

  // 1. Check if contract has code
  console.log('1️⃣ Checking if contract is deployed...');
  try {
    const code = await client.getBytecode({ address: contractAddress });
    if (code && code !== '0x') {
      console.log('✅ Contract has code deployed');
      console.log(`   Bytecode length: ${code.length} characters\n`);
    } else {
      console.log('❌ No code at this address! Contract not deployed!\n');
      process.exit(1);
    }
  } catch (error: any) {
    console.error('❌ Error checking bytecode:', error.message);
    process.exit(1);
  }

  // 2. Check contract owner
  console.log('2️⃣ Checking contract owner...');
  try {
    const owner = await client.readContract({
      address: contractAddress,
      abi: PayFlowEscrowABI.abi,
      functionName: 'owner',
    });
    console.log(`✅ Contract owner: ${owner}\n`);
  } catch (error: any) {
    console.error('❌ Error reading owner:', error.message, '\n');
  }

  // 3. Check MNEE token address
  console.log('3️⃣ Checking MNEE token address...');
  try {
    const mneeToken = await client.readContract({
      address: contractAddress,
      abi: PayFlowEscrowABI.abi,
      functionName: 'mneeToken',
    });
    console.log(`✅ MNEE Token: ${mneeToken}`);

    const expectedMnee = process.env.VITE_MNEE_TOKEN_ADDRESS || process.env.MNEE_TOKEN_ADDRESS;
    if (mneeToken === expectedMnee) {
      console.log('✅ Matches expected MNEE token address\n');
    } else {
      console.log(`⚠️  Expected: ${expectedMnee}`);
      console.log('⚠️  Token address mismatch!\n');
    }
  } catch (error: any) {
    console.error('❌ Error reading MNEE token:', error.message, '\n');
  }

  // 4. Check for InvoiceCreated events
  console.log('4️⃣ Checking for InvoiceCreated events (last 1000 blocks)...');
  try {
    const currentBlock = await client.getBlockNumber();
    const fromBlock = currentBlock - 1000n;

    console.log(`   Scanning from block ${fromBlock} to ${currentBlock}...\n`);

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
      fromBlock,
      toBlock: currentBlock,
    });

    if (logs.length === 0) {
      console.log('⚠️  No InvoiceCreated events found in last 1000 blocks');
      console.log('   This means NO invoices have been created on this contract!\n');
    } else {
      console.log(`✅ Found ${logs.length} InvoiceCreated events:\n`);
      for (const log of logs) {
        console.log(`   Block ${log.blockNumber}:`);
        console.log(`     Invoice: ${log.args.invoiceId}`);
        console.log(`     Freelancer: ${log.args.freelancer}`);
        console.log(`     Amount: ${Number(log.args.totalAmount) / 1e18} MNEE`);
        console.log(`     Milestones: ${log.args.milestoneCount}\n`);
      }
    }
  } catch (error: any) {
    console.error('❌ Error reading events:', error.message, '\n');
  }

  // 5. Try to read a specific invoice
  console.log('5️⃣ Testing invoice read for INV-2026-578...');
  try {
    const result = await client.readContract({
      address: contractAddress,
      abi: PayFlowEscrowABI.abi,
      functionName: 'getInvoice',
      args: ['INV-2026-578'],
    }) as [string, string, bigint, boolean];

    const [freelancer, clientAddress, milestoneCount, exists] = result;
    console.log(`   Freelancer: ${freelancer}`);
    console.log(`   Client: ${clientAddress}`);
    console.log(`   Milestone Count: ${milestoneCount.toString()}`);
    console.log(`   Exists: ${exists ? '✅ YES' : '❌ NO'}\n`);
  } catch (error: any) {
    console.error('❌ Error reading invoice:', error.message, '\n');
  }

  console.log('====================================');
  console.log('✅ Diagnostic Complete');
  console.log('====================================\n');
}

diagnoseContract()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
