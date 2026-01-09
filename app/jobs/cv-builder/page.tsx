'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import CVBuilder from '@/components/cv-builder/cv-builder';
import { useLanguage } from '@/contexts/language-context';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

function CVBuilderPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();

  const cvId = searchParams?.get('id') || undefined;

  return (
    <>
      <Navbar activeMode="application" activePage="cv-builder" />
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
          <Suspense fallback={<LoadingFallback language={language} />}>
            <CVBuilder cvId={cvId} userId="guest" />
          </Suspense>
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

export default function CVBuilderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    }>
      <CVBuilderPageContent />
    </Suspense>
  );
}
