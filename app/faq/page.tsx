'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import { Navbar } from '@/components/navbar'
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
              ? 'ما هو TF1 وكيف يعمل؟'
              : 'What is TF1 and how does it work?',
          answer:
            language === 'ar'
              ? 'TF1 هي منصة رائدة عالمياً تربط المواهب الرياضية مع الفرص الوظيفية في مجال الرياضة. نحن نوفر أدوات بحث متقدمة، مطابقة ذكية مدعومة بالذكاء الاصطناعي، ونربط بين اللاعبين والمدربين والأندية والمتخصصين في جميع أنحاء العالم.'
              : 'TF1 is a leading global platform that connects sports talents with career opportunities in the sports industry. We provide advanced search tools, AI-powered smart matching, and connect players, coaches, clubs, and specialists worldwide.',
        },
        {
          question:
            language === 'ar'
              ? 'هل المنصة مجانية؟'
              : 'Is the platform free to use?',
          answer:
            language === 'ar'
              ? 'نعم، نقدم خطة مجانية تتيح لك الوصول إلى الميزات الأساسية. كما نوفر خطط مدفوعة للمحترفين والشركات التي توفر ميزات متقدمة مثل التحليلات الشاملة، الأولوية في البحث، والدعم المخصص.'
              : 'Yes, we offer a free plan that gives you access to basic features. We also provide paid plans for professionals and businesses that include advanced features like comprehensive analytics, priority search, and dedicated support.',
        },
        {
          question:
            language === 'ar'
              ? 'كيف أبدأ في استخدام المنصة؟'
              : 'How do I get started?',
          answer:
            language === 'ar'
              ? 'ببساطة اضغط على "إنشاء حساب" واختر نوع حسابك (لاعب، مدرب، نادي، أو متخصص). املأ ملفك الشخصي بمعلوماتك ومهاراتك وخبراتك، وستكون جاهزاً للبدء في البحث عن الفرص أو نشر الوظائف!'
              : 'Simply click "Create Account" and choose your account type (player, coach, club, or specialist). Fill out your profile with your information, skills, and experience, and you\'ll be ready to start searching for opportunities or posting jobs!',
        },
      ],
    },
    {
      title: language === 'ar' ? 'الحساب والملف الشخصي' : 'Account & Profile',
      faqs: [
        {
          question:
            language === 'ar'
              ? 'كيف يمكنني تحديث ملفي الشخصي؟'
              : 'How can I update my profile?',
          answer:
            language === 'ar'
              ? 'انتقل إلى لوحة التحكم الخاصة بك، اضغط على "الإعدادات" ثم "الملف الشخصي". يمكنك تحديث معلوماتك الشخصية، المهارات، الخبرات، الصور، ومقاطع الفيديو في أي وقت.'
              : 'Go to your dashboard, click on "Settings" then "Profile". You can update your personal information, skills, experience, photos, and videos at any time.',
        },
        {
          question:
            language === 'ar'
              ? 'كيف أستعيد كلمة المرور الخاصة بي؟'
              : 'How do I recover my password?',
          answer:
            language === 'ar'
              ? 'في صفحة تسجيل الدخول، اضغط على "نسيت كلمة المرور". أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور. تأكد من التحقق من مجلد البريد العشوائي إذا لم تجد الرسالة.'
              : 'On the login page, click "Forgot Password". Enter your email and we\'ll send you a password reset link. Make sure to check your spam folder if you don\'t see the email.',
        },
        {
          question:
            language === 'ar'
              ? 'هل يمكنني حذف حسابي؟'
              : 'Can I delete my account?',
          answer:
            language === 'ar'
              ? 'نعم، يمكنك حذف حسابك في أي وقت من خلال الانتقال إلى الإعدادات > الأمان > حذف الحساب. يرجى ملاحظة أن هذا الإجراء لا يمكن التراجع عنه وسيتم حذف جميع بياناتك بشكل دائم.'
              : 'Yes, you can delete your account at any time by going to Settings > Security > Delete Account. Please note that this action is irreversible and all your data will be permanently deleted.',
        },
      ],
    },
    {
      title: language === 'ar' ? 'البحث والتوظيف' : 'Search & Hiring',
      faqs: [
        {
          question:
            language === 'ar'
              ? 'كيف أبحث عن وظائف؟'
              : 'How do I search for jobs?',
          answer:
            language === 'ar'
              ? 'استخدم شريط البحث في الصفحة الرئيسية أو صفحة الوظائف. يمكنك البحث بالكلمات المفتاحية، الموقع، نوع الرياضة، مستوى الخبرة، والراتب. نظامنا المدعوم بالذكاء الاصطناعي سيقترح أيضاً وظائف مناسبة لك بناءً على ملفك الشخصي.'
              : 'Use the search bar on the homepage or jobs page. You can search by keywords, location, sport type, experience level, and salary. Our AI-powered system will also suggest suitable jobs for you based on your profile.',
        },
        {
          question:
            language === 'ar'
              ? 'كيف يمكنني نشر وظيفة؟'
              : 'How can I post a job?',
          answer:
            language === 'ar'
              ? 'للأندية والمؤسسات: انتقل إلى لوحة التحكم واضغط على "نشر وظيفة جديدة". املأ تفاصيل الوظيفة بما في ذلك المسمى الوظيفي، الوصف، المتطلبات، الراتب، والموقع. يمكنك أيضاً تحديد المهارات المطلوبة لمساعدة نظامنا في المطابقة.'
              : 'For clubs and organizations: Go to your dashboard and click "Post New Job". Fill in the job details including title, description, requirements, salary, and location. You can also specify required skills to help our matching system.',
        },
        {
          question:
            language === 'ar'
              ? 'كم من الوقت يستغرق العثور على وظيفة؟'
              : 'How long does it take to find a job?',
          answer:
            language === 'ar'
              ? 'يختلف الوقت حسب التخصص ومستوى الخبرة، لكن معظم مستخدمينا يجدون فرصاً مناسبة خلال 2-4 أسابيع. نوصي بتحديث ملفك الشخصي بانتظام، التقديم على وظائف متعددة، وتفعيل الإشعارات للفرص الجديدة.'
              : 'The time varies by specialization and experience level, but most of our users find suitable opportunities within 2-4 weeks. We recommend regularly updating your profile, applying to multiple jobs, and enabling notifications for new opportunities.',
        },
      ],
    },
    {
      title: language === 'ar' ? 'الدفع والاشتراكات' : 'Payment & Subscriptions',
      faqs: [
        {
          question:
            language === 'ar'
              ? 'ما هي خيارات الدفع المتاحة؟'
              : 'What payment options are available?',
          answer:
            language === 'ar'
              ? 'نقبل جميع بطاقات الائتمان والخصم الرئيسية (Visa, MasterCard, American Express)، PayPal، والتحويلات البنكية للحسابات المؤسسية. جميع المعاملات آمنة ومشفرة.'
              : 'We accept all major credit and debit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise accounts. All transactions are secure and encrypted.',
        },
        {
          question:
            language === 'ar'
              ? 'هل يمكنني إلغاء اشتراكي؟'
              : 'Can I cancel my subscription?',
          answer:
            language === 'ar'
              ? 'نعم، يمكنك إلغاء اشتراكك في أي وقت. انتقل إلى الإعدادات > الاشتراك > إلغاء الاشتراك. سيظل لديك وصول إلى الميزات المدفوعة حتى نهاية فترة الفوترة الحالية.'
              : 'Yes, you can cancel your subscription at any time. Go to Settings > Subscription > Cancel Subscription. You\'ll retain access to premium features until the end of your current billing period.',
        },
        {
          question:
            language === 'ar'
              ? 'هل هناك سياسة استرداد؟'
              : 'Is there a refund policy?',
          answer:
            language === 'ar'
              ? 'نقدم ضمان استرداد الأموال لمدة 14 يوماً للاشتراكات الجديدة. إذا لم تكن راضياً عن الخدمة خلال أول 14 يوماً، اتصل بفريق الدعم للحصول على استرداد كامل.'
              : 'We offer a 14-day money-back guarantee for new subscriptions. If you\'re not satisfied with the service within the first 14 days, contact our support team for a full refund.',
        },
      ],
    },
    {
      title: language === 'ar' ? 'الأمان والخصوصية' : 'Security & Privacy',
      faqs: [
        {
          question:
            language === 'ar'
              ? 'هل بياناتي آمنة؟'
              : 'Is my data secure?',
          answer:
            language === 'ar'
              ? 'نعم، أمان بياناتك هو أولويتنا القصوى. نستخدم تشفير من الدرجة العسكرية (AES-256)، بروتوكولات HTTPS آمنة، ونخزن البيانات في خوادم سحابية معتمدة بمعايير ISO. لا نشارك بياناتك الشخصية مع أطراف ثالثة بدون موافقتك.'
              : 'Yes, your data security is our top priority. We use military-grade encryption (AES-256), secure HTTPS protocols, and store data in ISO-certified cloud servers. We never share your personal data with third parties without your consent.',
        },
        {
          question:
            language === 'ar'
              ? 'من يمكنه رؤية ملفي الشخصي؟'
              : 'Who can see my profile?',
          answer:
            language === 'ar'
              ? 'يمكنك التحكم في خصوصية ملفك الشخصي من الإعدادات. يمكنك اختيار جعل ملفك عاماً (مرئياً للجميع)، خاصاً (مرئياً فقط للأندية المعتمدة)، أو مخفياً (غير قابل للبحث). يمكنك أيضاً إخفاء معلومات محددة.'
              : 'You can control your profile privacy from settings. You can choose to make your profile public (visible to everyone), private (visible only to verified clubs), or hidden (not searchable). You can also hide specific information.',
        },
        {
          question:
            language === 'ar'
              ? 'كيف تحمون من الاحتيال؟'
              : 'How do you protect against fraud?',
          answer:
            language === 'ar'
              ? 'نتحقق من جميع الأندية والمؤسسات قبل السماح لهم بنشر الوظائف. نستخدم أنظمة كشف الاحتيال المتقدمة، ونراقب النشاط المشبوه، ونوفر أدوات للإبلاغ عن أي سلوك مشبوه. فريقنا متاح دائماً للتحقيق في أي مخاوف.'
              : 'We verify all clubs and organizations before allowing them to post jobs. We use advanced fraud detection systems, monitor suspicious activity, and provide tools to report any suspicious behavior. Our team is always available to investigate concerns.',
        },
      ],
    },
    {
      title: language === 'ar' ? 'الدعم الفني' : 'Technical Support',
      faqs: [
        {
          question:
            language === 'ar'
              ? 'المنصة لا تعمل بشكل صحيح، ماذا أفعل؟'
              : 'The platform is not working properly, what should I do?',
          answer:
            language === 'ar'
              ? 'أولاً، جرب تحديث الصفحة أو مسح ذاكرة التخزين المؤقت للمتصفح. إذا استمرت المشكلة، تحقق من اتصالك بالإنترنت وتأكد من استخدام متصفح محدث. إذا لم تحل المشكلة، اتصل بفريق الدعم الفني مع وصف تفصيلي للمشكلة.'
              : 'First, try refreshing the page or clearing your browser cache. If the problem persists, check your internet connection and ensure you\'re using an updated browser. If the issue continues, contact our technical support team with a detailed description of the problem.',
        },
        {
          question:
            language === 'ar'
              ? 'هل يوجد تطبيق للهاتف المحمول؟'
              : 'Is there a mobile app?',
          answer:
            language === 'ar'
              ? 'نعم، لدينا تطبيقات أصلية لنظامي iOS و Android. يمكنك تحميلها من App Store أو Google Play. التطبيقات توفر نفس الميزات الموجودة على الموقع الإلكتروني مع واجهة محسنة للهواتف المحمولة.'
              : 'Yes, we have native apps for both iOS and Android. You can download them from the App Store or Google Play. The apps provide the same features as the website with an optimized mobile interface.',
        },
        {
          question:
            language === 'ar'
              ? 'كيف أتواصل مع الدعم الفني؟'
              : 'How do I contact technical support?',
          answer:
            language === 'ar'
              ? 'يمكنك التواصل معنا عبر: الدردشة المباشرة (متاح 24/7)، البريد الإلكتروني (support@tf1one.com)، الهاتف (+1-555-123-4567)، أو نموذج الاتصال في صفحة "اتصل بنا". متوسط وقت الرد أقل من ساعتين.'
              : 'You can reach us via: Live chat (available 24/7), email (support@tf1one.com), phone (+1-555-123-4567), or the contact form on the "Contact Us" page. Our average response time is less than 2 hours.',
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
      <Navbar activeMode="application" activePage="faq" />

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
                href="mailto:support@sportx.com"
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300"
              >
                <Mail className="w-8 h-8 text-white mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                </h3>
                <p className="text-white/80 text-sm">support@tf1one.com</p>
              </a>

              <a
                href="tel:+15551234567"
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300"
              >
                <Phone className="w-8 h-8 text-white mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">
                  {language === 'ar' ? 'الهاتف' : 'Phone'}
                </h3>
                <p className="text-white/80 text-sm">+1 (555) 123-4567</p>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            {language === 'ar'
              ? '© 2025 منصة TF1. جميع الحقوق محفوظة'
              : '© 2025 TF1 Platform. All rights reserved'}
          </p>
        </div>
      </footer>
    </div>
  )
}
