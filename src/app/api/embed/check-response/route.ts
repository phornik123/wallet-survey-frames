import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const surveyId = searchParams.get('surveyId');
    const walletAddress = searchParams.get('walletAddress');

    if (!surveyId || !walletAddress) {
      return NextResponse.json(
        { error: 'Survey ID and wallet address are required' },
        { status: 400 }
      );
    }

    // Check if user has already responded
    const hasResponded = await Database.hasUserResponded(surveyId, walletAddress);

    return NextResponse.json({
      hasResponded,
      surveyId,
      walletAddress: walletAddress.toLowerCase()
    });

  } catch (error) {
    console.error('Error checking response:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
