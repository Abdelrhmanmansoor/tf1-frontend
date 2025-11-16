'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'
import { Navbar } from '@/components/navbar'
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
      <Navbar activeMode="application" activePage="jobs" />
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

        {/* Recent Jobs Section */}
        <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-100 to-transparent rounded-full opacity-40 blur-3xl -ml-48 -mt-48"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-100 to-transparent rounded-full opacity-40 blur-3xl -mr-48 -mb-48"></div>

          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                  {language === 'ar'
                    ? 'أحدث الوظائف المتاحة'
                    : 'Latest Job Opportunities'}
                </span>
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                {language === 'ar'
                  ? 'تصفح أحدث 3 وظائف تم إضافتها إلى المنصة'
                  : 'Browse the latest 3 jobs added to our platform'}
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
                    ? 'لماذا تختار SportX؟'
                    : 'Why Choose SportX?'}
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

        {/* CTA Section */}
        <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-6">
                {language === 'ar'
                  ? 'ابدأ رحلتك المهنية اليوم'
                  : 'Start Your Career Journey Today'}
              </h2>
              <p className="text-base sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                {language === 'ar'
                  ? 'انضم إلى آلاف المحترفين الذين وجدوا فرص أحلامهم من خلال منصتنا'
                  : 'Join thousands of professionals who found their dream opportunities through our platform'}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/register">
                    <Button
                      size="lg"
                      className="bg-white text-blue-600 hover:bg-gray-50 px-10 py-6 text-lg font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-2"
                    >
                      <UserCheck className="w-6 h-6" />
                      {language === 'ar' ? 'انضم الآن' : 'Join Now'}
                      <ArrowRight className="w-6 h-6" />
                    </Button>
                  </Link>
                </motion.div>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
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
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-white"
                  >
                    <div className="text-3xl sm:text-4xl font-bold mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm sm:text-base text-white/80">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div>
              <div className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-4 py-2 rounded-lg text-lg font-bold inline-block mb-4">
                SportX
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                {language === 'ar'
                  ? 'منصة الرياضة الأولى في المملكة لربط الجهات الرياضية بموظفين مؤهلين'
                  : "Saudi Arabia’s leading sports jobs platform"}
              </p>
              <div className="flex gap-4">
                <a
  href="https://www.snapchat.com"
  target="_blank"
  rel="noopener noreferrer"
  className="w-10 h-10 bg-gray-800 hover:bg-yellow-400 rounded-lg flex items-center justify-center cursor-pointer transition-colors duration-300"
>
  <svg
    className="w-6 h-6 text-white"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 0c-1.9 0-3.5 1.5-3.5 3.5v.2c-.1.1-.3.1-.4.1-1.3.3-2.3 1.4-2.5 2.7-.2 1.3.3 2.5 1.3 3.3.3.2.4.6.3.9-.4 1.1-1.3 1.8-2.4 1.9-.4 0-.7.3-.7.7v.2c0 .4.3.7.7.8 1.2.3 2.2 1.1 2.7 2.2.1.2.3.4.6.5.8.4 1.6.6 2.5.7.3 0 .6.2.7.4.8 1.2 2.1 2 3.6 2s2.8-.8 3.6-2c.2-.2.4-.4.7-.4.9 0 1.7-.2 2.5-.7.2-.1.5-.3.6-.5.5-1.1 1.5-1.9 2.7-2.2.4-.1.7-.4.7-.8v-.2c0-.4-.3-.7-.7-.7-1.1-.1-2-.8-2.4-1.9-.1-.3 0-.7.3-.9 1-.8 1.5-2 1.3-3.3-.2-1.3-1.2-2.4-2.5-2.7-.1 0-.3-.1-.4-.1v-.2C15.5 1.5 13.9 0 12 0z" />
  </svg>
</a>

                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-400 rounded-lg flex items-center justify-center cursor-pointer transition-colors duration-300"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-lg flex items-center justify-center cursor-pointer transition-colors duration-300"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-700 rounded-lg flex items-center justify-center cursor-pointer transition-colors duration-300"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
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
                            Features: 'المزايا',
                            blog: 'المدونة',
                            Contact: 'تواصل',
                          }[link]
                        : link}
                    </Link>
                  )
                )}
              </div>
            </div>

            {/* Support */}
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

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">
                {language === 'ar' ? 'معلومات التواصل' : 'Contact Info'}
              </h4>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5" />
                  <span className="text-sm">Kingdom of Saudi Arabia</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  <span className="text-sm">+966539847559</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5" />
                  <span className="text-sm">support@tf1one.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              {language === 'ar'
                ? '© 2025 منصة TF1. جميع الحقوق محفوظة.'
                : '© 2025 TF1 Platform. All rights reserved.'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
