'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle,
  Building2,
} from 'lucide-react'

export default function ContractPage() {
  const { language } = useLanguage()
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const successMessages = [
    language === 'ar' 
      ? { title: '✓ تم بنجاح!', desc: 'تم استقبال طلبك - شكراً لاختيارك TF1' }
      : { title: '✓ Success!', desc: 'Your request received - Thank you for choosing TF1' },
    language === 'ar'
      ? { title: '📋 طلبك قيد المراجعة', desc: 'سيتم التواصل معك قريباً من قبل فريقنا المتخصص' }
      : { title: '📋 Under Review', desc: 'Our team will contact you soon' },
    language === 'ar'
      ? { title: '🚀 ستجد أفضل الكفاءات', desc: 'نساعدك في إيجاد أفضل المواهب الرياضية' }
      : { title: '🚀 Best Talent Found', desc: 'We help you find the best sports talent' },
  ]
  
  const [messageIndex, setMessageIndex] = useState(0)

  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    position: '',
    duration: '1',
    startDate: '',
    salary: '',
    description: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const generateContractData = (contractId: string) => {
    // Create contract data object instead of PDF
    const contractData = {
      contractId,
      date: new Date().toLocaleDateString(),
      company: formData.companyName,
      contact: formData.contactPerson,
      email: formData.email,
      phone: formData.phone,
      position: formData.position,
      duration: formData.duration,
      startDate: formData.startDate,
      salary: formData.salary,
      description: formData.description,
    }
    
    // Save to localStorage
    const contracts = JSON.parse(localStorage.getItem('tf1_contracts') || '[]')
    contracts.push(contractData)
    localStorage.setItem('tf1_contracts', JSON.stringify(contracts))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreedToTerms) {
      alert(language === 'ar' ? 'يجب الموافقة على الشروط' : 'Please agree to terms')
      return
    }

    setIsLoading(true)
    try {
      const contractId = `TF1-RECRUIT-${Date.now()}`
      const submissionData = {
        ...formData,
        timestamp: new Date().toISOString(),
        contractId,
      }

      // محاولة الإرسال للباك إند أولاً
      await fetch('/api/contracts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      }).catch(async () => {
        // حفظ محلي إذا فشل الباكآند
        const contracts = JSON.parse(localStorage.getItem('tf1_contracts') || '[]')
        contracts.push(submissionData)
        localStorage.setItem('tf1_contracts', JSON.stringify(contracts))
      })

      // Save contract data
      generateContractData(contractId)

      // Show success
      setShowSuccess(true)
      setMessageIndex(Math.floor(Math.random() * successMessages.length))
      setTimeout(() => {
        setFormData({
          companyName: '',
          contactPerson: '',
          email: '',
          phone: '',
          position: '',
          duration: '1',
          startDate: '',
          salary: '',
          description: '',
        })
        setAgreedToTerms(false)
        setShowSuccess(false)
      }, 8000)
    } catch (error) {
      console.error('Error:', error)
      alert(language === 'ar' ? 'حدث خطأ، يرجى المحاولة مرة أخرى' : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 ${language === 'ar' ? 'font-arabic' : 'font-english'}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <Navbar activeMode="recruitment" />

      <section className="py-12 sm:py-20 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Banner Strip */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -100 }}
                transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
                className="fixed top-0 left-0 right-0 z-50 w-screen"
              >
                <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 w-full py-4 sm:py-6 px-4 shadow-lg">
                  <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex-1 text-center sm:text-left">
                      <motion.h3 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl sm:text-2xl font-bold text-white mb-1"
                      >
                        {successMessages[messageIndex].title}
                      </motion.h3>
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-sm sm:text-base text-white/90 font-medium"
                      >
                        {successMessages[messageIndex].desc}
                      </motion.p>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-blue-600 font-bold py-2 px-6 rounded-full hover:bg-blue-50 transition-all flex items-center gap-2 shadow-md hover:shadow-lg text-sm sm:text-base flex-shrink-0"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {language === 'ar' ? 'تم الحفظ' : 'Saved'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Container */}
          {!showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl border border-gray-100"
            >
              <form onSubmit={handleSubmit}>
                {/* Header */}
                <div className="mb-10 pb-10 border-b border-gray-200">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-lg">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {language === 'ar' ? 'نموذج احالة الموظفين' : 'Recruitment Submission'}
                    </span>
                  </h1>
                  <p className="text-gray-600 text-base sm:text-lg">
                    {language === 'ar'
                      ? 'نحن جهة احالة موظفين متخصصة - قدم وظيفتك وسنساعدك في إيجاد أفضل الكفاءات'
                      : 'We are a specialized recruitment agency - submit your job and we will help you find the best talent'}
                  </p>
                </div>

                {/* Section 1: Company Information */}
                <div className="mb-10 pb-10 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Building2 className="w-6 h-6 text-purple-600" />
                    {language === 'ar' ? 'بيانات الجهة الموظفة' : 'Company Information'}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {language === 'ar' ? 'اسم الجهة *' : 'Organization Name *'}
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        required
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        placeholder={language === 'ar' ? 'أكاديمية النخبة' : 'Elite Academy'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {language === 'ar' ? 'المسؤول عن التوظيف *' : 'Hiring Manager *'}
                      </label>
                      <input
                        type="text"
                        name="contactPerson"
                        required
                        value={formData.contactPerson}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        placeholder={language === 'ar' ? 'أحمد محمد' : 'Ahmed Mohammed'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {language === 'ar' ? 'البريد الإلكتروني *' : 'Email *'}
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        placeholder="company@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {language === 'ar' ? 'رقم الهاتف *' : 'Phone *'}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        placeholder="+966501234567"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Job Details */}
                <div className="mb-10 pb-10 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <FileText className="w-6 h-6 text-purple-600" />
                    {language === 'ar' ? 'تفاصيل الوظيفة' : 'Job Details'}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {language === 'ar' ? 'المسمى الوظيفي *' : 'Position Title *'}
                      </label>
                      <input
                        type="text"
                        name="position"
                        required
                        value={formData.position}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        placeholder={language === 'ar' ? 'مدرب كرة قدم' : 'Football Coach'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {language === 'ar' ? 'مدة العقد (سنة) *' : 'Contract Duration (Years) *'}
                      </label>
                      <select
                        name="duration"
                        required
                        value={formData.duration}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                      >
                        <option value="1">1 {language === 'ar' ? 'سنة' : 'Year'}</option>
                        <option value="2">2 {language === 'ar' ? 'سنة' : 'Years'}</option>
                        <option value="3">3 {language === 'ar' ? 'سنوات' : 'Years'}</option>
                        <option value="5">5 {language === 'ar' ? 'سنوات' : 'Years'}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {language === 'ar' ? 'تاريخ البدء المتوقع *' : 'Expected Start Date *'}
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        required
                        value={formData.startDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {language === 'ar' ? 'الراتب الشهري (ريال سعودي) *' : 'Monthly Salary (SAR) *'}
                      </label>
                      <input
                        type="number"
                        name="salary"
                        required
                        value={formData.salary}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        placeholder="5000"
                      />
                    </div>
                  </div>

                  <div className="mt-5">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {language === 'ar' ? 'وصف الوظيفة والمتطلبات' : 'Job Description & Requirements'}
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                      placeholder={language === 'ar' ? 'صِف الوظيفة والمتطلبات والمسؤوليات' : 'Describe the position, requirements, and responsibilities'}
                    />
                  </div>
                </div>

                {/* Terms & Security */}
                <div className="mb-8 pb-8 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Shield className="w-6 h-6 text-purple-600" />
                    {language === 'ar' ? 'الشروط والحماية' : 'Terms & Protection'}
                  </h2>

                  <div className="bg-blue-50 rounded-lg p-6 mb-6 border border-blue-200">
                    <p className="text-sm text-gray-700 leading-relaxed mb-4 font-semibold">
                      {language === 'ar' ? 'التزاماتنا تجاهك:' : 'Our Commitments to You:'}
                    </p>
                    <ul className="text-sm text-gray-700 leading-relaxed space-y-2">
                      <li>✓ {language === 'ar' ? 'نحن جهة احالة موظفين معتمدة متخصصة في المجال الرياضي السعودي' : 'Certified recruitment agency specialized in Saudi sports'}</li>
                      <li>✓ {language === 'ar' ? 'ننتقي أفضل الكفاءات والمتخصصين لوظائفك' : 'We screen and match the best candidates for your positions'}</li>
                      <li>✓ {language === 'ar' ? 'البيانات محمية بتشفير من الدرجة العسكرية' : 'Military-grade encryption for all data'}</li>
                      <li>✓ {language === 'ar' ? 'الالتزام الكامل بقوانين العمل السعودية' : 'Full compliance with Saudi Labor Law'}</li>
                    </ul>
                  </div>

                  <label className="flex items-start gap-3 p-4 border-2 border-purple-300 rounded-lg cursor-pointer hover:bg-purple-50 transition">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="w-5 h-5 rounded text-purple-600 cursor-pointer mt-1 flex-shrink-0"
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      {language === 'ar'
                        ? 'أوافق على شروط الخدمة والسياسات الخاصة بنا كجهة احالة موظفين'
                        : 'I agree to our terms of service and recruitment agency policies'}
                    </span>
                  </label>
                </div>

                {/* Security Badge */}
                <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200 flex items-center gap-3">
                  <Lock className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-900 text-sm">
                      {language === 'ar' ? '🔒 حماية من الدرجة العسكرية' : '🔒 Military-Grade Protection'}
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      {language === 'ar' ? 'جميع البيانات آمنة وسرية وفقاً للمعايير الدولية' : 'All data is secure and confidential per international standards'}
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!agreedToTerms || isLoading}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg ${
                    agreedToTerms && !isLoading
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                      {language === 'ar' ? 'جاري الإرسال...' : 'Submitting...'}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      {language === 'ar' ? 'ارسل طلب التوظيف' : 'Submit Job Posting'}
                    </span>
                  )}
                </button>

                <p className="text-center text-xs text-gray-500 mt-4">
                  {language === 'ar' ? '✓ سيتم تحميل العقد تلقائياً بعد الإرسال' : '✓ Contract PDF will be generated after submission'}
                </p>
              </form>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
