/* eslint-disable no-unused-vars */
'use client'

import { useState, useRef } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import {
  User,
  Camera,
  MapPin,
  Trophy,
  X,
  ArrowLeft,
  Save,
  Edit,
  Phone,
  Mail,
  Briefcase,
  Target,
  Loader2,
} from 'lucide-react'
import { countries } from '@/lib/countries'
import { CountrySelector } from '@/components/ui/country-selector'

const ProfilePage = () => {
  const { language } = useLanguage()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Mock user - NO BACKEND
  const mockUser = {
    role: 'player',
    email: 'demo@sportx.com',
    profileCompletion: 65,
  }

  const [activeTab, setActiveTab] = useState('personal')
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const [profileData, setProfileData] = useState({
    // Personal Info (Individual users)
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: '+966', // Default to Saudi Arabia
    dateOfBirth: '',
    nationality: '',
    city: '',
    address: '',

    // Club Info (Club users)
    organizationName: '',
    establishedDate: '',
    businessRegistrationNumber: '',
    organizationType: 'club',
    description: '',
    website: '',
    location: '',
    facilitySize: '',
    capacity: '',
    licenseNumber: '',

    // Sports Info
    primarySport: '',
    position: '',
    experienceLevel: '',
    achievements: '',
    preferredLocations: '',
    availabilityType: '', // For the dropdown selection
    availability: {
      days: [] as string[],
      timeSlots: [] as string[],
      timezone: '',
    },

    // Professional Info
    bio: '',
    skills: '',
    certifications: '',
    languages: '',
    socialMedia: {
      instagram: '',
      twitter: '',
      linkedin: '',
      youtube: '',
      facebook: '',
    },

    // Preferences
    jobTypes: [] as string[],
    salaryRange: '',
    willingToRelocate: false,
    preferredCompanies: '',
  })

  // Mock profile data - NO BACKEND

  const tabs =
    mockUser?.role === 'club'
      ? [
          {
            id: 'organization',
            labelAr: 'معلومات المنظمة',
            labelEn: 'Organization Info',
            icon: User,
          },
          {
            id: 'facilities',
            labelAr: 'المرافق والخدمات',
            labelEn: 'Facilities & Services',
            icon: Trophy,
          },
          {
            id: 'professional',
            labelAr: 'المعلومات المهنية',
            labelEn: 'Professional Info',
            icon: Briefcase,
          },
        ]
      : [
          {
            id: 'personal',
            labelAr: 'المعلومات الشخصية',
            labelEn: 'Personal Info',
            icon: User,
          },
          {
            id: 'sports',
            labelAr: 'المعلومات الرياضية',
            labelEn: 'Sports Info',
            icon: Trophy,
          },
          {
            id: 'professional',
            labelAr: 'المعلومات المهنية',
            labelEn: 'Professional Info',
            icon: Briefcase,
          },
          {
            id: 'preferences',
            labelAr: 'التفضيلات',
            labelEn: 'Preferences',
            icon: Target,
          },
        ]

  const handleInputChange = (
    field: string,
    value: string | boolean | string[]
  ) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setProfileData((prev) => ({
        ...prev,
        [parent]: {
          ...((prev[parent as keyof typeof prev] as object) || {}),
          [child]: value,
        },
      }))
    } else {
      setProfileData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      // Mock upload - NO BACKEND
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveError(null)

    // Mock save - NO BACKEND
    setTimeout(() => {
      setIsEditing(false)
      setIsSaving(false)
      console.log('Profile saved (mock):', profileData)
    }, 1000)
  }

  const calculateCompletionPercentage = () => {
    const fields = [
      profileData.firstName,
      profileData.lastName,
      profileData.phone,
      profileData.dateOfBirth,
      profileData.city,
      profileData.primarySport,
      profileData.position,
      profileData.bio,
      profileData.skills,
    ]
    const filledFields = fields.filter(
      (field) => field && field.trim() !== ''
    ).length
    return Math.round((filledFields / fields.length) * 100)
  }

  const renderPersonalInfo = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Profile Picture */}
      <div className="flex items-center space-x-6 rtl:space-x-reverse">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
            {profileImage ? (
              <Image
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
                width={120}
                height={120}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-100">
                <User className="w-12 h-12 text-blue-600" />
              </div>
            )}
          </div>
          {isEditing && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {profileData.firstName} {profileData.lastName}
          </h3>
          <p className="text-gray-600">{mockUser?.role}</p>
          <p className="text-sm text-green-600 font-medium">
            {calculateCompletionPercentage()}%{' '}
            {language === 'ar' ? 'مكتمل' : 'Complete'}
          </p>
        </div>
      </div>

      {/* Personal Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'ar' ? 'الاسم الأول' : 'First Name'}
          </label>
          <Input
            value={profileData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            disabled={!isEditing}
            className="h-12"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'ar' ? 'اسم العائلة' : 'Last Name'}
          </label>
          <Input
            value={profileData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            disabled={!isEditing}
            className="h-12"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
          </label>
          <div className="relative">
            <Input
              value={profileData.email}
              disabled={true}
              className="h-12 bg-gray-50 pl-10"
            />
            <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
          </label>
          <div className="flex gap-2">
            {/* Country Code Selector */}
            <CountrySelector
              countries={countries}
              value={profileData.countryCode}
              onChange={(value) => handleInputChange('countryCode', value)}
              disabled={!isEditing}
              showDialCode={true}
              className="w-48"
              placeholder={
                language === 'ar' ? 'اختر رمز البلد' : 'Select country code'
              }
            />

            {/* Phone Number Input */}
            <div className="relative flex-1">
              <Input
                value={profileData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
                className="h-12 pl-10"
                placeholder={language === 'ar' ? 'رقم الهاتف' : 'Phone number'}
              />
              <Phone className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'ar' ? 'تاريخ الميلاد' : 'Date of Birth'}
          </label>
          <Input
            type="date"
            value={profileData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            disabled={!isEditing}
            className="h-12"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'ar' ? 'الجنسية' : 'Nationality'}
          </label>
          <CountrySelector
            countries={countries}
            value={profileData.nationality}
            onChange={(value) => handleInputChange('nationality', value)}
            disabled={!isEditing}
            showDialCode={false}
            placeholder={
              language === 'ar' ? 'اختر الجنسية' : 'Select Nationality'
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'ar' ? 'المدينة' : 'City'}
          </label>
          <div className="relative">
            <Input
              value={profileData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              disabled={!isEditing}
              className="h-12 pl-10"
            />
            <MapPin className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'ar' ? 'العنوان' : 'Address'}
          </label>
          <Input
            value={profileData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            disabled={!isEditing}
            className="h-12"
          />
        </div>
      </div>
    </motion.div>
  )

  const renderSportsInfo = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'ar' ? 'الرياضة الأساسية' : 'Primary Sport'}
          </label>
          <select
            value={profileData.primarySport}
            onChange={(e) => handleInputChange('primarySport', e.target.value)}
            disabled={!isEditing}
            className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">
              {language === 'ar' ? 'اختر الرياضة' : 'Select Sport'}
            </option>
            <option value="football">
              {language === 'ar' ? 'كرة القدم' : 'Football'}
            </option>
            <option value="basketball">
              {language === 'ar' ? 'كرة السلة' : 'Basketball'}
            </option>
            <option value="tennis">
              {language === 'ar' ? 'التنس' : 'Tennis'}
            </option>
            <option value="swimming">
              {language === 'ar' ? 'السباحة' : 'Swimming'}
            </option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'ar' ? 'المركز' : 'Position'}
          </label>
          <Input
            value={profileData.position}
            onChange={(e) => handleInputChange('position', e.target.value)}
            disabled={!isEditing}
            className="h-12"
            placeholder={
              language === 'ar'
                ? 'مثال: مهاجم، مدافع'
                : 'e.g., Forward, Defender'
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'ar' ? 'مستوى الخبرة' : 'Experience Level'}
          </label>
          <select
            value={profileData.experienceLevel}
            onChange={(e) =>
              handleInputChange('experienceLevel', e.target.value)
            }
            disabled={!isEditing}
            className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">
              {language === 'ar' ? 'اختر المستوى' : 'Select Level'}
            </option>
            <option value="beginner">
              {language === 'ar' ? 'مبتدئ' : 'Beginner'}
            </option>
            <option value="intermediate">
              {language === 'ar' ? 'متوسط' : 'Intermediate'}
            </option>
            <option value="advanced">
              {language === 'ar' ? 'متقدم' : 'Advanced'}
            </option>
            <option value="professional">
              {language === 'ar' ? 'محترف' : 'Professional'}
            </option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'ar' ? 'التوفر' : 'Availability'}
          </label>
          <select
            value={profileData.availabilityType}
            onChange={(e) =>
              handleInputChange('availabilityType', e.target.value)
            }
            disabled={!isEditing}
            className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">
              {language === 'ar' ? 'اختر التوفر' : 'Select Availability'}
            </option>
            <option value="full-time">
              {language === 'ar' ? 'دوام كامل' : 'Full-time'}
            </option>
            <option value="part-time">
              {language === 'ar' ? 'دوام جزئي' : 'Part-time'}
            </option>
            <option value="weekends">
              {language === 'ar' ? 'عطل نهاية الأسبوع' : 'Weekends'}
            </option>
            <option value="flexible">
              {language === 'ar' ? 'مرن' : 'Flexible'}
            </option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar' ? 'الإنجازات والجوائز' : 'Achievements & Awards'}
        </label>
        <textarea
          value={profileData.achievements}
          onChange={(e) => handleInputChange('achievements', e.target.value)}
          disabled={!isEditing}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder={
            language === 'ar'
              ? 'اذكر أهم إنجازاتك وجوائزك الرياضية...'
              : 'List your key sports achievements and awards...'
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar'
            ? 'المواقع المفضلة للعمل'
            : 'Preferred Work Locations'}
        </label>
        <Input
          value={profileData.preferredLocations}
          onChange={(e) =>
            handleInputChange('preferredLocations', e.target.value)
          }
          disabled={!isEditing}
          className="h-12"
          placeholder={
            language === 'ar'
              ? 'الرياض، جدة، الدمام...'
              : 'Riyadh, Jeddah, Dammam...'
          }
        />
      </div>
    </motion.div>
  )

  const renderProfessionalInfo = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar' ? 'نبذة عنك' : 'Bio'}
        </label>
        <textarea
          value={profileData.bio}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          disabled={!isEditing}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder={
            language === 'ar'
              ? 'اكتب نبذة مختصرة عن نفسك ومسيرتك الرياضية...'
              : 'Write a brief description about yourself and your sports career...'
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'ar' ? 'المهارات' : 'Skills'}
          </label>
          <textarea
            value={profileData.skills}
            onChange={(e) => handleInputChange('skills', e.target.value)}
            disabled={!isEditing}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder={
              language === 'ar'
                ? 'مثال: قيادة الفريق، اللعب تحت الضغط...'
                : 'e.g., Team leadership, Performance under pressure...'
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'ar' ? 'الشهادات والتراخيص' : 'Certifications'}
          </label>
          <textarea
            value={profileData.certifications}
            onChange={(e) =>
              handleInputChange('certifications', e.target.value)
            }
            disabled={!isEditing}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder={
              language === 'ar'
                ? 'مثال: رخصة تدريب، شهادة إسعافات أولية...'
                : 'e.g., Coaching license, First aid certificate...'
            }
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar' ? 'اللغات' : 'Languages'}
        </label>
        <Input
          value={profileData.languages}
          onChange={(e) => handleInputChange('languages', e.target.value)}
          disabled={!isEditing}
          className="h-12"
          placeholder={
            language === 'ar'
              ? 'العربية (أصلي), الإنجليزية (متقدم)...'
              : 'Arabic (Native), English (Advanced)...'
          }
        />
      </div>

      {/* Social Media Links */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          {language === 'ar' ? 'وسائل التواصل الاجتماعي' : 'Social Media'}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram
            </label>
            <Input
              value={profileData.socialMedia.instagram}
              onChange={(e) =>
                handleInputChange('socialMedia.instagram', e.target.value)
              }
              disabled={!isEditing}
              className="h-12"
              placeholder="@username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Twitter
            </label>
            <Input
              value={profileData.socialMedia.twitter}
              onChange={(e) =>
                handleInputChange('socialMedia.twitter', e.target.value)
              }
              disabled={!isEditing}
              className="h-12"
              placeholder="@username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn
            </label>
            <Input
              value={profileData.socialMedia.linkedin}
              onChange={(e) =>
                handleInputChange('socialMedia.linkedin', e.target.value)
              }
              disabled={!isEditing}
              className="h-12"
              placeholder="linkedin.com/in/username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              YouTube
            </label>
            <Input
              value={profileData.socialMedia.youtube}
              onChange={(e) =>
                handleInputChange('socialMedia.youtube', e.target.value)
              }
              disabled={!isEditing}
              className="h-12"
              placeholder="youtube.com/c/channel"
            />
          </div>
        </div>
      </div>
    </motion.div>
  )

  const renderPreferences = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'ar'
              ? 'نطاق الراتب المتوقع'
              : 'Expected Salary Range'}
          </label>
          <select
            value={profileData.salaryRange}
            onChange={(e) => handleInputChange('salaryRange', e.target.value)}
            disabled={!isEditing}
            className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">
              {language === 'ar' ? 'اختر النطاق' : 'Select Range'}
            </option>
            <option value="1000-3000">
              1,000 - 3,000 {language === 'ar' ? 'ريال' : 'SAR'}
            </option>
            <option value="3000-5000">
              3,000 - 5,000 {language === 'ar' ? 'ريال' : 'SAR'}
            </option>
            <option value="5000-10000">
              5,000 - 10,000 {language === 'ar' ? 'ريال' : 'SAR'}
            </option>
            <option value="10000+">
              10,000+ {language === 'ar' ? 'ريال' : 'SAR'}
            </option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'ar'
              ? 'أنواع الوظائف المفضلة'
              : 'Preferred Job Types'}
          </label>
          <select
            value={profileData.jobTypes[0] || ''}
            onChange={(e) => handleInputChange('jobTypes', [e.target.value])}
            disabled={!isEditing}
            className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">
              {language === 'ar' ? 'اختر النوع' : 'Select Type'}
            </option>
            <option value="full-time">
              {language === 'ar' ? 'دوام كامل' : 'Full-time'}
            </option>
            <option value="part-time">
              {language === 'ar' ? 'دوام جزئي' : 'Part-time'}
            </option>
            <option value="contract">
              {language === 'ar' ? 'عقد مؤقت' : 'Contract'}
            </option>
            <option value="freelance">
              {language === 'ar' ? 'عمل حر' : 'Freelance'}
            </option>
          </select>
        </div>
      </div>

      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        <input
          type="checkbox"
          id="relocate"
          checked={profileData.willingToRelocate}
          onChange={(e) =>
            handleInputChange('willingToRelocate', e.target.checked)
          }
          disabled={!isEditing}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="relocate" className="text-sm text-gray-700">
          {language === 'ar'
            ? 'مستعد للانتقال لمدينة أخرى'
            : 'Willing to relocate to another city'}
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar'
            ? 'الشركات أو النوادي المفضلة'
            : 'Preferred Companies/Clubs'}
        </label>
        <textarea
          value={profileData.preferredCompanies}
          onChange={(e) =>
            handleInputChange('preferredCompanies', e.target.value)
          }
          disabled={!isEditing}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder={
            language === 'ar'
              ? 'مثال: نادي الهلال، نادي النصر، أكاديمية محمد صلاح...'
              : 'e.g., Al-Hilal Club, Al-Nassr Club, Mohamed Salah Academy...'
          }
        />
      </div>
    </motion.div>
  )

  const renderOrganizationInfo = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Organization Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar' ? 'اسم المنظمة' : 'Organization Name'}
        </label>
        <Input
          type="text"
          value={profileData.organizationName}
          onChange={(e) =>
            setProfileData({ ...profileData, organizationName: e.target.value })
          }
          disabled={!isEditing}
          className="h-12"
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Established Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar' ? 'تاريخ التأسيس' : 'Established Date'}
        </label>
        <Input
          type="date"
          value={profileData.establishedDate}
          onChange={(e) =>
            setProfileData({ ...profileData, establishedDate: e.target.value })
          }
          disabled={!isEditing}
          className="h-12"
        />
      </div>

      {/* Business Registration Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar'
            ? 'رقم التسجيل التجاري'
            : 'Business Registration Number'}
        </label>
        <Input
          type="text"
          value={profileData.businessRegistrationNumber}
          onChange={(e) =>
            setProfileData({
              ...profileData,
              businessRegistrationNumber: e.target.value,
            })
          }
          disabled={!isEditing}
          className="h-12"
          dir="ltr"
        />
      </div>

      {/* Organization Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar' ? 'نوع المنظمة' : 'Organization Type'}
        </label>
        <select
          value={profileData.organizationType}
          onChange={(e) =>
            setProfileData({ ...profileData, organizationType: e.target.value })
          }
          disabled={!isEditing}
          className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="club">
            {language === 'ar' ? 'نادي رياضي' : 'Sports Club'}
          </option>
          <option value="academy">
            {language === 'ar' ? 'أكاديمية' : 'Academy'}
          </option>
          <option value="federation">
            {language === 'ar' ? 'اتحاد' : 'Federation'}
          </option>
          <option value="sports-center">
            {language === 'ar' ? 'مركز رياضي' : 'Sports Center'}
          </option>
        </select>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar' ? 'الموقع' : 'Location'}
        </label>
        <Input
          type="text"
          value={profileData.location}
          onChange={(e) =>
            setProfileData({ ...profileData, location: e.target.value })
          }
          disabled={!isEditing}
          className="h-12"
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
        </label>
        <Input
          type="tel"
          value={profileData.phone}
          onChange={(e) =>
            setProfileData({ ...profileData, phone: e.target.value })
          }
          disabled={!isEditing}
          className="h-12"
          dir="ltr"
        />
      </div>

      {/* Website */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar' ? 'الموقع الإلكتروني' : 'Website'}
        </label>
        <Input
          type="url"
          value={profileData.website}
          onChange={(e) =>
            setProfileData({ ...profileData, website: e.target.value })
          }
          disabled={!isEditing}
          className="h-12"
          dir="ltr"
          placeholder="https://example.com"
        />
      </div>
    </motion.div>
  )

  const renderFacilitiesInfo = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Facility Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar'
            ? 'حجم المرافق (متر مربع)'
            : 'Facility Size (sq meters)'}
        </label>
        <Input
          type="number"
          value={profileData.facilitySize}
          onChange={(e) =>
            setProfileData({ ...profileData, facilitySize: e.target.value })
          }
          disabled={!isEditing}
          className="h-12"
          min="0"
        />
      </div>

      {/* Capacity */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar'
            ? 'السعة (عدد الأعضاء)'
            : 'Capacity (number of members)'}
        </label>
        <Input
          type="number"
          value={profileData.capacity}
          onChange={(e) =>
            setProfileData({ ...profileData, capacity: e.target.value })
          }
          disabled={!isEditing}
          className="h-12"
          min="0"
        />
      </div>

      {/* License Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar' ? 'رقم الترخيص' : 'License Number'}
        </label>
        <Input
          type="text"
          value={profileData.licenseNumber}
          onChange={(e) =>
            setProfileData({ ...profileData, licenseNumber: e.target.value })
          }
          disabled={!isEditing}
          className="h-12"
          dir="ltr"
        />
      </div>

      {/* Primary Sport */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar' ? 'الرياضة الأساسية' : 'Primary Sport'}
        </label>
        <select
          value={profileData.primarySport}
          onChange={(e) =>
            setProfileData({ ...profileData, primarySport: e.target.value })
          }
          disabled={!isEditing}
          className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">
            {language === 'ar' ? 'اختر الرياضة' : 'Select Sport'}
          </option>
          <option value="football">
            {language === 'ar' ? 'كرة القدم' : 'Football'}
          </option>
          <option value="basketball">
            {language === 'ar' ? 'كرة السلة' : 'Basketball'}
          </option>
          <option value="tennis">
            {language === 'ar' ? 'التنس' : 'Tennis'}
          </option>
          <option value="swimming">
            {language === 'ar' ? 'السباحة' : 'Swimming'}
          </option>
          <option value="athletics">
            {language === 'ar' ? 'ألعاب القوى' : 'Athletics'}
          </option>
          <option value="volleyball">
            {language === 'ar' ? 'الكرة الطائرة' : 'Volleyball'}
          </option>
          <option value="handball">
            {language === 'ar' ? 'كرة اليد' : 'Handball'}
          </option>
          <option value="other">{language === 'ar' ? 'أخرى' : 'Other'}</option>
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar' ? 'وصف المنظمة' : 'Organization Description'}
        </label>
        <textarea
          value={profileData.description}
          onChange={(e) =>
            setProfileData({ ...profileData, description: e.target.value })
          }
          disabled={!isEditing}
          className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          dir={language === 'ar' ? 'rtl' : 'ltr'}
          placeholder={
            language === 'ar'
              ? 'اكتب وصفاً عن النادي أو المنظمة...'
              : 'Write a description about your club or organization...'
          }
        />
      </div>
    </motion.div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return renderPersonalInfo()
      case 'organization':
        return renderOrganizationInfo()
      case 'facilities':
        return renderFacilitiesInfo()
      case 'sports':
        return renderSportsInfo()
      case 'professional':
        return renderProfessionalInfo()
      case 'preferences':
        return renderPreferences()
      default:
        return mockUser?.role === 'club'
          ? renderOrganizationInfo()
          : renderPersonalInfo()
    }
  }

  return (
    <div
      className={`min-h-screen bg-gray-50 ${language === 'ar' ? 'font-arabic' : 'font-english'}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {language === 'ar' ? 'رجوع' : 'Back'}
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {language === 'ar' ? 'الملف الشخصي' : 'Profile'}
                </h1>
                <p className="text-gray-600">
                  {language === 'ar'
                    ? 'أكمل ملفك الشخصي لزيادة فرصك'
                    : 'Complete your profile to increase your opportunities'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  {language === 'ar' ? 'تعديل' : 'Edit'}
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {language === 'ar' ? 'حفظ' : 'Save'}
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {language === 'ar' ? 'اكتمال الملف الشخصي' : 'Profile Completion'}
            </span>
            <span className="text-sm font-bold text-blue-600">
              {calculateCompletionPercentage()}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${calculateCompletionPercentage()}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Tabs Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {language === 'ar' ? 'أقسام الملف الشخصي' : 'Profile Sections'}
              </h3>
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {language === 'ar' ? tab.labelAr : tab.labelEn}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border p-8">
              {/* Error Display */}
              {saveError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-600">
                    <X className="w-4 h-4" />
                    <span className="text-sm">{saveError}</span>
                  </div>
                </div>
              )}

              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
