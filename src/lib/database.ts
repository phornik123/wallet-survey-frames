import fs from 'fs/promises';
import path from 'path';
import { Survey, SurveyResponse } from '@/types';

export interface RewardRecord {
  surveyId: string;
  walletAddress: string;
  amount: number;
  transactionHash: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

const DATA_DIR = path.join(process.cwd(), 'data');
const SURVEYS_FILE = path.join(DATA_DIR, 'surveys.json');
const RESPONSES_FILE = path.join(DATA_DIR, 'responses.json');
const REWARDS_FILE = path.join(DATA_DIR, 'rewards.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Survey operations
export class Database {
  static async getSurveys(): Promise<Survey[]> {
    try {
      await ensureDataDir();
      const data = await fs.readFile(SURVEYS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // If file doesn't exist, return empty array
      return [];
    }
  }

  static async getSurvey(id: string): Promise<Survey | null> {
    const surveys = await this.getSurveys();
    return surveys.find(survey => survey.id === id) || null;
  }

  static async saveSurvey(survey: Survey): Promise<void> {
    const surveys = await this.getSurveys();
    const existingIndex = surveys.findIndex(s => s.id === survey.id);
    
    if (existingIndex >= 0) {
      surveys[existingIndex] = survey;
    } else {
      surveys.push(survey);
    }

    await ensureDataDir();
    await fs.writeFile(SURVEYS_FILE, JSON.stringify(surveys, null, 2));
  }

  static async getResponses(): Promise<SurveyResponse[]> {
    try {
      await ensureDataDir();
      const data = await fs.readFile(RESPONSES_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // If file doesn't exist, return empty array
      return [];
    }
  }

  static async saveResponse(response: SurveyResponse): Promise<void> {
    const responses = await this.getResponses();
    responses.push(response);

    await ensureDataDir();
    await fs.writeFile(RESPONSES_FILE, JSON.stringify(responses, null, 2));
  }

  static async hasUserResponded(surveyId: string, walletAddress: string): Promise<boolean> {
    const responses = await this.getResponses();
    return responses.some(
      response => 
        response.surveyId === surveyId && 
        response.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    );
  }

  static async getSurveyResponses(surveyId: string): Promise<SurveyResponse[]> {
    const responses = await this.getResponses();
    return responses.filter(response => response.surveyId === surveyId);
  }

  // Analytics helper
  static async getAnalytics(surveyId: string) {
    const responses = await this.getSurveyResponses(surveyId);
    const survey = await this.getSurvey(surveyId);
    
    if (!survey) {
      throw new Error('Survey not found');
    }

    const totalResponses = responses.length;
    const uniqueWallets = new Set(responses.map(r => r.walletAddress)).size;
    
    // Calculate response statistics
    const responsesByOption: Record<string, Record<string, number>> = {};
    
    survey.questions.forEach(question => {
      responsesByOption[question.id] = {};
      
      if (question.type === 'multiple-choice' && question.options) {
        question.options.forEach(option => {
          responsesByOption[question.id][option] = 0;
        });
      }
    });

    responses.forEach(response => {
      Object.entries(response.responses).forEach(([questionId, answer]) => {
        if (responsesByOption[questionId]) {
          const answerStr = String(answer);
          if (responsesByOption[questionId][answerStr] !== undefined) {
            responsesByOption[questionId][answerStr]++;
          } else {
            responsesByOption[questionId][answerStr] = 1;
          }
        }
      });
    });

    // Calculate average rating for rating questions
    let averageRating = 0;
    const ratingQuestions = survey.questions.filter(q => q.type === 'rating');
    if (ratingQuestions.length > 0) {
      const ratingResponses = responses.flatMap(response => 
        ratingQuestions.map(q => Number(response.responses[q.id]) || 0)
      ).filter(rating => rating > 0);
      
      if (ratingResponses.length > 0) {
        averageRating = ratingResponses.reduce((sum, rating) => sum + rating, 0) / ratingResponses.length;
      }
    }

    return {
      totalResponses,
      uniqueWallets,
      averageRating: Math.round(averageRating * 100) / 100,
      responsesByOption,
      completionRate: totalResponses > 0 ? 100 : 0 // For MVP, assume all responses are complete
    };
  }

  // Reward operations
  static async getRewards(): Promise<RewardRecord[]> {
    try {
      await ensureDataDir();
      const data = await fs.readFile(REWARDS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // If file doesn't exist, return empty array
      return [];
    }
  }

  static async getReward(surveyId: string, walletAddress: string): Promise<RewardRecord | null> {
    const rewards = await this.getRewards();
    return rewards.find(r => r.surveyId === surveyId && r.walletAddress.toLowerCase() === walletAddress.toLowerCase()) || null;
  }

  static async saveReward(reward: RewardRecord): Promise<void> {
    const rewards = await this.getRewards();
    rewards.push(reward);
    
    await ensureDataDir();
    await fs.writeFile(REWARDS_FILE, JSON.stringify(rewards, null, 2));
  }
}
