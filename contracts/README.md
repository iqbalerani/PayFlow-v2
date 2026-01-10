# PayFlow Smart Contracts

Ethereum smart contracts for PayFlow AI escrow system using MNEE stablecoin.

## Contracts

### PayFlowEscrow.sol

Main escrow contract that handles:
- Invoice creation with multiple milestones
- Milestone-based payment deposits
- Client approval and fund release
- Admin refund functionality for disputes
- Platform fee collection (default 1%)

### MockERC20.sol

Mock ERC20 token for testing purposes only.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your configuration:
- Network RPC URLs (Alchemy, Infura, etc.)
- Deployer private key
- Etherscan API key for verification
- MNEE token address: `0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF`

### 3. Compile Contracts

```bash
npm run compile
```

This generates:
- Compiled artifacts in `artifacts/`
- TypeScript types in `typechain-types/`

## Testing

Run the full test suite:

```bash
npm test
```

Tests cover:
- Invoice creation
- Milestone deposits
- Fund releases
- Refunds
- Admin functions
- Edge cases and security

## Deployment

### Sepolia Testnet

```bash
npm run deploy:sepolia
```

### Ethereum Mainnet

```bash
npm run deploy:mainnet
```

⚠️ **Warning**: Double-check all configuration before mainnet deployment.

After deployment:
1. Copy the contract address
2. Update `.env` with `PAYFLOW_ESCROW_ADDRESS`
3. Update backend `.env` with the same address
4. Verify contract on Etherscan

## Contract Verification

```bash
npx hardhat verify --network <network> <contract-address> "<mnee-token>" "<platform-wallet>"
```

Example:
```bash
npx hardhat verify --network sepolia 0x123... "0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF" "0xabc..."
```

## Contract Architecture

```
PayFlowEscrow
├── State Variables
│   ├── mneeToken (IERC20)
│   ├── platformFeePercent (uint256)
│   ├── platformWallet (address)
│   ├── invoices (mapping)
│   └── freelancerEscrowBalance (mapping)
│
├── Core Functions
│   ├── createInvoice()       // Create invoice with milestones
│   ├── depositMilestone()    // Client pays into escrow
│   ├── releaseMilestone()    // Client releases to freelancer
│   └── refundMilestone()     // Admin refunds to client
│
├── View Functions
│   ├── getInvoice()
│   ├── getMilestone()
│   └── getMilestoneCount()
│
└── Admin Functions
    ├── updatePlatformFee()
    └── updatePlatformWallet()
```

## Events

- `InvoiceCreated` - Emitted when new invoice is created
- `MilestoneDeposited` - Emitted when client deposits funds
- `MilestoneReleased` - Emitted when funds released to freelancer
- `MilestoneRefunded` - Emitted when admin refunds to client
- `PlatformFeeUpdated` - Emitted when fee percentage changes
- `PlatformWalletUpdated` - Emitted when platform wallet changes

## Security Features

- **ReentrancyGuard**: Prevents reentrancy attacks on deposit/release/refund
- **Ownable**: Admin functions restricted to contract owner
- **SafeERC20**: Safe token transfers with proper error handling
- **CEI Pattern**: Checks-Effects-Interactions pattern followed
- **Input Validation**: All inputs validated before processing
- **Fee Cap**: Platform fee capped at 10% maximum

## Gas Optimization

- Immutable variables for gas savings
- Efficient storage patterns
- Minimal external calls
- Event indexing for efficient queries

## Integration with Backend

The backend blockchain listener service monitors these events:

1. **MilestoneDeposited**: Updates database milestone status to `PAID`
2. **MilestoneReleased**: Updates status to `RELEASED`, records transaction
3. **MilestoneRefunded**: Updates status to `REFUNDED`

See `Backend/src/services/blockchainListener.ts` for implementation.

## Local Testing

Start local Hardhat node:

```bash
npx hardhat node
```

Deploy to local network:

```bash
npx hardhat run scripts/deploy.ts --network localhost
```

## Production Checklist

- [ ] All tests passing
- [ ] Contract audited (recommended for mainnet)
- [ ] Platform wallet set to multi-sig
- [ ] Fee percentage configured correctly
- [ ] MNEE token address verified
- [ ] RPC URLs configured for reliability
- [ ] Private keys secured (use hardware wallet for mainnet)
- [ ] Etherscan verification prepared
- [ ] Emergency pause mechanism considered
- [ ] Upgrade path planned (if needed)

## MNEE Token Information

- **Name**: MNEE Stablecoin
- **Symbol**: MNEE
- **Decimals**: 18
- **Address**: `0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF`
- **Network**: Ethereum Mainnet
- **Peg**: 1 MNEE = 1 USD

## Support

For issues or questions:
1. Check test cases for usage examples
2. Review the architecture document
3. Examine event logs for debugging
