import Link from 'next/link';

export default function ComparisonPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Interface Comparison</h1>
              <p className="text-gray-600">React Web vs Farcaster Frame deployment</p>
            </div>
            <Link href="/showcase" className="text-blue-600 hover:underline">
              ← Back to Showcase
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Comparison Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <h2 className="text-2xl font-bold mb-2">Deployment Methods Comparison</h2>
            <p className="opacity-90">Same powerful system, different integration approaches</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Feature</th>
                  <th className="px-6 py-4 text-center font-semibold text-blue-600">React Web Interface</th>
                  <th className="px-6 py-4 text-center font-semibold text-purple-600">Farcaster Frame</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <ComparisonRow 
                  feature="Deployment Context"
                  react="Any website, client sites, direct access"
                  frame="Farcaster social feeds only"
                  reactGood={true}
                  frameGood={true}
                />
                <ComparisonRow 
                  feature="Integration Effort"
                  react="One script tag, 5-minute setup"
                  frame="Share URL, instant deployment"
                  reactGood={true}
                  frameGood={true}
                />
                <ComparisonRow 
                  feature="User Experience"
                  react="Full web interface, rich interactions"
                  frame="Native social experience, no app switching"
                  reactGood={true}
                  frameGood={true}
                />
                <ComparisonRow 
                  feature="Behavioral Targeting"
                  react="✓ Full 6-segment targeting"
                  frame="✓ Full 6-segment targeting"
                  reactGood={true}
                  frameGood={true}
                />
                <ComparisonRow 
                  feature="Crypto Rewards"
                  react="✓ ETH/USDC distribution"
                  frame="✓ ETH/USDC distribution"
                  reactGood={true}
                  frameGood={true}
                />
                <ComparisonRow 
                  feature="Anti-Sybil Protection"
                  react="✓ Wallet age + portfolio checks"
                  frame="✓ Wallet age + portfolio checks"
                  reactGood={true}
                  frameGood={true}
                />
                <ComparisonRow 
                  feature="Viral Potential"
                  react="Link sharing, embed codes"
                  frame="Native social sharing, feed discovery"
                  reactGood={true}
                  frameGood={true}
                />
                <ComparisonRow 
                  feature="Client Control"
                  react="Full customization, white-label options"
                  frame="Shared in client's Farcaster presence"
                  reactGood={true}
                  frameGood={true}
                />
                <ComparisonRow 
                  feature="Survey Complexity"
                  react="Multi-step, complex question types"
                  frame="Simplified, optimized for social"
                  reactGood={true}
                  frameGood={true}
                />
                <ComparisonRow 
                  feature="Analytics & Tracking"
                  react="Detailed user journey tracking"
                  frame="Social engagement metrics"
                  reactGood={true}
                  frameGood={true}
                />
              </tbody>
            </table>
          </div>
        </div>

        {/* Use Cases */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* React Use Cases */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-blue-600 rounded-full mr-3"></div>
              <h3 className="text-xl font-bold">React Web Interface</h3>
            </div>
            
            <div className="space-y-4">
              <UseCase 
                title="Marketing Agency Clients"
                description="Embed on client websites for user research and feedback collection"
                icon="🏢"
              />
              <UseCase 
                title="DeFi Protocol Research"
                description="Understand user behavior and product-market fit"
                icon="🔄"
              />
              <UseCase 
                title="Landing Page Surveys"
                description="Capture visitor insights with behavioral targeting"
                icon="📄"
              />
              <UseCase 
                title="Email Campaign Integration"
                description="Direct links to targeted surveys based on wallet analysis"
                icon="📧"
              />
              <UseCase 
                title="Comprehensive Research"
                description="Multi-step surveys with complex question flows"
                icon="📊"
              />
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="font-semibold text-blue-800 mb-2">Best For:</div>
              <div className="text-sm text-blue-700">
                Comprehensive research, detailed user journeys, client website integration, complex surveys
              </div>
            </div>
          </div>

          {/* Frame Use Cases */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-purple-600 rounded-full mr-3"></div>
              <h3 className="text-xl font-bold">Farcaster Frame</h3>
            </div>
            
            <div className="space-y-4">
              <UseCase 
                title="Social Media Campaigns"
                description="Native Farcaster integration for crypto-native audiences"
                icon="📱"
              />
              <UseCase 
                title="Community Engagement"
                description="Poll your crypto community directly in their social feed"
                icon="👥"
              />
              <UseCase 
                title="Viral Survey Distribution"
                description="Leverage social sharing for broader reach"
                icon="🔄"
              />
              <UseCase 
                title="Crypto Project Feedback"
                description="Quick pulse checks from your Farcaster followers"
                icon="💬"
              />
              <UseCase 
                title="Real-time Sentiment"
                description="Capture immediate reactions to announcements"
                icon="⚡"
              />
            </div>
            
            <div className="mt-6 p-4 bg-purple-50 rounded-lg">
              <div className="font-semibold text-purple-800 mb-2">Best For:</div>
              <div className="text-sm text-purple-700">
                Quick feedback, social engagement, crypto-native audiences, viral distribution, real-time sentiment
              </div>
            </div>
          </div>
        </div>

        {/* Technical Implementation */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Technical Implementation</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-blue-600 mb-4">🌐 React Web Integration</h3>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                <div className="text-gray-500">{'<!-- Include SDK -->'}</div>
                <div>{'<script src="https://your-domain.com/sdk/wallet-survey.js"></script>'}</div>
                <br />
                <div className="text-gray-500">{'<!-- Add trigger -->'}</div>
                <div>{'<div data-wallet-survey="demo" data-trigger="scroll" data-trigger-value="50"></div>'}</div>
                <br />
                <div className="text-gray-500">{'<!-- Initialize -->'}</div>
                <div>{'<script>'}</div>
                <div className="ml-2">{'WalletSurvey.init({'}</div>
                <div className="ml-4">{'baseUrl: "https://your-domain.com"'}</div>
                <div className="ml-2">{'});'}</div>
                <div>{'</script>'}</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-purple-600 mb-4">🖼️ Farcaster Frame</h3>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                <div className="text-gray-500">{'// Share this URL in Farcaster'}</div>
                <div>{'https://your-domain.com/api/frame?surveyId=demo'}</div>
                <br />
                <div className="text-gray-500">{'// Or embed in cast'}</div>
                <div>{'🗳️ Take our wallet survey!'}</div>
                <div>{'Earn crypto rewards 💰'}</div>
                <div>{'[Frame appears automatically]'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ROI & Benefits */}
        <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Why Both Approaches Win</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-bold mb-2">Higher Response Rates</h3>
              <p className="text-sm text-gray-600">Crypto rewards increase participation by 300%+ vs traditional surveys</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="font-bold mb-2">Better Data Quality</h3>
              <p className="text-sm text-gray-600">Anti-sybil protection eliminates fake responses and bot farming</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="font-bold mb-2">Behavioral Insights</h3>
              <p className="text-sm text-gray-600">On-chain analysis provides deeper user understanding than demographics</p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Ready to Deploy Both?</h2>
            <p className="text-lg opacity-90 mb-6">
              Same powerful system, deployed everywhere your audience is
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/showcase/demo-react" 
                    className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                Try React Demo
              </Link>
              <Link href="/showcase/demo-frame" 
                    className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                Try Frame Demo  
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComparisonRow({ feature, react, frame, reactGood, frameGood }: {
  feature: string;
  react: string; 
  frame: string;
  reactGood: boolean;
  frameGood: boolean;
}) {
  return (
    <tr>
      <td className="px-6 py-4 font-medium">{feature}</td>
      <td className={`px-6 py-4 text-center ${reactGood ? 'text-green-700' : 'text-gray-600'}`}>
        {react}
      </td>
      <td className={`px-6 py-4 text-center ${frameGood ? 'text-green-700' : 'text-gray-600'}`}>
        {frame}
      </td>
    </tr>
  );
}

function UseCase({ title, description, icon }: {
  title: string;
  description: string; 
  icon: string;
}) {
  return (
    <div className="flex items-start">
      <div className="text-2xl mr-3 mt-1">{icon}</div>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-gray-600">{description}</div>
      </div>
    </div>
  );
}
