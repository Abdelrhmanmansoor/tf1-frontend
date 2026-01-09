/**
 * TF1One CV Builder - Main Component
 * 
 * A fully integrated, step-based CV Builder for tf1one.com
 * Features AI-powered suggestions, multiple templates, and PDF export
 * 
 * Route: /jobs/cv-builder
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/contexts/language-context';
import { useAuth } from '@/contexts/auth-context';
import { SportsCVData, DEFAULT_CV_DATA, CV_BUILDER_STEPS } from '@/types/cv-builder';
import { CVService } from '@/services/cv.service';
import { 
  StepIndicator,
  Step1BasicInfo,
  Step2ExperienceEducation,
  Step3SkillsAchievements,
  Step4TemplatePreview,
  Step5GenerateExport,
} from './steps';
import { 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Loader2,
  MessageCircle,
  X,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAIAssistant } from '@/services/ai-assistant/useAIAssistant';

interface CVBuilderMainProps {
  initialCvId?: string;
}

export default function CVBuilderMain({ initialCvId }: CVBuilderMainProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const { chat, chatHistory, clearChat, isLoading: aiLoading } = useAIAssistant();
  const isArabic = language === 'ar';

  // Core state
  const [cvId, setCvId] = useState<string | undefined>(initialCvId || searchParams?.get('id') || undefined);
  const [cvData, setCvData] = useState<SportsCVData>(DEFAULT_CV_DATA);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('sports-champion');
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const cvService = useMemo(() => new CVService(), []);

  // Load existing CV if ID is provided
  useEffect(() => {
    if (cvId) {
      loadCV(cvId);
    }
  }, [cvId]);

  // Auto-save debounce
  useEffect(() => {
    if (hasUnsavedChanges && cvId) {
      const timer = setTimeout(() => {
        handleSave();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [hasUnsavedChanges, cvData]);

  // Load CV from backend
  const loadCV = async (id: string) => {
    setIsLoading(true);
    try {
      const data = await cvService.getCV(id);
      if (data) {
        setCvData(data as SportsCVData);
        // Determine completed steps based on data
        const completed: number[] = [];
        if (data.personalInfo?.fullName && data.personalInfo?.email) {
          completed.push(1);
        }
        if (data.experience?.length > 0 || data.education?.length > 0) {
          completed.push(2);
        }
        if (data.skills?.length > 0) {
          completed.push(3);
        }
        setCompletedSteps(completed);
      }
    } catch (error) {
      console.error('Failed to load CV:', error);
      toast.error(isArabic ? 'فشل تحميل السيرة الذاتية' : 'Failed to load CV');
    } finally {
      setIsLoading(false);
    }
  };

  // Save CV
  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (cvId) {
        await cvService.updateCV(cvId, cvData);
      } else {
        const result = await cvService.createCV(cvData, selectedTemplate);
        if (result?.id) {
          setCvId(result.id);
          window.history.replaceState({}, '', `/jobs/cv-builder?id=${result.id}`);
        }
      }
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      toast.success(isArabic ? 'تم الحفظ بنجاح' : 'Saved successfully');
    } catch (error) {
      console.error('Failed to save CV:', error);
      toast.error(isArabic ? 'فشل الحفظ' : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  // Update CV data
  const updateCvData = useCallback((updates: Partial<SportsCVData>) => {
    setCvData(prev => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  }, []);

  // Navigation
  const goToStep = (step: number) => {
    if (step >= 1 && step <= CV_BUILDER_STEPS.length) {
      // Mark current step as completed when moving forward
      if (step > currentStep && !completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const nextStep = () => {
    if (currentStep < CV_BUILDER_STEPS.length) {
      goToStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  // AI Chat
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const message = chatInput;
    setChatInput('');
    
    await chat(message, {
      cvData,
      currentSection: CV_BUILDER_STEPS[currentStep - 1]?.key,
    });
  };

  // Validate step
  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(cvData.personalInfo?.fullName && cvData.personalInfo?.email);
      case 2:
        return true; // Optional
      case 3:
        return true; // Optional
      case 4:
        return !!selectedTemplate;
      case 5:
        return true;
      default:
        return false;
    }
  };

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1BasicInfo
            data={cvData.personalInfo}
            onChange={(personalInfo) => updateCvData({ personalInfo })}
          />
        );
      case 2:
        return (
          <Step2ExperienceEducation
            experience={cvData.experience || []}
            education={cvData.education || []}
            onExperienceChange={(experience) => updateCvData({ experience })}
            onEducationChange={(education) => updateCvData({ education })}
          />
        );
      case 3:
        return (
          <Step3SkillsAchievements
            skills={cvData.skills || []}
            languages={cvData.languages || []}
            sportsAchievements={cvData.sportsAchievements || []}
            sportsLicenses={cvData.sportsLicenses || []}
            onSkillsChange={(skills) => updateCvData({ skills })}
            onLanguagesChange={(languages) => updateCvData({ languages })}
            onAchievementsChange={(sportsAchievements) => updateCvData({ sportsAchievements })}
            onLicensesChange={(sportsLicenses) => updateCvData({ sportsLicenses })}
            currentJobTitle={cvData.experience?.[0]?.jobTitle}
          />
        );
      case 4:
        return (
          <Step4TemplatePreview
            cvData={cvData}
            selectedTemplate={selectedTemplate}
            onTemplateChange={setSelectedTemplate}
          />
        );
      case 5:
        return (
          <Step5GenerateExport
            cvData={cvData}
            selectedTemplate={selectedTemplate}
            cvId={cvId}
            onSave={handleSave}
          />
        );
      default:
        return null;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">
            {isArabic ? 'جاري تحميل السيرة الذاتية...' : 'Loading CV...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Progress Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <StepIndicator
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={goToStep}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Save Status */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {hasUnsavedChanges && (
              <span className="text-sm text-amber-600 flex items-center gap-1">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                {isArabic ? 'تغييرات غير محفوظة' : 'Unsaved changes'}
              </span>
            )}
            {lastSaved && (
              <span className="text-sm text-gray-500">
                {isArabic ? 'آخر حفظ:' : 'Last saved:'} {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving || !hasUnsavedChanges}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isArabic ? 'حفظ' : 'Save'}
          </button>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
          {renderCurrentStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {isArabic ? (
              <>
                <ChevronRight className="w-5 h-5" />
                {isArabic ? 'السابق' : 'Previous'}
              </>
            ) : (
              <>
                <ChevronLeft className="w-5 h-5" />
                Previous
              </>
            )}
          </button>

          {currentStep < CV_BUILDER_STEPS.length ? (
            <button
              onClick={nextStep}
              disabled={!isStepValid(currentStep)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                isStepValid(currentStep)
                  ? 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/30'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isArabic ? (
                <>
                  {isArabic ? 'التالي' : 'Next'}
                  <ChevronLeft className="w-5 h-5" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg shadow-green-500/30"
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {isArabic ? 'حفظ وإنهاء' : 'Save & Finish'}
            </button>
          )}
        </div>
      </div>

      {/* AI Chat Assistant Floating Button */}
      <button
        onClick={() => setShowAIChat(!showAIChat)}
        className="fixed bottom-6 end-6 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg shadow-purple-500/30 flex items-center justify-center hover:scale-110 transition-transform z-50"
      >
        {showAIChat ? (
          <X className="w-6 h-6" />
        ) : (
          <Sparkles className="w-6 h-6" />
        )}
      </button>

      {/* AI Chat Panel */}
      {showAIChat && (
        <div className="fixed bottom-24 end-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">
                  {isArabic ? 'مساعد الذكاء الاصطناعي' : 'AI Assistant'}
                </h3>
                <p className="text-xs text-purple-100">
                  {isArabic ? 'مدعوم بـ GPT-4' : 'Powered by GPT-4'}
                </p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-3">
            {chatHistory.length === 0 ? (
              <div className="text-center py-8">
                <HelpCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">
                  {isArabic 
                    ? 'اسألني أي سؤال عن سيرتك الذاتية!'
                    : 'Ask me anything about your CV!'}
                </p>
                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => setChatInput(isArabic ? 'كيف أحسن ملخصي المهني؟' : 'How can I improve my summary?')}
                    className="block w-full text-start text-sm text-purple-600 bg-purple-50 rounded-lg px-3 py-2 hover:bg-purple-100"
                  >
                    {isArabic ? '💡 كيف أحسن ملخصي المهني؟' : '💡 How can I improve my summary?'}
                  </button>
                  <button
                    onClick={() => setChatInput(isArabic ? 'اقترح مهارات لمنصبي' : 'Suggest skills for my position')}
                    className="block w-full text-start text-sm text-purple-600 bg-purple-50 rounded-lg px-3 py-2 hover:bg-purple-100"
                  >
                    {isArabic ? '⚡ اقترح مهارات لمنصبي' : '⚡ Suggest skills for my position'}
                  </button>
                </div>
              </div>
            ) : (
              chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                      msg.role === 'user'
                        ? 'bg-primary text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            {aiLoading.chat && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-bl-none px-4 py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleChatSubmit} className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={isArabic ? 'اكتب رسالتك...' : 'Type your message...'}
                className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                disabled={aiLoading.chat}
              />
              <button
                type="submit"
                disabled={aiLoading.chat || !chatInput.trim()}
                className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center disabled:opacity-50"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
