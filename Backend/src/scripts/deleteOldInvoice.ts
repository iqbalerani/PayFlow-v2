import { prisma } from '../lib/prisma';

async function main() {
  console.log('====================================');
  console.log('🗑️  Deleting Old Invoice');
  console.log('====================================\n');

  const invoiceId = 'INV-2026-182';

  console.log(`Looking for invoice ${invoiceId}...`);

  // Check if invoice exists
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { milestones: true }
  });

  if (!invoice) {
    console.log('❌ Invoice not found in database.\n');
    return;
  }

  console.log(`✅ Found invoice: ${invoice.title}`);
  console.log(`   Milestones: ${invoice.milestones.length}`);
  console.log(`   Status: ${invoice.status}\n`);

  // Delete invoice (cascades to milestones)
  console.log('Deleting invoice from database...');
  await prisma.invoice.delete({
    where: { id: invoiceId }
  });

  console.log('✅ Invoice deleted successfully!\n');

  console.log('====================================');
  console.log('✅ Cleanup Complete!');
  console.log('====================================\n');
  console.log('You can now create a new invoice that will be');
  console.log('automatically registered on the blockchain.\n');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error('\n❌ Delete failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
