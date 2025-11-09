'use client'

import { useState, useEffect } from 'react'
import { motion, Variants } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'
import { Navbar } from '@/components/navbar'
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
      year: '2020',
      title: language === 'ar' ? 'الحلم يبدأ' : 'The Dream Begins',
      description:
        language === 'ar'
          ? 'فكرة بسيطة لتغيير عالم التوظيف الرياضي'
          : 'A simple idea to change sports recruitment',
      icon: Lightbulb,
      position: 'left',
    },
    {
      year: '2021',
      title: language === 'ar' ? 'أول خطوة' : 'First Step',
      description:
        language === 'ar'
          ? 'إطلاق النسخة التجريبية وأول 1000 مستخدم'
          : 'Beta launch with first 1000 users',
      icon: Rocket,
      position: 'right',
    },
    {
      year: '2022',
      title: language === 'ar' ? 'النمو السريع' : 'Rapid Growth',
      description:
        language === 'ar'
          ? 'توسع في 25 دولة و 100,000 مستخدم'
          : 'Expansion to 25 countries & 100k users',
      icon: TrendingUp,
      position: 'left',
    },
    {
      year: '2023',
      title: language === 'ar' ? 'الشراكات الكبرى' : 'Major Partnerships',
      description:
        language === 'ar'
          ? 'شراكات مع أكبر الأندية والمؤسسات'
          : 'Partnerships with major clubs & organizations',
      icon: Building,
      position: 'right',
    },
    {
      year: '2024',
      title: language === 'ar' ? 'القيادة العالمية' : 'Global Leadership',
      description:
        language === 'ar'
          ? 'أصبحنا المنصة الأولى عالمياً'
          : "Became the world's #1 platform",
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
      name: language === 'ar' ? 'أحمد الرياضي' : 'Ahmed Al-Riadi',
      role: language === 'ar' ? 'الرئيس التنفيذي' : 'Chief Executive Officer',
      bio:
        language === 'ar'
          ? 'رائد أعمال رياضي بخبرة 15 عامً في التكنولوجيا والرياضة'
          : 'Sports entrepreneur with 15 years in technology and sports',
      achievements:
        language === 'ar' ? '3 شركات ناشئة ناجحة' : '3 successful startups',
      gradient: 'from-blue-500 to-purple-600',
    },
    {
      name: language === 'ar' ? 'سارة التقنية' : 'Sarah Tech',
      role: language === 'ar' ? 'مديرة التطوير' : 'Chief Technology Officer',
      bio:
        language === 'ar'
          ? 'عبقرية تقنية متخصصة في الذكاء الاصطناعي والبيانات الضخمة'
          : 'Tech genius specializing in AI and big data',
      achievements:
        language === 'ar' ? '20+ براءة اختراع' : '20+ patents filed',
      gradient: 'from-green-500 to-teal-600',
    },
    {
      name: language === 'ar' ? 'محمد المبدع' : 'Mohamed Creative',
      role: language === 'ar' ? 'مدير الإبداع' : 'Chief Creative Officer',
      bio:
        language === 'ar'
          ? 'مصمم مبدع يحول الأفكار إلى تجارب استثنائية'
          : 'Creative designer turning ideas into exceptional experiences',
      achievements: language === 'ar' ? '50+ جائزة تصميم' : '50+ design awards',
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
                {language === 'ar' ? 'نحن' : 'We are'} SportX
              </span>
            </motion.h1>

            <motion.p
              variants={childVariants}
              className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              {language === 'ar'
                ? 'منصة تجمع بين الشغف والتكنولوجيا لتغيير مستقبل الرياضة وخلق فرص لا محدودة للمواهب حول العالم'
                : 'A platform combining passion and technology to change the future of sports and create unlimited opportunities for talents worldwide'}
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
            {/* Stats Cards Floating */}
            <div className="relative w-full h-96 lg:h-[500px]">
              {companyStats.map((stat, index) => (
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
                  className={`absolute bg-gradient-to-r ${stat.gradient} text-white p-6 rounded-2xl shadow-2xl cursor-pointer`}
                  style={{
                    top:
                      index === 0
                        ? '10%'
                        : index === 1
                          ? '60%'
                          : index === 2
                            ? '20%'
                            : '70%',
                    left:
                      index === 0
                        ? '15%'
                        : index === 1
                          ? '20%'
                          : index === 2
                            ? '65%'
                            : '55%',
                    width: '200px',
                    transform:
                      index === 0
                        ? 'rotate(-8deg)'
                        : index === 1
                          ? 'rotate(12deg)'
                          : index === 2
                            ? 'rotate(-5deg)'
                            : 'rotate(8deg)',
                  }}
                >
                  <stat.icon className="w-8 h-8 mb-3" />
                  <div className="text-3xl font-bold mb-1">{stat.number}</div>
                  <div className="text-sm opacity-90">{stat.label}</div>
                  <div className="text-xs opacity-75">{stat.description}</div>
                </motion.div>
              ))}
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
                ? 'من حلم بسيط إلى منصة عالمية تغير حياة الملايين'
                : 'From a simple dream to a global platform changing millions of lives'}
            </p>
          </motion.div>

          {/* Zigzag Timeline */}
          <div className="relative">
            {/* Central Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-green-500"></div>

            <div className="space-y-24">
              {journeySteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    x: step.position === 'left' ? -100 : 100,
                  }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className={`flex items-center ${step.position === 'right' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`flex-1 ${step.position === 'right' ? 'text-right pr-12' : 'text-left pl-12'}`}
                  >
                    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
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

                  {/* Center Node */}
                  <div className="relative z-10 w-6 h-6 bg-white border-4 border-blue-500 rounded-full"></div>
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
                {language === 'ar' ? 'قادة الرؤية' : 'Visionary Leaders'}
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {language === 'ar'
                ? 'الأشخاص الذين يقودون التغيير ويشكلون مستقبل الرياضة'
                : 'The people driving change and shaping the future of sports'}
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
                  <p className="font-semibold">+1 (555) 123-4567</p>
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
                  <p className="font-semibold">hello@sportx.com</p>
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
                    ? 'انضم لأكثر من 500,000 مستخدم حول العالم'
                    : 'Join 500,000+ users worldwide'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div>
              <div className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-4 py-2 rounded-lg text-lg font-bold inline-block mb-4">
                SportX
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                {language === 'ar'
                  ? 'منصة الرياضة الأولى عالمياً لربط المواهب بالفرص'
                  : "The world's #1 sports platform connecting talent with opportunities"}
              </p>
              <div className="flex gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center cursor-pointer transition-colors duration-300"
                  >
                    <div className="w-5 h-5 bg-current rounded"></div>
                  </div>
                ))}
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
              <div className="space-y-2 text-gray-400">
                <p>{language === 'ar' ? 'مركز المساعدة' : 'Help Center'}</p>
                <p>{language === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}</p>
                <p>
                  {language === 'ar' ? 'الشروط والأحكام' : 'Terms of Service'}
                </p>
                <p>{language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</p>
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
                  <span className="text-sm">123 Sports Avenue, Tech City</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5" />
                  <span className="text-sm">hello@sportx.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              {language === 'ar'
                ? '© 2025 منصة SportX. جميع الحقوق محفوظة'
                : '© 2025 SportX Platform. All rights reserved'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}