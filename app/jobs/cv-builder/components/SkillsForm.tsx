'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

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
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
      const response = await fetch(`${apiUrl}/cv/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ type: 'skills', data: jobTitle, language }),
      });

      if (!response.ok) {
        let errorMessage = language === 'ar' ? 'فشل اقتراح المهارات' : 'AI Generation failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error?.message || errorMessage;
        } catch (e) {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();

      if (result.success && result.data?.result) {
        const suggestions = result.data.result.split(',').map((s: any) => s.trim()).filter((s: any) => s.length > 0);
        
        // Merge unique suggestions
        const uniqueSuggestions = suggestions.filter((s: any) => !data.includes(s));
        if (uniqueSuggestions.length > 0) {
          update([...data, ...uniqueSuggestions]);
          toast.success(language === 'ar' ? 'تم اقتراح مهارات جديدة' : 'New skills suggested');
        } else {
          toast(language === 'ar' ? 'لديك بالفعل هذه المهارات' : 'You already have these skills', { icon: 'ℹ️' });
        }
      } else {
        throw new Error(result.message || (language === 'ar' ? 'فشل اقتراح المهارات' : 'Failed to suggest skills'));
      }
    } catch (error: any) {
      console.error('AI Skills Suggestion Error:', error);
      toast.error(error.message || (language === 'ar' ? 'فشل اقتراح المهارات' : 'Failed to suggest skills'));
    } finally {
      setLoading(false);
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
          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 text-sm flex items-center gap-2"
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
