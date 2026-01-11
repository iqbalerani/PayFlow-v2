import { ethers } from "hardhat";

async function main() {
  console.log("====================================");
  console.log("Creating Test Invoice On-Chain");
  console.log("====================================\n");

  const escrowAddress = process.env.PAYFLOW_ESCROW_ADDRESS || "0xfA4D3Cf2685f2E9B032e939AFBe7B6cFBb6333fa";
  const [signer] = await ethers.getSigners();

  console.log(`Escrow Contract: ${escrowAddress}`);
  console.log(`Signer: ${signer.address}\n`);

  const PayFlowEscrow = await ethers.getContractAt("PayFlowEscrow", escrowAddress);

  // Invoice details matching the one in the UI
  const invoiceId = "INV-2026-596";
  const freelancer = signer.address; // Use deployer as freelancer
  const milestoneAmounts = [
    ethers.parseEther("125"),   // Wireframe Completion
    ethers.parseEther("250"),   // Design Approval & 50% Development
    ethers.parseEther("125"),   // Final Delivery
  ];

  console.log("Invoice Details:");
  console.log(`- ID: ${invoiceId}`);
  console.log(`- Freelancer: ${freelancer}`);
  console.log(`- Milestones:`);
  milestoneAmounts.forEach((amount, i) => {
    console.log(`  [${i}] ${ethers.formatEther(amount)} MNEE`);
  });
  console.log("");

  // Create invoice on-chain
  console.log("Creating invoice on blockchain...");
  const tx = await PayFlowEscrow.createInvoice(invoiceId, freelancer, milestoneAmounts);
  console.log(`Transaction sent: ${tx.hash}`);

  await tx.wait();
  console.log("✅ Invoice created successfully!\n");

  // Verify
  const invoice = await PayFlowEscrow.getInvoice(invoiceId);
  console.log("Verification:");
  console.log(`- Exists: ${invoice.exists}`);
  console.log(`- Freelancer: ${invoice.freelancer}`);
  console.log(`- Milestone Count: ${invoice.milestoneCount}`);
  console.log("\n✅ Invoice is now live on Sepolia!");
  console.log("You can now test the deposit flow!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
