# 💸 PayFlow - AI-Powered Freelance Escrow Platform

<div align="center">

![PayFlow Banner](https://img.shields.io/badge/PayFlow-v2.0-blue?style=for-the-badge)
![MNEE](https://img.shields.io/badge/Powered%20by-MNEE-green?style=for-the-badge)

**Secure milestone-based payments for freelancers using MNEE stablecoin escrow**

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

### Current Status

**✅ Implemented:**

- AI-powered invoice generation using Google Gemini
- Professional client message generation
- Milestone-based invoice creation and management
- Mock wallet integration (UI/UX complete)
- Client payment page with shareable links
- Responsive design and modern UI

**🚧 In Development:**

- Backend API with PostgreSQL database
- Smart contract escrow implementation
- Live wallet integration (RainbowKit + wagmi)
- On-chain payment processing

## ✨ Key Features

### 🔐 Trustless Escrow (Planned)

- **Non-Custodial**: Smart contract holds funds, not a centralized party
- **Milestone-Based**: Pay and release in stages as work progresses
- **1% Platform Fee**: Industry-lowest fee automatically deducted on release
- **Instant Settlement**: Releases happen in seconds, not days

### 🤖 AI-Powered Automation ✅

- **Smart Invoice Generation**: Describe your project in natural language
- **Auto-Milestone Creation**: AI suggests optimal payment structure
- **Client Messaging**: Generate professional outreach emails
- **Structured Output**: JSON schema validation for consistent data

### 💎 MNEE Stablecoin Integration (Planned)

- **Price Stability**: Payments in MNEE ($1 = 1 MNEE)
- **Low Fees**: Ethereum gas costs only, no currency conversion
- **Global**: Send/receive anywhere in the world instantly
- **Transparent**: All transactions verifiable on-chain

### 🎨 Beautiful UX ✅

- **Modern Interface**: Sleek, animated design inspired by Linear/Stripe
- **Shareable Payment Links**: Send clients a direct payment URL
- **Mobile Responsive**: Works perfectly on any device
- **Intuitive Workflow**: Simple freelancer and client experiences

## 🏗️ Architecture

### Tech Stack

**Frontend** (React + TypeScript)

- **Framework**: Vite + React 19
- **Web3**: viem v2 (RainbowKit integration in progress)
- **State**: Component state in App.tsx (central state management)
- **Styling**: Inline utility classes (Tailwind-style)
- **AI**: Google Gemini API for invoice generation
- **Routing**: Simple hash-based routing

**Backend & Smart Contracts** (In Development)

- Backend API and database integration planned
- Smart contract escrow functionality planned
- Currently using simulated wallet connections and payment operations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Google Gemini API key (for AI features)

### Local Development

```bash
# Clone repository
git clone https://github.com/yourusername/PayFlow.git
cd PayFlow

# Install dependencies
npm install

# Configure environment variables
# Create .env.local in the root directory
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env.local

# Start development server
npm run dev
# Frontend running on http://localhost:3000
```

### Configuration

#### `.env.local`

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

## 📚 Documentation

### Architecture & Implementation
- **[CLAUDE.md](CLAUDE.md)** - Development guide for working with this codebase
- **[AI Architecture](docs/architecture/PAYFLOW_AI_ARCHITECTURE.md)** - AI-powered invoice generation architecture
- **[Backend Implementation](docs/architecture/BACKEND_IMPLEMENTATION.md)** - Backend API documentation
- **[Integration Status](docs/architecture/INTEGRATION_STATUS.md)** - Current integration status
- **[Setup Guide](docs/architecture/SETUP.md)** - Detailed setup instructions

### Deployment
- **[Deployment Guide](docs/deployment/DEPLOYMENT_GUIDE.md)** - Smart contract deployment
- **[Vercel Deployment](docs/deployment/VERCEL_DEPLOYMENT.md)** - Frontend deployment to Vercel
- **[Local Deployment](docs/deployment/LOCAL_DEPLOYMENT_GUIDE.md)** - Local deployment guide
- **[Mock MNEE Deployment](docs/deployment/MOCK_MNEE_DEPLOYMENT.md)** - Mock token deployment

### Hackathon
- **[Hackathon Assessment](docs/hackathon/HACKATHON_ASSESSMENT.md)** - Project roadmap & progress
- **[Devpost Submission](docs/hackathon/DEVPOST_SUBMISSION.md)** - Hackathon submission details
- **[Demo Script](docs/hackathon/DEMO_SCRIPT.md)** - Demo presentation script

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Build for production
npm run preview      # Preview production build
```

### Project Structure

- `/src/App.tsx` - Root component with routing and state management
- `/src/components/` - All UI components (freelancer & client views)
- `/src/services/geminiService.ts` - AI invoice generation service
- `/src/types.ts` - TypeScript type definitions
- `/CLAUDE.md` - Development guide and architecture overview

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

- **Demo Video**: https://youtu.be/EkadH7I7NbU

- **Contract (Sepolia)**: https://sepolia.etherscan.io/token/0x549e7CF3f5c9b63FCEc3F1a49F3A13583b584d2D?
- **GitHub**: https://github.com/yourusername/PayFlow

## 🙏 Acknowledgments

- **MNEE Team** - For creating a stable, accessible cryptocurrency
- **Ethereum Foundation** - For the robust blockchain infrastructure
- **Google** - For Gemini AI API
- **Alchemy** - For reliable RPC infrastructure
- **Neon** - For serverless PostgreSQL

---

<div align="center">

**Built with ❤️ for the MNEE-ETH Hackathon**

[⬆ Back to Top](#-payflow---ai-powered-freelance-escrow-platform)

</div>
