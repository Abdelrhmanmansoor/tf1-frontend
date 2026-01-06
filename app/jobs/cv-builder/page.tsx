'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import PersonalInfoForm from './components/PersonalInfoForm';
import SummaryForm from './components/SummaryForm';
import ExperienceForm from './components/ExperienceForm';
import EducationForm from './components/EducationForm';
import SkillsForm from './components/SkillsForm';
import CVPreview from './components/CVPreview';
import api from '@/services/api';

export default function CVBuilderPage() {
  const [step, setStep] = useState(1);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [loading, setLoading] = useState(false);
  const [cvData, setCVData] = useState({
    personalInfo: { fullName: '', jobTitle: '', email: '', phone: '', address: '', city: '', linkedin: '' },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    languages: [],
    courses: [],
    meta: { template: 'standard' }
  });

  const steps = [
    { id: 1, title: language === 'ar' ? 'البيانات الشخصية' : 'Personal Info' },
    { id: 2, title: language === 'ar' ? 'الملخص المهني' : 'Summary' },
    { id: 3, title: language === 'ar' ? 'الخبرة العملية' : 'Experience' },
    { id: 4, title: language === 'ar' ? 'التعليم' : 'Education' },
    { id: 5, title: language === 'ar' ? 'المهارات' : 'Skills' },
    { id: 6, title: language === 'ar' ? 'المعاينة' : 'Preview' },
  ];

  const handleNext = () => setStep((prev) => Math.min(prev + 1, steps.length));
  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

  const updateData = (section: string, data: any) => {
    setCVData((prev) => ({ ...prev, [section]: data }));
  };

  const generatePDF = async () => {
    try {
      setLoading(true);
      const tpl = cvData?.meta?.template || 'standard';
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
      
      toast.loading(language === 'ar' ? 'جاري إنشاء ملف PDF...' : 'Generating PDF...', { id: 'pdf-gen' });
      
      const response = await fetch(`${apiUrl}/cv/generate-pdf?template=${encodeURIComponent(tpl)}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ ...cvData, language }),
      });

      if (!response.ok) {
        let errorMessage = language === 'ar' ? 'فشل إنشاء ملف PDF' : 'Failed to generate PDF';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error?.message || errorMessage;
        } catch (e) {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Check if response is actually a PDF
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/pdf')) {
        throw new Error(language === 'ar' ? 'الاستجابة ليست ملف PDF صالح' : 'Response is not a valid PDF file');
      }

      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const fileName = `CV-${cvData.personalInfo.fullName?.replace(/\s+/g, '-') || 'User'}-${new Date().getTime()}.pdf`;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      toast.success(language === 'ar' ? 'تم تحميل السيرة الذاتية بنجاح' : 'CV downloaded successfully', { id: 'pdf-gen' });
    } catch (error: any) {
      console.error('PDF Generation Error:', error);
      const errorMessage = error.message || (language === 'ar' ? 'حدث خطأ أثناء التحميل. يرجى المحاولة مرة أخرى' : 'Error downloading CV. Please try again');
      toast.error(errorMessage, { id: 'pdf-gen' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${language === 'ar' ? 'rtl' : 'ltr'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar activeMode="application" activePage="cv-builder" />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <Toaster position="top-center" />
      
        <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {language === 'ar' ? 'باني السيرة الذاتية الذكي' : 'AI CV Builder'}
          </h1>
          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {language === 'ar' ? 'English' : 'العربية'}
          </button>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10" />
            {steps.map((s) => (
              <div key={s.id} className={`flex flex-col items-center bg-gray-50 px-2 cursor-pointer`} onClick={() => setStep(s.id)}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors duration-200 ${
                  step >= s.id ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-500'
                }`}>
                  {s.id}
                </div>
                <span className={`text-xs mt-2 font-medium ${step >= s.id ? 'text-indigo-600' : 'text-gray-500'}`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {step === 1 && <PersonalInfoForm data={cvData.personalInfo} update={(d: any) => updateData('personalInfo', d)} language={language} />}
              {step === 2 && <SummaryForm data={cvData.summary} update={(d: any) => updateData('summary', d)} language={language} personalInfo={cvData.personalInfo} />}
              {step === 3 && <ExperienceForm data={cvData.experience} update={(d: any) => updateData('experience', d)} language={language} />}
              {step === 4 && <EducationForm data={cvData.education} update={(d: any) => updateData('education', d)} language={language} />}
              {step === 5 && <SkillsForm data={cvData.skills} update={(d: any) => updateData('skills', d)} language={language} jobTitle={cvData.personalInfo.jobTitle} />}
              {step === 6 && (
                <div className="space-y-6">
                  {/* Template Selection - Enhanced */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      {language === 'ar' ? 'اختر قالب السيرة الذاتية' : 'Choose CV Template'}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                      {[
                        { id: 'standard', name: language === 'ar' ? 'قياسي' : 'Standard', icon: '📄', desc: language === 'ar' ? 'قالب تقليدي احترافي' : 'Traditional professional' },
                        { id: 'modern', name: language === 'ar' ? 'حديث' : 'Modern', icon: '✨', desc: language === 'ar' ? 'تصميم عصري وجذاب' : 'Modern and attractive' },
                        { id: 'classic', name: language === 'ar' ? 'كلاسيكي' : 'Classic', icon: '🎩', desc: language === 'ar' ? 'أناقة كلاسيكية' : 'Classic elegance' },
                        { id: 'creative', name: language === 'ar' ? 'إبداعي' : 'Creative', icon: '🎨', desc: language === 'ar' ? 'تصميم إبداعي مميز' : 'Unique creative design' },
                        { id: 'minimal', name: language === 'ar' ? 'مبسّط' : 'Minimal', icon: '⚪', desc: language === 'ar' ? 'بساطة وأناقة' : 'Simplicity and elegance' },
                        { id: 'executive', name: language === 'ar' ? 'تنفيذي' : 'Executive', icon: '💼', desc: language === 'ar' ? 'للقادة والمديرين' : 'For leaders and managers' },
                      ].map(template => (
                        <button
                          key={template.id}
                          onClick={() => setCVData((prev) => ({ ...prev, meta: { ...(prev.meta || {}), template: template.id } }))}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            cvData?.meta?.template === template.id
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg scale-105'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400 hover:shadow-md'
                          }`}
                        >
                          <div className="text-2xl mb-2">{template.icon}</div>
                          <div className="font-semibold text-sm mb-1">{template.name}</div>
                          <div className={`text-xs ${cvData?.meta?.template === template.id ? 'text-indigo-100' : 'text-gray-500'}`}>
                            {template.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Preview */}
                  <CVPreview data={cvData} language={language} onDownload={generatePDF} loading={loading} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={handlePrev}
            disabled={step === 1}
            className={`px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 ${step === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {language === 'ar' ? 'السابق' : 'Previous'}
          </button>
          
          {step < 6 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {language === 'ar' ? 'التالي' : 'Next'}
            </button>
          ) : (
            <button
              onClick={generatePDF}
              disabled={loading}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {language === 'ar' ? 'جاري التحميل...' : 'Generating...'}
                </>
              ) : (
                language === 'ar' ? 'تحميل PDF' : 'Download PDF'
              )}
            </button>
          )}
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}
