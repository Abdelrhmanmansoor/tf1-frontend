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
import { ArabicSwitcher } from './arabic-switcher'
import { EnglishSwitcher } from './english-switcher'
import { RecentJobs } from './recent-jobs'
import { TopRatedPlayers } from './rating/TopRatedPlayers'
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
  const [currentIndex, setCurrentIndex] = useState(0)
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
          company: language === 'ar' ? 'نادي الاتحاد' : 'Al-Ittihad Club',
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
          company: language === 'ar' ? 'أكاديمية الرياض للياقة' : 'Riyadh Fitness Academy',
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
          company: language === 'ar' ? 'نادي الشباب' : 'Al-Shabab Club',
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
          company: language === 'ar' ? 'نادي الصقور' : 'Falcons Club',
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
                className="mb-6 sm:mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <FootballWipeText transitionKey={mode}>
                  <div className="relative group"></div>
                </FootballWipeText>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/register">
                    <Button
                      size="lg"
                      className={`px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-xl transition-all duration-300 shadow-md hover:shadow-xl ${
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
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href={mode === 'application' ? '/jobs' : '/contract'}>
                    <Button
                      variant="outline"
                      size="lg"
                      className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-xl border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
                    >
                      <FootballWipeText transitionKey={mode}>
                        {mode === 'application'
                          ? t('exploreOpportunities')
                          : t('contractWithUs')}
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
            {/* Scrollable container - Manual Navigation */}
            <div 
              ref={carouselRef}
              className="relative overflow-hidden"
            >
              <motion.div
                className="flex gap-4 sm:gap-5 pb-6"
                animate={{
                  x: `-${currentIndex * (typeof window !== 'undefined' && window.innerWidth >= 640 ? 260 : 224)}px`,
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.32, 0.72, 0, 1],
                }}
              >
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
              </motion.div>
            </div>

            {/* Navigation arrows - Clean & Modern */}
            <button
              aria-label="prev categories"
              className={`absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2.5 sm:p-3 shadow-sm border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 z-10 ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={currentIndex === 0}
              onClick={() => {
                if (currentIndex > 0) {
                  setCurrentIndex((prev) => prev - 1)
                }
              }}
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" strokeWidth={2} />
            </button>
            <button
              aria-label="next categories"
              className={`absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2.5 sm:p-3 shadow-sm border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 z-10 ${currentIndex === categories.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={currentIndex === categories.length - 1}
              onClick={() => {
                if (currentIndex < categories.length - 1) {
                  setCurrentIndex((prev) => prev + 1)
                }
              }}
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" strokeWidth={2} />
            </button>

            {/* Dots Navigation */}
            <div className="flex justify-center gap-2 mt-6">
              {categories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentIndex
                      ? 'w-8 h-3 bg-blue-500'
                      : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to category ${index + 1}`}
                />
              ))}
            </div>
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

      {/* Testimonials Section - World-Class Design */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-br from-slate-50 via-blue-50 to-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <motion.div 
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <FootballWipeText transitionKey={mode}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                <span className="bg-gradient-to-r from-blue-600 via-green-600 to-blue-600 bg-clip-text text-transparent">
                  {content[mode].testimonialsTitle}
                </span>
              </h2>
            </FootballWipeText>
            <FootballWipeText transitionKey={mode}>
              <p className="text-gray-600 text-lg sm:text-xl max-w-3xl mx-auto">
                {content[mode].testimonialsSubtitle}
              </p>
            </FootballWipeText>
          </motion.div>

          {/* Testimonial Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {content[mode].testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="group bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden border border-gray-100"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.25, 0.4, 0.25, 1]
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3 }
                }}
              >
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

                {/* Icon Badge */}
                <div className="relative mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center text-3xl shadow-lg">
                    {testimonial.image}
                  </div>
                </div>

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
                <p className="text-gray-700 text-base leading-relaxed mb-6 relative z-10">
                  "{testimonial.content}"
                </p>

                {/* User Info */}
                <div className="flex items-start gap-4 relative z-10 border-t border-gray-100 pt-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-base mb-1">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-1">
                      {testimonial.role}
                    </p>
                    <p className="text-sm text-blue-600 font-medium flex items-center gap-1">
                      <span>{testimonial.company}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500">{testimonial.location}</span>
                    </p>
                  </div>
                </div>

                {/* Quote Mark */}
                <div className="absolute top-6 right-6 text-7xl text-blue-100 leading-none opacity-40 font-serif">
                  "
                </div>
              </motion.div>
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
                  ? 'منصة التوظيف الرياضية الأولى في المملكة'
                  : "Saudi Arabia’s #1 platform for sports jobs"}
              </p>
              <div className="flex gap-4">
                {/* social icons... kept same */}
                <a
                  href="https://www.snapchat.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center cursor-pointer transition-colors duration-300"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
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
                  <span className="text-sm">+966 53 984 7559</span>
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
                ? '© 2025 منصة TF1. جميع الحقوق محفوظة'
                : '© 2025 TF1 Platform. All rights reserved'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
