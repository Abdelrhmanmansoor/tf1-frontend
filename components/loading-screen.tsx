'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'

export function LoadingScreen() {
  const { language } = useLanguage()

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Logo Animation */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-8 py-4 rounded-2xl text-2xl font-bold shadow-lg">
            TF1
          </div>
        </motion.div>

        {/* Animated Football */}
        <div className="relative mb-8">
          <motion.div
            className="w-16 h-16 mx-auto"
            animate={{
              rotate: 360,
              y: [0, -20, 0],
            }}
            transition={{
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <div className="text-6xl">⚽</div>
          </motion.div>
          
          {/* Bouncing Shadow */}
          <motion.div
            className="w-8 h-2 bg-gray-300/50 rounded-full mx-auto"
            animate={{
              scale: [1, 0.8, 1],
              opacity: [0.5, 0.3, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Loading Text */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </h2>
          <p className="text-gray-600">
            {language === 'ar' ? 'نحضر لك أفضل تجربة رياضية' : 'Preparing your sports experience'}
          </p>
        </motion.div>

        {/* Animated Progress Dots */}
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-green-500"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Floating Sports Icons */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {['🏀', '🏈', '🎾', '🏐', '🏓', '🥅'].map((emoji, index) => (
            <motion.div
              key={index}
              className="absolute text-2xl opacity-20"
              style={{
                left: `${20 + (index * 15)}%`,
                top: `${30 + (index % 2) * 40}%`
              }}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 360],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{
                duration: 3 + (index * 0.5),
                repeat: Infinity,
                delay: index * 0.8,
                ease: "easeInOut"
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