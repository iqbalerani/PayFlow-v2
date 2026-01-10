# PayFlow - 5-Minute Demo Video Script

**Total Duration**: 4:45 (under 5-minute hackathon requirement)

---

## 📹 Scene 1: Introduction (0:00 - 0:30)

**Screen**: Landing page at https://payflow.vercel.app

**Script**:
> "Hi! I'm [Your Name], and I built PayFlow for the MNEE-ETH Hackathon. PayFlow solves a major problem in freelancing: payment disputes. Freelancers risk working for free, and clients risk losing deposits to unfinished work. PayFlow uses blockchain escrow with MNEE stablecoin to protect both parties."

**Visuals**:
- Show PayFlow landing page
- Scroll through features
- Highlight key points: "Trustless Escrow", "AI-Powered", "1% Fee"

---

## 📹 Scene 2: The Problem (0:30 - 1:00)

**Screen**: Show statistics or animation

**Script**:
> "Traditional escrow services charge 3-5% fees and take days to settle. Creating professional invoices takes hours. PayFlow automates invoice generation with AI and settles payments instantly for just 1% - the lowest fee in the industry. Let me show you how it works."

**Visuals**:
- Quick comparison table: Traditional vs. PayFlow
- Show: 3-5% → 1%, Days → Seconds, Manual → AI-Powered

---

## 📹 Scene 3: Freelancer Journey - Connect Wallet (1:00 - 1:20)

**Screen**: Navigation to auth page

**Script**:
> "First, I'll connect my wallet as a freelancer. PayFlow uses RainbowKit for seamless wallet connection - supporting MetaMask, WalletConnect, Coinbase Wallet, and more."

**Actions**:
1. Click "Get Started"
2. Click "Connect Wallet to Sign In"
3. Show wallet connection modal
4. Connect wallet
5. Show successful authentication
6. Land on dashboard

**Visuals**:
- Highlight smooth UX
- Show wallet connection flow
- Display dashboard with clean interface

---

## 📹 Scene 4: AI Invoice Generation (1:20 - 2:00)

**Screen**: Create Invoice page

**Script**:
> "Now I'll create an invoice. Instead of filling out forms, I just describe my project in natural language, and AI generates a professional invoice with milestones."

**Actions**:
1. Click "Create Invoice"
2. Type in AI prompt: "Build a responsive e-commerce website with payment integration and admin dashboard for a boutique clothing store. 3 milestones."
3. Click "Generate with AI"
4. Show AI generating invoice
5. Review generated invoice with 3 milestones
6. Click "Create Invoice"

**Visuals**:
- Show AI generating animation
- Highlight auto-generated milestones
- Show professional invoice structure

**Script (cont.)**:
> "The AI created a perfect invoice with three milestones: design, development, and deployment - each with optimal pricing. This would've taken me 30 minutes manually."

---

## 📹 Scene 5: Share Payment Link (2:00 - 2:15)

**Screen**: Invoice Details page

**Script**:
> "Now I need to get paid. PayFlow generates a secure payment link that I can share with my client. They don't even need an account - just a Web3 wallet."

**Actions**:
1. Show invoice details page
2. Click "Copy Client Link"
3. Show link copied notification
4. Display the payment link format: `payflow.vercel.app/#pay/INV-2026-123`

**Visuals**:
- Highlight shareable link feature
- Show professional invoice UI

---

## 📹 Scene 6: Client Payment Flow (2:15 - 3:15)

**Screen**: Switch to client view (incognito or different browser)

**Script**:
> "Let's see the client side. When my client receives the link, they see a beautiful payment page with all invoice details. Let me connect a different wallet to act as the client."

**Actions**:
1. Open payment link in incognito/new browser
2. Show client payment page
3. Click "Connect Wallet to Pay"
4. Connect different wallet (client wallet)
5. Show MNEE balance
6. Click "Pay Milestone" on first milestone
7. Show approval modal
8. Approve MNEE spending
9. Confirm deposit transaction
10. Show "Payment successful! Funds are now in escrow" message

**Visuals**:
- Highlight professional client-facing UI
- Show transaction modal flow
- Display esrow confirmation
- Show milestone status change to "In Escrow"

**Script (cont.)**:
> "The client approves MNEE spending, deposits into the smart contract escrow, and the funds are locked securely. I can see them in escrow but can't withdraw until the client approves release."

---

## 📹 Scene 7: Milestone Completion & Release (3:15 - 4:00)

**Screen**: Back to freelancer view

**Script**:
> "After I complete the first milestone, I request release. The client reviews my work and approves payment."

**Actions (Freelancer view)**:
1. Switch back to freelancer wallet/browser
2. Show invoice details refreshed - milestone shows "In Escrow"
3. Click "Request Release" button
4. Show "Release request sent to client!" notification

**Actions (Client view)**:
5. Switch to client browser
6. Refresh payment page
7. Show milestone status "Approve & Release" button
8. Click "Approve & Release"
9. Show release confirmation modal
10. Click "Confirm & Release Funds"
11. Show transaction processing
12. Show "Milestone released successfully!" message

**Actions (Freelancer view)**:
13. Switch back to freelancer view
14. Show dashboard updated with payment received
15. Highlight 1% platform fee deduction

**Visuals**:
- Show smooth state updates
- Display transaction confirmation
- Highlight instant settlement

**Script (cont.)**:
> "The funds are released instantly from escrow to my wallet, minus the 1% platform fee. The entire process took seconds, not days like traditional escrow."

---

## 📹 Scene 8: Technical Highlights (4:00 - 4:30)

**Screen**: Quick screen recording or slides

**Script**:
> "Let me quickly show you the tech behind PayFlow. We have a Solidity smart contract deployed on Sepolia that handles all escrow logic. The frontend uses wagmi and RainbowKit for Web3, React with TypeScript, and Google Gemini for AI. The backend runs on Express with Prisma and PostgreSQL, hosted on Railway. Everything is open source."

**Visuals**:
- Quick flash of Etherscan contract page
- Show GitHub repository
- Display architecture diagram (from README)
- Show: Smart Contract → Frontend → Backend → Database

---

## 📹 Scene 9: Closing & Call to Action (4:30 - 4:45)

**Screen**: Back to landing page or dashboard

**Script**:
> "PayFlow combines the best of Web3 and AI to solve real problems for freelancers. It's trustless, transparent, and takes just 1% fee. With MNEE stablecoin, payments are stable and global. Check out the links in the description to try it yourself, view the code, or deploy your own instance. Thanks for watching, and I hope you'll consider PayFlow for the hackathon prizes!"

**Visuals**:
- Show landing page again
- Display on-screen text:
  - 🌐 Live Demo: payflow.vercel.app
  - 💻 GitHub: github.com/yourusername/PayFlow
  - 📺 Devpost: devpost.com/software/payflow
  - 🔗 Contract: sepolia.etherscan.io/address/0x...

**End Screen** (5 seconds):
- PayFlow logo
- "Built with MNEE Stablecoin"
- All links visible
- Fade to black

---

## 📋 Recording Checklist

### Pre-Recording

- [ ] Deploy latest version to production
- [ ] Test full flow end-to-end (no errors!)
- [ ] Prepare two wallets:
  - Freelancer wallet with Sepolia ETH
  - Client wallet with testnet MNEE
- [ ] Have invoice prompt ready to copy-paste
- [ ] Clear browser cache for fresh demo
- [ ] Close unnecessary browser tabs
- [ ] Set display to 1920x1080 resolution
- [ ] Use 60fps screen recording
- [ ] Test microphone audio quality

### Recording Tools

**Recommended**:
- **macOS**: QuickTime / ScreenFlow / Camtasia
- **Windows**: OBS Studio / Camtasia
- **Linux**: OBS Studio / SimpleScreenRecorder

**Settings**:
- Resolution: 1920x1080 (Full HD)
- Frame rate: 60fps
- Audio: Clear voiceover (use good microphone)
- Format: MP4 (H.264 codec)

### During Recording

- [ ] Speak clearly and at moderate pace
- [ ] Pause between scenes for editing
- [ ] Show all UI interactions clearly
- [ ] Avoid dead air (keep talking)
- [ ] Smile in your voice (it shows!)
- [ ] If you make a mistake, pause and restart that scene

### Post-Production

- [ ] Cut out any errors or long waits
- [ ] Add smooth transitions between scenes
- [ ] Add background music (royalty-free, low volume)
- [ ] Add on-screen text for key points
- [ ] Add captions/subtitles (optional but recommended)
- [ ] Export in 1080p at 60fps
- [ ] Keep file size under 100MB (Devpost requirement)
- [ ] Upload to YouTube (unlisted or public)
- [ ] Add to Devpost submission

### Music Recommendations (Royalty-Free)

- YouTube Audio Library
- Epidemic Sound (trial)
- Artlist (trial)
- Free Music Archive

**Style**: Upbeat, tech, minimal, non-distracting

---

## 🎬 Alternative: Shorter 3-Minute Version

If 5 minutes feels too long, use this condensed version:

**0:00-0:20**: Intro + Problem (combine scenes 1-2)
**0:20-0:50**: Create invoice with AI (scene 4)
**0:50-1:40**: Client pays milestone (scene 6)
**1:40-2:20**: Release payment (scene 7)
**2:20-2:50**: Tech stack overview (scene 8)
**2:50-3:00**: Call to action (scene 9)

---

## 📝 Script Tips

1. **Energy**: Keep energy high throughout
2. **Clarity**: Speak clearly, avoid jargon
3. **Pacing**: Don't rush, but keep it moving
4. **Emphasis**: Highlight key features (AI, 1% fee, instant)
5. **Personality**: Be yourself, show enthusiasm
6. **Call to Action**: End strong with clear next steps

---

## 🎯 Key Points to Emphasize

- ✅ **Trustless escrow** - No centralized party holds funds
- ✅ **1% fee** - Industry-lowest (vs 3-5% traditional)
- ✅ **AI-powered** - 30-minute task done in 30 seconds
- ✅ **MNEE integration** - Stable, global payments
- ✅ **Instant settlement** - Seconds, not days
- ✅ **Beautiful UX** - Professional, modern interface
- ✅ **Open source** - Anyone can deploy and use

---

## 🚀 Good Luck!

Remember: The demo video is often the FIRST thing judges watch. Make it count!

**Pro Tip**: Record 2-3 takes and pick the best one. Natural enthusiasm beats perfect scripting.
