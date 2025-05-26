'use client';

import { useEffect, useState } from 'react';
import { WalletProfile as WalletProfileType } from '@/types';

interface WalletProfileProps {
  walletAddress: string;
  onContinue: () => void;
}

export function WalletProfile({ walletAddress, onContinue }: WalletProfileProps) {
  const [profile, setProfile] = useState<WalletProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showSkipOption, setShowSkipOption] = useState(false);

  useEffect(() => {
    fetchProfile();
    
    // Show skip option after 5 seconds if still loading
    const skipTimer = setTimeout(() => {
      if (isLoading) {
        setShowSkipOption(true);
      }
    }, 5000);

    return () => clearTimeout(skipTimer);
  }, [walletAddress]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch('/api/wallet-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress }),
      });

      if (!response.ok) {
        throw new Error('Failed to load wallet profile');
      }

      const profileData = await response.json();
      setProfile(profileData);
    } catch (err: any) {
      console.error('Profile fetch error:', err);
      setError('Profile unavailable');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(2)}K`;
    } else {
      return `$${value.toFixed(2)}`;
    }
  };

  const formatBalance = (balance: string): string => {
    const num = parseFloat(balance);
    if (isNaN(num)) return balance;
    
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`;
    } else if (num < 1) {
      return num.toFixed(6);
    } else {
      return num.toFixed(2);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-4xl mb-4">👛</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Your Wallet Profile</h2>
            <p className="text-gray-600 mb-6">
              Fetching your portfolio data from the blockchain...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            
            {showSkipOption && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-3">Taking longer than expected?</p>
                <button
                  onClick={onContinue}
                  className="px-4 py-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Skip profile and continue to survey →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Profile Unavailable</h2>
            <p className="text-gray-600 mb-6">
              We couldn't load your wallet profile at this time, but you can still continue with the survey.
            </p>
            <button
              onClick={onContinue}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Continue to Survey
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="text-center">
            <div className="text-4xl mb-4">👛</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Your Wallet Profile</h1>
            <p className="text-gray-600 text-sm">
              Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </p>
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Portfolio Overview</h2>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {formatCurrency(profile.totalValue)}
            </div>
            <p className="text-gray-600 text-sm">Total Portfolio Value</p>
          </div>
        </div>

        {/* Top Tokens */}
        {profile.topTokens.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Holdings</h2>
            <div className="space-y-3">
              {profile.topTokens.map((token, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-800">{token.symbol}</div>
                    <div className="text-sm text-gray-600">{formatBalance(token.balance)}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-800">{formatCurrency(token.value)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DeFi Positions */}
        {profile.defiPositions.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">DeFi Positions</h2>
            <div className="space-y-3">
              {profile.defiPositions.slice(0, 5).map((position, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-800">{position.protocol}</div>
                    <div className="text-sm text-gray-600">{position.type}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-800">{formatCurrency(position.value)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Chains */}
        {profile.chains.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Active Networks</h2>
            <div className="flex flex-wrap gap-2">
              {profile.chains.map((chain, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {chain}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Continue Button */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <button
            onClick={onContinue}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Continue to Survey →
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-gray-500">
          Profile data provided by Zapper
        </div>
      </div>
    </div>
  );
}
