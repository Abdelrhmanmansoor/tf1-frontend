/* eslint-disable no-unused-vars */
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  MessageSquare,
  Headphones,
  Globe,
  Users,
  Star,
  ArrowRight,
  Sparkles,
  Building,
  Calendar,
  Video,
  FileText,
  HelpCircle,
  Shield,
  Zap,
  Heart,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from 'lucide-react'

export default function ContactPage() {
  const { language } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Reset form after success
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'general',
      })
    }, 3000)
  }

  const contactMethods = [
    {
      icon: Phone,
      title: language === 'ar' ? 'اتصل بنا' : 'Call Us',
      description:
        language === 'ar' ? 'متاح 24/7 لخدمتك' : 'Available 24/7 for you',
      value: '+966 50 123 4567',
      action: 'tel:+966501234567',
      color: 'from-green-500 to-emerald-600',
      available: language === 'ar' ? 'متاح الآن' : 'Available Now',
    },
    {
      icon: Mail,
      title: language === 'ar' ? 'راسلنا' : 'Email Us',
      description:
        language === 'ar' ? 'نرد خلال ساعتين' : 'We reply within 2 hours',
      value: 'contact@tf1one.com',
      action: 'mailto:contact@tf1one.com',
      color: 'from-blue-500 to-cyan-600',
      available: language === 'ar' ? 'رد سريع' : 'Quick Response',
    },
    {
      icon: MessageSquare,
      title: language === 'ar' ? 'دردشة مباشرة' : 'Live Chat',
      description:
        language === 'ar' ? 'تحدث مع فريق الدعم' : 'Chat with support team',
      value: language === 'ar' ? 'ابدأ المحادثة' : 'Start Conversation',
      action: '#',
      color: 'from-purple-500 to-pink-600',
      available: language === 'ar' ? 'متصل' : 'Online',
    },
    {
      icon: Video,
      title: language === 'ar' ? 'مكالمة فيديو' : 'Video Call',
      description:
        language === 'ar'
          ? 'احجز موعد للدعم المرئي'
          : 'Book appointment for visual support',
      value: language === 'ar' ? 'احجز موعد' : 'Schedule Call',
      action: '#',
      color: 'from-orange-500 to-red-600',
      available: language === 'ar' ? 'متاح الحجز' : 'Booking Available',
    },
  ]

  const supportCategories = [
    {
      icon: Users,
      title: language === 'ar' ? 'دعم الحساب' : 'Account Support',
      description:
        language === 'ar'
          ? 'مساعدة في إدارة الحساب والملف الشخصي'
          : 'Help with account management and profile',
      topics:
        language === 'ar'
          ? ['إعدادات الحساب', 'تحديث البيانات', 'استرداد كلمة المرور']
          : ['Account settings', 'Update information', 'Password recovery'],
    },
    {
      icon: Headphones,
      title: language === 'ar' ? 'الدعم التقني' : 'Technical Support',
      description:
        language === 'ar'
          ? 'حل المشاكل التقنية وأخطاء النظام'
          : 'Resolve technical issues and system errors',
      topics:
        language === 'ar'
          ? ['مشاكل تقنية', 'أخطاء التطبيق', 'مشاكل الاتصال']
          : ['Technical issues', 'App errors', 'Connection problems'],
    },
    {
      icon: Building,
      title: language === 'ar' ? 'دعم الشركات' : 'Business Support',
      description:
        language === 'ar'
          ? 'خدمات مخصصة للشركات والمؤسسات'
          : 'Dedicated services for companies and organizations',
      topics:
        language === 'ar'
          ? ['حلول المؤسسات', 'تكامل API', 'فواتير الشركات']
          : ['Enterprise solutions', 'API integration', 'Corporate billing'],
    },
    {
      icon: HelpCircle,
      title: language === 'ar' ? 'الأسئلة العامة' : 'General Inquiries',
      description:
        language === 'ar'
          ? 'استفسارات عامة حول المنصة والخدمات'
          : 'General questions about platform and services',
      topics:
        language === 'ar'
          ? ['كيفية الاستخدام', 'معلومات عامة', 'شروط الخدمة']
          : ['How to use', 'General information', 'Terms of service'],
    },
  ]

  const responseStats = [
    {
      value: '< 2h',
      label: language === 'ar' ? 'متوسط وقت الرد' : 'Average Response Time',
      icon: Clock,
      color: 'text-green-600',
    },
    {
      value: '98%',
      label: language === 'ar' ? 'معدل رضا العملاء' : 'Customer Satisfaction',
      icon: Star,
      color: 'text-yellow-600',
    },
    {
      value: '24/7',
      label: language === 'ar' ? 'دعم متواصل' : 'Support Available',
      icon: Shield,
      color: 'text-blue-600',
    },
    {
      value: '50K+',
      label: language === 'ar' ? 'عضو نشط' : 'Active Members',
      icon: Globe,
      color: 'text-purple-600',
    },
  ]

  const socialLinks = [
    { icon: Facebook, url: '#', color: 'hover:text-blue-600' },
    { icon: Twitter, url: '#', color: 'hover:text-blue-400' },
    { icon: Linkedin, url: '#', color: 'hover:text-blue-700' },
    { icon: Instagram, url: '#', color: 'hover:text-pink-600' },
  ]

  return (
    <div
      className={`min-h-screen bg-white relative ${language === 'ar' ? 'font-arabic' : 'font-english'}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <Navbar activeMode="application" activePage="contact" />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="inline-flex items-center bg-gradient-to-r from-blue-400 to-emerald-400 text-white px-6 py-3 rounded-full text-sm font-bold mb-8 shadow-lg">
              <Heart className="w-4 h-4 mr-2" />
              {language === 'ar' ? '✨ نحن هنا لمساعدتك' : "✨ We're Here to Help"}
            </span>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                {language === 'ar' ? 'تواصل معنا' : 'Get in Touch'}
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-200 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
              {language === 'ar'
                ? 'نحن متحمسون للاستماع إليك! سواء كنت تحتاج للمساعدة أو لديك اقتراح أو ترغب في الشراكة معنا، فريقنا المختص جاهز لخدمتك على مدار الساعة'
                : "We're excited to hear from you! Whether you need help, have a suggestion, or want to partner with us, our expert team is ready to serve you around the clock"}
            </p>

            {/* Response Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {responseStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 sm:p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:bg-white/20"
                >
                  <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                  <div className="text-2xl sm:text-3xl font-black text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-300 font-semibold">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
              {language === 'ar' ? 'طرق التواصل' : 'Contact Methods'}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-semibold">
              {language === 'ar'
                ? 'اختر الطريقة الأنسب لك للتواصل معنا'
                : 'Choose the most convenient way to reach us'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {contactMethods.map((method, index) => (
              <motion.a
                key={index}
                href={method.action}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.08, translateY: -10 }}
                className="group cursor-pointer block"
              >
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 h-full">
                  <div
                    className={`w-20 h-20 bg-gradient-to-r ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-125 transition-transform duration-300 shadow-lg`}
                  >
                    <method.icon className="w-10 h-10 text-white" />
                  </div>

                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {method.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 font-medium">
                      {method.description}
                    </p>
                    <div className="text-lg font-bold text-gray-900 mb-4">
                      {method.value}
                    </div>

                    <div className="inline-flex items-center bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 px-4 py-2 rounded-full text-xs font-bold">
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      {method.available}
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Support Categories */}
      <section
        className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50"
        data-section="contact-form"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-3xl p-8 sm:p-10 lg:p-12 shadow-2xl border border-gray-100"
            >
              <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-10">
                {language === 'ar' ? '📧 أرسل رسالة' : '📧 Send Message'}
              </h3>

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-3">
                        {language === 'ar' ? 'الاسم' : 'Name'}
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-semibold"
                        placeholder={
                          language === 'ar' ? 'اسمك الكامل' : 'Your full name'
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-3">
                        {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-semibold"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">
                      {language === 'ar' ? 'نوع الاستفسار' : 'Inquiry Type'}
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-semibold"
                    >
                      <option value="general">
                        {language === 'ar' ? 'استفسار عام' : 'General Inquiry'}
                      </option>
                      <option value="technical">
                        {language === 'ar' ? 'دعم تقني' : 'Technical Support'}
                      </option>
                      <option value="business">
                        {language === 'ar'
                          ? 'استفسار تجاري'
                          : 'Business Inquiry'}
                      </option>
                      <option value="partnership">
                        {language === 'ar' ? 'شراكة' : 'Partnership'}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">
                      {language === 'ar' ? 'الموضوع' : 'Subject'}
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-semibold"
                      placeholder={
                        language === 'ar'
                          ? 'موضوع رسالتك'
                          : 'Subject of your message'
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">
                      {language === 'ar' ? 'الرسالة' : 'Message'}
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none font-semibold"
                      placeholder={
                        language === 'ar'
                          ? 'اكتب رسالتك هنا...'
                          : 'Write your message here...'
                      }
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-4 text-lg font-bold rounded-xl transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {language === 'ar' ? 'جاري الإرسال...' : 'Sending...'}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Send className="w-5 h-5" />
                        {language === 'ar' ? 'إرسال الرسالة' : 'Send Message'}
                      </div>
                    )}
                  </Button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    {language === 'ar'
                      ? '✓ تم إرسال رسالتك!'
                      : '✓ Message Sent!'}
                  </h3>
                  <p className="text-gray-600 text-lg">
                    {language === 'ar'
                      ? 'شكراً لتواصلك معنا. سنرد عليك في أقرب وقت ممكن.'
                      : "Thank you for contacting us. We'll get back to you as soon as possible."}
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Support Categories */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h3 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-10">
                {language === 'ar' ? '🎯 أقسام الدعم' : '🎯 Support Categories'}
              </h3>

              {supportCategories.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                      <category.icon className="w-7 h-7 text-blue-600" />
                    </div>

                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900 mb-2">
                        {category.title}
                      </h4>
                      <p className="text-gray-600 mb-4 font-semibold">
                        {category.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {category.topics.map((topic, i) => (
                          <span
                            key={i}
                            className="px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 text-gray-700 text-xs font-bold rounded-full border border-blue-200 hover:border-blue-300 transition-colors"
                          >
                            ✓ {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>


      <Footer />
    </div>
  )
}
