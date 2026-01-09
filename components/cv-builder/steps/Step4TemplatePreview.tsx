/**
 * Step 4: Template & Preview
 * 
 * Choose CV design and preview
 */

'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { SportsCVData, CVTemplate } from '@/types/cv-builder';
import { CV_TEMPLATES } from '@/components/cv-templates/templates-config';
import { CVTemplateRenderer } from '@/components/cv-templates';
import { Check, Eye, Layout, Star, Maximize2 } from 'lucide-react';

interface Step4TemplatePreviewProps {
  cvData: SportsCVData;
  selectedTemplate: string;
  onTemplateChange: (templateId: string) => void;
}

export default function Step4TemplatePreview({
  cvData,
  selectedTemplate,
  onTemplateChange,
}: Step4TemplatePreviewProps) {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const [previewMode, setPreviewMode] = useState<'grid' | 'fullscreen'>('grid');
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  // Get current template details
  const currentTemplate = CV_TEMPLATES.find(t => t.id === selectedTemplate) || CV_TEMPLATES[0];

  // Template categories
  const categories = [
    { id: 'all', labelEn: 'All Templates', labelAr: 'جميع القوالب' },
    { id: 'professional', labelEn: 'Professional', labelAr: 'احترافي' },
    { id: 'modern', labelEn: 'Modern', labelAr: 'حديث' },
    { id: 'sports', labelEn: 'Sports', labelAr: 'رياضي' },
    { id: 'creative', labelEn: 'Creative', labelAr: 'إبداعي' },
  ];

  const [activeCategory, setActiveCategory] = useState('all');

  // Filter templates by category
  const filteredTemplates = activeCategory === 'all'
    ? CV_TEMPLATES
    : CV_TEMPLATES.filter(t => t.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {isArabic ? '🎨 اختر قالب السيرة الذاتية' : '🎨 Choose Your CV Template'}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {isArabic 
              ? 'اختر التصميم الذي يناسب مجالك وأسلوبك'
              : 'Select a design that matches your field and style'}
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setPreviewMode('grid')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              previewMode === 'grid'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Layout className="w-4 h-4" />
            <span className="text-sm">{isArabic ? 'شبكة' : 'Grid'}</span>
          </button>
          <button
            onClick={() => setPreviewMode('fullscreen')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              previewMode === 'fullscreen'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Maximize2 className="w-4 h-4" />
            <span className="text-sm">{isArabic ? 'معاينة كاملة' : 'Full Preview'}</span>
          </button>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat.id
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isArabic ? cat.labelAr : cat.labelEn}
          </button>
        ))}
      </div>

      {/* Grid View */}
      {previewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => {
            const isSelected = selectedTemplate === template.id;
            const isHovered = hoveredTemplate === template.id;

            return (
              <div
                key={template.id}
                className={`relative group cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                  isSelected
                    ? 'border-primary ring-4 ring-primary/20 shadow-lg'
                    : 'border-gray-200 hover:border-primary/50 hover:shadow-md'
                }`}
                onClick={() => onTemplateChange(template.id)}
                onMouseEnter={() => setHoveredTemplate(template.id)}
                onMouseLeave={() => setHoveredTemplate(null)}
              >
                {/* Popular Badge */}
                {template.isPopular && (
                  <div className="absolute top-2 end-2 z-10 flex items-center gap-1 px-2 py-1 bg-amber-400 text-amber-900 rounded-full text-xs font-medium">
                    <Star className="w-3 h-3" />
                    {isArabic ? 'شائع' : 'Popular'}
                  </div>
                )}

                {/* Selected Check */}
                {isSelected && (
                  <div className="absolute top-2 start-2 z-10 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5" />
                  </div>
                )}

                {/* Preview Thumbnail */}
                <div className="aspect-[210/297] bg-gray-100 relative overflow-hidden">
                  <div className="absolute inset-0 p-2 transform scale-[0.35] origin-top-left">
                    <div className="w-[285%] h-[285%]">
                      <CVTemplateRenderer
                        templateId={template.id}
                        cvData={cvData}
                        compact={false}
                      />
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div
                    className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                      <Eye className="w-4 h-4" />
                      {isArabic ? 'معاينة' : 'Preview'}
                    </button>
                  </div>
                </div>

                {/* Template Info */}
                <div className="p-4 bg-white">
                  <h3 className="font-semibold text-gray-900">
                    {isArabic ? template.nameAr : template.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {isArabic ? template.descriptionAr : template.description}
                  </p>

                  {/* Color Preview */}
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs text-gray-400">{isArabic ? 'الألوان:' : 'Colors:'}</span>
                    <div className="flex gap-1">
                      <span
                        className="w-4 h-4 rounded-full border border-gray-200"
                        style={{ backgroundColor: template.colors.primary }}
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-gray-200"
                        style={{ backgroundColor: template.colors.secondary }}
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-gray-200"
                        style={{ backgroundColor: template.colors.accent }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Preview Mode */}
      {previewMode === 'fullscreen' && (
        <div className="space-y-6">
          {/* Template Selector Bar */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filteredTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => onTemplateChange(template.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg border-2 transition-all ${
                  selectedTemplate === template.id
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="font-medium">
                  {isArabic ? template.nameAr : template.name}
                </span>
              </button>
            ))}
          </div>

          {/* Full Preview */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {isArabic ? currentTemplate.nameAr : currentTemplate.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {isArabic ? currentTemplate.descriptionAr : currentTemplate.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {currentTemplate.isPopular && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">
                    <Star className="w-3 h-3" />
                    {isArabic ? 'شائع' : 'Popular'}
                  </span>
                )}
              </div>
            </div>
            <div className="p-4 md:p-8 bg-gray-100 overflow-auto max-h-[600px]">
              <div className="bg-white shadow-lg mx-auto" style={{ maxWidth: '800px' }}>
                <CVTemplateRenderer
                  templateId={selectedTemplate}
                  cvData={cvData}
                  compact={false}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Current Selection Info */}
      <div className="bg-gradient-to-r from-primary/5 to-purple-50 rounded-xl p-4 border border-primary/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Check className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">
              {isArabic ? 'القالب المحدد:' : 'Selected Template:'}
              <span className="text-primary ms-2">
                {isArabic ? currentTemplate.nameAr : currentTemplate.name}
              </span>
            </h4>
            <p className="text-sm text-gray-500">
              {isArabic ? currentTemplate.descriptionAr : currentTemplate.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
