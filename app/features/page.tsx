/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import {
  Search,
  Users,
  Target,
  MessageCircle,
  BarChart,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Globe,
  Shield,
  Smartphone,
  Wifi,
  Clock,
  Zap,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Building2,
  Briefcase,
  Stethoscope,
  Heart,
  FolderKanban,
  Mic,
  BookOpen,
  Settings,
} from 'lucide-react'

export default function FeaturesPage() {
  const { language } = useLanguage()
  const [activeTab, setActiveTab] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const categories = [
    {
      id: 1,
      name: 'Players',
      Icon: Users,
      nameAr: 'اللاعبين',
      nameEn: 'Players',
    },
    {
      id: 2,
      name: 'Coaches',
      Icon: GraduationCap,
      nameAr: 'المدربين',
      nameEn: 'Coaches',
    },
    { id: 3, name: 'Clubs', Icon: Building2, nameAr: 'الاندية', nameEn: 'Clubs' },
    {
      id: 4,
      name: 'Support Roles',
      Icon: Briefcase,
      nameAr: 'الوظائف المساندة ',
      nameEn: 'Support Roles',
    },
    {
      id: 5,
      name: 'Physical Therapists',
      Icon: Heart,
      nameAr: 'أخصائين العلاج الطبيعي ',
      nameEn: 'Physical Therapists',
    },
    {
      id: 6,
      name: 'Sports Doctors',
      Icon: Stethoscope,
      nameAr: 'أطباء الطب الرياضي',
      nameEn: 'Sports Doctors',
    },
    {
      id: 7,
      name: 'Sports Management',
      Icon: FolderKanban,
      nameAr: 'الإدارة الرياضية',
      nameEn: 'Sports Management',
    },
    {
      id: 8,
      name: 'Sports Media',
      Icon: Mic,
      nameAr: 'الإعلام الرياضي',
      nameEn: 'Sports Media',
    },
    {
      id: 9,
      name: 'Sports Education',
      Icon: BookOpen,
      nameAr: 'التعليم الرياضي',
      nameEn: 'Sports Education',
    },
    {
      id: 10,
      name: 'Facility Operations',
      Icon: Settings,
      nameAr: 'تشغيل وإدارة المنشآت',
      nameEn: 'Facility Operations',
    },
  ]

  const features = {
    0: [
      {
        icon: Search,
        title: language === 'ar' ? 'بحث ذكي متقدم' : 'Advanced Smart Search',
        desc: language === 'ar' ? 'اعثر على أفضل الفرص بسهولة' : 'Find best opportunities easily',
      },
      {
        icon: Globe,
        title: language === 'ar' ? 'بحث عالمي' : 'Global Search',
        desc: language === 'ar' ? 'ابحث في 200+ دولة' : 'Search in 200+ countries',
      },
      {
        icon: Zap,
        title: language === 'ar' ? 'فلاتر ذكية' : 'Smart Filters',
        desc: language === 'ar' ? 'فلترة تلقائية حسب مهاراتك' : 'Auto-filter by your skills',
      },
    ],
    1: [
      {
        icon: Target,
        title: language === 'ar' ? 'مطابقة دقيقة 98%' : '98% Precision Matching',
        desc: language === 'ar' ? 'خوارزميات AI متطورة' : 'Advanced AI algorithms',
      },
      {
        icon: Sparkles,
        title: language === 'ar' ? 'توصيات ذكية' : 'Smart Suggestions',
        desc: language === 'ar' ? 'اقتراحات مخصصة لك' : 'Personalized recommendations',
      },
      {
        icon: CheckCircle,
        title: language === 'ar' ? 'نتائج فورية' : 'Instant Results',
        desc: language === 'ar' ? 'احصل على نتائج في ثواني' : 'Get results in seconds',
      },
    ],
    2: [
      {
        icon: MessageCircle,
        title: language === 'ar' ? 'رسائل فورية آمنة' : 'Secure Instant Messaging',
        desc: language === 'ar' ? 'تواصل مباشر مع الشركات' : 'Direct communication',
      },
      {
        icon: Clock,
        title: language === 'ar' ? 'جدولة ذكية' : 'Smart Scheduling',
        desc: language === 'ar' ? 'احجز المقابلات تلقائياً' : 'Auto-book interviews',
      },
      {
        icon: Users,
        title: language === 'ar' ? 'مساحات عمل مشتركة' : 'Team Workspace',
        desc: language === 'ar' ? 'تعاون سلس مع فريقك' : 'Seamless team collaboration',
      },
    ],
    3: [
      {
        icon: BarChart,
        title: language === 'ar' ? 'تحليل الأداء' : 'Performance Analytics',
        desc: language === 'ar' ? 'تتبع تقدمك المهني' : 'Track your progress',
      },
      {
        icon: Zap,
        title: language === 'ar' ? 'رؤى السوق' : 'Market Insights',
        desc: language === 'ar' ? 'فهم اتجاهات الوظائف' : 'Understand job trends',
      },
      {
        icon: Sparkles,
        title: language === 'ar' ? 'تقارير مخصصة' : 'Custom Reports',
        desc: language === 'ar' ? 'تقارير مفصلة لتقدمك' : 'Detailed progress reports',
      },
    ],
  }

  const technicalFeatures = [
    {
      icon: Shield,
      title: language === 'ar' ? 'أمان عسكري' : 'Military-Grade Security',
      desc: language === 'ar' ? 'تشفير من أعلى المستويات' : 'Top-level encryption',
    },
    {
      icon: Clock,
      title: '99.9% Uptime',
      desc: language === 'ar' ? 'استخدم المنصة دائماً' : 'Platform always available',
    },
    {
      icon: Smartphone,
      title: language === 'ar' ? 'تطبيقات أصلية' : 'Native Apps',
      desc: language === 'ar' ? 'iOS و Android' : 'iOS & Android',
    },
    {
      icon: Wifi,
      title: language === 'ar' ? 'عمل بلا إنترنت' : 'Offline Mode',
      desc: language === 'ar' ? 'استمر بدون اتصال' : 'Work without internet',
    },
  ]

  return (
    <div
      className={`min-h-screen bg-white ${language === 'ar' ? 'font-arabic' : 'font-english'}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <Navbar activeMode="application" activePage="features" />

      {/* Hero Section */}
      <section className="py-20 lg:py-32 px-4 sm:px-6 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-blue-400/30">
              <Sparkles className="w-4 h-4" />
              {language === 'ar' ? 'مميزات عالمية' : 'World-Class Features'}
            </span>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                {language === 'ar' ? 'منصة احترافية متطورة' : 'Professional Advanced Platform'}
              </span>
            </h1>

            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-semibold mb-4">
              {language === 'ar'
                ? 'أدوات قوية وذكية تجعل التوظيف الرياضي أسهل وأسرع'
                : 'Powerful & intelligent tools making sports recruitment easier and faster'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Features Section */}
      <section className="py-24 lg:py-32 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap gap-3 justify-center mb-16"
          >
            {[
              { id: 0, name: language === 'ar' ? 'البحث والاكتشاف' : 'Search & Discovery', icon: Search },
              { id: 1, name: language === 'ar' ? 'المطابقة الذكية' : 'Smart Matching', icon: Target },
              { id: 2, name: language === 'ar' ? 'التعاون' : 'Collaboration', icon: Users },
              { id: 3, name: language === 'ar' ? 'التحليلات' : 'Analytics', icon: BarChart },
            ].map((cat, idx) => {
              const IconComponent = cat.icon
              return (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(cat.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 border ${
                    activeTab === cat.id
                      ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white border-transparent shadow-lg'
                      : 'bg-gray-100 text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  {cat.name}
                </motion.button>
              )
            })}
          </motion.div>

          {/* Features Grid */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features[activeTab as keyof typeof features].map((feature, idx) => {
              const IconComponent = feature.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ translateY: -5 }}
                  className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-lg"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 font-semibold">{feature.desc}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>


      {/* Technical Specs Section */}
      <section className="py-24 lg:py-32 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
              {language === 'ar' ? 'تقنيات متطورة' : 'Advanced Technology'}
            </h2>
            <p className="text-xl text-gray-600 font-semibold max-w-2xl mx-auto">
              {language === 'ar' ? 'بنية تحتية قوية وموثوقة' : 'Powerful & reliable infrastructure'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {technicalFeatures.map((tech, idx) => {
              const IconComponent = tech.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200 text-center shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{tech.title}</h3>
                  <p className="text-sm text-gray-600 font-semibold">{tech.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 lg:py-32 px-4 sm:px-6 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
              {language === 'ar' ? 'خطط مرنة' : 'Flexible Plans'}
            </h2>
            <p className="text-xl text-gray-600 font-semibold max-w-2xl mx-auto">
              {language === 'ar' ? 'اختر ما يناسبك' : 'Choose what suits you'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: language === 'ar' ? 'مجاني' : 'Free',
                price: language === 'ar' ? 'مجاناً' : 'Free',
              },
              {
                name: language === 'ar' ? 'احترافي' : 'Pro',
                price: '$29',
                popular: true,
              },
              {
                name: language === 'ar' ? 'مؤسسات' : 'Enterprise',
                price: language === 'ar' ? 'مخصص' : 'Custom',
              },
            ].map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`rounded-2xl p-8 transition-all duration-300 ${
                  plan.popular
                    ? `bg-gradient-to-br from-blue-500 to-emerald-500 text-white shadow-xl scale-105`
                    : `bg-white border border-gray-200 text-gray-900`
                }`}
              >
                {plan.popular && (
                  <div className="mb-4 inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                    ⭐ {language === 'ar' ? 'الأشهر' : 'Most Popular'}
                  </div>
                )}
                <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
                <div className="text-4xl font-black mb-6">{plan.price}</div>
                <Link href="/register">
                  <Button
                    className={`w-full font-bold text-lg rounded-lg transition-all ${
                      plan.popular
                        ? 'bg-white text-blue-600 hover:bg-gray-100'
                        : 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white hover:shadow-lg'
                    }`}
                  >
                    {language === 'ar' ? 'اختر الخطة' : 'Choose Plan'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 bg-gradient-to-br from-blue-600 to-emerald-600 text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl sm:text-5xl font-black mb-6">
            {language === 'ar' ? 'جاهز لتحويل مسارك المهني؟' : 'Ready to Transform Your Career?'}
          </h2>
          <p className="text-xl mb-10 font-semibold text-white/90">
            {language === 'ar'
              ? 'اكتشف آلاف الفرص الرياضية والمحترفين على منصة TF1'
              : 'Discover thousands of sports opportunities on TF1'}
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/register">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 text-lg font-bold rounded-lg shadow-lg">
                {language === 'ar' ? '🚀 ابدأ الآن' : '🚀 Get Started'}
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}
