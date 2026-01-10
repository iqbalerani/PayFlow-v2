// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PayFlowEscrow
 * @notice Escrow contract for milestone-based payments using MNEE stablecoin
 * @dev Handles invoice creation, milestone deposits, and releases
 */
contract PayFlowEscrow is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // ============ State Variables ============

    IERC20 public immutable mneeToken;
    uint256 public platformFeePercent = 100; // 1% = 100 basis points (10000 = 100%)
    address public platformWallet;

    enum MilestoneStatus { EMPTY, DEPOSITED, RELEASED, REFUNDED }

    struct Milestone {
        uint256 amount;
        MilestoneStatus status;
        uint256 depositedAt;
        uint256 releasedAt;
    }

    struct Invoice {
        string id;
        address freelancer;
        address client;
        Milestone[] milestones;
        bool exists;
    }

    mapping(string => Invoice) public invoices;
    mapping(address => uint256) public freelancerEscrowBalance;

    // ============ Events ============

    event InvoiceCreated(
        string indexed invoiceId,
        address indexed freelancer,
        uint256 totalAmount,
        uint256 milestoneCount
    );

    event MilestoneDeposited(
        string indexed invoiceId,
        uint256 indexed milestoneIndex,
        uint256 amount,
        address indexed payer
    );

    event MilestoneReleased(
        string indexed invoiceId,
        uint256 indexed milestoneIndex,
        uint256 amount,
        address indexed recipient
    );

    event MilestoneRefunded(
        string indexed invoiceId,
        uint256 indexed milestoneIndex,
        uint256 amount,
        address indexed recipient
    );

    event PlatformFeeUpdated(uint256 oldFee, uint256 newFee);
    event PlatformWalletUpdated(address oldWallet, address newWallet);

    // ============ Constructor ============

    constructor(address _mneeToken, address _platformWallet) Ownable(msg.sender) {
        require(_mneeToken != address(0), "Invalid token address");
        require(_platformWallet != address(0), "Invalid platform wallet");

        mneeToken = IERC20(_mneeToken);
        platformWallet = _platformWallet;
    }

    // ============ External Functions ============

    /**
     * @notice Create a new invoice with milestones
     * @param _invoiceId Unique identifier for the invoice
     * @param _freelancer Address of the freelancer who will receive payments
     * @param _milestoneAmounts Array of amounts for each milestone
     */
    function createInvoice(
        string calldata _invoiceId,
        address _freelancer,
        uint256[] calldata _milestoneAmounts
    ) external {
        require(!invoices[_invoiceId].exists, "Invoice already exists");
        require(_freelancer != address(0), "Invalid freelancer address");
        require(_milestoneAmounts.length > 0, "Must have at least one milestone");
        require(_milestoneAmounts.length <= 10, "Max 10 milestones");

        Invoice storage invoice = invoices[_invoiceId];
        invoice.id = _invoiceId;
        invoice.freelancer = _freelancer;
        invoice.exists = true;

        uint256 totalAmount = 0;
        for (uint256 i = 0; i < _milestoneAmounts.length; i++) {
            require(_milestoneAmounts[i] > 0, "Milestone amount must be > 0");
            invoice.milestones.push(Milestone({
                amount: _milestoneAmounts[i],
                status: MilestoneStatus.EMPTY,
                depositedAt: 0,
                releasedAt: 0
            }));
            totalAmount += _milestoneAmounts[i];
        }

        emit InvoiceCreated(_invoiceId, _freelancer, totalAmount, _milestoneAmounts.length);
    }

    /**
     * @notice Client deposits payment for a milestone
     * @param _invoiceId The invoice ID
     * @param _milestoneIndex Index of the milestone to pay
     */
    function depositMilestone(
        string calldata _invoiceId,
        uint256 _milestoneIndex
    ) external nonReentrant {
        Invoice storage invoice = invoices[_invoiceId];
        require(invoice.exists, "Invoice does not exist");
        require(_milestoneIndex < invoice.milestones.length, "Invalid milestone index");

        Milestone storage milestone = invoice.milestones[_milestoneIndex];
        require(milestone.status == MilestoneStatus.EMPTY, "Milestone already paid");

        // Set client on first payment
        if (invoice.client == address(0)) {
            invoice.client = msg.sender;
        }
        require(invoice.client == msg.sender, "Only client can pay");

        // Transfer MNEE from client to this contract
        mneeToken.safeTransferFrom(msg.sender, address(this), milestone.amount);

        // Update milestone status
        milestone.status = MilestoneStatus.DEPOSITED;
        milestone.depositedAt = block.timestamp;

        // Update freelancer's escrow balance
        freelancerEscrowBalance[invoice.freelancer] += milestone.amount;

        emit MilestoneDeposited(_invoiceId, _milestoneIndex, milestone.amount, msg.sender);
    }

    /**
     * @notice Client releases milestone payment to freelancer
     * @param _invoiceId The invoice ID
     * @param _milestoneIndex Index of the milestone to release
     */
    function releaseMilestone(
        string calldata _invoiceId,
        uint256 _milestoneIndex
    ) external nonReentrant {
        Invoice storage invoice = invoices[_invoiceId];
        require(invoice.exists, "Invoice does not exist");
        require(invoice.client == msg.sender, "Only client can release");
        require(_milestoneIndex < invoice.milestones.length, "Invalid milestone index");

        Milestone storage milestone = invoice.milestones[_milestoneIndex];
        require(milestone.status == MilestoneStatus.DEPOSITED, "Milestone not deposited");

        // Calculate amounts
        uint256 feeAmount = (milestone.amount * platformFeePercent) / 10000;
        uint256 freelancerAmount = milestone.amount - feeAmount;

        // Update status before transfer (CEI pattern)
        milestone.status = MilestoneStatus.RELEASED;
        milestone.releasedAt = block.timestamp;
        freelancerEscrowBalance[invoice.freelancer] -= milestone.amount;

        // Transfer to freelancer
        mneeToken.safeTransfer(invoice.freelancer, freelancerAmount);

        // Transfer fee to platform
        if (feeAmount > 0) {
            mneeToken.safeTransfer(platformWallet, feeAmount);
        }

        emit MilestoneReleased(_invoiceId, _milestoneIndex, freelancerAmount, invoice.freelancer);
    }

    /**
     * @notice Admin refunds milestone to client (dispute resolution)
     * @param _invoiceId The invoice ID
     * @param _milestoneIndex Index of the milestone to refund
     */
    function refundMilestone(
        string calldata _invoiceId,
        uint256 _milestoneIndex
    ) external nonReentrant onlyOwner {
        Invoice storage invoice = invoices[_invoiceId];
        require(invoice.exists, "Invoice does not exist");
        require(_milestoneIndex < invoice.milestones.length, "Invalid milestone index");

        Milestone storage milestone = invoice.milestones[_milestoneIndex];
        require(milestone.status == MilestoneStatus.DEPOSITED, "Milestone not deposited");

        // Update status before transfer
        milestone.status = MilestoneStatus.REFUNDED;
        freelancerEscrowBalance[invoice.freelancer] -= milestone.amount;

        // Refund to client
        mneeToken.safeTransfer(invoice.client, milestone.amount);

        emit MilestoneRefunded(_invoiceId, _milestoneIndex, milestone.amount, invoice.client);
    }

    // ============ View Functions ============

    function getInvoice(string calldata _invoiceId)
        external
        view
        returns (
            address freelancer,
            address client,
            uint256 milestoneCount,
            bool exists
        )
    {
        Invoice storage invoice = invoices[_invoiceId];
        return (
            invoice.freelancer,
            invoice.client,
            invoice.milestones.length,
            invoice.exists
        );
    }

    function getMilestone(string calldata _invoiceId, uint256 _index)
        external
        view
        returns (
            uint256 amount,
            MilestoneStatus status,
            uint256 depositedAt,
            uint256 releasedAt
        )
    {
        require(invoices[_invoiceId].exists, "Invoice does not exist");
        require(_index < invoices[_invoiceId].milestones.length, "Invalid index");

        Milestone storage milestone = invoices[_invoiceId].milestones[_index];
        return (
            milestone.amount,
            milestone.status,
            milestone.depositedAt,
            milestone.releasedAt
        );
    }

    function getMilestoneCount(string calldata _invoiceId) external view returns (uint256) {
        require(invoices[_invoiceId].exists, "Invoice does not exist");
        return invoices[_invoiceId].milestones.length;
    }

    // ============ Admin Functions ============

    function updatePlatformFee(uint256 _newFeePercent) external onlyOwner {
        require(_newFeePercent <= 1000, "Fee cannot exceed 10%");
        uint256 oldFee = platformFeePercent;
        platformFeePercent = _newFeePercent;
        emit PlatformFeeUpdated(oldFee, _newFeePercent);
    }

    function updatePlatformWallet(address _newWallet) external onlyOwner {
        require(_newWallet != address(0), "Invalid wallet address");
        address oldWallet = platformWallet;
        platformWallet = _newWallet;
        emit PlatformWalletUpdated(oldWallet, _newWallet);
    }
}
