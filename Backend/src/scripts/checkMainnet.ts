import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

async function checkMainnet() {
  const client = createPublicClient({
    chain: mainnet,
    transport: http('https://eth-mainnet.g.alchemy.com/v2/5Kzx0lH42Hb_iJhYlgpfL'),
  });

  const contractAddress = '0xAB5F75c828F474492A48fEEd4836999D7dF7b4dE' as `0x${string}`;

  console.log('====================================');
  console.log('Checking Contract on MAINNET');
  console.log('====================================\n');

  console.log(`Address: ${contractAddress}\n`);

  // Check if there's code at this address on mainnet
  const code = await client.getBytecode({ address: contractAddress });

  if (code && code !== '0x') {
    console.log('⚠️  WARNING: There IS code at this address on mainnet!');
    console.log(`   Bytecode length: ${code.length} characters\n`);
  } else {
    console.log('❌ NO CODE at this address on mainnet!');
    console.log('   This is an empty address on mainnet.\n');
    console.log('💡 If user is connected to MAINNET instead of SEPOLIA,');
    console.log('   transactions would succeed (sending to empty address)');
    console.log('   but no contract code would execute!\n');
  }

  console.log('====================================\n');
}

checkMainnet()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
