/* eslint-disable no-unused-vars */
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'
import { Navbar } from '@/components/navbar'
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
      value: '+1 (555) 123-4567',
      action: 'tel:+15551234567',
      color: 'from-green-500 to-emerald-600',
      available: language === 'ar' ? 'متاح الآن' : 'Available Now',
    },
    {
      icon: Mail,
      title: language === 'ar' ? 'راسلنا' : 'Email Us',
      description:
        language === 'ar' ? 'نرد خلال ساعتين' : 'We reply within 2 hours',
      value: 'support@sportx.com',
      action: 'mailto:support@sportx.com',
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

  const officeLocations = [
    {
      city: language === 'ar' ? 'نيويورك' : 'New York',
      address: '123 Sports Avenue, NY 10001',
      timezone: 'EST',
      hours: '9:00 AM - 6:00 PM',
      phone: '+1 (555) 123-4567',
      email: 'ny@sportx.com',
    },
    {
      city: language === 'ar' ? 'لندن' : 'London',
      address: '456 Athletic Street, London SW1A 1AA',
      timezone: 'GMT',
      hours: '9:00 AM - 5:30 PM',
      phone: '+44 20 1234 5678',
      email: 'london@sportx.com',
    },
    {
      city: language === 'ar' ? 'دبي' : 'Dubai',
      address: 'Sports Tower, DIFC, Dubai',
      timezone: 'GST',
      hours: '8:00 AM - 5:00 PM',
      phone: '+971 4 123 4567',
      email: 'dubai@sportx.com',
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
      value: '15',
      label: language === 'ar' ? 'لغة مدعومة' : 'Languages Supported',
      icon: Globe,
      color: 'text-purple-600',
    },
  ]

  return (
    <div
      className={`min-h-screen bg-white relative ${language === 'ar' ? 'font-arabic' : 'font-english'}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <Navbar activeMode="application" activePage="contact" />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-blue-900">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="inline-flex items-center bg-gradient-to-r from-blue-400 to-green-400 text-white px-6 py-3 rounded-full text-sm font-semibold mb-8">
              <Heart className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'نحن هنا لمساعدتك' : "We're Here to Help"}
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8">
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                {language === 'ar' ? 'تواصل معنا' : 'Get in Touch'}
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-white mb-12 max-w-4xl mx-auto leading-relaxed">
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
                  className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                >
                  <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {language === 'ar' ? 'طرق التواصل' : 'Contact Methods'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'ar'
                ? 'اختر الطريقة الأنسب لك للتواصل معنا'
                : 'Choose the most convenient way to reach us'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <method.icon className="w-8 h-8 text-white" />
                  </div>

                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {method.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {method.description}
                    </p>
                    <div className="text-lg font-semibold text-gray-900 mb-3">
                      {method.value}
                    </div>

                    <div className="inline-flex items-center bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-semibold">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      {method.available}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Support Categories */}
      <section
        className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-blue-900"
        data-section="contact-form"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl"
            >
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
                {language === 'ar' ? 'أرسل رسالة' : 'Send us a Message'}
              </h3>

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        {language === 'ar' ? 'الاسم' : 'Name'}
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder={
                          language === 'ar' ? 'اسمك الكامل' : 'Your full name'
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder={
                          language === 'ar'
                            ? 'your@email.com'
                            : 'your@email.com'
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      {language === 'ar' ? 'نوع الاستفسار' : 'Inquiry Type'}
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      {language === 'ar' ? 'الموضوع' : 'Subject'}
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder={
                        language === 'ar'
                          ? 'موضوع رسالتك'
                          : 'Subject of your message'
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      {language === 'ar' ? 'الرسالة' : 'Message'}
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
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
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 py-4 text-lg font-semibold rounded-xl transition-all duration-300 disabled:opacity-50"
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
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {language === 'ar'
                      ? 'تم إرسال رسالتك!'
                      : 'Message Sent Successfully!'}
                  </h3>
                  <p className="text-gray-600">
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
              className="space-y-8 "
            >
              <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-8">
                {language === 'ar' ? 'أقسام الدعم' : 'Support Categories'}
              </h3>

              {supportCategories.map((category, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <category.icon className="w-6 h-6 text-blue-600" />
                    </div>

                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        {category.title}
                      </h4>
                      <p className="text-gray-600 mb-4">
                        {category.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {category.topics.map((topic, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {language === 'ar' ? 'مكاتبنا حول العالم' : 'Our Global Offices'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'ar'
                ? 'زورنا في أي من مكاتبنا أو تواصل معنا محلياً'
                : 'Visit us at any of our offices or contact us locally'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {officeLocations.map((office, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {office.city}
                  </h3>
                  <p className="text-gray-600 text-sm">{office.address}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {office.hours}
                      </p>
                      <p className="text-xs text-gray-600">{office.timezone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-700">
                      {office.phone}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-700">
                      {office.email}
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-6 border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-colors duration-200"
                >
                  {language === 'ar' ? 'احصل على الاتجاهات' : 'Get Directions'}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                {language === 'ar'
                  ? 'الأسئلة الشائعة'
                  : 'Frequently Asked Questions'}
              </span>
            </h2>
            <p className="text-xl text-gray-300">
              {language === 'ar'
                ? 'إجابات سريعة لأكثر الأسئلة شيوعاً'
                : 'Quick answers to the most common questions'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:gap-8">
            {[
              {
                q:
                  language === 'ar'
                    ? 'كيف أبدأ في استخدام المنصة؟'
                    : 'How do I get started with the platform?',
                a:
                  language === 'ar'
                    ? 'ببساطة اضغط على "إنشاء حساب" واتبع الخطوات البسيطة لإنشاء ملفك الشخصي.'
                    : 'Simply click "Create Account" and follow the simple steps to create your profile.',
              },
              {
                q:
                  language === 'ar'
                    ? 'هل المنصة مجانية؟'
                    : 'Is the platform free?',
                a:
                  language === 'ar'
                    ? 'نعم، نوفر خطة مجانية مع إمكانية الترقية للحصول على مميزات إضافية.'
                    : 'Yes, we offer a free plan with the option to upgrade for additional features.',
              },
              {
                q:
                  language === 'ar'
                    ? 'كم من الوقت يستغرق العثور على وظيفة؟'
                    : 'How long does it take to find a job?',
                a:
                  language === 'ar'
                    ? 'يختلف الوقت حسب التخصص، لكن معظم المستخدمين يجدون فرص مناسبة خلال أسبوعين.'
                    : 'It varies by specialization, but most users find suitable opportunities within two weeks.',
              },
              {
                q:
                  language === 'ar'
                    ? 'هل تدعمون التوظيف الدولي؟'
                    : 'Do you support international hiring?',
                a:
                  language === 'ar'
                    ? 'بالطبع! نربط المواهب مع الفرص في أكثر من 200 دولة حول العالم.'
                    : 'Absolutely! We connect talents with opportunities in over 200 countries worldwide.',
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
              >
                <h4 className="text-lg font-bold mb-3">{faq.q}</h4>
                <p className="text-gray-300">{faq.a}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mt-12"
          >
            <p className="text-gray-300 mb-6">
              {language === 'ar'
                ? 'لم تجد إجابة لسؤالك؟'
                : "Didn't find an answer to your question?"}
            </p>
            <Button
              size="lg"
              onClick={() => {
                const formSection = document.querySelector(
                  '[data-section="contact-form"]'
                )
                formSection?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                })
              }}
              className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl cursor-pointer"
            >
              {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-4 py-2 rounded-lg text-lg font-bold inline-block mb-4">
                SportX
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                {language === 'ar'
                  ? 'منصة الرياضة الأولى عالمياً لربط المواهب بالفرص'
                  : "The world's #1 sports platform connecting talent with opportunities"}
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">
                {language === 'ar' ? 'روابط سريعة' : 'Quick Links'}
              </h4>
              <div className="space-y-2">
                {['Home', 'Jobs', 'About', 'Features', 'Contact'].map(
                  (link) => (
                    <Link
                      key={link}
                      href={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
                      className="block text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {language === 'ar'
                        ? {
                            Home: 'الرئيسية',
                            Jobs: 'الوظائف',
                            About: 'عنا',
                            Features: 'المميزات',
                            Contact: 'تواصل',
                          }[link]
                        : link}
                    </Link>
                  )
                )}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">
                {language === 'ar' ? 'الدعم' : 'Support'}
              </h4>
              <div className="space-y-2">
                <Link
                  href="/help-center"
                  className="block text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {language === 'ar' ? 'مركز المساعدة' : 'Help Center'}
                </Link>
                <Link
                  href="/faq"
                  className="block text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {language === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}
                </Link>
                <Link
                  href="/terms"
                  className="block text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {language === 'ar' ? 'الشروط والأحكام' : 'Terms of Service'}
                </Link>
                <Link
                  href="/privacy"
                  className="block text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">
                {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
              </h4>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5" />
                  <span className="text-sm">support@sportx.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              {language === 'ar'
                ? '© 2025 منصة SportX. جميع الحقوق محفوظة'
                : '© 2025 SportX Platform. All rights reserved'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
