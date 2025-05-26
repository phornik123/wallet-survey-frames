'use client';

import { useEffect, useState } from 'react';

export default function DemoPage() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Listen for SDK events
    if (typeof window !== 'undefined' && window.walletSurvey) {
      window.walletSurvey.on('survey_triggered', (data: any) => {
        addLog(`Survey triggered: ${data.surveyId}`);
      });

      window.walletSurvey.on('survey_completed', (data: any) => {
        addLog(`Survey completed: ${data.surveyId} by ${data.data.walletAddress}`);
      });

      window.walletSurvey.on('survey_closed', (data: any) => {
        addLog(`Survey closed: ${data.surveyId}`);
      });

      window.walletSurvey.on('survey_error', (data: any) => {
        addLog(`Survey error: ${data.surveyId} - ${data.error}`);
      });
    }
  }, []);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const triggerManualSurvey = () => {
    if (typeof window !== 'undefined' && window.walletSurvey) {
      window.walletSurvey.trigger('demo');
      addLog('Manually triggered demo survey');
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Wallet Survey SDK Demo
          </h1>
          <p className="mt-2 text-gray-600">
            This page demonstrates how to integrate wallet surveys into any website using our JavaScript SDK.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Integration Examples */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                🚀 Integration Examples
              </h2>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-medium text-gray-800 mb-2">1. Scroll Trigger (50%)</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Survey triggers when user scrolls 50% down the page
                  </p>
                  <code className="text-xs bg-gray-800 text-green-400 p-2 rounded block">
                    {`<div data-wallet-survey="demo" 
     data-trigger="scroll" 
     data-trigger-value="50"></div>`}
                  </code>
                </div>

                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-medium text-gray-800 mb-2">2. Time Trigger (10 seconds)</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Survey triggers after 10 seconds on page
                  </p>
                  <code className="text-xs bg-gray-800 text-green-400 p-2 rounded block">
                    {`<div data-wallet-survey="demo" 
     data-trigger="time" 
     data-trigger-value="10"></div>`}
                  </code>
                </div>

                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-medium text-gray-800 mb-2">3. Exit Intent</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Survey triggers when mouse leaves viewport
                  </p>
                  <code className="text-xs bg-gray-800 text-green-400 p-2 rounded block">
                    {`<div data-wallet-survey="demo" 
     data-trigger="exit-intent"></div>`}
                  </code>
                </div>

                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-medium text-gray-800 mb-2">4. Manual Trigger</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Trigger survey programmatically
                  </p>
                  <button
                    onClick={triggerManualSurvey}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  >
                    Trigger Demo Survey
                  </button>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                ✨ Features
              </h2>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  MetaMask wallet integration
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Multiple trigger types
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Duplicate response prevention
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Responsive design
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Event callbacks
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  First trigger wins priority
                </li>
              </ul>
            </div>
          </div>

          {/* Event Log */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                📊 Event Log
              </h2>
              <button
                onClick={clearLogs}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-4 h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No events yet. Scroll down or trigger a survey to see events.
                </p>
              ) : (
                <div className="space-y-1">
                  {logs.map((log, index) => (
                    <div key={index} className="text-green-400 text-sm font-mono">
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content to enable scrolling */}
        <div className="mt-12 space-y-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              📖 How It Works
            </h2>
            <div className="prose max-w-none text-gray-600">
              <p>
                The Wallet Survey SDK automatically scans your page for survey elements and sets up 
                the appropriate triggers. When a trigger condition is met, it creates an iframe 
                overlay with the survey interface.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Integration Steps:</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>Add survey elements to your HTML with data attributes</li>
                <li>Include the SDK script tag</li>
                <li>The SDK automatically initializes and sets up triggers</li>
                <li>Users connect their wallet and complete surveys</li>
                <li>Responses are stored with wallet addresses for identity</li>
              </ol>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Event Handling:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`// Listen for survey events
walletSurvey.on('survey_completed', (data) => {
  console.log('Survey completed:', data);
  // Send to analytics, show thank you message, etc.
});

walletSurvey.on('survey_error', (data) => {
  console.error('Survey error:', data);
  // Handle errors gracefully
});`}
              </pre>
            </div>
          </div>

          {/* More content for scrolling */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              🎯 Use Cases
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">E-commerce</h3>
                <p className="text-gray-600 text-sm">
                  Collect feedback after purchases, understand customer satisfaction, 
                  and improve product offerings based on wallet-verified responses.
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">DeFi Platforms</h3>
                <p className="text-gray-600 text-sm">
                  Gather user experience feedback, understand feature usage, 
                  and make data-driven product decisions.
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Content Sites</h3>
                <p className="text-gray-600 text-sm">
                  Measure content engagement, understand reader preferences, 
                  and build loyal communities with verified identities.
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">DAOs</h3>
                <p className="text-gray-600 text-sm">
                  Conduct governance polls, gather member feedback, 
                  and make collective decisions with verified participation.
                </p>
              </div>
            </div>
          </div>

          {/* Even more content */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              🔧 Advanced Configuration
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Custom SDK Configuration</h3>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`const survey = new WalletSurvey({
  apiBase: 'https://your-domain.com',
  theme: 'dark',
  position: 'bottom-left',
  debug: true
});`}
                </pre>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Context Data</h3>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`<div data-wallet-survey="product-feedback"
     data-trigger="time"
     data-trigger-value="30"
     data-context='{"product_id": "123", "price": 99.99}'>
</div>`}
                </pre>
              </div>
            </div>
          </div>

          {/* Footer content */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="mb-6">
              Integrate wallet surveys into your website in minutes. 
              Keep scrolling to trigger the demo survey!
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={triggerManualSurvey}
                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Try Demo Survey
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Survey trigger elements */}
      <div data-wallet-survey="demo" data-trigger="scroll" data-trigger-value="50"></div>
      <div data-wallet-survey="demo" data-trigger="time" data-trigger-value="30"></div>
      <div data-wallet-survey="demo" data-trigger="exit-intent"></div>

      {/* SDK Script */}
      <script src="/sdk/wallet-survey.js" async></script>
    </div>
  );
}

// Extend window type for SDK
declare global {
  interface Window {
    walletSurvey?: {
      on: (event: string, callback: (data: any) => void) => void;
      trigger: (surveyId: string) => void;
    };
  }
}
