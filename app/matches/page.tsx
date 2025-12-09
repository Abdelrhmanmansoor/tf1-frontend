'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import {
  Search,
  UserPlus,
  Trophy,
  CheckCircle,
  Dribbble,
  ArrowRight,
} from 'lucide-react'

export default function MatchesPage() {
  const { language } = useLanguage()

  const steps = [
    {
      icon: Search,
      title: language === 'ar' ? 'تصفّح المباريات' : 'Browse Matches',
      description:
        language === 'ar'
          ? 'استعرض مباريات متنوعة في منطقتك حسب الرياضة والمستوى والموقع'
          : 'Explore various matches in your area by sport, level, and location',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: UserPlus,
      title: language === 'ar' ? 'أنشئ وانضم' : 'Create & Join',
      description:
        language === 'ar'
          ? 'أنشئ مباراتك الخاصة أو انضم لمباريات قائمة بنقرة واحدة'
          : 'Create your own match or join existing ones with a single click',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Trophy,
      title: language === 'ar' ? 'تابع وشارك' : 'Track & Engage',
      description:
        language === 'ar'
          ? 'تابع مبارياتك، تواصل مع اللاعبين، وسجّل إنجازاتك الرياضية'
          : 'Track your matches, connect with players, and record your achievements',
      color: 'from-purple-500 to-pink-500',
    },
  ]

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <Navbar activeMode="application" activePage="matches" />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20"
            animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-20"
            animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-lg">
              <Dribbble className="w-4 h-4" />
              {language === 'ar' ? 'مركز المباريات' : 'Matches Center'}
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {language === 'ar'
                ? 'أهلاً بك في مركز المباريات'
                : 'Welcome to Matches Center'}
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              {language === 'ar'
                ? 'منصتك الشاملة لاكتشاف المباريات الرياضية، إنشاء فرقك، والتواصل مع اللاعبين في منطقتك'
                : 'Your comprehensive platform to discover sports matches, create teams, and connect with players in your area'}
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/matches/register">
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                  {language === 'ar'
                    ? 'سجّل الآن في مركز المباريات'
                    : 'Register Now in Matches Center'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/matches/login">
                <Button
                  variant="outline"
                  className="px-8 py-4 rounded-xl text-lg font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-all"
                >
                  {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {language === 'ar'
                ? 'كيف يعمل مركز المباريات'
                : 'How Matches Center Works'}
            </h2>
            <p className="text-gray-600 text-lg">
              {language === 'ar'
                ? 'ثلاث خطوات بسيطة للبدء في رحلتك الرياضية'
                : 'Three simple steps to start your sports journey'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="relative"
                >
                  {/* Connection Line */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-16 left-full w-full h-1 bg-gradient-to-r from-blue-200 to-transparent -translate-y-1/2" />
                  )}

                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all h-full border-2 border-transparent hover:border-blue-200">
                    <div
                      className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-lg`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        {language === 'ar'
                          ? `الخطوة ${index + 1}`
                          : `Step ${index + 1}`}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-blue-600 via-cyan-500 to-green-500 rounded-3xl p-12 text-white text-center shadow-2xl"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {language === 'ar'
                  ? 'جاهز للبدء؟'
                  : 'Ready to Get Started?'}
              </h2>
              <p className="text-xl mb-8 text-blue-50">
                {language === 'ar'
                  ? 'انضم لآلاف اللاعبين الذين يستخدمون مركز المباريات لتنظيم مبارياتهم الرياضية'
                  : 'Join thousands of players using Matches Center to organize their sports matches'}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/matches/register">
                  <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                    {language === 'ar' ? 'ابدأ الآن' : 'Start Now'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <div className="flex items-center gap-2 text-blue-50">
                  <CheckCircle className="w-5 h-5" />
                  <span>{language === 'ar' ? 'مجاني تماماً' : 'Completely Free'}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
