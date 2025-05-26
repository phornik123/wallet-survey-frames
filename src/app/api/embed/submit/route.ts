import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/database';
import { SurveyResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { surveyId, walletAddress, responses, submittedAt } = body;

    // Validate required fields
    if (!surveyId || !walletAddress || !responses) {
      return NextResponse.json(
        { error: 'Survey ID, wallet address, and responses are required' },
        { status: 400 }
      );
    }

    // Check if survey exists and is active
    const survey = await Database.getSurvey(surveyId);
    if (!survey) {
      return NextResponse.json(
        { error: 'Survey not found' },
        { status: 404 }
      );
    }

    if (!survey.isActive) {
      return NextResponse.json(
        { error: 'Survey is not active' },
        { status: 400 }
      );
    }

    // Check if user has already responded
    const hasResponded = await Database.hasUserResponded(surveyId, walletAddress);
    if (hasResponded) {
      return NextResponse.json(
        { error: 'User has already responded to this survey' },
        { status: 409 }
      );
    }

    // Validate responses against survey questions
    const requiredQuestions = survey.questions.filter(q => q.required);
    for (const question of requiredQuestions) {
      if (!responses[question.id]) {
        return NextResponse.json(
          { error: `Required question "${question.question}" not answered` },
          { status: 400 }
        );
      }
    }

    // Create survey response
    const surveyResponse: SurveyResponse = {
      surveyId,
      walletAddress: walletAddress.toLowerCase(),
      responses,
      submittedAt: submittedAt || new Date().toISOString()
    };

    // Save response
    await Database.saveResponse(surveyResponse);

    return NextResponse.json({
      success: true,
      message: 'Response saved successfully',
      responseId: `${surveyId}-${walletAddress}-${Date.now()}`
    });

  } catch (error) {
    console.error('Error submitting survey response:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
