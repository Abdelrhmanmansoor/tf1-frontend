'use client'

import { useLanguage } from '@/contexts/language-context'
import Link from 'next/link'
import Image from 'next/image'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin 
} from 'lucide-react'
import { motion } from 'framer-motion'

export function Footer() {
  const { language } = useLanguage()

  const contactInfo = {
    phone: '+966 50 123 4567',
    email: 'contact@tf1one.com',
    address: language === 'ar' 
      ? 'الرياض، المملكة العربية السعودية' 
      : 'Riyadh, Saudi Arabia'
  }

  const socialLinks = [
    { 
      name: 'Facebook', 
      icon: Facebook, 
      url: 'https://www.facebook.com/', 
      color: 'hover:text-blue-400 hover:border-blue-400',
      bgGradient: 'from-blue-500/20 to-blue-600/20'
    },
    { 
      name: 'Twitter', 
      icon: Twitter, 
      url: 'https://twitter.com/', 
      color: 'hover:text-cyan-400 hover:border-cyan-400',
      bgGradient: 'from-cyan-500/20 to-blue-500/20'
    },
    { 
      name: 'Instagram', 
      icon: Instagram, 
      url: 'https://www.instagram.com/', 
      color: 'hover:text-pink-400 hover:border-pink-400',
      bgGradient: 'from-pink-500/20 to-purple-500/20'
    },
    { 
      name: 'LinkedIn', 
      icon: Linkedin, 
      url: 'https://www.linkedin.com/', 
      color: 'hover:text-blue-300 hover:border-blue-300',
      bgGradient: 'from-blue-600/20 to-blue-700/20'
    },
    { 
      name: 'Snapchat', 
      icon: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
        </svg>
      ),
      url: 'https://www.snapchat.com/add/tf1sports',
      color: 'hover:text-yellow-300 hover:border-yellow-300',
      bgGradient: 'from-yellow-500/20 to-yellow-600/20'
    }
  ]

  const quickLinks = [
    { name: language === 'ar' ? 'عن المنصة' : 'About', url: '/about' },
    { name: language === 'ar' ? 'الوظائف' : 'Jobs', url: '/jobs' },
    { name: language === 'ar' ? 'الميزات' : 'Features', url: '/features' },
    { name: language === 'ar' ? 'اتصل بنا' : 'Contact', url: '/contact' },
  ]

  const legalLinks = [
    { name: language === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions', url: '/terms' },
    { name: language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy', url: '/privacy' },
    { name: language === 'ar' ? 'الأسئلة الشائعة' : 'FAQ', url: '/faq' },
    { name: language === 'ar' ? 'مركز المساعدة' : 'Help Center', url: '/help-center' },
  ]

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand & Description */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image 
                src="/logo.png"
                alt="TF1 Logo"
                width={80}
                height={80}
                className="hover:scale-105 transition-transform duration-200"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              {language === 'ar'
                ? 'منصة التوظيف الرياضية الرائدة في المملكة العربية السعودية. نربط المواهب بالفرص في القطاع الرياضي.'
                : 'Leading sports recruitment platform in Saudi Arabia. Connecting talent with opportunities in the sports sector.'}
            </p>
            
            {/* Social Media - Beautiful Modern Design */}
            <div className="flex gap-4 pt-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon
                return (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.15, translateY: -4 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`w-12 h-12 bg-gradient-to-br ${social.bgGradient} border border-gray-600 rounded-full flex items-center justify-center transition-all duration-300 ${social.color} text-gray-300 backdrop-blur-sm hover:shadow-lg`}
                    aria-label={social.name}
                  >
                    <IconComponent className="w-5 h-5" />
                  </motion.a>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              {language === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.url}>
                  <Link 
                    href={link.url}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              {language === 'ar' ? 'قانوني' : 'Legal'}
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.url}>
                  <Link 
                    href={link.url}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-gray-400">
                <Phone className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-400" />
                <a 
                  href={`tel:${contactInfo.phone}`}
                  className="hover:text-white transition-colors duration-200"
                  dir="ltr"
                >
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <Mail className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-400" />
                <a 
                  href={`mailto:${contactInfo.email}`}
                  className="hover:text-white transition-colors duration-200"
                >
                  {contactInfo.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-400" />
                <span>{contactInfo.address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Government Logos Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-row flex-nowrap items-center justify-center gap-2 sm:gap-4 lg:gap-6">
            {/* Ministry of Commerce Logo */}
            <a 
              href="https://mc.gov.sa" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex-shrink-0"
            >
              <div className="bg-white rounded-lg p-2 sm:p-3 md:p-4 transition-all duration-300 hover:shadow-lg hover:scale-110 w-20 h-20 sm:w-28 sm:h-28 md:w-40 md:h-40 flex items-center justify-center shadow-sm">
                <Image 
                  src="/ministry-commerce.png"
                  alt={language === 'ar' ? 'وزارة التجارة' : 'Ministry of Commerce'}
                  width={80}
                  height={80}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
            </a>

            {/* Business Center Logo */}
            <a 
              href="https://maroof.sa" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex-shrink-0"
            >
              <div className="bg-white rounded-lg p-2 sm:p-3 md:p-4 transition-all duration-300 hover:shadow-lg hover:scale-110 w-20 h-20 sm:w-28 sm:h-28 md:w-40 md:h-40 flex items-center justify-center shadow-sm">
                <Image 
                  src="/business-center.png"
                  alt={language === 'ar' ? 'مركز الأعمال السعودي' : 'Saudi Business Center'}
                  width={80}
                  height={80}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
            </a>

            {/* Vision 2030 Logo */}
            <a 
              href="https://www.vision2030.gov.sa" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex-shrink-0"
            >
              <div className="bg-white rounded-lg p-2 sm:p-3 md:p-4 transition-all duration-300 hover:shadow-lg hover:scale-110 w-20 h-20 sm:w-28 sm:h-28 md:w-40 md:h-40 flex items-center justify-center shadow-sm">
                <Image 
                  src="/vision-2030.png"
                  alt={language === 'ar' ? 'رؤية المملكة 2030' : 'Saudi Vision 2030'}
                  width={80}
                  height={80}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <p className="text-center text-gray-500 text-xs sm:text-sm">
            {language === 'ar'
              ? '© 2025 منصة TF1. جميع الحقوق محفوظة.'
              : '© 2025 TF1 Platform. All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  )
}
