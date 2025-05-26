import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/database';
import { selectSurveyForSegment } from '@/lib/survey-targeting';
import {
  createFrameResponse,
  parseFrameRequest,
  validateFrameRequest,
  createSurveyState,
  parseSurveyState,
  getFrameImageUrl
} from '@/lib/frames';
import { FrameButton, Survey } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_FRAME_URL || 'http://localhost:3008';

export async function GET(
  request: NextRequest,
  { params }: { params: { surveyId: string } }
) {
  try {
    const { surveyId } = params;
    
    // Detect request context
    const context = detectRequestContext(request);
    
    switch (context.type) {
      case 'farcaster-frame':
        return handleFrameRequest(request, surveyId, context);
      case 'embedded-iframe':
        return handleEmbeddedRequest(request, surveyId, context);
      case 'direct-browser':
        return handleBrowserRequest(request, surveyId, context);
      default:
        return handleBrowserRequest(request, surveyId, context);
    }
  } catch (error) {
    console.error('Universal survey error:', error);
    return NextResponse.json({ error: 'Survey not available' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { surveyId: string } }) {
  // Handle frame button interactions
  const { surveyId } = params;
  
  try {
    const body = await request.json();
    
    if (!validateFrameRequest(body)) {
      return NextResponse.json({ error: 'Invalid frame request' }, { status: 400 });
    }

    const { buttonIndex, inputText, fid, address } = parseFrameRequest(body);
    const state = parseSurveyState(body.untrustedData?.state);

    const { surveyId: stateSurveyId, questionIndex = 0, responses = {} } = state;

    if (!stateSurveyId) {
      // No state - show initial survey selection
      const imageUrl = getFrameImageUrl(BASE_URL, '/api/frame/image', {
        type: 'home'
      });

      const response = createFrameResponse(imageUrl, [
        { 
          label: 'Try Demo Survey', 
          action: 'post',
          post_url: `${BASE_URL}/survey/demo`
        }
      ], {
        state: createSurveyState('demo', 0)
      });

      return NextResponse.json(response);
    }

    return handleFrameInteraction(body, stateSurveyId || surveyId);
    
  } catch (error) {
    console.error('Frame POST error:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

interface RequestContext {
  type: 'farcaster-frame' | 'embedded-iframe' | 'direct-browser';
  walletAddress?: string;
  userAgent?: string;
  referer?: string;
}

function detectRequestContext(request: NextRequest): RequestContext {
  const userAgent = request.headers.get('user-agent') || '';
  const accept = request.headers.get('accept') || '';
  const referer = request.headers.get('referer') || '';
  
  // Check for Farcaster frame client
  if (accept.includes('application/json') || 
      userAgent.includes('farcaster') ||
      request.headers.get('fc-frame-client')) {
    return {
      type: 'farcaster-frame',
      userAgent,
      referer
    };
  }
  
  // Check for embedded iframe (different domain referer)
  const currentDomain = new URL(request.url).hostname;
  if (referer && !referer.includes(currentDomain)) {
    return {
      type: 'embedded-iframe',
      referer
    };
  }
  
  // Default to direct browser access
  return {
    type: 'direct-browser',
    referer
  };
}

async function handleFrameRequest(
  request: NextRequest, 
  surveyId: string, 
  context: RequestContext
) {
  try {
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
              type: 'multiple-choice' as const,
              question: 'How satisfied are you with our service?',
              options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied'],
              required: true
            },
            {
              id: 'rating',
              type: 'rating' as const,
              question: 'Rate us from 1-5 stars',
              required: true
            },
            {
              id: 'feedback',
              type: 'text' as const,
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
        { label: 'Back to Home', action: 'post', post_url: `${BASE_URL}/survey/demo` }
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
        post_url: `${BASE_URL}/survey/${survey.id}`
      }
    ], {
      postUrl: `${BASE_URL}/survey/${survey.id}`,
      state: initialState
    });

    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Frame request error:', error);
    return NextResponse.json({
      type: 'frame', 
      image: `${BASE_URL}/api/frame/image?type=error`,
      buttons: [{ label: 'Try Again', action: 'post' }],
      version: 'vNext'
    });
  }
}

async function handleFrameInteraction(frameData: any, surveyId: string) {
  try {
    const { buttonIndex, inputText, fid, address } = parseFrameRequest(frameData);
    const state = parseSurveyState(frameData.untrustedData?.state);

    const { questionIndex = 0, responses = {} } = state;

    const survey = await Database.getSurvey(surveyId);
    if (!survey) {
      const imageUrl = getFrameImageUrl(BASE_URL, '/api/frame/image', {
        type: 'error',
        message: 'Survey not found'
      });

      const response = createFrameResponse(imageUrl, [
        { label: 'Back to Home', action: 'post', post_url: `${BASE_URL}/survey/demo` }
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
            post_url: `${BASE_URL}/survey/demo`
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
            post_url: `${BASE_URL}/survey/${surveyId}`
          }));
        } else if (nextQuestion.type === 'rating') {
          buttons = [1, 2, 3, 4, 5].map(rating => ({
            label: `${rating}⭐`,
            action: 'post' as const,
            post_url: `${BASE_URL}/survey/${surveyId}`
          }));
        } else if (nextQuestion.type === 'text') {
          buttons = [{
            label: 'Submit Answer',
            action: 'post' as const,
            post_url: `${BASE_URL}/survey/${surveyId}`
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
          post_url: `${BASE_URL}/survey/${surveyId}`
        }));
      } else if (currentQuestion.type === 'rating') {
        buttons = [1, 2, 3, 4, 5].map(rating => ({
          label: `${rating}⭐`,
          action: 'post' as const,
          post_url: `${BASE_URL}/survey/${surveyId}`
        }));
      } else if (currentQuestion.type === 'text') {
        buttons = [{
          label: 'Submit Answer',
          action: 'post' as const,
          post_url: `${BASE_URL}/survey/${surveyId}`
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
        post_url: `${BASE_URL}/survey/${survey.id}`
      }
    ], {
      state: createSurveyState(survey.id, 0)
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('Frame interaction error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleBrowserRequest(
  request: NextRequest,
  surveyId: string, 
  context: RequestContext
) {
  // Return full HTML survey interface
  const survey = await Database.getSurvey(surveyId);
  
  if (!survey) {
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
        <head><title>Survey Not Found</title></head>
        <body>
          <div style="text-align: center; padding: 40px;">
            <h1>Survey Not Found</h1>
            <p>The requested survey could not be found.</p>
          </div>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
  
  const isEmbedded = context.type === 'embedded-iframe';
  
  return new NextResponse(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${survey.title}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        ${!isEmbedded ? '<style>body { margin: 0; padding: 20px; }</style>' : ''}
      </head>
      <body class="${isEmbedded ? 'p-4' : 'max-w-2xl mx-auto p-8'}">
        <div id="survey-container"></div>
        
        <script>
          // Embedded survey interface
          window.SURVEY_CONFIG = {
            surveyId: '${surveyId}',
            isEmbedded: ${isEmbedded},
            apiBase: '${BASE_URL}'
          };
        </script>
        <script src="${BASE_URL}/js/universal-survey.js"></script>
      </body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' }
  });
}

async function handleEmbeddedRequest(
  request: NextRequest,
  surveyId: string,
  context: RequestContext  
) {
  // Same as browser request but optimized for iframe
  return handleBrowserRequest(request, surveyId, { 
    ...context, 
    type: 'embedded-iframe' 
  });
}
