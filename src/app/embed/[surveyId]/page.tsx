'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Survey, Question, SurveyResponse } from '@/types';
import { WalletProfile } from '@/components/WalletProfile';
import { selectSurveyForSegment } from '@/lib/survey-targeting';

interface EmbedPageProps {}

export default function EmbedPage({}: EmbedPageProps) {
  const params = useParams();
  const surveyId = params.surveyId as string;

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string | number>>({});
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasResponded, setHasResponded] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [behavioralProfile, setBehavioralProfile] = useState<any>(null);
  const [rewardInfo, setRewardInfo] = useState<any>(null);

  // Load survey from API
  useEffect(() => {
    async function loadSurveyFromAPI() {
      try {
        const response = await fetch('/api/surveys');
        const surveys = await response.json();
        const foundSurvey = surveys.find((s: Survey) => s.id === surveyId);
        
        if (foundSurvey) {
          setSurvey(foundSurvey);
        } else {
          setError('Survey not found');
        }
      } catch (err) {
        setError('Failed to load survey');
      }
    }

    if (surveyId) {
      loadSurveyFromAPI();
    }
  }, [surveyId]);

  // Send message to parent window
  const sendMessage = (type: string, data?: any) => {
    window.parent.postMessage({
      type,
      surveyId,
      data
    }, '*');
  };

  // Connect wallet - Multi-wallet support
  const connectWallet = async () => {
    console.log('🔗 Connect wallet clicked');
    setError(''); // Clear any previous errors
    
    // Check for ethereum provider
    if (!window.ethereum) {
      setError('No wallet found. Please install MetaMask or another Ethereum wallet.');
      return;
    }

    setIsConnecting(true);
    
    try {
      // Log available providers
      console.log('🔍 Available providers:', {
        ethereum: !!window.ethereum,
        isMetaMask: window.ethereum.isMetaMask,
        providers: window.ethereum.providers ? window.ethereum.providers.length : 'none'
      });

      let provider = window.ethereum;
      
      // If multiple providers, try to find MetaMask
      if (window.ethereum.providers && window.ethereum.providers.length > 0) {
        console.log('🔄 Multiple wallet providers detected');
        const metaMaskProvider = window.ethereum.providers.find((p: any) => p.isMetaMask);
        if (metaMaskProvider) {
          console.log('✅ Found MetaMask provider');
          provider = metaMaskProvider;
        } else {
          console.log('⚠️ MetaMask not found, using default provider');
        }
      }
      
      console.log('🚀 Requesting connection with provider:', {
        isMetaMask: provider.isMetaMask,
        chainId: provider.chainId
      });
      
      // Request account access
      const accounts = await provider.request({
        method: 'eth_requestAccounts'
      });
      
      console.log('✅ Accounts received:', accounts);
      
      if (accounts && accounts.length > 0) {
        const address = accounts[0].toLowerCase();
        console.log('🎯 Connected address:', address);
        setWalletAddress(address);
        
        // Check if user has already responded
        await checkExistingResponse(address);
      } else {
        console.log('❌ No accounts returned');
        setError('No accounts found. Please unlock your wallet and try again.');
      }
    } catch (err: any) {
      console.error('💥 Wallet connection error:', err);
      console.error('Error details:', {
        code: err.code,
        message: err.message,
        data: err.data
      });
      
      // Handle specific wallet errors
      if (err.code === 4001) {
        setError('Connection rejected. Please approve the connection in your wallet.');
      } else if (err.code === -32002) {
        setError('Connection request pending. Please check your wallet and approve the connection.');
      } else if (err.code === -32603) {
        setError('Internal error. Please try refreshing the page.');
      } else {
        setError(`Connection failed: ${err.message || 'Unknown error'}`);
      }
    } finally {
      setIsConnecting(false);
      console.log('🏁 Connection attempt finished');
    }
  };

  // NEW: Handle wallet connected with behavioral analysis
  const checkExistingResponse = async (address: string) => {
    try {
      // 1. Get behavioral analysis
      const behavioralResponse = await fetch('/api/behavioral-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address })
      });
      
      const behavioralProfile = await behavioralResponse.json();
      setBehavioralProfile(behavioralProfile);
      
      // 2. Get targeted survey based on eligibility
      // FIXED: No more blocking - everyone can take surveys!
      const targetedSurveyId = behavioralProfile.isEligible 
        ? selectSurveyForSegment(behavioralProfile.segment)
        : 'demo'; // Default survey for ineligible users
      
      // 4. Check if already responded to the targeted survey
      const responseCheck = await fetch(`/api/embed/check-response?surveyId=${targetedSurveyId}&walletAddress=${address}`);
      if (responseCheck.ok) {
        const data = await responseCheck.json();
        if (data.hasResponded) {
          setHasResponded(true);
          return;
        }
      }
      
      // 5. Load the targeted survey (instead of current survey)
      const surveys = await fetch('/api/surveys').then(r => r.json());
      const targetedSurvey = surveys.find((s: Survey) => s.id === targetedSurveyId);
      
      if (targetedSurvey) {
        setSurvey(targetedSurvey);
        setShowProfile(true); // Show profile first
      } else {
        // Fallback to original survey
        const fallbackSurvey = surveys.find((s: Survey) => s.id === surveyId);
        if (fallbackSurvey) {
          setSurvey(fallbackSurvey);
          setShowProfile(true);
        }
      }
      
    } catch (error) {
      console.error('Behavioral analysis error:', error);
      // Fallback to original survey flow
      try {
        const response = await fetch(`/api/embed/check-response?surveyId=${surveyId}&walletAddress=${address}`);
        if (response.ok) {
          const data = await response.json();
          if (data.hasResponded) {
            setHasResponded(true);
          } else {
            setShowProfile(true);
          }
        }
      } catch (fallbackErr) {
        console.error('Fallback error:', fallbackErr);
        setShowProfile(true);
      }
    }
  };

  // Handle continuing from profile to survey
  const handleContinueToSurvey = () => {
    setShowProfile(false);
  };

  // Handle answer selection
  const handleAnswer = (questionId: string, answer: string | number) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // Go to next question
  const nextQuestion = () => {
    if (!survey) return;
    
    const currentQuestion = survey.questions[currentQuestionIndex];
    if (currentQuestion.required && !responses[currentQuestion.id]) {
      setError('This question is required');
      return;
    }

    setError('');
    if (currentQuestionIndex < survey.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      submitSurvey();
    }
  };

  // Go to previous question
  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setError('');
    }
  };

  // Submit survey with reward distribution
  const submitSurvey = async () => {
    if (!survey || !walletAddress) return;

    setIsSubmitting(true);
    try {
      // 1. Save survey response (existing logic)
      const surveyResponse: SurveyResponse = {
        surveyId: survey.id,
        walletAddress,
        responses,
        submittedAt: new Date().toISOString()
      };

      const response = await fetch('/api/embed/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(surveyResponse)
      });

      if (!response.ok) {
        throw new Error('Failed to submit survey');
      }

      // 2. NEW: Distribute USDC reward
      const rewardAmount = getRewardAmount(survey.id, behavioralProfile?.segment);
      
      const rewardResponse = await fetch('/api/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress,
          surveyId: survey.id,
          amount: rewardAmount
        })
      });
      
      const rewardResult = await rewardResponse.json();
      setRewardInfo(rewardResult);

      // 3. Show completion with reward info
      setIsCompleted(true);
      sendMessage('survey_completed', surveyResponse);
    } catch (err: any) {
      setError('Failed to submit survey: ' + err.message);
      sendMessage('survey_error', { error: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to determine reward amount
  const getRewardAmount = (surveyId: string, segment?: string): number => {
    // Define reward amounts per survey/segment
    const rewardRules: Record<string, number> = {
      'yield-optimizer-advanced': 5, // $5 USDC for advanced surveys
      'yield-curious-onboarding': 3, // $3 USDC for onboarding
      'memecoin-sentiment': 2,       // $2 USDC for quick surveys
      'conservative-yield': 3,       // $3 USDC for conservative surveys
      'nft-utility': 2,              // $2 USDC for NFT surveys
      'demo': 1                      // $1 USDC for demo
    };
    
    return rewardRules[surveyId] || 1;
  };

  // Render question based on type
  const renderQuestion = (question: Question) => {
    const currentAnswer = responses[question.id];

    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(question.id, option)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  currentAnswer === option
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        );

      case 'rating':
        return (
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleAnswer(question.id, rating)}
                className={`w-12 h-12 rounded-full border-2 transition-all ${
                  currentAnswer === rating
                    ? 'border-yellow-400 bg-yellow-100 text-yellow-600'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                ⭐
              </button>
            ))}
          </div>
        );

      case 'text':
        return (
          <textarea
            value={currentAnswer as string || ''}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            placeholder="Type your response here..."
            className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
            rows={4}
          />
        );

      default:
        return <div>Unknown question type</div>;
    }
  };

  if (error && !survey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading survey...</p>
        </div>
      </div>
    );
  }

  if (hasResponded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Already Completed</h2>
          <p className="text-gray-600">You have already responded to this survey.</p>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-green-600">Survey Completed!</h2>
          <p className="text-gray-600">Thank you for your participation.</p>
          
          {/* FIXED: Honest Reward Display */}
          {rewardInfo && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              {rewardInfo.success ? (
                <>
                  <h3 className="font-semibold text-blue-800">Reward Logged! 📝</h3>
                  <p className="text-blue-700">${rewardInfo.amount} USDC equivalent logged for your wallet</p>
                  <p className="text-xs text-blue-600 mt-2">Status: Pending manual distribution</p>
                  <p className="text-xs text-blue-600">Reward wallet: 0x1C18...12ed</p>
                </>
              ) : (
                <>
                  <h3 className="font-semibold text-orange-800">Reward Error</h3>
                  <p className="text-orange-700">Unable to log reward</p>
                  {rewardInfo.error && (
                    <p className="text-xs text-orange-600 mt-2">Error: {rewardInfo.error}</p>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!walletAddress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-4xl mb-4">🔗</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">
            Connect your wallet to participate in this survey. Your responses will be linked to your wallet address.
          </p>
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
          </button>
          {error && (
            <p className="text-red-500 text-sm mt-4">{error}</p>
          )}
        </div>
      </div>
    );
  }

  // Show wallet profile after connection but before survey
  if (showProfile) {
    return (
      <WalletProfile 
        walletAddress={walletAddress}
        onContinue={handleContinueToSurvey}
      />
    );
  }

  const currentQuestion = survey.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / survey.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{survey.title}</h1>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Question {currentQuestionIndex + 1} of {survey.questions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {currentQuestion.question}
            {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
          </h2>
          
          {renderQuestion(currentQuestion)}
          
          {error && (
            <p className="text-red-500 text-sm mt-4">{error}</p>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={previousQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <button
            onClick={nextQuestion}
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 
             currentQuestionIndex === survey.questions.length - 1 ? 'Submit' : 'Next'}
          </button>
        </div>

        {/* Wallet info */}
        <div className="text-center mt-6 text-xs text-gray-500">
          Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        </div>
      </div>
    </div>
  );
}

// Add wallet types for multi-wallet support
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      isMetaMask?: boolean;
      chainId?: string;
      providers?: Array<{
        request: (args: { method: string; params?: any[] }) => Promise<any>;
        isMetaMask?: boolean;
        chainId?: string;
      }>;
    };
  }
}
