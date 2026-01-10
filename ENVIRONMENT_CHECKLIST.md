# Environment Configuration Checklist

## ✅ Completed

### Backend (.env)
- ✅ Alchemy API Key configured
- ✅ Ethereum RPC URL (Sepolia) configured
- ✅ Network set to Sepolia
- ✅ JWT Secret generated and configured
- ✅ Webhook Secret generated and configured
- ✅ Neon Database URL configured
- ✅ OpenRouter API Key configured

### Frontend (.env.local)
- ✅ Alchemy API Key configured
- ✅ MNEE Token Address configured

### Contracts (.env)
- ✅ Sepolia RPC URL configured
- ✅ Mainnet RPC URL configured

---

## ⚠️ Still Required

### 1. WalletConnect Project ID (Frontend)

**Get it from**: https://cloud.walletconnect.com/

**Steps**:
1. Visit https://cloud.walletconnect.com/
2. Sign up (free)
3. Create new project
4. Copy Project ID
5. Add to `.env.local`:
   ```env
   VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
   ```

### 2. Etherscan API Key (Contracts)

**Get it from**: https://etherscan.io/myapikey

**Steps**:
1. Visit https://etherscan.io/myapikey
2. Sign up/login
3. Create new API key
4. Copy the key
5. Add to `contracts/.env`:
   ```env
   ETHERSCAN_API_KEY=your_etherscan_api_key
   ```

### 3. Private Key for Deployment (Contracts)

**⚠️ SECURITY WARNING**: Use a testnet-only wallet!

**Steps**:
1. Open MetaMask
2. Click the three dots → Account details
3. Click "Export Private Key"
4. Enter password
5. Copy private key (starts with 0x)
6. Add to `contracts/.env`:
   ```env
   PRIVATE_KEY=your_private_key_here
   ```

**IMPORTANT**:
- Never use your main wallet
- Only put testnet ETH in this wallet
- Never commit this file to Git

### 4. Platform Wallet Address (Contracts)

**This is YOUR wallet address** that will receive the 1% platform fees.

**Steps**:
1. Copy your MetaMask wallet address
2. Add to `contracts/.env`:
   ```env
   PLATFORM_WALLET=your_wallet_address_here
   ```

### 5. Get Sepolia ETH

**Get from**: https://sepoliafaucet.com/

**Steps**:
1. Visit https://sepoliafaucet.com/
2. Connect wallet
3. Request 0.05 ETH (for deployment + gas)
4. Wait ~1 minute for delivery

---

## 📝 Quick Actions

### Get WalletConnect Project ID
```bash
# Visit: https://cloud.walletconnect.com/
# 1. Sign up with email or GitHub
# 2. Create New Project
# 3. Name: "PayFlow"
# 4. Copy Project ID
# 5. Paste in .env.local
```

### Get Etherscan API Key
```bash
# Visit: https://etherscan.io/myapikey
# 1. Sign up/login
# 2. Add → Create New API Key
# 3. App Name: "PayFlow"
# 4. Copy the key
# 5. Paste in contracts/.env
```

### Export MetaMask Private Key
```bash
# ⚠️ Use TESTNET wallet only!
# 1. MetaMask → ... → Account Details
# 2. Export Private Key
# 3. Enter password
# 4. Copy key (starts with 0x)
# 5. Paste in contracts/.env
```

### Get Sepolia ETH
```bash
# Visit: https://sepoliafaucet.com/
# 1. Connect your testnet wallet
# 2. Request ETH
# 3. Wait for confirmation
```

---

## ✅ After Getting All Keys

Once you have all the above, you're ready to deploy! Follow these guides:

1. **Deploy Smart Contracts**: See `DEPLOYMENT_GUIDE.md`
2. **Deploy Backend**: See `Backend/DEPLOYMENT.md`
3. **Deploy Frontend**: See `VERCEL_DEPLOYMENT.md`

---

## 🧪 Test Locally First

Before deploying to production, test everything locally:

```bash
# Terminal 1: Start Backend
cd Backend
npm run dev

# Terminal 2: Start Frontend
npm run dev

# Test:
# - Wallet connection works
# - Can create invoice
# - Backend API responds
# - No console errors
```

---

## 🎯 Current Status

**You have completed**: 70% of environment configuration!

**Next steps**:
1. Get WalletConnect Project ID (5 min)
2. Get Etherscan API Key (5 min)
3. Export private key from MetaMask (2 min)
4. Get Sepolia ETH from faucet (5 min)
5. Ready to deploy! 🚀

---

## 📞 Need Help?

- **WalletConnect**: https://docs.walletconnect.com/
- **Etherscan API**: https://docs.etherscan.io/
- **Sepolia Faucet**: https://sepoliafaucet.com/

---

**You're almost there! Just 4 more API keys/secrets to go!** 💪
