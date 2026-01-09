'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import CVBuilder from '@/components/cv-builder/cv-builder';
import { useLanguage } from '@/contexts/language-context';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

export default function CVBuilderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);

  const cvId = searchParams?.get('id') || undefined;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to login if not authenticated
  if (mounted && !isLoading && !user) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {language === 'ar' ? 'يرجى تسجيل الدخول' : 'Please Log In'}
            </h1>
            <p className="text-gray-600 mb-8">
              {language === 'ar'
                ? 'تحتاج إلى تسجيل الدخول لاستخدام مُنشئ السيرة الذاتية'
                : 'You need to log in to use the CV Builder'}
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/login"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {language === 'ar' ? 'تسجيل الدخول' : 'Log In'}
              </Link>
              <Link
                href="/register"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                {language === 'ar' ? 'إنشاء حساب' : 'Create Account'}
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!mounted || isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="text-center">
            <div className="inline-flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
            <p className="mt-4 text-gray-600">
              {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8 px-6">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 mb-4 hover:opacity-80 transition"
            >
              <ArrowLeft size={20} />
              <span>{language === 'ar' ? 'الرجوع' : 'Back'}</span>
            </button>
            <h1 className="text-4xl font-bold mb-2">
              {language === 'ar' ? '🎯 منشئ السيرة الذاتية' : '🎯 CV Builder'}
            </h1>
            <p className="text-blue-100">
              {language === 'ar'
                ? 'أنشئ وحرّر سيرتك الذاتية باحترافية باستخدام نماذج احترافية'
                : 'Create and edit your professional CV using professional templates'}
            </p>
          </div>
        </div>

        {/* CV Builder Component */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {mounted && user?.id && (
            <Suspense fallback={<LoadingFallback language={language} />}>
              <CVBuilder cvId={cvId} userId={user.id} />
            </Suspense>
          )}
        </div>

        {/* Features Section */}
        <div className="bg-white py-12 px-6 border-t border-gray-200">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {language === 'ar' ? 'المميزات' : 'Features'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                title={language === 'ar' ? '9 نماذج احترافية' : '9 Professional Templates'}
                description={language === 'ar' ? 'اختر من بين 9 تصاميم احترافية' : 'Choose from 9 professional designs'}
              />
              <FeatureCard
                title={language === 'ar' ? 'استيراد من ملفات' : 'Import from Files'}
                description={language === 'ar'
                  ? 'استورد من JSON و YAML و LinkedIn'
                  : 'Import from JSON, YAML, and LinkedIn'}
              />
              <FeatureCard
                title={language === 'ar' ? 'تصدير سهل' : 'Easy Export'}
                description={language === 'ar'
                  ? 'صدّر إلى PDF و HTML و JSON'
                  : 'Export to PDF, HTML, and JSON'}
              />
              <FeatureCard
                title={language === 'ar' ? 'حفظ تلقائي' : 'Auto Save'}
                description={language === 'ar'
                  ? 'يتم حفظ التغييرات تلقائياً كل 3 ثوان'
                  : 'Changes are saved automatically every 3 seconds'}
              />
              <FeatureCard
                title={language === 'ar' ? 'معاينة مباشرة' : 'Live Preview'}
                description={language === 'ar'
                  ? 'شاهد التغييرات بشكل فوري'
                  : 'See changes in real-time'}
              />
              <FeatureCard
                title={language === 'ar' ? 'مشاركة عامة' : 'Public Sharing'}
                description={language === 'ar'
                  ? 'شارك سيرتك الذاتية بروابط عامة'
                  : 'Share your CV with public links'}
              />
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-12 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {language === 'ar' ? 'هل تحتاج إلى مساعدة؟' : 'Need Help?'}
            </h2>
            <p className="text-gray-600 mb-8">
              {language === 'ar'
                ? 'اطّلع على دليل الاستخدام الشامل أو اتصل بفريق الدعم'
                : 'Check our comprehensive guide or contact support'}
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/help-center"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {language === 'ar' ? 'مركز المساعدة' : 'Help Center'}
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                {language === 'ar' ? 'اتصل بنا' : 'Contact Us'}
              </Link>
              <Link
                href="/faq"
                className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition"
              >
                {language === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <Toaster position="top-center" />
    </>
  );
}

function LoadingFallback({ language }: { language: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <p className="mt-4 text-gray-600">
          {language === 'ar' ? 'جاري تحميل الواجهة...' : 'Loading CV Builder...'}
        </p>
      </div>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 hover:border-blue-400 transition">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

    try {
      setLoading(true);
      const tpl = cvData?.meta?.template || 'standard';
      
      toast.loading(language === 'ar' ? 'جاري إنشاء ملف PDF...' : 'Generating PDF...', { id: 'pdf-gen' });
      
      // Use api service with responseType: 'blob' for binary PDF data
      const response = await api.post(
        `/cv/generate-pdf?template=${encodeURIComponent(tpl)}`,
        { ...cvData, language },
        {
          responseType: 'blob', // Critical for binary PDF data
        }
      );

      // Check if response is actually a PDF
      const contentType = response.headers['content-type'] || response.headers['Content-Type'];
      if (!contentType || !contentType.includes('application/pdf')) {
        // Try to parse error message if response is JSON
        try {
          const text = await new Response(response.data).text();
          const errorData = JSON.parse(text);
          throw new Error(errorData.message || (language === 'ar' ? 'فشل إنشاء ملف PDF' : 'Failed to generate PDF'));
        } catch (parseError) {
          throw new Error(language === 'ar' ? 'الاستجابة ليست ملف PDF صالح' : 'Response is not a valid PDF file');
        }
      }

      // Create blob from response data
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
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
      console.error('[PDF Generation] Error:', error);
      
      let errorMessage = language === 'ar' ? 'حدث خطأ أثناء التحميل. يرجى المحاولة مرة أخرى' : 'Error downloading CV. Please try again';
      
      if (error.response?.data) {
        // Try to extract error message from blob response
        try {
          const text = await new Response(error.response.data).text();
          const errorData = JSON.parse(text);
          errorMessage = errorData.message || errorData.error?.message || errorMessage;
        } catch (parseError) {
          // If not JSON, use default message
          if (error.response.data.message) {
            errorMessage = error.response.data.message;
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Handle network errors
      if (error.message?.includes('Network Error') || error.message?.includes('Failed to fetch') || !error.response) {
        errorMessage = language === 'ar' 
          ? 'خطأ في الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.'
          : 'Network error. Please check your internet connection and try again.';
      }
      
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
      <Footer />
    </div>
  );
}
