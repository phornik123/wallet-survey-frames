// Survey and Response Types based on context guide schemas

export interface Question {
  id: string;                                    // Unique identifier
  type: 'multiple-choice' | 'text' | 'rating';  // Question type
  question: string;                              // Question text
  options?: string[];                            // For multiple-choice
  required: boolean;                             // Whether required
}

export interface Survey {
  id: string;              // kebab-case, no spaces
  title: string;           // max 60 characters
  questions: Question[];   // max 5 questions per survey
  createdAt: string;       // ISO string
  isActive: boolean;       // simple on/off toggle
}

export interface SurveyResponse {
  surveyId: string;
  walletAddress: string;                    // lowercase, validated format
  responses: Record<string, string | number>; // Question ID -> Answer mapping
  submittedAt: string;                      // ISO string
}

// Frames v2 types
export interface FrameRequest {
  untrustedData: {
    fid: number;
    url: string;
    messageHash: string;
    timestamp: number;
    network: number;
    buttonIndex?: number;
    inputText?: string;
    castId?: {
      fid: number;
      hash: string;
    };
    address?: string; // v2 wallet address
    transactionId?: string; // v2 transaction support
  };
  trustedData?: {
    messageBytes: string;
  };
}

export interface FrameButton {
  label: string;
  action?: 'post' | 'post_redirect' | 'link' | 'mint' | 'tx';
  target?: string;
  post_url?: string;
}

export interface FrameResponse {
  version: 'vNext'; // Frames v2 identifier
  image: string;
  image_aspect_ratio?: '1.91:1' | '1:1';
  buttons?: FrameButton[];
  input?: {
    text: string;
    placeholder?: string;
  };
  post_url?: string;
  refresh_period?: number;
  allows_refresh?: boolean;
  state?: string;
}

export interface FrameMetadata {
  'fc:frame': string;
  'fc:frame:image': string;
  'fc:frame:image:aspect_ratio'?: string;
  'fc:frame:post_url'?: string;
  'fc:frame:input:text'?: string;
  'fc:frame:button:1'?: string;
  'fc:frame:button:1:action'?: string;
  'fc:frame:button:1:target'?: string;
  'fc:frame:button:2'?: string;
  'fc:frame:button:2:action'?: string;
  'fc:frame:button:2:target'?: string;
  'fc:frame:button:3'?: string;
  'fc:frame:button:3:action'?: string;
  'fc:frame:button:3:target'?: string;
  'fc:frame:button:4'?: string;
  'fc:frame:button:4:action'?: string;
  'fc:frame:button:4:target'?: string;
  'fc:frame:state'?: string;
  'fc:frame:refresh_period'?: string;
  'fc:frame:allows_refresh'?: string;
}

// SDK Configuration types
export interface WalletSurveyConfig {
  apiBase?: string;
  theme?: 'light' | 'dark';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  debug?: boolean;
  styles?: Record<string, string>;
}

// Trigger types
export type TriggerType = 'pageview' | 'time' | 'scroll' | 'exit-intent';

export interface TriggerConfig {
  type: TriggerType;
  value?: string | number;
  context?: Record<string, any>;
}

// Wallet Profile types for Zapper integration
export interface WalletProfile {
  totalValue: number;
  topTokens: Array<{ symbol: string; balance: string; value: number }>;
  defiPositions: Array<{ protocol: string; value: number; type: string }>;
  chains: string[];
}
