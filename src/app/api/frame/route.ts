import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/database';
import { Survey, FrameButton } from '@/types';
import {
  createFrameResponse,
  parseFrameRequest,
  validateFrameRequest,
  createSurveyState,
  parseSurveyState,
  getFrameImageUrl
} from '@/lib/frames';

const BASE_URL = process.env.NEXT_PUBLIC_FRAME_URL || 'http://localhost:3000';

// GET request - Initial frame display
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const surveyId = searchParams.get('surveyId') || 'demo';

  // Create demo survey if it doesn't exist
  if (surveyId === 'demo') {
    const existingSurvey = await Database.getSurvey('demo');
    if (!existingSurvey) {
      const demoSurvey: Survey = {
        id: 'demo',
        title: 'Demo Feedback Survey',
        questions: [
          {
            id: 'satisfaction',
            type: 'multiple-choice',
            question: 'How satisfied are you with our service?',
            options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied'],
            required: true
          },
          {
            id: 'rating',
            type: 'rating',
            question: 'Rate us from 1-5 stars',
            required: true
          },
          {
            id: 'feedback',
            type: 'text',
            question: 'Any additional feedback?',
            required: false
          }
        ],
        createdAt: new Date().toISOString(),
        isActive: true
      };
      await Database.saveSurvey(demoSurvey);
    }
  }

  const survey = await Database.getSurvey(surveyId);
  
  if (!survey || !survey.isActive) {
    const imageUrl = getFrameImageUrl(BASE_URL, '/api/frame/image', {
      type: 'error',
      message: 'Survey not found'
    });

    const response = createFrameResponse(imageUrl, [
      { label: 'Back to Home', action: 'post', post_url: `${BASE_URL}/api/frame` }
    ]);

    return NextResponse.json(response);
  }

  // Initial survey display
  const imageUrl = getFrameImageUrl(BASE_URL, '/api/frame/image', {
    type: 'start',
    surveyId: survey.id,
    title: encodeURIComponent(survey.title),
    questionCount: survey.questions.length.toString()
  });

  const initialState = createSurveyState(survey.id, 0);

  const response = createFrameResponse(imageUrl, [
    { 
      label: 'Start Survey', 
      action: 'post',
      post_url: `${BASE_URL}/api/frame`
    }
  ], {
    postUrl: `${BASE_URL}/api/frame`,
    state: initialState
  });

  return NextResponse.json(response);
}

// POST request - Handle frame interactions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!validateFrameRequest(body)) {
      return NextResponse.json({ error: 'Invalid frame request' }, { status: 400 });
    }

    const { buttonIndex, inputText, fid, address } = parseFrameRequest(body);
    const state = parseSurveyState(body.untrustedData?.state);

    const { surveyId, questionIndex = 0, responses = {} } = state;

    if (!surveyId) {
      // No state - show initial survey selection
      const imageUrl = getFrameImageUrl(BASE_URL, '/api/frame/image', {
        type: 'home'
      });

      const response = createFrameResponse(imageUrl, [
        { 
          label: 'Try Demo Survey', 
          action: 'post',
          post_url: `${BASE_URL}/api/frame`
        }
      ], {
        state: createSurveyState('demo', 0)
      });

      return NextResponse.json(response);
    }

    const survey = await Database.getSurvey(surveyId);
    if (!survey) {
      const imageUrl = getFrameImageUrl(BASE_URL, '/api/frame/image', {
        type: 'error',
        message: 'Survey not found'
      });

      const response = createFrameResponse(imageUrl, [
        { label: 'Back to Home', action: 'post', post_url: `${BASE_URL}/api/frame` }
      ]);

      return NextResponse.json(response);
    }

    // Handle button press
    if (buttonIndex && questionIndex < survey.questions.length) {
      const currentQuestion = survey.questions[questionIndex];
      let answer: string | number = '';

      // Process answer based on question type
      if (currentQuestion.type === 'multiple-choice' && currentQuestion.options) {
        const optionIndex = buttonIndex - 1;
        if (optionIndex >= 0 && optionIndex < currentQuestion.options.length) {
          answer = currentQuestion.options[optionIndex];
        }
      } else if (currentQuestion.type === 'rating') {
        answer = buttonIndex; // Button index corresponds to rating
      } else if (currentQuestion.type === 'text') {
        answer = inputText || '';
      }

      // Store the answer
      const updatedResponses = {
        ...responses,
        [currentQuestion.id]: answer
      };

      // Check if this is the last question
      const nextQuestionIndex = questionIndex + 1;
      const isLastQuestion = nextQuestionIndex >= survey.questions.length;

      if (isLastQuestion) {
        // Save final response to database
        const walletAddress = address || `0x${Math.random().toString(16).substr(2, 40)}`;
        
        const surveyResponse = {
          surveyId,
          walletAddress: walletAddress.toLowerCase(),
          responses: updatedResponses,
          submittedAt: new Date().toISOString()
        };

        await Database.saveResponse(surveyResponse);

        // Show completion screen
        const imageUrl = getFrameImageUrl(BASE_URL, '/api/frame/image', {
          type: 'complete',
          surveyTitle: encodeURIComponent(survey.title)
        });

        const response = createFrameResponse(imageUrl, [
          { 
            label: 'Take Another Survey', 
            action: 'post',
            post_url: `${BASE_URL}/api/frame`
          }
        ]);

        return NextResponse.json(response);
      } else {
        // Show next question
        const nextQuestion = survey.questions[nextQuestionIndex];
        const imageUrl = getFrameImageUrl(BASE_URL, '/api/frame/image', {
          type: 'question',
          surveyId,
          questionIndex: nextQuestionIndex.toString(),
          questionText: encodeURIComponent(nextQuestion.question),
          questionType: nextQuestion.type,
          totalQuestions: survey.questions.length.toString()
        });

        // Build buttons based on question type
        let buttons: FrameButton[] = [];
        if (nextQuestion.type === 'multiple-choice' && nextQuestion.options) {
          buttons = nextQuestion.options.slice(0, 4).map(option => ({
            label: option.length > 20 ? option.substring(0, 17) + '...' : option,
            action: 'post' as const,
            post_url: `${BASE_URL}/api/frame`
          }));
        } else if (nextQuestion.type === 'rating') {
          buttons = [1, 2, 3, 4, 5].map(rating => ({
            label: `${rating}⭐`,
            action: 'post' as const,
            post_url: `${BASE_URL}/api/frame`
          }));
        } else if (nextQuestion.type === 'text') {
          buttons = [{
            label: 'Submit Answer',
            action: 'post' as const,
            post_url: `${BASE_URL}/api/frame`
          }];
        }

        const newState = createSurveyState(surveyId, nextQuestionIndex, updatedResponses);

        const response = createFrameResponse(imageUrl, buttons, {
          input: nextQuestion.type === 'text' ? {
            text: 'Enter your response...',
            placeholder: 'Type your answer here'
          } : undefined,
          state: newState
        });

        return NextResponse.json(response);
      }
    }

    // Show first question if no button was pressed yet
    if (questionIndex < survey.questions.length) {
      const currentQuestion = survey.questions[questionIndex];
      const imageUrl = getFrameImageUrl(BASE_URL, '/api/frame/image', {
        type: 'question',
        surveyId,
        questionIndex: questionIndex.toString(),
        questionText: encodeURIComponent(currentQuestion.question),
        questionType: currentQuestion.type,
        totalQuestions: survey.questions.length.toString()
      });

      // Build buttons based on question type
      let buttons: FrameButton[] = [];
      if (currentQuestion.type === 'multiple-choice' && currentQuestion.options) {
        buttons = currentQuestion.options.slice(0, 4).map(option => ({
          label: option.length > 20 ? option.substring(0, 17) + '...' : option,
          action: 'post' as const,
          post_url: `${BASE_URL}/api/frame`
        }));
      } else if (currentQuestion.type === 'rating') {
        buttons = [1, 2, 3, 4, 5].map(rating => ({
          label: `${rating}⭐`,
          action: 'post' as const,
          post_url: `${BASE_URL}/api/frame`
        }));
      } else if (currentQuestion.type === 'text') {
        buttons = [{
          label: 'Submit Answer',
          action: 'post' as const,
          post_url: `${BASE_URL}/api/frame`
        }];
      }

      const response = createFrameResponse(imageUrl, buttons, {
        input: currentQuestion.type === 'text' ? {
          text: 'Enter your response...',
          placeholder: 'Type your answer here'
        } : undefined,
        state: createSurveyState(surveyId, questionIndex, responses)
      });

      return NextResponse.json(response);
    }

    // Fallback - show survey start
    const imageUrl = getFrameImageUrl(BASE_URL, '/api/frame/image', {
      type: 'start',
      surveyId: survey.id,
      title: encodeURIComponent(survey.title),
      questionCount: survey.questions.length.toString()
    });

    const response = createFrameResponse(imageUrl, [
      { 
        label: 'Start Survey', 
        action: 'post',
        post_url: `${BASE_URL}/api/frame`
      }
    ], {
      state: createSurveyState(survey.id, 0)
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('Frame API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
