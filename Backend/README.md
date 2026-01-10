# PayFlow Backend API

Backend API server for PayFlow AI - an AI-powered invoice and escrow payment platform.

## Tech Stack

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **SIWE** - Sign-In With Ethereum
- **Google Gemini AI** - Invoice generation

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT token signing
- `GEMINI_API_KEY` - Google Gemini API key for AI features

### 3. Set Up Database

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio to view data
npm run prisma:studio
```

### 4. Run Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication

- `POST /api/auth/verify` - Verify SIWE signature and get JWT token
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Logout (client-side token removal)
- `GET /api/auth/me` - Get current authenticated user

### User Management

- `GET /api/user` - Get user profile
- `PATCH /api/user` - Update user profile
- `DELETE /api/user` - Delete user account

### Invoices

- `GET /api/invoices` - List all invoices (paginated)
- `POST /api/invoices` - Create new invoice
- `GET /api/invoices/:id` - Get invoice details
- `PATCH /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Cancel invoice
- `PATCH /api/invoices/:id/milestones/:index` - Update milestone status

### Payments

- `GET /api/payments` - Get transaction history
- `GET /api/payments/escrow` - Get escrow balance
- `GET /api/payments/stats` - Get payment statistics

### AI

- `POST /api/ai/generate` - Generate invoice from description
- `POST /api/ai/message` - Generate professional message

### Public (No Auth)

- `GET /api/public/invoice/:id` - Get invoice for payment page
- `POST /api/public/invoice/:id/register-client` - Register client wallet

### Webhooks

- `POST /api/webhooks/blockchain` - Handle blockchain events

## Project Structure

```
backend/
├── src/
│   ├── routes/          # API route handlers
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   ├── invoices.ts
│   │   ├── payments.ts
│   │   ├── ai.ts
│   │   ├── webhooks.ts
│   │   └── public.ts
│   ├── services/        # Business logic
│   │   ├── invoiceService.ts
│   │   └── aiService.ts
│   ├── middleware/      # Express middleware
│   │   ├── auth.ts
│   │   └── validation.ts
│   ├── lib/             # Utilities
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   └── utils.ts
│   ├── types/           # TypeScript types
│   │   └── index.ts
│   └── server.ts        # Main server file
├── prisma/
│   └── schema.prisma    # Database schema
├── .env.example         # Environment template
└── package.json
```

## Authentication Flow

1. Client connects wallet (MetaMask, etc.)
2. Client signs SIWE message
3. Send message + signature to `POST /api/auth/verify`
4. Receive JWT token
5. Include token in `Authorization: Bearer <token>` header for protected routes

## Development

### Scripts

- `npm run dev` - Start dev server with hot reload
- `npm run build` - Build for production
- `npm start` - Run production build
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio GUI
- `npm run prisma:push` - Push schema changes to DB (dev only)

### Database Migrations

When you change the Prisma schema:

```bash
npm run prisma:migrate
```

This will:
1. Create a new migration file
2. Apply it to your database
3. Regenerate the Prisma client

## Deployment

### Production Checklist

- [ ] Set strong `JWT_SECRET`
- [ ] Configure production `DATABASE_URL`
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS
- [ ] Set up proper CORS origins
- [ ] Configure rate limiting
- [ ] Set up error monitoring (Sentry)
- [ ] Set up logging
- [ ] Configure backup strategy

### Recommended Hosting

- **Backend**: Railway, Render, Fly.io
- **Database**: Supabase, Neon, or managed PostgreSQL
- **Environment**: Node.js 18+ required

## Next Steps

1. **Install dependencies**: `npm install`
2. **Set up database**: Create PostgreSQL database and update `.env`
3. **Run migrations**: `npm run prisma:migrate`
4. **Start server**: `npm run dev`
5. **Test endpoints**: Use the health check at `http://localhost:3001/health`

## Need Help?

- Check the main project README
- Review the API architecture document
- Ensure your `.env` file is properly configured
