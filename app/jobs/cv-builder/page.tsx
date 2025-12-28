'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import PersonalInfoForm from './components/PersonalInfoForm';
import SummaryForm from './components/SummaryForm';
import ExperienceForm from './components/ExperienceForm';
import EducationForm from './components/EducationForm';
import SkillsForm from './components/SkillsForm';
import CVPreview from './components/CVPreview';

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
    courses: []
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

  const updateData = (section, data) => {
    setCVData((prev) => ({ ...prev, [section]: data }));
  };

  const generatePDF = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/cv/generate-pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...cvData, language }),
      });

      if (!response.ok) throw new Error('Failed to generate PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CV-${cvData.personalInfo.fullName || 'User'}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success(language === 'ar' ? 'تم تحميل السيرة الذاتية بنجاح' : 'CV downloaded successfully');
    } catch (error) {
      toast.error(language === 'ar' ? 'حدث خطأ أثناء التحميل' : 'Error downloading CV');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 ${language === 'ar' ? 'rtl' : 'ltr'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
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
              {step === 1 && <PersonalInfoForm data={cvData.personalInfo} update={(d) => updateData('personalInfo', d)} language={language} />}
              {step === 2 && <SummaryForm data={cvData.summary} update={(d) => updateData('summary', d)} language={language} personalInfo={cvData.personalInfo} />}
              {step === 3 && <ExperienceForm data={cvData.experience} update={(d) => updateData('experience', d)} language={language} />}
              {step === 4 && <EducationForm data={cvData.education} update={(d) => updateData('education', d)} language={language} />}
              {step === 5 && <SkillsForm data={cvData.skills} update={(d) => updateData('skills', d)} language={language} jobTitle={cvData.personalInfo.jobTitle} />}
              {step === 6 && <CVPreview data={cvData} language={language} onDownload={generatePDF} loading={loading} />}
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
  );
}
