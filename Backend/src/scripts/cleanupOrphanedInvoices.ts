import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import dotenv from 'dotenv';
import PayFlowEscrowABI from '../../../src/lib/PayFlowEscrow.json';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const prisma = new PrismaClient();

async function cleanupOrphanedInvoices() {
  console.log('====================================');
  console.log('🧹 Cleaning Up Orphaned Invoices');
  console.log('====================================\n');

  // Configuration
  const contractAddress = process.env.VITE_PAYFLOW_ESCROW_ADDRESS || process.env.PAYFLOW_ESCROW_ADDRESS as `0x${string}`;
  const alchemyKey = process.env.VITE_ALCHEMY_API_KEY || process.env.API_KEY_Alchemy;
  const rpcUrl = `https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`;

  console.log('Configuration:');
  console.log(`  Contract: ${contractAddress}`);
  console.log(`  Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`);
  console.log(`  Network: Sepolia\n`);

  // Create blockchain client
  const client = createPublicClient({
    chain: sepolia,
    transport: http(rpcUrl),
  });

  try {
    // Get all invoices from database
    console.log('📊 Fetching all invoices from database...\n');
    const invoices = await prisma.invoice.findMany({
      select: {
        id: true,
        status: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`Found ${invoices.length} invoices in database\n`);

    const orphaned: string[] = [];
    const registered: string[] = [];
    let checked = 0;

    // Check each invoice on blockchain
    for (const invoice of invoices) {
      checked++;
      process.stdout.write(`\rChecking ${checked}/${invoices.length}...`);

      try {
        const blockchainResult = await client.readContract({
          address: contractAddress,
          abi: PayFlowEscrowABI.abi,
          functionName: 'getInvoice',
          args: [invoice.id],
        }) as [string, string, bigint, boolean];

        const exists = blockchainResult[3];

        if (exists) {
          registered.push(invoice.id);
        } else {
          orphaned.push(invoice.id);
        }
      } catch (error: any) {
        console.error(`\n  ⚠️  Error checking ${invoice.id}:`, error.message);
        orphaned.push(invoice.id);
      }
    }

    console.log('\n\n📋 Results:');
    console.log(`  ✅ Registered on blockchain: ${registered.length}`);
    console.log(`  ❌ Orphaned (not on blockchain): ${orphaned.length}\n`);

    if (orphaned.length === 0) {
      console.log('🎉 No orphaned invoices found! All invoices are registered on blockchain.\n');
      return;
    }

    console.log('Orphaned invoices:');
    for (const id of orphaned) {
      const inv = invoices.find(i => i.id === id);
      console.log(`  - ${id} (created: ${inv?.createdAt.toLocaleDateString()})`);
    }

    console.log('\n⚠️  What would you like to do?\n');
    console.log('Options:');
    console.log('  1. Mark as CANCELLED (recommended - keeps records but marks as failed)');
    console.log('  2. Delete from database (permanent removal - use with caution!)');
    console.log('  3. Do nothing (just report)\n');
    console.log('To execute cleanup, uncomment the desired option below:\n');

    // OPTION 1: Mark as CANCELLED (recommended)
    console.log('Marking orphaned invoices as CANCELLED...');
    for (const id of orphaned) {
      await prisma.invoice.update({
        where: { id },
        data: { status: 'CANCELLED' },
      });
    }
    console.log('✅ Orphaned invoices marked as CANCELLED\n');

    // OPTION 2: Delete from database (use with caution!)
    // console.log('Deleting orphaned invoices...');
    // for (const id of orphaned) {
    //   await prisma.invoice.delete({
    //     where: { id },
    //   });
    // }
    // console.log('✅ Orphaned invoices deleted\n');

  } catch (error) {
    console.error('\n❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }

  console.log('====================================');
  console.log('✅ Cleanup Complete');
  console.log('====================================\n');
}

cleanupOrphanedInvoices()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
