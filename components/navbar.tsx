'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LanguageSelector } from './language-selector'
import { useLanguage } from '@/contexts/language-context'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { X } from 'lucide-react'

interface NavbarProps {
  activeMode: 'application' | 'recruitment'
  activePage?: string
}

export function Navbar({ activeMode, activePage = 'home' }: NavbarProps) {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState(activePage)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { id: 'home', label: t('home') },
    { id: 'jobs', label: t('jobs') },
    { id: 'about', label: t('about') },
    { id: 'features', label: t('features') },
    { id: 'contact', label: t('contact') },
  ]

  return (
    <header className="bg-white shadow-sm px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-50 backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <motion.div
          className="flex items-center"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold">
            SportX
          </div>
        </motion.div>

        {/* Centered Navigation */}
        <nav className="hidden lg:flex items-center">
          <div className="bg-gray-50 rounded-full p-1 flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.id === 'home' ? '/' : `/${item.id}`}
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

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <LanguageSelector />

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/register">
              <Button
