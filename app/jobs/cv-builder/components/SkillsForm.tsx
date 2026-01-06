'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '@/services/api';

export default function SkillsForm({ data, update, language, jobTitle }: any) {
  const [loading, setLoading] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const addSkill = (skill: any) => {
    if (skill && !data.includes(skill)) {
      update([...data, skill]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: any) => {
    update(data.filter((skill: any) => skill !== skillToRemove));
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(newSkill);
    }
  };

  const suggestSkills = async () => {
    if (!jobTitle) {
      toast.error(language === 'ar' ? 'يرجى إدخال المسمى الوظيفي في الخطوة الأولى' : 'Please enter job title in step 1');
      return;
    }

    setLoading(true);
    let retries = 0;
    const maxRetries = 3;

    const attemptSuggestion = async (): Promise<void> => {
      try {
        const response = await api.post('/cv/ai/generate', {
          type: 'skills',
          data: jobTitle,
          language
        });

        if (response.data.success && response.data.data?.result) {
          const suggestions = response.data.data.result.split(',').map((s: any) => s.trim()).filter((s: any) => s.length > 0);
          
          const uniqueSuggestions = suggestions.filter((s: any) => !data.includes(s));
          if (uniqueSuggestions.length > 0) {
            update([...data, ...uniqueSuggestions]);
            toast.success(language === 'ar' ? 'تم اقتراح مهارات جديدة' : 'New skills suggested');
          } else {
            toast(language === 'ar' ? 'لديك بالفعل هذه المهارات' : 'You already have these skills', { icon: 'ℹ️' });
          }
        } else if (response.data.data?.result) {
          const suggestions = response.data.data.result.split(',').map((s: any) => s.trim()).filter((s: any) => s.length > 0);
          const uniqueSuggestions = suggestions.filter((s: any) => !data.includes(s));
          if (uniqueSuggestions.length > 0) {
            update([...data, ...uniqueSuggestions]);
            toast.success(language === 'ar' ? 'تم اقتراح مهارات جديدة' : 'New skills suggested');
          }
        } else {
          throw new Error(response.data.message || (language === 'ar' ? 'فشل اقتراح المهارات' : 'Failed to suggest skills'));
        }
      } catch (error: any) {
        const isNetworkError = error.message?.includes('Failed to fetch') || 
                              error.message?.includes('Network Error') || 
                              error.message?.includes('NetworkError') ||
                              !error.response;
        
        if (isNetworkError && retries < maxRetries) {
          retries++;
          toast.loading(language === 'ar' ? `إعادة المحاولة... (${retries}/${maxRetries})` : `Retrying... (${retries}/${maxRetries})`, { id: 'retry-skills' });
          await new Promise(resolve => setTimeout(resolve, 1000 * retries));
          return attemptSuggestion();
        }
        
        let errorMessage = language === 'ar' ? 'فشل اقتراح المهارات' : 'Failed to suggest skills';
        
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        // Use fallback skills
        if (error.response?.status === 503 || isNetworkError) {
          const jobTitleLower = jobTitle.toLowerCase();
          const fallbackSkills = jobTitleLower.includes('developer') 
            ? ['JavaScript', 'React', 'Node.js', 'Git', 'Problem Solving', 'Team Collaboration']
            : jobTitleLower.includes('manager')
            ? ['Leadership', 'Strategic Planning', 'Team Management', 'Communication', 'Decision Making']
            : jobTitleLower.includes('coach')
            ? ['Training Programs', 'Performance Analysis', 'Team Building', 'Communication', 'Motivation']
            : ['Communication', 'Leadership', 'Teamwork', 'Problem Solving', 'Time Management', 'Adaptability'];
          
          const uniqueFallback = fallbackSkills.filter((s: any) => !data.includes(s));
          if (uniqueFallback.length > 0) {
            update([...data, ...uniqueFallback]);
            toast.success(language === 'ar' ? 'تم اقتراح مهارات باستخدام النظام البديل' : 'Skills suggested using fallback system');
          }
          return;
        }
        
        toast.dismiss('retry-skills');
        toast.error(errorMessage);
      } finally {
        setLoading(false);
        toast.dismiss('retry-skills');
      }
    };

    try {
      await attemptSuggestion();
    } catch (error) {
      // Final fallback
      const fallbackSkills = ['Communication', 'Leadership', 'Teamwork', 'Problem Solving', 'Time Management'];
      const uniqueFallback = fallbackSkills.filter((s: any) => !data.includes(s));
      if (uniqueFallback.length > 0) {
        update([...data, ...uniqueFallback]);
        toast.success(language === 'ar' ? 'تم إضافة مهارات احترافية' : 'Professional skills added');
      }
    }
  };

  const labels = {
    title: language === 'ar' ? 'المهارات' : 'Skills',
    placeholder: language === 'ar' ? 'أضف مهارة ثم اضغط Enter' : 'Add a skill and press Enter',
    suggest: language === 'ar' ? 'اقتراح مهارات بالذكاء الاصطناعي' : 'Suggest Skills with AI',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">{labels.title}</h2>
        <button
          onClick={suggestSkills}
          disabled={loading}
          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 text-sm flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <span className="animate-spin">✨</span>
          ) : (
            <span>✨ {labels.suggest}</span>
          )}
        </button>
      </div>

      <div>
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
          placeholder={labels.placeholder}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {data.map((skill: any, index: any) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
          >
            {skill}
            <button
              onClick={() => removeSkill(skill)}
              className="ml-2 text-indigo-600 hover:text-indigo-900 focus:outline-none"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
