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
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)
  const [isBannerPaused, setIsBannerPaused] = useState(false)
  const bannerAutoScrollRef = useRef<number | null>(null)
  const isPausedRef = useRef(false)
  const touchStartX = useRef(0)

  const bannerImages = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=400&fit=crop',
      alt: language === 'ar' ? 'رياضة 1' : 'Sports 1',
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&h=400&fit=crop',
      alt: language === 'ar' ? 'رياضة 2' : 'Sports 2',
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200&h=400&fit=crop',
      alt: language === 'ar' ? 'رياضة 3' : 'Sports 3',
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

  useEffect(() => {
    const startBannerAutoScroll = () => {
      if (bannerAutoScrollRef.current) {
        window.clearInterval(bannerAutoScrollRef.current)
        bannerAutoScrollRef.current = null
      }

      bannerAutoScrollRef.current = window.setInterval(() => {
        if (isBannerPaused) return
        
        setCurrentBannerIndex((prev) => {
          return (prev + 1) % bannerImages.length
        })
      }, 5000)
    }

    startBannerAutoScroll()

    return () => {
      if (bannerAutoScrollRef.current) {
        window.clearInterval(bannerAutoScrollRef.current)
        bannerAutoScrollRef.current = null
      }
    }
  }, [bannerImages.length, isBannerPaused])

  // No auto-reset needed - manual navigation only

  // pause/resume handlers
  const handlePause = () => {
    isPausedRef.current = true
  }
  const handleResume = () => {
    isPausedRef.current = false
  }

  return (
    <div
      className={`min-h-screen bg-gray-50 ${language === 'ar' ? 'font-arabic' : 'font-english'}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <Navbar activeMode={mode} />

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
                          : language === 'ar' ? 'للشركات' : 'For Companies'}
                      </FootballWipeText>
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Premium Image Carousel - Customizable Banners */}
      <section className="relative py-8 sm:py-12 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div 
            className="relative h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden"
            onMouseEnter={() => setIsBannerPaused(true)}
            onMouseLeave={() => setIsBannerPaused(false)}
          >
            {/* Images Container */}
            <motion.div
              className="flex h-full"
              animate={{
                x: `-${currentBannerIndex * 100}%`,
              }}
              transition={{
                duration: 0.7,
                ease: 'easeInOut',
              }}
            >
              {bannerImages.map((banner) => (
                <div key={banner.id} className="min-w-full h-full relative">
                  <img
                    src={banner.url}
                    alt={banner.alt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              ))}
            </motion.div>

            {/* Dots Navigation */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {bannerImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBannerIndex(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentBannerIndex
                      ? 'w-8 h-3 bg-white'
                      : 'w-3 h-3 bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Partners Marquee Section */}
      <PartnersMarquee />

      {/* Categories Section - Clean & Modern Design */}
      <section className="py-16 sm:py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {t('targetCategories')}
          </motion.h2>

          {/* Carousel wrapper */}
          <div className="relative">
            {/* Scrollable container with smooth scrolling */}
            <div 
              ref={carouselRef}
              className="overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex gap-4 sm:gap-5 pb-6">
                {categories.map((category, index) => {
                  const IconComponent = category.Icon
                  return (
                    <div
                      key={`${category.id}-${index}`}
                      className="group bg-white rounded-lg border border-gray-200 p-6 sm:p-8 text-center flex-shrink-0 w-52 sm:w-60 transition-all duration-200 hover:border-blue-400 hover:shadow-md cursor-pointer"
                    >
                      <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center transition-colors duration-200 group-hover:bg-blue-50">
                        <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-gray-600 transition-colors duration-200 group-hover:text-blue-500" strokeWidth={1.5} />
                      </div>
                      
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                        {language === 'ar' ? category.nameAr : category.nameEn}
                      </h3>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Navigation arrows - Scroll based */}
            <button
              aria-label="prev categories"
              className={`absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2.5 sm:p-3 shadow-sm border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 z-10`}
              onClick={() => {
                const container = carouselRef.current
                if (container) {
                  const scrollAmount = typeof window !== 'undefined' && window.innerWidth >= 640 ? 520 : 448
                  container.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
                }
              }}
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" strokeWidth={2} />
            </button>
            <button
              aria-label="next categories"
              className={`absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2.5 sm:p-3 shadow-sm border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 z-10`}
              onClick={() => {
                const container = carouselRef.current
                if (container) {
                  const scrollAmount = typeof window !== 'undefined' && window.innerWidth >= 640 ? 520 : 448
                  container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
                }
              }}
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" strokeWidth={2} />
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

      {/* CTA Section */}
      <section
        className={`py-12 sm:py-16 ${content[mode].gradientClass} text-white text-center`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <FootballWipeText
            transitionKey={mode}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6"
          >
            <h2 className="mb-3">{content[mode].ctaTitle}</h2>
          </FootballWipeText>
          <motion.p
            className="text-lg sm:text-xl opacity-90 mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {mode === 'application'
              ? language === 'ar'
                ? 'انضم إلى آلاف المحترفين الذين وثقوا بنا'
                : 'Join thousands of professionals who trusted us'
              : language === 'ar'
                ? 'اكتشف أفضل المواهب الرياضية في المنطقة'
                : 'Discover the best sports talents in the region'}
          </motion.p>
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-100 px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <FootballWipeText transitionKey={mode}>
                    {content[mode].ctaButton}
                  </FootballWipeText>
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
