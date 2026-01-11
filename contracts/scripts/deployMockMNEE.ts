import { ethers } from "hardhat";

async function main() {
  console.log("====================================");
  console.log("Mock MNEE Token Deployment");
  console.log("====================================\n");

  const [deployer] = await ethers.getSigners();
  console.log(`Deploying from: ${deployer.address}\n`);

  // Deploy Mock MNEE token
  console.log("Deploying Mock MNEE token...");
  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const mockMNEE = await MockERC20.deploy("Mock MNEE", "MNEE");

  await mockMNEE.waitForDeployment();

  const mockMNEEAddress = await mockMNEE.getAddress();
  console.log(`✅ Mock MNEE deployed to: ${mockMNEEAddress}\n`);

  // Get initial balance
  const balance = await mockMNEE.balanceOf(deployer.address);
  const formattedBalance = ethers.formatEther(balance);

  console.log("====================================");
  console.log("Token Information:");
  console.log("====================================");
  console.log(`Contract Address: ${mockMNEEAddress}`);
  console.log(`Token Name: Mock MNEE`);
  console.log(`Token Symbol: MNEE`);
  console.log(`Decimals: 18`);
  console.log(`Your Balance: ${formattedBalance} MNEE`);
  console.log("\n");

  console.log("====================================");
  console.log("Next Steps:");
  console.log("====================================");
  console.log("1. Update your environment files with:");
  console.log(`   VITE_MNEE_TOKEN_ADDRESS=${mockMNEEAddress}`);
  console.log(`   MNEE_TOKEN_ADDRESS=${mockMNEEAddress}`);
  console.log("\n2. Verify contract on Etherscan:");
  console.log(`   npx hardhat verify --network sepolia ${mockMNEEAddress} "Mock MNEE" "MNEE"`);
  console.log("\n3. You can mint more tokens anytime by calling:");
  console.log(`   mockMNEE.mint(address, amount)`);
  console.log("====================================\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
