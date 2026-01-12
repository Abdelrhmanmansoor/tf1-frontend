'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import { FileText, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function TermsOfServicePage() {
  const { language } = useLanguage()

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 ${language === 'ar' ? 'font-arabic' : 'font-english'}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-green-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <FileText className="w-16 h-16 text-white mx-auto mb-6" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              {language === 'ar' ? 'شروط الخدمة' : 'Terms of Service'}
            </h1>
            <p className="text-lg text-white/90">
              {language === 'ar'
                ? 'آخر تحديث: 12 يناير 2025'
                : 'Last updated: January 12, 2025'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl"
          >
            {/* Introduction */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {language === 'ar' ? 'مقدمة' : 'Introduction'}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {language === 'ar'
                  ? 'مرحباً بك في TF1. من خلال الوصول إلى منصتنا واستخدامها، فإنك توافق على الالتزام بشروط الخدمة هذه. يرجى قراءة هذه الشروط بعناية قبل استخدام خدماتنا.'
                  : 'Welcome to TF1. By accessing and using our platform, you agree to be bound by these Terms of Service. Please read these terms carefully before using our services.'}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {language === 'ar'
                  ? 'إذا كنت لا توافق على أي جزء من هذه الشروط، فلا يجوز لك استخدام منصتنا.'
                  : 'If you do not agree to any part of these terms, you may not use our platform.'}
              </p>
            </div>

            {/* Acceptance */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {language === 'ar' ? '1. قبول الشروط' : '1. Acceptance of Terms'}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {language === 'ar'
                  ? 'باستخدامك لمنصة TF1، فإنك توافق على:'
                  : 'By using the TF1 platform, you agree to:'}
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mr-4">
                <li>
                  {language === 'ar'
                    ? 'الالتزام بجميع الشروط والأحكام المذكورة في هذه الوثيقة'
                    : 'Comply with all terms and conditions stated in this document'}
                </li>
                <li>
                  {language === 'ar'
                    ? 'استخدام المنصة بطريقة قانونية وأخلاقية'
                    : 'Use the platform in a legal and ethical manner'}
                </li>
                <li>
                  {language === 'ar'
                    ? 'تقديم معلومات دقيقة وصحيحة عند التسجيل'
                    : 'Provide accurate and truthful information during registration'}
                </li>
                <li>
                  {language === 'ar'
                    ? 'الحفاظ على سرية بيانات تسجيل الدخول الخاصة بك'
                    : 'Maintain the confidentiality of your login credentials'}
                </li>
              </ul>
            </div>

            {/* User Accounts */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {language === 'ar' ? '2. حسابات المستخدمين' : '2. User Accounts'}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {language === 'ar'
                  ? 'عند إنشاء حساب على TF1، يجب عليك:'
                  : 'When creating an account on TF1, you must:'}
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mr-4">
                <li>
                  {language === 'ar'
                    ? 'أن تكون قد بلغت 16 عاماً على الأقل'
                    : 'Be at least 16 years of age'}
                </li>
                <li>
                  {language === 'ar'
                    ? 'تقديم معلومات دقيقة وحديثة'
                    : 'Provide accurate and current information'}
                </li>
                <li>
                  {language === 'ar'
                    ? 'الحفاظ على أمان كلمة المرور الخاصة بك'
                    : 'Maintain the security of your password'}
                </li>
                <li>
                  {language === 'ar'
                    ? 'إخطارنا فوراً بأي استخدام غير مصرح به لحسابك'
                    : 'Notify us immediately of any unauthorized use of your account'}
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                {language === 'ar'
                  ? 'أنت مسؤول عن جميع الأنشطة التي تحدث تحت حسابك. نحتفظ بالحق في تعليق أو إنهاء الحسابات التي تنتهك هذه الشروط.'
                  : 'You are responsible for all activities that occur under your account. We reserve the right to suspend or terminate accounts that violate these terms.'}
              </p>
            </div>

            {/* Services */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {language === 'ar' ? '3. الخدمات المقدمة' : '3. Services Provided'}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {language === 'ar'
                  ? 'توفر TF1 منصة تربط بين:'
                  : 'TF1 provides a platform that connects:'}
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mr-4">
                <li>
                  {language === 'ar'
                    ? 'اللاعبين الرياضيين الباحثين عن فرص وظيفية'
                    : 'Athletes seeking career opportunities'}
                </li>
                <li>
                  {language === 'ar'
                    ? 'المدربين الذين يبحثون عن وظائف في الأندية والمؤسسات'
                    : 'Coaches looking for positions with clubs and organizations'}
                </li>
                <li>
                  {language === 'ar'
                    ? 'الأندية والمؤسسات الرياضية التي تبحث عن المواهب'
                    : 'Clubs and sports organizations searching for talent'}
                </li>
                <li>
                  {language === 'ar'
                    ? 'المتخصصين في المجال الرياضي'
                    : 'Specialists in the sports industry'}
                </li>
              </ul>
            </div>

            {/* User Conduct */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {language === 'ar' ? '4. سلوك المستخدم' : '4. User Conduct'}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {language === 'ar'
                  ? 'أنت توافق على عدم:'
                  : 'You agree not to:'}
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mr-4">
                <li>
                  {language === 'ar'
                    ? 'نشر محتوى مسيء أو غير قانوني أو ضار'
                    : 'Post abusive, illegal, or harmful content'}
                </li>
                <li>
                  {language === 'ar'
                    ? 'انتحال شخصية أي شخص أو كيان'
                    : 'Impersonate any person or entity'}
                </li>
                <li>
                  {language === 'ar'
                    ? 'التحايل على أي ميزات أمنية للمنصة'
                    : 'Circumvent any security features of the platform'}
                </li>
                <li>
                  {language === 'ar'
                    ? 'استخدام المنصة لأغراض احتيالية أو غير قانونية'
                    : 'Use the platform for fraudulent or illegal purposes'}
                </li>
                <li>
                  {language === 'ar'
                    ? 'جمع بيانات المستخدمين الآخرين دون إذن'
                    : 'Collect data from other users without permission'}
                </li>
                <li>
                  {language === 'ar'
                    ? 'التدخل في عمل المنصة أو إعاقته'
                    : 'Interfere with or disrupt the platform\'s operation'}
                </li>
              </ul>
            </div>

            {/* Intellectual Property */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {language === 'ar' ? '5. الملكية الفكرية' : '5. Intellectual Property'}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {language === 'ar'
                  ? 'جميع المحتويات والميزات والوظائف على منصة TF1 (بما في ذلك النصوص والرسومات والشعارات والأيقونات والصور والبرامج) مملوكة لـ TF1 أو مرخصيها ومحمية بموجب قوانين حقوق النشر والعلامات التجارية الدولية.'
                  : 'All content, features, and functionality on the TF1 platform (including text, graphics, logos, icons, images, and software) are owned by TF1 or its licensors and are protected by international copyright and trademark laws.'}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {language === 'ar'
                  ? 'أنت تحتفظ بملكية المحتوى الذي تنشره على المنصة، لكنك تمنح TF1 ترخيصاً عالمياً وغير حصري لاستخدام وعرض وتوزيع هذا المحتوى على المنصة.'
                  : 'You retain ownership of content you post on the platform, but you grant TF1 a worldwide, non-exclusive license to use, display, and distribute this content on the platform.'}
              </p>
            </div>

            {/* Payments */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {language === 'ar' ? '6. المدفوعات والاشتراكات' : '6. Payments and Subscriptions'}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {language === 'ar'
                  ? 'بعض ميزات TF1 تتطلب اشتراكاً مدفوعاً. من خلال الاشتراك في خطة مدفوعة:'
                  : 'Some TF1 features require a paid subscription. By subscribing to a paid plan:'}
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mr-4">
                <li>
                  {language === 'ar'
                    ? 'توافق على دفع جميع الرسوم المرتبطة بالخطة المختارة'
                    : 'You agree to pay all fees associated with your chosen plan'}
                </li>
                <li>
                  {language === 'ar'
                    ? 'تفوض TF1 بتحصيل الرسوم من طريقة الدفع الخاصة بك'
                    : 'You authorize TF1 to charge your payment method'}
                </li>
                <li>
                  {language === 'ar'
                    ? 'تفهم أن الاشتراكات تتجدد تلقائياً ما لم يتم إلغاؤها'
                    : 'You understand that subscriptions auto-renew unless cancelled'}
                </li>
                <li>
                  {language === 'ar'
                    ? 'يمكنك إلغاء اشتراكك في أي وقت من إعدادات الحساب'
                    : 'You can cancel your subscription at any time from account settings'}
                </li>
              </ul>
            </div>

            {/* Limitation of Liability */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {language === 'ar' ? '7. حدود المسؤولية' : '7. Limitation of Liability'}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {language === 'ar'
                  ? 'TF1 غير مسؤولة عن أي أضرار مباشرة أو غير مباشرة أو عرضية أو تبعية ناتجة عن استخدامك أو عدم قدرتك على استخدام المنصة. نحن لا نضمن أن المنصة ستكون خالية من الأخطاء أو متاحة دون انقطاع.'
                  : 'TF1 is not liable for any direct, indirect, incidental, or consequential damages arising from your use or inability to use the platform. We do not guarantee that the platform will be error-free or uninterrupted.'}
              </p>
            </div>

            {/* Termination */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {language === 'ar' ? '8. الإنهاء' : '8. Termination'}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {language === 'ar'
                  ? 'نحتفظ بالحق في تعليق أو إنهاء حسابك ووصولك إلى المنصة في أي وقت، دون إشعار مسبق، إذا كنت تنتهك هذه الشروط أو تشارك في سلوك احتيالي أو غير قانوني. يمكنك أيضاً إنهاء حسابك في أي وقت من خلال الاتصال بفريق الدعم لدينا.'
                  : 'We reserve the right to suspend or terminate your account and access to the platform at any time, without prior notice, if you violate these terms or engage in fraudulent or illegal conduct. You may also terminate your account at any time by contacting our support team.'}
              </p>
            </div>

            {/* Changes to Terms */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {language === 'ar' ? '9. التغييرات على الشروط' : '9. Changes to Terms'}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {language === 'ar'
                  ? 'نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سنقوم بإخطارك بأي تغييرات جوهرية عبر البريد الإلكتروني أو من خلال إشعار على المنصة. استمرار استخدامك للمنصة بعد هذه التغييرات يشكل قبولاً للشروط المحدثة.'
                  : 'We reserve the right to modify these terms at any time. We will notify you of any material changes via email or through a notice on the platform. Your continued use of the platform after such changes constitutes acceptance of the updated terms.'}
              </p>
            </div>

            {/* Governing Law */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {language === 'ar' ? '10. القانون الحاكم' : '10. Governing Law'}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {language === 'ar'
                  ? 'تخضع هذه الشروط وتفسر وفقاً لقوانين دولة الإمارات العربية المتحدة، دون النظر إلى تضارب أحكام القانون. أي نزاعات ناشئة عن هذه الشروط ستخضع للاختصاص الحصري لمحاكم دبي.'
                  : 'These terms shall be governed by and construed in accordance with the laws of the United Arab Emirates, without regard to its conflict of law provisions. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Dubai.'}
              </p>
            </div>

            {/* Contact */}
            <div className="bg-blue-50 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {language === 'ar' ? 'هل لديك أسئلة؟' : 'Have Questions?'}
                  </h3>
                  <p className="text-gray-700 mb-4">
                    {language === 'ar'
                      ? 'إذا كان لديك أي أسئلة حول شروط الخدمة هذه، يرجى الاتصال بنا:'
                      : 'If you have any questions about these Terms of Service, please contact us:'}
                  </p>
                  <p className="text-gray-700">
                    <strong>{language === 'ar' ? 'البريد الإلكتروني:' : 'Email:'}</strong>{' '}
                    support@tf1one.com
                  </p>
                  <Link
                    href="/contact"
                    className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    {language === 'ar' ? 'اتصل بنا' : 'Contact Us'} →
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
