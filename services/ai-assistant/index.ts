/**
 * AI Assistant Service for tf1one.com CV Builder
 * 
 * Centralized AI-powered features using OpenAI GPT-4
 * Provides CV analysis, text improvement, skill suggestions, and more
 * 
 * @module services/ai-assistant
 */

import { CVData, Experience, Education } from '@/types/cv';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

/**
 * AI Analysis Result for CV scoring and feedback
 */
export interface AIAnalysisResult {
  overallScore: number;
  categoryScores: {
    content: number;
    formatting: number;
    keywords: number;
    completeness: number;
    sportsRelevance: number;
  };
  suggestions: AIImprovement[];
  strengths: string[];
  weaknesses: string[];
  atsScore: number;
  atsIssues: string[];
}

/**
 * Single improvement suggestion from AI
 */
export interface AIImprovement {
  id: string;
  type: 'critical' | 'important' | 'optional';
  category: 'content' | 'formatting' | 'keywords' | 'sports' | 'structure';
  section: string;
  originalText?: string;
  suggestedText?: string;
  message: string;
  impact: 'high' | 'medium' | 'low';
}

/**
 * AI text improvement options
 */
export interface TextImprovementOptions {
  style?: 'professional' | 'creative' | 'concise' | 'detailed';
  language?: 'en' | 'ar';
  context?: 'summary' | 'experience' | 'achievement' | 'skill';
  targetRole?: string;
  industry?: string;
}

/**
 * AI Chat Message
 */
export interface AIChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

/**
 * AI Assistant Service Class
 * 
 * Handles all AI-powered CV features for tf1one.com
 */
export class AIAssistantService {
  private token: string | null = null;
  private conversationHistory: AIChatMessage[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken');
    }
  }

  /**
   * Internal fetch helper with auth
   */
  private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `API error: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Refresh auth token from storage
   */
  public refreshToken(): void {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken');
    }
  }

  // ============================================
  // TEXT IMPROVEMENT FEATURES
  // ============================================

  /**
   * Improve any text with AI
   */
  async improveText(
    text: string,
    options: TextImprovementOptions = {}
  ): Promise<string> {
    const result = await this.fetch<{ improved: string }>('/ai-assistant/improve-text', {
      method: 'POST',
      body: JSON.stringify({ text, ...options }),
    });
    return result.improved;
  }

  /**
   * Generate professional summary based on CV data
   */
  async generateSummary(
    cvData: Partial<CVData>,
    language: 'en' | 'ar' = 'en',
    targetRole?: string
  ): Promise<string> {
    const result = await this.fetch<{ summary: string }>('/ai-assistant/generate-summary', {
      method: 'POST',
      body: JSON.stringify({ cvData, language, targetRole }),
    });
    return result.summary;
  }

  /**
   * Improve job/experience description
   */
  async improveJobDescription(
    description: string,
    jobTitle: string,
    company?: string,
    language: 'en' | 'ar' = 'en'
  ): Promise<string> {
    const result = await this.fetch<{ improved: string }>('/ai-assistant/improve-description', {
      method: 'POST',
      body: JSON.stringify({ description, jobTitle, company, language }),
    });
    return result.improved;
  }

  /**
   * Generate achievement bullet points
   */
  async generateAchievements(
    jobTitle: string,
    industry?: string,
    count: number = 3,
    language: 'en' | 'ar' = 'en'
  ): Promise<string[]> {
    const result = await this.fetch<{ achievements: string[] }>('/ai-assistant/generate-achievements', {
      method: 'POST',
      body: JSON.stringify({ jobTitle, industry, count, language }),
    });
    return result.achievements;
  }

  /**
   * Improve sports achievements description
   */
  async improveSportsAchievement(
    achievement: string,
    sport: string,
    level: 'amateur' | 'semi-pro' | 'professional' | 'national' | 'international',
    language: 'en' | 'ar' = 'en'
  ): Promise<string> {
    const result = await this.fetch<{ improved: string }>('/ai-assistant/improve-sports-achievement', {
      method: 'POST',
      body: JSON.stringify({ achievement, sport, level, language }),
    });
    return result.improved;
  }

  // ============================================
  // CV ANALYSIS FEATURES
  // ============================================

  /**
   * Analyze entire CV and get comprehensive feedback
   */
  async analyzeCV(cvData: CVData): Promise<AIAnalysisResult> {
    return await this.fetch<AIAnalysisResult>('/ai-assistant/analyze-cv', {
      method: 'POST',
      body: JSON.stringify({ cvData }),
    });
  }

  /**
   * Check CV for ATS compatibility
   */
  async checkATSCompatibility(cvData: CVData): Promise<{
    score: number;
    issues: string[];
    recommendations: string[];
  }> {
    return await this.fetch('/ai-assistant/check-ats', {
      method: 'POST',
      body: JSON.stringify({ cvData }),
    });
  }

  /**
   * Detect missing sections or information
   */
  async detectMissingInfo(cvData: CVData): Promise<{
    missingSections: string[];
    recommendations: string[];
    completenessScore: number;
  }> {
    return await this.fetch('/ai-assistant/detect-missing', {
      method: 'POST',
      body: JSON.stringify({ cvData }),
    });
  }

  // ============================================
  // SKILL SUGGESTIONS
  // ============================================

  /**
   * Suggest relevant skills based on job title and industry
   */
  async suggestSkills(
    jobTitle: string,
    industry?: string,
    currentSkills: string[] = [],
    language: 'en' | 'ar' = 'en'
  ): Promise<string[]> {
    const result = await this.fetch<{ skills: string[] }>('/ai-assistant/suggest-skills', {
      method: 'POST',
      body: JSON.stringify({ jobTitle, industry, currentSkills, language }),
    });
    return result.skills;
  }

  /**
   * Suggest sports-specific skills
   */
  async suggestSportsSkills(
    sport: string,
    role: 'player' | 'coach' | 'manager' | 'analyst' | 'trainer' | 'physiotherapist',
    language: 'en' | 'ar' = 'en'
  ): Promise<string[]> {
    const result = await this.fetch<{ skills: string[] }>('/ai-assistant/suggest-sports-skills', {
      method: 'POST',
      body: JSON.stringify({ sport, role, language }),
    });
    return result.skills;
  }

  // ============================================
  // KEYWORD EXTRACTION
  // ============================================

  /**
   * Extract keywords from job description
   */
  async extractKeywords(
    text: string,
    count: number = 10
  ): Promise<{
    keywords: string[];
    categories: { [key: string]: string[] };
  }> {
    return await this.fetch('/ai-assistant/extract-keywords', {
      method: 'POST',
      body: JSON.stringify({ text, count }),
    });
  }

  /**
   * Match CV keywords to job description
   */
  async matchKeywords(
    cvData: CVData,
    jobDescription: string
  ): Promise<{
    matchScore: number;
    matchedKeywords: string[];
    missingKeywords: string[];
    recommendations: string[];
  }> {
    return await this.fetch('/ai-assistant/match-keywords', {
      method: 'POST',
      body: JSON.stringify({ cvData, jobDescription }),
    });
  }

  // ============================================
  // CHAT ASSISTANT
  // ============================================

  /**
   * Send message to AI chat assistant
   */
  async chat(
    message: string,
    context?: {
      cvData?: Partial<CVData>;
      currentSection?: string;
      language?: 'en' | 'ar';
    }
  ): Promise<string> {
    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      content: message,
      timestamp: Date.now(),
    });

    const result = await this.fetch<{ response: string }>('/ai-assistant/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        history: this.conversationHistory.slice(-10), // Keep last 10 messages
        context,
      }),
    });

    // Add assistant response to history
    this.conversationHistory.push({
      role: 'assistant',
      content: result.response,
      timestamp: Date.now(),
    });

    return result.response;
  }

  /**
   * Clear chat history
   */
  clearChatHistory(): void {
    this.conversationHistory = [];
  }

  /**
   * Get chat history
   */
  getChatHistory(): AIChatMessage[] {
    return [...this.conversationHistory];
  }

  // ============================================
  // TAILORING & OPTIMIZATION
  // ============================================

  /**
   * Tailor CV for specific job
   */
  async tailorForJob(
    cvData: CVData,
    jobDescription: string,
    jobTitle: string
  ): Promise<{
    tailoredCV: CVData;
    changes: Array<{
      section: string;
      field: string;
      original: string;
      suggested: string;
      reason: string;
    }>;
    matchScore: number;
  }> {
    return await this.fetch('/ai-assistant/tailor-cv', {
      method: 'POST',
      body: JSON.stringify({ cvData, jobDescription, jobTitle }),
    });
  }

  /**
   * Generate cover letter
   */
  async generateCoverLetter(
    cvData: CVData,
    jobDescription: string,
    companyName: string,
    language: 'en' | 'ar' = 'en'
  ): Promise<string> {
    const result = await this.fetch<{ coverLetter: string }>('/ai-assistant/generate-cover-letter', {
      method: 'POST',
      body: JSON.stringify({ cvData, jobDescription, companyName, language }),
    });
    return result.coverLetter;
  }

  // ============================================
  // GRAMMAR & STYLE
  // ============================================

  /**
   * Fix grammar and spelling
   */
  async fixGrammar(text: string, language: 'en' | 'ar' = 'en'): Promise<string> {
    const result = await this.fetch<{ corrected: string }>('/ai-assistant/fix-grammar', {
      method: 'POST',
      body: JSON.stringify({ text, language }),
    });
    return result.corrected;
  }

  /**
   * Adjust tone (professional, friendly, formal, etc.)
   */
  async adjustTone(
    text: string,
    targetTone: 'professional' | 'friendly' | 'formal' | 'casual' | 'confident',
    language: 'en' | 'ar' = 'en'
  ): Promise<string> {
    const result = await this.fetch<{ adjusted: string }>('/ai-assistant/adjust-tone', {
      method: 'POST',
      body: JSON.stringify({ text, targetTone, language }),
    });
    return result.adjusted;
  }
}

// Export singleton instance
export const aiAssistant = new AIAssistantService();

// Export default
export default aiAssistant;
