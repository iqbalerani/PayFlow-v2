# PayFlow Frontend Deployment Guide

Complete guide for deploying the PayFlow frontend to Vercel for production.

## 📋 Prerequisites

Before deploying the frontend, ensure you have:

### 1. Backend Deployed
- ✅ Backend API deployed to Railway/Render
- ✅ Backend URL ready (e.g., `https://payflow-backend.up.railway.app`)
- See `Backend/DEPLOYMENT.md` for backend deployment

### 2. Smart Contract Deployed
- ✅ PayFlowEscrow contract deployed to Sepolia
- ✅ Contract address ready
- See `DEPLOYMENT_GUIDE.md` for contract deployment

### 3. Required API Keys

You need these API keys:

#### Alchemy API Key
- Visit [Alchemy Dashboard](https://dashboard.alchemy.com/)
- Create app for Ethereum Sepolia
- Copy API key

#### WalletConnect Project ID
- Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
- Create new project
- Copy Project ID

#### Gemini API Key (for AI features)
- Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
- Create API key
- Copy key

## 🚀 Deployment to Vercel

### Step 1: Create Vercel Account

1. Visit [Vercel.com](https://vercel.com/)
2. Sign up with GitHub
3. Free tier includes:
   - Unlimited deployments
   - Automatic SSL
   - Global CDN

### Step 2: Import Project

1. Click "Add New..." → "Project"
2. Import your Git repository
3. Vercel will auto-detect Vite

### Step 3: Configure Build Settings

Vercel should auto-detect, but verify:

- **Framework Preset**: Vite
- **Root Directory**: `./` (leave as root)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 4: Configure Environment Variables

In Vercel dashboard, add these environment variables:

#### Production Environment Variables

```env
# API Configuration
VITE_API_URL=https://your-backend-url.up.railway.app/api

# Blockchain Configuration
VITE_MNEE_TOKEN_ADDRESS=0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF
VITE_PAYFLOW_ESCROW_ADDRESS=0xYourDeployedContractAddress

# RPC Configuration
VITE_ALCHEMY_API_KEY=your_alchemy_api_key_here

# Wallet Connect
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# AI Configuration (optional - if using client-side AI)
GEMINI_API_KEY=your_gemini_api_key_here
```

**Important Notes:**
- All Vite env vars must start with `VITE_` to be exposed to client
- Never expose sensitive secrets (private keys, JWT secrets) in frontend env vars
- Gemini API key is optional (AI features can run from backend)

### Step 5: Deploy

1. Click "Deploy"
2. Wait 1-2 minutes for build
3. Vercel will provide a URL (e.g., `https://payflow-xyz.vercel.app`)

### Step 6: Configure Custom Domain (Optional)

1. Go to Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Vercel automatically provisions SSL certificate

### Step 7: Update Backend CORS

After deployment, update backend environment variable:

```env
# In Railway/Render backend settings
CORS_ORIGIN=https://your-vercel-domain.vercel.app
```

Also update `APP_URL`:
```env
APP_URL=https://your-vercel-domain.vercel.app
```

Then redeploy backend.

## ✅ Verification Checklist

After deployment, verify:

### 1. Check Deployment Status
- [ ] Build completed successfully
- [ ] No build errors in Vercel logs
- [ ] Site is accessible at Vercel URL

### 2. Test Landing Page
```bash
# Visit your Vercel URL
https://your-domain.vercel.app

# Should show:
- PayFlow landing page
- Smooth animations
- "Get Started" button works
```

### 3. Test Wallet Connection
- [ ] Click "Get Started" → "Sign In"
- [ ] Click "Connect Wallet"
- [ ] RainbowKit modal appears
- [ ] Can connect MetaMask/WalletConnect
- [ ] Connection persists on refresh

### 4. Test Backend Connection
- [ ] After wallet connection, check browser console
- [ ] Should see successful API calls to backend
- [ ] No CORS errors

### 5. Test Invoice Creation
- [ ] Navigate to "Create Invoice"
- [ ] Fill in invoice details
- [ ] AI generation works (if Gemini key provided)
- [ ] Invoice saves successfully
- [ ] Can view invoice in list

### 6. Test Payment Flow
- [ ] Get payment link for invoice
- [ ] Open in incognito/different wallet
- [ ] Connect client wallet
- [ ] MNEE balance displays (if you have testnet MNEE)
- [ ] Payment modal works

## 🐛 Troubleshooting

### Error: "Failed to fetch API"

**Cause**: Backend URL incorrect or CORS not configured

**Solution**:
```bash
# 1. Check VITE_API_URL in Vercel env vars
# Should end with /api
VITE_API_URL=https://backend.railway.app/api

# 2. Check backend CORS_ORIGIN
# Must match exact frontend domain
CORS_ORIGIN=https://payflow.vercel.app
```

### Error: "WalletConnect initialization failed"

**Cause**: Invalid WalletConnect Project ID

**Solution**:
```bash
# Get new project ID from:
# https://cloud.walletconnect.com/

# Update in Vercel:
VITE_WALLETCONNECT_PROJECT_ID=abc123...
```

### Error: "Contract not deployed"

**Cause**: Wrong network or contract address

**Solution**:
```bash
# Ensure contract is deployed to same network as RPC
# Sepolia contract on Sepolia RPC
# Mainnet contract on Mainnet RPC

# Check contract on Etherscan:
https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS
```

### Build Error: "Cannot find module"

**Cause**: Missing dependencies

**Solution**:
```bash
# Ensure package-lock.json is committed
git add package-lock.json
git commit -m "Add package-lock.json"
git push

# Or clear Vercel build cache:
# Vercel Dashboard → Settings → Clear Cache & Redeploy
```

### CORS Error

**Cause**: Backend CORS_ORIGIN doesn't match frontend domain

**Solution**:
```bash
# Backend must have exact frontend URL:
CORS_ORIGIN=https://payflow-abc123.vercel.app

# Not:
CORS_ORIGIN=http://... (wrong protocol)
CORS_ORIGIN=*.vercel.app (wildcards don't work)
CORS_ORIGIN=payflow-abc123.vercel.app (missing https://)
```

## 🔄 Continuous Deployment

Vercel automatically deploys on every push to main branch:

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# Vercel automatically:
# 1. Detects push
# 2. Runs build
# 3. Deploys to production
# 4. Updates live site (zero downtime)
```

### Preview Deployments

Vercel creates preview deployments for pull requests:

1. Create feature branch
2. Push to GitHub
3. Open pull request
4. Vercel creates preview URL
5. Test changes before merging

## 🎯 Production Optimizations

### 1. Enable Analytics (Optional)

Vercel provides built-in analytics:

1. Go to Analytics tab
2. Enable Web Analytics
3. View real-time visitor data

### 2. Performance Monitoring

Check Core Web Vitals:

1. Go to Speed Insights
2. Monitor LCP, FID, CLS scores
3. Fix any performance issues

### 3. Security Headers

Already configured in `vercel.json`:
- Cache-Control for static assets
- Proper routing for SPA

## 📊 Environment Variables Reference

### Required Variables

```env
# Backend API (required)
VITE_API_URL=https://backend-url.railway.app/api

# Smart Contracts (required)
VITE_PAYFLOW_ESCROW_ADDRESS=0x...
VITE_MNEE_TOKEN_ADDRESS=0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF

# RPC Provider (required)
VITE_ALCHEMY_API_KEY=your_key

# Wallet Connect (required)
VITE_WALLETCONNECT_PROJECT_ID=your_id
```

### Optional Variables

```env
# AI Features (optional - can run from backend)
GEMINI_API_KEY=your_key

# Custom RPC URLs (optional - defaults to Alchemy)
VITE_SEPOLIA_RPC_URL=https://...
VITE_MAINNET_RPC_URL=https://...
```

## 🧪 Testing Production Deployment

### 1. Smoke Test

Visit your production URL and test:

```
✅ Landing page loads
✅ Navigation works
✅ Wallet connects
✅ Backend API responds
✅ Can create test invoice
✅ Payment link generates
✅ Client can view payment page
```

### 2. Cross-Browser Test

Test on:
- ✅ Chrome/Brave (Desktop)
- ✅ Safari (Desktop & Mobile)
- ✅ Firefox
- ✅ Mobile browsers

### 3. Wallet Test

Test with:
- ✅ MetaMask
- ✅ WalletConnect
- ✅ Coinbase Wallet
- ✅ Rainbow Wallet

## 🔐 Security Checklist

- [ ] No private keys in environment variables
- [ ] No API secrets exposed to client (only VITE_ prefixed vars)
- [ ] HTTPS enforced (Vercel does this automatically)
- [ ] Backend CORS properly configured
- [ ] Rate limiting enabled on backend
- [ ] Input validation on frontend
- [ ] XSS protection (React does this by default)

## 📝 Post-Deployment Tasks

After successful deployment:

### 1. Update Documentation
- [ ] Update README with production URLs
- [ ] Add deployment status badges
- [ ] Document any configuration changes

### 2. Share Links
```env
Production Frontend: https://payflow.vercel.app
Backend API: https://payflow-backend.railway.app
Contract (Sepolia): https://sepolia.etherscan.io/address/0x...
```

### 3. Monitor Deployment
- [ ] Check Vercel analytics
- [ ] Monitor error rates
- [ ] Watch for failed deployments

## 🎬 Next Steps

After frontend deployment:

1. ✅ **End-to-End Test** - Test full payment flow in production
2. ✅ **Create Demo Video** - Record 5-minute walkthrough
3. ✅ **Prepare Devpost** - Write project description
4. ✅ **Submit to Hackathon** - Complete submission

## 🔗 Useful Commands

```bash
# Deploy from CLI
npx vercel

# Deploy to production
npx vercel --prod

# View logs
npx vercel logs

# List deployments
npx vercel ls

# Remove deployment
npx vercel rm deployment-url
```

## 🆘 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Vite Docs**: https://vitejs.dev/guide/
- **RainbowKit Docs**: https://rainbowkit.com/docs
- **Wagmi Docs**: https://wagmi.sh/

---

**⚠️ REMEMBER**: After deploying frontend, update backend `CORS_ORIGIN` and `APP_URL` with your Vercel domain!
