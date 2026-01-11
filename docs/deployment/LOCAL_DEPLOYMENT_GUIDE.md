# PayFlow - Local Development with Deployed Contracts

This guide shows how to run PayFlow locally while using real smart contracts deployed on Sepolia testnet - perfect for hackathon demos!

## 🎯 Why This Approach?

- ✅ **Real blockchain integration** - Contracts on Sepolia
- ✅ **Easier demo recording** - Run locally, control everything
- ✅ **No hosting costs** - Free for hackathon
- ✅ **Faster iteration** - Change frontend/backend instantly
- ✅ **Show real transactions** - Link to Etherscan in demo

---

## 📋 Prerequisites Checklist

### Already Have ✅
- [x] Alchemy API Key configured
- [x] Sepolia ETH in wallet
- [x] Neon Database configured
- [x] Backend .env configured
- [x] Frontend .env.local configured

### Still Need ⚠️
- [ ] WalletConnect Project ID
- [ ] Etherscan API Key
- [ ] MetaMask Private Key
- [ ] (Optional) Testnet MNEE tokens

---

## 🚀 Quick Setup (30 Minutes)

### Step 1: Get WalletConnect Project ID (2 min)

```bash
# 1. Visit: https://cloud.walletconnect.com/
# 2. Sign up (email or GitHub)
# 3. Create New Project → Name: "PayFlow"
# 4. Copy the Project ID
# 5. Add to .env.local:
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

### Step 2: Get Etherscan API Key (2 min)

```bash
# 1. Visit: https://etherscan.io/myapikey
# 2. Sign up/login
# 3. Add → Create New API Key → Name: "PayFlow"
# 4. Copy the API key
# 5. Add to contracts/.env:
ETHERSCAN_API_KEY=your_api_key_here
```

### Step 3: Export Private Key (1 min)

**⚠️ CRITICAL**: Only use a testnet wallet with ONLY Sepolia ETH!

```bash
# 1. Open MetaMask
# 2. Click three dots → Account Details
# 3. Export Private Key
# 4. Enter password
# 5. Copy the key (starts with 0x)
# 6. Add to contracts/.env:
PRIVATE_KEY=0xyour_private_key_here

# 7. Also add your wallet address:
PLATFORM_WALLET=0xYourWalletAddress
```

### Step 4: Deploy Smart Contract (5 min)

```bash
# Navigate to contracts directory
cd contracts

# Install dependencies (if not done)
npm install

# Compile contracts
npx hardhat compile
# ✅ Should see: "Compiled 1 Solidity file successfully"

# Deploy to Sepolia
npx hardhat run scripts/deploy.ts --network sepolia

# 🎯 IMPORTANT: Copy the deployed contract address!
# It will show:
# ✅ PayFlowEscrow deployed to: 0x1234567890abcdef...
```

**Save this address!** You'll need it for the next steps.

### Step 5: Verify Contract on Etherscan (5 min)

```bash
# Still in contracts/ directory
# Replace <CONTRACT_ADDRESS> with your deployed address
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> "0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF" "<YOUR_PLATFORM_WALLET>"

# Example:
npx hardhat verify --network sepolia 0x1234567890abcdef1234567890abcdef12345678 "0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF" "0xYourPlatformWallet"

# ✅ Should see: "Successfully verified contract"
# 🎯 Contract will have green checkmark on Etherscan!
```

### Step 6: Update Environment Files (2 min)

Update your deployed contract address in **3 places**:

**1. Frontend: `.env.local`**
```env
VITE_PAYFLOW_ESCROW_ADDRESS=0xYourDeployedContractAddress
```

**2. Backend: `Backend/.env`**
```env
PAYFLOW_ESCROW_ADDRESS=0xYourDeployedContractAddress
```

**3. Contracts: `contracts/.env`**
```env
PAYFLOW_ESCROW_ADDRESS=0xYourDeployedContractAddress
```

### Step 7: Start Local Services (5 min)

**Terminal 1: Backend**
```bash
cd Backend
npm install  # if not done
npm run prisma:push  # setup database
npm run dev
# ✅ Backend running on http://localhost:8001
```

**Terminal 2: Frontend**
```bash
# From root directory
npm install  # if not done
npm run dev
# ✅ Frontend running on http://localhost:3030
```

### Step 8: Test End-to-End (10 min)

1. **Open**: http://localhost:3030
2. **Connect Wallet** (MetaMask with Sepolia network)
3. **Create Invoice** with AI
4. **Copy Payment Link**
5. **Open Payment Link** (in incognito or different wallet)
6. **Deposit MNEE** (if you have testnet MNEE)
7. **Release Payment**
8. **Check Etherscan** - See your transactions!

---

## 🧪 Testing Without MNEE Tokens

If you don't have testnet MNEE yet, you can still test most features:

**What Works Without MNEE:**
- ✅ Wallet connection
- ✅ Invoice creation with AI
- ✅ Payment link sharing
- ✅ Backend API calls
- ✅ UI/UX demonstration

**What Needs MNEE:**
- ⚠️ Actual deposits
- ⚠️ Actual releases

**For Demo Video**: You can show the flow and explain "this would deposit MNEE into escrow" while showing the beautiful UI.

---

## 🎬 Recording Your Demo

With local setup, you have full control:

```bash
# Before recording:
1. Test full flow works
2. Prepare two wallets (freelancer + client)
3. Clear browser cache
4. Close unnecessary tabs
5. Practice the flow once

# During recording:
1. Show landing page
2. Create invoice with AI
3. Show payment link
4. Switch to client wallet
5. Show deposit flow (even if no MNEE)
6. Explain escrow mechanism
7. Show contract on Etherscan ✅
```

---

## 📊 What to Show in Demo/Submission

### Screenshots for Devpost:

1. **Deployed Contract on Etherscan** ⭐
   - URL: `https://sepolia.etherscan.io/address/0xYourContract`
   - Shows green checkmark ✅
   - Shows contract is verified
   - Shows transaction history

2. **Local Frontend**
   - Landing page
   - Invoice creation
   - AI generation
   - Payment page
   - Transaction modals

3. **Architecture Diagram**
   - Show: Local App → Deployed Contract → Sepolia

### Links for Devpost Submission:

```markdown
**Smart Contract (Sepolia)**: https://sepolia.etherscan.io/address/0xYourContract
**GitHub Repository**: https://github.com/yourusername/PayFlow
**Demo Video**: https://youtube.com/your-demo
**Live Demo**: "Run locally - see README for setup"
```

---

## 🔍 Verifying Your Deployment

Check these to ensure everything is working:

### Contract is Deployed ✅
```bash
# Visit Etherscan
https://sepolia.etherscan.io/address/0xYourContractAddress

# Should show:
- ✅ Contract verified (green checkmark)
- ✅ Contract code visible
- ✅ Read/Write Contract tabs available
```

### Local Frontend Connects to Contract ✅
```bash
# Check browser console
# Should see:
- ✅ "Connected to Sepolia"
- ✅ Contract address matches
- ✅ No RPC errors
```

### Backend Sees Contract ✅
```bash
# Check backend console
# Should show:
- ✅ Database connected
- ✅ Ethereum RPC connected
- ✅ Server running
```

---

## 🎯 Hackathon Submission Checklist

For MNEE-ETH Hackathon, you need:

- [x] Smart contract deployed to Sepolia ⭐
- [x] Contract verified on Etherscan ⭐
- [x] Local app works with deployed contract
- [x] README with setup instructions
- [x] Demo video (5 minutes)
- [x] Devpost submission
- [ ] GitHub repository is public
- [ ] All documentation complete

---

## 💡 Pro Tips

### Make Your Demo Stand Out:

1. **Show Real Contract on Etherscan**
   - During demo, open Etherscan
   - Show contract code is verified
   - Explain the escrow logic

2. **Explain the Tech**
   - "Smart contract holds MNEE in trustless escrow"
   - "Only releases when client approves"
   - "All transactions visible on-chain"

3. **Highlight MNEE Integration**
   - Show MNEE token address
   - Explain stablecoin benefits
   - Show low fees

4. **Show AI Features**
   - Generate invoice with natural language
   - Show professional output
   - Compare to manual creation

---

## 🐛 Troubleshooting

### "Contract deployment failed"
```bash
# Check:
1. Do you have Sepolia ETH? (check on Etherscan)
2. Is PRIVATE_KEY correct in contracts/.env?
3. Is SEPOLIA_RPC_URL correct?

# Try:
npx hardhat run scripts/deploy.ts --network sepolia
```

### "Verification failed"
```bash
# Wait 1-2 minutes after deployment
# Then retry:
npx hardhat verify --network sepolia <ADDRESS> "0x8cce..." "0xYour..."
```

### "Cannot connect wallet"
```bash
# Check:
1. Is VITE_WALLETCONNECT_PROJECT_ID in .env.local?
2. Are you on Sepolia network in MetaMask?
3. Did you restart frontend after .env change?
```

### "MNEE balance not showing"
```bash
# You need testnet MNEE tokens
# Contact hackathon organizers
# OR show demo without actual tokens
```

---

## 📝 Example Demo Script

```
"Hi, I'm [Name] and this is PayFlow. [Open local app]

I've deployed a real smart contract to Sepolia testnet.
[Show Etherscan with verified contract ✅]

Let me create an invoice using AI. I'll just describe my project...
[Type in AI prompt, show generation]

The AI created professional milestones in seconds. Now I'll share
this with my client. [Copy payment link]

When my client opens this link [switch to incognito], they see
a beautiful payment page. They connect their wallet...
[Show RainbowKit modal]

They can deposit MNEE into the smart contract. The funds are
held in trustless escrow - neither party can access them until
both agree. [Show escrow UI]

After I complete work, the client releases payment. It's instant,
and you can see all transactions on Etherscan. [Show Etherscan]

All of this for just 1% fee, compared to 3-5% for traditional
escrow. That's PayFlow!"
```

---

## 🎊 You're Ready!

Once you have:
- ✅ WalletConnect Project ID
- ✅ Etherscan API Key
- ✅ Private Key configured
- ✅ Contract deployed & verified
- ✅ Local app running

You have everything needed for an excellent hackathon submission! 🚀

---

## 📞 Quick Reference

**Get WalletConnect ID**: https://cloud.walletconnect.com/
**Get Etherscan Key**: https://etherscan.io/myapikey
**Get Sepolia ETH**: https://sepoliafaucet.com/
**Check Contract**: https://sepolia.etherscan.io/
**Your Contract**: (Add after deployment)

---

**Good luck with your submission!** 💪
