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
      color: 'hover:bg-[#1877F2]' 
    },
    { 
      name: 'Twitter', 
      icon: Twitter, 
      url: 'https://twitter.com/', 
      color: 'hover:bg-[#1DA1F2]' 
    },
    { 
      name: 'Instagram', 
      icon: Instagram, 
      url: 'https://www.instagram.com/', 
      color: 'hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500' 
    },
    { 
      name: 'LinkedIn', 
      icon: Linkedin, 
      url: 'https://www.linkedin.com/', 
      color: 'hover:bg-[#0A66C2]' 
    },
    { 
      name: 'Snapchat', 
      icon: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.166 3a9.098 9.098 0 0 0-4.795 1.35c-.956.582-1.73 1.398-2.229 2.35-.671 1.274-.87 2.483-.894 3.666v.057c.025 1.183.223 2.392.894 3.666.499.952 1.273 1.768 2.229 2.35a9.098 9.098 0 0 0 4.795 1.35 9.098 9.098 0 0 0 4.795-1.35c.956-.582 1.73-1.398 2.229-2.35.671-1.274.87-2.483.894-3.666v-.057c-.025-1.183-.223-2.392-.894-3.666-.499-.952-1.273-1.768-2.229-2.35A9.098 9.098 0 0 0 12.166 3zm-5.77 13.25l-.085.003c-.247.006-.493-.076-.69-.233a.972.972 0 0 1-.338-.646c-.027-.253.045-.509.203-.719.158-.21.39-.356.649-.408l.102-.012c.142-.007.283.021.413.082.13.06.245.15.336.259.09.11.155.239.188.375.033.137.034.278.003.415-.036.165-.11.32-.214.447-.105.127-.238.225-.388.284a1.097 1.097 0 0 1-.432.077l-.247.002a4.35 4.35 0 0 1-.5.024zm11.208 0l.085.003c.247.006.493-.076.69-.233.196-.156.329-.382.372-.632.043-.25-.002-.507-.126-.72a1.047 1.047 0 0 0-.553-.467c-.233-.085-.491-.085-.724 0a1.047 1.047 0 0 0-.553.467c-.124.213-.169.47-.126.72.043.25.176.476.372.632.197.157.443.239.69.233z"/>
        </svg>
      ),
      url: 'https://www.snapchat.com/add/tf1sports',
      color: 'hover:bg-[#FFFC00] hover:text-black'
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
            
            {/* Social Media */}
            <div className="flex gap-3 pt-2">
              {socialLinks.map((social) => {
                const IconComponent = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center transition-all duration-300 ${social.color}`}
                    aria-label={social.name}
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
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
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8">
            {/* Ministry of Commerce Logo */}
            <a 
              href="https://mc.gov.sa" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group"
            >
              <div className="bg-white rounded-xl p-4 sm:p-5 transition-all duration-300 hover:shadow-xl hover:scale-105 w-32 h-32 sm:w-36 sm:h-36 md:w-44 md:h-44 flex items-center justify-center">
                <Image 
                  src="/ministry-commerce.png"
                  alt={language === 'ar' ? 'وزارة التجارة' : 'Ministry of Commerce'}
                  width={120}
                  height={120}
                  className="w-full h-full object-contain"
                />
              </div>
            </a>

            {/* Business Center Logo */}
            <a 
              href="https://maroof.sa" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group"
            >
              <div className="bg-white rounded-xl p-4 sm:p-5 transition-all duration-300 hover:shadow-xl hover:scale-105 w-32 h-32 sm:w-36 sm:h-36 md:w-44 md:h-44 flex items-center justify-center">
                <Image 
                  src="/business-center.png"
                  alt={language === 'ar' ? 'مركز الأعمال السعودي' : 'Saudi Business Center'}
                  width={120}
                  height={120}
                  className="w-full h-full object-contain"
                />
              </div>
            </a>

            {/* Vision 2030 Logo */}
            <a 
              href="https://www.vision2030.gov.sa" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group"
            >
              <div className="bg-white rounded-xl p-4 sm:p-5 transition-all duration-300 hover:shadow-xl hover:scale-105 w-32 h-32 sm:w-36 sm:h-36 md:w-44 md:h-44 flex items-center justify-center">
                <Image 
                  src="/vision-2030.png"
                  alt={language === 'ar' ? 'رؤية المملكة 2030' : 'Saudi Vision 2030'}
                  width={120}
                  height={120}
                  className="w-full h-full object-contain"
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
