'use client';

import React, { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import CVBuilderMain from '@/components/cv-builder/CVBuilderMain';
import { useLanguage } from '@/contexts/language-context';
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';
import { ArrowLeft, Sparkles, FileText, Download, Shield, Zap, Globe } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

function CVBuilderPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const { user, loading: authLoading } = useAuth();

  const cvId = searchParams?.get('id') || undefined;

  // Auth guard - redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/auth/login?redirect=/jobs/cv-builder${cvId ? `?id=${cvId}` : ''}`);
    }
  }, [user, authLoading, router, cvId]);

  // Show loading while checking auth
  if (authLoading) {
    return <LoadingFallback language={language} />;
  }

  // Don't render if not authenticated
  if (!user) {
    return <LoadingFallback language={language} message={language === 'ar' ? 'جاري التحقق من الهوية...' : 'Verifying authentication...'} />;
  }

  return (
    <>
      <Navbar activeMode="application" activePage="cv-builder" />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 mb-6 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span>{language === 'ar' ? 'الرجوع' : 'Back'}</span>
            </button>
            
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                    {language === 'ar' ? 'منشئ السيرة الذاتية' : 'CV Builder'}
                  </h1>
                </div>
                <p className="text-lg text-white/90 max-w-2xl">
                  {language === 'ar'
                    ? 'أنشئ سيرتك الذاتية الاحترافية في دقائق مع تحسينات الذكاء الاصطناعي وقوالب مخصصة للرياضيين'
                    : 'Create your professional CV in minutes with AI-powered enhancements and sports-focused templates'}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm font-medium">
                    {language === 'ar' ? 'مدعوم بالذكاء الاصطناعي' : 'AI-Powered'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CV Builder Component */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CVBuilderMain cvId={cvId} />
        </div>

        {/* Features Section */}
        <div className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {language === 'ar' ? 'لماذا تختار منشئ السيرة الذاتية لدينا؟' : 'Why Choose Our CV Builder?'}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {language === 'ar'
                  ? 'أدوات متقدمة مصممة خصيصاً للرياضيين والمحترفين في المجال الرياضي'
                  : 'Advanced tools designed specifically for athletes and sports professionals'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={<Sparkles className="w-6 h-6 text-primary" />}
                title={language === 'ar' ? 'تحسين بالذكاء الاصطناعي' : 'AI Enhancement'}
                description={language === 'ar' 
                  ? 'حسّن كل قسم بنقرة واحدة باستخدام الذكاء الاصطناعي' 
                  : 'Improve every section with one click using AI'}
              />
              <FeatureCard
                icon={<FileText className="w-6 h-6 text-primary" />}
                title={language === 'ar' ? 'قوالب رياضية متخصصة' : 'Sports-Focused Templates'}
                description={language === 'ar'
                  ? '6 قوالب احترافية مصممة للرياضيين'
                  : '6 professional templates designed for athletes'}
              />
              <FeatureCard
                icon={<Download className="w-6 h-6 text-primary" />}
                title={language === 'ar' ? 'تصدير متعدد الصيغ' : 'Multi-Format Export'}
                description={language === 'ar'
                  ? 'صدّر إلى PDF، HTML، أو JSON بسهولة'
                  : 'Export to PDF, HTML, or JSON easily'}
              />
              <FeatureCard
                icon={<Shield className="w-6 h-6 text-primary" />}
                title={language === 'ar' ? 'فحص ATS' : 'ATS Check'}
                description={language === 'ar'
                  ? 'تأكد من توافق سيرتك مع أنظمة التوظيف'
                  : 'Ensure your CV is ATS-compatible'}
              />
              <FeatureCard
                icon={<Zap className="w-6 h-6 text-primary" />}
                title={language === 'ar' ? 'حفظ تلقائي' : 'Auto-Save'}
                description={language === 'ar'
                  ? 'لا تقلق من فقدان عملك - حفظ تلقائي كل 30 ثانية'
                  : "Never lose your work - auto-saves every 30 seconds"}
              />
              <FeatureCard
                icon={<Globe className="w-6 h-6 text-primary" />}
                title={language === 'ar' ? 'دعم ثنائي اللغة' : 'Bilingual Support'}
                description={language === 'ar'
                  ? 'إنشاء سيرة ذاتية بالعربية أو الإنجليزية'
                  : 'Create CV in Arabic or English'}
              />
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              {language === 'ar' ? 'هل تحتاج إلى مساعدة؟' : 'Need Help?'}
            </h2>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
              {language === 'ar'
                ? 'فريقنا مستعد لمساعدتك في إنشاء السيرة الذاتية المثالية'
                : 'Our team is ready to help you create the perfect CV'}
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/help-center"
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                {language === 'ar' ? 'مركز المساعدة' : 'Help Center'}
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 bg-white text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                {language === 'ar' ? 'اتصل بنا' : 'Contact Us'}
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

function LoadingFallback({ language, message }: { language: string; message?: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="text-center">
        <div className="inline-flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"></div>
        </div>
        <p className="mt-4 text-gray-600">
          {message || (language === 'ar' ? 'جاري تحميل منشئ السيرة الذاتية...' : 'Loading CV Builder...')}
        </p>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 group">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-primary/5 rounded-lg group-hover:bg-primary/10 transition-colors">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function CVBuilderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"></div>
          </div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    }>
      <CVBuilderPageContent />
    </Suspense>
  );
}
