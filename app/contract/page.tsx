'use client'

import { useLanguage } from '@/contexts/language-context'

export default function ContractPage() {
  const { language } = useLanguage()

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow">

        <h1 className="text-3xl font-bold text-center mb-4">
          {language === 'ar' ? 'تعاقد معنا' : 'Contract With Us'}
        </h1>

        <p className="text-gray-600 text-center mb-8">
          {language === 'ar'
            ? 'املأ التفاصيل التالية وسيتواصل معك فريق المنصة لإكمال التعاقد'
            : 'Fill the form below and our team will contact you to complete the contract'}
        </p>

        <form className="grid gap-4">

          <input
            className="border p-3 rounded-xl"
            placeholder={language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
          />

          <input
            className="border p-3 rounded-xl"
            placeholder={language === 'ar' ? 'الجهة / النادي' : 'Organization / Club'}
          />

          <input
            className="border p-3 rounded-xl"
            placeholder={language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
            type="email"
          />

          <input
            className="border p-3 rounded-xl"
            placeholder={language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
            type="tel"
          />

          <textarea
            className="border p-3 rounded-xl h-32"
            placeholder={language === 'ar' ? 'وصف مختصر لاحتياجاتك' : 'Describe Your Needs'}
          />

          <button className="bg-green-600 text-white p-4 rounded-xl">
            {language === 'ar' ? 'إرسال الطلب' : 'Send Request'}
          </button>

        </form>

      </div>
    </div>
  )
}
