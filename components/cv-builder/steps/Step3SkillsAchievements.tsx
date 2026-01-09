/**
 * Step 3: Skills & Achievements
 * 
 * Professional skills and sports achievements
 */

'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { Skill, Language } from '@/types/cv';
import { SportsAchievement, SportsLicense } from '@/types/cv-builder';
import { useAIAssistant } from '@/services/ai-assistant/useAIAssistant';
import { Sparkles, Loader2, Plus, X, Trophy, Award, Languages } from 'lucide-react';
import toast from 'react-hot-toast';

// Simple ID generator function
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

interface Step3SkillsAchievementsProps {
  skills: Skill[];
  languages: Language[];
  sportsAchievements: SportsAchievement[];
  sportsLicenses: SportsLicense[];
  onSkillsChange: (skills: Skill[]) => void;
  onLanguagesChange: (languages: Language[]) => void;
  onAchievementsChange: (achievements: SportsAchievement[]) => void;
  onLicensesChange: (licenses: SportsLicense[]) => void;
  currentJobTitle?: string;
}

export default function Step3SkillsAchievements({
  skills,
  languages,
  sportsAchievements,
  sportsLicenses,
  onSkillsChange,
  onLanguagesChange,
  onAchievementsChange,
  onLicensesChange,
  currentJobTitle = '',
}: Step3SkillsAchievementsProps) {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const { suggestSkills, suggestSportsSkills, isLoading } = useAIAssistant();
  
  const [newSkill, setNewSkill] = useState('');
  const [skillLevel, setSkillLevel] = useState<Skill['level']>('intermediate');
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);

  // Skill level options
  const skillLevels: { value: Skill['level']; labelEn: string; labelAr: string }[] = [
    { value: 'beginner', labelEn: 'Beginner', labelAr: 'مبتدئ' },
    { value: 'intermediate', labelEn: 'Intermediate', labelAr: 'متوسط' },
    { value: 'advanced', labelEn: 'Advanced', labelAr: 'متقدم' },
    { value: 'expert', labelEn: 'Expert', labelAr: 'خبير' },
  ];

  // Language level options
  const languageLevels: { value: Language['level']; labelEn: string; labelAr: string }[] = [
    { value: 'elementary', labelEn: 'Elementary', labelAr: 'مبتدئ' },
    { value: 'limited', labelEn: 'Limited Working', labelAr: 'محدود' },
    { value: 'professional', labelEn: 'Professional', labelAr: 'مهني' },
    { value: 'fluent', labelEn: 'Fluent', labelAr: 'طليق' },
    { value: 'native', labelEn: 'Native', labelAr: 'لغة أم' },
  ];

  // Achievement level options
  const achievementLevels: { value: SportsAchievement['level']; labelEn: string; labelAr: string }[] = [
    { value: 'amateur', labelEn: 'Amateur', labelAr: 'هاوي' },
    { value: 'semi-pro', labelEn: 'Semi-Professional', labelAr: 'شبه محترف' },
    { value: 'professional', labelEn: 'Professional', labelAr: 'محترف' },
    { value: 'national', labelEn: 'National', labelAr: 'وطني' },
    { value: 'international', labelEn: 'International', labelAr: 'دولي' },
  ];

  // Add skill
  const addSkill = () => {
    if (!newSkill.trim()) return;
    
    const skill: Skill = {
      id: generateId(),
      name: newSkill.trim(),
      level: skillLevel,
    };
    onSkillsChange([...skills, skill]);
    setNewSkill('');
  };

  // Remove skill
  const removeSkill = (id: string) => {
    onSkillsChange(skills.filter(s => s.id !== id));
  };

  // Get AI skill suggestions
  const handleGetSuggestions = async () => {
    if (!currentJobTitle) {
      toast.error(isArabic ? 'أدخل المسمى الوظيفي أولاً' : 'Enter job title first');
      return;
    }

    const currentSkillNames = skills.map(s => s.name);
    const suggestions = await suggestSkills(currentJobTitle, 'sports', currentSkillNames);
    
    if (suggestions.length > 0) {
      setSuggestedSkills(suggestions.filter(s => !currentSkillNames.includes(s)));
      toast.success(isArabic ? 'تم الحصول على اقتراحات' : 'Suggestions loaded');
    }
  };

  // Add suggested skill
  const addSuggestedSkill = (skillName: string) => {
    const skill: Skill = {
      id: generateId(),
      name: skillName,
      level: 'intermediate',
    };
    onSkillsChange([...skills, skill]);
    setSuggestedSkills(suggestedSkills.filter(s => s !== skillName));
  };

  // Add new language
  const addLanguage = () => {
    const newLang: Language = {
      id: generateId(),
      name: '',
      level: 'professional',
    };
    onLanguagesChange([...languages, newLang]);
  };

  // Update language
  const updateLanguage = (id: string, field: keyof Language, value: string) => {
    onLanguagesChange(
      languages.map(l => l.id === id ? { ...l, [field]: value } : l)
    );
  };

  // Remove language
  const removeLanguage = (id: string) => {
    onLanguagesChange(languages.filter(l => l.id !== id));
  };

  // Add new achievement
  const addAchievement = () => {
    const newAchievement: SportsAchievement = {
      id: generateId(),
      title: '',
      sport: '',
      level: 'professional',
      year: new Date().getFullYear().toString(),
      description: '',
    };
    onAchievementsChange([...sportsAchievements, newAchievement]);
  };

  // Update achievement
  const updateAchievement = (id: string, field: keyof SportsAchievement, value: string) => {
    onAchievementsChange(
      sportsAchievements.map(a => a.id === id ? { ...a, [field]: value } : a)
    );
  };

  // Remove achievement
  const removeAchievement = (id: string) => {
    onAchievementsChange(sportsAchievements.filter(a => a.id !== id));
  };

  // Add new license
  const addLicense = () => {
    const newLicense: SportsLicense = {
      id: generateId(),
      name: '',
      issuer: '',
      sport: '',
      level: '',
      issueDate: '',
    };
    onLicensesChange([...sportsLicenses, newLicense]);
  };

  // Update license
  const updateLicense = (id: string, field: keyof SportsLicense, value: string) => {
    onLicensesChange(
      sportsLicenses.map(l => l.id === id ? { ...l, [field]: value } : l)
    );
  };

  // Remove license
  const removeLicense = (id: string) => {
    onLicensesChange(sportsLicenses.filter(l => l.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Skills Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isArabic ? '⚡ المهارات' : '⚡ Skills'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {isArabic 
                ? 'أضف مهاراتك المهنية والتقنية'
                : 'Add your professional and technical skills'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleGetSuggestions}
            disabled={isLoading.suggestSkills}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
          >
            {isLoading.suggestSkills ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {isArabic ? 'اقتراحات AI' : 'AI Suggestions'}
          </button>
        </div>

        {/* Add Skill Input */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            placeholder={isArabic ? 'أدخل مهارة جديدة...' : 'Enter a new skill...'}
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
          />
          <select
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value as Skill['level'])}
            className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
          >
            {skillLevels.map(level => (
              <option key={level.value} value={level.value}>
                {isArabic ? level.labelAr : level.labelEn}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={addSkill}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* AI Suggested Skills */}
        {suggestedSkills.length > 0 && (
          <div className="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-sm font-medium text-purple-700 mb-2">
              {isArabic ? '💡 مهارات مقترحة من AI:' : '💡 AI Suggested Skills:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedSkills.map((skill, index) => (
                <button
                  key={index}
                  onClick={() => addSuggestedSkill(skill)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white text-purple-700 border border-purple-300 rounded-full text-sm hover:bg-purple-100 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  {skill}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Skills List */}
        <div className="flex flex-wrap gap-2">
          {skills.map(skill => (
            <span
              key={skill.id}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-purple-100 text-gray-800 rounded-full"
            >
              <span className="font-medium">{skill.name}</span>
              <span className="text-xs text-gray-500 capitalize">
                ({isArabic ? skillLevels.find(l => l.value === skill.level)?.labelAr : skill.level})
              </span>
              <button
                type="button"
                onClick={() => removeSkill(skill.id)}
                className="p-0.5 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          ))}
          {skills.length === 0 && (
            <p className="text-gray-400 italic">
              {isArabic ? 'لم تضف مهارات بعد' : 'No skills added yet'}
            </p>
          )}
        </div>
      </section>

      {/* Languages Section */}
      <section className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900">
              {isArabic ? 'اللغات' : 'Languages'}
            </h2>
          </div>
          <button
            type="button"
            onClick={addLanguage}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {isArabic ? 'إضافة لغة' : 'Add Language'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {languages.map(lang => (
            <div
              key={lang.id}
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex-1 grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={lang.name}
                  onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                  placeholder={isArabic ? 'اللغة' : 'Language'}
                  className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary"
                />
                <select
                  value={lang.level}
                  onChange={(e) => updateLanguage(lang.id, 'level', e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary"
                >
                  {languageLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {isArabic ? level.labelAr : level.labelEn}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() => removeLanguage(lang.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Sports Achievements Section */}
      <section className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-gray-900">
              {isArabic ? 'الإنجازات الرياضية' : 'Sports Achievements'}
            </h2>
          </div>
          <button
            type="button"
            onClick={addAchievement}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {isArabic ? 'إضافة إنجاز' : 'Add Achievement'}
          </button>
        </div>

        <div className="space-y-4">
          {sportsAchievements.map((achievement, index) => (
            <div
              key={achievement.id}
              className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="flex items-center gap-2 text-amber-700 font-medium">
                  <span className="w-6 h-6 bg-amber-400 text-white rounded-full flex items-center justify-center text-sm">
                    {index + 1}
                  </span>
                  {isArabic ? 'إنجاز رياضي' : 'Sports Achievement'}
                </span>
                <button
                  type="button"
                  onClick={() => removeAchievement(achievement.id)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={achievement.title}
                  onChange={(e) => updateAchievement(achievement.id, 'title', e.target.value)}
                  placeholder={isArabic ? 'عنوان الإنجاز *' : 'Achievement Title *'}
                  className="px-3 py-2 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-400 bg-white"
                />
                <input
                  type="text"
                  value={achievement.sport}
                  onChange={(e) => updateAchievement(achievement.id, 'sport', e.target.value)}
                  placeholder={isArabic ? 'الرياضة *' : 'Sport *'}
                  className="px-3 py-2 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-400 bg-white"
                />
                <select
                  value={achievement.level}
                  onChange={(e) => updateAchievement(achievement.id, 'level', e.target.value)}
                  className="px-3 py-2 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-400 bg-white"
                >
                  {achievementLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {isArabic ? level.labelAr : level.labelEn}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={achievement.year}
                  onChange={(e) => updateAchievement(achievement.id, 'year', e.target.value)}
                  placeholder={isArabic ? 'السنة' : 'Year'}
                  className="px-3 py-2 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-400 bg-white"
                  dir="ltr"
                />
                <div className="md:col-span-2">
                  <textarea
                    value={achievement.description || ''}
                    onChange={(e) => updateAchievement(achievement.id, 'description', e.target.value)}
                    placeholder={isArabic ? 'وصف الإنجاز (اختياري)' : 'Description (optional)'}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-400 bg-white resize-none"
                  />
                </div>
              </div>
            </div>
          ))}

          {sportsAchievements.length === 0 && (
            <div className="text-center py-8 bg-amber-50 rounded-lg border-2 border-dashed border-amber-200">
              <Trophy className="w-12 h-12 text-amber-300 mx-auto mb-2" />
              <p className="text-gray-500">
                {isArabic ? 'لم تضف أي إنجاز رياضي بعد' : 'No sports achievements added yet'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Sports Licenses Section */}
      <section className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-500" />
            <h2 className="text-xl font-bold text-gray-900">
              {isArabic ? 'الرخص والشهادات الرياضية' : 'Sports Licenses & Certifications'}
            </h2>
          </div>
          <button
            type="button"
            onClick={addLicense}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {isArabic ? 'إضافة رخصة' : 'Add License'}
          </button>
        </div>

        <div className="space-y-4">
          {sportsLicenses.map((license, index) => (
            <div
              key={license.id}
              className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="flex items-center gap-2 text-emerald-700 font-medium">
                  <span className="w-6 h-6 bg-emerald-400 text-white rounded-full flex items-center justify-center text-sm">
                    {index + 1}
                  </span>
                  {isArabic ? 'رخصة/شهادة' : 'License/Certificate'}
                </span>
                <button
                  type="button"
                  onClick={() => removeLicense(license.id)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={license.name}
                  onChange={(e) => updateLicense(license.id, 'name', e.target.value)}
                  placeholder={isArabic ? 'اسم الرخصة *' : 'License Name *'}
                  className="px-3 py-2 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-400 bg-white"
                />
                <input
                  type="text"
                  value={license.issuer}
                  onChange={(e) => updateLicense(license.id, 'issuer', e.target.value)}
                  placeholder={isArabic ? 'الجهة المانحة *' : 'Issuing Organization *'}
                  className="px-3 py-2 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-400 bg-white"
                />
                <input
                  type="text"
                  value={license.level}
                  onChange={(e) => updateLicense(license.id, 'level', e.target.value)}
                  placeholder={isArabic ? 'المستوى (A, B, Pro...)' : 'Level (A, B, Pro...)'}
                  className="px-3 py-2 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-400 bg-white"
                />
                <input
                  type="text"
                  value={license.sport}
                  onChange={(e) => updateLicense(license.id, 'sport', e.target.value)}
                  placeholder={isArabic ? 'الرياضة' : 'Sport'}
                  className="px-3 py-2 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-400 bg-white"
                />
                <input
                  type="month"
                  value={license.issueDate}
                  onChange={(e) => updateLicense(license.id, 'issueDate', e.target.value)}
                  className="px-3 py-2 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-400 bg-white"
                  dir="ltr"
                />
                <input
                  type="month"
                  value={license.expiryDate || ''}
                  onChange={(e) => updateLicense(license.id, 'expiryDate', e.target.value)}
                  placeholder={isArabic ? 'تاريخ الانتهاء' : 'Expiry Date'}
                  className="px-3 py-2 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-400 bg-white"
                  dir="ltr"
                />
              </div>
            </div>
          ))}

          {sportsLicenses.length === 0 && (
            <div className="text-center py-8 bg-emerald-50 rounded-lg border-2 border-dashed border-emerald-200">
              <Award className="w-12 h-12 text-emerald-300 mx-auto mb-2" />
              <p className="text-gray-500">
                {isArabic ? 'لم تضف أي رخصة أو شهادة بعد' : 'No licenses or certifications added yet'}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
