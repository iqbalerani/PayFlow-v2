import { prisma } from '../lib/prisma';

async function main() {
  console.log('====================================');
  console.log('🔧 Fixing Invoice INV-2026-596');
  console.log('====================================\n');

  const invoiceId = 'INV-2026-596';

  // Update milestone 0 to PAID
  console.log('Updating milestone 0...');
  await prisma.milestone.update({
    where: {
      invoiceId_index: {
        invoiceId,
        index: 0
      }
    },
    data: {
      status: 'PAID',
      paidAt: new Date(),
      depositTxHash: '0x...' // Add actual tx hash from MetaMask history
    }
  });
  console.log('✅ Milestone 0 set to PAID\n');

  // Update milestone 1 to PAID
  console.log('Updating milestone 1...');
  await prisma.milestone.update({
    where: {
      invoiceId_index: {
        invoiceId,
        index: 1
      }
    },
    data: {
      status: 'PAID',
      paidAt: new Date(),
      depositTxHash: '0x...' // Add actual tx hash from MetaMask history
    }
  });
  console.log('✅ Milestone 1 set to PAID\n');

  // Update invoice status to ACTIVE
  console.log('Updating invoice status...');
  await prisma.invoice.update({
    where: { id: invoiceId },
    data: { status: 'ACTIVE' }
  });
  console.log('✅ Invoice set to ACTIVE\n');

  console.log('====================================');
  console.log('✅ Fix Complete!');
  console.log('====================================\n');
  console.log('Refresh your frontend to see updated statuses.\n');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error('\n❌ Fix failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
