import { ethers } from "hardhat";

async function main() {
  console.log("====================================");
  console.log("PayFlow Escrow Contract Deployment");
  console.log("====================================\n");

  // MNEE Token address (mainnet)
  const MNEE_TOKEN_ADDRESS = process.env.MNEE_TOKEN_ADDRESS || "0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF";

  // Platform wallet (should be a multi-sig in production)
  const PLATFORM_WALLET = process.env.PLATFORM_WALLET || (await ethers.getSigners())[0].address;

  console.log(`MNEE Token Address: ${MNEE_TOKEN_ADDRESS}`);
  console.log(`Platform Wallet: ${PLATFORM_WALLET}\n`);

  // Deploy PayFlowEscrow
  console.log("Deploying PayFlowEscrow contract...");
  const PayFlowEscrow = await ethers.getContractFactory("PayFlowEscrow");
  const escrow = await PayFlowEscrow.deploy(MNEE_TOKEN_ADDRESS, PLATFORM_WALLET);

  await escrow.waitForDeployment();

  const escrowAddress = await escrow.getAddress();
  console.log(`✅ PayFlowEscrow deployed to: ${escrowAddress}\n`);

  // Display contract info
  const platformFee = await escrow.platformFeePercent();
  const mneeToken = await escrow.mneeToken();

  console.log("====================================");
  console.log("Contract Information:");
  console.log("====================================");
  console.log(`Contract Address: ${escrowAddress}`);
  console.log(`MNEE Token: ${mneeToken}`);
  console.log(`Platform Wallet: ${PLATFORM_WALLET}`);
  console.log(`Platform Fee: ${Number(platformFee) / 100}%`);
  console.log("\n");

  console.log("====================================");
  console.log("Next Steps:");
  console.log("====================================");
  console.log("1. Update your .env file with:");
  console.log(`   PAYFLOW_ESCROW_ADDRESS=${escrowAddress}`);
  console.log("\n2. Verify contract on Etherscan:");
  console.log(`   npx hardhat verify --network <network> ${escrowAddress} "${MNEE_TOKEN_ADDRESS}" "${PLATFORM_WALLET}"`);
  console.log("\n3. Start the blockchain listener service");
  console.log("====================================\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
