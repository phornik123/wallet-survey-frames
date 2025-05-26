'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Survey {
  id: string;
  title: string;
  questions: Array<{
    id: string;
    type: 'multiple-choice' | 'text' | 'rating';
    question: string;
    options?: string[];
    required: boolean;
  }>;
}

export default function UniversalSurveyPage() {
  const params = useParams();
  const surveyId = params.surveyId as string;
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [currentStep, setCurrentStep] = useState<'connect' | 'profile' | 'survey' | 'completed'>('connect');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [behavioralProfile, setBehavioralProfile] = useState<any>(null);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [rewardResult, setRewardResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [baseUrl, setBaseUrl] = useState<string>('');

  useEffect(() => {
    // Set base URL on client side only
    const url = process.env.NEXT_PUBLIC_FRAME_URL || `${window.location.protocol}//${window.location.host}`;
    setBaseUrl(url);
  }, []);

  useEffect(() => {
    // Load survey data
    loadSurvey();
  }, [surveyId]);

  const loadSurvey = async () => {
    try {
      const response = await fetch(`/api/embed/survey/${surveyId}`);
      if (response.ok) {
        const surveyData = await response.json();
        setSurvey(surveyData);
      } else {
        setError('Survey not found');
      }
    } catch (err) {
      setError('Failed to load survey');
    }
  };

  const connectWallet = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      
      console.log('🔗 Starting wallet connection...');
      
      // Check if MetaMask is installed
      if (!window.ethereum) {
        console.error('❌ MetaMask not detected');
        setError('MetaMask not installed. Please install MetaMask extension.');
        return;
      }
      
      console.log('✅ MetaMask detected, requesting accounts...');
      
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (!accounts || accounts.length === 0) {
        console.error('❌ No accounts returned from MetaMask');
        setError('No accounts found. Please unlock MetaMask and try again.');
        return;
      }
      
      const address = accounts[0];
      console.log('✅ Wallet connected:', address);
      setWalletAddress(address);
      
      // Run behavioral analysis with comprehensive fallback
      console.log('🔍 Running behavioral analysis...');
      await runBehavioralAnalysis(address);
      
      console.log('✅ Moving to profile step');
      setCurrentStep('profile');
      
    } catch (error: any) {
      console.error('❌ Wallet connection error:', error);
      
      // Handle specific MetaMask errors
      if (error.code === 4001) {
        setError('Connection rejected. Please approve the connection in MetaMask.');
      } else if (error.code === -32002) {
        setError('Connection request pending. Please check MetaMask.');
      } else if (error.message?.includes('User rejected')) {
        setError('Connection rejected by user. Please try again.');
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setError(`Failed to connect wallet: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const runBehavioralAnalysis = async (address: string) => {
    try {
      console.log('📊 Fetching behavioral analysis for:', address);
      
      const response = await fetch('/api/behavioral-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address })
      });
      
      if (response.ok) {
        const profile = await response.json();
        console.log('✅ Behavioral analysis successful:', profile);
        setBehavioralProfile(profile);
      } else {
        console.warn('⚠️ Behavioral analysis API failed, using fallback');
        setBehavioralProfile(createFallbackProfile('API failed'));
      }
    } catch (apiError) {
      console.warn('⚠️ Behavioral analysis error:', apiError);
      setBehavioralProfile(createFallbackProfile('Network error'));
    }
  };

  const createFallbackProfile = (reason: string) => ({
    segment: 'demo-user',
    isEligible: true,
    reasons: [`Demo mode - ${reason}`],
    portfolioValue: 1000,
    walletAge: 100,
    transactionCount: 50,
    fallbackMode: true
  });

  const skipWallet = () => {
    console.log('⏭️ Skipping wallet connection for demo');
    setWalletAddress('demo-address');
    setBehavioralProfile(createFallbackProfile('Demo mode'));
    setCurrentStep('profile');
  };

  const submitSurvey = async () => {
    try {
      setLoading(true);
      
      // Save response
      await fetch('/api/embed/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surveyId: survey?.id,
          walletAddress,
          responses
        })
      });
      
      // Distribute reward
      const rewardResponse = await fetch('/api/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress,
          surveyId: survey?.id,
          amount: getRewardAmount()
        })
      });
      
      const reward = await rewardResponse.json();
      setRewardResult(reward);
      setCurrentStep('completed');
      
    } catch (error) {
      console.error('Survey submission error:', error);
      setError('Failed to submit survey');
    } finally {
      setLoading(false);
    }
  };

  const getRewardAmount = () => {
    const rewards: Record<string, number> = {
      'yield-optimizer-advanced': 5,
      'yield-curious-onboarding': 3,
      'memecoin-sentiment': 2,
      'demo': 1
    };
    
    return rewards[survey?.id || 'demo'] || 1;
  };

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-bold text-red-600">Error</h2>
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading survey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {currentStep === 'connect' && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Connect Your Wallet</h1>
            <p className="text-gray-600">Connect your wallet to participate in this survey and earn rewards</p>
            <div className="space-y-3">
              <button 
                onClick={connectWallet}
                disabled={loading}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Connecting...' : 'Connect MetaMask'}
              </button>
              <button 
                onClick={skipWallet}
                disabled={loading}
                className="w-full bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 text-sm"
              >
                Skip Wallet (Demo Mode)
              </button>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}
          </div>
        )}

        {currentStep === 'profile' && behavioralProfile && (
          <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Your Wallet Profile</h2>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p><strong>Portfolio Value:</strong> ${behavioralProfile.portfolioValue?.toLocaleString() || 'Unknown'}</p>
              <p><strong>Segment:</strong> {behavioralProfile.segment || 'Unknown'}</p>
              <p><strong>Wallet Age:</strong> {behavioralProfile.walletAge || 'Unknown'} days</p>
            </div>
            
            {!behavioralProfile.isEligible && (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <p className="text-yellow-800">Limited eligibility: {behavioralProfile.reasons?.join(', ')}</p>
              </div>
            )}
            
            <button 
              onClick={() => setCurrentStep('survey')}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Continue to Survey
            </button>
          </div>
        )}

        {currentStep === 'survey' && (
          <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">{survey.title}</h2>
            <div className="space-y-6">
              {survey.questions.map((question, index) => (
                <div key={question.id} className="space-y-3">
                  <h3 className="font-semibold text-gray-900">
                    {index + 1}. {question.question}
                  </h3>
                  
                  {question.type === 'multiple-choice' && question.options && (
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <label key={optionIndex} className="flex items-center space-x-2">
                          <input 
                            type="radio" 
                            name={question.id} 
                            value={option}
                            onChange={(e) => handleResponseChange(question.id, e.target.value)}
                            className="text-blue-600"
                          />
                          <span className="text-gray-900">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  
                  {question.type === 'text' && (
                    <textarea 
                      className="w-full p-3 border rounded-lg" 
                      placeholder="Your answer..."
                      onChange={(e) => handleResponseChange(question.id, e.target.value)}
                    />
                  )}
                  
                  {question.type === 'rating' && (
                    <div className="flex space-x-2">
                      {[1,2,3,4,5].map(rating => (
                        <button 
                          key={rating}
                          onClick={() => handleResponseChange(question.id, rating)}
                          className={`w-10 h-10 border rounded-full hover:bg-blue-100 ${
                            responses[question.id] === rating ? 'bg-blue-500 text-white' : 'text-gray-900'
                          }`}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <button 
              onClick={submitSurvey}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Survey'}
            </button>
          </div>
        )}

        {currentStep === 'completed' && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center space-y-6">
            <h2 className="text-2xl font-bold text-green-600">Survey Completed! 🎉</h2>
            <p className="text-gray-600">Thank you for your participation.</p>
            
            {rewardResult && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800">Reward Status</h3>
                <p className="text-green-700">${rewardResult.amount} reward logged</p>
                {rewardResult.txHash ? (
                  <p className="text-xs text-green-600">TX: {rewardResult.txHash}</p>
                ) : (
                  <p className="text-xs text-green-600">Reward will be processed shortly</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
