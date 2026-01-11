# PayFlow AI - Complete System Architecture

> **AI-Powered Invoice & Escrow Payment Platform using MNEE Stablecoin**

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Overview](#2-system-overview)
3. [Tech Stack](#3-tech-stack)
4. [High-Level Architecture](#4-high-level-architecture)
5. [User Types & Roles](#5-user-types--roles)
6. [Frontend Architecture](#6-frontend-architecture)
7. [Backend Architecture](#7-backend-architecture)
8. [Smart Contract Architecture](#8-smart-contract-architecture)
9. [Database Schema](#9-database-schema)
10. [API Endpoints](#10-api-endpoints)
11. [AI Integration](#11-ai-integration)
12. [Complete User Flows](#12-complete-user-flows)
13. [Blockchain Event Handling](#13-blockchain-event-handling)
14. [Security Considerations](#14-security-considerations)
15. [Deployment Strategy](#15-deployment-strategy)
16. [Project File Structure](#16-project-file-structure)
17. [Environment Variables](#17-environment-variables)
18. [Third-Party Integrations](#18-third-party-integrations)

---

## 1. Executive Summary

### What is PayFlow AI?

PayFlow AI is a decentralized invoice and escrow payment platform that enables freelancers to create AI-generated invoices and receive secure milestone-based payments using MNEE stablecoin on Ethereum.

### The Problem

- Freelancers get scammed (work delivered, no payment)
- Clients get scammed (payment sent, poor/no work delivered)
- Creating professional invoices is time-consuming
- Cross-border payments are slow, expensive, and unreliable
- No trust mechanism between unknown parties

### The Solution

- **AI-Generated Invoices**: Describe work in plain English → AI creates structured invoice with milestones
- **Smart Contract Escrow**: Client funds held securely until work is approved
- **MNEE Stablecoin**: Instant, borderless payments pegged to USD
- **Milestone-Based Releases**: Pay as you go, release funds as work progresses

### Key Features

| Feature | Description |
|---------|-------------|
| AI Invoice Generator | Natural language to structured invoice conversion |
| Milestone Escrow | Smart contract holds funds until approval |
| MNEE Integration | ERC-20 stablecoin payments on Ethereum |
| Shareable Payment Links | No account needed for clients to pay |
| Transaction Dashboard | Full visibility of earnings and escrow status |
| Auto-Release Option | Time-based automatic fund release |

---

## 2. System Overview

### Core Concept

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   FREELANCER                                              CLIENT            │
│   (Platform User)                                    (Link-Only User)       │
│                                                                             │
│   ┌─────────────┐                                    ┌─────────────┐       │
│   │ 1. Describe │                                    │ 4. Receives │       │
│   │    work to  │                                    │    payment  │       │
│   │    AI       │                                    │    link     │       │
│   └──────┬──────┘                                    └──────┬──────┘       │
│          │                                                  │              │
│          ▼                                                  ▼              │
│   ┌─────────────┐     ┌─────────────┐              ┌─────────────┐        │
│   │ 2. AI       │     │ 3. Share    │              │ 5. Pays     │        │
│   │    generates│────►│    payment  │─────────────►│    milestone│        │
│   │    invoice  │     │    link     │              │    to escrow│        │
│   └─────────────┘     └─────────────┘              └──────┬──────┘        │
│                                                           │               │
│                              ┌────────────────────────────┘               │
│                              │                                            │
│                              ▼                                            │
│                       ┌─────────────────────────────────────┐             │
│                       │      SMART CONTRACT ESCROW          │             │
│                       │                                     │             │
│                       │  • Holds MNEE until approval        │             │
│                       │  • Releases to freelancer on        │             │
│                       │    client approval                  │             │
│                       │  • Refunds if disputed              │             │
│                       └──────────────────┬──────────────────┘             │
│                                          │                                │
│          ┌───────────────────────────────┘                                │
│          │ Client approves                                                │
│          ▼                                                                │
│   ┌─────────────┐                                                         │
│   │ 6. Funds    │                                                         │
│   │    released │                                                         │
│   │    to wallet│                                                         │
│   └─────────────┘                                                         │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

### MNEE Stablecoin Details

| Property | Value |
|----------|-------|
| **Token Name** | MNEE |
| **Standard** | ERC-20 |
| **Network** | Ethereum Mainnet |
| **Contract Address** | `0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF` |
| **Decimals** | 18 |
| **Peg** | 1 MNEE = 1 USD |

---

## 3. Tech Stack

### Frontend

| Technology | Purpose | Version |
|------------|---------|---------|
| Next.js | React framework with App Router | 14.x |
| TypeScript | Type-safe JavaScript | 5.x |
| Tailwind CSS | Utility-first styling | 3.x |
| shadcn/ui | Pre-built UI components | Latest |
| wagmi | React hooks for Ethereum | 2.x |
| viem | TypeScript Ethereum library | 2.x |
| RainbowKit | Wallet connection UI | 2.x |
| React Query | Server state management | 5.x |
| Zustand | Client state management | 4.x |

### Backend

| Technology | Purpose | Version |
|------------|---------|---------|
| Next.js API Routes | Backend API | 14.x |
| Prisma | Database ORM | 5.x |
| Supabase | PostgreSQL + Auth | Latest |
| Anthropic Claude API | AI invoice generation | Latest |
| Ethers.js | Blockchain event listener | 6.x |

### Blockchain

| Technology | Purpose |
|------------|---------|
| Solidity | Smart contract language |
| Hardhat | Development & testing framework |
| OpenZeppelin | Security-audited contract libraries |
| Ethereum Mainnet | Production deployment |
| Sepolia Testnet | Development & testing |

### Infrastructure

| Service | Purpose |
|---------|---------|
| Vercel | Frontend hosting & serverless functions |
| Supabase | Database & authentication |
| Alchemy/Infura | Ethereum RPC provider |
| GitHub Actions | CI/CD pipeline |

---

## 4. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                    PAYFLOW AI ARCHITECTURE                              │
└─────────────────────────────────────────────────────────────────────────────────────────┘

     USERS                           FRONTEND                              SERVICES
     ─────                           ────────                              ────────

┌──────────────┐               ┌──────────────────────┐              ┌──────────────────┐
│              │               │                      │              │                  │
│  FREELANCER  │◄─────────────►│     Next.js App      │◄────────────►│   Claude API     │
│              │               │                      │              │   (AI Invoice)   │
│  • Dashboard │               │  • Pages/Routes      │              │                  │
│  • Create    │               │  • Components        │              └──────────────────┘
│    Invoice   │               │  • Hooks             │
│  • Manage    │               │  • State             │              ┌──────────────────┐
│    Payments  │               │                      │              │                  │
│              │               │  Hosted on Vercel    │◄────────────►│   Supabase       │
└──────────────┘               │                      │              │   (PostgreSQL)   │
                               └───────────┬──────────┘              │                  │
                                           │                         │  • Users         │
┌──────────────┐                           │                         │  • Invoices      │
│              │                           │                         │  • Milestones    │
│    CLIENT    │◄──────────────────────────┤                         │  • Transactions  │
│              │                           │                         │                  │
│  • View      │                           │                         └──────────────────┘
│    Invoice   │                           │
│  • Pay       │                           │                         ┌──────────────────┐
│  • Approve   │                           │                         │                  │
│              │                           │                         │   Alchemy RPC    │
└──────────────┘                           │                         │   (Ethereum)     │
                                           │                         │                  │
                                           ▼                         └────────┬─────────┘
                               ┌──────────────────────┐                       │
                               │                      │                       │
                               │   API Routes         │                       │
                               │   (Next.js)          │                       │
                               │                      │                       │
                               │  • /api/invoices     │                       │
                               │  • /api/ai/generate  │                       │
                               │  • /api/webhooks     │                       │
                               │                      │                       │
                               └───────────┬──────────┘                       │
                                           │                                  │
                                           │                                  │
     WALLETS                               │                                  │
     ───────                               ▼                                  ▼

┌──────────────┐               ┌──────────────────────────────────────────────────────┐
│              │               │                                                      │
│   MetaMask   │◄─────────────►│                 ETHEREUM BLOCKCHAIN                  │
│   (or other) │               │                                                      │
│              │               │  ┌────────────────────┐    ┌────────────────────┐   │
│  • Signs TX  │               │  │                    │    │                    │   │
│  • Holds     │               │  │   MNEE Token       │    │  PayFlow Escrow    │   │
│    MNEE      │               │  │   (ERC-20)         │    │  Contract          │   │
│              │               │  │                    │    │                    │   │
└──────────────┘               │  │  0x8cced...cF      │    │  • depositMilestone│   │
                               │  │                    │    │  • releaseMilestone│   │
                               │  └────────────────────┘    │  • refundMilestone │   │
                               │                            │                    │   │
                               │                            └────────────────────┘   │
                               │                                                      │
                               └──────────────────────────────────────────────────────┘
```

---

## 5. User Types & Roles

### User Type Comparison

| Aspect | Freelancer | Client |
|--------|------------|--------|
| **Platform Access** | Full dashboard access | Payment link only |
| **Account Required** | Yes (wallet-based) | No |
| **Actions** | Create invoices, manage payments, view dashboard | View invoice, pay, approve releases |
| **Authentication** | Wallet connection (SIWE) | Wallet connection (for payment only) |
| **Data Stored** | Profile, invoices, settings | Wallet address only (linked to payments) |

### Freelancer Capabilities

```
FREELANCER USER
│
├── 📊 Dashboard
│   ├── View total earnings
│   ├── View pending invoices
│   ├── View funds in escrow
│   └── View recent activity
│
├── ➕ Create Invoice
│   ├── AI-powered generation
│   ├── Manual creation
│   └── Edit/preview before sending
│
├── 📄 Manage Invoices
│   ├── View all invoices
│   ├── Filter by status
│   ├── Copy payment links
│   └── View invoice details
│
├── 💰 Payments
│   ├── View escrow balance
│   ├── View transaction history
│   ├── Request milestone release
│   └── Export CSV
│
└── ⚙️ Settings
    ├── Display name
    ├── Connected wallet
    ├── Notification preferences
    └── Auto-approval settings
```

### Client Capabilities

```
CLIENT USER (No Account)
│
├── 🔗 Payment Link Access
│   ├── View invoice details
│   ├── View milestone breakdown
│   └── See freelancer info
│
├── 💳 Payment Actions
│   ├── Connect wallet
│   ├── Approve MNEE spending
│   └── Pay milestone to escrow
│
└── ✅ Approval Actions
    ├── Review completed work
    ├── Approve milestone release
    └── Request changes (dispute)
```

---

## 6. Frontend Architecture

### Page Structure

```
app/
├── (public)/                    # Public routes (no auth required)
│   ├── page.tsx                 # Landing page
│   ├── pay/
│   │   └── [invoiceId]/
│   │       └── page.tsx         # Client payment page
│   └── approve/
│       └── [invoiceId]/
│           └── [milestoneId]/
│               └── page.tsx     # Client approval page
│
├── (dashboard)/                 # Protected routes (auth required)
│   ├── layout.tsx               # Dashboard layout with sidebar
│   ├── dashboard/
│   │   └── page.tsx             # Main dashboard
│   ├── invoices/
│   │   ├── page.tsx             # Invoice list
│   │   └── [id]/
│   │       └── page.tsx         # Invoice detail
│   ├── create/
│   │   └── page.tsx             # Create invoice (AI)
│   ├── payments/
│   │   └── page.tsx             # Payments & escrow
│   └── settings/
│       └── page.tsx             # User settings
│
├── api/                         # API routes
│   ├── invoices/
│   ├── ai/
│   ├── webhooks/
│   └── user/
│
└── layout.tsx                   # Root layout
```

### Component Architecture

```
components/
│
├── layout/
│   ├── Sidebar.tsx              # Dashboard sidebar navigation
│   ├── Header.tsx               # Top header with wallet info
│   ├── Footer.tsx               # Public page footer
│   └── DashboardLayout.tsx      # Dashboard wrapper
│
├── ui/                          # shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── table.tsx
│   ├── badge.tsx
│   ├── dialog.tsx
│   └── ...
│
├── invoice/
│   ├── InvoiceCard.tsx          # Invoice list item
│   ├── InvoiceDetail.tsx        # Full invoice view
│   ├── InvoicePreview.tsx       # AI-generated preview
│   ├── MilestoneList.tsx        # Milestone breakdown
│   └── MilestoneItem.tsx        # Single milestone row
│
├── payment/
│   ├── PaymentCard.tsx          # Payment page invoice view
│   ├── MilestonePayButton.tsx   # Pay milestone button
│   ├── ApprovalCard.tsx         # Approval request view
│   ├── TransactionHistory.tsx   # Transaction list
│   └── EscrowStatus.tsx         # Escrow balance display
│
├── ai/
│   ├── AIInvoiceGenerator.tsx   # Natural language input
│   ├── GeneratingLoader.tsx     # AI processing animation
│   └── AIMessageWriter.tsx      # AI message generator
│
├── wallet/
│   ├── ConnectButton.tsx        # Wallet connection
│   ├── WalletStatus.tsx         # Connected wallet display
│   └── NetworkStatus.tsx        # Ethereum network indicator
│
├── dashboard/
│   ├── StatsCards.tsx           # Overview statistics
│   ├── RecentActivity.tsx       # Activity feed
│   └── QuickActions.tsx         # Quick action buttons
│
└── common/
    ├── LoadingSpinner.tsx
    ├── EmptyState.tsx
    ├── ErrorMessage.tsx
    └── CopyButton.tsx
```

### State Management

```typescript
// stores/useInvoiceStore.ts (Zustand)
interface InvoiceStore {
  // State
  invoices: Invoice[];
  currentInvoice: Invoice | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchInvoices: () => Promise<void>;
  fetchInvoiceById: (id: string) => Promise<void>;
  createInvoice: (data: CreateInvoiceDTO) => Promise<Invoice>;
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => void;
}

// stores/usePaymentStore.ts (Zustand)
interface PaymentStore {
  // State
  escrowBalance: bigint;
  totalReleased: bigint;
  transactions: Transaction[];
  
  // Actions
  fetchEscrowBalance: (wallet: string) => Promise<void>;
  fetchTransactions: (wallet: string) => Promise<void>;
}

// stores/useUserStore.ts (Zustand)
interface UserStore {
  // State
  user: User | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (wallet: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: UpdateProfileDTO) => Promise<void>;
}
```

### Web3 Integration (wagmi)

```typescript
// config/wagmi.ts
import { createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { 
  metaMaskWallet, 
  coinbaseWallet, 
  walletConnectWallet 
} from '@rainbow-me/rainbowkit/wallets';

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [metaMaskWallet, coinbaseWallet, walletConnectWallet],
  },
]);

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors,
  transports: {
    [mainnet.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_URL),
    [sepolia.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_URL),
  },
});

// hooks/usePayflowContract.ts
import { useReadContract, useWriteContract } from 'wagmi';
import { PAYFLOW_ESCROW_ABI, PAYFLOW_ESCROW_ADDRESS } from '@/contracts';

export function useDepositMilestone() {
  const { writeContract, isPending, isSuccess, error } = useWriteContract();
  
  const deposit = async (invoiceId: string, milestoneIndex: number, amount: bigint) => {
    writeContract({
      address: PAYFLOW_ESCROW_ADDRESS,
      abi: PAYFLOW_ESCROW_ABI,
      functionName: 'depositMilestone',
      args: [invoiceId, milestoneIndex, amount],
    });
  };
  
  return { deposit, isPending, isSuccess, error };
}

export function useReleaseMilestone() {
  const { writeContract, isPending, isSuccess, error } = useWriteContract();
  
  const release = async (invoiceId: string, milestoneIndex: number) => {
    writeContract({
      address: PAYFLOW_ESCROW_ADDRESS,
      abi: PAYFLOW_ESCROW_ABI,
      functionName: 'releaseMilestone',
      args: [invoiceId, milestoneIndex],
    });
  };
  
  return { release, isPending, isSuccess, error };
}

export function useMilestoneStatus(invoiceId: string, milestoneIndex: number) {
  return useReadContract({
    address: PAYFLOW_ESCROW_ADDRESS,
    abi: PAYFLOW_ESCROW_ABI,
    functionName: 'getMilestoneStatus',
    args: [invoiceId, milestoneIndex],
  });
}
```

---

## 7. Backend Architecture

### API Route Structure

```
app/api/
│
├── invoices/
│   ├── route.ts                 # GET all, POST create
│   └── [id]/
│       ├── route.ts             # GET one, PATCH update, DELETE
│       └── milestones/
│           └── [index]/
│               └── route.ts     # PATCH milestone status
│
├── ai/
│   └── generate/
│       └── route.ts             # POST generate invoice from text
│
├── user/
│   ├── route.ts                 # GET profile, PATCH update
│   └── auth/
│       └── route.ts             # POST verify wallet signature
│
├── payments/
│   ├── route.ts                 # GET transactions
│   └── escrow/
│       └── route.ts             # GET escrow balance
│
└── webhooks/
    └── blockchain/
        └── route.ts             # POST blockchain events
```

### API Route Examples

```typescript
// app/api/invoices/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

// GET /api/invoices - Get all invoices for user
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const invoices = await prisma.invoice.findMany({
      where: { freelancerId: user.id },
      include: { milestones: true },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(invoices);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST /api/invoices - Create new invoice
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { title, description, clientEmail, milestones, totalAmount } = body;
    
    // Generate unique invoice ID
    const invoiceId = generateInvoiceId();
    
    // Create invoice with milestones
    const invoice = await prisma.invoice.create({
      data: {
        id: invoiceId,
        title,
        description,
        clientEmail,
        totalAmount,
        freelancerId: user.id,
        status: 'PENDING',
        paymentLink: `${process.env.NEXT_PUBLIC_APP_URL}/pay/${invoiceId}`,
        milestones: {
          create: milestones.map((m: any, index: number) => ({
            index,
            title: m.title,
            description: m.description,
            amount: m.amount,
            percentage: m.percentage,
            status: 'EMPTY',
          })),
        },
      },
      include: { milestones: true },
    });
    
    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}


// app/api/ai/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

export async function POST(request: NextRequest) {
  try {
    const { description } = await request.json();
    
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are an invoice generator AI. Based on the following work description, generate a structured invoice in JSON format.

Work Description: "${description}"

Generate a JSON response with this exact structure:
{
  "title": "Brief project title",
  "description": "Detailed description of the work",
  "clientName": "Client name if mentioned, otherwise null",
  "totalAmount": number,
  "milestones": [
    {
      "title": "Milestone name",
      "description": "What is delivered",
      "amount": number,
      "percentage": number
    }
  ],
  "suggestedMessage": "Professional message to send to client"
}

Rules:
- If no milestone split is specified, suggest a reasonable split (e.g., 30/40/30 or 50/50)
- Amounts should be in whole numbers (MNEE)
- Percentages should add up to 100
- Keep milestone titles concise
- Generate 2-4 milestones typically

Respond ONLY with valid JSON, no markdown or explanation.`
        }
      ],
    });
    
    // Parse AI response
    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }
    
    const invoiceData = JSON.parse(content.text);
    
    return NextResponse.json(invoiceData);
  } catch (error) {
    console.error('AI generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate invoice' },
      { status: 500 }
    );
  }
}
```

### Background Services

```typescript
// services/blockchainListener.ts
import { ethers } from 'ethers';
import { prisma } from '@/lib/prisma';
import { PAYFLOW_ESCROW_ABI, PAYFLOW_ESCROW_ADDRESS } from '@/contracts';

export class BlockchainListener {
  private provider: ethers.Provider;
  private contract: ethers.Contract;
  
  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_RPC_URL);
    this.contract = new ethers.Contract(
      PAYFLOW_ESCROW_ADDRESS,
      PAYFLOW_ESCROW_ABI,
      this.provider
    );
  }
  
  async startListening() {
    // Listen for MilestoneDeposited events
    this.contract.on('MilestoneDeposited', async (
      invoiceId: string,
      milestoneIndex: number,
      amount: bigint,
      payer: string,
      event: ethers.Log
    ) => {
      console.log(`Milestone deposited: ${invoiceId} - ${milestoneIndex}`);
      
      await prisma.milestone.update({
        where: {
          invoiceId_index: {
            invoiceId,
            index: milestoneIndex,
          },
        },
        data: {
          status: 'PAID',
          paidAt: new Date(),
          depositTxHash: event.transactionHash,
        },
      });
      
      // Update invoice status if first payment
      await prisma.invoice.update({
        where: { id: invoiceId },
        data: { status: 'ACTIVE' },
      });
      
      // Create transaction record
      await prisma.transaction.create({
        data: {
          invoiceId,
          milestoneIndex,
          type: 'DEPOSIT',
          amount: amount.toString(),
          fromWallet: payer,
          toWallet: PAYFLOW_ESCROW_ADDRESS,
          txHash: event.transactionHash,
        },
      });
    });
    
    // Listen for MilestoneReleased events
    this.contract.on('MilestoneReleased', async (
      invoiceId: string,
      milestoneIndex: number,
      amount: bigint,
      recipient: string,
      event: ethers.Log
    ) => {
      console.log(`Milestone released: ${invoiceId} - ${milestoneIndex}`);
      
      await prisma.milestone.update({
        where: {
          invoiceId_index: {
            invoiceId,
            index: milestoneIndex,
          },
        },
        data: {
          status: 'RELEASED',
          releasedAt: new Date(),
          releaseTxHash: event.transactionHash,
        },
      });
      
      // Check if all milestones released → mark invoice complete
      const invoice = await prisma.invoice.findUnique({
        where: { id: invoiceId },
        include: { milestones: true },
      });
      
      const allReleased = invoice?.milestones.every(m => m.status === 'RELEASED');
      if (allReleased) {
        await prisma.invoice.update({
          where: { id: invoiceId },
          data: { status: 'COMPLETED' },
        });
      }
      
      // Create transaction record
      await prisma.transaction.create({
        data: {
          invoiceId,
          milestoneIndex,
          type: 'RELEASE',
          amount: amount.toString(),
          fromWallet: PAYFLOW_ESCROW_ADDRESS,
          toWallet: recipient,
          txHash: event.transactionHash,
        },
      });
    });
    
    console.log('Blockchain listener started');
  }
}
```

---

## 8. Smart Contract Architecture

### Contract Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PAYFLOW ESCROW CONTRACT                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  STATE VARIABLES                                                            │
│  ───────────────                                                            │
│  • mneeToken: IERC20 (MNEE token contract reference)                        │
│  • invoices: mapping(string => Invoice)                                     │
│  • platformFeePercent: uint256 (e.g., 1%)                                   │
│  • platformWallet: address                                                  │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  STRUCTS                                                                    │
│  ───────                                                                    │
│                                                                             │
│  Invoice {                                                                  │
│    string id                   // Unique identifier                         │
│    address freelancer          // Recipient of released funds               │
│    address client              // Payer (set on first deposit)              │
│    Milestone[] milestones      // Array of milestones                       │
│    bool exists                 // Existence flag                            │
│  }                                                                          │
│                                                                             │
│  Milestone {                                                                │
│    uint256 amount              // MNEE amount for this milestone            │
│    MilestoneStatus status      // EMPTY, DEPOSITED, RELEASED, REFUNDED      │
│    uint256 depositedAt         // Timestamp of deposit                      │
│    uint256 releasedAt          // Timestamp of release                      │
│  }                                                                          │
│                                                                             │
│  enum MilestoneStatus { EMPTY, DEPOSITED, RELEASED, REFUNDED }              │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  FUNCTIONS                                                                  │
│  ─────────                                                                  │
│                                                                             │
│  📝 createInvoice(id, freelancer, milestoneAmounts[])                       │
│     → Creates invoice with milestones                                       │
│     → Only callable by platform or freelancer                               │
│                                                                             │
│  📥 depositMilestone(invoiceId, milestoneIndex)                             │
│     → Client deposits MNEE to escrow                                        │
│     → Requires MNEE approval first                                          │
│     → Emits MilestoneDeposited event                                        │
│                                                                             │
│  📤 releaseMilestone(invoiceId, milestoneIndex)                             │
│     → Client approves, funds sent to freelancer                             │
│     → Only callable by client                                               │
│     → Emits MilestoneReleased event                                         │
│                                                                             │
│  🔙 refundMilestone(invoiceId, milestoneIndex)                              │
│     → Returns funds to client (dispute resolution)                          │
│     → Only callable by platform admin                                       │
│     → Emits MilestoneRefunded event                                         │
│                                                                             │
│  📊 getInvoice(invoiceId) → Invoice                                         │
│  📊 getMilestoneStatus(invoiceId, index) → MilestoneStatus                  │
│  📊 getEscrowBalance(freelancer) → uint256                                  │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  EVENTS                                                                     │
│  ──────                                                                     │
│                                                                             │
│  InvoiceCreated(invoiceId, freelancer, totalAmount)                         │
│  MilestoneDeposited(invoiceId, milestoneIndex, amount, payer)               │
│  MilestoneReleased(invoiceId, milestoneIndex, amount, recipient)            │
│  MilestoneRefunded(invoiceId, milestoneIndex, amount, recipient)            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Solidity Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PayFlowEscrow is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // ============ State Variables ============
    
    IERC20 public immutable mneeToken;
    uint256 public platformFeePercent = 100; // 1% = 100 basis points
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
        
        Milestone storage m = invoices[_invoiceId].milestones[_index];
        return (m.amount, m.status, m.depositedAt, m.releasedAt);
    }
    
    function getMilestoneStatus(string calldata _invoiceId, uint256 _index)
        external
        view
        returns (MilestoneStatus)
    {
        require(invoices[_invoiceId].exists, "Invoice does not exist");
        require(_index < invoices[_invoiceId].milestones.length, "Invalid index");
        
        return invoices[_invoiceId].milestones[_index].status;
    }
    
    // ============ Admin Functions ============
    
    function setPlatformFee(uint256 _feePercent) external onlyOwner {
        require(_feePercent <= 500, "Fee cannot exceed 5%");
        platformFeePercent = _feePercent;
    }
    
    function setPlatformWallet(address _wallet) external onlyOwner {
        require(_wallet != address(0), "Invalid wallet");
        platformWallet = _wallet;
    }
}
```

### Contract Interaction Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CONTRACT INTERACTION FLOW                            │
└─────────────────────────────────────────────────────────────────────────────┘

STEP 1: INVOICE CREATION (Backend calls)
─────────────────────────────────────────

    Backend                          Contract
       │                                │
       │  createInvoice(                │
       │    "inv-042",                  │
       │    0x1a2b... (freelancer),     │
       │    [240, 320, 240] (amounts)   │
       │  )                             │
       │ ──────────────────────────────►│
       │                                │
       │                                │ Creates invoice struct
       │                                │ Creates 3 milestones (EMPTY)
       │                                │
       │◄─────────────────────────────  │
       │    emit InvoiceCreated()       │


STEP 2: CLIENT PAYMENT (Client calls via MetaMask)
──────────────────────────────────────────────────

    Client                    MNEE Token              Escrow Contract
       │                          │                         │
       │  approve(                │                         │
       │    escrowAddress,        │                         │
       │    240 MNEE              │                         │
       │  )                       │                         │
       │ ────────────────────────►│                         │
       │                          │ Records allowance       │
       │◄─────────────────────────│                         │
       │                          │                         │
       │  depositMilestone(       │                         │
       │    "inv-042",            │                         │
       │    0 (milestone index)   │                         │
       │  )                       │                         │
       │ ─────────────────────────────────────────────────►│
       │                          │                         │
       │                          │  transferFrom(          │
       │                          │◄────────────────────────│
       │                          │    client, contract,    │
       │                          │    240)                 │
       │                          │────────────────────────►│
       │                          │                         │
       │                          │                         │ Updates milestone:
       │                          │                         │   status = DEPOSITED
       │                          │                         │   depositedAt = now
       │                          │                         │
       │◄─────────────────────────────────────────────────  │
       │    emit MilestoneDeposited()                       │


STEP 3: CLIENT RELEASES (Client approves work)
──────────────────────────────────────────────

    Client                              Escrow Contract              Freelancer
       │                                      │                          │
       │  releaseMilestone(                   │                          │
       │    "inv-042",                        │                          │
       │    0                                 │                          │
       │  )                                   │                          │
       │ ────────────────────────────────────►│                          │
       │                                      │                          │
       │                                      │ Updates milestone:       │
       │                                      │   status = RELEASED      │
       │                                      │                          │
       │                                      │ transfer(freelancer,     │
       │                                      │   237.6 MNEE)            │
       │                                      │ ────────────────────────►│
       │                                      │                          │
       │                                      │ transfer(platform,       │
       │                                      │   2.4 MNEE) // 1% fee    │
       │                                      │                          │
       │◄─────────────────────────────────────│                          │
       │    emit MilestoneReleased()          │                          │
```

---

## 9. Database Schema

### Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATABASE SCHEMA                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│     users       │         │    invoices     │         │   milestones    │
├─────────────────┤         ├─────────────────┤         ├─────────────────┤
│ id          PK  │◄────────│ freelancer_id FK│         │ id          PK  │
│ wallet_address  │    1:N  │ id          PK  │◄────────│ invoice_id  FK  │
│ display_name    │         │ client_wallet   │    1:N  │ index           │
│ email           │         │ client_email    │         │ title           │
│ created_at      │         │ title           │         │ description     │
│ updated_at      │         │ description     │         │ amount          │
└─────────────────┘         │ total_amount    │         │ percentage      │
                            │ status          │         │ status          │
                            │ payment_link    │         │ paid_at         │
                            │ created_at      │         │ released_at     │
                            │ updated_at      │         │ deposit_tx_hash │
                            └────────┬────────┘         │ release_tx_hash │
                                     │                  └─────────────────┘
                                     │
                                     │ 1:N
                                     ▼
                            ┌─────────────────┐
                            │  transactions   │
                            ├─────────────────┤
                            │ id          PK  │
                            │ invoice_id  FK  │
                            │ milestone_idx   │
                            │ type            │
                            │ amount          │
                            │ from_wallet     │
                            │ to_wallet       │
                            │ tx_hash         │
                            │ created_at      │
                            └─────────────────┘
```

### Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============ ENUMS ============

enum InvoiceStatus {
  PENDING     // Created, not paid yet
  ACTIVE      // At least one milestone paid
  COMPLETED   // All milestones released
  CANCELLED   // Cancelled by freelancer
}

enum MilestoneStatus {
  EMPTY       // Not paid
  PAID        // Deposited in escrow
  RELEASED    // Released to freelancer
  REFUNDED    // Refunded to client
}

enum TransactionType {
  DEPOSIT     // Client → Escrow
  RELEASE     // Escrow → Freelancer
  REFUND      // Escrow → Client
}

// ============ MODELS ============

model User {
  id            String    @id @default(uuid())
  walletAddress String    @unique @map("wallet_address")
  displayName   String?   @map("display_name")
  email         String?
  
  // Settings
  autoApproval  Boolean   @default(false) @map("auto_approval")
  emailNotify   Boolean   @default(true)  @map("email_notify")
  
  // Relations
  invoices      Invoice[]
  
  // Timestamps
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt      @map("updated_at")
  
  @@map("users")
}

model Invoice {
  id            String        @id // Custom format: inv-YYYY-XXX
  
  // Relationships
  freelancerId  String        @map("freelancer_id")
  freelancer    User          @relation(fields: [freelancerId], references: [id])
  
  // Client info (filled when client pays)
  clientWallet  String?       @map("client_wallet")
  clientEmail   String?       @map("client_email")
  
  // Invoice details
  title         String
  description   String        @db.Text
  totalAmount   Decimal       @map("total_amount") @db.Decimal(18, 2)
  category      String?       // design, development, consulting, etc.
  
  // Status
  status        InvoiceStatus @default(PENDING)
  
  // Payment link
  paymentLink   String        @unique @map("payment_link")
  
  // Relations
  milestones    Milestone[]
  transactions  Transaction[]
  
  // Timestamps
  createdAt     DateTime      @default(now()) @map("created_at")
  updatedAt     DateTime      @updatedAt      @map("updated_at")
  
  @@map("invoices")
}

model Milestone {
  id            String          @id @default(uuid())
  
  // Parent invoice
  invoiceId     String          @map("invoice_id")
  invoice       Invoice         @relation(fields: [invoiceId], references: [id], onDelete: Cascade)
  
  // Milestone details
  index         Int             // 0, 1, 2, etc.
  title         String
  description   String?
  amount        Decimal         @db.Decimal(18, 2)
  percentage    Int             // 0-100
  
  // Status
  status        MilestoneStatus @default(EMPTY)
  
  // Payment tracking
  paidAt        DateTime?       @map("paid_at")
  releasedAt    DateTime?       @map("released_at")
  depositTxHash String?         @map("deposit_tx_hash")
  releaseTxHash String?         @map("release_tx_hash")
  
  // Timestamps
  createdAt     DateTime        @default(now()) @map("created_at")
  updatedAt     DateTime        @updatedAt      @map("updated_at")
  
  // Unique constraint for invoice + index
  @@unique([invoiceId, index])
  @@map("milestones")
}

model Transaction {
  id            String          @id @default(uuid())
  
  // Parent invoice
  invoiceId     String          @map("invoice_id")
  invoice       Invoice         @relation(fields: [invoiceId], references: [id], onDelete: Cascade)
  
  // Milestone reference
  milestoneIdx  Int             @map("milestone_index")
  
  // Transaction details
  type          TransactionType
  amount        Decimal         @db.Decimal(18, 2)
  
  // Wallet addresses
  fromWallet    String          @map("from_wallet")
  toWallet      String          @map("to_wallet")
  
  // Blockchain reference
  txHash        String          @unique @map("tx_hash")
  
  // Timestamps
  createdAt     DateTime        @default(now()) @map("created_at")
  
  @@map("transactions")
}
```

---

## 10. API Endpoints

### Complete API Reference

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API ENDPOINTS                                  │
└─────────────────────────────────────────────────────────────────────────────┘

AUTHENTICATION
──────────────

POST   /api/auth/verify
       Body: { message, signature }
       Response: { user, token }
       Description: Verify wallet signature (SIWE)

POST   /api/auth/logout
       Response: { success }
       Description: Invalidate session


USER MANAGEMENT
───────────────

GET    /api/user
       Auth: Required
       Response: { user }
       Description: Get current user profile

PATCH  /api/user
       Auth: Required
       Body: { displayName?, email?, autoApproval?, emailNotify? }
       Response: { user }
       Description: Update user profile


INVOICES
────────

GET    /api/invoices
       Auth: Required
       Query: { status?, page?, limit? }
       Response: { invoices[], total, page, limit }
       Description: Get all invoices for authenticated user

POST   /api/invoices
       Auth: Required
       Body: { title, description, clientEmail?, totalAmount, milestones[] }
       Response: { invoice }
       Description: Create new invoice

GET    /api/invoices/:id
       Auth: Required (owner) or Public (via payment link)
       Response: { invoice, milestones[] }
       Description: Get invoice details

PATCH  /api/invoices/:id
       Auth: Required (owner only)
       Body: { title?, description?, status? }
       Response: { invoice }
       Description: Update invoice

DELETE /api/invoices/:id
       Auth: Required (owner only)
       Response: { success }
       Description: Cancel/delete invoice (only if PENDING)


MILESTONES
──────────

PATCH  /api/invoices/:id/milestones/:index
       Auth: System only (blockchain events)
       Body: { status, txHash?, paidAt?, releasedAt? }
       Response: { milestone }
       Description: Update milestone status

POST   /api/invoices/:id/milestones/:index/request-release
       Auth: Required (freelancer)
       Body: { message? }
       Response: { success }
       Description: Notify client to approve release


AI GENERATION
─────────────

POST   /api/ai/generate
       Auth: Required
       Body: { description }
       Response: { title, description, totalAmount, milestones[], suggestedMessage }
       Description: Generate invoice from natural language

POST   /api/ai/message
       Auth: Required
       Body: { invoiceId, type: 'payment_request' | 'reminder' | 'thank_you' }
       Response: { message }
       Description: Generate professional message


PAYMENTS
────────

GET    /api/payments
       Auth: Required
       Query: { page?, limit? }
       Response: { transactions[], total }
       Description: Get transaction history

GET    /api/payments/escrow
       Auth: Required
       Response: { balance, pending }
       Description: Get escrow balance summary

GET    /api/payments/stats
       Auth: Required
       Query: { period?: 'week' | 'month' | 'year' }
       Response: { totalEarned, pendingInvoices, inEscrow, completedThisMonth }
       Description: Get payment statistics


PUBLIC (No Auth)
────────────────

GET    /api/public/invoice/:id
       Response: { invoice, milestones[], freelancer }
       Description: Get invoice for payment page (public)

POST   /api/public/invoice/:id/register-client
       Body: { walletAddress }
       Response: { success }
       Description: Register client wallet on first payment


WEBHOOKS
────────

POST   /api/webhooks/blockchain
       Auth: Webhook secret
       Body: { event, data }
       Description: Handle blockchain events from listener service
```

### Request/Response Examples

```typescript
// POST /api/ai/generate
// Request
{
  "description": "I'm designing a logo for Ahmed's tech startup CloudBase. The project includes main logo, color palette, and business card design. Total cost is $800. 30% upfront, 40% after draft, 30% on final."
}

// Response
{
  "title": "Logo & Brand Identity Design",
  "description": "Complete brand identity package for CloudBase tech startup including:\n- Main logo design (multiple concepts)\n- Color palette development\n- Business card design",
  "clientName": "Ahmed",
  "totalAmount": 800,
  "milestones": [
    {
      "title": "Upfront Payment",
      "description": "Initial deposit to begin work",
      "amount": 240,
      "percentage": 30
    },
    {
      "title": "First Draft Delivery",
      "description": "Logo concepts and color palette for review",
      "amount": 320,
      "percentage": 40
    },
    {
      "title": "Final Delivery",
      "description": "Final logo files and business card design",
      "amount": 240,
      "percentage": 30
    }
  ],
  "suggestedMessage": "Hi Ahmed,\n\nI've prepared the invoice for the CloudBase brand identity project. The total is $800, split into three milestones for your convenience.\n\nYour payment is protected by smart contract escrow - funds are only released when you approve each milestone.\n\nLooking forward to creating something great for CloudBase!\n\nBest regards"
}


// POST /api/invoices
// Request
{
  "title": "Logo & Brand Identity Design",
  "description": "Complete brand identity package...",
  "clientEmail": "ahmed@cloudbase.io",
  "totalAmount": 800,
  "milestones": [
    { "title": "Upfront Payment", "amount": 240, "percentage": 30 },
    { "title": "First Draft Delivery", "amount": 320, "percentage": 40 },
    { "title": "Final Delivery", "amount": 240, "percentage": 30 }
  ]
}

// Response
{
  "id": "inv-2026-042",
  "title": "Logo & Brand Identity Design",
  "description": "Complete brand identity package...",
  "clientEmail": "ahmed@cloudbase.io",
  "totalAmount": "800.00",
  "status": "PENDING",
  "paymentLink": "https://payflow.ai/pay/inv-2026-042",
  "createdAt": "2026-01-06T10:30:00Z",
  "milestones": [
    {
      "id": "ms-001",
      "index": 0,
      "title": "Upfront Payment",
      "amount": "240.00",
      "percentage": 30,
      "status": "EMPTY"
    },
    {
      "id": "ms-002",
      "index": 1,
      "title": "First Draft Delivery",
      "amount": "320.00",
      "percentage": 40,
      "status": "EMPTY"
    },
    {
      "id": "ms-003",
      "index": 2,
      "title": "Final Delivery",
      "amount": "240.00",
      "percentage": 30,
      "status": "EMPTY"
    }
  ]
}


// GET /api/payments/stats
// Response
{
  "totalEarned": "1490.00",
  "pendingInvoices": 2,
  "inEscrow": "360.00",
  "completedThisMonth": 3,
  "percentChange": 12.5
}
```

---

## 11. AI Integration

### AI Prompt Engineering

```typescript
// lib/ai/prompts.ts

export const INVOICE_GENERATION_PROMPT = `You are PayFlow AI, an intelligent invoice generator for freelancers.

Your task is to convert natural language work descriptions into structured invoice data.

RULES:
1. Extract or infer: project title, description, client name, total amount, milestone breakdown
2. If no milestone split is specified, suggest a reasonable split based on project type:
   - Small projects (<$500): 50/50 or single milestone
   - Medium projects ($500-$2000): 30/40/30 or 25/50/25
   - Large projects (>$2000): 20/30/30/20 or similar
3. Milestone titles should be action-oriented (e.g., "Upfront Payment", "Design Draft", "Final Delivery")
4. Generate a professional client message
5. Amounts must be whole numbers (MNEE stablecoin)
6. Percentages must sum to exactly 100
7. Maximum 5 milestones

OUTPUT FORMAT (JSON only, no markdown):
{
  "title": "string - Brief, professional title",
  "description": "string - Detailed scope of work",
  "clientName": "string | null",
  "totalAmount": number,
  "milestones": [
    {
      "title": "string",
      "description": "string",
      "amount": number,
      "percentage": number
    }
  ],
  "suggestedMessage": "string - Professional message to send to client",
  "category": "design | development | writing | consulting | marketing | other"
}`;

export const MESSAGE_GENERATION_PROMPTS = {
  payment_request: `Generate a professional, friendly payment request message for an invoice.
Include: greeting, brief project reference, payment link mention, escrow protection benefit.
Keep it concise (3-4 sentences).`,

  reminder: `Generate a polite payment reminder message.
Include: gentle reminder tone, invoice reference, offer to answer questions.
Keep it friendly and non-pushy.`,

  thank_you: `Generate a thank you message for payment received.
Include: gratitude, confirmation of receipt, next steps.
Keep it warm and professional.`,

  release_request: `Generate a milestone completion notification.
Include: what was delivered, request for approval, mention of escrow release.
Keep it professional.`,
};
```

### AI Service Implementation

```typescript
// services/aiService.ts

import Anthropic from '@anthropic-ai/sdk';
import { INVOICE_GENERATION_PROMPT, MESSAGE_GENERATION_PROMPTS } from '@/lib/ai/prompts';

const anthropic = new Anthropic();

interface GeneratedInvoice {
  title: string;
  description: string;
  clientName: string | null;
  totalAmount: number;
  milestones: {
    title: string;
    description: string;
    amount: number;
    percentage: number;
  }[];
  suggestedMessage: string;
  category: string;
}

export async function generateInvoice(description: string): Promise<GeneratedInvoice> {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: INVOICE_GENERATION_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Generate an invoice from this description:\n\n"${description}"`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type');
  }

  // Parse and validate response
  const invoice = JSON.parse(content.text) as GeneratedInvoice;
  
  // Validation
  if (!invoice.title || !invoice.totalAmount || !invoice.milestones?.length) {
    throw new Error('Invalid invoice structure');
  }
  
  const totalPercentage = invoice.milestones.reduce((sum, m) => sum + m.percentage, 0);
  if (totalPercentage !== 100) {
    throw new Error('Milestone percentages must sum to 100');
  }
  
  const totalMilestoneAmount = invoice.milestones.reduce((sum, m) => sum + m.amount, 0);
  if (totalMilestoneAmount !== invoice.totalAmount) {
    throw new Error('Milestone amounts must sum to total');
  }

  return invoice;
}

export async function generateMessage(
  type: keyof typeof MESSAGE_GENERATION_PROMPTS,
  context: {
    invoiceTitle: string;
    clientName?: string;
    amount?: number;
    milestoneName?: string;
  }
): Promise<string> {
  const prompt = MESSAGE_GENERATION_PROMPTS[type];
  
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 256,
    messages: [
      {
        role: 'user',
        content: `${prompt}\n\nContext:\n- Project: ${context.invoiceTitle}\n- Client: ${context.clientName || 'Client'}\n- Amount: ${context.amount ? `$${context.amount}` : 'N/A'}\n- Milestone: ${context.milestoneName || 'N/A'}`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type');
  }

  return content.text;
}
```

---

## 12. Complete User Flows

### Flow 1: Freelancer Creates Invoice

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW 1: FREELANCER CREATES INVOICE                       │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────┐
    │   START     │
    └──────┬──────┘
           │
           ▼
    ┌─────────────────────────────────────┐
    │ 1. Freelancer opens PayFlow AI      │
    │    and connects wallet (MetaMask)   │
    └──────────────────┬──────────────────┘
                       │
                       ▼
    ┌─────────────────────────────────────┐
    │ 2. System checks if user exists     │
    │    in database                      │
    └──────────────────┬──────────────────┘
                       │
           ┌───────────┴───────────┐
           │                       │
           ▼                       ▼
    ┌─────────────┐         ┌─────────────┐
    │ New User:   │         │ Existing:   │
    │ Create      │         │ Load        │
    │ profile     │         │ dashboard   │
    └──────┬──────┘         └──────┬──────┘
           │                       │
           └───────────┬───────────┘
                       │
                       ▼
    ┌─────────────────────────────────────┐
    │ 3. Freelancer clicks "Create New"   │
    │    and describes work in text box   │
    │                                     │
    │    "Logo for Ahmed's startup,       │
    │     $800, 30/40/30 split..."        │
    └──────────────────┬──────────────────┘
                       │
                       ▼
    ┌─────────────────────────────────────┐
    │ 4. Frontend sends to /api/ai/generate│
    └──────────────────┬──────────────────┘
                       │
                       ▼
    ┌─────────────────────────────────────┐
    │ 5. Claude AI processes description   │
    │    Returns structured invoice JSON   │
    └──────────────────┬──────────────────┘
                       │
                       ▼
    ┌─────────────────────────────────────┐
    │ 6. Freelancer reviews AI-generated   │
    │    invoice in preview mode           │
    │                                     │
    │    Can edit: title, amounts,        │
    │    milestones, client email         │
    └──────────────────┬──────────────────┘
                       │
                       ▼
    ┌─────────────────────────────────────┐
    │ 7. Freelancer clicks "Create Invoice"│
    └──────────────────┬──────────────────┘
                       │
                       ▼
    ┌─────────────────────────────────────┐
    │ 8. Backend: POST /api/invoices       │
    │                                     │
    │    • Generate invoice ID             │
    │    • Save to database               │
    │    • Generate payment link          │
    │    • Call smart contract            │
    │      createInvoice()                │
    └──────────────────┬──────────────────┘
                       │
                       ▼
    ┌─────────────────────────────────────┐
    │ 9. Return success with payment link  │
    │                                     │
    │    payflow.ai/pay/inv-2026-042      │
    └──────────────────┬──────────────────┘
                       │
                       ▼
    ┌─────────────────────────────────────┐
    │ 10. Freelancer copies link and      │
    │     shares with client via:         │
    │     • Email                         │
    │     • WhatsApp                      │
    │     • Any messaging platform        │
    └──────────────────┬──────────────────┘
                       │
                       ▼
    ┌─────────────┐
    │    END      │
    └─────────────┘
```

### Flow 2: Client Pays Milestone

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      FLOW 2: CLIENT PAYS MILESTONE                          │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────┐
    │   START     │
    └──────┬──────┘
           │
           ▼
    ┌─────────────────────────────────────┐
    │ 1. Client receives payment link     │
    │    from freelancer                  │
    │                                     │
    │    payflow.ai/pay/inv-2026-042      │
    └──────────────────┬──────────────────┘
                       │
                       ▼
    ┌─────────────────────────────────────┐
    │ 2. Client opens link in browser     │
    │                                     │
    │    Page shows:                      │
    │    • Freelancer info                │
    │    • Invoice details                │
    │    • Milestone breakdown            │
    │    • Escrow protection info         │
    └──────────────────┬──────────────────┘
                       │
                       ▼
    ┌─────────────────────────────────────┐
    │ 3. Client clicks "Connect Wallet"   │
    │                                     │
    │    RainbowKit modal opens           │
    │    Client selects MetaMask          │
    └──────────────────┬──────────────────┘
                       │
                       ▼
    ┌─────────────────────────────────────┐
    │ 4. Client connected                  │
    │                                     │
    │    System checks MNEE balance       │
    │    Shows: "Balance: 1,250 MNEE ✓"   │
    └──────────────────┬──────────────────┘
                       │
                       ▼
    ┌─────────────────────────────────────┐
    │ 5. Client clicks "Pay Milestone 1"  │
    │    Amount: 240 MNEE                 │
    └──────────────────┬──────────────────┘
                       │
                       ▼
    ┌─────────────────────────────────────┐
    │ 6. STEP 1: Approve MNEE Spending    │
    │                                     │
    │    MetaMask popup:                  │
    │    "Allow PayFlow Escrow to spend   │
    │     240 MNEE?"                      │
    │                                     │
    │    Client clicks "Approve"          │
    └──────────────────┬──────────────────┘
                       │
                       ▼
    ┌─────────────────────────────────────┐
    │ 7. Approval TX confirmed             │
    │    (Wait for blockchain)            │
    └──────────────────┬──────────────────┘
                       │
                       ▼
    ┌─────────────────────────────────────┐
    │ 8. STEP 2: Deposit to Escrow        │
    │                                     │
    │    MetaMask popup:                  │
    │    "Confirm transaction"            │
    │    depositMilestone(inv-042, 0)     │
    │                                     │
    │    Client clicks "Confirm"          │
    └──────────────────┬──────────────────┘
                       │
                       ▼
    ┌─────────────────────────────────────┐
    │ 9. Transaction submitted             │
    │                                     │
    │    Show loading: "Processing..."    │
    │    Wait for confirmation            │
    └──────────────────┬──────────────────┘
                       │
                       ▼
    ┌─────────────────────────────────────────────────────────────────────────┐
    │ 10. BLOCKCHAIN EVENTS                                                   │
    │                                                                         │
    │     Smart Contract emits:                                               │
    │     MilestoneDeposited(inv-042, 0, 240, 0x7f8e...)                       │
    │                                                                         │
    │     Backend listener catches event:                                     │
    │     • Updates database: milestone.status = PAID                         │
    │     • Updates database: milestone.paidAt = now                          │
    │     • Updates database: invoice.status = ACTIVE                         │
    │     • Creates transaction record                                        │
    └──────────────────┬──────────────────────────────────────────────────────┘
                       │
                       ▼
    ┌─────────────────────────────────────┐
    │ 11. Success screen shown             │
    │                                     │
    │    "Payment Successful! ✓"          │
    │    "240 MNEE deposited to escrow"   │
    │    "TX: 0xabc123..."                │
    └──────────────────┬──────────────────┘
                       │
                       ▼
    ┌─────────────────────────────────────┐
    │ 12. Page updates:                    │
    │                                     │
    │    Milestone 1: ✓ PAID (In Escrow)  │
    │    Milestone 2: [Pay Now]           │
    │    Milestone 3: 🔒 Locked           │
    └──────────────────┬──────────────────┘
                       │
                       ▼
    ┌─────────────┐
    │    END      │
    └─────────────┘
```

### Flow 3: Client Releases Funds

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     FLOW 3: CLIENT RELEASES FUNDS                           │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────┐
    │   START     │
    └──────┬──────┘
           │
           ▼
    ┌─────────────────────────────────────┐
    │ 1. Freelancer completes work        │
    │    for Milestone 1                  │
    └──────────────────┬──────────────────┘
                       │
                       ▼
    ┌─────────────────────────────────────┐
    │ 2. Freelancer goes to Invoice       │
    │    Detail page and clicks           │
    │    "Request Release"                │
    └──────────────────┬──────────────────┘
                       │
                       ▼
    ┌─────────────────────────────────────┐
    │ 3. System sends notification         │
    │    to client (email if provided)    │
    │                                     │
    │    "Milestone 1 is ready for        │
    │     approval. Click to review."     │
    └──────────────────┬──────────────────┘
                       │
                       ▼
    ┌─────────────────────────────────────┐
    │ 4. Client opens payment page        │
    │    (same link as before)            │
    │                                     │
    │    Milestone 1 shows:               │
    │    "✓ PAID - Approval Requested"    │
    │    [Review & Approve]               │
    └──────────────────┬──────────────────┘
                       │
                       ▼
    ┌─────────────────────────────────────┐
    │ 5. Client clicks "Review & Approve"  │
    │                                     │
    │    Modal shows:                     │
    │    • Work summary                   │
    │    • Freelancer's note              │
    │    • Amount to release: 240 MNEE    │
    └──────────────────┬──────────────────┘
                       │
           ┌───────────┴───────────┐
           │                       │
           ▼                       ▼
    ┌─────────────┐         ┌─────────────┐
    │ Approve     │         │ Request     │
    │             │         │ Changes     │
    └──────┬──────┘         └──────┬──────┘
           │                       │
           │                       ▼
           │                ┌─────────────┐
           │                │ Opens chat/ │
           │                │ dispute     │
           │                │ (future)    │
           │                └─────────────┘
           │
           ▼
    ┌─────────────────────────────────────┐
    │ 6. Client clicks "Approve & Release"│
    │                                     │
    │    MetaMask popup:                  │
    │    releaseMilestone(inv-042, 0)     │
    │                                     │
    │    Client clicks "Confirm"          │
    └──────────────────┬──────────────────┘
                       │
                       ▼
    ┌─────────────────────────────────────────────────────────────────────────┐
    │ 7. SMART CONTRACT EXECUTION                                             │
    │                                                                         │
    │    Contract:                                                            │
    │    • Verifies caller is client                                          │
    │    • Verifies milestone is DEPOSITED                                    │
    │    • Calculates fee (1%): 2.4 MNEE                                      │
    │    • Transfers 237.6 MNEE to freelancer                                 │
    │    • Transfers 2.4 MNEE to platform                                     │
    │    • Updates milestone status = RELEASED                                │
    │    • Emits MilestoneReleased event                                      │
    └──────────────────┬──────────────────────────────────────────────────────┘
                       │
                       ▼
    ┌─────────────────────────────────────────────────────────────────────────┐
    │ 8. BACKEND PROCESSES EVENT                                              │
    │                                                                         │
    │    • Updates milestone.status = RELEASED                                │
    │    • Updates milestone.releasedAt = now                                 │
    │    • Creates RELEASE transaction record                                 │
    │    • Checks if all milestones released                                  │
    │      → If yes: invoice.status = COMPLETED                               │
    └──────────────────┬──────────────────────────────────────────────────────┘
                       │
                       ▼
    ┌─────────────────────────────────────┐
    │ 9. Success shown to client           │
    │                                     │
    │    "Funds Released! ✓"              │
    │    "237.6 MNEE sent to freelancer"  │
    └──────────────────┬──────────────────┘
                       │
                       ▼
    ┌─────────────────────────────────────┐
    │ 10. Freelancer's dashboard updates   │
    │                                     │
    │     • New transaction in history    │
    │     • Total Released increases      │
    │     • In Escrow decreases           │
    │     • Wallet balance: +237.6 MNEE   │
    └──────────────────┬──────────────────┘
                       │
                       ▼
    ┌─────────────┐
    │    END      │
    └─────────────┘
```

---

## 13. Blockchain Event Handling

### Event Listener Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      BLOCKCHAIN EVENT HANDLING                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                           ETHEREUM BLOCKCHAIN                                │
│                                                                              │
│   ┌────────────────────────────────────────────────────────────────────┐    │
│   │                    PAYFLOW ESCROW CONTRACT                          │    │
│   │                                                                     │    │
│   │   Events:                                                          │    │
│   │   • InvoiceCreated(invoiceId, freelancer, totalAmount)              │    │
│   │   • MilestoneDeposited(invoiceId, milestoneIndex, amount, payer)    │    │
│   │   • MilestoneReleased(invoiceId, milestoneIndex, amount, recipient) │    │
│   │   • MilestoneRefunded(invoiceId, milestoneIndex, amount, recipient) │    │
│   │                                                                     │    │
│   └─────────────────────────────────┬──────────────────────────────────┘    │
│                                     │                                        │
│                                     │ Events emitted                         │
│                                     │                                        │
└─────────────────────────────────────┼────────────────────────────────────────┘
                                      │
                                      │ WebSocket subscription
                                      │ (Alchemy/Infura)
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        EVENT LISTENER SERVICE                               │
│                        (Node.js Background Process)                         │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                                                                     │  │
│   │   const contract = new ethers.Contract(address, abi, provider);     │  │
│   │                                                                     │  │
│   │   contract.on('MilestoneDeposited', async (                         │  │
│   │     invoiceId, milestoneIndex, amount, payer, event                 │  │
│   │   ) => {                                                            │  │
│   │     // Process event                                                │  │
│   │   });                                                               │  │
│   │                                                                     │  │
│   │   contract.on('MilestoneReleased', async (...) => { ... });         │  │
│   │                                                                     │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                     │                                       │
│                                     │                                       │
└─────────────────────────────────────┼───────────────────────────────────────┘
                                      │
                                      │ Database updates
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATABASE                                       │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                                                                     │  │
│   │   UPDATE milestones                                                 │  │
│   │   SET status = 'PAID',                                              │  │
│   │       paid_at = NOW(),                                              │  │
│   │       deposit_tx_hash = '0x...'                                     │  │
│   │   WHERE invoice_id = 'inv-042'                                      │  │
│   │     AND index = 0;                                                  │  │
│   │                                                                     │  │
│   │   INSERT INTO transactions (...)                                    │  │
│   │   VALUES (...);                                                     │  │
│   │                                                                     │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Event Processing Logic

```typescript
// services/eventProcessor.ts

import { prisma } from '@/lib/prisma';
import { ethers } from 'ethers';

interface MilestoneDepositedEvent {
  invoiceId: string;
  milestoneIndex: number;
  amount: bigint;
  payer: string;
  transactionHash: string;
  blockNumber: number;
}

interface MilestoneReleasedEvent {
  invoiceId: string;
  milestoneIndex: number;
  amount: bigint;
  recipient: string;
  transactionHash: string;
  blockNumber: number;
}

export async function processMilestoneDeposited(event: MilestoneDepositedEvent) {
  const { invoiceId, milestoneIndex, amount, payer, transactionHash } = event;
  
  console.log(`Processing MilestoneDeposited: ${invoiceId} - ${milestoneIndex}`);
  
  // Use transaction for atomicity
  await prisma.$transaction(async (tx) => {
    // 1. Update milestone status
    await tx.milestone.update({
      where: {
        invoiceId_index: {
          invoiceId,
          index: milestoneIndex,
        },
      },
      data: {
        status: 'PAID',
        paidAt: new Date(),
        depositTxHash: transactionHash,
      },
    });
    
    // 2. Update invoice - set client wallet and status
    const invoice = await tx.invoice.findUnique({
      where: { id: invoiceId },
    });
    
    if (invoice?.status === 'PENDING') {
      await tx.invoice.update({
        where: { id: invoiceId },
        data: {
          status: 'ACTIVE',
          clientWallet: payer,
        },
      });
    }
    
    // 3. Create transaction record
    await tx.transaction.create({
      data: {
        invoiceId,
        milestoneIdx: milestoneIndex,
        type: 'DEPOSIT',
        amount: ethers.formatUnits(amount, 18),
        fromWallet: payer,
        toWallet: process.env.ESCROW_CONTRACT_ADDRESS!,
        txHash: transactionHash,
      },
    });
  });
  
  console.log(`Successfully processed deposit for ${invoiceId}`);
}

export async function processMilestoneReleased(event: MilestoneReleasedEvent) {
  const { invoiceId, milestoneIndex, amount, recipient, transactionHash } = event;
  
  console.log(`Processing MilestoneReleased: ${invoiceId} - ${milestoneIndex}`);
  
  await prisma.$transaction(async (tx) => {
    // 1. Update milestone status
    await tx.milestone.update({
      where: {
        invoiceId_index: {
          invoiceId,
          index: milestoneIndex,
        },
      },
      data: {
        status: 'RELEASED',
        releasedAt: new Date(),
        releaseTxHash: transactionHash,
      },
    });
    
    // 2. Check if all milestones are released
    const invoice = await tx.invoice.findUnique({
      where: { id: invoiceId },
      include: { milestones: true },
    });
    
    const allReleased = invoice?.milestones.every(
      (m) => m.status === 'RELEASED'
    );
    
    if (allReleased) {
      await tx.invoice.update({
        where: { id: invoiceId },
        data: { status: 'COMPLETED' },
      });
    }
    
    // 3. Create transaction record
    await tx.transaction.create({
      data: {
        invoiceId,
        milestoneIdx: milestoneIndex,
        type: 'RELEASE',
        amount: ethers.formatUnits(amount, 18),
        fromWallet: process.env.ESCROW_CONTRACT_ADDRESS!,
        toWallet: recipient,
        txHash: transactionHash,
      },
    });
  });
  
  console.log(`Successfully processed release for ${invoiceId}`);
}
```

---

## 14. Security Considerations

### Smart Contract Security

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      SMART CONTRACT SECURITY                                │
└─────────────────────────────────────────────────────────────────────────────┘

1. REENTRANCY PROTECTION
   ───────────────────────
   • Using OpenZeppelin's ReentrancyGuard
   • nonReentrant modifier on all state-changing functions
   • CEI pattern (Checks-Effects-Interactions)

2. ACCESS CONTROL
   ───────────────────
   • Only client can release funds
   • Only admin can refund (dispute resolution)
   • Invoice creator cannot change after creation

3. INTEGER OVERFLOW
   ─────────────────
   • Solidity 0.8+ has built-in overflow checks
   • SafeERC20 for token transfers

4. FRONT-RUNNING PROTECTION
   ─────────────────────────
   • No price-sensitive operations
   • Fixed amounts in milestones

5. DENIAL OF SERVICE
   ──────────────────
   • Limited array sizes (max 10 milestones)
   • No loops over unbounded arrays
   • Pull over push for payments

6. TOKEN SECURITY
   ───────────────
   • Using SafeERC20 for all transfers
   • Verifying MNEE token address in constructor
```

### Application Security

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       APPLICATION SECURITY                                  │
└─────────────────────────────────────────────────────────────────────────────┘

1. AUTHENTICATION
   ───────────────
   • Wallet-based authentication (SIWE - Sign In With Ethereum)
   • No passwords to store or leak
   • Session tokens with expiration

2. AUTHORIZATION
   ──────────────
   • Invoice access restricted to owner
   • Payment pages are public (by design)
   • API routes check ownership before actions

3. INPUT VALIDATION
   ─────────────────
   • Zod schemas for all API inputs
   • Sanitize user-generated content
   • Validate wallet addresses format

4. RATE LIMITING
   ──────────────
   • AI generation: 10 requests/minute per user
   • Invoice creation: 50/hour per user
   • General API: 100/minute per IP

5. DATABASE SECURITY
   ──────────────────
   • Parameterized queries (Prisma)
   • Row-level security in Supabase
   • Encrypted sensitive fields

6. API SECURITY
   ─────────────
   • CORS configuration
   • CSRF protection
   • Webhook signature verification
```

### Data Privacy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DATA PRIVACY                                       │
└─────────────────────────────────────────────────────────────────────────────┘

DATA STORED
───────────

• Wallet addresses (public on blockchain anyway)
• Invoice details (titles, descriptions, amounts)
• Email addresses (optional, for notifications)
• Display names (user-provided)

DATA NOT STORED
───────────────

• Private keys (never touch the server)
• Signatures (used once for auth, then discarded)
• Full transaction data (queried from blockchain)

GDPR COMPLIANCE
───────────────

• Users can delete their account
• All data linked to account is removed
• Blockchain data is immutable (inform users)
```

---

## 15. Deployment Strategy

### Environment Setup

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DEPLOYMENT ENVIRONMENTS                             │
└─────────────────────────────────────────────────────────────────────────────┘

DEVELOPMENT (Local)
───────────────────
• Next.js dev server
• Local PostgreSQL or Supabase
• Hardhat local network
• Mock MNEE token

STAGING
───────
• Vercel Preview Deployments
• Supabase staging project
• Sepolia testnet
• Test MNEE token

PRODUCTION
──────────
• Vercel Production
• Supabase production project
• Ethereum Mainnet
• Real MNEE token (0x8cced...cF)
```

### Deployment Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CI/CD PIPELINE                                     │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────┐
    │   Commit    │
    │   to GitHub │
    └──────┬──────┘
           │
           ▼
    ┌─────────────────────────────────────┐
    │ 1. LINT & TYPE CHECK                │
    │    • ESLint                         │
    │    • TypeScript                     │
    │    • Prettier                       │
    └──────────────────┬──────────────────┘
           │
           ▼
    ┌─────────────────────────────────────┐
    │ 2. UNIT TESTS                       │
    │    • Jest / Vitest                  │
    │    • Component tests                │
    │    • API route tests                │
    └──────────────────┬──────────────────┘
           │
           ▼
    ┌─────────────────────────────────────┐
    │ 3. CONTRACT TESTS                   │
    │    • Hardhat tests                  │
    │    • Coverage report                │
    └──────────────────┬──────────────────┘
           │
           ▼
    ┌─────────────────────────────────────┐
    │ 4. BUILD                            │
    │    • Next.js build                  │
    │    • Prisma generate                │
    └──────────────────┬──────────────────┘
           │
           │
           ├─────────────────────────────────┐
           │                                 │
           ▼                                 ▼
    ┌─────────────┐                   ┌─────────────┐
    │ PR to main  │                   │ Push to main│
    │             │                   │             │
    │ Deploy to   │                   │ Deploy to   │
    │ STAGING     │                   │ PRODUCTION  │
    └─────────────┘                   └─────────────┘
```

---

## 16. Project File Structure

```
payflow-ai/
│
├── 📁 app/                          # Next.js App Router
│   ├── 📁 (public)/                 # Public routes
│   │   ├── page.tsx                 # Landing page
│   │   └── 📁 pay/
│   │       └── 📁 [invoiceId]/
│   │           └── page.tsx         # Client payment page
│   │
│   ├── 📁 (dashboard)/              # Protected routes
│   │   ├── layout.tsx               # Dashboard layout
│   │   ├── 📁 dashboard/
│   │   │   └── page.tsx
│   │   ├── 📁 invoices/
│   │   │   ├── page.tsx
│   │   │   └── 📁 [id]/
│   │   │       └── page.tsx
│   │   ├── 📁 create/
│   │   │   └── page.tsx
│   │   ├── 📁 payments/
│   │   │   └── page.tsx
│   │   └── 📁 settings/
│   │       └── page.tsx
│   │
│   ├── 📁 api/                      # API routes
│   │   ├── 📁 auth/
│   │   │   └── route.ts
│   │   ├── 📁 invoices/
│   │   │   ├── route.ts
│   │   │   └── 📁 [id]/
│   │   │       └── route.ts
│   │   ├── 📁 ai/
│   │   │   └── 📁 generate/
│   │   │       └── route.ts
│   │   ├── 📁 payments/
│   │   │   └── route.ts
│   │   └── 📁 webhooks/
│   │       └── route.ts
│   │
│   ├── layout.tsx                   # Root layout
│   ├── globals.css                  # Global styles
│   └── providers.tsx                # Context providers
│
├── 📁 components/                   # React components
│   ├── 📁 ui/                       # shadcn/ui components
│   ├── 📁 layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── DashboardLayout.tsx
│   ├── 📁 invoice/
│   │   ├── InvoiceCard.tsx
│   │   ├── InvoiceDetail.tsx
│   │   ├── MilestoneList.tsx
│   │   └── MilestoneItem.tsx
│   ├── 📁 payment/
│   │   ├── PaymentCard.tsx
│   │   ├── MilestonePayButton.tsx
│   │   └── TransactionHistory.tsx
│   ├── 📁 ai/
│   │   ├── AIInvoiceGenerator.tsx
│   │   └── GeneratingLoader.tsx
│   ├── 📁 wallet/
│   │   ├── ConnectButton.tsx
│   │   └── WalletStatus.tsx
│   └── 📁 common/
│       ├── LoadingSpinner.tsx
│       └── EmptyState.tsx
│
├── 📁 lib/                          # Utility libraries
│   ├── prisma.ts                    # Prisma client
│   ├── auth.ts                      # Authentication helpers
│   ├── utils.ts                     # General utilities
│   └── 📁 ai/
│       └── prompts.ts               # AI prompt templates
│
├── 📁 hooks/                        # Custom React hooks
│   ├── useInvoices.ts
│   ├── usePayments.ts
│   ├── useAIGenerate.ts
│   └── 📁 contracts/
│       ├── usePayflowContract.ts
│       └── useMneeToken.ts
│
├── 📁 stores/                       # Zustand stores
│   ├── useInvoiceStore.ts
│   ├── usePaymentStore.ts
│   └── useUserStore.ts
│
├── 📁 services/                     # Business logic services
│   ├── invoiceService.ts
│   ├── paymentService.ts
│   ├── aiService.ts
│   └── blockchainListener.ts
│
├── 📁 contracts/                    # Smart contracts
│   ├── 📁 src/
│   │   └── PayFlowEscrow.sol
│   ├── 📁 test/
│   │   └── PayFlowEscrow.test.ts
│   ├── 📁 scripts/
│   │   └── deploy.ts
│   ├── 📁 abi/
│   │   └── PayFlowEscrow.json
│   └── hardhat.config.ts
│
├── 📁 prisma/                       # Database
│   ├── schema.prisma
│   └── 📁 migrations/
│
├── 📁 config/                       # Configuration
│   ├── wagmi.ts                     # Web3 config
│   ├── site.ts                      # Site metadata
│   └── contracts.ts                 # Contract addresses
│
├── 📁 types/                        # TypeScript types
│   ├── invoice.ts
│   ├── payment.ts
│   └── user.ts
│
├── 📁 public/                       # Static assets
│   ├── logo.svg
│   ├── favicon.ico
│   └── 📁 images/
│
├── .env.local                       # Local environment
├── .env.example                     # Example environment
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

---

## 17. Environment Variables

```bash
# .env.example

# ============ APPLICATION ============
NEXT_PUBLIC_APP_URL=https://payflow.ai
NEXT_PUBLIC_APP_NAME=PayFlow AI

# ============ DATABASE ============
DATABASE_URL=postgresql://user:password@host:5432/payflow

# ============ AUTHENTICATION ============
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://payflow.ai

# ============ BLOCKCHAIN ============
NEXT_PUBLIC_CHAIN_ID=1
NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_MNEE_TOKEN_ADDRESS=0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF

# RPC URLs
NEXT_PUBLIC_ALCHEMY_MAINNET_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
NEXT_PUBLIC_ALCHEMY_SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
ALCHEMY_API_KEY=your-alchemy-key

# Private key for contract deployment (NEVER commit!)
DEPLOYER_PRIVATE_KEY=0x...

# ============ AI ============
ANTHROPIC_API_KEY=sk-ant-...

# ============ SERVICES ============
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id

# ============ OPTIONAL ============
# Email (for notifications)
RESEND_API_KEY=re_...

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_...
```

---

## 18. Third-Party Integrations

### Integration Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       THIRD-PARTY INTEGRATIONS                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Anthropic     │     │    Alchemy      │     │   Supabase      │
│   (Claude AI)   │     │    (RPC)        │     │   (Database)    │
│                 │     │                 │     │                 │
│   • Invoice     │     │   • Blockchain  │     │   • PostgreSQL  │
│     generation  │     │     queries     │     │   • Auth        │
│   • Message     │     │   • Event       │     │   • Storage     │
│     writing     │     │     subscription│     │                 │
│                 │     │   • TX relay    │     │                 │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │                         │
                    │       PayFlow AI        │
                    │       Application       │
                    │                         │
                    └─────────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   RainbowKit    │     │   Vercel        │     │   Resend        │
│   (Wallet UI)   │     │   (Hosting)     │     │   (Email)       │
│                 │     │                 │     │                 │
│   • MetaMask    │     │   • Frontend    │     │   • Payment     │
│   • Coinbase    │     │   • API routes  │     │     notifications│
│   • WalletConnect│    │   • Edge        │     │   • Reminders   │
│                 │     │     functions   │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Integration Details

| Service | Purpose | API/SDK | Pricing |
|---------|---------|---------|---------|
| **Anthropic Claude** | AI invoice generation | REST API | Pay per token |
| **Alchemy** | Ethereum RPC & events | WebSocket + REST | Free tier available |
| **Supabase** | Database & auth | Prisma client | Free tier available |
| **RainbowKit** | Wallet connection | React hooks | Free |
| **Vercel** | Hosting & serverless | CLI + Git | Free tier available |
| **Resend** | Transactional email | REST API | Free tier available |
| **WalletConnect** | Multi-wallet support | SDK | Free |

---

## Summary

This architecture document provides a complete blueprint for building PayFlow AI:

1. **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS, and wagmi for Web3
2. **Backend**: Next.js API routes with Prisma ORM and Supabase PostgreSQL
3. **Smart Contracts**: Solidity escrow contract with milestone-based payments
4. **AI**: Claude API for natural language invoice generation
5. **Blockchain**: Ethereum mainnet with MNEE stablecoin integration

The system enables freelancers to create AI-generated invoices and receive secure, milestone-based payments through smart contract escrow, providing trust and transparency for both parties.

---

**Document Version**: 1.0  
**Last Updated**: January 2026  
**Author**: PayFlow AI Team
