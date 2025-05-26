import { Metadata } from 'next';
import { generateFrameMetadata, getFrameImageUrl } from '@/lib/frames';

const BASE_URL = process.env.NEXT_PUBLIC_FRAME_URL || 'http://localhost:3000';

export async function generateMetadata(): Promise<Metadata> {
  const imageUrl = getFrameImageUrl(BASE_URL, '/api/frame/image', {
    type: 'home'
  });

  const frameMetadata = generateFrameMetadata(
    imageUrl,
    [
      { 
        label: 'Try Demo Survey', 
        action: 'post',
        post_url: `${BASE_URL}/api/frame`
      }
    ],
    {
      postUrl: `${BASE_URL}/api/frame`
    }
  );

  return {
    title: 'Wallet Survey Frames',
    description: 'Interactive surveys for wallet users via Farcaster Frames',
    openGraph: {
      title: 'Wallet Survey Frames',
      description: 'Interactive surveys for wallet users via Farcaster Frames',
      images: [imageUrl],
    },
    other: frameMetadata as unknown as Record<string, string>,
  };
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-white mb-4">
            📊 Wallet Survey Frames
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Interactive surveys for wallet users via Farcaster Frames v2
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">
            🚀 Features
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <span className="text-green-400 mr-3">✓</span>
                Farcaster Frames v2 compatible
              </div>
              <div className="flex items-center text-gray-300">
                <span className="text-green-400 mr-3">✓</span>
                Multi-step survey flows
              </div>
              <div className="flex items-center text-gray-300">
                <span className="text-green-400 mr-3">✓</span>
                Multiple question types
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <span className="text-green-400 mr-3">✓</span>
                Wallet address collection
              </div>
              <div className="flex items-center text-gray-300">
                <span className="text-green-400 mr-3">✓</span>
                Response analytics
              </div>
              <div className="flex items-center text-gray-300">
                <span className="text-green-400 mr-3">✓</span>
                Beautiful frame images
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">
            🎯 How to Use
          </h2>
          <div className="text-left space-y-4 text-gray-300">
            <div className="flex items-start">
              <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
              <div>
                <strong className="text-white">Share in Farcaster:</strong> Post this URL in a Farcaster cast to display the interactive frame
              </div>
            </div>
            <div className="flex items-start">
              <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
              <div>
                <strong className="text-white">Users Interact:</strong> Users can click buttons and fill out surveys directly in their feed
              </div>
            </div>
            <div className="flex items-start">
              <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
              <div>
                <strong className="text-white">Collect Responses:</strong> Responses are automatically saved with wallet addresses
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-4">
            🔗 Frame URL
          </h2>
          <div className="bg-black/30 rounded-lg p-4 font-mono text-sm text-gray-300 break-all">
            {BASE_URL}
          </div>
          <p className="text-gray-400 mt-3 text-sm">
            Copy this URL and paste it into a Farcaster cast to share the interactive survey frame
          </p>
        </div>

        <div className="mt-8 text-gray-400 text-sm">
          <p>
            Built with Next.js, TypeScript, and Farcaster Frames v2
          </p>
        </div>
      </div>
    </div>
  );
}
