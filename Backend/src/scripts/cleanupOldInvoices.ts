import { prisma } from '../lib/prisma';

async function main() {
  console.log('====================================');
  console.log('🗑️  Cleaning Up Old Invoices');
  console.log('====================================\n');

  console.log('These invoices were created on the old contract and need to be deleted:\n');

  // Get all invoices
  const invoices = await prisma.invoice.findMany({
    include: { milestones: true }
  });

  console.log(`Found ${invoices.length} invoices:\n`);

  for (const invoice of invoices) {
    console.log(`  📄 ${invoice.id} - ${invoice.title}`);
    console.log(`     Status: ${invoice.status}`);
    console.log(`     Milestones: ${invoice.milestones.length}`);
    console.log(`     Created: ${invoice.createdAt.toLocaleString()}\n`);
  }

  console.log('Deleting all invoices...\n');

  // Delete all invoices (cascades to milestones and transactions)
  const result = await prisma.invoice.deleteMany({});

  console.log(`✅ Deleted ${result.count} invoices successfully!\n`);

  console.log('====================================');
  console.log('✅ Cleanup Complete!');
  console.log('====================================\n');
  console.log('You can now create new invoices that will be');
  console.log('automatically registered on the NEW blockchain contract:');
  console.log('📍 0xAB5F75c828F474492A48fEEd4836999D7dF7b4dE\n');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error('\n❌ Cleanup failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
