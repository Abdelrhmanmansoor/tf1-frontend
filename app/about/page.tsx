'use client'

import { useState, useEffect } from 'react'
import { motion, Variants } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import {
  Users,
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
  Sparkles,
  TrendingUp,
  Rocket,
  Lightbulb,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react'

export default function AboutPage() {
  const { language } = useLanguage()
  const [currentSection, setCurrentSection] = useState(0)

  // Intersection Observer for section tracking
  useEffect(() => {
    const sections = document.querySelectorAll('.section-marker')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(
              entry.target.getAttribute('data-section') || '0'
            )
            setCurrentSection(index)
          }
        })
      },
      { threshold: 0.3 }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const heroVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: 'easeOut',
        staggerChildren: 0.2,
      },
    },
  }

  const childVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8 },
    },
  }

  const sections = [
    { name: language === 'ar' ? 'البداية' : 'Beginning', color: 'bg-blue-500' },
    { name: language === 'ar' ? 'القصة' : 'Story', color: 'bg-green-500' },
    { name: language === 'ar' ? 'القيم' : 'Values', color: 'bg-purple-500' },
    { name: language === 'ar' ? 'الفريق' : 'Team', color: 'bg-orange-500' },
  ]

  const companyStats = [
    {
      icon: Users,
      number: '500K+',
      label: language === 'ar' ? 'مستخدم نشط' : 'Active Users',
      description: language === 'ar' ? 'حول العالم' : 'Worldwide',
      gradient: 'from-blue-400 to-blue-600',
    },
    {
      icon: Trophy,
      number: '50K+',
      label: language === 'ar' ? 'نجاح مهني' : 'Success Stories',
      description: language === 'ar' ? 'تحقق يومياً' : 'Daily Achievements',
      gradient: 'from-green-400 to-green-600',
    },
    {
      icon: Globe,
      number: '200+',
      label: language === 'ar' ? 'دولة' : 'Countries',
      description: language === 'ar' ? 'تغطية عالمية' : 'Global Coverage',
      gradient: 'from-purple-400 to-purple-600',
    },
    {
      icon: Star,
      number: '98%',
      label: language === 'ar' ? 'رضا العملاء' : 'Satisfaction',
      description: language === 'ar' ? 'تقييم ممتاز' : 'Excellent Rating',
      gradient: 'from-orange-400 to-orange-600',
    },
  ]

  const journeySteps = [
  {
    year: '2024',
    title: language === 'ar' ? 'البداية' : 'The Beginning',
    description:
      language === 'ar'
        ? 'انطلقت فكرة TF1 لإنشاء منصة تجمع وظائف الرياضة في المملكة'
        : 'TF1 began as an idea to unify sports job opportunities in Saudi Arabia',
    icon: Lightbulb,
    position: 'left',
  },
  {
    year: '2024',
    title: language === 'ar' ? 'تطوير المنصة' : 'Platform Development',
    description:
      language === 'ar'
        ? 'بدء بناء المنصة وتحسين التجربة لتناسب احتياجات الباحثين والجهات الرياضية'
        : 'Started building the platform and refining it for talents and sports entities',
    icon: Rocket,
    position: 'right',
  },
  {
    year: '2025',
    title: language === 'ar' ? 'الإطلاق الأول' : 'First Launch',
    description:
      language === 'ar'
        ? 'إطلاق الإصدار الأول من TF1 وبدء استقبال الطلبات والوظائف'
        : 'Released the first version of TF1 and started receiving jobs and applications',
    icon: TrendingUp,
    position: 'left',
  },
  {
    year: '2025',
    title: language === 'ar' ? 'دعم رؤية 2030' : 'Supporting Vision 2030',
    description:
      language === 'ar'
        ? 'مواءمة خدمات المنصة مع أهداف تنمية القطاع الرياضي ضمن رؤية السعودية 2030'
        : 'Aligned the platform with Saudi Vision 2030 sports sector development goals',
    icon: Building,
    position: 'right',
  },
  {
    year: '2025',
    title: language === 'ar' ? 'صناعة الفرص' : 'Creating Opportunities',
    description:
      language === 'ar'
        ? 'العمل على ربط المواهب بالفرص وتسهيل التوظيف الرياضي في المملكة'
        : 'Working on connecting talents with opportunities across the Kingdom',
    icon: Trophy,
    position: 'left',
  },
]

  const coreValues = [
    {
      icon: Heart,
      title: language === 'ar' ? 'الشغف' : 'Passion',
      description:
        language === 'ar' ? 'نعيش وننفس الرياضة' : 'We live and breathe sports',
      color: 'text-red-500',
      bg: 'bg-red-50',
      pattern: 'hearts',
    },
    {
      icon: Shield,
      title: language === 'ar' ? 'الثقة' : 'Trust',
      description:
        language === 'ar'
          ? 'أساس كل علاقة نبنيها'
          : 'Foundation of every relationship',
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      pattern: 'shields',
    },
    {
      icon: Zap,
      title: language === 'ar' ? 'الابتكار' : 'Innovation',
      description:
        language === 'ar'
          ? 'نبتكر الحلول المستقبلية'
          : "Creating tomorrow's solutions",
      color: 'text-yellow-500',
      bg: 'bg-yellow-50',
      pattern: 'lightning',
    },
    {
      icon: Users,
      title: language === 'ar' ? 'المجتمع' : 'Community',
      description:
        language === 'ar' ? 'قوتنا في وحدتنا' : 'Our strength is our unity',
      color: 'text-green-500',
      bg: 'bg-green-50',
      pattern: 'community',
    },
  ]

 const leadership = [
  {
    name: language === 'ar' ? 'تمكين المواهب' : 'Empowering Talent',
    role:
      language === 'ar'
        ? 'هدفنا الأول'
        : 'Primary Goal',
    bio:
      language === 'ar'
        ? 'نساعد الشباب الرياضي في المملكة على الوصول لفرص حقيقية في قطاع الرياضة.'
        : 'We help Saudi sports talents access real opportunities in the industry.',
    achievements:
      language === 'ar'
        ? 'آلاف الفرص المستقبلية'
        : 'Thousands of future opportunities',
    gradient: 'from-blue-500 to-purple-600',
  },
  {
    name:
      language === 'ar'
        ? 'ربط الأندية بالكوادر'
        : 'Connecting Clubs & Talent',
    role:
      language === 'ar'
        ? 'هدفنا الثاني'
        : 'Secondary Goal',
    bio:
      language === 'ar'
        ? 'نوفّر منصة تجمع الأندية والجهات الرياضية مع أفضل الكفاءات بسهولة.'
        : 'A platform that connects sports entities with top talent effortlessly.',
    achievements:
      language === 'ar'
        ? 'نمو سريع في عدد الجهات'
        : 'Rapid growth in registered sports entities',
    gradient: 'from-green-500 to-teal-600',
  },
  {
    name:
      language === 'ar'
        ? 'دعم رؤية 2030'
        : 'Supporting Vision 2030',
    role:
      language === 'ar'
        ? 'هدفنا الثالث'
        : 'Strategic Goal',
    bio:
      language === 'ar'
        ? 'نعمل على تطوير قطاع الرياضة بما يتماشى مع خطط المملكة للتحول الوطني.'
        : 'We support the development of the sports sector aligned with Vision 2030.',
    achievements:
      language === 'ar'
        ? 'مواءمة كاملة مع مستهدفات الرياضة'
        : 'Aligned with national sports transformation goals',
    gradient: 'from-orange-500 to-red-600',
  },
]


  return (
    <div
      className={`min-h-screen bg-white relative ${language === 'ar' ? 'font-arabic' : 'font-english'}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <Navbar activeMode="application" activePage="about" />

      {/* Floating Navigation Dots */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 hidden lg:flex flex-col gap-3">
        {sections.map((section, index) => (
          <motion.div
            key={index}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
              currentSection === index ? section.color : 'bg-gray-300'
            }`}
            whileHover={{ scale: 1.5 }}
            onClick={() => {
              document
                .querySelector(`[data-section="${index}"]`)
                ?.scrollIntoView({ behavior: 'smooth' })
            }}
          />
        ))}
      </div>

      {/* Hero Section with Unique Layout */}
      <section
        className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 section-marker"
        data-section="0"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-start"
          >
            <motion.div variants={childVariants}>
              <span className="inline-flex items-center bg-gradient-to-r from-blue-600 to-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                {language === 'ar'
                  ? 'رحلتنا تبدأ هنا'
                  : 'Our Journey Starts Here'}
              </span>
            </motion.div>

            <motion.h1
              variants={childVariants}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                {language === 'ar' ? 'نحن' : 'We are'} TF1
              </span>
            </motion.h1>

            <motion.p
              variants={childVariants}
              className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              {language === 'ar'
                ? 'منصة توظّف التقنية لتطوير الرياضة وتمكين المواهب في المملكة'
                : 'A smart sports platform unlocking unlimited opportunities for talent.'}
            </motion.p>

            <motion.div
              variants={childVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.div
                whileHover={{ scale: 1.05, rotate: 1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/jobs">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-8 py-4 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    <Briefcase className="w-5 h-5 mr-2" />
                    {language === 'ar' ? 'ابدأ الآن' : 'Get Started'}
                  </Button>
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05, rotate: -1 }}>
              
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative"
          >
            {/* Stats Cards - Grid on mobile, Floating on desktop */}
            <div className="grid grid-cols-2 gap-4 md:gap-6 lg:relative lg:w-full lg:h-[500px] lg:block">
              {companyStats.map((stat, index) => {
                const positions = {
                  0: { top: '10%', left: '15%', rotate: '-8deg' },
                  1: { top: '60%', left: '20%', rotate: '12deg' },
                  2: { top: '20%', left: '65%', rotate: '-5deg' },
                  3: { top: '70%', left: '55%', rotate: '8deg' },
                }
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 1 + index * 0.2,
                      type: 'spring',
                      stiffness: 200,
                    }}
                    whileHover={{
                      scale: 1.1,
                      rotate:
                        index === 0
                          ? 5
                          : index === 1
                            ? -8
                            : index === 2
                              ? 10
                              : -5,
                      zIndex: 10,
                    }}
                    className={`bg-gradient-to-r ${stat.gradient} text-white p-4 sm:p-6 rounded-2xl shadow-2xl cursor-pointer lg:absolute lg:w-[200px]`}
                    style={{
                      top: positions[index as keyof typeof positions].top,
                      left: positions[index as keyof typeof positions].left,
                    }}
                  >
                    <div
                      className="hidden lg:block absolute inset-0"
                      style={{
                        transform: positions[index as keyof typeof positions].rotate,
                      }}
                    ></div>
                    <div className="relative z-10">
                      <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3" />
                      <div className="text-2xl sm:text-3xl font-bold mb-1">
                        {stat.number}
                      </div>
                      <div className="text-xs sm:text-sm opacity-90">
                        {stat.label}
                      </div>
                      <div className="text-xs opacity-75 hidden sm:block">
                        {stat.description}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Journey Timeline - Unique Zigzag Design */}
      <section
        className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-blue-900 section-marker"
        data-section="1"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                {language === 'ar' ? 'رحلة النجاح' : 'Success Journey'}
              </span>
            </h2>
            <p className="text-xl text-white max-w-3xl mx-auto">
              {language === 'ar'
                ? 'من فكرة بسيطة إلى منصة تصنع فرص الرياضة في المملكة.'
                : 'From a simple idea to a platform creating sports opportunities in the Kingdom.'}
            </p>
          </motion.div>

          {/* Zigzag Timeline */}
          <div className="relative">
            {/* Central Line - Hidden on mobile */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-green-500"></div>

            <div className="space-y-12 md:space-y-24">
              {journeySteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    x: step.position === 'left' ? -100 : 100,
                  }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className={`flex items-center flex-col md:flex-row ${step.position === 'right' ? 'md:flex-row-reverse' : ''}`}
                >
                  <div
                    className={`flex-1 w-full ${step.position === 'right' ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}
                  >
                    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <step.icon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-blue-600">
                            {step.year}
                          </div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {step.title}
                          </h3>
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Center Node - Hidden on mobile */}
                  <div className="hidden md:block relative z-10 w-6 h-6 bg-white border-4 border-blue-500 rounded-full"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values - Interactive Cards */}
      <section
        className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 section-marker"
        data-section="2"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {language === 'ar' ? 'قيمنا الأساسية' : 'Core Values'}
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, rotateY: -45 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{
                  rotateY: 10,
                  scale: 1.05,
                  transition: { duration: 0.3 },
                }}
                className={`${value.bg} rounded-3xl p-8 text-center group cursor-pointer relative overflow-hidden`}
                style={{ transformStyle: 'preserve-3d' }}
              >
               

                <div className="relative z-10">
                  <div
                    className={`w-20 h-20 ${value.color.replace('text-', 'bg-')} bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <value.icon className={`w-10 h-10 ${value.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team - Card Stack Effect */}
      <section
        className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-blue-900 text-white section-marker"
        data-section="3"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                {language === 'ar' ? 'أهداف المنصة' : 'Platform Goals'}
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {language === 'ar'
                ? 'بناء مستقبل الرياضة عبر تمكين المواهب وتوسيع الفرص'
                : 'Empowering talents to build the future of sports'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {leadership.map((leader, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 100, rotateX: -30 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.2,
                  type: 'spring',
                  stiffness: 100,
                }}
                whileHover={{
                  y: -20,
                  rotateY: 5,
                  transition: { duration: 0.3 },
                }}
                className="group"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="bg-white text-gray-900 rounded-3xl overflow-hidden shadow-2xl group-hover:shadow-4xl transition-shadow duration-500">
                  {/* Header with Gradient */}
                  <div
                    className={`h-32 bg-gradient-to-r ${leader.gradient} relative`}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    <div className="absolute bottom-4 left-6 right-6">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <Users className="w-10 h-10 text-gray-700" />
                      </div>
                    </div>
                  </div>

                  <div className="p-8 pt-12">
                    <h3 className="text-2xl font-bold mb-2">{leader.name}</h3>
                    <p className="text-blue-600 font-semibold mb-4">
                      {leader.role}
                    </p>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {leader.bio}
                    </p>
                    <div className="bg-gray-50 rounded-2xl p-4">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm font-semibold">
                          {leader.achievements}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA - Unique Split Design */}
      <section className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-green-600">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              {language === 'ar'
                ? 'لنبني المستقبل معاً'
                : "Let's Build the Future Together"}
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              {language === 'ar'
                ? 'انضم إلينا في رحلة تغيير عالم الرياضة وخلق فرص جديدة للجميع'
                : 'Join us in transforming the sports world and creating new opportunities for everyone'}
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold">+966 53 984 7559</p>
                  <p className="text-white/80 text-sm">
                    {language === 'ar' ? 'متاح 24/7' : 'Available 24/7'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold">Support@tf1one.com</p>
                  <p className="text-white/80 text-sm">
                    {language === 'ar' ? 'نرد في دقائق' : 'We reply in minutes'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-3xl p-8 shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {language === 'ar'
                ? 'ابدأ رحلتك اليوم'
                : 'Start Your Journey Today'}
            </h3>

            <div className="space-y-6">
              <motion.div whileHover={{ scale: 1.02 }}>
                <Link href="/register">
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {language === 'ar'
                      ? 'إنشاء حساب مجاني'
                      : 'Create Free Account'}
                  </Button>
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }}>
                <Link href="/jobs">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-4 text-lg font-semibold rounded-2xl transition-all duration-300"
                  >
                    <Briefcase className="w-5 h-5 mr-2" />
                    {language === 'ar'
                      ? 'استكشف الوظائف'
                      : 'Explore Opportunities'}
                  </Button>
                </Link>
              </motion.div>

              <div className="text-center pt-4">
                <p className="text-gray-500 text-sm">
                  {language === 'ar'
                    ? 'انضم لأكثر من 2,000 مستخدم حول المملكة'
                    : 'Join over 2,000 users across the Kingdom'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}