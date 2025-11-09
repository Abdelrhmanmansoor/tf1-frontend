'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Home, Search, ArrowLeft, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import Link from 'next/link'

export default function NotFound() {
  const { language } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-6">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated 404 */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="relative">
            <h1 className="text-9xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              404
            </h1>

            {/* Animated Football */}
            <motion.div
              className="absolute -top-4 right-8 text-4xl"
              animate={{
                rotate: [0, 360],
                y: [0, -10, 0],
              }}
              transition={{
                rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
                y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
              }}
            >
              ⚽
            </motion.div>
          </div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {language === 'ar'
              ? 'عذراً، الصفحة غير موجودة!'
              : 'Oops! Page Not Found'}
          </h2>
          <p className="text-gray-600 text-lg mb-2">
            {language === 'ar'
              ? 'الصفحة التي تبحث عنها قد تكون محذوفة أو غير متاحة حالياً'
              : 'The page you are looking for might have been removed or is temporarily unavailable'}
          </p>
          <p className="text-gray-500">
            {language === 'ar'
              ? 'دعنا نعيدك إلى ملعبك الرئيسي!'
              : "Let's get you back to your home field!"}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              asChild
              size="lg"
              className="px-8 py-4 text-lg rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-xl"
            >
              <Link href="/">
                <Home className="w-5 h-5 mr-2" />
                {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
              </Link>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg rounded-xl border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
              onClick={() => window.history.back()}
            >
              {language === 'ar' ? (
                <>
                  <ArrowRight className="w-5 h-5 mr-2" />
                  العودة للخلف
                </>
              ) : (
                <>
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Go Back
                </>
              )}
            </Button>
          </motion.div>
        </motion.div>

        {/* Search Suggestion */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <div className="flex items-center justify-center mb-4">
            <Search className="w-6 h-6 text-gray-400 mr-3" />
            <h3 className="text-lg font-semibold text-gray-800">
              {language === 'ar'
                ? 'ماذا تبحث عنه؟'
                : 'What are you looking for?'}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { ar: 'الوظائف', en: 'Jobs' },
              { ar: 'المدربين', en: 'Coaches' },
              { ar: 'الأندية', en: 'Clubs' },
              { ar: 'اللاعبين', en: 'Players' },
            ].map((item, index) => (
              <motion.span
                key={index}
                className="px-4 py-2 bg-gradient-to-r from-blue-100 to-green-100 rounded-full text-sm font-medium text-gray-700 cursor-pointer hover:from-blue-200 hover:to-green-200 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {language === 'ar' ? item.ar : item.en}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Floating Sports Icons */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {['🏀', '🏈', '🎾', '🏐', '🏓', '⚾'].map((emoji, index) => (
            <motion.div
              key={index}
              className="absolute text-3xl opacity-10"
              style={{
                left: `${10 + index * 15}%`,
                top: `${20 + (index % 3) * 30}%`,
              }}
              animate={{
                y: [0, -40, 0],
                rotate: [0, 180, 360],
                opacity: [0.05, 0.2, 0.05],
              }}
              transition={{
                duration: 4 + index * 0.5,
                repeat: Infinity,
                delay: index * 1.2,
                ease: 'easeInOut',
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
