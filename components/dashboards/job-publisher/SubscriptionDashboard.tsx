'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { Button } from '@/components/ui/button'
import { TrendingUp, CheckCircle, Zap, Users, Calendar, Activity } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/services/api'

interface Subscription {
  tier: 'free' | 'basic' | 'pro' | 'enterprise'
  status: string
  daysRemaining: number
  features: any
}

interface Usage {
  interviews: { used: number; limit: number; remaining: number; percentage: number }
  applications: { used: number; limit: number; remaining: number; percentage: number }
  smsCredits: { used: number; limit: number; remaining: number; percentage: number }
}

export default function SubscriptionDashboard() {
  const { language } = useLanguage()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [usage, setUsage] = useState<Usage | null>(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)

  useEffect(() => {
    fetchSubscriptionData()
  }, [])

  const fetchSubscriptionData = async () => {
    try {
      const [subRes, usageRes] = await Promise.all([
        api.get('/publisher/subscription'),
        api.get('/publisher/subscription/usage'),
      ])

      if (subRes.data.success) {
        setSubscription(subRes.data.data.subscription)
      }

      if (usageRes.data.success) {
        setUsage(usageRes.data.data.usage)
      }
    } catch (error) {
      console.error('Error fetching subscription:', error)
      toast.error(language === 'ar' ? 'فشل تحميل بيانات الباقة' : 'Failed to load subscription data')
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async (tier: string) => {
    if (upgrading) return

    setUpgrading(true)
    try {
      const response = await api.post('/publisher/subscription/upgrade', {
        tier,
        billingCycle: 'monthly',
      })

      if (response.data.success) {
        toast.success(language === 'ar' ? 'تم الترقية بنجاح!' : 'Upgraded successfully!')
        fetchSubscriptionData()
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || (language === 'ar' ? 'فشلت الترقية' : 'Upgrade failed'))
    } finally {
      setUpgrading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const tierInfo = {
    free: { name: 'Free', nameAr: 'مجاني', color: 'gray', price: 0 },
    basic: { name: 'Basic', nameAr: 'أساسي', color: 'blue', price: 299 },
    pro: { name: 'Pro', nameAr: 'احترافي', color: 'blue', price: 999 },
    enterprise: { name: 'Enterprise', nameAr: 'مؤسسات', color: 'blue', price: 'custom' },
  }

  const current = subscription ? tierInfo[subscription.tier] : tierInfo.free

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">{language === 'ar' ? 'الباقة الحالية' : 'Current Plan'}</p>
            <h2 className="text-2xl font-bold text-gray-900">
              {language === 'ar' ? current.nameAr : current.name}
            </h2>
          </div>
          {subscription && subscription.tier !== 'enterprise' && (
            <Button onClick={() => handleUpgrade('pro')} disabled={upgrading} className="bg-blue-600 hover:bg-blue-700">
              <TrendingUp className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'ترقية' : 'Upgrade'}
            </Button>
          )}
        </div>

        {/* Usage Meters */}
        {usage && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Interviews */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">{language === 'ar' ? 'المقابلات' : 'Interviews'}</span>
                <Calendar className="w-4 h-4 text-gray-400" />
              </div>
              <div className="mb-2">
                <p className="text-2xl font-bold text-gray-900">
                  {usage.interviews.used}
                  <span className="text-sm text-gray-500 font-normal">
                    {' '}/ {usage.interviews.limit === -1 ? '∞' : usage.interviews.limit}
                  </span>
                </p>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${usage.interviews.percentage > 80 ? 'bg-red-500' : 'bg-blue-500'}`}
                  style={{ width: `${Math.min(usage.interviews.percentage, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {usage.interviews.remaining === -1 ? (language === 'ar' ? 'غير محدود' : 'Unlimited') : 
                  `${usage.interviews.remaining} ${language === 'ar' ? 'متبقية' : 'remaining'}`}
              </p>
            </div>

            {/* Applications */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">{language === 'ar' ? 'الطلبات' : 'Applications'}</span>
                <Users className="w-4 h-4 text-gray-400" />
              </div>
              <div className="mb-2">
                <p className="text-2xl font-bold text-gray-900">
                  {usage.applications.used}
                  <span className="text-sm text-gray-500 font-normal">
                    {' '}/ {usage.applications.limit === -1 ? '∞' : usage.applications.limit}
                  </span>
                </p>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${usage.applications.percentage > 80 ? 'bg-red-500' : 'bg-blue-500'}`}
                  style={{ width: `${Math.min(usage.applications.percentage, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {usage.applications.remaining === -1 ? (language === 'ar' ? 'غير محدود' : 'Unlimited') :
                  `${usage.applications.remaining} ${language === 'ar' ? 'متبقية' : 'remaining'}`}
              </p>
            </div>

            {/* SMS Credits */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">{language === 'ar' ? 'رسائل SMS' : 'SMS Credits'}</span>
                <Activity className="w-4 h-4 text-gray-400" />
              </div>
              <div className="mb-2">
                <p className="text-2xl font-bold text-gray-900">
                  {usage.smsCredits.used}
                  <span className="text-sm text-gray-500 font-normal">
                    {' '}/ {usage.smsCredits.limit}
                  </span>
                </p>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${usage.smsCredits.percentage > 80 ? 'bg-red-500' : 'bg-blue-500'}`}
                  style={{ width: `${Math.min(usage.smsCredits.percentage, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {usage.smsCredits.remaining} {language === 'ar' ? 'متبقية' : 'remaining'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Available Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Basic Plan */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Basic</h3>
          <p className="text-3xl font-bold text-gray-900 mb-1">
            299 <span className="text-sm font-normal text-gray-500">{language === 'ar' ? 'ريال' : 'SAR'}</span>
          </p>
          <p className="text-sm text-gray-500 mb-6">{language === 'ar' ? 'شهرياً' : 'per month'}</p>
          
          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">20 {language === 'ar' ? 'مقابلة/شهر' : 'interviews/month'}</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">{language === 'ar' ? 'أتمتة المقابلات' : 'Interview automation'}</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">5 {language === 'ar' ? 'قواعد أتمتة' : 'automation rules'}</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">{language === 'ar' ? 'إشعارات بريد إلكتروني' : 'Email notifications'}</span>
            </li>
          </ul>

          <Button
            onClick={() => handleUpgrade('basic')}
            disabled={upgrading || subscription?.tier === 'basic'}
            variant={subscription?.tier === 'basic' ? 'outline' : 'default'}
            className={subscription?.tier === 'basic' ? '' : 'bg-blue-600 hover:bg-blue-700 w-full'}
          >
            {subscription?.tier === 'basic'
              ? language === 'ar' ? 'الباقة الحالية' : 'Current Plan'
              : language === 'ar' ? 'اختيار' : 'Select'}
          </Button>
        </div>

        {/* Pro Plan */}
        <div className="bg-white rounded-lg border-2 border-blue-600 p-6 relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              {language === 'ar' ? 'الأكثر شعبية' : 'Most Popular'}
            </span>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pro</h3>
          <p className="text-3xl font-bold text-gray-900 mb-1">
            999 <span className="text-sm font-normal text-gray-500">{language === 'ar' ? 'ريال' : 'SAR'}</span>
          </p>
          <p className="text-sm text-gray-500 mb-6">{language === 'ar' ? 'شهرياً' : 'per month'}</p>
          
          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">100 {language === 'ar' ? 'مقابلة/شهر' : 'interviews/month'}</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">50 {language === 'ar' ? 'قاعدة أتمتة' : 'automation rules'}</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">{language === 'ar' ? 'تحليلات متقدمة' : 'Advanced analytics'}</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">{language === 'ar' ? 'إشعارات SMS' : 'SMS notifications'}</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">{language === 'ar' ? 'وصول API' : 'API access'}</span>
            </li>
          </ul>

          <Button
            onClick={() => handleUpgrade('pro')}
            disabled={upgrading || subscription?.tier === 'pro'}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {subscription?.tier === 'pro'
              ? language === 'ar' ? 'الباقة الحالية' : 'Current Plan'
              : language === 'ar' ? 'ترقية' : 'Upgrade'}
          </Button>
        </div>

        {/* Enterprise Plan */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Enterprise</h3>
          <p className="text-3xl font-bold text-gray-900 mb-1">{language === 'ar' ? 'مخصص' : 'Custom'}</p>
          <p className="text-sm text-gray-500 mb-6">{language === 'ar' ? 'اتصل بنا' : 'Contact us'}</p>
          
          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">{language === 'ar' ? 'مقابلات غير محدودة' : 'Unlimited interviews'}</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">{language === 'ar' ? 'أتمتة غير محدودة' : 'Unlimited automation'}</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">{language === 'ar' ? 'دعم مخصص' : 'Dedicated support'}</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">{language === 'ar' ? 'تكاملات مخصصة' : 'Custom integrations'}</span>
            </li>
          </ul>

          <Button variant="outline" className="w-full">
            {language === 'ar' ? 'اتصل بنا' : 'Contact Sales'}
          </Button>
        </div>
      </div>
    </div>
  )
}
