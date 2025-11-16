'use client'

import { useState } from 'react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { useLanguage } from '@/contexts/language-context'

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
      body: JSON.stringify(form),
    })
    if (res.ok) setSent(true)
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        {!sent ? (
          <>
            <h1 className="text-3xl font-bold mb-6 text-center">
              {language === 'ar' ? 'تعاقد معنا' : 'Contract With Us'}
            </h1>

            <form className="space-y-4" onSubmit={submitForm}>
              <input
                required
                className="w-full p-3 border rounded-lg"
                placeholder={language === 'ar' ? 'الاسم بالكامل' : 'Full Name'}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input
                type="email"
                required
                className="w-full p-3 border rounded-lg"
                placeholder={language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <PhoneInput
                country={'sa'}
                inputClass="w-full !py-6"
                containerClass="!w-full"
                onChange={(phone) => setForm({ ...form, phone })}
              />

              <input
                className="w-full p-3 border rounded-lg"
                placeholder={language === 'ar' ? 'اسم الشركة' : 'Company Name'}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />

              <textarea
                className="w-full p-3 border rounded-lg h-32"
                placeholder={
                  language === 'ar'
                    ? 'أخبرنا كيف يمكننا مساعدتك'
                    : 'Tell us more'
                }
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold"
              >
                {language === 'ar' ? 'إرسال الطلب' : 'Submit Request'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-3 text-green-600">
              {language === 'ar' ? 'تم إرسال طلبك بنجاح' : 'Request Sent'}
            </h2>
            <p className="text-gray-700">
              {language === 'ar'
                ? 'شكرًا لك! سيتواصل معك فريق TF1 قريبًا.'
                : 'Thank you! Our team will contact you shortly.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
