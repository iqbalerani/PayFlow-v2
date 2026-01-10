# 💸 PayFlow - AI-Powered Freelance Escrow Platform

<div align="center">

![PayFlow Banner](https://img.shields.io/badge/PayFlow-v2.0-blue?style=for-the-badge)
![MNEE](https://img.shields.io/badge/Powered%20by-MNEE-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**Secure milestone-based payments for freelancers using MNEE stablecoin escrow**

[Live Demo](https://payflow.vercel.app) • [Documentation](#-documentation) • [Video Demo](#-demo-video)

</div>

---

## 🌟 Overview

PayFlow is a decentralized escrow platform that protects freelancers and clients from payment disputes using blockchain technology and AI-powered invoice generation. Built for the **MNEE-ETH Hackathon**.

### The Problem

- **Freelancers** risk working for free when clients refuse to pay
- **Clients** risk losing deposits to unfinished work
- Traditional escrow services charge 3-5% fees and take days to settle
- Creating professional invoices and contracts is time-consuming

### Our Solution

PayFlow uses smart contracts to hold MNEE stablecoin payments in trustless escrow, releasing funds only when both parties agree. AI assists with invoice generation and client communication, making professional freelancing accessible to everyone.

## ✨ Key Features

### 🔐 Trustless Escrow
- **Non-Custodial**: Smart contract holds funds, not a centralized party
- **Milestone-Based**: Pay and release in stages as work progresses
- **1% Platform Fee**: Industry-lowest fee automatically deducted on release
- **Instant Settlement**: Releases happen in seconds, not days

### 🤖 AI-Powered Automation
- **Smart Invoice Generation**: Describe your project in natural language
- **Auto-Milestone Creation**: AI suggests optimal payment structure
- **Client Messaging**: Generate professional outreach emails
- **Contract Analysis**: AI explains terms in simple language

### 💎 MNEE Stablecoin Integration
- **Price Stability**: Payments in MNEE ($1 = 1 MNEE)
- **Low Fees**: Ethereum gas costs only, no currency conversion
- **Global**: Send/receive anywhere in the world instantly
- **Transparent**: All transactions verifiable on-chain

### 🎨 Beautiful UX
- **Modern Interface**: Sleek, animated design inspired by Linear/Stripe
- **One-Click Connect**: RainbowKit wallet integration
- **Mobile Responsive**: Works perfectly on any device
- **Dark Mode Ready**: Eye-friendly interface (coming soon)

## 🏗️ Architecture

### Tech Stack

**Frontend** (React + TypeScript)
- **Framework**: Vite + React 19
- **Web3**: wagmi v3, viem v2, RainbowKit v2
- **State**: Zustand for global state
- **Styling**: Tailwind CSS utility classes (inline)
- **AI**: Google Gemini API

**Backend** (Node.js + TypeScript)
- **Framework**: Express.js
- **Database**: PostgreSQL (Neon serverless)
- **ORM**: Prisma
- **Auth**: JWT + SIWE (Sign-In with Ethereum)
- **Blockchain**: ethers.js v6

**Smart Contracts** (Solidity)
- **Language**: Solidity 0.8.20
- **Framework**: Hardhat
- **Standards**: ERC-20 (MNEE), ReentrancyGuard, Ownable
- **Network**: Ethereum Sepolia (testnet) / Mainnet

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MetaMask or another Web3 wallet
- Sepolia ETH for gas fees ([Get testnet ETH](https://sepoliafaucet.com/))
- Testnet MNEE tokens (request from hackathon organizers)

### Local Development

```bash
# Clone repository
git clone https://github.com/yourusername/PayFlow.git
cd PayFlow

# Install frontend dependencies
npm install

# Install backend dependencies
cd Backend
npm install
cd ..

# Install contract dependencies
cd contracts
npm install
cd ..

# Configure environment variables
cp .env.example .env.local
cp Backend/.env.example Backend/.env
cp contracts/.env.example contracts/.env

# Run database migrations
cd Backend
npm run prisma:push
cd ..

# Start backend server
cd Backend
npm run dev
# Backend running on http://localhost:8001

# Start frontend (in another terminal)
npm run dev
# Frontend running on http://localhost:3030
```

### Configuration

#### Frontend `.env.local`

```env
VITE_API_URL=http://localhost:8001/api
VITE_MNEE_TOKEN_ADDRESS=0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF
VITE_PAYFLOW_ESCROW_ADDRESS=<deployed_contract_address>
VITE_ALCHEMY_API_KEY=<your_alchemy_api_key>
VITE_WALLETCONNECT_PROJECT_ID=<your_project_id>
GEMINI_API_KEY=<your_gemini_api_key>
```

## 📦 Deployment

### Deploy Smart Contracts

```bash
cd contracts
npm install

# Configure .env with private key and RPC URL
# See DEPLOYMENT_GUIDE.md

# Deploy to Sepolia
npx hardhat run scripts/deploy.ts --network sepolia

# Verify on Etherscan
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> "<MNEE_ADDRESS>" "<PLATFORM_WALLET>"
```

### Deploy Backend (Railway)

See [Backend/DEPLOYMENT.md](Backend/DEPLOYMENT.md) for detailed instructions.

### Deploy Frontend (Vercel)

See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for detailed instructions.

## 📖 Documentation

- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Deploy smart contracts to Sepolia
- **[Backend Deployment](Backend/DEPLOYMENT.md)** - Deploy backend API to Railway
- **[Frontend Deployment](VERCEL_DEPLOYMENT.md)** - Deploy frontend to Vercel
- **[Backend Implementation](BACKEND_IMPLEMENTATION.md)** - API documentation
- **[Hackathon Assessment](HACKATHON_ASSESSMENT.md)** - Project roadmap & progress

## 🛠️ Development

### Available Scripts

**Frontend**
```bash
npm run dev          # Start dev server (localhost:3030)
npm run build        # Build for production
npm run preview      # Preview production build
```

**Backend**
```bash
npm run dev          # Start dev server with hot reload
npm run build        # Compile TypeScript
npm run start        # Start production server
npm run prisma:studio # Open Prisma database GUI
```

**Contracts**
```bash
npx hardhat compile  # Compile contracts
npx hardhat test     # Run tests
npx hardhat run scripts/deploy.ts --network sepolia  # Deploy
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Hackathon Submission

### MNEE-ETH Hackathon (January 2026)

**Category**: DeFi & Payments

**Prizes Applying For**:
- Best Use of MNEE Stablecoin
- Best Overall Project
- Most Innovative DeFi Application

**Links**:
- **Live Demo**: https://payflow.vercel.app
- **Demo Video**: https://youtube.com/your-demo
- **Devpost**: https://devpost.com/software/payflow
- **Contract (Sepolia)**: https://sepolia.etherscan.io/address/0x...
- **GitHub**: https://github.com/yourusername/PayFlow

## 🙏 Acknowledgments

- **MNEE Team** - For creating a stable, accessible cryptocurrency
- **Ethereum Foundation** - For the robust blockchain infrastructure
- **Google** - For Gemini AI API
- **Alchemy** - For reliable RPC infrastructure
- **Neon** - For serverless PostgreSQL
- **Vercel** - For seamless frontend hosting
- **Railway** - For backend deployment

---

<div align="center">

**Built with ❤️ for the MNEE-ETH Hackathon**

[⬆ Back to Top](#-payflow---ai-powered-freelance-escrow-platform)

</div>
