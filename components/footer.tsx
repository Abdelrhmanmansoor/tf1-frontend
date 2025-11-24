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
          <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3 0 .73-.149 1.065-.301.517-.232 1.013-.357 1.423-.357.96 0 1.64.563 1.64 1.354 0 .52-.31.987-.664 1.288-.552.463-1.248.819-1.844 1.058-.213.09-.331.21-.331.423 0 .071.03.158.104.298.21.4.594 1.127 1.164 1.742.681.733 1.952 1.308 3.008 1.308.257 0 .492-.05.712-.127l.04-.012c.23-.078.405-.112.525-.112.42 0 .748.338.748.748 0 .076-.014.151-.037.225-.415 1.341-2.22 2.104-2.999 2.104-.163 0-.298-.03-.413-.063-.12-.035-.24-.078-.376-.125-.457-.159-1.082-.376-2.046-.376-.721 0-1.391.15-1.94.301-.329.09-.637.196-.915.284-.475.149-.898.284-1.291.284-.49 0-.945-.107-1.425-.33-1.139-.53-2.165-1.417-3.127-2.255-.554-.485-1.079-.944-1.585-1.332-.636-.488-1.039-.73-1.415-.922l-.015-.008c-.33-.166-.586-.294-.836-.51-.238-.206-.397-.48-.397-.816 0-.527.42-.957.957-.957.15 0 .297.032.435.09.12.051.238.108.352.168.18.09.349.174.504.233.078.03.151.045.22.045.303 0 .533-.263.533-.564 0-.206-.12-.42-.349-.629-.345-.314-.706-.555-1.094-.766-.776-.421-1.641-.632-2.573-.632-.75 0-1.447.165-2.07.49-.657.344-1.222.84-1.675 1.47-.524.728-.818 1.59-.818 2.486 0 1.06.36 2.04 1.012 2.757.645.71 1.545 1.13 2.531 1.13.424 0 .83-.074 1.207-.218.315-.12.586-.27.81-.448.18-.143.33-.3.457-.479.024-.035.048-.067.075-.104.12-.164.24-.328.39-.478.24-.238.57-.358.93-.358.675 0 1.223.547 1.223 1.223 0 .313-.12.604-.316.84-.21.255-.525.479-.93.664-.99.45-2.145.675-3.435.675-1.918 0-3.632-.63-4.815-1.774C.96 16.976.24 15.455.24 13.648c0-1.29.405-2.52 1.137-3.555.735-1.035 1.785-1.86 3.027-2.385C5.65 7.213 7.1 6.948 8.604 6.948c.825 0 1.59.105 2.273.315.684.21 1.29.517 1.801.915l.015.012c.165.126.315.266.45.42l.09-.015c-.12-1.894-.165-4.044.42-5.426C15.6 1.274 18.435.793 19.77.793c.766 0 1.38.286 1.877.875.495.585.766 1.39.766 2.324 0 .63-.15 1.29-.45 1.968-.3.675-.75 1.335-1.335 1.963-.585.63-1.29 1.177-2.1 1.635-.405.228-.855.42-1.335.57l-.015.006c-.48.15-.975.226-1.485.226-.36 0-.705-.045-1.035-.135l-.045-.015c-.494-.135-.945-.375-1.335-.705-.195-.165-.375-.36-.525-.585-.075-.113-.135-.24-.18-.375-.09-.27-.135-.57-.135-.885 0-.72.3-1.41.84-1.935.54-.525 1.29-.81 2.1-.81.51 0 .99.12 1.41.345z"/>
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
