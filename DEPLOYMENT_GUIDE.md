# PayFlow Smart Contract Deployment Guide

This guide walks you through deploying the PayFlowEscrow contract to Sepolia testnet for the MNEE-ETH Hackathon.

## 📋 Prerequisites

Before deploying, you need:

### 1. Testnet ETH for Gas Fees
- Go to [Sepolia Faucet](https://sepoliafaucet.com/)
- Connect your wallet and request test ETH
- You'll need approximately 0.02-0.05 Sepolia ETH for deployment + verification

### 2. Alchemy API Key (Free)
- Visit [Alchemy](https://www.alchemy.com/)
- Sign up and create a new app
- Select "Ethereum" → "Sepolia" network
- Copy your API key from the dashboard

### 3. Etherscan API Key (Free)
- Visit [Etherscan API](https://etherscan.io/myapikey)
- Sign up and create a new API key
- Copy the API key

### 4. Wallet Private Key
- Open MetaMask
- Click the three dots → Account details → Export Private Key
- Enter password and copy the key
- **⚠️ SECURITY: Use a testnet-only wallet, never your main wallet!**

### 5. Testnet MNEE Tokens
- Contact MNEE-ETH hackathon organizers for testnet MNEE token address
- Request testnet MNEE tokens to test deposits
- Update `MNEE_TOKEN_ADDRESS` in `.env` if different from mainnet

## 🚀 Deployment Steps

### Step 1: Configure Environment Variables

Navigate to the contracts directory and update `.env`:

```bash
cd contracts
nano .env  # or use your preferred editor
```

Replace the placeholder values:
- `YOUR_ALCHEMY_API_KEY` - Your Alchemy API key
- `YOUR_PRIVATE_KEY_HERE` - Your wallet's private key (0x...)
- `YOUR_ETHERSCAN_API_KEY` - Your Etherscan API key
- `YOUR_WALLET_ADDRESS_HERE` - Your wallet address for platform fees (0x...)
- `MNEE_TOKEN_ADDRESS` - Update if testnet MNEE address is different

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Compile Contracts

```bash
npx hardhat compile
```

Expected output:
```
Compiled 1 Solidity file successfully
```

### Step 4: Deploy to Sepolia

```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

Expected output:
```
====================================
PayFlow Escrow Contract Deployment
====================================

MNEE Token Address: 0x8cce...
Platform Wallet: 0xYour...

Deploying PayFlowEscrow contract...
✅ PayFlowEscrow deployed to: 0x1234567890abcdef...

====================================
Contract Information:
====================================
Contract Address: 0x1234567890abcdef...
MNEE Token: 0x8cce...
Platform Wallet: 0xYour...
Platform Fee: 1%
```

**🎯 IMPORTANT:** Copy the deployed contract address!

### Step 5: Verify Contract on Etherscan

Replace `<CONTRACT_ADDRESS>`, `<MNEE_ADDRESS>`, and `<PLATFORM_WALLET>` with your actual values:

```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> "<MNEE_ADDRESS>" "<PLATFORM_WALLET>"
```

Example:
```bash
npx hardhat verify --network sepolia 0x1234567890abcdef1234567890abcdef12345678 "0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF" "0xYourWalletAddress"
```

Expected output:
```
Successfully verified contract on Etherscan.
https://sepolia.etherscan.io/address/0x1234...#code
```

### Step 6: Update Frontend Environment

Go back to the root directory and update frontend `.env.local`:

```bash
cd ..
nano .env.local
```

Update these values:
```env
VITE_PAYFLOW_ESCROW_ADDRESS=0xYourDeployedContractAddress
VITE_ALCHEMY_API_KEY=your_alchemy_api_key
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

Get WalletConnect Project ID from: https://cloud.walletconnect.com/

### Step 7: Update Contracts Environment

Update `contracts/.env` with the deployed address:

```env
PAYFLOW_ESCROW_ADDRESS=0xYourDeployedContractAddress
```

## ✅ Verification Checklist

After deployment, verify:

- [ ] Contract deployed successfully on Sepolia
- [ ] Contract verified on Etherscan (green checkmark)
- [ ] Frontend `.env.local` updated with contract address
- [ ] Contracts `.env` updated with contract address
- [ ] You can view your contract at: `https://sepolia.etherscan.io/address/<YOUR_ADDRESS>`
- [ ] Contract shows correct MNEE token address
- [ ] Contract shows correct platform wallet
- [ ] Platform fee is set to 1% (100 basis points)

## 🧪 Testing the Deployment

### Test 1: Create Invoice on Frontend
1. Run frontend: `npm run dev`
2. Connect your wallet
3. Create a test invoice with 1-2 milestones
4. Copy the invoice ID from the network tab

### Test 2: Verify Invoice on Etherscan
1. Go to your contract on Etherscan
2. Click "Read Contract"
3. Call `getInvoice` with your invoice ID
4. Verify the invoice data is correct

### Test 3: Request Testnet MNEE
1. Contact hackathon organizers for testnet MNEE
2. Ask them to send testnet MNEE to your wallet
3. Verify balance on Etherscan

### Test 4: Test Full Payment Flow (if you have testnet MNEE)
1. Create an invoice as freelancer
2. Share payment link with client (or use different wallet)
3. Client deposits milestone
4. Freelancer requests release
5. Client releases payment
6. Verify funds received minus 1% platform fee

## 🐛 Troubleshooting

### Error: "insufficient funds for gas"
- Get more Sepolia ETH from faucet
- Try again after ~1 minute

### Error: "invalid API key"
- Double-check Alchemy API key in `.env`
- Ensure no extra spaces or quotes

### Error: "MNEE token not found"
- Verify MNEE token address is correct
- Check if you're using mainnet vs testnet address

### Verification Failed
- Wait 1-2 minutes after deployment before verifying
- Ensure constructor arguments match deployment script
- Check Etherscan API key is valid

### Contract Interaction Failed
- Ensure you have MNEE tokens for testing
- Check wallet is connected to Sepolia network
- Verify contract address in frontend .env

## 📚 Next Steps

After successful deployment:

1. ✅ **Test End-to-End Flow** - Create invoice, deposit, release
2. ✅ **Deploy Backend** - Deploy backend to Railway/Render
3. ✅ **Deploy Frontend** - Deploy frontend to Vercel
4. ✅ **Create Demo Video** - Record 5-minute walkthrough
5. ✅ **Submit to Devpost** - Complete submission with all materials

## 🔗 Useful Links

- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Alchemy Dashboard](https://dashboard.alchemy.com/)
- [Etherscan Sepolia](https://sepolia.etherscan.io/)
- [WalletConnect Cloud](https://cloud.walletconnect.com/)
- [Hardhat Documentation](https://hardhat.org/docs)

## 🆘 Need Help?

- Check [HACKATHON_ASSESSMENT.md](./HACKATHON_ASSESSMENT.md) for full project roadmap
- Review [BACKEND_IMPLEMENTATION.md](./BACKEND_IMPLEMENTATION.md) for API docs
- Contact MNEE-ETH hackathon organizers for testnet MNEE tokens

---

**⚠️ SECURITY REMINDER**: Never commit `.env` files with private keys to Git!
