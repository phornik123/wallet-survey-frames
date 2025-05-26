import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json();
    
    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    // GraphQL query for Zapper API
    const query = `
      query TokenBalances($addresses: [Address!]!, $first: Int) {
        portfolioV2(addresses: $addresses) {
          tokenBalances {
            totalBalanceUSD
            byToken(first: $first) {
              edges {
                node {
                  symbol
                  balance
                  balanceUSD
                  name
                  network {
                    name
                  }
                }
              }
            }
          }
          appBalances {
            totalBalanceUSD
            byApp(first: 5) {
              edges {
                node {
                  app {
                    displayName
                  }
                  balanceUSD
                  network {
                    name
                  }
                }
              }
            }
          }
        }
      }
    `;

    // Call Zapper GraphQL API with 10-second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const zapperResponse = await fetch('https://public.zapper.xyz/graphql', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'x-zapper-api-key': process.env.ZAPPER_API_KEY || '',
        },
        body: JSON.stringify({
          query,
          variables: {
            addresses: [walletAddress],
            first: 10
          }
        })
      });

      clearTimeout(timeoutId);

      if (!zapperResponse.ok) {
        throw new Error(`Zapper API failed with status: ${zapperResponse.status}`);
      }

      const data = await zapperResponse.json();
      
      // Check for GraphQL errors
      if (data.errors) {
        throw new Error(`GraphQL errors: ${data.errors.map((e: any) => e.message).join(', ')}`);
      }

      // Process and return simplified profile
      const profile = processZapperData(data.data);

      return NextResponse.json(profile);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        throw new Error('Request timeout - profile loading took too long');
      }
      throw fetchError;
    }
  } catch (error: any) {
    console.error('Wallet profile API error:', error);
    return NextResponse.json(
      { error: 'Profile unavailable', details: error.message }, 
      { status: 500 }
    );
  }
}

// Helper function to process Zapper GraphQL response
function processZapperData(data: any) {
  try {
    const portfolio = data?.portfolioV2;
    if (!portfolio) {
      throw new Error('No portfolio data found');
    }

    return {
      totalValue: extractTotalValue(portfolio),
      topTokens: extractTopTokens(portfolio),
      defiPositions: extractDefiPositions(portfolio),
      chains: extractChains(portfolio)
    };
  } catch (error) {
    console.error('Error processing Zapper data:', error);
    return {
      totalValue: 0,
      topTokens: [],
      defiPositions: [],
      chains: []
    };
  }
}

// Helper function to extract total portfolio value
function extractTotalValue(portfolio: any): number {
  try {
    const tokenBalance = portfolio?.tokenBalances?.totalBalanceUSD || 0;
    const appBalance = portfolio?.appBalances?.totalBalanceUSD || 0;
    return Number(tokenBalance) + Number(appBalance);
  } catch (error) {
    console.error('Error extracting total value:', error);
    return 0;
  }
}

// Helper function to extract top 5 tokens by value
function extractTopTokens(portfolio: any): Array<{ symbol: string; balance: string; value: number }> {
  try {
    const tokens: Array<{ symbol: string; balance: string; value: number }> = [];
    
    const tokenEdges = portfolio?.tokenBalances?.byToken?.edges || [];
    
    tokenEdges.forEach((edge: any) => {
      const node = edge.node;
      if (node.symbol && node.balanceUSD > 0) {
        tokens.push({
          symbol: node.symbol,
          balance: node.balance || '0',
          value: Number(node.balanceUSD) || 0
        });
      }
    });

    // Sort by value and return top 5
    return tokens
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  } catch (error) {
    console.error('Error extracting top tokens:', error);
    return [];
  }
}

// Helper function to extract DeFi protocol positions
function extractDefiPositions(portfolio: any): Array<{ protocol: string; value: number; type: string }> {
  try {
    const positions: Array<{ protocol: string; value: number; type: string }> = [];
    
    const appEdges = portfolio?.appBalances?.byApp?.edges || [];
    
    appEdges.forEach((edge: any) => {
      const node = edge.node;
      if (node.app?.displayName && node.balanceUSD > 0) {
        positions.push({
          protocol: node.app.displayName,
          value: Number(node.balanceUSD) || 0,
          type: 'DeFi'
        });
      }
    });
    
    return positions
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 DeFi positions
  } catch (error) {
    console.error('Error extracting DeFi positions:', error);
    return [];
  }
}

// Helper function to extract active blockchain networks
function extractChains(portfolio: any): string[] {
  try {
    const chains = new Set<string>();
    
    // Get chains from token balances
    const tokenEdges = portfolio?.tokenBalances?.byToken?.edges || [];
    tokenEdges.forEach((edge: any) => {
      if (edge.node?.network?.name) {
        chains.add(edge.node.network.name);
      }
    });
    
    // Get chains from app balances
    const appEdges = portfolio?.appBalances?.byApp?.edges || [];
    appEdges.forEach((edge: any) => {
      if (edge.node?.network?.name) {
        chains.add(edge.node.network.name);
      }
    });
    
    return Array.from(chains).slice(0, 5); // Top 5 chains
  } catch (error) {
    console.error('Error extracting chains:', error);
    return [];
  }
}
