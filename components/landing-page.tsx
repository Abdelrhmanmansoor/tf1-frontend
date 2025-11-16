'use client'

import { useState, useRef } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
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
  const { t, language } = useLanguage()
  const carouselRef = useRef<HTMLDivElement>(null)

  const categories = [
    {
      id: 1,
      name: t('player'),
      icon: '🏃',
      nameAr: 'اللاعبين',
      nameEn: 'Players',
    },
    {
      id: 2,
      name: t('coach'),
      icon: '👨‍🏫',
      nameAr: 'المدربين',
      nameEn: 'Coaches',
    },
    { id: 3, name: t('club'), icon: '🏟️', nameAr: 'الاندية', nameEn: 'Clubs' },
    {
      id: 4,
      name: t('Support Roles'),
      icon: '💪',
      nameAr: 'الوظائف المساندة ',
      nameEn: 'Support Roles',
    },
    {
      id: 5,
      name: t('naturalField'),
      icon: '🩼',
      nameAr: 'أخصائين العلاج الطبيعي ',
      nameEn: 'Physical Therapists',
    },
    {
      id: 6,
      name: t('Sports physicans'),
      icon: '🩺',
      nameAr: 'أطباء الطب الرياضي',
      nameEn: 'Sports physicans',
    },
    {
      id: 7,
      name: t('Sports Management'),
      icon: '🧰',
      nameAr: 'الإدارة الرياضية',
      nameEn: 'Sports Management',
    },
    {
      id: 8,
      name: t('ports Media'),
      icon: '🎤',
      nameAr: 'الإعلام',
      nameEn: 'ports Media',
    },
    {
      id: 9,
      name: t('Sports Education'),
      icon: '👨‍🏫',
      nameAr: 'التعليم الرياضي',
      nameEn: 'Sports Education',
    },
    { id: 10, name: t('Facility Operations'), icon: '🪤', nameAr: 'تشغيل وإدارة المنشآت', nameEn: 'Facility Operations' },
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
      ctaButton: language === 'ar' ? 'انضم الآن' : 'Join Now',
      gradientClass: 'bg-gradient-to-r from-blue-600 to-green-500',
      testimonialsTitle:
        language === 'ar' ? 'ماذا يقول المستخدمون' : 'What Our User’s Say',
      testimonialsSubtitle:
        language === 'ar'
          ? 'تجارب حقيقية من محترفين وجدوا وظائفهم المثالية'
          : 'Real Experiences From Professionals Who Found Their Perfect Jobs',
      featuresTitle:
        language === 'ar' ? 'لماذا تختار SportX؟' : 'Why choose SportX?',
      featuresSubtitle:
        language === 'ar'
          ? 'منصة شاملة تربطك بفرص العمل في المجال الرياضي'
          : 'A Comprehensive Platform Connecting You To Sports Career Opportunities',
      testimonials: [
        {
          name: language === 'ar' ? 'أحمد محمد' : 'Ahmed Mohammed',
          role: language === 'ar' ? 'مدرب كرة قدم' : 'Football Coach',
          company: language === 'ar' ? 'نادي الهلال' : 'Al Hilal Club',
          content:
            language === 'ar'
              ? 'وجدت وظيفة أحلامي كمدرب في النادي خلال أسبوعين فقط. المنصة سهلة الاستخدام ومليئة بالفرص المناسبة.'
              : 'I Found My Dream Job As A Coach At The Club In Just Two Weeks. The Platform Is Easy To Use And Full Of Suitable Opportunities.',
          rating: 5,
        },
        {
          name: language === 'ar' ? 'سارة أحمد' : 'Sarah Ahmed',
          role:
            language === 'ar' ? 'أخصائية تغذية رياضية' : 'Sports Nutritionist',
          company:
            language === 'ar'
              ? 'مركز اللياقة الشامل'
              : 'Comprehensive Fitness Center',
          content:
            language === 'ar'
              ? 'SportX ربطني بأفضل أصحاب العمل في مجال التغذية الرياضية. الآن أعمل مع فريقي المفضل!'
              : 'SportX Connected Me With The Best Employers In Sports Nutrition. Now I Work With My Favorite Team!',
          rating: 5,
        },
        {
          name: language === 'ar' ? 'محمد علي' : 'Mohammed Ali',
          role: language === 'ar' ? 'مدرب سباحة' : 'Swimming Coach',
          company:
            language === 'ar'
              ? 'أكاديمية السباحة المتقدمة'
              : 'Advanced Swimming Academy',
          content:
            language === 'ar'
              ? 'المنصة وفرت لي عدة خيارات وظيفية ممتازة. التواصل مع أصحاب العمل كان سهلاً وسريعاً.'
              : 'The Platform Provided Me With Several Excellent Job Options. Communication With Employers Was Easy And Fast.',
          rating: 4,
        },
      ],
      features: [
        {
          icon: '🎯',
          title: language === 'ar' ? 'وظائف مخصصة' : 'Personalized Jobs',
          description:
            language === 'ar'
              ? 'خوارزمية ذكية تقترح عليك الوظائف المناسبة لمهاراتك وخبرتك'
              : 'Smart Algorithm Suggests Suitable Jobs For Your Skills And Experience',
        },
        {
          icon: '⚡',
          title: language === 'ar' ? 'تقديم سريع' : 'Quick Apply',
          description:
            language === 'ar'
              ? 'قدم على الوظائف بنقرة واحدة مع ملفك الشخصي المحدث'
              : 'Apply To Jobs With One Click Using Your Updated Profile',
        },
        {
          icon: '🔒',
          title: language === 'ar' ? 'أمان وثقة' : 'Security & Trust',
          description:
            language === 'ar'
              ? 'جميع الشركات والوظائف محققة لضمان تجربة آمنة وموثوقة'
              : 'All Companies & Jobs Are Verified To Ensure A Safe And Trusted Experience',
        },
        {
          icon: '📈',
          title: language === 'ar' ? 'تطوير مهني' : 'Career Development',
          description:
            language === 'ar'
              ? 'موارد وأدوات لتطوير مهاراتك والتقدم في مسيرتك المهنية'
              : 'Resources & Tools To Develop Your Skills And Advance Your Career',
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
      heroButton2: language === 'ar' ? 'قيّم الفريق' : 'Evaluate Team',
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
      testimonialsTitle:
        language === 'ar' ? 'ماذا يقول أصحاب العمل' : 'What Our User’s Say',
      testimonialsSubtitle:
        language === 'ar'
          ? 'شركات ناجحة وجدت أفضل المواهب الرياضية معنا'
          : 'Successful companies that found the best sports talents with us',
      featuresTitle:
        language === 'ar'
          ? 'لماذا TF1 للتوظيف؟'
          : 'Why SportX for recruitment?',
      featuresSubtitle:
        language === 'ar'
          ? 'منصة متقدمة لاكتشاف وتوظيف أفضل المواهب الرياضية'
          : 'Advanced Platform for Discovering & Recruiting the Best Sports Talents',
      testimonials: [
        {
          name: language === 'ar' ? 'خالد السعيد' : 'Khalid Al-Saeed',
          role:
            language === 'ar'
              ? 'مدير الموارد البشرية'
              : 'Human Resources Manager',
          company: language === 'ar' ? 'نادي النصر' : 'Al Nassr Club',
          content:
            language === 'ar'
              ? 'وجدنا أفضل المدربين والمختصين من خلال SportX. المنصة وفرت علينا الكثير من الوقت والجهد.'
              : 'We Found the Best Coaches & Specialists Through SportX. The Platform Saved Us A Lot Of Time & Effort.',
          rating: 5,
        },
        {
          name: language === 'ar' ? 'نورا عبدالله' : 'Nora Abdullah',
          role: language === 'ar' ? 'مديرة التوظيف' : 'Recruitment Manager',
          company:
            language === 'ar'
              ? 'مجمع اللياقة الرياضية'
              : 'Sports Fitness Complex',
          content:
            language === 'ar'
              ? 'جودة المرشحين ممتازة والأدوات سهلة الاستخدام. وظفنا 15 موظف في شهر واحد!'
              : 'The Quality of Candidates Is Excellent & The Tools Are Easy To Use. We Hired 15 Employees In One Month!',
          rating: 5,
        },
        {
          name: language === 'ar' ? 'عبدالرحمن محمد' : 'Abdulrahman Mohammed',
          role: language === 'ar' ? 'مؤسس' : 'Founder',
          company:
            language === 'ar'
              ? 'أكاديمية الرياضة المتطورة'
              : 'Advanced Sports Academy',
          content:
            language === 'ar'
              ? 'المنصة ساعدتنا في بناء فريق عمل متميز من المختصين في جميع المجالات الرياضية.'
              : 'The Platform Saved Us A Lot Of Time & Effort. We Built An Outstanding Team Of Specialists In All Sports Fields.',
          rating: 4,
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
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-xl border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
                  >
                    <FootballWipeText transitionKey={mode}>
                      {mode === 'application'
                        ? t('exploreOpportunities')
                        : t('evaluateTeam')}
                    </FootballWipeText>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Categories Section */}
      <section
        className={`py-12 sm:py-16 ${content[mode].gradientClass} overflow-hidden`}
      >
        <div className="w-full px-4 sm:px-6 relative">
          <motion.h2
            className="text-2xl sm:text-3xl font-bold text-white text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.8,
              type: 'spring',
              stiffness: 100,
              damping: 15,
            }}
            viewport={{ once: true, margin: '-100px' }}
          >
            {t('targetCategories')}
          </motion.h2>
          {/* Carousel wrapper */}
          <div className="relative">
            {/* Scrollable container */}
            <div
              ref={carouselRef}
              className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-8 px-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  className="bg-white rounded-xl p-6 sm:p-8 text-center shadow-lg relative overflow-hidden flex-shrink-0 w-64 sm:w-80 snap-start"
                  initial={{ opacity: 0, y: 50, rotateY: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    type: 'spring',
                    stiffness: 100,
                  }}
                  viewport={{ once: true, margin: '-50px' }}
                  whileHover={{
                    scale: 1.08,
                    rotateY: 5,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                    transition: { duration: 0.3 },
                  }}
                >
                  {/* Hover Background Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div
                    className="text-4xl sm:text-5xl mb-4 sm:mb-6 relative z-10"
                    whileHover={{
                      scale: 1.2,
                      rotate: [0, -10, 10, -10, 0],
                      transition: { duration: 0.6 },
                    }}
                  >
                    {category.icon}
                  </motion.div>
                  <div className="text-sm sm:text-base font-medium text-gray-700 relative z-10">
                    {language === 'ar' ? category.nameAr : category.nameEn}
                  </div>
                  {/* Decorative Elements */}
                  <motion.div
                    className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-blue-400 to-green-400 rounded-full opacity-0"
                    whileHover={{
                      opacity: 1,
                      scale: [1, 1.5, 1],
                      transition: { duration: 0.5 },
                    }}
                  />
                </motion.div>
              ))}
            </div>
            {/* Navigation buttons */}
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors z-10"
              onClick={() => {
                if (carouselRef.current) {
                  carouselRef.current.scrollBy({
                    left: -200,
                    behavior: 'smooth',
                  })
                }
              }}
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors z-10"
              onClick={() => {
                if (carouselRef.current) {
                  carouselRef.current.scrollBy({
                    left: 200,
                    behavior: 'smooth',
                  })
                }
              }}
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
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

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-br from-gray-900 to-blue-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <FootballWipeText
              transitionKey={mode}
              className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4"
            >
              <h2 className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                {content[mode].testimonialsTitle}
              </h2>
            </FootballWipeText>
            <FootballWipeText
              transitionKey={mode}
              className="text-white text-base sm:text-lg"
            >
              <p>{content[mode].testimonialsSubtitle}</p>
            </FootballWipeText>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {content[mode].testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm relative overflow-hidden"
                initial={{ opacity: 0, y: 50, rotateX: -15, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.15,
                  type: 'spring',
                  stiffness: 100,
                  damping: 15,
                }}
                viewport={{ once: true, margin: '-50px' }}
                whileHover={{
                  y: -5,
                  scale: 1.02,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  transition: { duration: 0.3 },
                }}
              >
                <div className="flex text-yellow-500 mb-3 sm:mb-4 text-sm sm:text-base">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: i * 0.1 + index * 0.2,
                      }}
                      viewport={{ once: true }}
                      whileHover={{
                        scale: 1.3,
                        rotate: 360,
                        transition: { duration: 0.3 },
                      }}
                    >
                      ★
                    </motion.span>
                  ))}
                </div>

                {/* Quote decoration */}
                <motion.div
                  className="absolute top-2 left-2 text-6xl text-blue-100 opacity-50 leading-none"
                  initial={{ opacity: 0, rotate: -15 }}
                  whileInView={{ opacity: 0.3, rotate: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  “
                </motion.div>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base mr-3 sm:mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm sm:text-base">
                      {testimonial.name}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      {testimonial.role}
                    </div>
                    <div className="text-xs text-gray-400">
                      {testimonial.company}
                    </div>
                  </div>
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
                  ? 'منصة الرياضة الأولى عالمياً لربط المواهب بالفرص'
                  : "The world's #1 sports platform connecting talent with opportunities"}
              </p>
              <div className="flex gap-4">
                <a
                  href="https://facebook.com"
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
