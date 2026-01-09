'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/language-context'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import api from '@/services/api'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Globe,
  Trophy,
  Users,
  Clock,
  Loader2,
  Briefcase,
  DollarSign,
  CheckCircle,
  FileText
} from 'lucide-react'
import Link from 'next/link'

export default function CreateJobPage() {
  const { language } = useLanguage()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    titleAr: '',
    description: '',
    descriptionAr: '',
    sport: '',
    jobType: '',
    location: '',
    city: '',
    languages: '',
    competitionLevel: '',
    ageGroup: '',
    startDate: '',
    deadline: '',
    salaryMin: '',
    salaryMax: '',
    salaryCurrency: 'SAR'
  })

  const sportOptions = [
    { value: 'football', labelAr: 'كرة القدم', labelEn: 'Football' },
    { value: 'basketball', labelAr: 'كرة السلة', labelEn: 'Basketball' },
    { value: 'tennis', labelAr: 'التنس', labelEn: 'Tennis' },
    { value: 'swimming', labelAr: 'السباحة', labelEn: 'Swimming' },
    { value: 'running', labelAr: 'الجري', labelEn: 'Running' },
    { value: 'volleyball', labelAr: 'الكرة الطائرة', labelEn: 'Volleyball' },
    { value: 'handball', labelAr: 'كرة اليد', labelEn: 'Handball' },
    { value: 'athletics', labelAr: 'ألعاب القوى', labelEn: 'Athletics' },
    { value: 'other', labelAr: 'أخرى', labelEn: 'Other' },
  ]

  const jobTypeOptions = [
    { value: 'full_time', labelAr: 'دوام كامل', labelEn: 'Full Time' },
    { value: 'part_time', labelAr: 'دوام جزئي', labelEn: 'Part Time' },
    { value: 'contract', labelAr: 'عقد مؤقت', labelEn: 'Contract' },
    { value: 'internship', labelAr: 'تدريب', labelEn: 'Internship' },
    { value: 'freelance', labelAr: 'عمل حر', labelEn: 'Freelance' },
  ]

  const locationOptions = [
    { value: 'riyadh', labelAr: 'الرياض', labelEn: 'Riyadh' },
    { value: 'jeddah', labelAr: 'جدة', labelEn: 'Jeddah' },
    { value: 'dammam', labelAr: 'الدمام', labelEn: 'Dammam' },
    { value: 'mecca', labelAr: 'مكة', labelEn: 'Mecca' },
    { value: 'medina', labelAr: 'المدينة', labelEn: 'Medina' },
    { value: 'khobar', labelAr: 'الخبر', labelEn: 'Khobar' },
    { value: 'abha', labelAr: 'أبها', labelEn: 'Abha' },
    { value: 'remote', labelAr: 'عن بعد', labelEn: 'Remote' },
  ]

  const languageOptions = [
    { value: 'arabic', labelAr: 'العربية', labelEn: 'Arabic' },
    { value: 'english', labelAr: 'الإنجليزية', labelEn: 'English' },
    { value: 'both', labelAr: 'العربية والإنجليزية', labelEn: 'Arabic & English' },
  ]

  const competitionLevelOptions = [
    { value: 'beginner', labelAr: 'مبتدئ', labelEn: 'Beginner' },
    { value: 'intermediate', labelAr: 'متوسط', labelEn: 'Intermediate' },
    { value: 'advanced', labelAr: 'متقدم', labelEn: 'Advanced' },
    { value: 'professional', labelAr: 'احترافي', labelEn: 'Professional' },
  ]

  const ageGroupOptions = [
    { value: 'youth', labelAr: 'الشباب (16-25)', labelEn: 'Youth (16-25)' },
    { value: 'adult', labelAr: 'البالغين (26-35)', labelEn: 'Adult (26-35)' },
    { value: 'senior', labelAr: 'كبار السن (35+)', labelEn: 'Senior (35+)' },
    { value: 'all-ages', labelAr: 'جميع الأعمار', labelEn: 'All Ages' },
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (isDraft = false) => {
    if (!formData.title || !formData.description || !formData.sport || !formData.jobType) {
      toast.error(language === 'ar' ? 'يرجى تعبئة الحقول الأساسية' : 'Please fill required fields')
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        title: formData.title,
        titleAr: formData.titleAr || formData.title,
        description: formData.description,
        descriptionAr: formData.descriptionAr || formData.description,
        sport: formData.sport,
        // jobType: formData.jobType, // Removed to avoid duplicate key
        // Actually jobType in backend enum might be different. 
        // Based on previous files, backend expects 'permanent', 'seasonal' for jobType, and 'full_time' for employmentType.
        // Let's assume 'jobType' in form maps to 'employmentType' in backend for now, or we need both.
        // Let's use 'employmentType' for full_time/part_time and default jobType to 'permanent'.
        employmentType: formData.jobType,
        jobType: 'permanent', // Defaulting for now
        category: 'other', // Default or add field
        location: {
            city: formData.location,
            country: 'Saudi Arabia'
        },
        languages: formData.languages ? [formData.languages] : ['arabic'],
        competitionLevel: formData.competitionLevel,
        ageGroup: formData.ageGroup,
        startDate: formData.startDate,
        applicationDeadline: formData.deadline,
        salary: {
            min: formData.salaryMin ? Number(formData.salaryMin) : undefined,
            max: formData.salaryMax ? Number(formData.salaryMax) : undefined,
            currency: formData.salaryCurrency
        },
        status: isDraft ? 'draft' : 'active'
      }

      const response = await api.post('/job-publisher/jobs', payload)

      if (response.data.success) {
        toast.success(language === 'ar' ? 'تم إنشاء الوظيفة بنجاح' : 'Job created successfully')
        router.push('/dashboard/job-publisher')
      }
    } catch (error: any) {
      console.error('Failed to create job:', error)
      toast.error(error.response?.data?.messageAr || (language === 'ar' ? 'فشل إنشاء الوظيفة' : 'Failed to create job'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const SelectField = ({ options, value, onChange, placeholder, icon: Icon }: any) => (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none transition-all hover:border-blue-300"
      >
        <option value="">{placeholder}</option>
        {options.map((option: any) => (
          <option key={option.value} value={option.value}>
            {language === 'ar' ? option.labelAr : option.labelEn}
          </option>
        ))}
      </select>
      {Icon && (
        <Icon className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none`} />
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {language === 'ar' ? 'نشر وظيفة جديدة' : 'Post New Job'}
            </h1>
            <p className="mt-2 text-gray-600">
              {language === 'ar' ? 'أدخل تفاصيل الوظيفة بدقة لجذب أفضل المرشحين' : 'Enter job details accurately to attract best candidates'}
            </p>
          </div>
          <Link href="/dashboard/job-publisher">
            <Button variant="outline" className="gap-2">
              {language === 'ar' ? <ArrowLeft className="w-4 h-4 rotate-180" /> : <ArrowLeft className="w-4 h-4" />}
              {language === 'ar' ? 'عودة للوحة التحكم' : 'Back to Dashboard'}
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Progress/Steps could go here */}
            <div className="p-8 space-y-8">
                
                {/* Basic Info Section */}
                <section className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-semibold text-gray-900">
                            {language === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                {language === 'ar' ? 'المسمى الوظيفي (بالعربية)' : 'Job Title (Arabic)'} <span className="text-red-500">*</span>
                            </label>
                            <Input 
                                placeholder={language === 'ar' ? 'مثال: مدرب لياقة بدنية' : 'e.g. Fitness Coach'}
                                value={formData.titleAr}
                                onChange={(e) => handleInputChange('titleAr', e.target.value)}
                                className="h-12"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                {language === 'ar' ? 'المسمى الوظيفي (بالنجليزي)' : 'Job Title (English)'} <span className="text-red-500">*</span>
                            </label>
                            <Input 
                                placeholder="e.g. Fitness Coach"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                className="h-12 text-left"
                                dir="ltr"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            {language === 'ar' ? 'وصف الوظيفة' : 'Job Description'} <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[150px] resize-y"
                            placeholder={language === 'ar' ? 'اكتب وصفاً مفصلاً للمهام والمسؤوليات...' : 'Write detailed description of duties and responsibilities...'}
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                        />
                    </div>
                </section>

                {/* Details Section */}
                <section className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                        <Trophy className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-semibold text-gray-900">
                            {language === 'ar' ? 'تفاصيل الوظيفة' : 'Job Details'}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">{language === 'ar' ? 'الرياضة' : 'Sport'}</label>
                            <SelectField options={sportOptions} value={formData.sport} onChange={(v: string) => handleInputChange('sport', v)} placeholder={language === 'ar' ? 'اختر الرياضة' : 'Select Sport'} icon={Trophy} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">{language === 'ar' ? 'نوع التوظيف' : 'Employment Type'}</label>
                            <SelectField options={jobTypeOptions} value={formData.jobType} onChange={(v: string) => handleInputChange('jobType', v)} placeholder={language === 'ar' ? 'اختر النوع' : 'Select Type'} icon={Briefcase} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">{language === 'ar' ? 'الموقع/المدينة' : 'Location/City'}</label>
                            <SelectField options={locationOptions} value={formData.location} onChange={(v: string) => handleInputChange('location', v)} placeholder={language === 'ar' ? 'اختر المدينة' : 'Select City'} icon={MapPin} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">{language === 'ar' ? 'المستوى المطلوب' : 'Level Required'}</label>
                            <SelectField options={competitionLevelOptions} value={formData.competitionLevel} onChange={(v: string) => handleInputChange('competitionLevel', v)} placeholder={language === 'ar' ? 'اختر المستوى' : 'Select Level'} icon={Trophy} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">{language === 'ar' ? 'الفئة العمرية' : 'Age Group'}</label>
                            <SelectField options={ageGroupOptions} value={formData.ageGroup} onChange={(v: string) => handleInputChange('ageGroup', v)} placeholder={language === 'ar' ? 'اختر الفئة' : 'Select Group'} icon={Users} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">{language === 'ar' ? 'اللغة المطلوبة' : 'Language Required'}</label>
                            <SelectField options={languageOptions} value={formData.languages} onChange={(v: string) => handleInputChange('languages', v)} placeholder={language === 'ar' ? 'اختر اللغة' : 'Select Language'} icon={Globe} />
                        </div>
                    </div>
                </section>

                {/* Salary & Dates */}
                <section className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-semibold text-gray-900">
                            {language === 'ar' ? 'الراتب والمواعيد' : 'Salary & Dates'}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">{language === 'ar' ? 'نطاق الراتب (ريال سعودي)' : 'Salary Range (SAR)'}</label>
                            <div className="flex gap-4">
                                <Input 
                                    type="number" 
                                    placeholder={language === 'ar' ? 'من' : 'Min'} 
                                    value={formData.salaryMin}
                                    onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                                    className="h-12"
                                />
                                <Input 
                                    type="number" 
                                    placeholder={language === 'ar' ? 'إلى' : 'Max'} 
                                    value={formData.salaryMax}
                                    onChange={(e) => handleInputChange('salaryMax', e.target.value)}
                                    className="h-12"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">{language === 'ar' ? 'تاريخ البدء' : 'Start Date'}</label>
                                <Input 
                                    type="date" 
                                    value={formData.startDate}
                                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                                    className="h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">{language === 'ar' ? 'آخر موعد للتقديم' : 'Deadline'}</label>
                                <Input 
                                    type="date" 
                                    value={formData.deadline}
                                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                                    className="h-12"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Actions */}
                <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4 justify-end">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => handleSubmit(true)}
                        disabled={isSubmitting}
                        className="w-full sm:w-auto"
                    >
                        {language === 'ar' ? 'حفظ كمسودة' : 'Save as Draft'}
                    </Button>
                    <Button
                        size="lg"
                        onClick={() => handleSubmit(false)}
                        disabled={isSubmitting}
                        className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                {language === 'ar' ? 'جاري النشر...' : 'Publishing...'}
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-5 h-5 mr-2" />
                                {language === 'ar' ? 'نشر الوظيفة' : 'Publish Job'}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
