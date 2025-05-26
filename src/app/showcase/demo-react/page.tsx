'use client';

import { useState } from 'react';
import Link from 'next/link';

type ScenarioKey = 'yield-optimizer' | 'yield-curious' | 'memecoin-degen' | 'conservative-defi' | 'nft-collector' | 'beginner';

export default function ReactDemoPage() {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioKey>('yield-optimizer');
  
  const scenarios: Record<ScenarioKey, {
    title: string;
    wallet: string;
    portfolio: string;
    segment: string;
    survey: string;
    surveyTitle: string;
    reward: string;
    description: string;
  }> = {
    'yield-optimizer': {
      title: 'DeFi Yield Optimizer',
      wallet: '0xYieldOptimizer...789',
      portfolio: '$127,500',
      segment: 'yield-optimizer',
      survey: 'yield-optimizer-advanced',
      surveyTitle: 'Advanced Yield Optimization Survey',
      reward: '$5 ETH',
      description: 'Experienced DeFi user with >$50k in lending positions'
    },
    'yield-curious': {
      title: 'High Net Worth - No DeFi',
      wallet: '0xWealthyBeginner...456', 
      portfolio: '$250,000',
      segment: 'yield-curious',
      survey: 'yield-curious-onboarding',
      surveyTitle: 'DeFi Yield Exploration Survey', 
      reward: '$3 ETH',
      description: 'High portfolio value but zero DeFi experience'
    },
    'memecoin-degen': {
      title: 'Memecoin Trader',
      wallet: '0xMemecoinDegen...123',
      portfolio: '$45,000',
      segment: 'memecoin-degen',
      survey: 'memecoin-sentiment',
      surveyTitle: 'Memecoin Sentiment Survey',
      reward: '$2 ETH',
      description: '>20% of portfolio in memecoin tokens'
    },
    'conservative-defi': {
      title: 'Conservative DeFi User',
      wallet: '0xConservative...555',
      portfolio: '$85,000',
      segment: 'conservative-defi',
      survey: 'conservative-yield',
      surveyTitle: 'Conservative DeFi Strategy Survey',
      reward: '$3 ETH',
      description: 'Only uses blue-chip DeFi protocols'
    },
    'nft-collector': {
      title: 'NFT Collector',
      wallet: '0xNFTCollector...888',
      portfolio: '$65,000',
      segment: 'nft-collector',
      survey: 'nft-utility',
      surveyTitle: 'NFT Utility & Value Survey',
      reward: '$2 ETH',
      description: 'Significant NFT holdings and community involvement'
    },
    'beginner': {
      title: 'Crypto Beginner',
      wallet: '0xNewUser...999',
      portfolio: '$1,200',
      segment: 'beginner',
      survey: 'demo',
      surveyTitle: 'Demo Feedback Survey',
      reward: '$1 ETH',
      description: 'New to crypto with basic portfolio'
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">React Interface Demo</h1>
              <p className="text-gray-600">Experience the full web survey interface with behavioral targeting</p>
            </div>
            <Link href="/showcase" className="text-blue-600 hover:underline">
              ← Back to Showcase
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Scenario Selector */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-4">Test Scenarios</h2>
              <p className="text-gray-600 mb-6 text-sm">
                Select different wallet profiles to see behavioral targeting in action
              </p>
              
              <div className="space-y-3">
                {Object.entries(scenarios).map(([key, scenario]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedScenario(key as ScenarioKey)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedScenario === key 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-sm">{scenario.title}</div>
                    <div className="text-xs text-gray-600">{scenario.portfolio}</div>
                    <div className="text-xs text-blue-600 mt-1">{scenario.reward}</div>
                  </button>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2 text-sm">Current Selection:</h3>
                <div className="text-xs space-y-1">
                  <div><strong>Segment:</strong> {scenarios[selectedScenario].segment}</div>
                  <div><strong>Survey:</strong> {scenarios[selectedScenario].surveyTitle}</div>  
                  <div><strong>Reward:</strong> {scenarios[selectedScenario].reward}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Demo */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                <h2 className="text-xl font-bold">Live React Interface</h2>
                <p className="opacity-90">Real survey experience as seen by users</p>
              </div>
              
              {/* User Profile Simulation */}
              <div className="p-6 bg-gray-50 border-b">
                <h3 className="font-semibold mb-3">Simulated Wallet Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-3 rounded border">
                    <div className="text-xs text-gray-600">Wallet Address</div>
                    <div className="font-mono text-sm">{scenarios[selectedScenario].wallet}</div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="text-xs text-gray-600">Portfolio Value</div>
                    <div className="font-semibold text-green-600">{scenarios[selectedScenario].portfolio}</div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="text-xs text-gray-600">Behavioral Segment</div>
                    <div className="font-semibold text-blue-600">{scenarios[selectedScenario].segment}</div>
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  {scenarios[selectedScenario].description}
                </div>
              </div>
              
              {/* Survey iframe */}
              <div className="p-6">
                <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                  <iframe 
                    src={`/survey/${scenarios[selectedScenario].survey}?demo=true&segment=${scenarios[selectedScenario].segment}`}
                    className="w-full h-96"
                    title="React Survey Demo"
                  />
                </div>
                
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="text-green-600 mr-2">✓</div>
                    <div>
                      <div className="font-semibold text-green-800">
                        Behavioral Targeting Active
                      </div>
                      <div className="text-sm text-green-700">
                        User will receive "{scenarios[selectedScenario].surveyTitle}" based on wallet analysis
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Feature Callouts */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-blue-600 font-semibold text-sm">🎯 Smart Targeting</div>
                <div className="text-xs text-gray-600 mt-1">Survey selected based on on-chain behavior</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-green-600 font-semibold text-sm">💰 Crypto Rewards</div>
                <div className="text-xs text-gray-600 mt-1">ETH/USDC rewards for completion</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-purple-600 font-semibold text-sm">🔒 Anti-Sybil</div>
                <div className="text-xs text-gray-600 mt-1">Only legitimate wallets participate</div>
              </div>
            </div>

            {/* Integration Example */}
            <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">Website Integration</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Add this survey to any website with a single script tag:
              </p>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <div className="text-gray-500">{'<!-- Include the SDK -->'}</div>
                <div>{'<script src="https://your-domain.com/sdk/wallet-survey.js"></script>'}</div>
                <br />
                <div className="text-gray-500">{'<!-- Add survey trigger -->'}</div>
                <div>{`<div data-wallet-survey="${scenarios[selectedScenario].survey}" data-trigger="scroll" data-trigger-value="50"></div>`}</div>
                <br />
                <div className="text-gray-500">{'<!-- Initialize -->'}</div>
                <div>{'<script>'}</div>
                <div className="ml-4">{'WalletSurvey.init({'}</div>
                <div className="ml-8">{'baseUrl: "https://your-domain.com",'}</div>
                <div className="ml-8">{'onSurveyCompleted: (data) => console.log("Survey completed:", data)'}</div>
                <div className="ml-4">{'});'}</div>
                <div>{'</script>'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
