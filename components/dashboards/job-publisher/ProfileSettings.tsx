'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import api from '@/services/api'
import { toast } from 'sonner'
import { Building, Upload, Save, Loader2 } from 'lucide-react'

export default function ProfileSettings() {
  const { language } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [formData, setFormData] = useState({
    companyName: '',
    companyNameAr: '',
    industryType: '',
    companySize: '',
    websiteUrl: '',
    businessRegistrationNumber: '',
    representativeName: '',
    representativeTitle: '',
    phone: '',
    email: '',
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await api.get('/job-publisher/profile')
      if (response.data.success) {
        const data = response.data.data
        setProfile(data)
        setFormData({
          companyName: data.companyName || '',
          companyNameAr: data.companyNameAr || '',
          industryType: data.industryType || '',
          companySize: data.companySize || '',
          websiteUrl: data.websiteUrl || '',
          businessRegistrationNumber: data.businessRegistrationNumber || '',
          representativeName: data.representativeName || '',
          representativeTitle: data.representativeTitle || '',
          phone: data.phone || '',
          email: data.email || '',
        })
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        // No profile yet
      } else {
        toast.error(language === 'ar' ? 'فشل تحميل الملف الشخصي' : 'Failed to load profile')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = profile
        ? await api.put('/job-publisher/profile', formData)
        : await api.post('/job-publisher/profile', formData)

      if (response.data.success) {
        toast.success(language === 'ar' ? 'تم حفظ الملف الشخصي' : 'Profile saved successfully')
        fetchProfile()
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || (language === 'ar' ? 'فشل حفظ الملف الشخصي' : 'Failed to save profile'))
    } finally {
      setLoading(false)
    }
  }

  const isRtl = language === 'ar'

  const [addressData, setAddressData] = useState({
    buildingNumber: '',
    additionalNumber: '',
    zipCode: '',
    city: ''
  })
  const [verifyingAddress, setVerifyingAddress] = useState(false)
  const [addressVerified, setAddressVerified] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return
    
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('file', file)
    
    setUploadingLogo(true)
    try {
      // Use the generic upload endpoint or specific one if available
      const response = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      if (response.data.success) {
        setFormData(prev => ({ ...prev, logo: response.data.data.url }))
        toast.success(language === 'ar' ? 'تم رفع الشعار بنجاح' : 'Logo uploaded successfully')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(language === 'ar' ? 'فشل رفع الشعار' : 'Failed to upload logo')
    } finally {
      setUploadingLogo(false)
    }
  }

  const verifyNationalAddress = async () => {
    setVerifyingAddress(true)
    try {
      const response = await api.post('/job-publisher/profile/verify-national-address', addressData)
      if (response.data.success) {
        setAddressVerified(true)
        toast.success(language === 'ar' ? 'تم التحقق من العنوان الوطني بنجاح' : 'National Address verified successfully')
      }
    } catch (error: any) {
      setAddressVerified(false)
      toast.error(error.response?.data?.messageAr || (language === 'ar' ? 'فشل التحقق من العنوان الوطني' : 'National Address verification failed'))
    } finally {
      setVerifyingAddress(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-3 mb-6">
        <Building className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-900">
          {language === 'ar' ? 'إعدادات الملف الشخصي' : 'Profile Settings'}
        </h2>
      </div>

      <div className="mb-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5 text-purple-600" />
          {language === 'ar' ? 'شعار الشركة' : 'Company Logo'}
        </h3>
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 bg-white rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
            {/* Logo display removed - use companyName instead */}
            <Building className="w-8 h-8 text-gray-400" />
            {uploadingLogo && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <label className="block">
              <span className="sr-only">Choose logo</span>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={uploadingLogo}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-purple-50 file:text-purple-700
                  hover:file:bg-purple-100
                " 
              />
            </label>
            <p className="mt-1 text-xs text-gray-500">
              PNG, JPG, GIF up to 2MB
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Building className="w-5 h-5 text-blue-600" />
          {language === 'ar' ? 'التحقق من العنوان الوطني' : 'National Address Verification'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <Input
            value={addressData.buildingNumber}
            onChange={(e) => setAddressData({ ...addressData, buildingNumber: e.target.value })}
            placeholder={language === 'ar' ? 'رقم المبنى' : 'Building Number'}
          />
          <Input
            value={addressData.additionalNumber}
            onChange={(e) => setAddressData({ ...addressData, additionalNumber: e.target.value })}
            placeholder={language === 'ar' ? 'الرقم الإضافي' : 'Additional Number'}
          />
          <Input
            value={addressData.zipCode}
            onChange={(e) => setAddressData({ ...addressData, zipCode: e.target.value })}
            placeholder={language === 'ar' ? 'الرمز البريدي' : 'Zip Code'}
          />
           <Input
            value={addressData.city}
            onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
            placeholder={language === 'ar' ? 'المدينة' : 'City'}
          />
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={verifyNationalAddress} 
            disabled={verifyingAddress || addressVerified}
            className={`w-full md:w-auto ${addressVerified ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {verifyingAddress ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : addressVerified ? (
              <Save className="w-4 h-4 mr-2" />
            ) : (
              <Upload className="w-4 h-4 mr-2" />
            )}
            {verifyingAddress 
              ? (language === 'ar' ? 'جاري التحقق...' : 'Verifying...') 
              : addressVerified 
                ? (language === 'ar' ? 'تم التحقق' : 'Verified') 
                : (language === 'ar' ? 'تحقق من العنوان' : 'Verify Address')}
          </Button>
          {addressVerified && (
             <span className="text-green-600 text-sm font-medium flex items-center gap-1">
               <Save className="w-4 h-4" />
               {language === 'ar' ? 'تم توثيق العنوان الوطني' : 'National Address Verified'}
             </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'اسم الشركة' : 'Company Name'}
            </label>
            <Input
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              placeholder={language === 'ar' ? 'اسم الشركة' : 'Company Name'}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'اسم الشركة بالعربية' : 'Company Name (Arabic)'}
            </label>
            <Input
              value={formData.companyNameAr}
              onChange={(e) => setFormData({ ...formData, companyNameAr: e.target.value })}
              placeholder={language === 'ar' ? 'اسم الشركة بالعربية' : 'Company Name in Arabic'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'نوع الصناعة' : 'Industry Type'}
            </label>
            <Input
              value={formData.industryType}
              onChange={(e) => setFormData({ ...formData, industryType: e.target.value })}
              placeholder={language === 'ar' ? 'نوع الصناعة' : 'Industry Type'}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'حجم الشركة' : 'Company Size'}
            </label>
            <select
              value={formData.companySize}
              onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="">{language === 'ar' ? 'اختر الحجم' : 'Select Size'}</option>
              <option value="1-10">1-10</option>
              <option value="11-50">11-50</option>
              <option value="51-200">51-200</option>
              <option value="201-500">201-500</option>
              <option value="500+">{language === 'ar' ? '500+' : '500+'}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'الموقع الإلكتروني' : 'Website URL'}
            </label>
            <Input
              type="url"
              value={formData.websiteUrl}
              onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'رقم السجل التجاري' : 'Business Registration Number'}
            </label>
            <Input
              value={formData.businessRegistrationNumber}
              onChange={(e) => setFormData({ ...formData, businessRegistrationNumber: e.target.value })}
              placeholder={language === 'ar' ? 'رقم السجل التجاري' : 'Registration Number'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'اسم المسؤول' : 'Representative Name'}
            </label>
            <Input
              value={formData.representativeName}
              onChange={(e) => setFormData({ ...formData, representativeName: e.target.value })}
              placeholder={language === 'ar' ? 'اسم المسؤول' : 'Representative Name'}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'المنصب' : 'Title'}
            </label>
            <Input
              value={formData.representativeTitle}
              onChange={(e) => setFormData({ ...formData, representativeTitle: e.target.value })}
              placeholder={language === 'ar' ? 'المنصب' : 'Title'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder={language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder={language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
