import Link from 'next/link';

export default function ShowcasePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <header className="px-6 py-12 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            First Wallet-Aware Learn-to-Earn Survey Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Sophisticated behavioral targeting based on on-chain activity. 
            Reward users with crypto for survey participation. 
            Deploy anywhere - websites, Farcaster, social feeds.
          </p>
          
          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-3xl font-bold text-blue-600">6</h3>
              <p className="text-gray-600">Behavioral Segments</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-3xl font-bold text-green-600">2</h3>
              <p className="text-gray-600">Deployment Methods</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-3xl font-bold text-purple-600">∞</h3>
              <p className="text-gray-600">Integration Possibilities</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/showcase/demo-react" 
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
              Try React Demo
            </Link>
            <Link href="/showcase/demo-frame" 
                  className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors">
              Try Frame Demo
            </Link>
            <Link href="/showcase/comparison" 
                  className="bg-gray-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-700 transition-colors">
              Compare Both
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Wallet-Aware Surveys?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon="🎯"
              title="Behavioral Targeting"
              description="Target users based on actual on-chain behavior: DeFi activity, token holdings, protocol usage"
            />
            <FeatureCard 
              icon="💰"
              title="Crypto Rewards"
              description="Reward survey completion with ETH/USDC. Users earn while providing valuable feedback"
            />
            <FeatureCard 
              icon="🔒"
              title="Anti-Sybil Protection"
              description="Block fresh wallets and farming attempts. Only legitimate crypto users participate"
            />
            <FeatureCard 
              icon="🌐"
              title="Universal Deployment"
              description="Same system works on websites, Farcaster frames, and direct browser access"
            />
            <FeatureCard 
              icon="⚡"
              title="One-Line Integration"
              description="Add to any website with a single script tag. No backend required"
            />
            <FeatureCard 
              icon="📊"
              title="Rich Analytics"
              description="Understand your audience through behavioral segments and targeting data"
            />
          </div>
        </div>
      </section>

      {/* Behavioral Segments */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Behavioral Targeting Segments
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SegmentCard 
              title="Yield Optimizer"
              description=">$50k in lending positions"
              example="Advanced yield farming strategies"
              color="green"
            />
            <SegmentCard 
              title="Yield Curious" 
              description="High portfolio, zero DeFi"
              example="Why aren't you earning yield?"
              color="blue"
            />
            <SegmentCard 
              title="Memecoin Degen"
              description=">20% portfolio in memecoins"
              example="Memecoin sentiment and trends"
              color="yellow"
            />
            <SegmentCard 
              title="Conservative DeFi"
              description="Only blue-chip protocols"
              example="Safe yield opportunities"
              color="purple"
            />
            <SegmentCard 
              title="NFT Collector"
              description="Significant NFT holdings"
              example="NFT utility and preferences"
              color="pink"
            />
            <SegmentCard 
              title="Beginner"
              description="New to crypto"
              example="Onboarding and education"
              color="gray"
            />
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Use Case Diversity
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-8">
              <h3 className="text-xl font-bold text-blue-800 mb-4">Client Research</h3>
              <ul className="space-y-2 text-blue-700">
                <li>• Understand crypto user behavior patterns</li>
                <li>• Segment audiences by on-chain activity</li>
                <li>• Collect high-quality feedback with crypto incentives</li>
                <li>• Anti-sybil protection ensures data integrity</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-8">
              <h3 className="text-xl font-bold text-purple-800 mb-4">Easy Integration</h3>
              <ul className="space-y-2 text-purple-700">
                <li>• One script tag for any website</li>
                <li>• Native Farcaster frame deployment</li>
                <li>• No backend development required</li>
                <li>• White-label customization options</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-6 py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Revolutionize User Research?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Join the future of wallet-aware surveys and crypto-incentivized feedback
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/showcase/demo-react" 
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors">
              See Live Demo
            </Link>
            <Link href="/showcase/comparison" 
                  className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Compare Features
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: {
  icon: string;
  title: string; 
  description: string;
}) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function SegmentCard({ title, description, example, color }: {
  title: string;
  description: string;
  example: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    green: 'bg-green-50 border-green-200 text-green-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800', 
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800',
    pink: 'bg-pink-50 border-pink-200 text-pink-800',
    gray: 'bg-gray-50 border-gray-200 text-gray-800'
  };
  
  return (
    <div className={`rounded-lg p-6 border-2 ${colorClasses[color]}`}>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm mb-3">{description}</p>
      <p className="text-xs font-medium">Survey: "{example}"</p>
    </div>
  );
}
