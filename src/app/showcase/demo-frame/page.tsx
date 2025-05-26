'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function FrameDemoPage() {
  const [currentFrame, setCurrentFrame] = useState('initial');
  const [selectedScenario, setSelectedScenario] = useState('yield-optimizer');
  
  const scenarios = {
    'yield-optimizer': {
      title: 'DeFi Yield Optimizer', 
      description: 'Advanced yield farming strategies survey',
      reward: '$5 ETH',
      portfolio: '$127,500'
    },
    'memecoin-degen': {
      title: 'Memecoin Trader',
      description: 'Memecoin sentiment and trends survey', 
      reward: '$2 ETH',
      portfolio: '$45,000'
    },
    'yield-curious': {
      title: 'High Net Worth - No DeFi',
      description: 'DeFi yield exploration survey',
      reward: '$3 ETH',
      portfolio: '$250,000'
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Farcaster Frame Demo</h1>
              <p className="text-gray-600">See how surveys work as native Farcaster frames</p>
            </div>
            <Link href="/showcase" className="text-blue-600 hover:underline">
              ← Back to Showcase
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        
        {/* Frame Context Explanation */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-blue-800 mb-2">
            🖼️ Farcaster Frame Experience
          </h2>
          <p className="text-blue-700 mb-4">
            Frames are interactive elements that appear directly in Farcaster feeds. 
            Users can complete surveys without leaving their social feed.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>✅ Native Social Context:</strong> Embedded in social feeds
            </div>
            <div>
              <strong>✅ Same Targeting:</strong> Behavioral analysis works the same
            </div>
            <div>
              <strong>✅ Same Rewards:</strong> ETH/USDC distribution on completion
            </div>
            <div>
              <strong>✅ Viral Potential:</strong> Easy sharing and discovery
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Frame Simulator */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
                <h2 className="text-xl font-bold">Frame Simulator</h2>
                <p className="opacity-90">How frames appear in Farcaster clients</p>
              </div>
              
              {/* Simulated Farcaster Interface */}
              <div className="p-6">
                
                {/* Fake Farcaster Post Context */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-purple-500 rounded-full mr-3 flex items-center justify-center text-white text-sm font-bold">
                      MA
                    </div>
                    <div>
                      <div className="font-semibold">Marketing Agency</div>
                      <div className="text-sm text-gray-600">@agency • 2h</div>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    🗳️ Help us understand crypto user preferences! 
                    Complete our wallet-aware survey and earn crypto rewards 👇
                  </p>
                </div>
                
                {/* Frame Display */}
                <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
                  {/* Frame Image Area */}
                  <div className="bg-gradient-to-br from-blue-400 to-purple-500 text-white p-8 text-center h-64 flex flex-col justify-center">
                    {currentFrame === 'initial' && (
                      <>
                        <h3 className="text-2xl font-bold mb-4">🗳️ Wallet Survey</h3>
                        <p className="mb-4">Connect your wallet to participate and earn rewards</p>
                        <div className="text-sm opacity-90 text-white">Behavioral targeting • Crypto rewards</div>
                      </>
                    )}
                    
                    {currentFrame === 'connected' && (
                      <>
                        <h3 className="text-xl font-bold mb-4">
                          {scenarios[selectedScenario as keyof typeof scenarios].title}
                        </h3>
                        <p className="mb-4">{scenarios[selectedScenario as keyof typeof scenarios].description}</p>
                        <div className="text-sm bg-white bg-opacity-20 rounded px-3 py-1 inline-block">
                          Reward: {scenarios[selectedScenario as keyof typeof scenarios].reward}
                        </div>
                      </>
                    )}
                    
                    {currentFrame === 'completed' && (
                      <>
                        <h3 className="text-2xl font-bold mb-4">🎉 Survey Complete!</h3>
                        <p className="mb-4">Thank you for your participation</p>
                        <div className="text-sm bg-green-500 bg-opacity-80 rounded px-3 py-1 inline-block">
                          {scenarios[selectedScenario as keyof typeof scenarios].reward} sent to your wallet
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Frame Buttons */}
                  <div className="bg-gray-50 p-4">
                    <div className="flex gap-2">
                      {currentFrame === 'initial' && (
                        <button 
                          onClick={() => setCurrentFrame('connected')}
                          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                        >
                          Connect Wallet
                        </button>
                      )}
                      
                      {currentFrame === 'connected' && (
                        <>
                          <button 
                            onClick={() => setCurrentFrame('completed')}
                            className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
                          >
                            Complete Survey
                          </button>
                          <button 
                            onClick={() => setCurrentFrame('initial')}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                          >
                            Back
                          </button>
                        </>
                      )}
                      
                      {currentFrame === 'completed' && (
                        <button 
                          onClick={() => setCurrentFrame('initial')}
                          className="flex-1 bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors"
                        >
                          Start New Survey
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Frame Interaction Stats */}
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="text-2xl font-bold text-purple-600">47</div>
                    <div className="text-xs text-gray-600">Likes</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <div className="text-xs text-gray-600">Recasts</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="text-2xl font-bold text-green-600">8</div>
                    <div className="text-xs text-gray-600">Replies</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls & Info */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Scenario Selector */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">User Scenario</h3>
              <div className="space-y-3">
                {Object.entries(scenarios).map(([key, scenario]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedScenario(key)}
                    className={`w-full text-left p-3 rounded border-2 transition-all ${
                      selectedScenario === key 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-sm">{scenario.title}</div>
                    <div className="text-xs text-gray-600">{scenario.reward}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Frame Features */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">Frame Features</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <div className="text-green-500 mr-2">✓</div>
                  <div>Native social integration</div>
                </div>
                <div className="flex items-center">
                  <div className="text-green-500 mr-2">✓</div>
                  <div>Behavioral targeting</div>
                </div>
                <div className="flex items-center">
                  <div className="text-green-500 mr-2">✓</div>
                  <div>Crypto reward distribution</div>
                </div>
                <div className="flex items-center">
                  <div className="text-green-500 mr-2">✓</div>
                  <div>Viral sharing potential</div>
                </div>
                <div className="flex items-center">
                  <div className="text-green-500 mr-2">✓</div>
                  <div>No app switching required</div>
                </div>
              </div>
            </div>

            {/* Real Frame Link */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-purple-800 mb-2">Try Real Frame</h3>
              <p className="text-sm text-purple-700 mb-4">
                Share this URL in Farcaster to see the actual frame:
              </p>
              <div className="bg-white p-2 rounded border font-mono text-xs break-all">
                https://your-domain.com/api/frame?surveyId=demo
              </div>
            </div>
          </div>
        </div>

        {/* Frame vs Web Comparison */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Frame vs Web Interface</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-purple-600 mb-4">🖼️ Farcaster Frame</h3>
              <ul className="space-y-2 text-sm">
                <li>• Native social media integration</li>
                <li>• No app switching required</li>
                <li>• Viral sharing built-in</li>
                <li>• Simplified interaction flow</li>
                <li>• Perfect for quick feedback</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-600 mb-4">🌐 Web Interface</h3>
              <ul className="space-y-2 text-sm">
                <li>• Full-featured survey experience</li>
                <li>• Rich UI and interactions</li>
                <li>• Detailed progress tracking</li>
                <li>• Complex question types</li>
                <li>• Perfect for comprehensive research</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-4">Both interfaces use the same behavioral targeting and reward system!</p>
            <Link 
              href="/showcase/comparison" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              See Detailed Comparison
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
