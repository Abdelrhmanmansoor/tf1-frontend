'use client';

import React, { useState } from 'react';
import { Sparkles, Target, TrendingUp, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { cvAIService, AIAnalysis } from '@/services/cv-ai.service';
import { useLanguage } from '@/contexts/language-context';
import toast from 'react-hot-toast';

interface AIAssistantProps {
  cvId?: string;
  onSuggestionApplied?: () => void;
}

export function AIAssistant({ cvId, onSuggestionApplied }: AIAssistantProps) {
  const { language } = useLanguage();
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const analyzeCV = async () => {
    if (!cvId) {
      toast.error(language === 'ar' ? 'الرجاء حفظ السيرة الذاتية أولاً' : 'Please save CV first');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await cvAIService.analyzeCV(cvId);
      setAnalysis(result);
      toast.success(language === 'ar' ? 'تم تحليل السيرة الذاتية بنجاح' : 'CV analyzed successfully');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error(language === 'ar' ? 'فشل التحليل' : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateSummary = async () => {
    if (!cvId) {
      toast.error(language === 'ar' ? 'الرجاء حفظ السيرة الذاتية أولاً' : 'Please save CV first');
      return;
    }

    setIsGenerating(true);
    try {
      const summary = await cvAIService.generateSummary(cvId, language);
      
      // Copy to clipboard
      await navigator.clipboard.writeText(summary);
      
      toast.success(
        language === 'ar'
          ? 'تم إنشاء الملخص ونسخه إلى الحافظة'
          : 'Summary generated and copied to clipboard',
      );
      
      onSuggestionApplied?.();
    } catch (error) {
      console.error('Generation error:', error);
      toast.error(language === 'ar' ? 'فشل إنشاء الملخص' : 'Failed to generate summary');
    } finally {
      setIsGenerating(false);
    }
  };

  const getSeverityColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'important':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (language === 'ar') {
      if (score >= 80) return 'ممتاز';
      if (score >= 60) return 'جيد';
      return 'يحتاج تحسين';
    }
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-xl shadow-lg p-6 space-y-6 border border-purple-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {language === 'ar' ? '🤖 المساعد الذكي' : '🤖 AI Assistant'}
            </h3>
            <p className="text-sm text-gray-600">
              {language === 'ar' ? 'محرك بتقنية GPT-4' : 'Powered by GPT-4'}
            </p>
          </div>
        </div>
      </div>

      {/* Score Display */}
      {analysis && (
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="text-center mb-4">
            <div className={`text-5xl font-bold ${getScoreColor(analysis.score)}`}>
              {analysis.score}
              <span className="text-2xl">/100</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {getScoreLabel(analysis.score)}
            </p>
          </div>

          {/* Score Breakdown */}
          <div className="space-y-2">
            {Object.entries(analysis.scores).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 capitalize">
                  {language === 'ar' ? key : key}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getScoreColor(value)} bg-current`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-10">
                    {value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-700">
          {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
        </h4>
        
        <button
          onClick={analyzeCV}
          disabled={isAnalyzing || !cvId}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Target className="w-5 h-5" />
          )}
          <span className="font-medium">
            {language === 'ar' ? 'تحليل السيرة الذاتية' : 'Analyze CV'}
          </span>
        </button>

        <button
          onClick={generateSummary}
          disabled={isGenerating || !cvId}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
          <span className="font-medium">
            {language === 'ar' ? 'إنشاء ملخص احترافي' : 'Generate Summary'}
          </span>
        </button>

        <button
          onClick={() => {
            if (cvId) {
              toast.success(language === 'ar' ? 'قريباً' : 'Coming soon');
            }
          }}
          disabled={!cvId}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <TrendingUp className="w-5 h-5" />
          <span className="font-medium">
            {language === 'ar' ? 'تحسين كل الأقسام' : 'Improve All Sections'}
          </span>
        </button>
      </div>

      {/* Suggestions */}
      {analysis && analysis.suggestions.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700">
            {language === 'ar' ? 'اقتراحات التحسين' : 'Improvement Suggestions'}
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {analysis.suggestions.slice(0, 5).map((suggestion, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${getSeverityColor(suggestion.type)}`}
              >
                <div className="flex items-start gap-2">
                  {suggestion.type === 'critical' ? (
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{suggestion.message}</p>
                    <p className="text-xs mt-1 opacity-80">{suggestion.actionable}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ATS Compatibility */}
      {analysis && (
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-700">
              {language === 'ar' ? 'توافق ATS' : 'ATS Compatibility'}
            </h4>
            <span className={`text-2xl font-bold ${getScoreColor(analysis.atsCompatibility.score)}`}>
              {analysis.atsCompatibility.score}%
            </span>
          </div>
          {analysis.atsCompatibility.recommendations.length > 0 && (
            <div className="space-y-1">
              {analysis.atsCompatibility.recommendations.slice(0, 3).map((rec, index) => (
                <p key={index} className="text-xs text-gray-600 flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>{rec}</span>
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div className="text-xs text-gray-500 text-center pt-4 border-t border-gray-200">
        {language === 'ar'
          ? 'جميع التحسينات مدعومة بالذكاء الاصطناعي GPT-4'
          : 'All improvements powered by GPT-4 AI'}
      </div>
    </div>
  );
}
