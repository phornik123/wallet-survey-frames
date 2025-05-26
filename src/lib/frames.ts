import { FrameResponse, FrameMetadata, FrameButton } from '@/types';
import satori from 'satori';
import sharp from 'sharp';

// Generate frame image using Satori (SVG to PNG)
export async function generateFrameImage(
  content: React.ReactElement,
  options: {
    width?: number;
    height?: number;
    fonts?: any[];
  } = {}
): Promise<Buffer> {
  const { width = 1200, height = 630 } = options;

  // Generate SVG using Satori
  const svg = await satori(content, {
    width,
    height,
    fonts: options.fonts || [],
  });

  // Convert SVG to PNG using Sharp
  const png = await sharp(Buffer.from(svg))
    .png()
    .toBuffer();

  return png;
}

// Create Frames v2 response
export function createFrameResponse(
  imageUrl: string,
  buttons: FrameButton[] = [],
  options: {
    input?: { text: string; placeholder?: string };
    postUrl?: string;
    state?: string;
    aspectRatio?: '1.91:1' | '1:1';
    refreshPeriod?: number;
    allowsRefresh?: boolean;
  } = {}
): FrameResponse {
  return {
    version: 'vNext',
    image: imageUrl,
    image_aspect_ratio: options.aspectRatio || '1.91:1',
    buttons: buttons.length > 0 ? buttons : undefined,
    input: options.input,
    post_url: options.postUrl,
    state: options.state,
    refresh_period: options.refreshPeriod,
    allows_refresh: options.allowsRefresh,
  };
}

// Generate frame metadata for HTML head
export function generateFrameMetadata(
  imageUrl: string,
  buttons: FrameButton[] = [],
  options: {
    postUrl?: string;
    input?: string;
    state?: string;
    aspectRatio?: '1.91:1' | '1:1';
    refreshPeriod?: number;
    allowsRefresh?: boolean;
  } = {}
): FrameMetadata {
  const metadata: FrameMetadata = {
    'fc:frame': 'vNext',
    'fc:frame:image': imageUrl,
  };

  if (options.aspectRatio) {
    metadata['fc:frame:image:aspect_ratio'] = options.aspectRatio;
  }

  if (options.postUrl) {
    metadata['fc:frame:post_url'] = options.postUrl;
  }

  if (options.input) {
    metadata['fc:frame:input:text'] = options.input;
  }

  if (options.state) {
    metadata['fc:frame:state'] = options.state;
  }

  if (options.refreshPeriod) {
    metadata['fc:frame:refresh_period'] = options.refreshPeriod.toString();
  }

  if (options.allowsRefresh) {
    metadata['fc:frame:allows_refresh'] = 'true';
  }

  // Add button metadata
  buttons.forEach((button, index) => {
    const buttonNum = (index + 1) as 1 | 2 | 3 | 4;
    if (buttonNum <= 4) {
      metadata[`fc:frame:button:${buttonNum}`] = button.label;
      
      if (button.action && button.action !== 'post') {
        metadata[`fc:frame:button:${buttonNum}:action`] = button.action;
      }
      
      if (button.target) {
        metadata[`fc:frame:button:${buttonNum}:target`] = button.target;
      }
    }
  });

  return metadata;
}

// Parse frame request from POST body
export function parseFrameRequest(body: any): {
  buttonIndex?: number;
  inputText?: string;
  fid?: number;
  address?: string;
  state?: string;
} {
  const untrustedData = body.untrustedData || {};
  
  return {
    buttonIndex: untrustedData.buttonIndex,
    inputText: untrustedData.inputText,
    fid: untrustedData.fid,
    address: untrustedData.address,
    state: untrustedData.state,
  };
}

// Validate frame request (basic validation)
export function validateFrameRequest(body: any): boolean {
  if (!body || !body.untrustedData) {
    return false;
  }

  const { untrustedData } = body;
  
  // Basic required fields
  return (
    typeof untrustedData.fid === 'number' &&
    typeof untrustedData.timestamp === 'number' &&
    typeof untrustedData.network === 'number'
  );
}

// Create survey state for multi-step frames
export function createSurveyState(
  surveyId: string,
  questionIndex: number,
  responses: Record<string, string | number> = {}
): string {
  const state = {
    surveyId,
    questionIndex,
    responses,
    timestamp: Date.now(),
  };
  
  return Buffer.from(JSON.stringify(state)).toString('base64');
}

// Parse survey state from frame request
export function parseSurveyState(stateString?: string): {
  surveyId?: string;
  questionIndex?: number;
  responses?: Record<string, string | number>;
  timestamp?: number;
} {
  if (!stateString) {
    return {};
  }

  try {
    const decoded = Buffer.from(stateString, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Failed to parse survey state:', error);
    return {};
  }
}

// Generate image URL for frame
export function getFrameImageUrl(baseUrl: string, path: string, params: Record<string, string> = {}): string {
  const url = new URL(path, baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return url.toString();
}
