'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '@/services/api';

export default function SummaryForm({ data, update, language, personalInfo }: any) {
  const [loading, setLoading] = useState(false);

  const generateSummary = async () => {
    if (!personalInfo.jobTitle) {
      toast.error(language === 'ar' ? 'يرجى إدخال المسمى الوظيفي أولاً' : 'Please enter job title first');
      return;
    }

    setLoading(true);
    let retries = 0;
    const maxRetries = 3;

    const attemptGeneration = async (): Promise<void> => {
      try {
        const response = await api.post('/cv/ai/generate', {
          type: 'summary',
          data: personalInfo,
          language
        });

        if (response.data.success && response.data.data?.result) {
          update(response.data.data.result);
          toast.success(language === 'ar' ? 'تم توليد الملخص بنجاح' : 'Summary generated successfully');
        } else if (response.data.data?.result) {
          update(response.data.data.result);
          toast.success(language === 'ar' ? 'تم توليد الملخص بنجاح' : 'Summary generated successfully');
        } else {
          throw new Error(response.data.message || (language === 'ar' ? 'فشل توليد الملخص' : 'AI Generation failed'));
        }
      } catch (error: any) {
        // Network error - retry
        const isNetworkError = error.message?.includes('Failed to fetch') || 
                              error.message?.includes('Network Error') || 
                              error.message?.includes('NetworkError') ||
                              !error.response;
        
        if (isNetworkError && retries < maxRetries) {
          retries++;
          toast.loading(language === 'ar' ? `إعادة المحاولة... (${retries}/${maxRetries})` : `Retrying... (${retries}/${maxRetries})`, { id: 'retry' });
          await new Promise(resolve => setTimeout(resolve, 1000 * retries));
          return attemptGeneration();
        }
        
        // Parse error message
        let errorMessage = language === 'ar' ? 'فشل توليد الملخص' : 'AI Generation failed';
        
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        // If 503 or service unavailable, use fallback
        if (error.response?.status === 503 || isNetworkError) {
          errorMessage = language === 'ar' ? 'خدمة الذكاء الاصطناعي غير متاحة حالياً. سيتم استخدام نظام بديل.' : 'AI service unavailable. Using fallback system.';
          const fallbackSummary = `${personalInfo.fullName || 'محترف'} هو ${personalInfo.jobTitle} يتمتع بخبرة واسعة في مجاله. يمتلك مهارات قوية في التواصل والعمل الجماعي والتفكير الاستراتيجي.`;
          update(fallbackSummary);
          toast.success(language === 'ar' ? 'تم إنشاء ملخص احترافي باستخدام النظام البديل' : 'Professional summary created using fallback system');
          return;
        }
        
        toast.dismiss('retry');
        toast.error(errorMessage);
        throw error;
      }
    };

    try {
      await attemptGeneration();
    } catch (error) {
      // Final fallback
      const fallbackSummary = `${personalInfo.fullName || 'محترف'} هو ${personalInfo.jobTitle} يتمتع بخبرة واسعة في مجاله. يمتلك مهارات قوية في التواصل والعمل الجماعي والتفكير الاستراتيجي.`;
      update(fallbackSummary);
      toast.success(language === 'ar' ? 'تم إنشاء ملخص احترافي' : 'Professional summary created');
    } finally {
      setLoading(false);
      toast.dismiss('retry');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          {language === 'ar' ? 'الملخص المهني' : 'Professional Summary'}
        </h2>
        <button
          onClick={generateSummary}
          disabled={loading}
          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 text-sm flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <span className="animate-spin">✨</span>
          ) : (
            <span>✨ {language === 'ar' ? 'توليد بالذكاء الاصطناعي' : 'Generate with AI'}</span>
          )}
        </button>
      </div>
      
      <textarea
        value={data}
        onChange={(e) => update(e.target.value)}
        rows={6}
        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
        placeholder={language === 'ar' ? 'اكتب ملخصاً مهنياً عن خبراتك وطموحاتك...' : 'Write a professional summary about your experience and goals...'}
      />
    </div>
  );
}
