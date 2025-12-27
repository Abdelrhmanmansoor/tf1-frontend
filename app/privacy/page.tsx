'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPolicy() {
  const [language, setLanguage] = useState<'en' | 'ar'>('en')

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Language Toggle */}
      <div className="fixed top-24 right-8 z-50">
        <button
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="bg-white px-4 py-2 rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 text-sm font-semibold text-gray-700"
        >
          {language === 'en' ? 'العربية' : 'English'}
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-70"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-block p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-6">
              <Shield className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-4">
              {language === 'ar'
                ? 'آخر تحديث: يناير 2025'
                : 'Last Updated: January 2025'}
            </p>
            <p className="text-base sm:text-lg text-gray-700">
              {language === 'ar'
                ? 'في TF1، خصوصيتك مهمة بالنسبة لنا. توضح سياسة الخصوصية هذه كيفية جمع معلوماتك الشخصية واستخدامها وحمايتها ومشاركتها.'
                : 'At TF1, your privacy matters to us. This Privacy Policy explains how we collect, use, protect, and share your personal information.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 lg:p-12"
          >
            {/* 1. Introduction */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {language === 'ar' ? '1. المقدمة' : '1. Introduction'}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {language === 'ar'
                  ? 'تحكم سياسة الخصوصية هذه استخدامك لمنصة TF1 وخدماتها. من خلال الوصول إلى منصتنا أو استخدامها، فإنك توافق على جمع معلوماتك واستخدامها كما هو موضح في هذه السياسة.'
                  : 'This Privacy Policy governs your use of the TF1 platform and its services. By accessing or using our platform, you consent to the collection and use of your information as described in this policy.'}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {language === 'ar'
                  ? 'نحن ملتزمون بحماية خصوصيتك وضمان أمان معلوماتك الشخصية. نستخدم أحدث تدابير الأمان لحماية بياناتك.'
                  : 'We are committed to protecting your privacy and ensuring the security of your personal information. We use state-of-the-art security measures to safeguard your data.'}
              </p>
            </div>

            {/* 2. Information We Collect */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {language === 'ar' ? '2. المعلومات التي نجمعها' : '2. Information We Collect'}
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {language === 'ar' ? 'أ. المعلومات الشخصية' : 'A. Personal Information'}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mr-4">
                    <li>{language === 'ar' ? 'الاسم الكامل وعنوان البريد الإلكتروني' : 'Full name and email address'}</li>
                    <li>{language === 'ar' ? 'رقم الهاتف والعنوان الفعلي' : 'Phone number and physical address'}</li>
                    <li>{language === 'ar' ? 'تفاصيل التوظيف والسيرة الذاتية' : 'Employment details and resume'}</li>
                    <li>{language === 'ar' ? 'معلومات الملف الشخصي المهني' : 'Professional profile information'}</li>
                    <li>{language === 'ar' ? 'معلومات الدفع والفوترة' : 'Payment and billing information'}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {language === 'ar' ? 'ب. البيانات التقنية' : 'B. Technical Data'}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mr-4">
                    <li>{language === 'ar' ? 'عنوان IP ونوع المتصفح' : 'IP address and browser type'}</li>
                    <li>{language === 'ar' ? 'نوع الجهاز ونظام التشغيل' : 'Device type and operating system'}</li>
                    <li>{language === 'ar' ? 'ملفات تعريف الارتباط وبيانات الاستخدام' : 'Cookies and usage data'}</li>
                    <li>{language === 'ar' ? 'سجلات الوصول وبيانات التحليلات' : 'Access logs and analytics data'}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {language === 'ar' ? 'ج. بيانات الاستخدام' : 'C. Usage Data'}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mr-4">
                    <li>{language === 'ar' ? 'استعلامات البحث والتفضيلات' : 'Search queries and preferences'}</li>
                    <li>{language === 'ar' ? 'تطبيقات الوظائف والتفاعلات' : 'Job applications and interactions'}</li>
                    <li>{language === 'ar' ? 'الرسائل والاتصالات' : 'Messages and communications'}</li>
                    <li>{language === 'ar' ? 'سجل التصفح على المنصة' : 'Platform browsing history'}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 3. How We Use Your Information */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {language === 'ar' ? '3. كيفية استخدام معلوماتك' : '3. How We Use Your Information'}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mr-4">
                <li>{language === 'ar' ? 'لتوفير وصيانة خدماتنا' : 'To provide and maintain our services'}</li>
                <li>{language === 'ar' ? 'لمعالجة طلبات الوظائف والتطبيقات' : 'To process job applications and requests'}</li>
                <li>{language === 'ar' ? 'لتحسين تجربة المستخدم وتخصيصها' : 'To improve and personalize user experience'}</li>
                <li>{language === 'ar' ? 'للتواصل معك بشأن الخدمات والتحديثات' : 'To communicate with you about services and updates'}</li>
                <li>{language === 'ar' ? 'لمعالجة المدفوعات والمعاملات' : 'To process payments and transactions'}</li>
                <li>{language === 'ar' ? 'لمنع الاحتيال وضمان الأمان' : 'To prevent fraud and ensure security'}</li>
                <li>{language === 'ar' ? 'للامتثال للمتطلبات القانونية' : 'To comply with legal requirements'}</li>
                <li>{language === 'ar' ? 'لإرسال رسائل إخبارية ومحتوى ترويجي (مع موافقتك)' : 'To send newsletters and promotional content (with your consent)'}</li>
              </ul>
            </div>

            {/* 4. Information Sharing */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {language === 'ar' ? '4. مشاركة المعلومات' : '4. Information Sharing'}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {language === 'ar'
                  ? 'نحن لا نبيع معلوماتك الشخصية. قد نشارك معلوماتك في الحالات التالية:'
                  : 'We do not sell your personal information. We may share your information in the following cases:'}
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mr-4">
                <li>{language === 'ar' ? 'مع أصحاب العمل عند التقدم للوظائف' : 'With employers when applying for jobs'}</li>
                <li>{language === 'ar' ? 'مع مقدمي الخدمات الخارجيين الموثوق بهم' : 'With trusted third-party service providers'}</li>
                <li>{language === 'ar' ? 'مع السلطات القانونية عند الضرورة' : 'With legal authorities when required by law'}</li>
                <li>{language === 'ar' ? 'في حالة الاندماج أو الاستحواذ' : 'In case of merger or acquisition'}</li>
                <li>{language === 'ar' ? 'مع موافقتك الصريحة' : 'With your explicit consent'}</li>
              </ul>
            </div>

            {/* 5. Data Security */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {language === 'ar' ? '5. أمان البيانات' : '5. Data Security'}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {language === 'ar'
                  ? 'نستخدم تدابير أمنية تقنية وتنظيمية لحماية معلوماتك الشخصية:'
                  : 'We use technical and organizational security measures to protect your personal information:'}
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mr-4">
                <li>{language === 'ar' ? 'تشفير SSL/TLS لنقل البيانات' : 'SSL/TLS encryption for data transmission'}</li>
                <li>{language === 'ar' ? 'تشفير قاعدة البيانات والنسخ الاحتياطي الآمن' : 'Database encryption and secure backups'}</li>
                <li>{language === 'ar' ? 'ضوابط الوصول والمصادقة' : 'Access controls and authentication'}</li>
                <li>{language === 'ar' ? 'المراقبة الأمنية المنتظمة والتدقيق' : 'Regular security monitoring and audits'}</li>
                <li>{language === 'ar' ? 'تدريب الموظفين على حماية البيانات' : 'Employee training on data protection'}</li>
                <li>{language === 'ar' ? 'خطط الاستجابة للحوادث' : 'Incident response plans'}</li>
              </ul>
            </div>

            {/* 6. Cookies and Tracking */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {language === 'ar' ? '6. ملفات تعريف الارتباط والتتبع' : '6. Cookies and Tracking'}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {language === 'ar'
                  ? 'نستخدم ملفات تعريف الارتباط وتقنيات التتبع المماثلة لتحسين خدماتنا:'
                  : 'We use cookies and similar tracking technologies to improve our services:'}
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mr-4">
                <li>{language === 'ar' ? 'ملفات تعريف الارتباط الأساسية: المطلوبة لوظائف الموقع' : 'Essential cookies: Required for site functionality'}</li>
                <li>{language === 'ar' ? 'ملفات تعريف الارتباط التحليلية: لفهم استخدام المنصة' : 'Analytics cookies: To understand platform usage'}</li>
                <li>{language === 'ar' ? 'ملفات تعريف الارتباط الوظيفية: لتذكر تفضيلاتك' : 'Functional cookies: To remember your preferences'}</li>
                <li>{language === 'ar' ? 'ملفات تعريف الارتباط التسويقية: للإعلانات المستهدفة (مع الموافقة)' : 'Marketing cookies: For targeted advertising (with consent)'}</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                {language === 'ar'
                  ? 'يمكنك التحكم في ملفات تعريف الارتباط من خلال إعدادات المتصفح الخاص بك.'
                  : 'You can control cookies through your browser settings.'}
              </p>
            </div>

            {/* 7. Your Rights */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {language === 'ar' ? '7. حقوقك' : '7. Your Rights'}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {language === 'ar'
                  ? 'لديك الحقوق التالية فيما يتعلق بمعلوماتك الشخصية:'
                  : 'You have the following rights regarding your personal information:'}
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mr-4">
                <li>{language === 'ar' ? 'الحق في الوصول: الحصول على نسخة من بياناتك' : 'Right to access: Obtain a copy of your data'}</li>
                <li>{language === 'ar' ? 'الحق في التصحيح: تحديث المعلومات غير الدقيقة' : 'Right to rectification: Update inaccurate information'}</li>
                <li>{language === 'ar' ? 'الحق في الحذف: طلب حذف البيانات' : 'Right to erasure: Request data deletion'}</li>
                <li>{language === 'ar' ? 'الحق في التقييد: الحد من معالجة البيانات' : 'Right to restriction: Limit data processing'}</li>
                <li>{language === 'ar' ? 'الحق في إمكانية النقل: نقل البيانات إلى خدمة أخرى' : 'Right to portability: Transfer data to another service'}</li>
                <li>{language === 'ar' ? 'الحق في الاعتراض: الاعتراض على معالجة معينة' : 'Right to object: Object to certain processing'}</li>
                <li>{language === 'ar' ? 'الحق في سحب الموافقة: سحب الموافقة في أي وقت' : 'Right to withdraw consent: Withdraw consent at any time'}</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                {language === 'ar'
                  ? 'لممارسة حقوقك، يرجى الاتصال بنا على support@tf1one.com'
                  : 'To exercise your rights, please contact us at support@tf1one.com'}
              </p>
            </div>

            {/* 8. Data Retention */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {language === 'ar' ? '8. الاحتفاظ بالبيانات' : '8. Data Retention'}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {language === 'ar'
                  ? 'نحتفظ بمعلوماتك الشخصية طالما كان ذلك ضروريًا:'
                  : 'We retain your personal information for as long as necessary to:'}
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mr-4">
                <li>{language === 'ar' ? 'توفير خدماتنا لك' : 'Provide our services to you'}</li>
                <li>{language === 'ar' ? 'الامتثال للالتزامات القانونية' : 'Comply with legal obligations'}</li>
                <li>{language === 'ar' ? 'حل النزاعات وإنفاذ الاتفاقيات' : 'Resolve disputes and enforce agreements'}</li>
                <li>{language === 'ar' ? 'الحفاظ على سجلات الأعمال المشروعة' : 'Maintain legitimate business records'}</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                {language === 'ar'
                  ? 'بعد انتهاء فترة الاحتفاظ، سنحذف بياناتك أو نجعلها مجهولة بشكل آمن.'
                  : 'After the retention period, we will securely delete or anonymize your data.'}
              </p>
            </div>

            {/* 9. Third-Party Links */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {language === 'ar' ? '9. روابط الطرف الثالث' : '9. Third-Party Links'}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {language === 'ar'
                  ? 'قد تحتوي منصتنا على روابط لمواقع ويب تابعة لجهات خارجية. نحن لسنا مسؤولين عن ممارسات الخصوصية أو محتوى هذه المواقع. نشجعك على قراءة سياسات الخصوصية الخاصة بهم.'
                  : 'Our platform may contain links to third-party websites. We are not responsible for the privacy practices or content of these sites. We encourage you to read their privacy policies.'}
              </p>
            </div>

            {/* 10. Children's Privacy */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {language === 'ar' ? '10. خصوصية الأطفال' : '10. Children\'s Privacy'}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {language === 'ar'
                  ? 'خدماتنا غير مخصصة للأفراد الذين تقل أعمارهم عن 18 عامًا. نحن لا نجمع عن قصد معلومات شخصية من الأطفال. إذا علمنا أننا جمعنا معلومات من طفل، فسنحذفها على الفور.'
                  : 'Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If we learn we have collected information from a child, we will delete it immediately.'}
              </p>
            </div>

            {/* 11. International Data Transfers */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {language === 'ar' ? '11. نقل البيانات الدولية' : '11. International Data Transfers'}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {language === 'ar'
                  ? 'قد يتم نقل معلوماتك ومعالجتها في بلدان غير بلدك. نحن نضمن حماية كافية لمعلوماتك من خلال الضمانات المناسبة والامتثال للقوانين المعمول بها.'
                  : 'Your information may be transferred and processed in countries other than your own. We ensure adequate protection for your information through appropriate safeguards and compliance with applicable laws.'}
              </p>
            </div>

            {/* 12. Changes to Privacy Policy */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {language === 'ar' ? '12. التغييرات على سياسة الخصوصية' : '12. Changes to Privacy Policy'}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {language === 'ar'
                  ? 'قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنخطرك بأي تغييرات من خلال نشر السياسة الجديدة على هذه الصفحة وتحديث تاريخ "آخر تحديث". استمرار استخدامك للمنصة بعد التغييرات يشكل قبولك للسياسة المحدثة.'
                  : 'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date. Your continued use of the platform after changes constitutes acceptance of the updated policy.'}
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {language === 'ar' ? 'اتصل بنا' : 'Contact Us'}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                {language === 'ar'
                  ? 'إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه أو ممارسات البيانات الخاصة بنا، يرجى الاتصال بنا:'
                  : 'If you have any questions about this Privacy Policy or our data practices, please contact us:'}
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</p>
                    <a href="mailto:support@tf1one.com" className="text-blue-600 hover:text-blue-700">
                      support@tf1one.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">{language === 'ar' ? 'الهاتف' : 'Phone'}</p>
                    <a href="tel:+971-4-XXX-XXXX" className="text-blue-600 hover:text-blue-700">
                      +971-4-XXX-XXXX
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">{language === 'ar' ? 'العنوان' : 'Address'}</p>
                    <p className="text-gray-700">
                      {language === 'ar' ? 'دبي، الإمارات العربية المتحدة' : 'Dubai, United Arab Emirates'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Links */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/help-center" className="text-gray-600 hover:text-blue-600 transition-colors">
              {language === 'ar' ? 'مركز المساعدة' : 'Help Center'}
            </Link>
            <Link href="/faq" className="text-gray-600 hover:text-blue-600 transition-colors">
              {language === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}
            </Link>
            <Link href="/terms" className="text-gray-600 hover:text-blue-600 transition-colors">
              {language === 'ar' ? 'شروط الخدمة' : 'Terms of Service'}
            </Link>
            <Link href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors font-semibold">
              {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </Link>
          </div>
          <div className="text-center mt-8 text-gray-600 text-sm">
            © 2025 TF1 Platform. {language === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </div>
        </div>
      </section>
    </div>
  )
}
