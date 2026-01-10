# PayFlow Backend Deployment Guide

Complete guide for deploying the PayFlow backend API to Railway.app (or Render.com) for production.

## 📋 Prerequisites

### 1. Neon PostgreSQL Database (Free)
- Visit [Neon Console](https://console.neon.tech/)
- Sign up and create a new project
- Copy the connection string (looks like: `postgresql://user:pass@ep-xxx.aws.neon.tech/neondb?sslmode=require`)

### 2. Gemini API Key
- Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
- Create API key for AI-powered invoice generation

### 3. JWT Secret
Generate a secure random secret:
```bash
openssl rand -base64 64
```

### 4. Webhook Secret
Generate a secure webhook secret:
```bash
openssl rand -base64 32
```

### 5. Deployed Smart Contract
- Ensure you've deployed PayFlowEscrow contract to Sepolia (see `../DEPLOYMENT_GUIDE.md`)
- Have contract address ready

## 🚀 Deployment to Railway

### Step 1: Create Railway Account

1. Visit [Railway.app](https://railway.app/)
2. Sign up with GitHub
3. Free tier includes: $5 credit/month, perfect for hackathons

### Step 2: Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Authorize Railway to access your repository
4. Select your PayFlow repository
5. Railway will auto-detect Node.js and start deploying

### Step 3: Configure Root Directory

Since the backend is in a subdirectory:

1. Go to project Settings → Root Directory
2. Set to: `Backend`
3. Save changes

### Step 4: Configure Environment Variables

In Railway dashboard, go to Variables tab and add:

```env
NODE_ENV=production
PORT=8001
APP_URL=https://your-frontend-domain.vercel.app
API_URL=https://payflow-backend.up.railway.app

# Database (copy from Neon)
DATABASE_URL=postgresql://user:pass@ep-xxx.aws.neon.tech/neondb?sslmode=require

# Authentication (generate with: openssl rand -base64 64)
JWT_SECRET=your_generated_jwt_secret_here
JWT_EXPIRES_IN=7d

# AI
GEMINI_API_KEY=your_gemini_api_key

# Blockchain
ETHEREUM_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your_alchemy_key
ETHEREUM_NETWORK=sepolia
PAYFLOW_ESCROW_ADDRESS=0xYourDeployedContractAddress
MNEE_TOKEN_ADDRESS=0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF

# Webhooks (generate with: openssl rand -base64 32)
WEBHOOK_SECRET=your_webhook_secret

# CORS (update after deploying frontend)
CORS_ORIGIN=https://payflow.vercel.app
```

### Step 5: Configure Build Command

Railway auto-detects but ensure these are set:

- **Build Command**: `npm run prisma:generate && npm run build`
- **Start Command**: `npm start`

### Step 6: Deploy

1. Railway will automatically deploy on push to main branch
2. Wait for deployment to complete (2-3 minutes)
3. Copy the generated URL (e.g., `https://payflow-backend.up.railway.app`)

### Step 7: Run Database Migrations

After first deployment, run migrations:

1. In Railway dashboard, go to your service
2. Click "Deploy" → "Deployments"
3. Find the latest deployment
4. Open deployment logs
5. Or use Railway CLI:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run migrations
railway run npm run prisma:push
```

### Step 8: Verify Deployment

Test your API:

```bash
# Health check
curl https://your-backend-url.up.railway.app/health

# Should return:
# {
#   "status": "ok",
#   "timestamp": "2026-01-10T...",
#   "service": "PayFlow Backend API"
# }
```

## 🔄 Alternative: Deploy to Render.com

### Render Deployment Steps:

1. Visit [Render.com](https://render.com/)
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your repository
5. Configure:
   - **Name**: payflow-backend
   - **Root Directory**: `Backend`
   - **Environment**: Node
   - **Build Command**: `npm install && npm run prisma:generate && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

6. Add environment variables (same as Railway list above)
7. Click "Create Web Service"

## 📊 Database Setup

### Initialize Database Schema

After deployment, initialize the database:

```bash
# Using Railway CLI
railway run npm run prisma:push

# Or using Render CLI
render run npm run prisma:push
```

### View Database (Optional)

Access Prisma Studio to view data:

```bash
# Local development only
npm run prisma:studio
```

For production, use [Neon Console](https://console.neon.tech/) SQL Editor.

## 🔧 Post-Deployment Configuration

### 1. Update Frontend Environment

Update your frontend `.env.local`:

```env
VITE_API_URL=https://your-backend-url.up.railway.app/api
```

### 2. Update CORS Origin

Once frontend is deployed, update backend `CORS_ORIGIN`:

```env
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

### 3. Test API Endpoints

```bash
# Health check
curl https://your-backend-url/health

# Create test user (requires valid wallet)
curl -X POST https://your-backend-url/api/auth/test-login \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"0x1234..."}'
```

## 📈 Monitoring & Logs

### Railway Logs

View logs in Railway dashboard:
1. Go to your project
2. Click "Deployments"
3. View real-time logs

### Common Issues

**Issue: "Cannot find module '@prisma/client'"**
```bash
# Solution: Ensure build command includes prisma:generate
Build Command: npm install && npm run prisma:generate && npm run build
```

**Issue: "Database connection failed"**
```bash
# Solution: Check DATABASE_URL format
# Neon requires: ?sslmode=require at the end
postgresql://user:pass@host/db?sslmode=require
```

**Issue: "CORS error from frontend"**
```bash
# Solution: Update CORS_ORIGIN to match your frontend domain
CORS_ORIGIN=https://your-actual-frontend.vercel.app
```

## 🔐 Security Checklist

- [ ] JWT_SECRET is strong random value (64+ characters)
- [ ] WEBHOOK_SECRET is strong random value (32+ characters)
- [ ] DATABASE_URL uses SSL (`?sslmode=require`)
- [ ] CORS_ORIGIN is set to exact frontend domain (no wildcards)
- [ ] Environment variables are set in Railway/Render, not committed to Git
- [ ] Rate limiting is enabled (already configured in server.ts)
- [ ] API endpoints use authentication middleware where needed

## 🧪 Testing Deployment

### 1. Test Health Endpoint
```bash
curl https://your-backend-url/health
# Expected: {"status":"ok",...}
```

### 2. Test Authentication
```bash
curl -X POST https://your-backend-url/api/auth/test-login \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"}'
```

### 3. Test AI Generation
```bash
curl -X POST https://your-backend-url/api/ai/generate-message \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Website Development",
    "clientName":"John Doe",
    "amount":"5000"
  }'
```

### 4. Test Invoice Creation
```bash
# Requires authentication token from step 2
curl -X POST https://your-backend-url/api/invoices \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title":"Test Invoice",
    "description":"Testing deployment",
    "totalAmount":"100",
    "currency":"MNEE",
    "milestones":[
      {"title":"Milestone 1","amount":"50","percentage":50},
      {"title":"Milestone 2","amount":"50","percentage":50}
    ]
  }'
```

## 🚀 Blockchain Listener Service (Optional)

The blockchain listener monitors on-chain events. To run it:

### Option 1: Separate Railway Service
1. Create new service in same project
2. Set Root Directory: `Backend`
3. Set Start Command: `npm run listener`
4. Use same environment variables

### Option 2: Background Worker (if supported)
Some platforms support background workers. Check Railway/Render docs.

### Option 3: Cron Job Alternative
For hackathon demo, you can skip the listener and manually sync transactions.

## 📝 Environment Variable Checklist

Required variables:
- [ ] NODE_ENV=production
- [ ] PORT=8001
- [ ] DATABASE_URL (from Neon)
- [ ] JWT_SECRET (generated)
- [ ] GEMINI_API_KEY (from Google)
- [ ] ETHEREUM_RPC_URL (from Alchemy)
- [ ] PAYFLOW_ESCROW_ADDRESS (deployed contract)
- [ ] MNEE_TOKEN_ADDRESS
- [ ] WEBHOOK_SECRET (generated)
- [ ] CORS_ORIGIN (frontend URL)
- [ ] APP_URL (frontend URL)
- [ ] API_URL (backend URL)

## 🎯 Next Steps

After backend deployment:

1. ✅ **Deploy Frontend** - See `../VERCEL_DEPLOYMENT.md`
2. ✅ **Update Frontend .env** - Add backend API URL
3. ✅ **Test End-to-End** - Create invoice, pay milestone, release
4. ✅ **Demo Video** - Record walkthrough
5. ✅ **Submit to Devpost** - Complete submission

## 🆘 Need Help?

- **Railway Docs**: https://docs.railway.app/
- **Render Docs**: https://render.com/docs
- **Neon Docs**: https://neon.tech/docs
- **Prisma Docs**: https://www.prisma.io/docs

## 🔗 Useful Commands

```bash
# View Railway logs
railway logs

# Run commands in Railway environment
railway run <command>

# SSH into Railway container
railway shell

# Restart service
railway restart

# View environment variables
railway variables
```

---

**⚠️ IMPORTANT**: After deploying backend, update `VITE_API_URL` in frontend `.env.local` before deploying frontend!
