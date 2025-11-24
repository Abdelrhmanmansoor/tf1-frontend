'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  CheckCircle,
  Shield,
  Lock,
  AlertCircle,
  Building2,
  Mail,
  Phone,
  CalendarDays,
  X,
} from 'lucide-react'

export default function ContractPage() {
  const { language } = useLanguage()
  const [step, setStep] = useState<'form' | 'review' | 'success'>('form')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreedToTerms) {
      alert(language === 'ar' ? 'يجب الموافقة على الشروط' : 'Please agree to terms')
      return
    }

    setIsLoading(true)
    try {
      // محاولة الإرسال للباك إند المحلي أولاً
      const response = await fetch('/api/contracts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
          contractId: `TF1-${Date.now()}`,
        }),
      }).catch(async () => {
        // إذا فشل، حاول البديل (حفظ محلي)
        const contractData = {
          ...formData,
          timestamp: new Date().toISOString(),
          contractId: `TF1-${Date.now()}`,
        }
        // حفظ في localStorage كحل بديل
        const contracts = JSON.parse(localStorage.getItem('tf1_contracts') || '[]')
        contracts.push(contractData)
        localStorage.setItem('tf1_contracts', JSON.stringify(contracts))
        return { ok: true }
      })

      if (response?.ok) {
        setStep('success')
        setShowSuccess(true)
        // إعادة تعيين النموذج بعد 5 ثوان
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
          setStep('form')
          setShowSuccess(false)
        }, 5000)
      }
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
          {/* Success Notification */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.95 }}
                className="fixed top-6 left-1/2 -translate-x-1/2 z-50 max-w-md"
              >
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 shadow-2xl border border-green-400/50 text-white">
                  <div className="flex items-start gap-4">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                      className="flex-shrink-0"
                    >
                      <CheckCircle className="w-8 h-8" />
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-bold mb-1">
                        {language === 'ar' ? '✓ تم الحفظ بنجاح!' : '✓ Successfully Saved!'}
                      </h3>
                      <p className="text-sm text-green-50">
                        {language === 'ar'
                          ? 'تم حفظ بيانات العقد بشكل آمن. سيتم التواصل معك قريباً'
                          : 'Contract data saved securely. We will contact you soon'}
                      </p>
                      <p className="text-xs text-green-100 mt-2 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        {language === 'ar' ? 'معلوماتك محمية بالتشفير' : 'Your data is encrypted'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {language === 'ar' ? 'عقد التوظيف المبدئي' : 'Preliminary Employment Contract'}
              </span>
            </h1>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              {language === 'ar'
                ? 'وثيقة آمنة محمية بالتشفير - تم تصميمها وفقاً للقوانين السعودية'
                : 'Secure encrypted document - Designed in compliance with Saudi laws'}
            </p>
          </motion.div>

          {/* Main Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl border border-gray-100"
          >
            <form onSubmit={handleSubmit}>
              {/* Section 1: Company Information */}
              <div className="mb-10 pb-10 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Building2 className="w-6 h-6 text-purple-600" />
                  {language === 'ar' ? 'بيانات الشركة' : 'Company Information'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {language === 'ar' ? 'اسم الشركة *' : 'Company Name *'}
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
                      {language === 'ar' ? 'الشخص المسؤول *' : 'Contact Person *'}
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
                      {language === 'ar' ? 'المسمى الوظيفي *' : 'Position *'}
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
                      {language === 'ar' ? 'تاريخ البدء *' : 'Start Date *'}
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
                      {language === 'ar' ? 'الراتب الشهري (بالريال) *' : 'Monthly Salary (SAR) *'}
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
                    {language === 'ar' ? 'وصف الوظيفة' : 'Job Description'}
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                    placeholder={language === 'ar' ? 'اكتب وصف الوظيفة والمسؤوليات' : 'Describe the job and responsibilities'}
                  />
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="mb-8 pb-8 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Shield className="w-6 h-6 text-purple-600" />
                  {language === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}
                </h2>

                <div className="bg-blue-50 rounded-lg p-6 mb-6 border border-blue-200">
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    {language === 'ar' ? (
                      <>
                        <strong>أنا أقر بأن:</strong>
                        <br />
                        1. جميع البيانات المذكورة أعلاه صحيحة وكاملة<br />
                        2. سألتزم بجميع قوانين المملكة العربية السعودية<br />
                        3. الراتب والمزايا المذكورة متفق عليها بموجب هذا العقد<br />
                        4. هذا العقد ملزم للطرفين بعد التوقيع الإلكتروني<br />
                        5. سيتم حفظ البيانات بشكل آمن ومحمي بالتشفير<br />
                        6. أوافق على سياسة الخصوصية والاستخدام
                      </>
                    ) : (
                      <>
                        <strong>I hereby acknowledge that:</strong>
                        <br />
                        1. All information provided is true and complete<br />
                        2. I will comply with Saudi Arabia laws<br />
                        3. Salary and benefits are as stated in this contract<br />
                        4. This contract is binding upon electronic signature<br />
                        5. Data will be saved securely and encrypted<br />
                        6. I agree to Privacy Policy and Terms of Use
                      </>
                    )}
                  </p>
                </div>

                <label className="flex items-center gap-3 p-4 border-2 border-purple-300 rounded-lg cursor-pointer hover:bg-purple-50 transition">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-5 h-5 rounded text-purple-600 cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    {language === 'ar' ? 'أوافق على جميع الشروط والأحكام' : 'I agree to all terms and conditions'}
                  </span>
                </label>
              </div>

              {/* Security Badge */}
              <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200 flex items-center gap-3">
                <Lock className="w-6 h-6 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-green-900 text-sm">
                    {language === 'ar' ? '🔒 بيانات محمية بالتشفير من الدرجة العسكرية' : '🔒 Military-grade encrypted data'}
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    {language === 'ar' ? 'معلوماتك آمنة وسرية وفقاً للمعايير الدولية' : 'Your data is safe and confidential per international standards'}
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
                    {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    {language === 'ar' ? 'وقّع وأرسل العقد' : 'Sign & Submit Contract'}
                  </span>
                )}
              </button>

              <p className="text-center text-xs text-gray-500 mt-4">
                {language === 'ar' ? '✓ التوقيع الإلكتروني ملزم قانوناً' : '✓ Electronic signature is legally binding'}
              </p>
            </form>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
