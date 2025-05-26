# Wallet Survey Frames - Complete Platform

The first wallet-aware learn-to-earn survey system with sophisticated behavioral targeting and crypto rewards.

## Features

- **Behavioral Targeting**: 6 sophisticated segments based on on-chain activity
- **Crypto Rewards**: ETH/USDC rewards for survey completion
- **Universal Deployment**: Works on websites, Farcaster frames, and direct browser access
- **Anti-Sybil Protection**: Blocks fresh wallets and farming attempts
- **Easy Integration**: One-line embedding for client websites
- **Professional Showcase**: Complete demo platform for client presentations

## Architecture

### Universal Survey System
Single URL pattern works in three contexts:
- **React Web Interface**: Full HTML survey with wallet connection
- **Farcaster Frames**: Native frame experience in social feeds
- **Website SDK**: Embedded surveys triggered by user behavior

### Behavioral Targeting Segments
1. **Yield Optimizer**: >$50k in lending positions → Advanced yield surveys
2. **Yield Curious**: High portfolio + no DeFi → "Why not earning yield?" surveys
3. **Memecoin Degen**: >20% in memecoins → Memecoin sentiment surveys
4. **Conservative DeFi**: Only blue-chip protocols → Safe yield surveys
5. **NFT Collector**: Significant NFT holdings → NFT utility surveys
6. **Beginner**: New to crypto → Onboarding surveys

## Quick Start

### Installation
```bash
git clone https://github.com/phornik123/wallet-survey-frames.git
cd wallet-survey-frames
npm install
```

### Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Add your API keys:
# - Zapper API key for portfolio analysis
# - Reward wallet for ETH/USDC distribution
# - Optional: Etherscan API for wallet verification
```

### Development
```bash
npm run dev
# Visit http://localhost:3000
```

### Professional Showcase
```bash
# Visit the demo platform
http://localhost:3000/showcase
```

## Integration Examples

### Website SDK Integration
```html
<!-- Add to any website -->
<div 
    data-wallet-survey="demo"
    data-trigger="scroll"
    data-trigger-value="50"
></div>

<script src="https://your-domain.com/sdk/wallet-survey.js"></script>
```

### Farcaster Frame Integration
```bash
# Share this URL in Farcaster:
https://your-domain.com/survey/demo
# Automatically displays as interactive frame
```

### Direct Browser Access
```bash
# Direct survey link:
https://your-domain.com/survey/demo
# Shows full HTML survey interface
```

## Behavioral Targeting Examples

### DeFi Protocol Targeting
```javascript
// High-value DeFi users get advanced surveys
if (lendingPositions > $50000) {
  showSurvey("yield-optimizer-advanced") // $5 ETH reward
}

// High portfolio but no DeFi gets onboarding
else if (portfolioValue > $100000 && defiPositions === 0) {
  showSurvey("yield-curious-onboarding") // $3 ETH reward  
}
```

### Memecoin Trader Targeting
```javascript
// Users with significant memecoin holdings
if (memecoinsValue / portfolioValue > 0.2) {
  showSurvey("memecoin-sentiment") // $2 ETH reward
}
```

## Anti-Sybil Protection

### Eligibility Requirements
- **Wallet Age**: Minimum 30 days old
- **Portfolio Value**: Minimum $500 USD
- **Transaction Count**: Minimum 20 transactions
- **Activity Check**: Recent on-chain activity required

### Duplicate Prevention
- One reward per wallet per survey
- Cross-platform tracking (web + frames)
- Persistent wallet-based identity

## Professional Showcase

### Demo Platform Features
- **Landing Page**: Complete feature overview
- **React Demo**: Live web interface with behavioral scenarios
- **Frame Demo**: Farcaster frame simulator with social context
- **Comparison**: Side-by-side analysis of deployment methods

### Agency Presentation Ready
- Professional branding and design
- Live working demonstrations
- Clear value proposition
- Client-ready materials

## Deployment

### Vercel (Recommended)
```bash
# Deploy to Vercel
vercel --prod

# Set environment variables in Vercel dashboard:
# - ZAPPER_API_KEY
# - NEXT_PUBLIC_FRAME_URL (production URL)
# - REWARD_WALLET_PRIVATE_KEY (for rewards)
```

### Environment Variables for Production
```env
NEXT_PUBLIC_FRAME_URL=https://your-app.vercel.app
ZAPPER_API_KEY=your_zapper_api_key
REWARD_WALLET_PRIVATE_KEY=your_wallet_private_key
REWARD_WALLET_ADDRESS=your_wallet_address
```

## API Documentation

### Behavioral Analysis
```bash
POST /api/behavioral-analysis
{
  "walletAddress": "0x123..."
}

Response:
{
  "segment": "yield-optimizer",
  "isEligible": true,
  "portfolioValue": 127500,
  "walletAge": 245
}
```

### Reward Distribution
```bash
POST /api/rewards
{
  "walletAddress": "0x123...",
  "surveyId": "yield-optimizer-advanced", 
  "amount": 5
}

Response:
{
  "success": true,
  "transactionHash": "0xabc...",
  "amount": 5
}
```

### Universal Survey
```bash
# Context detection via headers:

# Farcaster Frame (returns JSON)
GET /survey/demo
Accept: application/json

# Browser/Embedded (returns HTML)  
GET /survey/demo
Accept: text/html
```

## Testing

### Local Testing
```bash
# Test React interface
http://localhost:3000/survey/demo

# Test showcase platform
http://localhost:3000/showcase

# Test SDK embedding
http://localhost:3000/demo
```

### Frame Testing
```bash
# Test frame in Farcaster by sharing:
https://your-domain.com/survey/demo
```

### Different Behavioral Scenarios
- Test with different wallet types (DeFi, NFT, memecoin holders)
- Verify targeting works correctly
- Check reward distribution

## Use Case Diversity

- **DeFi Protocols**: User research and product-market fit
- **NFT Projects**: Collector preferences and utility feedback  
- **Crypto Exchanges**: Trading behavior and feature requests
- **Web3 Startups**: Target market validation

### Deployment Strategies
- **Website Integration**: Embed on client sites for user research
- **Farcaster Marketing**: Native social media engagement
- **Email Campaigns**: Direct survey links with behavioral targeting
- **Community Research**: Poll crypto communities with rewards

## Technical Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Wallet Integration**: Viem + MetaMask
- **Portfolio Analysis**: Zapper API + GraphQL
- **Database**: JSON-based (production-ready for PostgreSQL)
- **Deployment**: Vercel-optimized

## Roadmap

### Phase 1: Enhanced Targeting ✅
- 6 behavioral segments implemented
- Anti-sybil protection active
- Universal deployment working

### Phase 2: Production Scale (Next)
- PostgreSQL database integration
- Advanced analytics dashboard
- White-label client management

### Phase 3: Enterprise Features (Future)
- Custom behavioral rules engine
- Multi-chain portfolio analysis
- Advanced reward token support

## Contributing

This is a complete, production-ready system. For customization:

1. Fork the repository
2. Update behavioral targeting rules in `/lib/survey-targeting.ts`
3. Add new survey definitions in `/data/surveys.json`
4. Customize showcase branding in `/app/showcase/`

## License

MIT License - Commercial use allowed

## Acknowledgments

- [Zapper](https://zapper.xyz) - Portfolio analysis API
- [Farcaster](https://farcaster.xyz) - Frame protocol
- [Viem](https://viem.sh) - Wallet integration
- [Next.js](https://nextjs.org) - Application framework

---

**The first wallet-aware learn-to-earn survey platform - ready for production deployment.**
