'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'

interface TypingIndicatorProps {
  userName?: string
  userNameAr?: string
}

export function TypingIndicator({
  userName,
  userNameAr,
}: TypingIndicatorProps) {
  const { language } = useLanguage()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex items-center gap-2 mb-4"
    >
      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
        {userName?.charAt(0).toUpperCase() || '?'}
      </div>
      <div className="bg-gray-100 rounded-2xl px-4 py-3">
        <div className="flex items-center gap-1">
          <motion.div
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
          />
        </div>
      </div>
      {userName && (
        <p className="text-xs text-gray-500">
          {language === 'ar'
            ? `${userNameAr || userName} يكتب...`
            : `${userName} is typing...`}
        </p>
      )}
    </motion.div>
  )
}
