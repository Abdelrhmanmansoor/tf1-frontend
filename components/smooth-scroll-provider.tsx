'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'

interface SmoothScrollProviderProps {
  children: React.ReactNode
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const { language } = useLanguage()
  const [isScrolling, setIsScrolling] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [floatingElements, setFloatingElements] = useState<
    Array<{
      id: string
      emoji: string
      x: number
      y: number
      rotation: number
      scale: number
    }>
  >([])

  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()

  // Sports emojis for floating elements
  const sportsEmojis = useMemo(
    () => [
      '⚽',
      '🏀',
      '🏈',
      '🎾',
      '🏐',
      '🏓',
      '⚾',
      '🥎',
      '🏑',
      '🏒',
      '🥅',
      '🏆',
      '🥇',
      '🎯',
    ],
    []
  )

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout

    const handleScroll = () => {
      setIsScrolling(true)

      // Create floating elements during scroll
      if (Math.random() < 0.3) {
        // 30% chance per scroll event
        const newElement = {
          id: Date.now().toString(),
          emoji: sportsEmojis[Math.floor(Math.random() * sportsEmojis.length)],
          x: Math.random() * window.innerWidth,
          y: window.scrollY + Math.random() * window.innerHeight,
          rotation: Math.random() * 360,
          scale: 0.5 + Math.random() * 0.5,
        }

        setFloatingElements((prev) => [...prev.slice(-8), newElement]) // Keep only last 8 elements
      }

      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false)
      }, 150)
    }

    const updateScrollProgress = () => {
      const element = containerRef.current
      if (element) {
        const scrollTop = window.scrollY
        const docHeight = document.body.scrollHeight - window.innerHeight
        const progress = (scrollTop / docHeight) * 100
        setScrollProgress(progress)
      }
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('scroll', updateScrollProgress)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('scroll', updateScrollProgress)
      clearTimeout(scrollTimeout)
    }
  }, [sportsEmojis])

  // Clean up old floating elements
  useEffect(() => {
    const cleanup = setInterval(() => {
      setFloatingElements((prev) => prev.slice(-5))
    }, 3000)

    return () => clearInterval(cleanup)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-green-500 to-blue-600 z-50 origin-left"
        style={{
          scaleX: useTransform(scrollYProgress, [0, 1], [0, 1]),
        }}
      />

      {/* Scroll Progress Indicator */}
      <motion.div
        className={`fixed ${language === 'ar' ? 'left-6' : 'right-6'} top-1/2 -translate-y-1/2 z-40`}
        initial={{ opacity: 0 }}
        animate={{
          opacity: scrollProgress > 5 ? 1 : 0,
          scale: isScrolling ? 1.2 : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative">
          {/* Circular Progress */}
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="rgba(0,0,0,0.1)"
              strokeWidth="8"
              fill="none"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${scrollProgress * 2.83} 283`}
              transition={{ duration: 0.1 }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="50%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Icon */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center text-2xl"
            animate={{
              rotate: isScrolling ? 360 : 0,
              scale: isScrolling ? 1.3 : 1,
            }}
            transition={{
              rotate: { duration: 0.8, ease: 'easeOut' },
              scale: { duration: 0.2 },
            }}
          >
            ⚽
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Sports Elements */}
      <AnimatePresence>
        {floatingElements.map((element) => (
          <motion.div
            key={element.id}
            className="fixed pointer-events-none z-30"
            initial={{
              x: element.x,
              y: element.y,
              opacity: 0,
              scale: 0,
              rotate: 0,
            }}
            animate={{
              x: element.x + (Math.random() - 0.5) * 200,
              y: element.y - 200,
              opacity: [0, 0.8, 0],
              scale: [0, element.scale, 0],
              rotate: element.rotation,
            }}
            exit={{
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: 2,
              ease: 'easeOut',
            }}
            style={{ fontSize: '2rem' }}
          >
            {element.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Scroll Velocity Indicator */}
      <motion.div
        className={`fixed ${language === 'ar' ? 'right-6' : 'left-6'} bottom-20 z-40`}
        initial={{ opacity: 0 }}
        animate={{
          opacity: isScrolling ? 1 : 0,
          scale: isScrolling ? 1 : 0.8,
        }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="bg-white/90 backdrop-blur-md rounded-full p-3 shadow-lg border border-gray-200"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <motion.div
            className="text-2xl"
            animate={{
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            🏃‍♂️
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Section Transition Effects */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-20"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isScrolling ? 0.05 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-green-500/20" />

        {/* Animated Lines */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute top-0 w-px bg-gradient-to-b from-transparent via-blue-400 to-transparent h-full opacity-30`}
            style={{ left: `${20 + i * 30}%` }}
            animate={{
              scaleY: isScrolling ? 1 : 0,
              opacity: isScrolling ? 0.3 : 0,
            }}
            transition={{
              duration: 0.4,
              delay: i * 0.1,
            }}
          />
        ))}
      </motion.div>

      {/* Particle Trail Effect */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-10"
        animate={{
          background: isScrolling
            ? `radial-gradient(circle at ${scrollProgress}% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)`
            : 'transparent',
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Main Content */}
      {children}

      {/* Scroll Hint (appears at bottom) */}
      <motion.div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: scrollProgress < 95 && scrollProgress > 80 ? 1 : 0,
          y: scrollProgress < 95 && scrollProgress > 80 ? 0 : 20,
        }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="bg-white/90 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-gray-200 flex items-center gap-2"
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <span className="text-sm text-gray-600">
            {language === 'ar' ? 'تقريباً انتهينا! 🏁' : 'Almost there! 🏁'}
          </span>
        </motion.div>
      </motion.div>
    </div>
  )
}
