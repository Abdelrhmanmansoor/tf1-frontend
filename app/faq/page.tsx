'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import { ChevronDown, Search, MessageCircle, Mail, Phone } from 'lucide-react'
import Link from 'next/link'

export default function FAQPage() {
  const { language } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqCategories = [
    {
      title: language === 'ar' ? 'الأسئلة العامة' : 'General Questions',
      faqs: [
        {
          question:
            language === 'ar'
              ? 'ما هي منصة TF1 للتوظيف الرياضي؟'
              : 'What is TF1 Sports Employment Platform?',
          answer:
            language === 'ar'
              ? 'TF1 هي المنصة الرقمية الرائدة في المملكة العربية السعودية لتوظيف المواهب الرياضية. نربط بين لاعبي كرة القدم والرياضيين والمدربين والمتخصصين مع الأكاديميات الرياضية والمراكز التدريبية الموثوقة في السوق السعودي. نحن نوفر منصة آمنة وموثوقة لتطوير المسارات الوظيفية الرياضية.'
              : 'TF1 is the leading digital platform in Saudi Arabia for sports talent recruitment and employment. We connect football players, athletes, coaches, and specialists with trusted sports academies and training centers in the Saudi market. We provide a secure and reliable platform for developing sports career paths.',
        },
        {
          question:
            language === 'ar'
              ? 'هل المنصة مناسبة للسوق السعودي؟'
              : 'Is the platform suitable for the Saudi market?',
          answer:
            language === 'ar'
              ? 'نعم، منصتنا مصممة خصيصاً للسوق السعودي. نركز على الأكاديميات الرياضية والمراكز التدريبية المحلية الموثوقة. كل الشركات على المنصة متحققة ومعتمدة، ونلتزم بأعلى معايير الأمان والخصوصية وفقاً للأنظمة السعودية.'
              : 'Yes, our platform is specifically designed for the Saudi market. We focus on trusted local sports academies and training centers. All organizations on the platform are verified and approved, and we comply with the highest security and privacy standards in accordance with Saudi regulations.',
        },
        {
          question:
            language === 'ar'
              ? 'كيف أبدأ في استخدام المنصة؟'
              : 'How do I get started?',
          answer:
            language === 'ar'
              ? 'ببساطة انقر على "إنشاء حساب" واختر نوع ملفك الشخصي (لاعب، مدرب، أكاديمية، أو متخصص). أكمل ملفك الشخصي بمعلوماتك الأساسية والمهارات والخبرات. بعدها ستتمكن من البحث عن فرص عمل أو نشر وظائف جديدة.'
              : 'Simply click "Create Account" and select your profile type (player, coach, academy, or specialist). Complete your profile with your basic information, skills, and experience. Then you\'ll be able to search for job opportunities or post new positions.',
        },
      ],
    },
    {
      title: language === 'ar' ? 'الحساب والملف الشخصي' : 'Account & Profile',
      faqs: [
        {
          question:
            language === 'ar'
              ? 'كيف يمكنني إنشاء ملفي الشخصي كلاعب؟'
              : 'How can I create my player profile?',
          answer:
            language === 'ar'
              ? 'انتقل إلى صفحة "إنشاء حساب"، اختر "لاعب"، ثم أكمل الخطوات التالية: أضف صورتك الشخصية، أضف بيانات أساسية (الاسم، العمر، المدينة)، أضف تاريخك الرياضي والمؤهلات. يمكنك تحديث ملفك في أي وقت من لوحة التحكم.'
              : 'Go to "Create Account", select "Player", then complete these steps: Add your profile photo, add basic information (name, age, city), add your sports history and qualifications. You can update your profile anytime from your dashboard.',
        },
        {
          question:
            language === 'ar'
              ? 'كيف أحافظ على أمان حسابي؟'
              : 'How do I keep my account secure?',
          answer:
            language === 'ar'
              ? 'استخدم كلمة مرور قوية تحتوي على أحرف وأرقام ورموز. فعّل المصادقة الثنائية من الإعدادات. لا تشارك كلمة المرور مع أحد. إذا كنت تشك في نشاط مريب، غيّر كلمة المرور فوراً وتواصل معنا.'
              : 'Use a strong password with letters, numbers, and symbols. Enable two-factor authentication from settings. Never share your password. If you suspect suspicious activity, change your password immediately and contact us.',
        },
        {
          question:
            language === 'ar'
              ? 'هل يمكنني تحويل نوع حسابي من لاعب إلى أكاديمية؟'
              : 'Can I change my account type?',
          answer:
            language === 'ar'
              ? 'لا يمكن تحويل نوع الحساب مباشرة. إذا كنت تريد تبديل نوع حسابك، يمكنك إنشاء حساب جديد بالنوع المطلوب. تواصل مع فريق الدعم إذا كنت بحاجة إلى مساعدة في نقل بياناتك.'
              : 'Account types cannot be directly converted. If you want to switch account types, you can create a new account with the desired type. Contact our support team if you need help transferring your data.',
        },
      ],
    },
    {
      title: language === 'ar' ? 'البحث والفرص الوظيفية' : 'Search & Job Opportunities',
      faqs: [
        {
          question:
            language === 'ar'
              ? 'كيف أبحث عن فرص وظيفية في المملكة؟'
              : 'How do I search for job opportunities in Saudi Arabia?',
          answer:
            language === 'ar'
              ? 'استخدم شريط البحث الرئيسي وحدد المدينة (الرياض، جدة، الدمام، إلخ)، نوع الرياضة، والمسمى الوظيفي. يمكنك تصفية النتائج حسب المؤهلات المطلوبة والراتب. فعّل الإشعارات لتتلقى تنبيهات عند ظهور فرص جديدة مناسبة لك.'
              : 'Use the main search bar and select a city (Riyadh, Jeddah, Dammam, etc.), sport type, and job title. You can filter results by required qualifications and salary. Enable notifications to receive alerts when new suitable opportunities appear.',
        },
        {
          question:
            language === 'ar'
              ? 'كيف تنشر أكاديمية رياضية فرصة وظيفية؟'
              : 'How does a sports academy post a job opportunity?',
          answer:
            language === 'ar'
              ? 'انتقل إلى لوحة تحكم الأكاديمية، اختر "نشر فرصة جديدة"، أضف تفاصيل الفرصة (المسمى، الوصف، المتطلبات، الراتب، المدينة). تأكد من وصف احتياجاتك بوضوح لجذب أفضل المرشحين. يمكنك تعديل أو حذف الفرصة في أي وقت.'
              : 'Go to your academy dashboard, select "Post New Opportunity", add opportunity details (title, description, requirements, salary, city). Make sure to clearly describe your needs to attract the best candidates. You can edit or remove the opportunity anytime.',
        },
        {
          question:
            language === 'ar'
              ? 'ما هي أفضل طريقة للتقديم على فرصة؟'
              : 'What is the best way to apply for an opportunity?',
          answer:
            language === 'ar'
              ? 'تأكد أن ملفك الشخصي مكتمل ومحدّث قبل التقديم. اقرأ متطلبات الفرصة بعناية وتأكد من أنك تستوفيها. اكتب رسالة تقديم شخصية توضح لماذا أنت الخيار الأفضل. استجب بسرعة إذا تم الاتصال بك من قبل الأكاديمية.'
              : 'Ensure your profile is complete and up-to-date before applying. Read the opportunity requirements carefully and confirm you meet them. Write a personal cover letter explaining why you\'re the best choice. Respond promptly if the academy contacts you.',
        },
      ],
    },
    {
      title: language === 'ar' ? 'الدفع والتسعير' : 'Payment & Pricing',
      faqs: [
        {
          question:
            language === 'ar'
              ? 'هل الخطة الأساسية مجانية تماماً؟'
              : 'Is the basic plan completely free?',
          answer:
            language === 'ar'
              ? 'نعم! الخطة الأساسية مجانية تماماً. تشمل الخطة المجانية البحث عن الفرص الوظيفية، إنشاء ملف شخصي، والتقديم على الفرص. إذا كنت بحاجة لميزات متقدمة مثل الإحصائيات المفصلة والدعم المتخصص، يمكنك الترقية لخطة مدفوعة.'
              : 'Yes! The basic plan is completely free. The free plan includes job search, profile creation, and applying for opportunities. If you need advanced features like detailed analytics and specialized support, you can upgrade to a paid plan.',
        },
        {
          question:
            language === 'ar'
              ? 'ما هي طرق الدفع المقبولة؟'
              : 'What payment methods are accepted?',
          answer:
            language === 'ar'
              ? 'نقبل بطاقات الائتمان والخصم (Visa, MasterCard)، محافظ رقمية سعودية، والتحويل البنكي. جميع المعاملات محمية بتشفير عالي ومعايير أمان دولية. يمكنك إدارة طرق الدفع من إعداداتك.'
              : 'We accept credit and debit cards (Visa, MasterCard), Saudi digital wallets, and bank transfers. All transactions are protected with high-level encryption and international security standards. You can manage payment methods from your settings.',
        },
        {
          question:
            language === 'ar'
              ? 'هل يمكن استرجاع الأموال في حالة عدم الرضا؟'
              : 'Is there a money-back guarantee?',
          answer:
            language === 'ar'
              ? 'نعم، نقدم ضمان استرجاع الأموال لمدة 7 أيام من تاريخ الشراء دون شروط. إذا لم تكن راضياً عن الخدمة، تواصل معنا وسنرجع أموالك بالكامل فوراً.'
              : 'Yes, we offer a 7-day money-back guarantee from the date of purchase with no questions asked. If you\'re not satisfied with the service, contact us and we\'ll refund your money immediately.',
        },
      ],
    },
    {
      title: language === 'ar' ? 'الأمان والخصوصية' : 'Security & Privacy',
      faqs: [
        {
          question:
            language === 'ar'
              ? 'هل بياناتي الشخصية محمية؟'
              : 'Is my personal data protected?',
          answer:
            language === 'ar'
              ? 'نعم تماماً! نحن نلتزم بأعلى معايير حماية البيانات. نستخدم تشفير عسكري (AES-256)، وبروتوكولات HTTPS آمنة، وتخزين آمن في خوادم موثوقة. لا نبيع بياناتك لأي جهة خارجية. بياناتك ملكك وحدك.'
              : 'Absolutely yes! We comply with the highest data protection standards. We use military-grade encryption (AES-256), secure HTTPS protocols, and safe storage in trusted servers. We never sell your data to third parties. Your data is yours alone.',
        },
        {
          question:
            language === 'ar'
              ? 'كيف يمكن للأكاديميات التحقق من المتقدمين؟'
              : 'How can academies verify applicants?',
          answer:
            language === 'ar'
              ? 'كل ملف شخصي يحتوي على معلومات يمكن التحقق منها (الصور، الشهادات، الخبرة). الأكاديميات المعتمدة يمكنها التواصل مباشرة مع المتقدمين والتحقق من بيانات الاتصال. نحن نوفر أدوات للتحقق الأمني من جميع الأطراف.'
              : 'Every profile contains verifiable information (photos, certificates, experience). Approved academies can contact applicants directly and verify contact information. We provide security verification tools for all parties.',
        },
        {
          question:
            language === 'ar'
              ? 'كيف تحمي المنصة من عمليات الاحتيال؟'
              : 'How does the platform protect against fraud?',
          answer:
            language === 'ar'
              ? 'نتحقق من جميع الأكاديميات قبل الموافقة عليها. نراقب العمليات بشكل مستمر، ونكتشف الأنشطة المريبة تلقائياً. يمكنك الإبلاغ عن أي مشكلة فوراً وفريقنا يتحقق منها خلال 24 ساعة. أمانك والتزامك القانوني أولويتنا.'
              : 'We verify all academies before approval. We monitor transactions continuously and automatically detect suspicious activity. You can report any issues immediately and our team investigates within 24 hours. Your security and legal protection are our priority.',
        },
      ],
    },
    {
      title: language === 'ar' ? 'الدعم الفني' : 'Technical Support',
      faqs: [
        {
          question:
            language === 'ar'
              ? 'المنصة تعمل ببطء أو لا تحمل، ماذا أفعل؟'
              : 'The platform is slow or not loading, what should I do?',
          answer:
            language === 'ar'
              ? 'أولاً: أعد تحميل الصفحة (F5). ثانياً: امسح ذاكرة التخزين المؤقت للمتصفح. ثالثاً: تأكد من اتصالك بالإنترنت بسرعة جيدة. استخدم متصفح حديث (Chrome, Safari, Edge). إذا استمرت المشكلة، تواصل معنا مع لقطة شاشة للمشكلة.'
              : 'First: Refresh the page (F5). Second: Clear your browser cache. Third: Ensure you have a good internet connection. Use a modern browser (Chrome, Safari, Edge). If the issue persists, contact us with a screenshot of the problem.',
        },
        {
          question:
            language === 'ar'
              ? 'لم أتمكن من تسجيل الدخول، ماذا أفعل؟'
              : 'I cannot log in, what should I do?',
          answer:
            language === 'ar'
              ? 'تحقق من أن بريدك الإلكتروني وكلمة المرور صحيحة. استخدم "نسيت كلمة المرور" لإعادة تعيين كلمة المرور. تحقق من البريد الإلكتروني الذي تلقيت رسالة إعادة التعيين فيه (تحقق من مجلد البريد العشوائي). إذا لم ينجح شيء، اتصل بنا مباشرة عبر الدردشة المباشرة.'
              : 'Check that your email and password are correct. Use "Forgot Password" to reset your password. Check the email you received the reset link in (check spam folder). If nothing works, contact us via live chat right away.',
        },
        {
          question:
            language === 'ar'
              ? 'كيف أتواصل مع فريق الدعم؟'
              : 'How do I contact the support team?',
          answer:
            language === 'ar'
              ? 'اختر الطريقة التي تفضلها: 1) الدردشة المباشرة (أسرع - متاحة 24/7) 2) البريد الإلكتروني: contact@tf1one.com 3) الهاتف: +966 50 123 4567 4) زيارة صفحة "اتصل بنا". الرد على جميع الاستفسارات خلال 24 ساعة كحد أقصى.'
              : 'Choose your preferred method: 1) Live chat (fastest - available 24/7) 2) Email: contact@tf1one.com 3) Phone: +966 50 123 4567 4) Visit "Contact Us" page. We respond to all inquiries within 24 hours maximum.',
        },
      ],
    },
  ]

  const filteredFAQs = faqCategories.map((category) => ({
    ...category,
    faqs: category.faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }))

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 ${language === 'ar' ? 'font-arabic' : 'font-english'}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-green-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              {language === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-8">
              {language === 'ar'
                ? 'ابحث عن إجابات لأكثر الأسئلة شيوعاً'
                : 'Find answers to the most common questions'}
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={
                  language === 'ar' ? 'ابحث في الأسئلة...' : 'Search questions...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          {filteredFAQs.map(
            (category, categoryIndex) =>
              category.faqs.length > 0 && (
                <motion.div
                  key={categoryIndex}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                >
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                    {category.title}
                  </h2>

                  <div className="space-y-4">
                    {category.faqs.map((faq, faqIndex) => {
                      const globalIndex = categoryIndex * 100 + faqIndex
                      const isOpen = openIndex === globalIndex

                      return (
                        <motion.div
                          key={faqIndex}
                          className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                          <button
                            onClick={() =>
                              setOpenIndex(isOpen ? null : globalIndex)
                            }
                            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
                          >
                            <span className="font-semibold text-gray-900 pr-4">
                              {faq.question}
                            </span>
                            <motion.div
                              animate={{ rotate: isOpen ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                            </motion.div>
                          </button>

                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                                  {faq.answer}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              )
          )}
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-blue-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              {language === 'ar'
                ? 'لم تجد إجابة لسؤالك؟'
                : "Didn't find what you're looking for?"}
            </h2>
            <p className="text-lg text-white/90 mb-8">
              {language === 'ar'
                ? 'فريق الدعم لدينا جاهز لمساعدتك'
                : 'Our support team is ready to help you'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Link
                href="/contact"
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300"
              >
                <MessageCircle className="w-8 h-8 text-white mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">
                  {language === 'ar' ? 'دردشة مباشرة' : 'Live Chat'}
                </h3>
                <p className="text-white/80 text-sm">
                  {language === 'ar' ? 'متاح 24/7' : 'Available 24/7'}
                </p>
              </Link>

              <a
                href="mailto:contact@tf1one.com"
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300"
              >
                <Mail className="w-8 h-8 text-white mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                </h3>
                <p className="text-white/80 text-sm">contact@tf1one.com</p>
              </a>

              <a
                href="tel:+966501234567"
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300"
              >
                <Phone className="w-8 h-8 text-white mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">
                  {language === 'ar' ? 'الهاتف' : 'Phone'}
                </h3>
                <p className="text-white/80 text-sm" dir="ltr">+966 50 123 4567</p>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
