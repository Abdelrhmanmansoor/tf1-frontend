'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { LanguageSelector } from './language-selector'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/contexts/auth-context'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { X } from 'lucide-react'
import NotificationBell from '@/components/notifications/NotificationBell'

interface NavbarProps {
  activeMode: 'application' | 'recruitment'
  activePage?: string
}

interface NavItem {
  id: string
  label: string
  href?: string
}

export function Navbar({ activeMode, activePage = 'home' }: NavbarProps) {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState(activePage)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const navItems: NavItem[] = [
    { id: 'home', label: t('home') },
    { id: 'jobs', label: t('jobs') },
    { id: 'match-center', label: t('matches'), href: '/matches' },
    { id: 'about', label: t('about') },
    { id: 'features', label: t('features') },
    { id: 'blog', label: t('blog') },
    { id: 'contact', label: t('contact') },
  ]

  return (
    <header className="bg-white shadow-sm px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-50 backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo - Clickable to Home */}
        <Link href="/">
          <motion.div
            className="flex items-center cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            {/* لوجو بدون خلفية */}
            <div className="flex items-center justify-center">
              <Image src="/logo.png" alt="TF1 Logo" width={60} height={60} />
            </div>
          </motion.div>
        </Link>

        {/* Centered Navigation */}
        <nav className="hidden lg:flex items-center">
          <div className="bg-gray-50 rounded-full p-1 flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href || (item.id === 'home' ? '/' : `/${item.id}`)}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  activeTab === item.id
                    ? 'text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                {activeTab === item.id && (
                  <motion.div
                    layoutId="activeBackground"
                    className={`absolute inset-0 rounded-full ${
                      activeMode === 'application'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500'
                        : 'bg-gradient-to-r from-green-500 to-green-600'
                    }`}
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <LanguageSelector />

          {!user && (
            <>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/register">
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden sm:block border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 px-3 sm:px-4"
                  >
                    {t('register')}
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/login">
                  <Button
                    size="sm"
                    className={`px-3 sm:px-4 py-2 text-xs sm:text-sm ${
                      activeMode === 'application'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600'
                        : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                    } transition-all duration-300 shadow-md hover:shadow-lg`}
                  >
                    {t('login')}
                  </Button>
                </Link>
              </motion.div>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(true)}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-3/4 max-w-sm bg-white shadow-2xl z-50 lg:hidden"
            >
              {/* Close + Logo */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="TF1 Logo"
                    width={48}
                    height={48}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Mobile Navigation */}
              <nav className="p-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.id}
                    href={
                      item.href || (item.id === 'home' ? '/' : `/${item.id}`)
                    }
                    onClick={() => {
                      setActiveTab(item.id)
                      setMobileMenuOpen(false)
                    }}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeTab === item.id
                        ? activeMode === 'application'
                          ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md'
                          : 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Action Buttons */}
              <div className="p-4 space-y-3 border-t mt-auto absolute bottom-0 left-0 right-0">
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  >
                    {t('register')}
                  </Button>
                </Link>

                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    className={`w-full ${
                      activeMode === 'application'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600'
                        : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                    } transition-all duration-300 shadow-md hover:shadow-lg`}
                  >
                    {t('login')}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
