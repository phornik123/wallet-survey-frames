import { NextRequest, NextResponse } from 'next/server';

interface BehavioralProfile {
  segment: 'yield-optimizer' | 'yield-curious' | 'memecoin-degen' | 'conservative-defi' | 'nft-collector' | 'beginner';
  isEligible: boolean;
  reasons: string[];
  portfolioValue: number;
  walletAge: number;
  transactionCount: number;
}

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json();
    
    if (!walletAddress) {
      return NextResponse.json({ 
        segment: 'beginner',
        isEligible: false,
        reasons: ['Invalid wallet address'],
        portfolioValue: 0,
        walletAge: 0,
        transactionCount: 0
      });
    }

    // Get enhanced portfolio data from Zapper
    const zapperResponse = await fetch(
      `https://public.zapper.xyz/graphql`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-zapper-api-key': process.env.ZAPPER_API_KEY || ''
        },
        body: JSON.stringify({
          query: `
            query BehavioralAnalysis($addresses: [Address!]!) {
              portfolioV2(addresses: $addresses) {
                tokenBalances {
                  totalBalanceUSD
                  byToken(first: 50) {
                    edges {
                      node {
                        symbol
                        balance
                        balanceUSD
                        tokenAddress
                      }
                    }
                  }
                }
                appBalances {
                  totalBalanceUSD
                  byApp(first: 20) {
                    edges {
                      node {
                        balanceUSD
                        app {
                          displayName
                          category { name }
                        }
                      }
                    }
                  }
                }
              }
            }
          `,
          variables: { addresses: [walletAddress] }
        })
      }
    );

    if (!zapperResponse.ok) {
      throw new Error('Zapper API failed');
    }

    const zapperData = await zapperResponse.json();
    
    // Get wallet age and transaction count
    const walletMetrics = await getWalletMetrics(walletAddress);
    
    // Analyze behavioral profile
    const profile = analyzeBehavioralProfile(zapperData.data.portfolioV2, walletMetrics);
    
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Behavioral analysis error:', error);
    return NextResponse.json({ 
      segment: 'beginner',
      isEligible: false,
      reasons: ['Analysis failed'],
      portfolioValue: 0,
      walletAge: 0,
      transactionCount: 0
    });
  }
}

async function getWalletMetrics(walletAddress: string) {
  // Implementation: Get wallet age and transaction count
  // Use Etherscan API to get:
  // - First transaction timestamp (wallet age)
  // - Total transaction count
  
  try {
    // Get first transaction for wallet age
    const etherscanResponse = await fetch(
      `https://api.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=1&sort=asc&apikey=YourApiKeyToken`
    );
    const etherscanData = await etherscanResponse.json();
    
    const firstTx = etherscanData.result?.[0];
    const walletAge = firstTx ? Date.now() - (parseInt(firstTx.timeStamp) * 1000) : 0;
    
    // Get transaction count
    const countResponse = await fetch(
      `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionCount&address=${walletAddress}&tag=latest&apikey=YourApiKeyToken`
    );
    const countData = await countResponse.json();
    const transactionCount = parseInt(countData.result, 16);
    
    return {
      walletAge: Math.floor(walletAge / (1000 * 60 * 60 * 24)), // days
      transactionCount
    };
  } catch (error) {
    console.error('Error getting wallet metrics:', error);
    return { walletAge: 0, transactionCount: 0 };
  }
}

function analyzeBehavioralProfile(portfolioData: any, walletMetrics: any): BehavioralProfile {
  const { tokenBalances, appBalances } = portfolioData || {};
  const { walletAge, transactionCount } = walletMetrics;
  
  const portfolioValue = (tokenBalances?.totalBalanceUSD || 0) + (appBalances?.totalBalanceUSD || 0);
  
  // ELIGIBILITY CHECK (Anti-Sybil)
  const isEligible = walletAge >= 30 && portfolioValue >= 500 && transactionCount >= 20;
  
  if (!isEligible) {
    return {
      segment: 'beginner',
      isEligible: false,
      reasons: [
        walletAge < 30 ? 'Wallet too new (< 30 days)' : '',
        portfolioValue < 500 ? 'Portfolio too small (< $500)' : '',
        transactionCount < 20 ? 'Not enough transactions (< 20)' : ''
      ].filter(Boolean),
      portfolioValue,
      walletAge,
      transactionCount
    };
  }
  
  // BEHAVIORAL ANALYSIS
  const lendingPositions = calculateLendingPositions(appBalances);
  const memecoinsValue = calculateMemecoinsValue(tokenBalances);
  const nftValue = 0; // Add NFT analysis if needed
  
  let segment: BehavioralProfile['segment'] = 'beginner';
  
  // Yield Optimizer: >$50k in lending positions
  if (lendingPositions > 50000) {
    segment = 'yield-optimizer';
  }
  // Yield Curious: High portfolio but zero lending
  else if (portfolioValue > 100000 && lendingPositions === 0) {
    segment = 'yield-curious';
  }
  // Memecoin Degen: >20% in memecoins
  else if (memecoinsValue / portfolioValue > 0.2) {
    segment = 'memecoin-degen';
  }
  // Conservative DeFi: Only blue-chip protocols
  else if (lendingPositions > 0 && hasOnlyBlueChipProtocols(appBalances)) {
    segment = 'conservative-defi';
  }
  // NFT Collector: Significant NFT holdings
  else if (nftValue > 10000) {
    segment = 'nft-collector';
  }
  
  return {
    segment,
    isEligible: true,
    reasons: [`Classified as ${segment}`],
    portfolioValue,
    walletAge,
    transactionCount
  };
}

function calculateLendingPositions(appBalances: any): number {
  if (!appBalances?.byApp?.edges) return 0;
  
  let lendingValue = 0;
  for (const edge of appBalances.byApp.edges) {
    const app = edge.node;
    const appName = app.app.displayName.toLowerCase();
    const category = app.app.category?.name?.toLowerCase() || '';
    
    // Check if it's a lending protocol
    if (appName.includes('aave') || 
        appName.includes('compound') || 
        appName.includes('maker') ||
        category.includes('lending')) {
      lendingValue += app.balanceUSD;
    }
  }
  
  return lendingValue;
}

function calculateMemecoinsValue(tokenBalances: any): number {
  if (!tokenBalances?.byToken?.edges) return 0;
  
  const memecoins = ['DOGE', 'SHIB', 'PEPE', 'FLOKI', 'BONK', 'WIF', 'POPCAT'];
  let memeValue = 0;
  
  for (const edge of tokenBalances.byToken.edges) {
    const token = edge.node;
    if (memecoins.includes(token.symbol)) {
      memeValue += token.balanceUSD;
    }
  }
  
  return memeValue;
}

function hasOnlyBlueChipProtocols(appBalances: any): boolean {
  if (!appBalances?.byApp?.edges) return false;
  
  const blueChipProtocols = ['aave', 'compound', 'uniswap', 'curve', 'maker'];
  
  for (const edge of appBalances.byApp.edges) {
    const appName = edge.node.app.displayName.toLowerCase();
    const isBlueChip = blueChipProtocols.some(protocol => appName.includes(protocol));
    if (!isBlueChip) return false;
  }
  
  return true;
}
