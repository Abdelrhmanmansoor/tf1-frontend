/**
 * Step 2: Experience & Education
 * 
 * Work history and academic background
 */

'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { Experience, Education } from '@/types/cv';
import { useAIAssistant } from '@/services/ai-assistant/useAIAssistant';
import { Sparkles, Loader2, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

// Simple ID generator function
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

interface Step2ExperienceEducationProps {
  experience: Experience[];
  education: Education[];
  onExperienceChange: (experience: Experience[]) => void;
  onEducationChange: (education: Education[]) => void;
}

export default function Step2ExperienceEducation({
  experience,
  education,
  onExperienceChange,
  onEducationChange,
}: Step2ExperienceEducationProps) {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const { improveDescription, generateAchievements, isLoading } = useAIAssistant();
  const [expandedExp, setExpandedExp] = useState<string | null>(experience[0]?.id || null);
  const [expandedEdu, setExpandedEdu] = useState<string | null>(education[0]?.id || null);
  const [activeAIField, setActiveAIField] = useState<string | null>(null);

  // Generate achievements for a job
  const handleGenerateAchievements = async (expId: string, jobTitle: string) => {
    if (!jobTitle) {
      toast.error(isArabic ? 'أدخل المسمى الوظيفي أولاً' : 'Enter job title first');
      return;
    }
    
    setActiveAIField(`achievements-${expId}`);
    
    try {
      const achievements = await generateAchievements(jobTitle, 'sports', 3);
      
      if (achievements && achievements.length > 0) {
        const exp = experience.find(e => e.id === expId);
        if (exp) {
          const updated = experience.map(e => 
            e.id === expId 
              ? { ...e, description: (e.description || '') + '\n• ' + achievements.join('\n• ') }
              : e
          );
          onExperienceChange(updated);
          toast.success(isArabic ? 'تم إضافة الإنجازات' : 'Achievements added');
        }
      } else {
        toast.error(isArabic ? 'لم يتم العثور على اقتراحات' : 'No suggestions found');
      }
    } catch (error) {
      toast.error(isArabic ? 'حدث خطأ' : 'An error occurred');
    }
    
    setActiveAIField(null);
  };

  // Improve description with AI
  const handleImproveDescription = async (expId: string) => {
    const exp = experience.find(e => e.id === expId);
    if (!exp?.description) {
      toast.error(isArabic ? 'أدخل وصف أولاً' : 'Enter description first');
      return;
    }

    setActiveAIField(`description-${expId}`);
    const improved = await improveDescription(exp.description, exp.jobTitle, exp.company);
    
    if (improved) {
      const updated = experience.map(e => 
        e.id === expId ? { ...e, description: improved } : e
      );
      onExperienceChange(updated);
      toast.success(isArabic ? 'تم تحسين الوصف' : 'Description improved');
    }
    
    setActiveAIField(null);
  };

  // Add new experience
  const addExperience = () => {
    const newExp: Experience = {
      id: generateId(),
      jobTitle: '',
      company: '',
      startDate: '',
      endDate: '',
      currentlyWorking: false,
      description: '',
      location: '',
    };
    onExperienceChange([...experience, newExp]);
    setExpandedExp(newExp.id);
  };

  // Remove experience
  const removeExperience = (id: string) => {
    onExperienceChange(experience.filter(e => e.id !== id));
  };

  // Update experience field
  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    onExperienceChange(
      experience.map(e => e.id === id ? { ...e, [field]: value } : e)
    );
  };

  // Add new education
  const addEducation = () => {
    const newEdu: Education = {
      id: generateId(),
      school: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      grade: '',
    };
    onEducationChange([...education, newEdu]);
    setExpandedEdu(newEdu.id);
  };

  // Remove education
  const removeEducation = (id: string) => {
    onEducationChange(education.filter(e => e.id !== id));
  };

  // Update education field
  const updateEducation = (id: string, field: keyof Education, value: string) => {
    onEducationChange(
      education.map(e => e.id === id ? { ...e, [field]: value } : e)
    );
  };

  return (
    <div className="space-y-8">
      {/* Experience Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isArabic ? '💼 الخبرة العملية' : '💼 Work Experience'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {isArabic 
                ? 'أضف خبراتك العملية بترتيب زمني عكسي'
                : 'Add your work experience in reverse chronological order'}
            </p>
          </div>
          <button
            type="button"
            onClick={addExperience}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">{isArabic ? 'إضافة خبرة' : 'Add Experience'}</span>
          </button>
        </div>

        <div className="space-y-4">
          {experience.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500">
                {isArabic ? 'لم تضف أي خبرة بعد' : 'No experience added yet'}
              </p>
              <button
                type="button"
                onClick={addExperience}
                className="mt-2 text-primary hover:underline"
              >
                {isArabic ? '+ إضافة أول خبرة' : '+ Add your first experience'}
              </button>
            </div>
          ) : (
            experience.map((exp, index) => (
              <div
                key={exp.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
              >
                {/* Header */}
                <div
                  className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
                  onClick={() => setExpandedExp(expandedExp === exp.id ? null : exp.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-medium">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {exp.jobTitle || (isArabic ? 'المسمى الوظيفي' : 'Job Title')}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {exp.company || (isArabic ? 'اسم الشركة' : 'Company Name')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeExperience(exp.id);
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {expandedExp === exp.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedExp === exp.id && (
                  <div className="p-4 space-y-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {isArabic ? 'المسمى الوظيفي *' : 'Job Title *'}
                        </label>
                        <input
                          type="text"
                          value={exp.jobTitle}
                          onChange={(e) => updateExperience(exp.id, 'jobTitle', e.target.value)}
                          placeholder={isArabic ? 'مثال: مدرب كرة قدم' : 'e.g., Football Coach'}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {isArabic ? 'اسم الشركة/النادي *' : 'Company/Club Name *'}
                        </label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                          placeholder={isArabic ? 'مثال: نادي الهلال' : 'e.g., Al Hilal FC'}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {isArabic ? 'تاريخ البداية' : 'Start Date'}
                        </label>
                        <input
                          type="month"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                          dir="ltr"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {isArabic ? 'تاريخ الانتهاء' : 'End Date'}
                        </label>
                        <input
                          type="month"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                          disabled={exp.currentlyWorking}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
                          dir="ltr"
                        />
                      </div>
                      <div className="flex items-end pb-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={exp.currentlyWorking}
                            onChange={(e) => updateExperience(exp.id, 'currentlyWorking', e.target.checked)}
                            className="w-4 h-4 text-primary rounded focus:ring-primary"
                          />
                          <span className="text-sm text-gray-700">
                            {isArabic ? 'أعمل حالياً' : 'Currently working'}
                          </span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-sm font-medium text-gray-700">
                          {isArabic ? 'الوصف والإنجازات' : 'Description & Achievements'}
                        </label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleGenerateAchievements(exp.id, exp.jobTitle)}
                            disabled={isLoading.suggestSkills || !exp.jobTitle}
                            className="flex items-center gap-1 px-2 py-1 text-xs bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors disabled:opacity-50"
                          >
                            {activeAIField === `achievements-${exp.id}` ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Plus className="w-3 h-3" />
                            )}
                            {isArabic ? 'إنجازات' : 'Achievements'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleImproveDescription(exp.id)}
                            disabled={isLoading.improveText || !exp.description}
                            className="flex items-center gap-1 px-2 py-1 text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
                          >
                            {activeAIField === `description-${exp.id}` ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Sparkles className="w-3 h-3" />
                            )}
                            {isArabic ? 'تحسين' : 'Improve'}
                          </button>
                        </div>
                      </div>
                      <textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                        placeholder={isArabic 
                          ? 'اكتب وصفاً لمسؤولياتك وإنجازاتك في هذا المنصب...'
                          : 'Describe your responsibilities and achievements in this role...'}
                        rows={4}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Education Section */}
      <section className="border-t border-gray-200 pt-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isArabic ? '🎓 التعليم' : '🎓 Education'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {isArabic 
                ? 'أضف مؤهلاتك التعليمية'
                : 'Add your educational qualifications'}
            </p>
          </div>
          <button
            type="button"
            onClick={addEducation}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">{isArabic ? 'إضافة تعليم' : 'Add Education'}</span>
          </button>
        </div>

        <div className="space-y-4">
          {education.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500">
                {isArabic ? 'لم تضف أي تعليم بعد' : 'No education added yet'}
              </p>
              <button
                type="button"
                onClick={addEducation}
                className="mt-2 text-primary hover:underline"
              >
                {isArabic ? '+ إضافة مؤهل تعليمي' : '+ Add education'}
              </button>
            </div>
          ) : (
            education.map((edu, index) => (
              <div
                key={edu.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
              >
                {/* Header */}
                <div
                  className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
                  onClick={() => setExpandedEdu(expandedEdu === edu.id ? null : edu.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-medium">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {edu.degree || (isArabic ? 'الدرجة العلمية' : 'Degree')}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {edu.school || (isArabic ? 'اسم الجامعة/المعهد' : 'University/Institute')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeEducation(edu.id);
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {expandedEdu === edu.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedEdu === edu.id && (
                  <div className="p-4 space-y-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {isArabic ? 'الجامعة/المعهد *' : 'University/Institute *'}
                        </label>
                        <input
                          type="text"
                          value={edu.school}
                          onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                          placeholder={isArabic ? 'مثال: جامعة الملك سعود' : 'e.g., King Saud University'}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {isArabic ? 'الدرجة العلمية *' : 'Degree *'}
                        </label>
                        <select
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                        >
                          <option value="">{isArabic ? 'اختر الدرجة' : 'Select Degree'}</option>
                          <option value="High School">{isArabic ? 'الثانوية العامة' : 'High School'}</option>
                          <option value="Diploma">{isArabic ? 'دبلوم' : 'Diploma'}</option>
                          <option value="Bachelor">{isArabic ? 'بكالوريوس' : 'Bachelor'}</option>
                          <option value="Master">{isArabic ? 'ماجستير' : 'Master'}</option>
                          <option value="PhD">{isArabic ? 'دكتوراه' : 'PhD'}</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {isArabic ? 'التخصص' : 'Field of Study'}
                        </label>
                        <input
                          type="text"
                          value={edu.fieldOfStudy}
                          onChange={(e) => updateEducation(edu.id, 'fieldOfStudy', e.target.value)}
                          placeholder={isArabic ? 'مثال: إدارة رياضية' : 'e.g., Sports Management'}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {isArabic ? 'سنة البداية' : 'Start Year'}
                        </label>
                        <input
                          type="text"
                          value={edu.startDate}
                          onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                          placeholder="2018"
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                          dir="ltr"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {isArabic ? 'سنة التخرج' : 'End Year'}
                        </label>
                        <input
                          type="text"
                          value={edu.endDate}
                          onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                          placeholder="2022"
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {isArabic ? 'المعدل/التقدير' : 'Grade/GPA'}
                      </label>
                      <input
                        type="text"
                        value={edu.grade || ''}
                        onChange={(e) => updateEducation(edu.id, 'grade', e.target.value)}
                        placeholder={isArabic ? 'مثال: ممتاز / 4.0' : 'e.g., First Class / 4.0 GPA'}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
