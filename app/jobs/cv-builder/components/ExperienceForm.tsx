'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function ExperienceForm({ data, update, language }) {
  const [loadingIndex, setLoadingIndex] = useState(null);

  const addExperience = () => {
    update([
      ...data,
      { title: '', company: '', startDate: '', endDate: '', isCurrent: false, description: '' }
    ]);
  };

  const removeExperience = (index) => {
    const newData = [...data];
    newData.splice(index, 1);
    update(newData);
  };

  const handleChange = (index, field, value) => {
    const newData = [...data];
    newData[index][field] = value;
    update(newData);
  };

  const improveDescription = async (index) => {
    const desc = data[index].description;
    if (!desc || desc.length < 10) {
      toast.error(language === 'ar' ? 'يرجى كتابة وصف أولي ليتم تحسينه' : 'Please write a basic description first');
      return;
    }

    setLoadingIndex(index);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/cv/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'description', data: desc, language }),
      });

      if (!response.ok) throw new Error('AI Generation failed');

      const result = await response.json();
      handleChange(index, 'description', result.data.result);
      toast.success(language === 'ar' ? 'تم تحسين الوصف بنجاح' : 'Description improved successfully');
    } catch (error) {
      toast.error(language === 'ar' ? 'فشل تحسين الوصف' : 'Failed to improve description');
    } finally {
      setLoadingIndex(null);
    }
  };

  const labels = {
    title: language === 'ar' ? 'المسمى الوظيفي' : 'Job Title',
    company: language === 'ar' ? 'جهة العمل' : 'Company',
    startDate: language === 'ar' ? 'تاريخ البدء' : 'Start Date',
    endDate: language === 'ar' ? 'تاريخ الانتهاء' : 'End Date',
    isCurrent: language === 'ar' ? 'أعمل هنا حالياً' : 'I currently work here',
    description: language === 'ar' ? 'الوصف الوظيفي' : 'Description',
    add: language === 'ar' ? '+ إضافة خبرة' : '+ Add Experience',
    improve: language === 'ar' ? 'تحسين بالذكاء الاصطناعي' : 'Improve with AI',
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">
        {language === 'ar' ? 'الخبرة العملية' : 'Work Experience'}
      </h2>

      {data.map((exp, index) => (
        <div key={index} className="p-4 border rounded-md bg-gray-50 relative">
          <button
            onClick={() => removeExperience(index)}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
          >
            ✕
          </button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">{labels.title}</label>
              <input
                type="text"
                value={exp.title}
                onChange={(e) => handleChange(index, 'title', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{labels.company}</label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => handleChange(index, 'company', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{labels.startDate}</label>
              <input
                type="date"
                value={exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : ''}
                onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{labels.endDate}</label>
              <input
                type="date"
                value={exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : ''}
                onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                disabled={exp.isCurrent}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border disabled:bg-gray-200"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={exp.isCurrent}
                onChange={(e) => handleChange(index, 'isCurrent', e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <span className="text-sm text-gray-700">{labels.isCurrent}</span>
            </label>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">{labels.description}</label>
              <button
                onClick={() => improveDescription(index)}
                disabled={loadingIndex === index}
                className="text-xs text-purple-600 hover:text-purple-800 flex items-center gap-1"
              >
                {loadingIndex === index ? '...' : `✨ ${labels.improve}`}
              </button>
            </div>
            <textarea
              value={exp.description}
              onChange={(e) => handleChange(index, 'description', e.target.value)}
              rows={4}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
            />
          </div>
        </div>
      ))}

      <button
        onClick={addExperience}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors"
      >
        {labels.add}
      </button>
    </div>
  );
}
