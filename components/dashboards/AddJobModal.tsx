/* eslint-disable no-unused-vars */
'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/contexts/auth-context'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { jobPublisherService } from '@/services/job-publisher.service'
import toast from 'react-hot-toast'
import {
  X,
  Calendar,
  MapPin,
  Globe,
  Trophy,
  Users,
  Clock,
  Loader2,
} from 'lucide-react'

interface AddJobModalProps {
  isOpen: boolean
  onClose: () => void
  onJobCreated?: () => void
}

const AddJobModal = ({ isOpen, onClose, onJobCreated }: AddJobModalProps) => {
  const { language } = useLanguage()
  // Removed createJob API call
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sport: '',
    jobType: '',
    location: '',
    languages: '',
    competitionLevel: '',
    ageGroup: '',
    startDate: '',
    deadline: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sportOptions = [
    { value: 'football', labelAr: 'كرة القدم', labelEn: 'Football' },
    { value: 'basketball', labelAr: 'كرة السلة', labelEn: 'Basketball' },
    { value: 'tennis', labelAr: 'التنس', labelEn: 'Tennis' },
    { value: 'swimming', labelAr: 'السباحة', labelEn: 'Swimming' },
    { value: 'running', labelAr: 'الجري', labelEn: 'Running' },
    { value: 'volleyball', labelAr: 'الكرة الطائرة', labelEn: 'Volleyball' },
  ]

  const jobTypeOptions = [
    { value: 'full-time', labelAr: 'دوام كامل', labelEn: 'Full Time' },
    { value: 'part-time', labelAr: 'دوام جزئي', labelEn: 'Part Time' },
    { value: 'contract', labelAr: 'عقد مؤقت', labelEn: 'Contract' },
    { value: 'internship', labelAr: 'تدريب', labelEn: 'Internship' },
  ]

  const locationOptions = [
    { value: 'riyadh', labelAr: 'الرياض', labelEn: 'Riyadh' },
    { value: 'jeddah', labelAr: 'جدة', labelEn: 'Jeddah' },
    { value: 'dammam', labelAr: 'الدمام', labelEn: 'Dammam' },
    { value: 'mecca', labelAr: 'مكة', labelEn: 'Mecca' },
    { value: 'medina', labelAr: 'المدينة', labelEn: 'Medina' },
    { value: 'remote', labelAr: 'عن بعد', labelEn: 'Remote' },
  ]

  const languageOptions = [
    { value: 'arabic', labelAr: 'العربية', labelEn: 'Arabic' },
    { value: 'english', labelAr: 'الإنجليزية', labelEn: 'English' },
    {
      value: 'both',
      labelAr: 'العربية والإنجليزية',
      labelEn: 'Arabic & English',
    },
    { value: 'french', labelAr: 'الفرنسية', labelEn: 'French' },
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
    if (!formData.title.trim() || !formData.description.trim()) {
      setError(
        language === 'ar'
          ? 'يرجى ملء المسمى الوظيفي والوصف'
          : 'Please fill in job title and description'
      )
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const jobData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        sport: formData.sport,
        jobType: formData.jobType,
        location: formData.location,
        languages: formData.languages,
        competitionLevel: formData.competitionLevel,
        ageGroup: formData.ageGroup,
        startDate: formData.startDate,
        deadline: formData.deadline,
        isDraft,
      }

      const response = await jobPublisherService.createJob(jobData)

      if (response.success) {
        toast.success(language === 'ar' ? response.messageAr || 'تم إنشاء الوظيفة بنجاح' : response.message || 'Job created successfully')
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          sport: '',
          jobType: '',
          location: '',
          languages: '',
          competitionLevel: '',
          ageGroup: '',
          startDate: '',
          deadline: '',
        })

        // Notify parent component to refresh data
        if (onJobCreated) {
          onJobCreated()
        }

        onClose()
      } else {
        throw new Error(response.error || 'Failed to create job')
      }
    } catch (error: any) {
      console.error('Failed to create job:', error)
      const errorMessage = error.message ||
        (language === 'ar' ? 'فشل في إنشاء الوظيفة' : 'Failed to create job')
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const SelectField = ({
    options,
    value,
    onChange,
    placeholder,
    icon: Icon,
  }: any) => (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white appearance-none pr-10"
      >
        <option value="">{placeholder}</option>
        {options.map((option: any) => (
          <option key={option.value} value={option.value}>
            {language === 'ar' ? option.labelAr : option.labelEn}
          </option>
        ))}
      </select>
      {Icon && (
        <Icon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      )}
    </div>
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-green-50 to-blue-50">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  {language === 'ar' ? 'إضافة وظيفة جديدة' : 'Add New Job'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}
                <div className="space-y-6">
                  {/* Job Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'المسمى الوظيفي' : 'Job Title'}
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange('title', e.target.value)
                      }
                      placeholder={
                        language === 'ar'
                          ? 'أدخل المسمى الوظيفي'
                          : 'Enter job title'
                      }
                      className="h-12"
                    />
                  </div>

                  {/* Job Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar'
                        ? 'وصف الوظيفة والمؤهلات والمهارات'
                        : 'Job Description, Qualifications & Skills'}
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange('description', e.target.value)
                      }
                      placeholder={
                        language === 'ar'
                          ? 'أدخل وصف مفصل للوظيفة...'
                          : 'Enter detailed job description...'
                      }
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                    />
                  </div>

                  {/* First Row - Sport, Job Type, Location */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'الرياضة' : 'Sport'}
                      </label>
                      <SelectField
                        options={sportOptions}
                        value={formData.sport}
                        onChange={(value: string) =>
                          handleInputChange('sport', value)
                        }
                        placeholder={
                          language === 'ar' ? 'اختر الرياضة' : 'Select Sport'
                        }
                        icon={Trophy}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'نوع الوظيفة' : 'Job Type'}
                      </label>
                      <SelectField
                        options={jobTypeOptions}
                        value={formData.jobType}
                        onChange={(value: string) =>
                          handleInputChange('jobType', value)
                        }
                        placeholder={
                          language === 'ar'
                            ? 'اختر نوع الوظيفة'
                            : 'Select Job Type'
                        }
                        icon={Clock}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'الموقع' : 'Location'}
                      </label>
                      <SelectField
                        options={locationOptions}
                        value={formData.location}
                        onChange={(value: string) =>
                          handleInputChange('location', value)
                        }
                        placeholder={
                          language === 'ar' ? 'اختر الموقع' : 'Select Location'
                        }
                        icon={MapPin}
                      />
                    </div>
                  </div>

                  {/* Second Row - Languages, Competition Level, Age Group */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'اللغات' : 'Languages'}
                      </label>
                      <SelectField
                        options={languageOptions}
                        value={formData.languages}
                        onChange={(value: string) =>
                          handleInputChange('languages', value)
                        }
                        placeholder={
                          language === 'ar' ? 'اختر اللغة' : 'Select Languages'
                        }
                        icon={Globe}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar'
                          ? 'مستوى المنافسة'
                          : 'Competition Level'}
                      </label>
                      <SelectField
                        options={competitionLevelOptions}
                        value={formData.competitionLevel}
                        onChange={(value: string) =>
                          handleInputChange('competitionLevel', value)
                        }
                        placeholder={
                          language === 'ar'
                            ? 'اختر مستوى المنافسة'
                            : 'Select Competition Level'
                        }
                        icon={Trophy}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'الفئة العمرية' : 'Age Group'}
                      </label>
                      <SelectField
                        options={ageGroupOptions}
                        value={formData.ageGroup}
                        onChange={(value: string) =>
                          handleInputChange('ageGroup', value)
                        }
                        placeholder={
                          language === 'ar'
                            ? 'اختر الفئة العمرية'
                            : 'Select Age Group'
                        }
                        icon={Users}
                      />
                    </div>
                  </div>

                  {/* Third Row - Start Date, Deadline */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'تاريخ البداية' : 'Start Date'}
                      </label>
                      <div className="relative">
                        <Input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) =>
                            handleInputChange('startDate', e.target.value)
                          }
                          className="h-12 pr-10"
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar'
                          ? 'الموعد النهائي للتقديم'
                          : 'Deadline To Apply'}
                      </label>
                      <div className="relative">
                        <Input
                          type="date"
                          value={formData.deadline}
                          onChange={(e) =>
                            handleInputChange('deadline', e.target.value)
                          }
                          className="h-12 pr-10"
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 bg-gray-50 border-t flex flex-col sm:flex-row gap-3 sm:justify-end">
                <Button
                  onClick={() => handleSubmit(true)}
                  variant="outline"
                  className="order-2 sm:order-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
                    </>
                  ) : language === 'ar' ? (
                    'حفظ كمسودة'
                  ) : (
                    'Save as Draft'
                  )}
                </Button>
                <Button
                  onClick={() => handleSubmit(false)}
                  className="order-1 sm:order-2 bg-green-600 hover:bg-green-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {language === 'ar' ? 'جاري الإضافة...' : 'Adding...'}
                    </>
                  ) : language === 'ar' ? (
                    'إضافة الوظيفة'
                  ) : (
                    'Add Job'
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default AddJobModal
