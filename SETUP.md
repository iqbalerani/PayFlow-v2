# PayFlow AI - Complete Setup Guide

This guide will help you set up the entire PayFlow AI system including frontend, backend, smart contracts, and blockchain listener.

## Architecture Overview

```
PayFlow AI System
├── Frontend (React + Vite)          → Port 3000
├── Backend (Express + TypeScript)   → Port 3001
├── Blockchain Listener (Node.js)    → Background service
├── Smart Contracts (Solidity)       → Ethereum
└── Database (PostgreSQL via Neon)
```

## Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **PostgreSQL**: Neon database (recommended) or local PostgreSQL
- **Ethereum RPC**: Alchemy or Infura account
- **Wallet**: MetaMask or other Web3 wallet (for deployment)

## Part 1: Database Setup (Neon PostgreSQL)

### 1.1 Create Neon Account

1. Go to [neon.tech](https://neon.tech)
2. Sign up for a free account
3. Create a new project called "PayFlow"
4. Copy the connection string (it looks like: `postgresql://user:password@xxx.neon.tech/payflow?sslmode=require`)

### 1.2 Configure Database Connection

The database URL is already added to `Backend/.env.example`. You'll copy this to `.env` in the next step.

## Part 2: Backend Setup

### 2.1 Install Dependencies

```bash
cd Backend
npm install
```

### 2.2 Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and update:

```env
# Use your Neon database URL
NEON_DATABASE_URL=postgresql://your-neon-connection-string
DATABASE_URL=${NEON_DATABASE_URL}

# Generate a strong JWT secret
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# Add your Gemini API key (get from https://ai.google.dev/)
GEMINI_API_KEY=your-gemini-api-key

# Ethereum RPC (get from https://www.alchemy.com/)
ETHEREUM_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY

# Generate a webhook secret
WEBHOOK_SECRET=your-secure-webhook-secret
```

### 2.3 Set Up Database

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations to create tables
npm run prisma:migrate

# (Optional) Open Prisma Studio to view database
npm run prisma:studio
```

### 2.4 Start Backend Server

```bash
# Development mode (with hot reload)
npm run dev
```

The backend will start on `http://localhost:3001`

Test it:
```bash
curl http://localhost:3001/health
```

You should see: `{"status":"ok","timestamp":"...","service":"PayFlow Backend API"}`

## Part 3: Smart Contract Setup

### 3.1 Install Dependencies

```bash
cd ../contracts
npm install
```

### 3.2 Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Sepolia Testnet (for testing)
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY

# Mainnet (for production)
MAINNET_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY

# Your wallet private key (NEVER commit this!)
PRIVATE_KEY=your-private-key-here

# Etherscan API key (for verification)
ETHERSCAN_API_KEY=your-etherscan-key

# MNEE Token (already set)
MNEE_TOKEN_ADDRESS=0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF

# Platform wallet (your address for receiving fees)
PLATFORM_WALLET=your-wallet-address
```

### 3.3 Compile Contracts

```bash
npm run compile
```

### 3.4 Run Tests

```bash
npm test
```

All tests should pass ✅

### 3.5 Deploy to Sepolia Testnet

```bash
npm run deploy:sepolia
```

Copy the deployed contract address and update both:
- `contracts/.env` → `PAYFLOW_ESCROW_ADDRESS=0x...`
- `Backend/.env` → `PAYFLOW_ESCROW_ADDRESS=0x...`

### 3.6 Verify Contract on Etherscan

```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> "0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF" "<YOUR_PLATFORM_WALLET>"
```

## Part 4: Blockchain Listener Setup

The blockchain listener is part of the backend. It monitors on-chain events and updates the database.

### 4.1 Configure Listener

Make sure your `Backend/.env` has:
```env
ETHEREUM_RPC_URL=wss://eth-sepolia.g.alchemy.com/v2/YOUR_KEY  # Use wss:// for WebSocket
PAYFLOW_ESCROW_ADDRESS=0x...  # From contract deployment
WEBHOOK_SECRET=your-webhook-secret  # Same as in backend .env
```

### 4.2 Start Listener

```bash
cd Backend
npm run listener
```

You should see:
```
🔗 Blockchain Listener initialized
   Contract: 0x...
   Network: sepolia
   Webhook: http://localhost:3001/api/webhooks/blockchain

🎧 Starting blockchain event listener...
✅ Blockchain listener is active and monitoring events
```

Keep this running in a separate terminal.

## Part 5: Frontend Setup

### 5.1 Install Dependencies

```bash
cd ..  # Back to PayFlow root
npm install
```

### 5.2 Start Frontend

```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

### 5.3 Test the Application

1. Open `http://localhost:3000`
2. You should see the PayFlow landing page
3. Try creating an invoice (currently uses mock data)

## Part 6: Running the Full Stack

You need **3 terminals** running simultaneously:

**Terminal 1 - Backend API:**
```bash
cd Backend
npm run dev
```

**Terminal 2 - Blockchain Listener:**
```bash
cd Backend
npm run listener
```

**Terminal 3 - Frontend:**
```bash
npm run dev
```

## Part 7: Testing the Complete Flow

### 7.1 Create an Invoice (via API)

```bash
curl -X POST http://localhost:3001/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Sign in message",
    "signature": "0x..."
  }'
```

(You'll need to implement proper SIWE signing in the frontend)

### 7.2 Generate Invoice with AI

```bash
curl -X POST http://localhost:3001/api/ai/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "description": "Build a landing page for a SaaS product. 3 pages: home, pricing, features. Total cost $1500. 30% upfront, 40% after design approval, 30% on delivery."
  }'
```

### 7.3 Monitor Events

Watch the blockchain listener terminal for events when transactions occur on-chain.

## Part 8: Production Deployment

### 8.1 Backend Deployment (Railway/Render)

1. Push code to GitHub
2. Connect Railway/Render to your repo
3. Set environment variables in dashboard
4. Deploy backend service

### 8.2 Frontend Deployment (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Deploy

### 8.3 Blockchain Listener (Background Service)

Option 1: Run on same server as backend
```bash
pm2 start Backend/src/services/blockchainListener.ts --name payflow-listener
```

Option 2: Deploy as separate service on Railway/Render

### 8.4 Smart Contracts (Mainnet)

⚠️ **WARNING**: Only deploy to mainnet after thorough testing!

1. Get mainnet ETH for deployment
2. Update `.env` with mainnet RPC
3. Run: `npm run deploy:mainnet`
4. Verify contract on Etherscan
5. Update all `.env` files with mainnet contract address

## Part 9: Database Migrations

When you make changes to the Prisma schema:

```bash
cd Backend
npm run prisma:migrate
```

This will:
1. Create a new migration file
2. Apply it to your database
3. Regenerate Prisma client

## Troubleshooting

### Backend won't start
- Check if port 3001 is available: `lsof -i :3001`
- Verify DATABASE_URL is correct
- Check all required env vars are set

### Blockchain listener errors
- Ensure WebSocket RPC URL (wss://) is used
- Verify PAYFLOW_ESCROW_ADDRESS is deployed
- Check WEBHOOK_SECRET matches in both places

### Database connection issues
- Verify Neon connection string includes `?sslmode=require`
- Check Neon project is active
- Test connection: `npm run prisma:studio`

### Smart contract deployment fails
- Ensure you have testnet ETH
- Verify RPC URL is correct
- Check private key has funds

### Frontend can't connect to backend
- Check CORS settings in backend
- Verify backend is running on port 3001
- Check API_URL in frontend env

## Next Steps

1. **Integrate Web3 in Frontend**: Replace mock wallet with real Web3 integration (wagmi/viem)
2. **Add Real Payments**: Connect frontend to smart contract for actual MNEE payments
3. **Email Notifications**: Add email service for invoice notifications
4. **Analytics Dashboard**: Add charts and insights for freelancers
5. **Mobile Responsive**: Ensure all pages work on mobile
6. **Security Audit**: Get smart contracts audited before mainnet
7. **Load Testing**: Test API endpoints under load
8. **Monitoring**: Set up Sentry, LogRocket, or similar

## Support

- Backend API docs: `http://localhost:3001/api`
- Prisma Studio: `npm run prisma:studio`
- Smart Contract tests: `cd contracts && npm test`

## Security Reminders

- ✅ Never commit `.env` files
- ✅ Use strong JWT_SECRET (min 32 characters)
- ✅ Keep private keys secure
- ✅ Use multi-sig wallet for platform fees in production
- ✅ Enable rate limiting on public APIs
- ✅ Get smart contracts audited before mainnet
- ✅ Use environment-specific RPC endpoints
- ✅ Regularly update dependencies
