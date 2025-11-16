/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'
import { Navbar } from '@/components/navbar'
import Link from 'next/link'
import {
  Search,
  Users,
  Target,
  Heart,
  Star,
  Trophy,
  Globe,
  Shield,
  Zap,
  Award,
  Building,
  Briefcase,
  CheckCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Rocket,
  Lightbulb,
  Eye,
  Compass,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Filter,
  MessageCircle,
  BarChart,
  Lock,
  Smartphone,
  Monitor,
  Wifi,
  Bell,
  Settings,
  Cloud,
  Database,
  Cpu,
  PlayCircle,
  Pause,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

export default function FeaturesPage() {
  const { language } = useLanguage()
  const [activeCategory, setActiveCategory] = useState(0)
  const [activeFeature, setActiveFeature] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  // Auto-play feature carousel
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % featuresShowcase.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isPlaying])

  const categories = [
    {
      id: 'search',
      name: language === 'ar' ? 'البحث والاكتشاف' : 'Search & Discovery',
      icon: Search,
      color: 'from-blue-500 to-cyan-500',
      description:
        language === 'ar'
          ? 'أدوات بحث متقدمة للعثور على أفضل الفرص'
          : 'Advanced search tools to find the best opportunities',
    },
    {
      id: 'matching',
      name: language === 'ar' ? 'المطابقة الذكية' : 'Smart Matching',
      icon: Target,
      color: 'from-green-500 to-emerald-500',
      description:
        language === 'ar'
          ? 'خوارزميات ذكية لمطابقة المواهب مع الفرص'
          : 'Intelligent algorithms matching talents with opportunities',
    },
    {
      id: 'collaboration',
      name: language === 'ar' ? 'التعاون والتواصل' : 'Collaboration',
      icon: MessageCircle,
      color: 'from-purple-500 to-pink-500',
      description:
        language === 'ar'
          ? 'أدوات تعاون متقدمة للفرق والمؤسسات'
          : 'Advanced collaboration tools for teams and organizations',
    },
    {
      id: 'analytics',
      name: language === 'ar' ? 'التحليلات والإحصائيات' : 'Analytics',
      icon: BarChart,
      color: 'from-orange-500 to-red-500',
      description:
        language === 'ar'
          ? 'تحليلات شاملة لفهم الأداء والنمو'
          : 'Comprehensive analytics to understand performance and growth',
    },
  ]

  const featuresShowcase = [
    {
      title: language === 'ar' ? 'بحث ذكي متقدم' : 'Advanced Smart Search',
      description:
        language === 'ar'
          ? 'اعثر على الوظائف المثالية باستخدام فلاتر متقدمة وذكاء اصطناعي'
          : 'Find perfect jobs using advanced filters and AI technology',
      icon: Search,
      gradient: 'from-blue-400 to-green-400',
      features: [
        language === 'ar'
          ? 'فلترة بالموقع والراتب'
          : 'Location & salary filters',
        language === 'ar' ? 'بحث صوتي' : 'Voice search',
        language === 'ar' ? 'اقتراحات ذكية' : 'Smart suggestions',
      ],
    },
    {
      title:
        language === 'ar'
          ? 'مطابقة مدعومة بالذكاء الاصطناعي'
          : 'AI-Powered Matching',
      description:
        language === 'ar'
          ? 'خوارزميات متقدمة تحلل مهاراتك وتجد أفضل الفرص المناسبة'
          : 'Advanced algorithms analyze your skills to find the best opportunities',
      icon: Target,
      gradient: 'from-blue-400 to-green-400',
      features: [
        language === 'ar' ? 'تحليل المهارات' : 'Skills analysis',
        language === 'ar' ? 'مطابقة دقيقة' : 'Precise matching',
        language === 'ar' ? 'توصيات شخصية' : 'Personal recommendations',
      ],
    },
    {
      title:
        language === 'ar' ? 'تعاون فريق متطور' : 'Advanced Team Collaboration',
      description:
        language === 'ar'
          ? 'أدوات تعاون متطورة للفرق والمؤسسات الرياضية'
          : 'Advanced collaboration tools for sports teams and organizations',
      icon: Users,
      gradient: 'from-blue-400 to-green-400',
      features: [
        language === 'ar' ? 'دردشة جماعية' : 'Group messaging',
        language === 'ar' ? 'مشاركة الملفات' : 'File sharing',
        language === 'ar' ? 'إدارة المشاريع' : 'Project management',
      ],
    },
    {
      title: language === 'ar' ? 'تحليلات شاملة' : 'Comprehensive Analytics',
      description:
        language === 'ar'
          ? 'احصل على رؤى عميقة حول أدائك وتقدمك المهني'
          : 'Get deep insights into your performance and career progress',
      icon: BarChart,
      gradient: 'from-blue-400 to-green-400',
      features: [
        language === 'ar' ? 'تقارير الأداء' : 'Performance reports',
        language === 'ar' ? 'تتبع التقدم' : 'Progress tracking',
        language === 'ar' ? 'رؤى مخصصة' : 'Custom insights',
      ],
    },
  ]

  const allFeatures = [
    {
      category: 'search',
      icon: Search,
      title: language === 'ar' ? 'البحث المتقدم' : 'Advanced Search',
      description:
        language === 'ar'
          ? 'فلاتر متعددة وبحث ذكي بالذكاء الاصطناعي'
          : 'Multiple filters and AI-powered smart search',
      benefits: ['99% accuracy', '10x faster', 'Real-time results'],
    },
    {
      category: 'search',
      icon: Filter,
      title: language === 'ar' ? 'فلترة ذكية' : 'Smart Filtering',
      description:
        language === 'ar'
          ? 'فلترة تلقائية حسب المهارات والخبرة'
          : 'Automatic filtering based on skills and experience',
      benefits: ['Auto-filters', 'Skill matching', 'Location-based'],
    },
    {
      category: 'search',
      icon: Globe,
      title: language === 'ar' ? 'بحث عالمي' : 'Global Search',
      description:
        language === 'ar'
          ? 'ابحث في جميع أنحاء العالم عن أفضل الفرص'
          : 'Search worldwide for the best opportunities',
      benefits: ['200+ countries', 'Multi-language', '24/7 availability'],
    },
    {
      category: 'matching',
      icon: Target,
      title: language === 'ar' ? 'مطابقة دقيقة' : 'Precision Matching',
      description:
        language === 'ar'
          ? 'مطابقة دقيقة بنسبة 98% للمهارات والمتطلبات'
          : '98% accurate matching of skills and requirements',
      benefits: ['98% accuracy', 'Real-time', 'ML-powered'],
    },
    {
      category: 'matching',
      icon: Cpu,
      title: language === 'ar' ? 'ذكاء اصطناعي' : 'AI Intelligence',
      description:
        language === 'ar'
          ? 'خوارزميات تعلم آلي متطورة لأفضل النتائج'
          : 'Advanced machine learning algorithms for best results',
      benefits: ['Deep learning', 'Neural networks', 'Continuous improvement'],
    },
    {
      category: 'matching',
      icon: Lightbulb,
      title: language === 'ar' ? 'اقتراحات ذكية' : 'Smart Suggestions',
      description:
        language === 'ar'
          ? 'اقتراحات مخصصة بناءً على ملفك الشخصي'
          : 'Personalized suggestions based on your profile',
      benefits: ['Personalized', 'Data-driven', 'Adaptive'],
    },
    {
      category: 'collaboration',
      icon: MessageCircle,
      title: language === 'ar' ? 'رسائل فورية' : 'Instant Messaging',
      description:
        language === 'ar'
          ? 'تواصل مباشر مع أصحاب العمل والزملاء'
          : 'Direct communication with employers and colleagues',
      benefits: ['Real-time', 'Secure', 'Multi-media'],
    },
    {
      category: 'collaboration',
      icon: Users,
      title: language === 'ar' ? 'فرق العمل' : 'Team Workspace',
      description:
        language === 'ar'
          ? 'مساحات عمل مشتركة للفرق والمشاريع'
          : 'Shared workspaces for teams and projects',
      benefits: ['Collaborative', 'File sharing', 'Task management'],
    },
    {
      category: 'collaboration',
      icon: Calendar,
      title: language === 'ar' ? 'جدولة ذكية' : 'Smart Scheduling',
      description:
        language === 'ar'
          ? 'جدولة المقابلات والاجتماعات تلقائياً'
          : 'Automatic scheduling of interviews and meetings',
      benefits: ['Auto-scheduling', 'Calendar sync', 'Timezone support'],
    },
    {
      category: 'analytics',
      icon: BarChart,
      title: language === 'ar' ? 'تحليل الأداء' : 'Performance Analytics',
      description:
        language === 'ar'
          ? 'تحليل شامل لأدائك وتقدمك المهني'
          : 'Comprehensive analysis of your performance and career progress',
      benefits: ['Real-time data', 'Custom reports', 'Predictive insights'],
    },
    {
      category: 'analytics',
      icon: TrendingUp,
      title: language === 'ar' ? 'تتبع النمو' : 'Growth Tracking',
      description:
        language === 'ar'
          ? 'تتبع نموك المهني عبر الزمن'
          : 'Track your professional growth over time',
      benefits: ['Timeline view', 'Milestone tracking', 'Goal setting'],
    },
    {
      category: 'analytics',
      icon: Eye,
      title: language === 'ar' ? 'رؤى السوق' : 'Market Insights',
      description:
        language === 'ar'
          ? 'فهم اتجاهات السوق والفرص الناشئة'
          : 'Understand market trends and emerging opportunities',
      benefits: ['Market data', 'Trend analysis', 'Opportunity forecasting'],
    },
  ]

  const technicalSpecs = [
    {
      icon: Cloud,
      title: language === 'ar' ? 'البنية السحابية' : 'Cloud Infrastructure',
      description:
        language === 'ar'
          ? 'استضافة سحابية موثوقة مع ضمان تشغيل 99.9%'
          : 'Reliable cloud hosting with 99.9% uptime guarantee',
      stats: '99.9% uptime',
    },
    {
      icon: Shield,
      title: language === 'ar' ? 'الأمان المتقدم' : 'Advanced Security',
      description:
        language === 'ar'
          ? 'تشفير من الدرجة العسكرية وحماية متعددة الطبقات'
          : 'Military-grade encryption and multi-layer protection',
      stats: 'Bank-level security',
    },
    {
      icon: Smartphone,
      title: language === 'ar' ? 'تطبيق الجوال' : 'Mobile App',
      description:
        language === 'ar'
          ? 'تطبيق أصلي لنظامي iOS و Android'
          : 'Native apps for iOS and Android platforms',
      stats: '4.8★ rating',
    },
    {
      icon: Wifi,
      title: language === 'ar' ? 'العمل بلا انترنت' : 'Offline Support',
      description:
        language === 'ar'
          ? 'استمر في العمل حتى بدون اتصال بالإنترنت'
          : 'Continue working even without internet connection',
      stats: 'Offline sync',
    },
  ]

  const pricingPlans = [
    {
      name: language === 'ar' ? 'مجاني' : 'Free',
      price: language === 'ar' ? 'مجاناً' : 'Free',
      description: language === 'ar' ? 'للمبتدئين' : 'For starters',
      features: [
        language === 'ar' ? 'بحث محدود' : 'Limited search',
        language === 'ar' ? 'ملف شخصي أساسي' : 'Basic profile',
        language === 'ar' ? 'دعم إيميل' : 'Email support',
      ],
      gradient: 'from-gray-400 to-gray-600',
      popular: false,
    },
    {
      name: language === 'ar' ? 'احترافي' : 'Professional',
      price: language === 'ar' ? '$29/شهر' : '$29/mo',
      description: language === 'ar' ? 'للمحترفين' : 'For professionals',
      features: [
        language === 'ar' ? 'بحث غير محدود' : 'Unlimited search',
        language === 'ar' ? 'تحليلات متقدمة' : 'Advanced analytics',
        language === 'ar' ? 'دعم فوري' : 'Priority support',
      ],
      gradient: 'from-blue-500 to-purple-600',
      popular: true,
    },
    {
      name: language === 'ar' ? 'المؤسسات' : 'Enterprise',
      price: language === 'ar' ? 'مخصص' : 'Custom',
      description: language === 'ar' ? 'للشركات' : 'For companies',
      features: [
        language === 'ar' ? 'جميع المميزات' : 'All features',
        language === 'ar' ? 'دعم مخصص' : 'Custom support',
        language === 'ar' ? 'تكامل API' : 'API integration',
      ],
      gradient: 'from-green-500 to-teal-600',
      popular: false,
    },
  ]

  const filteredFeatures = allFeatures.filter(
    (feature) => feature.category === categories[activeCategory].id
  )

  return (
    <div
      className={`min-h-screen bg-white relative ${language === 'ar' ? 'font-arabic' : 'font-english'}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <Navbar activeMode="application" activePage="features" />

      {/* Hero Section with Interactive Feature Showcase */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-blue-900">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'مميزات استثنائية' : 'Exceptional Features'}
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                {language === 'ar' ? 'تقنيات متطورة لمستقبل الرياضة' : 'Advanced Technology for Sports Future'}
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-white mb-12 max-w-4xl mx-auto leading-relaxed mt-10">
              {language === 'ar'
                ? 'اكتشف مجموعة شاملة من الأدوات والتقنيات المتطورة التي تجعل TF1 المنصة الأولى عالمياً للتوظيف الرياضي'
                : "Discover a comprehensive suite of advanced tools and technologies that make TF1 the world's #1 sports recruitment platform"}
            </p>
          </motion.div>

          {/* Interactive Feature Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Feature Display */}
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-700"
            >
              <div
                className={`w-16 h-16 bg-gradient-to-r ${featuresShowcase[activeFeature].gradient} rounded-2xl flex items-center justify-center mb-6`}
              >
                {(() => {
                  const IconComponent = featuresShowcase[activeFeature].icon
                  return <IconComponent className="w-8 h-8 text-white" />
                })()}
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                {featuresShowcase[activeFeature].title}
              </h3>

              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                {featuresShowcase[activeFeature].description}
              </p>

              <div className="space-y-3">
                {featuresShowcase[activeFeature].features.map(
                  (feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-gray-200">{feature}</span>
                    </div>
                  )
                )}
              </div>
            </motion.div>


            {/* Right - Controls */}
            <div className="space-y-6">
              {/* Carousel Controls */}
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                  {language === 'ar' ? 'استكشف المميزات' : 'Explore Features'}
                </h3>

                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      setActiveFeature(
                        (prev) =>
                          (prev - 1 + featuresShowcase.length) %
                          featuresShowcase.length
                      )
                    }
                    className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center border border-gray-700 hover:border-blue-500 transition-colors duration-200"
                  >
                    <ChevronLeft className="w-4 h-4 text-white" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center border border-gray-700 hover:border-blue-500 transition-colors duration-200"
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 text-white" />
                    ) : (
                      <PlayCircle className="w-4 h-4 text-white" />
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      setActiveFeature(
                        (prev) => (prev + 1) % featuresShowcase.length
                      )
                    }
                    className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center border border-gray-700 hover:border-blue-500 transition-colors duration-200"
                  >
                    <ChevronRight className="w-4 h-4 text-white" />
                  </motion.button>
                </div>
              </div>

              {/* Feature Navigation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {featuresShowcase.map((feature, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setActiveFeature(index)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all duration-300 ${
                      activeFeature === index
                        ? 'border-blue-500 bg-gray-800 shadow-lg'
                        : 'border-gray-700 bg-gray-800 hover:border-gray-600 hover:shadow-md'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          activeFeature === index
                            ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white'
                            : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        <feature.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-200">
                          {feature.title}
                        </h4>
                        <div
                          className={`w-full bg-gray-700 rounded-full h-1 mt-2 ${
                            activeFeature === index ? 'block' : 'hidden'
                          }`}
                        >
                          <motion.div
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-1 rounded-full"
                            initial={{ width: 0 }}
                            animate={{
                              width:
                                activeFeature === index && isPlaying
                                  ? '100%'
                                  : '0%',
                            }}
                            transition={{ duration: 4 }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

             {/* Quick Action */}
<motion.div
  className="bg-gradient-to-r from-blue-500 to-green-600 rounded-2xl p-6 text-white"
  whileHover={{ scale: 1.02 }}
>
  <h4 className="text-lg font-semibold mb-2 text-center">
    {language === 'ar' ? 'جرب الآن مجاناً' : 'Try Now for Free'}
  </h4>
  <p className="text-blue-100 text-sm mb-4 text-center">
    {language === 'ar'
      ? 'ابدأ رحلتك مع جميع هذه المميزات'
      : 'Start your journey with all these features'}
  </p>
  <div className="flex justify-center">
    <Link href="/register">
      <Button
        size="lg"
        className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
      >
        {language === 'ar' ? 'ابدأ الآن' : 'Get Started'}
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </Link>
  </div>
</motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Categories Section */}
      <section className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
              {language === 'ar' ? 'فئات المميزات' : 'Feature Categories'}
            </h2>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((category, index) => (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveCategory(index)}
                  className={`px-6 py-4 rounded-2xl border-2 transition-all duration-300 ${
                    activeCategory === index
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center gap-3">
                    <category.icon className="w-5 h-5" />
                    <span className="font-semibold">{category.name}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Active Category Features */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.6 }}
            >
              {/* Category Header */}
              <div
                className={`bg-gradient-to-r ${categories[activeCategory].color} rounded-3xl p-8 mb-12 text-white text-center`}
              >
                {(() => {
                  const IconComponent = categories[activeCategory].icon
                  return <IconComponent className="w-16 h-16 mx-auto mb-4" />
                })()}
                <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                  {categories[activeCategory].name}
                </h3>
                <p className="text-white/90 text-lg max-w-2xl mx-auto">
                  {categories[activeCategory].description}
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 group"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-6 h-6 text-gray-600" />
                    </div>

                    <h4 className="text-xl font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h4>

                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {feature.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {feature.benefits.map((benefit, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                {language === 'ar'
                  ? 'المواصفات التقنية'
                  : 'Technical Specifications'}
              </span>
            </h2>
            <p className="text-xl text-white max-w-3xl mx-auto">
              {language === 'ar'
                ? 'بنية تقنية متقدمة تضمن الأداء والموثوقية'
                : 'Advanced technical architecture ensuring performance and reliability'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {technicalSpecs.map((spec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-800 rounded-2xl p-6 text-center hover:bg-gray-700 transition-colors duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <spec.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{spec.title}</h3>
                <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                  {spec.description}
                </p>
                <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {spec.stats}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      

      {/* Final CTA */}
      <section className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-green-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              {language === 'ar'
                ? 'جاهز لتجربة المستقبل؟'
                : 'Ready to Experience the Future?'}
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {language === 'ar'
                ? 'انضم إلى آلاف المحترفين الذين اختاروا TF1 لتطوير مسيرتهم المهنية'
                : 'Join thousands of professionals who chose TF1 to advance their careers'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Rocket className="w-5 h-5 mr-2" />
                    {language === 'ar' ? 'ابدأ مجاناً' : 'Start Free Trial'}
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
              
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-4 py-2 rounded-lg text-lg font-bold inline-block mb-4">
                TF1
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                {language === 'ar'
                  ? 'منصة الرياضة الأولى عالمياً لربط المواهب بالفرص'
                  : "The world's #1 sports platform connecting talent with opportunities"}
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">
                {language === 'ar' ? 'روابط سريعة' : 'Quick Links'}
              </h4>
              <div className="space-y-2">
                {['Home', 'Jobs', 'About', 'Features', 'Contact'].map(
                  (link) => (
                    <Link
                      key={link}
                      href={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
                      className="block text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {language === 'ar'
                        ? {
                            Home: 'الرئيسية',
                            Jobs: 'الوظائف',
                            About: 'عنا',
                            Features: 'المميزات',
                            Contact: 'تواصل',
                            blog: 'المدونة',
                          }[link]
                        : link}
                    </Link>
                  )
                )}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">
                {language === 'ar' ? 'الدعم' : 'Support'}
              </h4>
              <div className="space-y-2">
                <Link
                  href="/help-center"
                  className="block text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {language === 'ar' ? 'مركز المساعدة' : 'Help Center'}
                </Link>
                <Link
                  href="/faq"
                  className="block text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {language === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}
                </Link>
                <Link
                  href="/terms"
                  className="block text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {language === 'ar' ? 'الشروط والأحكام' : 'Terms of Service'}
                </Link>
                <Link
                  href="/privacy"
                  className="block text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">
                {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
              </h4>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5" />
                  <span className="text-sm">hello@TF1.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              {language === 'ar'
                ? '© 2025 منصة TF1. جميع الحقوق محفوظة'
                : '© 2025 TF1 Platform. All rights reserved'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
