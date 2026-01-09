/**
 * CV Builder Step Indicator Component
 * 
 * Shows progress through the 5-step CV building process
 */

'use client';

import React from 'react';
import { useLanguage } from '@/contexts/language-context';
import { CV_BUILDER_STEPS, CVBuilderStep } from '@/types/cv-builder';

interface StepIndicatorProps {
  currentStep: number;
  completedSteps: number[];
  onStepClick?: (step: number) => void;
}

export default function StepIndicator({ 
  currentStep, 
  completedSteps,
  onStepClick 
}: StepIndicatorProps) {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  const getStepStatus = (stepId: number): 'completed' | 'current' | 'upcoming' => {
    if (completedSteps.includes(stepId)) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'upcoming';
  };

  return (
    <div className="w-full py-4">
      {/* Desktop View */}
      <div className="hidden md:flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-6 inset-x-0 h-0.5 bg-gray-200" />
        <div 
          className="absolute top-6 h-0.5 bg-primary transition-all duration-500"
          style={{ 
            width: `${((currentStep - 1) / (CV_BUILDER_STEPS.length - 1)) * 100}%`,
            [isArabic ? 'right' : 'left']: 0,
          }}
        />

        {CV_BUILDER_STEPS.map((step) => {
          const status = getStepStatus(step.id);
          const isClickable = completedSteps.includes(step.id) || step.id <= currentStep;

          return (
            <div
              key={step.id}
              className={`flex flex-col items-center relative z-10 ${
                isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
              }`}
              onClick={() => isClickable && onStepClick?.(step.id)}
            >
              {/* Step Circle */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-300 ${
                  status === 'completed'
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                    : status === 'current'
                    ? 'bg-primary text-white shadow-lg shadow-primary/30 ring-4 ring-primary/20'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {status === 'completed' ? '✓' : step.icon}
              </div>

              {/* Step Label */}
              <div className="mt-3 text-center max-w-[120px]">
                <p
                  className={`text-sm font-medium ${
                    status === 'current'
                      ? 'text-primary'
                      : status === 'completed'
                      ? 'text-green-600'
                      : 'text-gray-400'
                  }`}
                >
                  {isArabic ? step.titleAr : step.titleEn}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        {/* Current Step Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-lg">
              {CV_BUILDER_STEPS[currentStep - 1]?.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">
                {isArabic ? `الخطوة ${currentStep} من ${CV_BUILDER_STEPS.length}` : `Step ${currentStep} of ${CV_BUILDER_STEPS.length}`}
              </p>
              <p className="font-semibold text-gray-900">
                {isArabic 
                  ? CV_BUILDER_STEPS[currentStep - 1]?.titleAr 
                  : CV_BUILDER_STEPS[currentStep - 1]?.titleEn}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-500 rounded-full"
            style={{ width: `${(currentStep / CV_BUILDER_STEPS.length) * 100}%` }}
          />
        </div>

        {/* Step Dots */}
        <div className="flex justify-between mt-2 px-1">
          {CV_BUILDER_STEPS.map((step) => {
            const status = getStepStatus(step.id);
            return (
              <button
                key={step.id}
                onClick={() => (status !== 'upcoming' || step.id === currentStep) && onStepClick?.(step.id)}
                disabled={status === 'upcoming' && step.id !== currentStep}
                className={`w-6 h-6 rounded-full text-xs font-medium transition-all ${
                  status === 'completed'
                    ? 'bg-green-500 text-white'
                    : status === 'current'
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {step.id}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
