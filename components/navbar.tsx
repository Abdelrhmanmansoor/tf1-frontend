'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { LanguageSelector } from './language-selector'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/contexts/auth-context'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { X, ChevronDown, Shield } from 'lucide-react'
import { JobTicker } from './job-ticker'
import { getDashboardRoute } from '@/utils/role-routes'
// import NotificationBell from '@/components/notifications/NotificationBell'

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
  const { t, language } = useLanguage()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState(activePage)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [moreMenuOpen, setMoreMenuOpen] = useState(false)
  const [effectiveRole, setEffectiveRole] = useState<string | null>(null)

  const roleLabels: Record<string, string> = {
    applicant: t('applicant'),
    player: t('player'),
    coach: t('coach'),
    club: t('club'),
    specialist: t('specialist'),
    administrator: t('administrator'),
    'age-group-supervisor': t('age-group-supervisor'),
    'sports-director': t('sports-director'),
    'executive-director': t('executive-director'),
    secretary: t('secretary'),
    'sports-administrator': t('sports-administrator'),
    team: 'Team',
    leader: 'Leader',
  }

  useEffect(() => {
    if (user?.role) {
      setEffectiveRole(user.role)
    }
  }, [user])

  const navItems: NavItem[] = [
    { id: 'home', label: t('home') },
    { id: 'jobs', label: t('jobs') },
    { id: 'cv-builder', label: t('cvBuilder'), href: '/jobs/cv-builder' },
    { id: 'matches', label: language === 'ar' ? 'مركز المباريات' : 'Matches Center', href: '/matches/dashboard' },
    { id: 'about', label: t('about') },
    { id: 'features', label: t('features') },
    { id: 'blog', label: t('blog') },
    { id: 'contact', label: t('contact') },
  ]

  return (
    <>
      <JobTicker />
      <header className="bg-white shadow-sm px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-50 backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo - Clickable to Home */}
        <div className="flex items-center gap-3">
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

          {/* Official Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="hidden md:flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-1.5 rounded-full border border-green-200"
            role="status"
            aria-label={language === 'ar' ? 'منصة موثقة رسمياً' : 'Officially Verified Platform'}
          >
            <Shield className="w-4 h-4 text-green-600" aria-hidden="true" />
            <span className="text-xs font-semibold text-green-700">
              {t('verified') || (language === 'ar' ? 'موثق رسمياً' : 'Verified')}
            </span>
          </motion.div>
        </div>

        {/* Centered Navigation */}
        <nav className="hidden lg:flex items-center">
          <div className="bg-gray-50 rounded-full p-1 flex items-center gap-1 relative">
            {/* Primary Items - Visible on all large screens */}
            {navItems.slice(0, 3).map((item) => (
              <Link
                key={item.id}
                href={item.href || (item.id === 'home' ? '/' : `/${item.id}`)}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-3 xl:px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
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

            {/* Secondary Items - Visible only on Extra Large screens (xl) */}
            <div className="hidden xl:flex items-center">
              {navItems.slice(3, 5).map((item) => (
                <Link
                  key={item.id}
                  href={item.href || (item.id === 'home' ? '/' : `/${item.id}`)}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                    activeTab === item.id
                      ? 'text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  {activeTab === item.id && (
                    <motion.div
                      layoutId="activeBackground-secondary"
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

            {/* More Dropdown - Logic adjusted for screen sizes */}
            <div className="relative lg:block">
              <button
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 flex items-center gap-1 ${
                  // Check if any item in the "More" menu is active
                  // On lg (hidden xl): items 3+ are in menu
                  // On xl: items 5+ are in menu
                  (navItems.slice(5).some(i => i.id === activeTab) || 
                   (navItems.slice(3, 5).some(i => i.id === activeTab) && typeof window !== 'undefined' && window.innerWidth < 1280)) // Approximation, better handled by CSS
                    ? 'text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
                aria-expanded={moreMenuOpen}
                aria-label={t('more') || 'More'}
              >
                {/* Active background logic for More button is complex due to responsive split, simplified here */}
                <span className="relative z-10 flex items-center gap-1">
                  {t('more') || 'More'}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      moreMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </span>
              </button>

              <AnimatePresence>
                {moreMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full rtl:right-0 ltr:left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 py-1"
                    style={{ minWidth: '12rem' }}
                  >
                    {/* Items 3 and 4: Visible in menu ONLY on lg (hidden on xl) */}
                    <div className="xl:hidden">
                      {navItems.slice(3, 5).map((item) => (
                        <Link
                          key={item.id}
                          href={item.href || (item.id === 'home' ? '/' : `/${item.id}`)}
                          onClick={() => {
                            setActiveTab(item.id)
                            setMoreMenuOpen(false)
                          }}
                          className={`block px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
                            activeTab === item.id
                              ? activeMode === 'application'
                                ? 'text-blue-600 font-semibold bg-blue-50'
                                : 'text-green-600 font-semibold bg-green-50'
                              : 'text-gray-700'
                          }`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>

                    {/* Items 5+: Always visible in menu */}
                    {navItems.slice(5).map((item) => (
                      <Link
                        key={item.id}
                        href={item.href || (item.id === 'home' ? '/' : `/${item.id}`)}
                        onClick={() => {
                          setActiveTab(item.id)
                          setMoreMenuOpen(false)
                        }}
                        className={`block px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
                          activeTab === item.id
                            ? activeMode === 'application'
                              ? 'text-blue-600 font-semibold bg-blue-50'
                              : 'text-green-600 font-semibold bg-green-50'
                            : 'text-gray-700'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <LanguageSelector />

          {user && effectiveRole && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href={effectiveRole === 'applicant' ? '/dashboard/applicant' : getDashboardRoute(effectiveRole as any)}>
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:block border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 px-3 sm:px-4"
                >
                  {roleLabels[effectiveRole] || t('login')}
                </Button>
              </Link>
            </motion.div>
          )}

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
    </>
  )
}
