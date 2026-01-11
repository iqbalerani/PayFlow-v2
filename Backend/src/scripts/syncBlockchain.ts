import { BlockchainListener } from '../services/blockchainListener';

async function main() {
  console.log('====================================');
  console.log('🔄 Blockchain Sync Script');
  console.log('====================================\n');
  console.log('This script will catch up on past blockchain events');
  console.log('and sync them to the database.\n');

  const listener = new BlockchainListener();

  console.log('Starting sync process...\n');

  // Catch up last 1000 blocks (covers last ~3 hours on Sepolia)
  // Note: Alchemy free tier limits eth_getLogs to 10 block range
  // The listener will chunk requests automatically
  await listener.catchUpEvents(-1000);

  console.log('\n====================================');
  console.log('✅ Sync Complete!');
  console.log('====================================\n');
  console.log('Database is now in sync with blockchain.');
  console.log('Restart your frontend to see updated statuses.\n');

  // Clean up
  await listener.stop();
  process.exit(0);
}

main().catch((error) => {
  console.error('\n❌ Sync failed:', error);
  process.exit(1);
});
