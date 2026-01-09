/**
 * AI Assistant React Hook for tf1one.com CV Builder
 * 
 * Provides easy-to-use React integration for AI features
 * Handles loading states, errors, and caching
 * 
 * @module services/ai-assistant/useAIAssistant
 */

'use client';

import { useState, useCallback, useRef } from 'react';
import { aiAssistant, AIAnalysisResult, AIImprovement, TextImprovementOptions } from './index';
import { CVData } from '@/types/cv';
import { useLanguage } from '@/contexts/language-context';

/**
 * AI operation loading states
 */
interface AILoadingStates {
  improveText: boolean;
  generateSummary: boolean;
  analyzeCV: boolean;
  suggestSkills: boolean;
  chat: boolean;
  tailorCV: boolean;
  extractKeywords: boolean;
}

/**
 * AI Assistant Hook return type
 */
interface UseAIAssistantReturn {
  // States
  isLoading: AILoadingStates;
  error: string | null;
  analysis: AIAnalysisResult | null;
  chatHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  
  // Text improvement
  improveText: (text: string, options?: TextImprovementOptions) => Promise<string | null>;
  improveDescription: (description: string, jobTitle: string, company?: string) => Promise<string | null>;
  
  // Summary generation
  generateSummary: (cvData: Partial<CVData>, targetRole?: string) => Promise<string | null>;
  
  // Achievements generation
  generateAchievements: (jobTitle: string, industry?: string, count?: number) => Promise<string[]>;
  
  // Analysis
  analyzeCV: (cvData: CVData) => Promise<AIAnalysisResult | null>;
  checkATS: (cvData: CVData) => Promise<{ score: number; issues: string[]; recommendations: string[] } | null>;
  detectMissing: (cvData: CVData) => Promise<{ missingSections: string[]; completenessScore: number } | null>;
  
  // Skills
  suggestSkills: (jobTitle: string, industry?: string, currentSkills?: string[]) => Promise<string[]>;
  suggestSportsSkills: (sport: string, role: string) => Promise<string[]>;
  
  // Chat
  chat: (message: string, context?: { cvData?: Partial<CVData>; currentSection?: string }) => Promise<string | null>;
  clearChat: () => void;
  
  // Keywords
  extractKeywords: (text: string, count?: number) => Promise<string[]>;
  matchKeywords: (cvData: CVData, jobDescription: string) => Promise<{ matchScore: number; matchedKeywords: string[]; missingKeywords: string[] } | null>;
  
  // Tailoring
  tailorForJob: (cvData: CVData, jobDescription: string, jobTitle: string) => Promise<{ tailoredCV: CVData; changes: any[]; matchScore: number } | null>;
  generateCoverLetter: (cvData: CVData, jobDescription: string, companyName: string) => Promise<string | null>;
  
  // Grammar & Tone
  fixGrammar: (text: string) => Promise<string | null>;
  adjustTone: (text: string, targetTone: 'professional' | 'friendly' | 'formal' | 'casual' | 'confident') => Promise<string | null>;
  
  // Helpers
  clearError: () => void;
}

/**
 * Custom hook for AI Assistant features
 */
export function useAIAssistant(): UseAIAssistantReturn {
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState<AILoadingStates>({
    improveText: false,
    generateSummary: false,
    analyzeCV: false,
    suggestSkills: false,
    chat: false,
    tailorCV: false,
    extractKeywords: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  
  // Cache for suggestions
  const skillsCache = useRef<Map<string, string[]>>(new Map());

  /**
   * Set loading state for a specific operation
   */
  const setLoadingState = useCallback((key: keyof AILoadingStates, value: boolean) => {
    setIsLoading(prev => ({ ...prev, [key]: value }));
  }, []);

  /**
   * Wrapper for async operations with error handling
   */
  const withErrorHandling = useCallback(async <T>(
    operation: () => Promise<T>,
    loadingKey: keyof AILoadingStates
  ): Promise<T | null> => {
    setLoadingState(loadingKey, true);
    setError(null);
    
    try {
      const result = await operation();
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred with AI Assistant';
      setError(errorMessage);
      console.error(`AI Assistant Error (${loadingKey}):`, err);
      return null;
    } finally {
      setLoadingState(loadingKey, false);
    }
  }, [setLoadingState]);

  // ============================================
  // TEXT IMPROVEMENT
  // ============================================

  const improveText = useCallback(async (
    text: string,
    options?: TextImprovementOptions
  ): Promise<string | null> => {
    return withErrorHandling(
      () => aiAssistant.improveText(text, { ...options, language: options?.language || language as 'en' | 'ar' }),
      'improveText'
    );
  }, [withErrorHandling, language]);

  const improveDescription = useCallback(async (
    description: string,
    jobTitle: string,
    company?: string
  ): Promise<string | null> => {
    return withErrorHandling(
      () => aiAssistant.improveJobDescription(description, jobTitle, company, language as 'en' | 'ar'),
      'improveText'
    );
  }, [withErrorHandling, language]);

  // ============================================
  // SUMMARY GENERATION
  // ============================================

  const generateSummary = useCallback(async (
    cvData: Partial<CVData>,
    targetRole?: string
  ): Promise<string | null> => {
    return withErrorHandling(
      () => aiAssistant.generateSummary(cvData, language as 'en' | 'ar', targetRole),
      'generateSummary'
    );
  }, [withErrorHandling, language]);

  // ============================================
  // ACHIEVEMENTS GENERATION
  // ============================================

  const generateAchievements = useCallback(async (
    jobTitle: string,
    industry?: string,
    count: number = 3
  ): Promise<string[]> => {
    const result = await withErrorHandling(
      () => aiAssistant.generateAchievements(jobTitle, industry, count, language as 'en' | 'ar'),
      'improveText'
    );
    return result || [];
  }, [withErrorHandling, language]);

  // ============================================
  // CV ANALYSIS
  // ============================================

  const analyzeCV = useCallback(async (cvData: CVData): Promise<AIAnalysisResult | null> => {
    const result = await withErrorHandling(
      () => aiAssistant.analyzeCV(cvData),
      'analyzeCV'
    );
    
    if (result) {
      setAnalysis(result);
    }
    
    return result;
  }, [withErrorHandling]);

  const checkATS = useCallback(async (cvData: CVData) => {
    return withErrorHandling(
      () => aiAssistant.checkATSCompatibility(cvData),
      'analyzeCV'
    );
  }, [withErrorHandling]);

  const detectMissing = useCallback(async (cvData: CVData) => {
    return withErrorHandling(
      () => aiAssistant.detectMissingInfo(cvData),
      'analyzeCV'
    );
  }, [withErrorHandling]);

  // ============================================
  // SKILL SUGGESTIONS
  // ============================================

  const suggestSkills = useCallback(async (
    jobTitle: string,
    industry?: string,
    currentSkills: string[] = []
  ): Promise<string[]> => {
    // Check cache
    const cacheKey = `${jobTitle}-${industry || ''}-${currentSkills.join(',')}`;
    if (skillsCache.current.has(cacheKey)) {
      return skillsCache.current.get(cacheKey)!;
    }

    const result = await withErrorHandling(
      () => aiAssistant.suggestSkills(jobTitle, industry, currentSkills, language as 'en' | 'ar'),
      'suggestSkills'
    );

    const skills = result || [];
    skillsCache.current.set(cacheKey, skills);
    return skills;
  }, [withErrorHandling, language]);

  const suggestSportsSkills = useCallback(async (
    sport: string,
    role: string
  ): Promise<string[]> => {
    const result = await withErrorHandling(
      () => aiAssistant.suggestSportsSkills(
        sport,
        role as 'player' | 'coach' | 'manager' | 'analyst' | 'trainer' | 'physiotherapist',
        language as 'en' | 'ar'
      ),
      'suggestSkills'
    );
    return result || [];
  }, [withErrorHandling, language]);

  // ============================================
  // CHAT
  // ============================================

  const chat = useCallback(async (
    message: string,
    context?: { cvData?: Partial<CVData>; currentSection?: string }
  ): Promise<string | null> => {
    setChatHistory(prev => [...prev, { role: 'user', content: message }]);
    
    const result = await withErrorHandling(
      () => aiAssistant.chat(message, { ...context, language: language as 'en' | 'ar' }),
      'chat'
    );

    if (result) {
      setChatHistory(prev => [...prev, { role: 'assistant', content: result }]);
    }

    return result;
  }, [withErrorHandling, language]);

  const clearChat = useCallback(() => {
    aiAssistant.clearChatHistory();
    setChatHistory([]);
  }, []);

  // ============================================
  // KEYWORDS
  // ============================================

  const extractKeywords = useCallback(async (
    text: string,
    count: number = 10
  ): Promise<string[]> => {
    const result = await withErrorHandling(
      () => aiAssistant.extractKeywords(text, count),
      'extractKeywords'
    );
    return result?.keywords || [];
  }, [withErrorHandling]);

  const matchKeywords = useCallback(async (
    cvData: CVData,
    jobDescription: string
  ) => {
    return withErrorHandling(
      () => aiAssistant.matchKeywords(cvData, jobDescription),
      'extractKeywords'
    );
  }, [withErrorHandling]);

  // ============================================
  // TAILORING
  // ============================================

  const tailorForJob = useCallback(async (
    cvData: CVData,
    jobDescription: string,
    jobTitle: string
  ) => {
    return withErrorHandling(
      () => aiAssistant.tailorForJob(cvData, jobDescription, jobTitle),
      'tailorCV'
    );
  }, [withErrorHandling]);

  const generateCoverLetter = useCallback(async (
    cvData: CVData,
    jobDescription: string,
    companyName: string
  ): Promise<string | null> => {
    return withErrorHandling(
      () => aiAssistant.generateCoverLetter(cvData, jobDescription, companyName, language as 'en' | 'ar'),
      'tailorCV'
    );
  }, [withErrorHandling, language]);

  // ============================================
  // GRAMMAR & TONE
  // ============================================

  const fixGrammar = useCallback(async (text: string): Promise<string | null> => {
    return withErrorHandling(
      () => aiAssistant.fixGrammar(text, language as 'en' | 'ar'),
      'improveText'
    );
  }, [withErrorHandling, language]);

  const adjustTone = useCallback(async (
    text: string,
    targetTone: 'professional' | 'friendly' | 'formal' | 'casual' | 'confident'
  ): Promise<string | null> => {
    return withErrorHandling(
      () => aiAssistant.adjustTone(text, targetTone, language as 'en' | 'ar'),
      'improveText'
    );
  }, [withErrorHandling, language]);

  // ============================================
  // HELPERS
  // ============================================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // States
    isLoading,
    error,
    analysis,
    chatHistory,
    
    // Text improvement
    improveText,
    improveDescription,
    
    // Summary
    generateSummary,
    
    // Achievements
    generateAchievements,
    
    // Analysis
    analyzeCV,
    checkATS,
    detectMissing,
    
    // Skills
    suggestSkills,
    suggestSportsSkills,
    
    // Chat
    chat,
    clearChat,
    
    // Keywords
    extractKeywords,
    matchKeywords,
    
    // Tailoring
    tailorForJob,
    generateCoverLetter,
    
    // Grammar & Tone
    fixGrammar,
    adjustTone,
    
    // Helpers
    clearError,
  };
}

export default useAIAssistant;
