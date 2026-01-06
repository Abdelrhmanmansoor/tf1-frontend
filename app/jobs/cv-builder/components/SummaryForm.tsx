'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function SummaryForm({ data, update, language, personalInfo }: any) {
  const [loading, setLoading] = useState(false);

  const generateSummary = async () => {
    if (!personalInfo.jobTitle) {
      toast.error(language === 'ar' ? 'يرجى إدخال المسمى الوظيفي أولاً' : 'Please enter job title first');
      return;
    }

    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
      const response = await fetch(`${apiUrl}/cv/ai/generate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for CORS
        body: JSON.stringify({ type: 'summary', data: personalInfo, language }),
      });

      // Check if response is ok before parsing JSON
      if (!response.ok) {
        let errorMessage = language === 'ar' ? 'فشل توليد الملخص' : 'AI Generation failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error?.message || errorMessage;
        } catch (e) {
          // If JSON parsing fails, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();

      if (result.success && result.data?.result) {
        update(result.data.result);
        toast.success(language === 'ar' ? 'تم توليد الملخص بنجاح' : 'Summary generated successfully');
      } else {
        throw new Error(result.message || (language === 'ar' ? 'فشل توليد الملخص' : 'AI Generation failed'));
      }
    } catch (error: any) {
      console.error('AI Generation Error:', error);
      const errorMessage = error.message || (language === 'ar' ? 'فشل توليد الملخص. يرجى التحقق من اتصال الإنترنت وإعدادات API' : 'Failed to generate summary. Please check your internet connection and API settings');
      toast.error(errorMessage);
    } finally {
      setLoading(false);
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
          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 text-sm flex items-center gap-2"
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
