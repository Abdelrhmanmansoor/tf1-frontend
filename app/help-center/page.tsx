'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import {
  Search,
  Book,
  Video,
  MessageCircle,
  FileText,
  Settings,
  Users,
  Briefcase,
  Shield,
  CreditCard,
  Bell,
  HelpCircle,
} from 'lucide-react'
import Link from 'next/link'

export default function HelpCenterPage() {
  const { language } = useLanguage()

  const helpCategories = [
    {
      icon: Users,
      title: language === 'ar' ? 'إدارة الحساب' : 'Account Management',
      description:
        language === 'ar'
          ? 'تعلم كيفية إنشاء وإدارة حسابك وملفك الشخصي'
          : 'Learn how to create and manage your account and profile',
      articles: 5,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Briefcase,
      title: language === 'ar' ? 'البحث عن الوظائف' : 'Job Search',
      description:
        language === 'ar'
          ? 'دليل شامل للبحث والتقديم على الوظائف'
          : 'Complete guide to searching and applying for jobs',
      articles: 8,
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: FileText,
      title: language === 'ar' ? 'نشر الوظائف' : 'Job Posting',
      description:
        language === 'ar'
          ? 'كيفية نشر وإدارة الوظائف للأندية والمؤسسات'
          : 'How to post and manage jobs for clubs and organizations',
      articles: 6,
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: CreditCard,
      title: language === 'ar' ? 'الفواتير والدفع' : 'Billing & Payments',
      description:
        language === 'ar'
          ? 'معلومات حول الخطط والأسعار وطرق الدفع'
          : 'Information about plans, pricing, and payment methods',
      articles: 4,
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Shield,
      title: language === 'ar' ? 'الخصوصية والأمان' : 'Privacy & Security',
      description:
        language === 'ar'
          ? 'كيفية حماية حسابك وبياناتك الشخصية'
          : 'How to protect your account and personal data',
      articles: 7,
      color: 'from-indigo-500 to-blue-500',
    },
    {
      icon: Settings,
      title: language === 'ar' ? 'الإعدادات' : 'Settings',
      description:
        language === 'ar'
          ? 'تخصيص تفضيلاتك وإعدادات الحساب'
          : 'Customize your preferences and account settings',
      articles: 5,
      color: 'from-gray-500 to-slate-500',
    },
  ]

  const quickLinks = [
    {
      icon: HelpCircle,
      title: language === 'ar' ? 'الأسئلة الشائعة' : 'FAQ',
      description:
        language === 'ar'
          ? 'إجابات سريعة للأسئلة الأكثر شيوعاً'
          : 'Quick answers to most common questions',
      link: '/faq',
    },
    {
      icon: MessageCircle,
      title: language === 'ar' ? 'اتصل بنا' : 'Contact Us',
      description:
        language === 'ar'
          ? 'تواصل مع فريق الدعم للحصول على المساعدة'
          : 'Reach out to our support team for help',
      link: '/contact',
    },
    {
      icon: Video,
      title: language === 'ar' ? 'فيديوهات تعليمية' : 'Video Tutorials',
      description:
        language === 'ar'
          ? 'شاهد دروس فيديو خطوة بخطوة'
          : 'Watch step-by-step video tutorials',
      link: '#',
    },
  ]

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 ${language === 'ar' ? 'font-arabic' : 'font-english'}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <Navbar activeMode="application" activePage="help" />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-green-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              {language === 'ar' ? 'كيف يمكننا مساعدتك؟' : 'How can we help you?'}
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-8">
              {language === 'ar'
                ? 'ابحث في مركز المساعدة أو تصفح المقالات حسب الموضوع'
                : 'Search our help center or browse articles by topic'}
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={
                  language === 'ar' ? 'ابحث عن مقالات المساعدة...' : 'Search help articles...'
                }
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {language === 'ar' ? 'تصفح حسب الفئة' : 'Browse by Category'}
            </h2>
            <p className="text-lg text-gray-600">
              {language === 'ar'
                ? 'اختر موضوعاً للعثور على المساعدة التي تحتاجها'
                : 'Choose a topic to find the help you need'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {category.title}
                </h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="text-sm text-gray-500">
                  {category.articles}{' '}
                  {language === 'ar' ? 'مقالات' : 'articles'}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-blue-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {language === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h2>
            <p className="text-lg text-white/90">
              {language === 'ar'
                ? 'الوصول السريع إلى الموارد الأكثر استخداماً'
                : 'Quick access to our most used resources'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickLinks.map((link, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  href={link.link}
                  className="block bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300"
                >
                  <link.icon className="w-8 h-8 text-white mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    {link.title}
                  </h3>
                  <p className="text-white/80">{link.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl p-8 sm:p-12 text-center text-white"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {language === 'ar'
                ? 'لا تزال بحاجة للمساعدة؟'
                : 'Still need help?'}
            </h2>
            <p className="text-lg text-white/90 mb-8">
              {language === 'ar'
                ? 'فريق الدعم لدينا متاح 24/7 لمساعدتك'
                : 'Our support team is available 24/7 to assist you'}
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              {language === 'ar' ? 'اتصل بفريق الدعم' : 'Contact Support'}
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
