'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'
import Link from 'next/link'
import { CheckCircle, Home, LogIn } from 'lucide-react'

export default function ResetPasswordSuccessPage() {
  const { language } = useLanguage()

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-6 ${language === 'ar' ? 'font-arabic' : 'font-english'}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <motion.div
        className="max-w-md w-full text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 0.8, delay: 0.2 }}
            className="text-green-500 mb-6"
          >
            <CheckCircle className="w-20 h-20 mx-auto" />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {language === 'ar'
                ? 'تم تغيير كلمة المرور!'
                : 'Password Reset Successfully!'}
            </h1>

            <p className="text-gray-600 mb-8 leading-relaxed">
              {language === 'ar'
                ? 'تم إعادة تعيين كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.'
                : 'Your password has been successfully reset. You can now log in with your new password.'}
            </p>
          </motion.div>

          <motion.div
            className="space-y-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              asChild
              className="w-full h-12 bg-green-600 hover:bg-green-700"
            >
              <Link href="/login">
                <LogIn className="w-5 h-5 mr-2" />
                {language === 'ar' ? 'تسجيل الدخول الآن' : 'Login Now'}
              </Link>
            </Button>

            <Button asChild variant="outline" className="w-full h-12">
              <Link href="/">
                <Home className="w-5 h-5 mr-2" />
                {language === 'ar'
                  ? 'العودة للصفحة الرئيسية'
                  : 'Back to Homepage'}
              </Link>
            </Button>
          </motion.div>

          <motion.div
            className="mt-8 pt-6 border-t border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-sm text-gray-500">
              {language === 'ar'
                ? '💡 تأكد من استخدام كلمة مرور قوية واحفظها في مكان آمن'
                : '💡 Make sure to use a strong password and keep it secure'}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
