'use client'

import { useState, useRef, useEffect } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Users,
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
import { Button } from '@/components/ui/button'

import { Navbar } from './navbar'
import { Footer } from './footer'
import { ArabicSwitcher } from './arabic-switcher'
import { EnglishSwitcher } from './english-switcher'
import { RecentJobs } from './recent-jobs'
import { TopRatedPlayers } from './rating/TopRatedPlayers'
import { PartnersMarquee } from './partners-marquee'
import { StatsSection } from './stats-section'
import { JobsAnnouncements } from './jobs-announcements'
import { JobsTickerBar } from './landing/JobsTickerBar'
import { useLanguage } from '@/contexts/language-context'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

type SwitcherMode = 'application' | 'recruitment'

interface FootballWipeTextProps {
  children: React.ReactNode
  transitionKey: string
  className?: string
}

function FootballWipeText({
  children,
  transitionKey,
  className = '',
}: FootballWipeTextProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={transitionKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="relative"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export function LandingPage() {
  const [mode, setMode] = useState<SwitcherMode>('application')
  const [isDragging, setIsDragging] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const { t, language } = useLanguage()
  const carouselRef = useRef<HTMLDivElement>(null)
  const autoScrollIntervalRef = useRef<number | null>(null)
  const touchStartX = useRef(0)
  const [newsIndex, setNewsIndex] = useState(0)
  
  const newsMessagesAr = [
    { title: '✓ ابدأ رحلتك الرياضية اليوم!', desc: 'انضم إلى آلاف المحترفين الذين وثقوا بنا' },
    { title: '🏆 اكتشف أفضل الفرص', desc: 'وظائف رياضية في أفضل الأكاديميات والأندية' },
    { title: '🚀 اتصل بأفضل المواهب', desc: 'نساعد الشركات في إيجاد أفضل كفاءات المجال الرياضي' },
  ]
  
  const newsMessagesEn = [
    { title: '✓ Start Your Sports Journey Today!', desc: 'Join thousands of professionals who trust us' },
    { title: '🏆 Discover Best Opportunities', desc: 'Sports jobs in top academies and clubs' },
    { title: '🚀 Connect with Top Talent', desc: 'We help companies find the best sports professionals' },
  ]

  const newsMessages = language === 'ar' ? newsMessagesAr : newsMessagesEn

  useEffect(() => {
    const newsInterval = window.setInterval(() => {
      setNewsIndex((prev) => (prev + 1) % newsMessages.length)
    }, 8000)
    return () => window.clearInterval(newsInterval)
  }, [newsMessages.length])

  const bannerImage = {
    url: '/banners/banner-hero-saudi.png',
    alt: language === 'ar' ? 'معاً نصنع نجاحك خطوة بخطوة' : 'Together We Build Your Success Step by Step',
  }

  const sportSpecializations = [
    {
      id: 1,
      nameAr: 'كرة القدم',
      nameEn: 'Football',
      icon: '⚽',
      jobs: 2400,
      gradient: 'from-emerald-400 to-green-600',
    },
    {
      id: 2,
      nameAr: 'كرة السلة',
      nameEn: 'Basketball',
      icon: '🏀',
      jobs: 1800,
      gradient: 'from-orange-400 to-red-600',
    },
    {
      id: 3,
      nameAr: 'التنس',
      nameEn: 'Tennis',
      icon: '🎾',
      jobs: 950,
      gradient: 'from-yellow-400 to-orange-500',
    },
    {
      id: 4,
      nameAr: 'ألعاب القوى',
      nameEn: 'Athletics',
      icon: '🏃',
      jobs: 890,
      gradient: 'from-pink-400 to-red-500',
    },
    {
      id: 5,
      nameAr: 'اللياقة البدنية',
      nameEn: 'Fitness',
      icon: '🏋️',
      jobs: 1200,
      gradient: 'from-purple-400 to-blue-600',
    },
    {
      id: 6,
      nameAr: 'السباحة',
      nameEn: 'Swimming',
      icon: '🏊',
      jobs: 720,
      gradient: 'from-cyan-400 to-blue-500',
    },
  ]

  const categories = [
    {
      id: 1,
      name: t('player'),
      Icon: Users,
      nameAr: 'اللاعبين',
      nameEn: 'Players',
    },
    {
      id: 2,
      name: t('coach'),
      Icon: GraduationCap,
      nameAr: 'المدربين',
      nameEn: 'Coaches',
    },
    { id: 3, name: t('club'), Icon: Building2, nameAr: 'الاندية', nameEn: 'Clubs' },
    {
      id: 4,
      name: t('Support Roles'),
      Icon: Briefcase,
      nameAr: 'الوظائف المساندة ',
      nameEn: 'Support Roles',
    },
    {
      id: 5,
      name: t('naturalField'),
      Icon: Heart,
      nameAr: 'أخصائين العلاج الطبيعي ',
      nameEn: 'Physical Therapists',
    },
    {
      id: 6,
      name: t('Sports physicans'),
      Icon: Stethoscope,
      nameAr: 'أطباء الطب الرياضي',
      nameEn: 'Sports physicans',
    },
    {
      id: 7,
      name: t('Sports Management'),
      Icon: FolderKanban,
      nameAr: 'الإدارة الرياضية',
      nameEn: 'Sports Management',
    },
    {
      id: 8,
      name: t('ports Media'),
      Icon: Mic,
      nameAr: 'الإعلام',
      nameEn: 'ports Media',
    },
    {
      id: 9,
      name: t('Sports Education'),
      Icon: BookOpen,
      nameAr: 'التعليم الرياضي',
      nameEn: 'Sports Education',
    },
    {
      id: 10,
      name: t('Facility Operations'),
      Icon: Settings,
      nameAr: 'تشغيل وإدارة المنشآت',
      nameEn: 'Facility Operations',
    },
  ]

  const content = {
    application: {
      heroTitle:
        language === 'ar'
          ? 'منصتك الرياضية لتصنع فرصتك'
          : 'Your Sports Platform To Create Your Opportunity',
      heroSearchPlaceholder:
        language === 'ar'
          ? 'ابحث عن فرص العمل...'
          : 'Search for job opportunities...',
      heroButton1: language === 'ar' ? 'انضم الآن' : 'Join Now',
      heroButton2: language === 'ar' ? 'استكشف الفرص' : 'Explore Opportunities',
      opportunitiesTitle:
        language === 'ar'
          ? 'الفرص الوظيفية المتاحة'
          : 'Available Job Opportunities',
      opportunitiesSubtitle:
        language === 'ar'
          ? 'اكتشف أحدث الوظائف في المجال الرياضي'
          : 'Discover The Latest Jobs In The Sports Field',
      ctaTitle:
        language === 'ar'
          ? 'ابدأ رحلتك الرياضية اليوم!'
          : 'Start Your Sports Journey Today!',
      ctaButton: language === 'ar' ? 'ابدأ الآن' : 'Get Started',
      // refined gradient (softer, matches site palette)
      gradientClass: 'bg-gradient-to-r from-blue-500 via-cyan-400 to-green-500',

      testimonialsTitle:
        language === 'ar' ? 'قصص نجاح سعودية' : 'Saudi Success Stories',

      testimonialsSubtitle:
        language === 'ar'
          ? 'مواهب سعودية حققت طموحاتها من خلال منصتنا'
          : 'Saudi talents who achieved their ambitions through our platform',

      testimonials: [
        {
          name: language === 'ar' ? 'عبدالله الغامدي' : 'Abdullah Al-Ghamdi',
          role: language === 'ar' ? 'لاعب كرة قدم' : 'Football Player',
          company: language === 'ar' ? 'أكاديمية الساحل الرياضية' : 'Al-Sahel Sports Academy',
          location: language === 'ar' ? 'جدة' : 'Jeddah',
          content:
            language === 'ar'
              ? 'حققت حلمي بالانضمام لفريق الدرجة الأولى بفضل TF1. المنصة ربطتني بالمدرب المناسب وفتحت لي أبواب كانت مستحيلة.'
              : 'I achieved my dream of joining a first division team thanks to TF1. The platform connected me with the right coach and opened doors that seemed impossible.',
          rating: 5,
          image: '⚽',
        },
        {
          name: language === 'ar' ? 'نورة السبيعي' : 'Noura Al-Subai',
          role: language === 'ar' ? 'مدربة لياقة بدنية' : 'Fitness Coach',
          company: language === 'ar' ? 'مركز الرياض للياقة البدنية' : 'Riyadh Fitness Center',
          location: language === 'ar' ? 'الرياض' : 'Riyadh',
          content:
            language === 'ar'
              ? 'من خلال المنصة، وصلت لعملاء جدد وبنيت سمعة قوية. دلوقتي عندي أكثر من 40 متدرب من مختلف مناطق المملكة.'
              : 'Through the platform, I reached new clients and built a strong reputation. Now I have over 40 trainees from different regions of Saudi Arabia.',
          rating: 5,
          image: '💪',
        },
        {
          name: language === 'ar' ? 'خالد القحطاني' : 'Khalid Al-Qahtani',
          role: language === 'ar' ? 'مدير رياضي' : 'Sports Manager',
          company: language === 'ar' ? 'مركز التميز الرياضي' : 'Sports Excellence Center',
          location: language === 'ar' ? 'الرياض' : 'Riyadh',
          content:
            language === 'ar'
              ? 'وظفنا 12 موظف في شهر واحد! المنصة سهلت علينا الوصول للكفاءات السعودية المتميزة بسرعة وبجودة عالية.'
              : 'We hired 12 employees in one month! The platform made it easy to reach distinguished Saudi talents quickly and with high quality.',
          rating: 5,
          image: '🏆',
        },
      ],

      featuresTitle:
        language === 'ar' ? 'لماذا تختار TF1؟' : 'Why choose TF1?',

      featuresSubtitle:
        language === 'ar'
          ? 'حل موحد يجمع الفرص الرياضية ويسهّل وصول الباحثين للجهات الرياضية'
          : 'A unified platform that connects candidates with sports organizations',

      features: [
        {
          icon: '🎯',
          title: language === 'ar' ? 'فرص دقيقة' : 'Relevant Opportunities',
          description:
            language === 'ar'
              ? 'نعرض وظائف متخصصة تناسب مجالات الرياضة المختلفة'
              : 'We list accurate job opportunities across sports fields',
        },
        {
          icon: '⚡',
          title: language === 'ar' ? 'تقديم سهل' : 'Easy Apply',
          description:
            language === 'ar'
              ? 'خطوات بسيطة للتقديم بدون تعقيد'
              : 'Simple and fast application steps',
        },
        {
          icon: '🤝',
          title:
            language === 'ar'
              ? 'ربط الجهات بالمتقدمين'
              : 'Connecting Employers',
          description:
            language === 'ar'
              ? 'نساعد الجهات الرياضية في الوصول للمتقدمين بسرعة'
              : 'Helps sports organizations reach candidates quickly',
        },
        {
          icon: '📈',
          title:
            language === 'ar'
              ? 'دعم التطور المهني'
              : 'Career Development',
          description:
            language === 'ar'
              ? 'أدوات تساعدك على تحسين تجربتك في البحث عن وظيفة'
              : 'Tools that support your career improvement',
        },
      ],

      opportunities: [
        {
          title: language === 'ar' ? 'مدرب كرة قدم' : 'Football Coach',
          company: language === 'ar' ? 'نادي الهلال' : 'Al Hilal Club',
          description:
            language === 'ar'
              ? 'مطلوب مدرب كرة قدم محترف للفئات السنية الصغرى مع خبرة لا تقل عن 5 سنوات'
              : 'Professional Football Coach Needed For Youth Categories With Minimum 5 Years Experience',
          location: language === 'ar' ? 'الرياض' : 'Riyadh',
          type: language === 'ar' ? 'دوام كامل' : 'Full Time',
          posted: language === 'ar' ? 'منذ يومين' : '2 days ago',
        },
        {
          title:
            language === 'ar' ? 'أخصائي لياقة بدنية' : 'Fitness Specialist',
          company: language === 'ar' ? 'مركز فتنس بلس' : 'Fitness Plus Center',
          description:
            language === 'ar'
              ? 'نبحث عن أخصائي لياقة بدنية مؤهل لتدريب العملاء وتصميم البرامج التدريبية'
              : 'We Are Looking For A Qualified Fitness Specialist To Train Clients And Design Training Programs',
          location: language === 'ar' ? 'جدة' : 'Jeddah',
          type: language === 'ar' ? 'دوام جزئي' : 'Part Time',
          posted: language === 'ar' ? 'منذ 4 أيام' : '4 days ago',
        },
        {
          title: language === 'ar' ? 'مدرب سباحة' : 'Swimming Coach',
          company: language === 'ar' ? 'أكاديمية السباحة' : 'Swimming Academy',
          description:
            language === 'ar'
              ? 'مطلوب مدرب سباحة معتمد للأطفال والكبار مع شهادات دولية في السلامة'
              : 'Certified Swimming Coach Needed For Children And Adults With International Safety Certificates',
          location: language === 'ar' ? 'الدمام' : 'Dammam',
          type: language === 'ar' ? 'دوام كامل' : 'Full Time',
          posted: language === 'ar' ? 'منذ أسبوع' : '1 week ago',
        },
      ],
    },
    recruitment: {
      heroTitle:
        language === 'ar'
          ? 'نمكّن مواهبك ونوصّل فرصك'
          : 'Empower talents. Connect opportunities',
      heroSearchPlaceholder:
        language === 'ar'
          ? 'ابحث عن المواهب الرياضية...'
          : 'Search for sports talents...',
      heroButton1: language === 'ar' ? 'استقطب المواهب' : 'Recruit Talents',
      heroButton2: language === 'ar' ? 'تعاقد معنا' : 'Contract With Us',
      opportunitiesTitle:
        language === 'ar' ? 'المواهب المتميزة' : 'Outstanding Talents',
      opportunitiesSubtitle:
        language === 'ar'
          ? 'اكتشف أفضل المواهب الرياضية المتاحة للتوظيف'
          : 'Discover the best sports talents available for recruitment',
      ctaTitle:
        language === 'ar'
          ? 'ابدأ في التوظيف اليوم!'
          : 'Start recruiting today!',
      ctaButton: language === 'ar' ? 'استقطب المواهب' : 'Recruit Talents',
      gradientClass: 'bg-gradient-to-r from-green-500 to-blue-600',
      featuresTitle:
        language === 'ar'
          ? 'لماذا TF1 للتوظيف؟'
          : 'Why SportX for recruitment?',
      featuresSubtitle:
        language === 'ar'
          ? 'منصة متقدمة لاكتشاف وتوظيف أفضل الكوادر '
          : 'Advanced Platform for Discovering & Recruiting the Best ',
      testimonialsTitle:
        language === 'ar' ? 'شركاء النجاح' : 'Success Partners',
      testimonialsSubtitle:
        language === 'ar'
          ? 'جهات سعودية رائدة تثق في منصتنا'
          : 'Leading Saudi organizations that trust our platform',
      testimonials: [
        {
          name: language === 'ar' ? 'خالد السعيد' : 'Khalid Al-Saeed',
          role:
            language === 'ar'
              ? 'مدير الموارد البشرية'
              : 'Human Resources Manager',
          company: language === 'ar' ? 'أكاديمية النخبة الرياضية' : 'Elite Sports Academy',
          location: language === 'ar' ? 'الرياض' : 'Riyadh',
          content:
            language === 'ar'
              ? 'المنصة وفّرت علينا وقت كبير وربطتنا بأفضل الكفاءات السعودية المتخصصة في المجال الرياضي.'
              : 'The platform saved us a lot of time and connected us with top Saudi talent specialized in sports.',
          rating: 5,
          image: '🎯',
        },
        {
          name: language === 'ar' ? 'نورا عبدالله' : 'Nora Abdullah',
          role: language === 'ar' ? 'مديرة التوظيف' : 'Recruitment Manager',
          company:
            language === 'ar'
              ? 'مجمع اللياقة الرياضية'
              : 'Sports Fitness Complex',
          location: language === 'ar' ? 'جدة' : 'Jeddah',
          content:
            language === 'ar'
              ? 'جودة المرشحين ممتازة والأدوات سهلة الاستخدام. وظفنا 15 موظف سعودي في شهر واحد فقط!'
              : 'The quality of candidates is excellent & the tools are easy to use. We hired 15 Saudi employees in just one month!',
          rating: 5,
          image: '⭐',
        },
        {
          name: language === 'ar' ? 'عبدالرحمن منصور' : 'Abdulrahman Mansour',
          role: language === 'ar' ? 'مؤسس' : 'Founder',
          company:
            language === 'ar'
              ? 'أكاديمية الرياضة المتطورة'
              : 'Advanced Sports Academy',
          location: language === 'ar' ? 'الدمام' : 'Dammam',
          content:
            language === 'ar'
              ? 'المنصة ساعدتنا في بناء فريق عمل سعودي متميز من مختلف التخصصات الرياضية.'
              : 'The platform helped us build an outstanding Saudi team of specialists across all sports fields.',
          rating: 5,
          image: '🏅',
        },
      ],
      features: [
        {
          icon: '👥',
          title: language === 'ar' ? 'مواهب متنوعة' : 'Diverse Talents',
          description:
            language === 'ar'
              ? 'اكتشف مجموعة واسعة من المهارات والتخصصات الرياضية'
              : 'Discover a Wide Range of Skills & Sports Specializations',
        },
        {
          icon: '🔍',
          title: language === 'ar' ? 'فلترة ذكية' : 'Smart Filtering',
          description:
            language === 'ar'
              ? 'ابحث وفلتر المرشحين حسب المهارات والخبرة والموقع'
              : 'Search & Filter Candidates By Skills, Experience & Location',
        },
        {
          icon: '📊',
          title: language === 'ar' ? 'تقارير مفصلة' : 'Detailed Reports',
          description:
            language === 'ar'
              ? 'احصل على تحليلات شاملة عن عمليات التوظيف والمرشحين'
              : 'Get Comprehensive Analytics About Recruitment Processes & Candidates',
        },
        {
          icon: '💬',
          title: language === 'ar' ? 'تواصل مباشر' : 'Direct Communication',
          description:
            language === 'ar'
              ? 'تواصل مباشرة مع المرشحين وأجري المقابلات عبر المنصة'
              : 'Communicate Directly With Candidates & Conduct Interviews Through The Platform',
        },
      ],
      opportunities: [
        {
          title:
            language === 'ar'
              ? 'أحمد محمد - لاعب كرة قدم'
              : 'Ahmed Mohammed - Football Player',
          company: language === 'ar' ? 'مهاجم' : 'Striker',
          description:
            language === 'ar'
              ? 'لاعب كرة قدم محترف في مركز المهاجم مع خبرة 8 سنوات في الدوري المحلي'
              : 'Professional Football Player In Striker Position With 8 Years Experience In Local League',
          location: language === 'ar' ? 'الرياض' : 'Riyadh',
          type: language === 'ar' ? 'متاح للانتقال' : 'Available for Transfer',
          posted: language === 'ar' ? 'نشط الآن' : 'Active Now',
        },
        {
          title:
            language === 'ar'
              ? 'فاطمة أحمد - مدربة سباحة'
              : 'Fatima Ahmed - Swimming Coach',
          company: language === 'ar' ? 'مدربة معتمدة' : 'Certified Coach',
          description:
            language === 'ar'
              ? 'مدربة سباحة معتمدة دولياً مع 10 سنوات خبرة في تدريب الفرق النسائية'
              : 'Internationally Certified Swimming Coach With 10 Years Experience In Training Women Teams',
          location: language === 'ar' ? 'جدة' : 'Jeddah',
          type: language === 'ar' ? 'متاح للعمل' : 'Available for Work',
          posted: language === 'ar' ? 'منذ ساعتين' : '2 hours ago',
        },
        {
          title:
            language === 'ar'
              ? 'خالد سالم - أخصائي تغذية'
              : 'Khalid Salem - Nutritionist',
          company: language === 'ar' ? 'أخصائي رياضي' : 'Sports Specialist',
          description:
            language === 'ar'
              ? 'أخصائي تغذية رياضية معتمد متخصص في برامج الرياضيين المحترفين'
              : 'Certified Nutritionist Specializing In Professional Athlete Programs',
          location: language === 'ar' ? 'الدمام' : 'Dammam',
          type:
            language === 'ar' ? 'متاح للاستشارة' : 'Available for Consultation',
          posted: language === 'ar' ? 'منذ يوم' : '1 day ago',
        },
      ],
    },
  }

  /**
   * AUTO SCROLL - DISABLED (Manual navigation only)
   */
  // Auto-scroll disabled - users navigate manually with arrows


  // No auto-reset needed - manual navigation only


  return (
    <div
      className={`min-h-screen bg-gray-50 ${language === 'ar' ? 'font-arabic' : 'font-english'}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <Navbar activeMode={mode} />

      {/* Real-time Jobs Ticker Bar */}
      <JobsTickerBar />

      {/* News Banner Strip */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 w-full py-4 sm:py-5 px-4 shadow-lg"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            key={newsIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="text-lg sm:text-xl font-bold text-white text-center mb-1">
              {newsMessages[newsIndex].title}
            </h3>
            <p className="text-sm sm:text-base text-white/90 font-medium text-center">
              {newsMessages[newsIndex].desc}
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <motion.section
        className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Language-specific Switcher */}
          <div className="flex justify-center mb-8">
            {language === 'ar' ? (
              <ArabicSwitcher mode={mode} setMode={setMode} />
            ) : (
              <EnglishSwitcher mode={mode} setMode={setMode} />
            )}
          </div>

          {/* Centered Hero Content */}
          <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto mb-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <FootballWipeText
                transitionKey={mode}
                className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight"
              >
                <h1 className="mb-6 mt-4">
                  {mode === 'application'
                    ? t('heroTitleApplication')
                    : t('heroTitleRecruitment')}
                </h1>
              </FootballWipeText>

              <motion.div
                className="flex flex-col gap-3 sm:gap-4 justify-center w-full sm:w-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto"
                >
                  <Link href="/register" className="w-full block">
                    <Button
                      size="lg"
                      className={`w-full px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-xl transition-all duration-300 shadow-md hover:shadow-xl ${
                        mode === 'application'
                          ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600'
                          : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                      }`}
                    >
                      <FootballWipeText transitionKey={mode}>
                        {mode === 'application'
                          ? t('joinNow')
                          : t('attractTalents')}
                      </FootballWipeText>
                    </Button>
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                  <Link href={mode === 'application' ? '/jobs' : '/contract'} className="w-full block">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-xl border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
                    >
                      <FootballWipeText transitionKey={mode}>
                        {mode === 'application'
                          ? t('exploreOpportunities')
                          : language === 'ar' ? 'تعاقد معنا' : 'Contract With Us'}
                      </FootballWipeText>
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Hero Banner - Optimized for All Devices */}
      <section className="relative w-full bg-white overflow-hidden">
        <div className="w-full h-60 sm:h-72 md:h-96 lg:h-[32rem] relative rounded-2xl mx-auto my-8 sm:my-12 px-4 sm:px-6 max-w-6xl">
          <img
            src={bannerImage.url}
            alt={bannerImage.alt}
            loading="eager"
            className="w-full h-full object-contain rounded-2xl"
            style={{
              objectPosition: 'center',
              backfaceVisibility: 'hidden',
            }}
          />
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Partners Marquee Section */}
      <PartnersMarquee />

      {/* Target Categories Section */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-16"
          >
            {t('targetCategories')}
          </motion.h3>

          {/* Carousel wrapper */}
          <div className="relative">
            {/* Scrollable container with smooth scrolling */}
            <div 
              ref={carouselRef}
              className="overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex gap-5 sm:gap-6 pb-6 justify-center sm:justify-start">
                {categories.map((category, index) => {
                  const IconComponent = category.Icon
                  return (
                    <motion.div
                      key={`${category.id}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      className="text-center flex-shrink-0 w-40 sm:w-48 transition-all duration-300 cursor-pointer"
                    >
                      <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 rounded-full bg-blue-50 flex items-center justify-center transition-all duration-200 hover:bg-blue-100">
                        <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-blue-500" strokeWidth={1.5} />
                      </div>
                      
                      <h3 className="text-sm sm:text-base font-semibold text-gray-700">
                        {language === 'ar' ? category.nameAr : category.nameEn}
                      </h3>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Navigation arrows */}
            <button
              aria-label="prev categories"
              className="absolute -left-3 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 z-10 hidden sm:flex items-center justify-center w-10 h-10"
              onClick={() => {
                const container = carouselRef.current
                if (container) {
                  container.scrollBy({ left: language === 'ar' ? 300 : -300, behavior: 'smooth' })
                }
              }}
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" strokeWidth={2} />
            </button>
            <button
              aria-label="next categories"
              className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 z-10 hidden sm:flex items-center justify-center w-10 h-10"
              onClick={() => {
                const container = carouselRef.current
                if (container) {
                  container.scrollBy({ left: language === 'ar' ? -300 : 300, behavior: 'smooth' })
                }
              }}
            >
              <ChevronRight className="w-5 h-5 text-gray-600" strokeWidth={2} />
            </button>
          </div>
        </div>
      </section>

      {/* Recent Jobs Section - Only for Application Mode */}
      {mode === 'application' && (
        <section className="py-12 sm:py-16 px-4 sm:px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-8 sm:mb-12"
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                  {language === 'ar'
                    ? 'الفرص الوظيفية المتاحة'
                    : 'Available Job Opportunities'}
                </span>
              </h2>
              <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
                {language === 'ar'
                  ? 'اكتشف أحدث الوظائف في المجال الرياضي'
                  : 'Discover the latest jobs in the sports field'}
              </p>
            </motion.div>

            <RecentJobs />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center mt-8 sm:mt-12"
            >
              <Link href="/jobs">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white px-8 py-4 text-base sm:text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 inline-flex items-center gap-2"
                >
                  {language === 'ar' ? 'عرض جميع الوظائف' : 'View All Jobs'}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Top Rated Players Section - Only for Application Mode */}
      {mode === 'application' && (
        <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-br from-purple-50 via-white to-blue-50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 sm:mb-12"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent mb-3 sm:mb-4">
                {language === 'ar'
                  ? ' أفضل الكوادر تقييماً'
                  : 'Top Rated Players'}
              </h2>
              <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
                {language === 'ar'
                  ? 'اكتشف نخبة الكفاءات الرياضية والطبية والإدارية ذات الأداء العالي '
                  : 'Meet our top-rated professional players with excellent reviews'}
              </p>
            </motion.div>

            <TopRatedPlayers limit={3} minReviews={1} />
          </div>
        </section>
      )}

      {/* Testimonials Section - Clean Premium Design */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16">
            <FootballWipeText transitionKey={mode}>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {content[mode].testimonialsTitle}
              </h2>
            </FootballWipeText>
            <FootballWipeText transitionKey={mode}>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                {content[mode].testimonialsSubtitle}
              </p>
            </FootballWipeText>
          </div>

          {/* Testimonial Cards - Clean Grid Design */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {content[mode].testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
              >
                {/* Rating Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-700 text-base leading-relaxed mb-6">
                  "{testimonial.content}"
                </p>

                {/* User Info */}
                <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-base mb-0.5">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {testimonial.role}
                    </p>
                    <p className="text-sm text-blue-600 font-medium">
                      {testimonial.company} · {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <FootballWipeText
              transitionKey={mode}
              className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4"
            >
              <h2>{content[mode].featuresTitle}</h2>
            </FootballWipeText>
            <FootballWipeText
              transitionKey={mode}
              className="text-gray-600 text-base sm:text-lg"
            >
              <p>{content[mode].featuresSubtitle}</p>
            </FootballWipeText>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {content[mode].features.map((feature, index) => (
              <motion.div
                key={index}
                className="text-center p-4 sm:p-6 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Status Section - Simplified & Premium */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-10 sm:p-14 border border-white/10"
          >
            {/* Status Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-bold text-green-400">
                    {language === 'ar' ? 'نشط الآن' : 'Live Now'}
                  </span>
                </div>
                <h3 className="text-3xl font-black mb-2">2.5K+</h3>
                <p className="text-gray-300 font-semibold">
                  {language === 'ar' ? 'وظائف متاحة' : 'Available Jobs'}
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  <span className="text-sm font-bold text-green-400">
                    {language === 'ar' ? 'متصل' : 'Active'}
                  </span>
                </div>
                <h3 className="text-3xl font-black mb-2">50K+</h3>
                <p className="text-gray-300 font-semibold">
                  {language === 'ar' ? 'محترف مسجل' : 'Registered Members'}
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  <span className="text-sm font-bold text-green-400">
                    {language === 'ar' ? 'جارٍ' : 'Processing'}
                  </span>
                </div>
                <h3 className="text-3xl font-black mb-2">98%</h3>
                <p className="text-gray-300 font-semibold">
                  {language === 'ar' ? 'معدل الرضا' : 'Satisfaction'}
                </p>
              </div>
            </div>

            {/* Main Message */}
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-black mb-4">
                {language === 'ar'
                  ? 'هل تبحث عن فرصة تغير حياتك؟'
                  : 'Looking for a life-changing opportunity?'}
              </h2>
              <p className="text-lg text-gray-300 mb-8 font-semibold">
                {language === 'ar'
                  ? 'اكتشف آلاف الوظائف والفرص التي تنتظرك على منصة TF1'
                  : 'Discover thousands of jobs and opportunities waiting for you on TF1 platform'}
              </p>

              {/* AI Coming Soon Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/30 to-blue-500/30 border border-purple-400/50 rounded-full px-6 py-3 mb-8"
              >
                <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-bold">
                  {language === 'ar' ? '🤖 الذكاء الاصطناعي قريباً' : '🤖 AI Coming Soon'}
                </span>
              </motion.div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-3 text-lg font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
                  >
                    {language === 'ar' ? '🚀 ابدأ الآن' : '🚀 Get Started'}
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 text-lg font-bold rounded-lg border border-white/30 transition-all duration-300 w-full sm:w-auto"
                >
                  {language === 'ar' ? '📖 اعرف المزيد' : '📖 Learn More'}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
