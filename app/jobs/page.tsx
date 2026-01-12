'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'
import { RecentJobs } from '@/components/recent-jobs'
import Link from 'next/link'
import {
  Briefcase,
  Users,
  TrendingUp,
  Globe,
  Star,
  Award,
  Target,
  Zap,
  MapPin,
  Shield,
  Heart,
  Sparkles,
  ArrowRight,
  Building,
  UserCheck,
  Search,
  Phone,
  Mail,
} from 'lucide-react'

interface MagicOrb {
  id: string
  x: number
  y: number
  size: number
  color: string
  opacity: number
  speed: number
}

export default function JobsPage() {
  const { language } = useLanguage()
  const [magicOrbs, setMagicOrbs] = useState<MagicOrb[]>([])
  const [activeTab, setActiveTab] = useState<'seekers' | 'employers'>('seekers')

  // Magic orbs animation - using predetermined values to avoid hydration errors
  useEffect(() => {
    const colors = ['#3B82F6', '#10B981', '#60A5FA', '#34D399']
    const predefinedValues = [
      { x: 0.1, y: 0.2, size: 45, colorIndex: 0, opacity: 0.15, speed: 0.8 },
      { x: 0.85, y: 0.15, size: 35, colorIndex: 1, opacity: 0.12, speed: 1.2 },
      { x: 0.3, y: 0.8, size: 55, colorIndex: 2, opacity: 0.18, speed: 0.6 },
      { x: 0.7, y: 0.6, size: 40, colorIndex: 3, opacity: 0.14, speed: 1.0 },
      { x: 0.5, y: 0.3, size: 65, colorIndex: 0, opacity: 0.16, speed: 0.9 },
      { x: 0.2, y: 0.9, size: 30, colorIndex: 1, opacity: 0.11, speed: 1.1 },
      { x: 0.9, y: 0.4, size: 50, colorIndex: 2, opacity: 0.17, speed: 0.7 },
      { x: 0.15, y: 0.7, size: 42, colorIndex: 3, opacity: 0.13, speed: 1.3 },
    ]

    const createOrbs = () => {
      if (typeof window === 'undefined') return
      const newOrbs: MagicOrb[] = predefinedValues.map((preset, i) => ({
        id: i.toString(),
        x: preset.x * window.innerWidth,
        y: preset.y * window.innerHeight,
        size: preset.size,
        color: colors[preset.colorIndex],
        opacity: preset.opacity,
        speed: preset.speed,
      }))
      setMagicOrbs(newOrbs)
    }

    createOrbs()

    const animateOrbs = () => {
      setMagicOrbs((prev) =>
        prev.map((orb) => {
          const newY = orb.y - orb.speed
          return {
            ...orb,
            y:
              newY < -100
                ? typeof window !== 'undefined'
                  ? window.innerHeight + 100
                  : 800
                : newY,
            x: orb.x + Math.sin(orb.y * 0.01) * 1,
          }
        })
      )
    }

    const interval = setInterval(animateOrbs, 50) // Smoother animation
    return () => clearInterval(interval)
  }, [])

  const jobSeekerFeatures = [
    {
      icon: Search,
      title: language === 'ar' ? 'البحث الذكي' : 'Smart Search',
      description:
        language === 'ar'
          ? 'ابحث عن الوظائف المثالية باستخدام فلاتر متقدمة ومحرك بحث ذكي'
          : 'Find perfect jobs using advanced filters and intelligent search engine',
    },
    {
      icon: MapPin,
      title: language === 'ar' ? 'فرص عالمية' : 'Global Opportunities',
      description:
        language === 'ar'
          ? 'اكتشف فرص عمل في جميع أنحاء العالم مع كبرى الأندية والمؤسسات الرياضية'
          : 'Discover job opportunities worldwide with top sports clubs and organizations',
    },
    {
      icon: TrendingUp,
      title: language === 'ar' ? 'تطوير المهارات' : 'Skill Development',
      description:
        language === 'ar'
          ? 'احصل على دورات تدريبية وورش عمل لتطوير مهاراتك المهنية'
          : 'Get training courses and workshops to develop your professional skills',
    },
    {
      icon: UserCheck,
      title: language === 'ar' ? 'ملف شخصي مميز' : 'Professional Profile',
      description:
        language === 'ar'
          ? 'اعرض مهاراتك وخبراتك بطريقة احترافية تجذب أصحاب العمل'
          : 'Showcase your skills and experience professionally to attract employers',
    },
  ]

  const employerFeatures = [
    {
      icon: Users,
      title: language === 'ar' ? 'مواهب متميزة' : 'Top Talent',
      description:
        language === 'ar'
          ? 'اعثر على أفضل المواهب الرياضية والمهنية من جميع أنحاء العالم'
          : 'Find the best sports and professional talent from around the world',
    },
    {
      icon: Target,
      title: language === 'ar' ? 'توظيف دقيق' : 'Precise Hiring',
      description:
        language === 'ar'
          ? 'استخدم أدوات التوظيف المتقدمة للعثور على المرشحين المثاليين'
          : 'Use advanced hiring tools to find the perfect candidates',
    },
    {
      icon: Shield,
      title: language === 'ar' ? 'فحص موثق' : 'Verified Screening',
      description:
        language === 'ar'
          ? 'جميع المرشحين مفحوصون ومؤكدون لضمان الجودة والمصداقية'
          : 'All candidates are screened and verified for quality and credibility',
    },
    {
      icon: Zap,
      title: language === 'ar' ? 'توظيف سريع' : 'Fast Hiring',
      description:
        language === 'ar'
          ? 'عملية توظيف مبسطة وسريعة توفر الوقت والجهد'
          : 'Streamlined and fast hiring process that saves time and effort',
    },
  ]

  const jobCategories = [
    {
      icon: '⚽',
      title: language === 'ar' ? 'كرة القدم' : 'Football',
      count: '2,400+',
      color: 'from-green-500 to-emerald-600',
    },
    {
      icon: '🏀',
      title: language === 'ar' ? 'كرة السلة' : 'Basketball',
      count: '1,800+',
      color: 'from-orange-500 to-red-600',
    },
    {
      icon: '🎾',
      title: language === 'ar' ? 'التنس' : 'Tennis',
      count: '950+',
      color: 'from-yellow-500 to-orange-600',
    },
    {
      icon: '🏊',
      title: language === 'ar' ? 'السباحة' : 'Swimming',
      count: '720+',
      color: 'from-blue-500 to-cyan-600',
    },
    {
      icon: '🏋️',
      title: language === 'ar' ? 'اللياقة البدنية' : 'Fitness',
      count: '1,200+',
      color: 'from-purple-500 to-indigo-600',
    },
    {
      icon: '🏃',
      title: language === 'ar' ? 'ألعاب القوى' : 'Athletics',
      count: '890+',
      color: 'from-pink-500 to-rose-600',
    },
  ]

  const stats = [
    {
      number: '50,000+',
      label: language === 'ar' ? 'فرصة عمل' : 'Job Opportunities',
      icon: Briefcase,
    },
    {
      number: '15,000+',
      label: language === 'ar' ? 'صاحب عمل' : 'Employers',
      icon: Building,
    },
    {
      number: '200,000+',
      label: language === 'ar' ? 'باحث عن عمل' : 'Job Seekers',
      icon: Users,
    },
    {
      number: '95%',
      label: language === 'ar' ? 'معدل النجاح' : 'Success Rate',
      icon: Award,
    },
  ]

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden ${language === 'ar' ? 'font-arabic' : 'font-english'}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        {/* Magic Orbs */}
        <div className="absolute inset-0">
          {magicOrbs.map((orb) => (
            <motion.div
              key={orb.id}
              className="absolute rounded-full filter blur-sm"
              style={{
                x: orb.x,
                y: orb.y,
                width: orb.size,
                height: orb.size,
                backgroundColor: orb.color,
                opacity: orb.opacity * 0.1,
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [
                  orb.opacity * 0.1,
                  orb.opacity * 0.2,
                  orb.opacity * 0.1,
                ],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          {Array.from({ length: 15 }).map((_, i) => {
            const predefinedSizes = [
              25, 35, 28, 42, 30, 38, 33, 40, 26, 45, 32, 37, 29, 41, 34,
            ]
            return (
              <motion.div
                key={i}
                className="absolute text-gray-400/30"
                style={{
                  left: `${10 + i * 6}%`,
                  top: `${10 + i * 5}%`,
                  fontSize: `${predefinedSizes[i]}px`,
                }}
                animate={{
                  y: [0, -30, 0],
                  rotate: [0, 180, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 8 + i * 0.5,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  delay: i * 0.3,
                }}
              >
                {
                  ['⚽', '🏀', '🎾', '🏊', '🏋️', '🏃', '⛳', '🏸', '🏐', '⚾'][
                    i % 10
                  ]
                }
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 bg-gradient-to-br from-white via-blue-50 to-purple-50">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="mb-8"
            >
              <div className="inline-flex items-center bg-gradient-to-r from-blue-50 to-green-50 rounded-full px-6 py-3 mb-6 border border-blue-100">
                <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
                <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  {language === 'ar'
                    ? 'منصة الوظائف الرياضية الأولى'
                    : '#1 Sports Job Platform'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                  {language === 'ar'
                    ? 'ابحث عن وظيفة أحلامك '
                    : 'Find Your Dream Job'}
                </span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                {language === 'ar'
                  ? 'ابدأ رحلتك المهنية عبر منصة تجمع وظائف الرياضة في المملكة تماشيًا مع رؤية 2030'
                  : "Start your professional journey through a platform that brings together sports-related jobs in the Kingdom, in line with Vision 2030."}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/register">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-green-500 text-white hover:from-blue-700 hover:to-green-600 px-8 py-4 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2"
                    >
                      <Search className="w-5 h-5" />
                      {language === 'ar' ? 'ابدأ البحث' : 'Start Searching'}
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300"
                  >
                    {language === 'ar' ? 'للشركات' : 'For Employers'}
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/jobs/cv-builder">
                    <Button
                      size="lg"
                      className="bg-purple-600 text-white hover:bg-purple-700 px-8 py-4 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2"
                    >
                      <Sparkles className="w-5 h-5" />
                      {language === 'ar' ? 'أنشئ سيرتك الذاتية' : 'Build Your CV'}
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-16"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white rounded-2xl p-4 sm:p-6 text-center hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                  </div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-1">
                    {stat.number}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Job Center Section (Moved & Renamed) */}
        <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-100 to-transparent rounded-full opacity-40 blur-3xl -ml-48 -mt-48"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-100 to-transparent rounded-full opacity-40 blur-3xl -mr-48 -mb-48"></div>

          <div className="max-w-7xl mx-auto relative z-10">
            {/* Official Notice Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-12 bg-blue-50 border border-blue-100 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto text-center"
            >
               <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-blue-900 mb-2">
                      {language === 'ar' ? 'تنبيه للجهات الرياضية والشركات' : 'Notice for Sports Entities and Companies'}
                    </h3>
                    <p className="text-blue-700 leading-relaxed max-w-2xl mx-auto">
                      {language === 'ar' 
                        ? 'هذا القسم مخصص لإدارة واستقطاب الكفاءات الرياضية والطبية والإدارية من خلال نشر الوظائف واستقبال طلبات المتقدمين بطريقة احترافية ومنظمة عبر منصتنا.'
                        : 'This section is dedicated to managing and attracting sports, medical, and administrative talents by posting jobs and receiving applications professionally through our platform.'}
                    </p>
                  </div>
               </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                  {language === 'ar'
                    ? 'مركز التوظيف — TF1 Job Center'
                    : 'TF1 Job Center'}
                </span>
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                {language === 'ar'
                  ? 'يمكنك هنا إدارة ونشر الوظائف واستقبال طلبات الكفاءات في القطاع الرياضي'
                  : 'Manage and post jobs, and receive applications from talents in the sports sector'}
              </p>
            </motion.div>

            <RecentJobs />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center mt-12"
            >
              <Link href="/browse-jobs">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  {language === 'ar' ? 'تصفح جميع الوظائف' : 'View All Jobs'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Features Toggle Section */}
        <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100 to-transparent rounded-full opacity-30 blur-3xl -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-100 to-transparent rounded-full opacity-30 blur-3xl -ml-48 -mb-48"></div>

          <div className="max-w-6xl mx-auto relative z-10">
            {/* Tab Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center mb-16"
            >
              <div className="bg-white rounded-2xl p-2 inline-flex shadow-lg border border-gray-100 flex-col sm:flex-row w-full sm:w-auto">
                <button
                  onClick={() => setActiveTab('seekers')}
                  className={`px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base ${
                    activeTab === 'seekers'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {language === 'ar' ? 'الباحثون عن عمل' : 'Job Seekers'}
                </button>
                <button
                  onClick={() => setActiveTab('employers')}
                  className={`px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base ${
                    activeTab === 'employers'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {language === 'ar' ? 'أصحاب العمل' : 'Employers'}
                </button>
              </div>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
            >
              {(activeTab === 'seekers'
                ? jobSeekerFeatures
                : employerFeatures
              ).map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className={`bg-white rounded-3xl p-6 lg:p-8 transition-all duration-300 group shadow-md hover:shadow-2xl border ${
                    activeTab === 'employers'
                      ? 'border-green-100 hover:border-green-300'
                      : 'border-blue-100 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-12 h-12 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 ${
                          activeTab === 'employers'
                            ? 'bg-gradient-to-br from-green-100 to-emerald-100'
                            : 'bg-gradient-to-br from-blue-100 to-purple-100'
                        }`}
                      >
                        <feature.icon
                          className={`w-6 h-6 lg:w-8 lg:h-8 ${
                            activeTab === 'employers'
                              ? 'text-green-600'
                              : 'text-blue-600'
                          }`}
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Job Categories */}
        <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-green-50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                  {language === 'ar'
                    ? 'اكتشف الفرص في تخصصك'
                    : 'Explore Opportunities by Sport'}
                </span>
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                {language === 'ar'
                  ? 'تصفح آلاف الوظائف في مختلف الرياضات والتخصصات'
                  : 'Browse thousands of jobs across different sports and specializations'}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobCategories.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -8 }}
                  className={`bg-gradient-to-r ${category.color} rounded-3xl p-6 sm:p-8 text-white cursor-pointer hover:shadow-2xl transition-all duration-300 relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                  <div className="relative">
                    <div className="text-5xl mb-4">{category.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                    <div className="text-white/90 text-3xl font-bold">
                      {category.count}
                    </div>
                    <div className="text-white/80 text-sm font-medium">
                      {language === 'ar' ? 'فرصة متاحة' : 'opportunities'}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-white to-pink-50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  {language === 'ar'
                    ? 'لماذا تختار TF1؟'
                    : 'Why Choose TF1?'}
                </span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  icon: Globe,
                  title: language === 'ar' ? 'شبكة عالمية' : 'Global Network',
                  description:
                    language === 'ar'
                      ? 'اتصال مع أكثر من 15,000 منظمة رياضية حول العالم'
                      : 'Connected with 15,000+ sports organizations worldwide',
                  gradient: 'from-blue-500 to-cyan-500',
                },
                {
                  icon: Star,
                  title: language === 'ar' ? 'جودة مضمونة' : 'Quality Assured',
                  description:
                    language === 'ar'
                      ? 'جميع الفرص مفحوصة ومؤكدة من قبل خبراء متخصصين'
                      : 'All opportunities vetted and verified by expert specialists',
                  gradient: 'from-purple-500 to-pink-500',
                },
                {
                  icon: Heart,
                  title: language === 'ar' ? 'دعم مستمر' : 'Ongoing Support',
                  description:
                    language === 'ar'
                      ? 'فريق دعم متخصص لمساعدتك في كل خطوة من رحلتك المهنية'
                      : 'Dedicated support team to help you every step of your career journey',
                  gradient: 'from-green-500 to-emerald-500',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ y: -10 }}
                  className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 text-center hover:shadow-2xl transition-all duration-300 group"
                >
                  <div
                    className={`w-20 h-20 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}
                  >
                    <item.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Premium CTA Section */}
        <section className="py-20 lg:py-32 px-4 sm:px-6 bg-gradient-to-br from-blue-500 via-purple-500 to-green-400 relative overflow-hidden">
          <div className="max-w-5xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                {language === 'ar'
                  ? 'ابدأ رحلتك المهنية اليوم!'
                  : 'Start Your Professional Journey Today!'}
              </h2>
              <p className="text-lg sm:text-xl text-white/95 mb-12 max-w-3xl mx-auto leading-relaxed font-semibold">
                {language === 'ar'
                  ? 'انضم إلى آلاف المحترفين الذين وجدوا فرص أحلامهم من خلال منصتنا'
                  : 'Join thousands of professionals who found their dream opportunities through our platform'}
              </p>

              {/* CTA Button */}
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="mb-16"
              >
                <Link href="/register">
                  <Button className="bg-white text-blue-600 hover:bg-gray-50 px-14 py-5 text-xl font-black rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300">
                    ✨ {language === 'ar' ? 'اختم التسجيل الآن' : 'Sign Up Now'} →
                  </Button>
                </Link>
              </motion.div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-6 sm:gap-10 max-w-3xl mx-auto">
                {[
                  {
                    number: '50K+',
                    label: language === 'ar' ? 'وظيفة' : 'Jobs',
                  },
                  {
                    number: '200K+',
                    label: language === 'ar' ? 'مستخدم' : 'Users',
                  },
                  {
                    number: '95%',
                    label: language === 'ar' ? 'نجاح' : 'Success',
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                  >
                    <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-2">
                      {stat.number}
                    </div>
                    <div className="text-base sm:text-lg text-white/90 font-bold">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </div>

    </div>
  )
}
