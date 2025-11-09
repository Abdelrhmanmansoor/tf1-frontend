/* eslint-disable no-unused-vars */
'use client'

import { motion } from 'framer-motion'

type SwitcherMode = 'application' | 'recruitment'

interface ArabicSwitcherProps {
  mode: SwitcherMode
  setMode: (mode: SwitcherMode) => void
}

export function ArabicSwitcher({ mode, setMode }: ArabicSwitcherProps) {
  return (
    <motion.div
      className="flex justify-center mb-8 sm:mb-12"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="bg-gray-100 rounded-full p-1 flex relative">
        <motion.div
          className={`absolute inset-1 rounded-full ${
            mode === 'application'
              ? 'bg-gradient-to-r from-blue-600 to-blue-500'
              : 'bg-gradient-to-r from-green-500 to-green-600'
          } shadow-md`}
          initial={false}
          animate={{
            x: mode === 'application' ? '-100%' : '0%',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          style={{ width: '50%' }}
        />
        <button
          onClick={() => setMode('recruitment')}
          className={`relative z-10 px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium transition-colors duration-200 ${
            mode === 'recruitment'
              ? 'text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          التوظيف
        </button>
        <button
          onClick={() => setMode('application')}
          className={`relative z-10 px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium transition-colors duration-200 ${
            mode === 'application'
              ? 'text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          التقديم
        </button>
      </div>
    </motion.div>
  )
}
