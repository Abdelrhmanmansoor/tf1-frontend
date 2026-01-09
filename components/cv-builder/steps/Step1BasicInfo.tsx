/**
 * Step 1: Basic Information
 * 
 * Personal details and contact information form
 */

'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { SportsPersonalInfo } from '@/types/cv-builder';
import { useAIAssistant } from '@/services/ai-assistant/useAIAssistant';
import { Sparkles, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Step1BasicInfoProps {
  data: SportsPersonalInfo;
  onChange: (data: SportsPersonalInfo) => void;
}

export default function Step1BasicInfo({ data, onChange }: Step1BasicInfoProps) {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const { improveText, isLoading } = useAIAssistant();
  const [activeAIField, setActiveAIField] = useState<string | null>(null);

  const updateField = (field: keyof SportsPersonalInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleAIImprove = async (field: 'summary') => {
    if (!data[field]) {
      toast.error(isArabic ? 'أدخل نص أولاً' : 'Enter text first');
      return;
    }

    setActiveAIField(field);
    const improved = await improveText(data[field], {
      style: 'professional',
      context: 'summary',
    });

    if (improved) {
      updateField(field, improved);
      toast.success(isArabic ? 'تم تحسين النص' : 'Text improved');
    }
    setActiveAIField(null);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-bold text-gray-900">
          {isArabic ? '👤 المعلومات الأساسية' : '👤 Basic Information'}
        </h2>
        <p className="text-gray-500 mt-1">
          {isArabic 
            ? 'أدخل بياناتك الشخصية ومعلومات الاتصال'
            : 'Enter your personal details and contact information'}
        </p>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isArabic ? 'الاسم الكامل *' : 'Full Name *'}
          </label>
          <input
            type="text"
            value={data.fullName || ''}
            onChange={(e) => updateField('fullName', e.target.value)}
            placeholder={isArabic ? 'محمد أحمد العلي' : 'John Doe'}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isArabic ? 'البريد الإلكتروني *' : 'Email Address *'}
          </label>
          <input
            type="email"
            value={data.email || ''}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="email@example.com"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            dir="ltr"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isArabic ? 'رقم الهاتف *' : 'Phone Number *'}
          </label>
          <input
            type="tel"
            value={data.phone || ''}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="+966 50 000 0000"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            dir="ltr"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isArabic ? 'الموقع / المدينة' : 'Location / City'}
          </label>
          <input
            type="text"
            value={data.location || ''}
            onChange={(e) => updateField('location', e.target.value)}
            placeholder={isArabic ? 'الرياض، السعودية' : 'Riyadh, Saudi Arabia'}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
          />
        </div>

        {/* Nationality */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isArabic ? 'الجنسية' : 'Nationality'}
          </label>
          <input
            type="text"
            value={data.nationality || ''}
            onChange={(e) => updateField('nationality', e.target.value)}
            placeholder={isArabic ? 'سعودي' : 'Saudi Arabian'}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isArabic ? 'تاريخ الميلاد' : 'Date of Birth'}
          </label>
          <input
            type="date"
            value={data.dateOfBirth || ''}
            onChange={(e) => updateField('dateOfBirth', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            dir="ltr"
          />
        </div>

        {/* Current Club/Organization */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isArabic ? 'النادي/المؤسسة الحالية' : 'Current Club/Organization'}
          </label>
          <input
            type="text"
            value={data.currentClub || ''}
            onChange={(e) => updateField('currentClub', e.target.value)}
            placeholder={isArabic ? 'نادي الهلال' : 'Al Hilal FC'}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Social Links Section */}
      <div className="border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {isArabic ? '🔗 الروابط والملفات الشخصية' : '🔗 Links & Profiles'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LinkedIn */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn
            </label>
            <input
              type="url"
              value={data.linkedin || ''}
              onChange={(e) => updateField('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/username"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              dir="ltr"
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? 'الموقع الشخصي' : 'Personal Website'}
            </label>
            <input
              type="url"
              value={data.website || ''}
              onChange={(e) => updateField('website', e.target.value)}
              placeholder="https://yoursite.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              dir="ltr"
            />
          </div>

          {/* Video Highlights */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? '🎬 رابط فيديو المواهب/أبرز اللحظات' : '🎬 Video Highlights URL'}
            </label>
            <input
              type="url"
              value={data.videoHighlights || ''}
              onChange={(e) => updateField('videoHighlights', e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              dir="ltr"
            />
            <p className="text-xs text-gray-500 mt-1">
              {isArabic 
                ? 'رابط YouTube أو Vimeo لأبرز لقطاتك الرياضية'
                : 'YouTube or Vimeo link to your sports highlights'}
            </p>
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      <div className="border-t border-gray-200 pt-6 mt-6">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            {isArabic ? '📝 الملخص المهني' : '📝 Professional Summary'}
          </label>
          <button
            type="button"
            onClick={() => handleAIImprove('summary')}
            disabled={isLoading.improveText || !data.summary}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading.improveText && activeAIField === 'summary' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {isArabic ? 'تحسين بالذكاء الاصطناعي' : 'AI Improve'}
          </button>
        </div>
        <textarea
          value={data.summary || ''}
          onChange={(e) => updateField('summary', e.target.value)}
          placeholder={isArabic 
            ? 'اكتب ملخصاً موجزاً عن خبراتك ومهاراتك المهنية...'
            : 'Write a brief summary of your professional experience and skills...'}
          rows={5}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none"
        />
        <p className="text-xs text-gray-500 mt-1">
          {isArabic 
            ? '2-4 جمل تصف خبرتك وأهدافك المهنية'
            : '2-4 sentences describing your experience and career goals'}
        </p>
      </div>
    </div>
  );
}
