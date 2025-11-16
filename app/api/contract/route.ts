'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { motion } from 'framer-motion'

export default function ContractPage() {
  const { language } = useLanguage()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  })

  const [sent, setSent] = useState(false)

  const submitForm = async (e: any) => {
    e.preventDefault()

    const res = await fetch('/api/contract', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',   // ← أهم تعديل
      },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      setSent(true)
    } else {
      console.log('Request failed:', res.status)
    }
  }

  return (
    <div
      className="min-h-screen bg-gray-100 py-12 px-4 flex justify-center"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full bg-white p-8 rounded-2xl shadow-xl"
      >
        {!sent ? (
          <>
            <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              {language === 'ar' ? 'تعاقد معنا' : 'Contract With Us'}
            </h1>

            <form className="space-y-5" onSubmit={submitForm}>
              <input
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder={language === 'ar' ? 'الاسم بالكامل' : 'Full Name'}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input
                type="email"
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder={language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              {/* --- Phone Input Replacement --- */}
              <div className="flex gap-3 border rounded-lg p-3 bg-white">
                <select
                  className="border-r pr-2 text-gray-700"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value + form.phone,
                    })
                  }
                >
                  <option value="+966">🇸🇦 +966</option>
                  <option value="+971">🇦🇪 +971</option>
                  <option value="+20">🇪🇬 +20</option>
                  <option value="+965">🇰🇼 +965</option>
                  <option value="+974">🇶🇦 +974</option>
                </select>

                <input
                  type="tel"
                  className="flex-1 outline-none"
                  placeholder={language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                />
              </div>
              {/* --- End Phone Input Replacement --- */}

              <input
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder={language === 'ar' ? 'اسم الشركة' : 'Company Name'}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />

              <textarea
                className="w-full p-3 border rounded-lg h-32 focus:ring-2 focus:ring-blue-500"
                placeholder={
                  language === 'ar'
                    ? 'أخبرنا كيف يمكننا مساعدتك'
                    : 'Tell us more'
                }
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white py-3 rounded-lg text-lg font-semibold shadow-md hover:opacity-90"
              >
                {language === 'ar' ? 'إرسال الطلب' : 'Submit Request'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-20">
            <motion.h2
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-3xl font-bold mb-3 text-green-600"
            >
              {language === 'ar' ? 'تم إرسال طلبك بنجاح' : 'Request Sent'}
            </motion.h2>
            <p className="text-gray-700 text-lg">
              {language === 'ar'
                ? 'شكرًا لك! تم حفظ طلبك وسيتواصل معك الفريق قريبًا.'
                : 'Thank you! Your request was submitted and saved successfully.'}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
