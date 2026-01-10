import { ethers } from 'ethers';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

// PayFlow Escrow ABI (events only - minimal for listening)
const PAYFLOW_ESCROW_ABI = [
  "event InvoiceCreated(string indexed invoiceId, address indexed freelancer, uint256 totalAmount, uint256 milestoneCount)",
  "event MilestoneDeposited(string indexed invoiceId, uint256 indexed milestoneIndex, uint256 amount, address indexed payer)",
  "event MilestoneReleased(string indexed invoiceId, uint256 indexed milestoneIndex, uint256 amount, address indexed recipient)",
  "event MilestoneRefunded(string indexed invoiceId, uint256 indexed milestoneIndex, uint256 amount, address indexed recipient)"
];

interface BlockchainEvent {
  event: 'MilestoneDeposited' | 'MilestoneReleased' | 'MilestoneRefunded';
  invoiceId: string;
  milestoneIndex: number;
  amount: string;
  wallet: string;
  txHash: string;
  timestamp: number;
}

export class BlockchainListener {
  private provider: ethers.WebSocketProvider | ethers.JsonRpcProvider;
  private contract: ethers.Contract;
  private webhookUrl: string;
  private webhookSecret: string;

  constructor() {
    // Use WebSocket provider for real-time events
    const rpcUrl = process.env.ETHEREUM_RPC_URL || '';
    const wsUrl = rpcUrl.replace('https://', 'wss://').replace('http://', 'ws://');

    try {
      this.provider = new ethers.WebSocketProvider(wsUrl);
    } catch (error) {
      console.warn('WebSocket provider failed, falling back to HTTP provider');
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
    }

    const contractAddress = process.env.PAYFLOW_ESCROW_ADDRESS || '';
    if (!contractAddress) {
      throw new Error('PAYFLOW_ESCROW_ADDRESS not set in environment');
    }

    this.contract = new ethers.Contract(
      contractAddress,
      PAYFLOW_ESCROW_ABI,
      this.provider
    );

    this.webhookUrl = process.env.API_URL + '/api/webhooks/blockchain' || 'http://localhost:8001/api/webhooks/blockchain';
    this.webhookSecret = process.env.WEBHOOK_SECRET || 'default-webhook-secret';

    console.log('🔗 Blockchain Listener initialized');
    console.log(`   Contract: ${contractAddress}`);
    console.log(`   Network: ${process.env.ETHEREUM_NETWORK || 'mainnet'}`);
    console.log(`   Webhook: ${this.webhookUrl}`);
  }

  /**
   * Start listening for blockchain events
   */
  async start() {
    console.log('\n🎧 Starting blockchain event listener...\n');

    // Listen for InvoiceCreated events (for logging)
    this.contract.on('InvoiceCreated', async (invoiceId, freelancer, totalAmount, milestoneCount, event) => {
      console.log(`📝 Invoice Created: ${invoiceId}`);
      console.log(`   Freelancer: ${freelancer}`);
      console.log(`   Total: ${ethers.formatEther(totalAmount)} MNEE`);
      console.log(`   Milestones: ${milestoneCount.toString()}`);
      console.log(`   Tx: ${event.log.transactionHash}\n`);
    });

    // Listen for MilestoneDeposited events
    this.contract.on('MilestoneDeposited', async (invoiceId, milestoneIndex, amount, payer, event) => {
      console.log(`💰 Milestone Deposited: ${invoiceId}[${milestoneIndex}]`);
      console.log(`   Amount: ${ethers.formatEther(amount)} MNEE`);
      console.log(`   Payer: ${payer}`);
      console.log(`   Tx: ${event.log.transactionHash}\n`);

      await this.sendWebhook({
        event: 'MilestoneDeposited',
        invoiceId,
        milestoneIndex: Number(milestoneIndex),
        amount: ethers.formatEther(amount),
        wallet: payer,
        txHash: event.log.transactionHash,
        timestamp: Math.floor(Date.now() / 1000)
      });
    });

    // Listen for MilestoneReleased events
    this.contract.on('MilestoneReleased', async (invoiceId, milestoneIndex, amount, recipient, event) => {
      console.log(`✅ Milestone Released: ${invoiceId}[${milestoneIndex}]`);
      console.log(`   Amount: ${ethers.formatEther(amount)} MNEE`);
      console.log(`   Recipient: ${recipient}`);
      console.log(`   Tx: ${event.log.transactionHash}\n`);

      await this.sendWebhook({
        event: 'MilestoneReleased',
        invoiceId,
        milestoneIndex: Number(milestoneIndex),
        amount: ethers.formatEther(amount),
        wallet: recipient,
        txHash: event.log.transactionHash,
        timestamp: Math.floor(Date.now() / 1000)
      });
    });

    // Listen for MilestoneRefunded events
    this.contract.on('MilestoneRefunded', async (invoiceId, milestoneIndex, amount, recipient, event) => {
      console.log(`🔙 Milestone Refunded: ${invoiceId}[${milestoneIndex}]`);
      console.log(`   Amount: ${ethers.formatEther(amount)} MNEE`);
      console.log(`   Recipient: ${recipient}`);
      console.log(`   Tx: ${event.log.transactionHash}\n`);

      await this.sendWebhook({
        event: 'MilestoneRefunded',
        invoiceId,
        milestoneIndex: Number(milestoneIndex),
        amount: ethers.formatEther(amount),
        wallet: recipient,
        txHash: event.log.transactionHash,
        timestamp: Math.floor(Date.now() / 1000)
      });
    });

    // Handle provider errors
    this.provider.on('error', (error) => {
      console.error('Provider error:', error);
      // Implement reconnection logic here if needed
    });

    console.log('✅ Blockchain listener is active and monitoring events\n');
  }

  /**
   * Send webhook to backend API
   */
  private async sendWebhook(data: BlockchainEvent) {
    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Secret': this.webhookSecret
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const text = await response.text();
        console.error(`❌ Webhook failed (${response.status}):`, text);
      } else {
        console.log(`✅ Webhook sent successfully for ${data.event}`);
      }
    } catch (error) {
      console.error('❌ Webhook error:', error);
      // In production, implement retry logic and/or queue system
    }
  }

  /**
   * Fetch past events (for catching up after downtime)
   */
  async catchUpEvents(fromBlock: number = -10000) {
    console.log('🔄 Catching up on past events...\n');

    const currentBlock = await this.provider.getBlockNumber();
    const startBlock = Math.max(0, currentBlock + fromBlock); // Last 10000 blocks by default

    console.log(`   Scanning blocks ${startBlock} to ${currentBlock}...\n`);

    // Query past events
    const depositFilter = this.contract.filters.MilestoneDeposited();
    const releaseFilter = this.contract.filters.MilestoneReleased();
    const refundFilter = this.contract.filters.MilestoneRefunded();

    const [deposits, releases, refunds] = await Promise.all([
      this.contract.queryFilter(depositFilter, startBlock, currentBlock),
      this.contract.queryFilter(releaseFilter, startBlock, currentBlock),
      this.contract.queryFilter(refundFilter, startBlock, currentBlock)
    ]);

    console.log(`   Found ${deposits.length} deposits, ${releases.length} releases, ${refunds.length} refunds\n`);

    // Process past events (you may want to batch these)
    for (const event of [...deposits, ...releases, ...refunds]) {
      // Log but don't send webhooks for old events (implement your own logic)
      console.log(`   Past event: ${event.eventName} - Tx: ${event.transactionHash}`);
    }

    console.log('✅ Catch-up complete\n');
  }

  /**
   * Stop listening
   */
  async stop() {
    console.log('🛑 Stopping blockchain listener...');
    this.contract.removeAllListeners();
    if (this.provider instanceof ethers.WebSocketProvider) {
      await this.provider.destroy();
    }
    console.log('✅ Listener stopped\n');
  }
}

// CLI entry point
if (require.main === module) {
  const listener = new BlockchainListener();

  listener.start().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n\n📴 Received SIGINT, shutting down gracefully...');
    await listener.stop();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\n\n📴 Received SIGTERM, shutting down gracefully...');
    await listener.stop();
    process.exit(0);
  });
}
