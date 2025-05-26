import { NextRequest, NextResponse } from 'next/server';
import { generateFrameImage } from '@/lib/frames';
import React from 'react';

// Frame image component
function FrameImage({ 
  type, 
  title, 
  message, 
  questionText, 
  questionType, 
  questionIndex, 
  totalQuestions,
  surveyTitle 
}: {
  type: string;
  title?: string;
  message?: string;
  questionText?: string;
  questionType?: string;
  questionIndex?: string;
  totalQuestions?: string;
  surveyTitle?: string;
}) {
  const backgroundColor = '#1a1a2e';
  const primaryColor = '#16213e';
  const accentColor = '#0f3460';
  const textColor = '#ffffff';
  const secondaryTextColor = '#a0a0a0';

  if (type === 'error') {
    return React.createElement('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor,
        color: textColor,
        fontFamily: 'Inter, sans-serif',
        padding: '60px',
      }
    }, [
      React.createElement('div', {
        key: 'error-icon',
        style: {
          fontSize: '80px',
          marginBottom: '30px',
        }
      }, '❌'),
      React.createElement('h1', {
        key: 'error-title',
        style: {
          fontSize: '48px',
          fontWeight: 'bold',
          marginBottom: '20px',
          textAlign: 'center',
        }
      }, 'Error'),
      React.createElement('p', {
        key: 'error-message',
        style: {
          fontSize: '24px',
          color: secondaryTextColor,
          textAlign: 'center',
          maxWidth: '600px',
        }
      }, message || 'Something went wrong')
    ]);
  }

  if (type === 'home') {
    return React.createElement('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor,
        color: textColor,
        fontFamily: 'Inter, sans-serif',
        padding: '60px',
      }
    }, [
      React.createElement('div', {
        key: 'home-icon',
        style: {
          fontSize: '100px',
          marginBottom: '40px',
        }
      }, '📊'),
      React.createElement('h1', {
        key: 'home-title',
        style: {
          fontSize: '56px',
          fontWeight: 'bold',
          marginBottom: '20px',
          textAlign: 'center',
        }
      }, 'Wallet Survey'),
      React.createElement('p', {
        key: 'home-subtitle',
        style: {
          fontSize: '28px',
          color: secondaryTextColor,
          textAlign: 'center',
          maxWidth: '700px',
        }
      }, 'Share your feedback and help improve the ecosystem')
    ]);
  }

  if (type === 'start') {
    return React.createElement('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor,
        color: textColor,
        fontFamily: 'Inter, sans-serif',
        padding: '60px',
      }
    }, [
      React.createElement('div', {
        key: 'start-icon',
        style: {
          fontSize: '80px',
          marginBottom: '30px',
        }
      }, '🚀'),
      React.createElement('h1', {
        key: 'start-title',
        style: {
          fontSize: '48px',
          fontWeight: 'bold',
          marginBottom: '20px',
          textAlign: 'center',
          maxWidth: '900px',
        }
      }, title ? decodeURIComponent(title) : 'Survey'),
      React.createElement('p', {
        key: 'start-info',
        style: {
          fontSize: '24px',
          color: secondaryTextColor,
          textAlign: 'center',
          marginBottom: '20px',
        }
      }, `${totalQuestions || '3'} questions • 2 minutes`),
      React.createElement('p', {
        key: 'start-description',
        style: {
          fontSize: '20px',
          color: secondaryTextColor,
          textAlign: 'center',
          maxWidth: '600px',
        }
      }, 'Your responses help improve the wallet experience')
    ]);
  }

  if (type === 'question') {
    const progress = questionIndex && totalQuestions ? 
      Math.round(((parseInt(questionIndex) + 1) / parseInt(totalQuestions)) * 100) : 0;

    return React.createElement('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor,
        color: textColor,
        fontFamily: 'Inter, sans-serif',
        padding: '60px',
      }
    }, [
      React.createElement('div', {
        key: 'progress-container',
        style: {
          width: '100%',
          maxWidth: '800px',
          marginBottom: '40px',
        }
      }, [
        React.createElement('div', {
          key: 'progress-text',
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px',
            fontSize: '18px',
            color: secondaryTextColor,
          }
        }, [
          React.createElement('span', { key: 'question-num' }, 
            `Question ${questionIndex ? parseInt(questionIndex) + 1 : 1} of ${totalQuestions || '3'}`),
          React.createElement('span', { key: 'progress-percent' }, `${progress}%`)
        ]),
        React.createElement('div', {
          key: 'progress-bar-bg',
          style: {
            width: '100%',
            height: '8px',
            backgroundColor: primaryColor,
            borderRadius: '4px',
            overflow: 'hidden',
          }
        }, React.createElement('div', {
          key: 'progress-bar-fill',
          style: {
            width: `${progress}%`,
            height: '100%',
            backgroundColor: accentColor,
            transition: 'width 0.3s ease',
          }
        }))
      ]),
      React.createElement('div', {
        key: 'question-icon',
        style: {
          fontSize: '60px',
          marginBottom: '30px',
        }
      }, questionType === 'rating' ? '⭐' : questionType === 'text' ? '💬' : '❓'),
      React.createElement('h1', {
        key: 'question-text',
        style: {
          fontSize: '36px',
          fontWeight: 'bold',
          textAlign: 'center',
          maxWidth: '900px',
          lineHeight: '1.2',
          marginBottom: '20px',
        }
      }, questionText ? decodeURIComponent(questionText) : 'Question'),
      React.createElement('p', {
        key: 'question-instruction',
        style: {
          fontSize: '20px',
          color: secondaryTextColor,
          textAlign: 'center',
        }
      }, questionType === 'rating' ? 'Select your rating' : 
         questionType === 'text' ? 'Type your response below' : 
         'Choose an option')
    ]);
  }

  if (type === 'complete') {
    return React.createElement('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor,
        color: textColor,
        fontFamily: 'Inter, sans-serif',
        padding: '60px',
      }
    }, [
      React.createElement('div', {
        key: 'complete-icon',
        style: {
          fontSize: '100px',
          marginBottom: '40px',
        }
      }, '🎉'),
      React.createElement('h1', {
        key: 'complete-title',
        style: {
          fontSize: '56px',
          fontWeight: 'bold',
          marginBottom: '20px',
          textAlign: 'center',
        }
      }, 'Thank You!'),
      React.createElement('p', {
        key: 'complete-message',
        style: {
          fontSize: '28px',
          color: secondaryTextColor,
          textAlign: 'center',
          maxWidth: '700px',
          marginBottom: '20px',
        }
      }, 'Your feedback has been recorded'),
      React.createElement('p', {
        key: 'complete-survey',
        style: {
          fontSize: '20px',
          color: secondaryTextColor,
          textAlign: 'center',
        }
      }, surveyTitle ? `Survey: ${decodeURIComponent(surveyTitle)}` : '')
    ]);
  }

  // Default fallback
  return React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      backgroundColor,
      color: textColor,
      fontFamily: 'Inter, sans-serif',
    }
  }, React.createElement('h1', {
    style: { fontSize: '48px' }
  }, 'Wallet Survey Frame'));
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const type = searchParams.get('type') || 'home';
    const title = searchParams.get('title');
    const message = searchParams.get('message');
    const questionText = searchParams.get('questionText');
    const questionType = searchParams.get('questionType');
    const questionIndex = searchParams.get('questionIndex');
    const totalQuestions = searchParams.get('totalQuestions');
    const surveyTitle = searchParams.get('surveyTitle');

    const imageElement = React.createElement(FrameImage, {
      type,
      title: title || undefined,
      message: message || undefined,
      questionText: questionText || undefined,
      questionType: questionType || undefined,
      questionIndex: questionIndex || undefined,
      totalQuestions: totalQuestions || undefined,
      surveyTitle: surveyTitle || undefined
    });

    const imageBuffer = await generateFrameImage(imageElement, {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Arial',
          data: Buffer.from(''), // Use system font
          weight: 400,
          style: 'normal',
        },
      ],
    });

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600',
      },
    });

  } catch (error) {
    console.error('Image generation error:', error);
    
    // Return a simple fallback image
    const fallbackSvg = `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#1a1a2e"/>
        <text x="600" y="315" text-anchor="middle" fill="white" font-size="48" font-family="Arial">
          Wallet Survey Frame
        </text>
      </svg>
    `;
    
    return new NextResponse(fallbackSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }
}
