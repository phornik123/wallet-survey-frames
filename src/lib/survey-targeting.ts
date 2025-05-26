interface SurveyTarget {
  surveyId: string;
  segment: string[];
  priority: number;
}

export const SURVEY_TARGETS: SurveyTarget[] = [
  {
    surveyId: 'yield-optimizer-advanced',
    segment: ['yield-optimizer'],
    priority: 1
  },
  {
    surveyId: 'yield-curious-onboarding',
    segment: ['yield-curious'],
    priority: 1
  },
  {
    surveyId: 'memecoin-sentiment',
    segment: ['memecoin-degen'],
    priority: 1
  },
  {
    surveyId: 'conservative-yield',
    segment: ['conservative-defi'],
    priority: 1  
  },
  {
    surveyId: 'nft-utility',
    segment: ['nft-collector'],
    priority: 1
  },
  {
    surveyId: 'demo', // Default fallback
    segment: ['beginner'],
    priority: 0
  }
];

export function selectSurveyForSegment(segment: string): string {
  const target = SURVEY_TARGETS.find(t => t.segment.includes(segment));
  return target?.surveyId || 'demo';
}
