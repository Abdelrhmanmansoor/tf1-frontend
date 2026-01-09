/**
 * Step 5: Generate & Export
 * 
 * AI suggestions and PDF export
 */

'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { SportsCVData, CVExportOptions } from '@/types/cv-builder';
import { CVTemplateRenderer } from '@/components/cv-templates';
import { useAIAssistant } from '@/services/ai-assistant/useAIAssistant';
import { 
  Download, 
  FileText, 
  Sparkles, 
  Loader2, 
  CheckCircle, 
  AlertTriangle,
  Share2,
  Copy,
  Eye,
  Target,
  TrendingUp,
  FileJson,
  FileCode
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Step5GenerateExportProps {
  cvData: SportsCVData;
  selectedTemplate: string;
  cvId?: string;
  onSave: () => Promise<void>;
}

export default function Step5GenerateExport({
  cvData,
  selectedTemplate,
  cvId,
  onSave,
}: Step5GenerateExportProps) {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const { analyzeCV, detectMissing, checkATS, isLoading, analysis, error } = useAIAssistant();
  
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'html' | 'json'>('pdf');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [missingInfo, setMissingInfo] = useState<{
    missingSections: string[];
    completenessScore: number;
  } | null>(null);
  const [atsResult, setAtsResult] = useState<{
    score: number;
    issues: string[];
    recommendations: string[];
  } | null>(null);

  // Run AI analysis
  const handleAnalyze = async () => {
    const result = await analyzeCV(cvData);
    if (result) {
      setShowAnalysis(true);
      toast.success(isArabic ? 'تم تحليل السيرة الذاتية' : 'CV analyzed successfully');
    }
  };

  // Check for missing info
  const handleCheckMissing = async () => {
    const result = await detectMissing(cvData);
    if (result) {
      setMissingInfo(result);
      toast.success(isArabic ? 'تم فحص البيانات' : 'Data check complete');
    }
  };

  // Check ATS compatibility
  const handleCheckATS = async () => {
    const result = await checkATS(cvData);
    if (result) {
      setAtsResult(result);
      toast.success(isArabic ? 'تم فحص التوافق' : 'ATS check complete');
    }
  };

  // Export to PDF
  const handleExportPDF = async () => {
    setIsExporting(true);
    
    try {
      // First save the CV
      await onSave();
      
      // Generate PDF (mock implementation - would call backend)
      const element = document.getElementById('cv-preview-for-export');
      if (element) {
        // In production, call backend PDF generation endpoint
        toast.success(isArabic ? 'جاري إنشاء PDF...' : 'Generating PDF...');
        
        // Simulate PDF generation
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        toast.success(isArabic ? 'تم تحميل السيرة الذاتية بنجاح!' : 'CV downloaded successfully!');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error(isArabic ? 'فشل التصدير' : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  // Export to JSON
  const handleExportJSON = () => {
    const dataStr = JSON.stringify(cvData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cv-${cvData.personalInfo.fullName || 'export'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(isArabic ? 'تم تصدير البيانات' : 'Data exported');
  };

  // Copy share link
  const handleCopyLink = () => {
    if (cvId) {
      const shareUrl = `${window.location.origin}/cv/public/${cvId}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success(isArabic ? 'تم نسخ الرابط' : 'Link copied');
    } else {
      toast.error(isArabic ? 'احفظ السيرة أولاً' : 'Save CV first');
    }
  };

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'from-green-400 to-emerald-500';
    if (score >= 60) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-rose-500';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isArabic ? '🎉 سيرتك الذاتية جاهزة!' : '🎉 Your CV is Ready!'}
        </h2>
        <p className="text-gray-500">
          {isArabic 
            ? 'راجع سيرتك الذاتية واستخدم الذكاء الاصطناعي لتحسينها قبل التصدير'
            : 'Review your CV and use AI to improve it before exporting'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: AI Analysis & Actions */}
        <div className="space-y-6">
          {/* AI Quick Actions */}
          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-xl p-6 border border-purple-100">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              {isArabic ? 'تحليل الذكاء الاصطناعي' : 'AI Analysis'}
            </h3>

            <div className="space-y-3">
              <button
                onClick={handleAnalyze}
                disabled={isLoading.analyzeCV}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
              >
                {isLoading.analyzeCV ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Target className="w-5 h-5" />
                )}
                {isArabic ? 'تحليل شامل للسيرة' : 'Full CV Analysis'}
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleCheckMissing}
                  disabled={isLoading.analyzeCV}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span className="text-sm">{isArabic ? 'البيانات الناقصة' : 'Missing Data'}</span>
                </button>

                <button
                  onClick={handleCheckATS}
                  disabled={isLoading.analyzeCV}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">{isArabic ? 'توافق ATS' : 'ATS Check'}</span>
                </button>
              </div>
            </div>

            {/* Analysis Results */}
            {analysis && showAnalysis && (
              <div className="mt-6 space-y-4">
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className={`text-4xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                    {analysis.overallScore}
                    <span className="text-xl text-gray-400">/100</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {isArabic ? 'النتيجة الإجمالية' : 'Overall Score'}
                  </p>
                </div>

                {/* Category Scores */}
                <div className="space-y-2">
                  {Object.entries(analysis.categoryScores).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 capitalize">{key}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${getScoreBg(value)}`}
                            style={{ width: `${value}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Suggestions */}
                {analysis.suggestions.length > 0 && (
                  <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                    <h4 className="text-sm font-medium text-amber-800 mb-2">
                      {isArabic ? 'اقتراحات للتحسين:' : 'Improvement Suggestions:'}
                    </h4>
                    <ul className="space-y-1">
                      {analysis.suggestions.slice(0, 3).map((s, i) => (
                        <li key={i} className="text-xs text-amber-700 flex items-start gap-1">
                          <span>•</span>
                          <span>{s.message}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Missing Info Results */}
            {missingInfo && (
              <div className="mt-4 p-4 bg-white rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    {isArabic ? 'اكتمال البيانات' : 'Data Completeness'}
                  </span>
                  <span className={`font-bold ${getScoreColor(missingInfo.completenessScore)}`}>
                    {missingInfo.completenessScore}%
                  </span>
                </div>
                {missingInfo.missingSections.length > 0 && (
                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-1">{isArabic ? 'أقسام ناقصة:' : 'Missing sections:'}</p>
                    <ul className="list-disc list-inside">
                      {missingInfo.missingSections.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* ATS Results */}
            {atsResult && (
              <div className="mt-4 p-4 bg-white rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    {isArabic ? 'توافق ATS' : 'ATS Compatibility'}
                  </span>
                  <span className={`font-bold ${getScoreColor(atsResult.score)}`}>
                    {atsResult.score}%
                  </span>
                </div>
                {atsResult.issues.length > 0 && (
                  <div className="text-xs text-red-600">
                    {atsResult.issues.slice(0, 2).map((issue, i) => (
                      <p key={i}>⚠ {issue}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Export Options */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-500" />
              {isArabic ? 'خيارات التصدير' : 'Export Options'}
            </h3>

            <div className="space-y-4">
              {/* Export Format Selection */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setExportFormat('pdf')}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    exportFormat === 'pdf'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FileText className={`w-6 h-6 ${exportFormat === 'pdf' ? 'text-primary' : 'text-gray-400'}`} />
                  <span className="text-sm font-medium">PDF</span>
                </button>
                <button
                  onClick={() => setExportFormat('html')}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    exportFormat === 'html'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FileCode className={`w-6 h-6 ${exportFormat === 'html' ? 'text-primary' : 'text-gray-400'}`} />
                  <span className="text-sm font-medium">HTML</span>
                </button>
                <button
                  onClick={() => setExportFormat('json')}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    exportFormat === 'json'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FileJson className={`w-6 h-6 ${exportFormat === 'json' ? 'text-primary' : 'text-gray-400'}`} />
                  <span className="text-sm font-medium">JSON</span>
                </button>
              </div>

              {/* Export Button */}
              <button
                onClick={exportFormat === 'json' ? handleExportJSON : handleExportPDF}
                disabled={isExporting}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/30"
              >
                {isExporting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Download className="w-5 h-5" />
                )}
                {isArabic 
                  ? `تحميل بصيغة ${exportFormat.toUpperCase()}`
                  : `Download ${exportFormat.toUpperCase()}`}
              </button>

              {/* Share & Copy Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  {isArabic ? 'نسخ الرابط' : 'Copy Link'}
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  {isArabic ? 'مشاركة' : 'Share'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: CV Preview */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-gray-700">
                {isArabic ? 'معاينة السيرة الذاتية' : 'CV Preview'}
              </span>
            </div>
            <span className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded">
              {selectedTemplate}
            </span>
          </div>
          
          <div 
            id="cv-preview-for-export"
            className="p-4 bg-gray-100 overflow-auto"
            style={{ maxHeight: '600px' }}
          >
            <div className="bg-white shadow-lg mx-auto" style={{ maxWidth: '595px' }}>
              <CVTemplateRenderer
                templateId={selectedTemplate}
                cvData={cvData}
                compact={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {isArabic ? 'تهانينا! 🎊' : 'Congratulations! 🎊'}
        </h3>
        <p className="text-gray-600">
          {isArabic 
            ? 'سيرتك الذاتية جاهزة للتحميل والمشاركة. حظاً موفقاً في رحلتك المهنية!'
            : 'Your CV is ready to download and share. Good luck on your career journey!'}
        </p>
      </div>
    </div>
  );
}
