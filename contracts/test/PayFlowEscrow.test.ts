import { expect } from "chai";
import { ethers } from "hardhat";
import { PayFlowEscrow } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("PayFlowEscrow", function () {
  let escrow: PayFlowEscrow;
  let mneeToken: any;
  let owner: SignerWithAddress;
  let freelancer: SignerWithAddress;
  let client: SignerWithAddress;
  let platformWallet: SignerWithAddress;

  const INITIAL_BALANCE = ethers.parseEther("10000");
  const MILESTONE_AMOUNTS = [
    ethers.parseEther("300"),  // 30%
    ethers.parseEther("400"),  // 40%
    ethers.parseEther("300"),  // 30%
  ];
  const INVOICE_ID = "INV-2026-001";

  beforeEach(async function () {
    [owner, freelancer, client, platformWallet] = await ethers.getSigners();

    // Deploy mock MNEE token
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mneeToken = await MockERC20.deploy("MNEE Stablecoin", "MNEE");
    await mneeToken.waitForDeployment();

    // Mint tokens to client
    await mneeToken.mint(client.address, INITIAL_BALANCE);

    // Deploy PayFlowEscrow
    const PayFlowEscrow = await ethers.getContractFactory("PayFlowEscrow");
    escrow = await PayFlowEscrow.deploy(
      await mneeToken.getAddress(),
      platformWallet.address
    );
    await escrow.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct MNEE token address", async function () {
      expect(await escrow.mneeToken()).to.equal(await mneeToken.getAddress());
    });

    it("Should set the correct platform wallet", async function () {
      expect(await escrow.platformWallet()).to.equal(platformWallet.address);
    });

    it("Should set default platform fee to 1%", async function () {
      expect(await escrow.platformFeePercent()).to.equal(100);
    });
  });

  describe("Invoice Creation", function () {
    it("Should create invoice successfully", async function () {
      await expect(
        escrow.connect(freelancer).createInvoice(INVOICE_ID, freelancer.address, MILESTONE_AMOUNTS)
      )
        .to.emit(escrow, "InvoiceCreated")
        .withArgs(INVOICE_ID, freelancer.address, ethers.parseEther("1000"), 3);

      const invoice = await escrow.getInvoice(INVOICE_ID);
      expect(invoice.freelancer).to.equal(freelancer.address);
      expect(invoice.milestoneCount).to.equal(3);
      expect(invoice.exists).to.be.true;
    });

    it("Should reject duplicate invoice IDs", async function () {
      await escrow.connect(freelancer).createInvoice(INVOICE_ID, freelancer.address, MILESTONE_AMOUNTS);

      await expect(
        escrow.connect(freelancer).createInvoice(INVOICE_ID, freelancer.address, MILESTONE_AMOUNTS)
      ).to.be.revertedWith("Invoice already exists");
    });

    it("Should reject invoice with no milestones", async function () {
      await expect(
        escrow.connect(freelancer).createInvoice(INVOICE_ID, freelancer.address, [])
      ).to.be.revertedWith("Must have at least one milestone");
    });

    it("Should reject invoice with zero address freelancer", async function () {
      await expect(
        escrow.connect(freelancer).createInvoice(INVOICE_ID, ethers.ZeroAddress, MILESTONE_AMOUNTS)
      ).to.be.revertedWith("Invalid freelancer address");
    });
  });

  describe("Milestone Deposit", function () {
    beforeEach(async function () {
      await escrow.connect(freelancer).createInvoice(INVOICE_ID, freelancer.address, MILESTONE_AMOUNTS);
      await mneeToken.connect(client).approve(await escrow.getAddress(), ethers.parseEther("1000"));
    });

    it("Should deposit milestone successfully", async function () {
      await expect(
        escrow.connect(client).depositMilestone(INVOICE_ID, 0)
      )
        .to.emit(escrow, "MilestoneDeposited")
        .withArgs(INVOICE_ID, 0, MILESTONE_AMOUNTS[0], client.address);

      const milestone = await escrow.getMilestone(INVOICE_ID, 0);
      expect(milestone.status).to.equal(1); // DEPOSITED
      expect(milestone.amount).to.equal(MILESTONE_AMOUNTS[0]);

      const escrowBalance = await escrow.freelancerEscrowBalance(freelancer.address);
      expect(escrowBalance).to.equal(MILESTONE_AMOUNTS[0]);
    });

    it("Should set client address on first deposit", async function () {
      await escrow.connect(client).depositMilestone(INVOICE_ID, 0);
      const invoice = await escrow.getInvoice(INVOICE_ID);
      expect(invoice.client).to.equal(client.address);
    });

    it("Should reject deposit from different client", async function () {
      await escrow.connect(client).depositMilestone(INVOICE_ID, 0);

      const [, , otherClient] = await ethers.getSigners();
      await mneeToken.mint(otherClient.address, INITIAL_BALANCE);
      await mneeToken.connect(otherClient).approve(await escrow.getAddress(), ethers.parseEther("1000"));

      await expect(
        escrow.connect(otherClient).depositMilestone(INVOICE_ID, 1)
      ).to.be.revertedWith("Only client can pay");
    });

    it("Should reject double deposit", async function () {
      await escrow.connect(client).depositMilestone(INVOICE_ID, 0);

      await expect(
        escrow.connect(client).depositMilestone(INVOICE_ID, 0)
      ).to.be.revertedWith("Milestone already paid");
    });
  });

  describe("Milestone Release", function () {
    beforeEach(async function () {
      await escrow.connect(freelancer).createInvoice(INVOICE_ID, freelancer.address, MILESTONE_AMOUNTS);
      await mneeToken.connect(client).approve(await escrow.getAddress(), ethers.parseEther("1000"));
      await escrow.connect(client).depositMilestone(INVOICE_ID, 0);
    });

    it("Should release milestone to freelancer", async function () {
      const freelancerBalanceBefore = await mneeToken.balanceOf(freelancer.address);
      const platformBalanceBefore = await mneeToken.balanceOf(platformWallet.address);

      const fee = (MILESTONE_AMOUNTS[0] * 100n) / 10000n; // 1% fee
      const freelancerAmount = MILESTONE_AMOUNTS[0] - fee;

      await expect(
        escrow.connect(client).releaseMilestone(INVOICE_ID, 0)
      )
        .to.emit(escrow, "MilestoneReleased")
        .withArgs(INVOICE_ID, 0, freelancerAmount, freelancer.address);

      const freelancerBalanceAfter = await mneeToken.balanceOf(freelancer.address);
      const platformBalanceAfter = await mneeToken.balanceOf(platformWallet.address);

      expect(freelancerBalanceAfter - freelancerBalanceBefore).to.equal(freelancerAmount);
      expect(platformBalanceAfter - platformBalanceBefore).to.equal(fee);

      const milestone = await escrow.getMilestone(INVOICE_ID, 0);
      expect(milestone.status).to.equal(2); // RELEASED
    });

    it("Should reject release from non-client", async function () {
      await expect(
        escrow.connect(freelancer).releaseMilestone(INVOICE_ID, 0)
      ).to.be.revertedWith("Only client can release");
    });

    it("Should reject release of non-deposited milestone", async function () {
      await expect(
        escrow.connect(client).releaseMilestone(INVOICE_ID, 1)
      ).to.be.revertedWith("Milestone not deposited");
    });
  });

  describe("Milestone Refund", function () {
    beforeEach(async function () {
      await escrow.connect(freelancer).createInvoice(INVOICE_ID, freelancer.address, MILESTONE_AMOUNTS);
      await mneeToken.connect(client).approve(await escrow.getAddress(), ethers.parseEther("1000"));
      await escrow.connect(client).depositMilestone(INVOICE_ID, 0);
    });

    it("Should refund milestone to client (owner only)", async function () {
      const clientBalanceBefore = await mneeToken.balanceOf(client.address);

      await expect(
        escrow.connect(owner).refundMilestone(INVOICE_ID, 0)
      )
        .to.emit(escrow, "MilestoneRefunded")
        .withArgs(INVOICE_ID, 0, MILESTONE_AMOUNTS[0], client.address);

      const clientBalanceAfter = await mneeToken.balanceOf(client.address);
      expect(clientBalanceAfter - clientBalanceBefore).to.equal(MILESTONE_AMOUNTS[0]);

      const milestone = await escrow.getMilestone(INVOICE_ID, 0);
      expect(milestone.status).to.equal(3); // REFUNDED
    });

    it("Should reject refund from non-owner", async function () {
      await expect(
        escrow.connect(client).refundMilestone(INVOICE_ID, 0)
      ).to.be.revertedWithCustomError(escrow, "OwnableUnauthorizedAccount");
    });
  });

  describe("Admin Functions", function () {
    it("Should update platform fee", async function () {
      await expect(escrow.connect(owner).updatePlatformFee(200))
        .to.emit(escrow, "PlatformFeeUpdated")
        .withArgs(100, 200);

      expect(await escrow.platformFeePercent()).to.equal(200);
    });

    it("Should reject fee above 10%", async function () {
      await expect(
        escrow.connect(owner).updatePlatformFee(1001)
      ).to.be.revertedWith("Fee cannot exceed 10%");
    });

    it("Should update platform wallet", async function () {
      const [, , newWallet] = await ethers.getSigners();

      await expect(escrow.connect(owner).updatePlatformWallet(newWallet.address))
        .to.emit(escrow, "PlatformWalletUpdated")
        .withArgs(platformWallet.address, newWallet.address);

      expect(await escrow.platformWallet()).to.equal(newWallet.address);
    });
  });
});

// Mock ERC20 contract for testing
const MockERC20Contract = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
`;
