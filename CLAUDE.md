# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PayFlow v2 is an AI-powered invoice and escrow payment platform using MNEE stablecoin that protects freelancers and clients from payment disputes. The application allows freelancers to create invoices with milestones, and clients to pay into escrow and release payments as milestones are completed.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Configuration

Create a `.env.local` file in the root directory with:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

The Gemini API key is required for AI-powered invoice generation and client message generation features.

## Architecture

### Application State Management

- **App.tsx**: Root component managing application state including:
  - View routing (landing, auth, dashboard, invoices, etc.)
  - Wallet connection status
  - User type (freelancer/client)
  - Invoice data and CRUD operations
  - Simple hash-based routing for client payment pages (#pay/:invoiceId)

### Core Data Models (types.ts)

- **Invoice**: Contains freelancer/client wallets, title, description, amount, currency, category, milestones array, and status
- **Milestone**: Individual payment milestones with amount, percentage, order, and status (PENDING → PAID → RELEASED)
- **InvoiceStatus**: PENDING, ACTIVE, COMPLETED, CANCELLED
- **MilestoneStatus**: PENDING (not paid), PAID (in escrow), RELEASED (sent to freelancer)

### AI Integration (services/geminiService.ts)

Uses Google Gemini API for:
- **generateInvoiceFromPrompt()**: Parses natural language descriptions into structured invoices with milestones
- **generateClientMessage()**: Creates professional client-facing messages about invoices

The service uses structured output with JSON schema validation to ensure consistent invoice data format.

### Component Organization

Components are organized in `/components`:

**Public Pages:**
- LandingPage, HowItWorks, FeaturesPage, PricingPage, AuthPage

**Freelancer Views:**
- Dashboard: Overview with invoice stats and recent activity
- CreateInvoice: AI-powered invoice creation with prompt-based generation
- InvoiceList: List all invoices with filtering
- InvoiceDetails: View and manage individual invoices and milestones
- PaymentsView: Track payment history
- SettingsView: User settings

**Client Views:**
- ClientPayPage: Public-facing payment page accessible via shareable link

**Shared Components:**
- Header, Sidebar: Navigation and layout components

### Payment Flow

1. Freelancer creates invoice with milestones using AI or manual input
2. Freelancer shares payment link (#pay/:invoiceId) with client
3. Client connects wallet and pays milestone into escrow (status → PAID)
4. Freelancer completes work and requests release
5. Client approves release (status → RELEASED, funds sent to freelancer)

### Routing

Uses simple hash-based routing without external libraries:
- Marketing pages: No hash
- Freelancer dashboard: After wallet connection
- Client payment: #pay/:invoiceId (publicly accessible)

### Styling

Uses inline Tailwind-like utility classes directly in JSX (no external CSS framework imported - appears to use inline styles mimicking Tailwind conventions).

## Key Implementation Notes

- Wallet addresses are currently mocked (simulated connection)
- Invoice data is stored in component state (no backend/database yet)
- All payment operations are simulated (no real blockchain integration)
- The app uses Vite with React 19 and TypeScript
- Path alias '@/' resolves to project root
