/* eslint-disable no-unused-vars */
'use client'

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'

type Language = 'ar' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  ar: {
    // Navigation
    home: 'الرئيسية',
    jobs: 'الوظائف',
    about: 'عن المنصة',
    features: 'المزايا',
    contact: 'تواصل معنا',
    blog: 'المدونة',
    register: 'إنشاء حساب',
    login: 'تسجيل الدخول',

    // Switcher
    application: 'التقديم',
    recruitment: 'التوظيف',

    // Hero Section
    heroTitleApplication: 'فرصتك تبدأ من هنا',
    heroTitleRecruitment: ' نمكّن مواهبك ونوصّل فرصك',
    searchJobsPlaceholder: 'ابحث عن فرص العمل...',
    searchTalentsPlaceholder: 'ابحث عن المواهب الرياضية...',
    joinNow: 'انضم الآن',
    exploreOpportunities: 'استكشف الفرص',
    attractTalents: 'إضافة وظيفة',
    Contract With Us: 'تعاقد معنا ',

    // Categories
    targetCategories: 'الفئات المستهدفة',
    player: 'اللاعب',
    coach: 'المدرب',
    club: 'النادي',
    fitnessTrainer: 'مدرب لياقة بدنية',
    naturalField: 'ملعب طبيعي',
    nutritionist: 'أخصائي تغذية',
    smartSolution: 'حل الأذكى',

    // Opportunities
    availableJobs: 'الفرص الوظيفية المتاحة',
    latestJobsDesc: 'اكتشف أحدث الوظائف في المجال الرياضي',
    distinguishedTalents: 'المواهب المتميزة',
    bestTalentsDesc: 'اكتشف أفضل المواهب الرياضية المتاحة للتوظيف',
    applyNow: 'تقدم الآن',
    viewProfile: 'عرض الملف',

    // Reviews
    userReviews: 'آراء المستخدمين',
    reviewText: 'المنصة ساعدتني في إيجاد فرص عمل مميزة بسرعة وسهولة',
    reviewerName: 'أحمد محمد',
    reviewerTitle: 'مدرب رياضي',

    // CTA
    startJourneyToday: 'ابدأ رحلتك الرياضية اليوم!',

    // Footer
    quickLinks: 'رابطة سريعة',
    termsConditions: 'الشروط والأحكام',
    copyright: '© 2025 منصتك الرياضية. جميع الحقوق محفوظة',
  },
  en: {
    // Navigation
    home: 'Home',
    jobs: 'Jobs',
    about: 'About',
    features: 'Features',
    blog:'blog',
    contact: 'Contact Us',
    register: 'Register',
    login: 'Login',

    // Switcher
    application: 'Application',
    recruitment: 'Recruitment',

    // Hero Section
    heroTitleApplication: 'Your gateway to new opportunities',
    heroTitleRecruitment:
      'Discover Talents and Post Your Opportunities with Ease',
    searchJobsPlaceholder: 'Search for job opportunities...',
    searchTalentsPlaceholder: 'Search for sports talents...',
    joinNow: 'Join Now',
    exploreOpportunities: 'Explore Opportunities',
    attractTalents: 'Attract Talents',
    heroButton2: 'Contract With Us',

    // Categories
    targetCategories: 'Target Categories',
    player: 'Player',
    coach: 'Coach',
    club: 'Club',
    fitnessTrainer: 'Fitness Trainer',
    naturalField: 'Natural Field',
    nutritionist: 'Nutritionist',
    smartSolution: 'Smart Solution',

    // Opportunities
    availableJobs: 'Available Job Opportunities',
    latestJobsDesc: 'Discover the latest jobs in the sports field',
    distinguishedTalents: 'Distinguished Talents',
    bestTalentsDesc:
      'Discover the best sports talents available for employment',
    applyNow: 'Apply Now',
    viewProfile: 'View Profile',

    // Reviews
    userReviews: 'User Reviews',
    reviewText:
      'The platform helped me find excellent job opportunities quickly and easily',
    reviewerName: 'Ahmed Mohammed',
    reviewerTitle: 'Sports Coach',

    // CTA
    startJourneyToday: 'Start Your Sports Journey Today!',

    // Footer
    quickLinks: 'Quick Links',
    termsConditions: 'Terms & Conditions',
    copyright: '© 2025 Your Sports Platform. All rights reserved',
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar')

  const t = (key: string): string => {
    return (
      translations[language][key as keyof (typeof translations)['ar']] || key
    )
  }

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
