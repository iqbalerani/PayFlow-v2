import { ethers } from "hardhat";

async function main() {
  const invoiceId = process.argv[2] || "INV-2026-596";

  console.log("====================================");
  console.log("Checking Invoice on Escrow Contract");
  console.log("====================================\n");

  const escrowAddress = process.env.PAYFLOW_ESCROW_ADDRESS || "0xfA4D3Cf2685f2E9B032e939AFBe7B6cFBb6333fa";
  console.log(`Escrow Contract: ${escrowAddress}`);
  console.log(`Invoice ID: ${invoiceId}\n`);

  const PayFlowEscrow = await ethers.getContractAt("PayFlowEscrow", escrowAddress);

  try {
    // Get invoice details
    const invoice = await PayFlowEscrow.getInvoice(invoiceId);

    console.log("Invoice Details:");
    console.log(`- Exists: ${invoice.exists}`);
    console.log(`- Freelancer: ${invoice.freelancer}`);
    console.log(`- Client: ${invoice.client || 'Not set yet'}`);
    console.log(`- Milestone Count: ${invoice.milestoneCount}\n`);

    if (invoice.exists && invoice.milestoneCount > 0n) {
      console.log("Milestones:");
      for (let i = 0; i < Number(invoice.milestoneCount); i++) {
        const milestone = await PayFlowEscrow.getMilestone(invoiceId, i);
        const statusNames = ['EMPTY', 'DEPOSITED', 'RELEASED', 'REFUNDED'];
        console.log(`  [${i}] Amount: ${ethers.formatEther(milestone.amount)} MNEE`);
        console.log(`      Status: ${statusNames[milestone.status]}`);
      }
    }
  } catch (error: any) {
    console.log("❌ Invoice not found or error:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
