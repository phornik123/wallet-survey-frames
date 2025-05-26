import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { surveyId: string } }
) {
  try {
    const { surveyId } = params;

    if (!surveyId) {
      return NextResponse.json(
        { error: 'Survey ID is required' },
        { status: 400 }
      );
    }

    // Get survey from database
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
        { status: 404 }
      );
    }

    // Return survey metadata for SDK
    return NextResponse.json({
      id: survey.id,
      title: survey.title,
      questionCount: survey.questions.length,
      isActive: survey.isActive
    });

  } catch (error) {
    console.error('Error fetching survey:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
