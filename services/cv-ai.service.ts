import { CVData } from '@/types/cv';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

/**
 * AI Analysis Result
 */
export interface AIAnalysis {
  score: number;
  scores: {
    formatting: number;
    content: number;
    keywords: number;
    structure: number;
    completeness: number;
  };
  suggestions: AISuggestion[];
  keywords: {
    present: string[];
    missing: string[];
    suggested: string[];
  };
  strengths: string[];
  weaknesses: string[];
  atsCompatibility: {
    score: number;
    issues: string[];
    recommendations: string[];
  };
}

export interface AISuggestion {
  type: 'critical' | 'important' | 'optional';
  category: 'content' | 'formatting' | 'keywords' | 'structure';
  message: string;
  section?: string;
  actionable: string;
}

/**
 * Tailored CV Result
 */
export interface TailoredCVResult {
  originalCV: CVData;
  tailoredCV: CVData;
  changes: {
    section: string;
    field: string;
    oldValue: string;
    newValue: string;
    reason: string;
  }[];
  matchScore: number;
  improvements: string[];
}

/**
 * CV AI Service
 * 
 * Frontend service for AI-powered CV features
 */
export class CVAIService {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken');
    }
  }

  private async fetch(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `API error: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Generate professional summary using AI
   */
  async generateSummary(cvId: string, language: 'en' | 'ar' = 'en'): Promise<string> {
    const result = await this.fetch(`/cv/${cvId}/ai/generate-summary`, {
      method: 'POST',
      body: JSON.stringify({ language }),
    });
    return result.summary;
  }

  /**
   * Improve job description using AI
   */
  async improveDescription(
    cvId: string,
    description: string,
    jobTitle: string,
    language: 'en' | 'ar' = 'en',
  ): Promise<string> {
    const result = await this.fetch(`/cv/${cvId}/ai/improve-description`, {
      method: 'POST',
      body: JSON.stringify({ description, jobTitle, language }),
    });
    return result.improved;
  }

  /**
   * Analyze CV and get comprehensive feedback
   */
  async analyzeCV(cvId: string): Promise<AIAnalysis> {
    return await this.fetch(`/cv/${cvId}/ai/analyze`, {
      method: 'POST',
    });
  }

  /**
   * Tailor CV for specific job
   */
  async tailorCV(cvId: string, jobDescription: string): Promise<TailoredCVResult> {
    return await this.fetch(`/cv/${cvId}/ai/tailor`, {
      method: 'POST',
      body: JSON.stringify({ jobDescription }),
    });
  }

  /**
   * Generate bullet points using AI
   */
  async generateBulletPoints(
    jobTitle: string,
    company?: string,
    industry?: string,
    count: number = 3,
    language: 'en' | 'ar' = 'en',
  ): Promise<string[]> {
    const result = await this.fetch('/cv/ai/generate-bullets', {
      method: 'POST',
      body: JSON.stringify({ jobTitle, company, industry, count, language }),
    });
    return result.bullets;
  }

  /**
   * Get skill suggestions using AI
   */
  async suggestSkills(jobTitle: string, currentSkills: string[]): Promise<string[]> {
    const result = await this.fetch('/cv/ai/suggest-skills', {
      method: 'POST',
      body: JSON.stringify({ jobTitle, currentSkills }),
    });
    return result.skills;
  }

  /**
   * Generate cover letter using AI
   */
  async generateCoverLetter(
    cvId: string,
    jobDescription: string,
    companyName: string,
    language: 'en' | 'ar' = 'en',
  ): Promise<string> {
    const result = await this.fetch(`/cv/${cvId}/ai/cover-letter`, {
      method: 'POST',
      body: JSON.stringify({ jobDescription, companyName, language }),
    });
    return result.coverLetter;
  }

  /**
   * Extract keywords from text using AI
   */
  async extractKeywords(text: string, count: number = 10): Promise<string[]> {
    const result = await this.fetch('/cv/ai/extract-keywords', {
      method: 'POST',
      body: JSON.stringify({ text, count }),
    });
    return result.keywords;
  }
}

export const cvAIService = new CVAIService();
