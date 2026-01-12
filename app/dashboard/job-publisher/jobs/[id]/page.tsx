'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/language-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import api from '@/services/api'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Loader2,
  MapPin,
  MapPinned,
  Trophy,
  Users,
  Trash2,
  Save
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface JobDetailsPageProps {
  params: {
    id: string
  }
}

export default function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { t, language } = useLanguage()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  
  const [formData, setFormData] = useState({
    title: "",
    titleAr: "",
    description: "",
    descriptionAr: "",
    sport: "",
    jobType: "permanent",
    employmentType: "full_time",
    category: "other",
    city: "",
    country: "Saudi Arabia",
    requirementsText: "",
    skillsText: "",
    meetingDate: "",
    meetingTime: "",
    meetingLocation: "",
    expectedStartDate: "",
    applicationDeadline: "",
    numberOfPositions: "1",
    salaryMin: "",
    salaryMax: "",
    salaryCurrency: "SAR",
    status: "active"
  })

  const sportOptions = [
    { value: "football", labelAr: "كرة القدم", labelEn: "Football" },
    { value: "basketball", labelAr: "كرة السلة", labelEn: "Basketball" },
    { value: "tennis", labelAr: "التنس", labelEn: "Tennis" },
    { value: "swimming", labelAr: "السباحة", labelEn: "Swimming" },
    { value: "running", labelAr: "الجري", labelEn: "Running" },
    { value: "volleyball", labelAr: "الكرة الطائرة", labelEn: "Volleyball" },
    { value: "handball", labelAr: "كرة اليد", labelEn: "Handball" },
    { value: "athletics", labelAr: "ألعاب القوى", labelEn: "Athletics" },
    { value: "other", labelAr: "أخرى", labelEn: "Other" },
  ]

  const jobTypeOptions = [
    { value: "permanent", labelAr: "دوام دائم", labelEn: "Permanent" },
    { value: "seasonal", labelAr: "موسمي", labelEn: "Seasonal" },
    { value: "temporary", labelAr: "مؤقت", labelEn: "Temporary" },
  ]

  const employmentTypeOptions = [
    { value: "full_time", labelAr: "دوام كامل", labelEn: "Full Time" },
    { value: "part_time", labelAr: "دوام جزئي", labelEn: "Part Time" },
    { value: "contract", labelAr: "عقد مؤقت", labelEn: "Contract" },
    { value: "internship", labelAr: "تدريب", labelEn: "Internship" },
    { value: "freelance", labelAr: "عمل حر", labelEn: "Freelance" },
  ]

  const locationOptions = [
    { value: "riyadh", labelAr: "الرياض", labelEn: "Riyadh" },
    { value: "jeddah", labelAr: "جدة", labelEn: "Jeddah" },
    { value: "dammam", labelAr: "الدمام", labelEn: "Dammam" },
    { value: "mecca", labelAr: "مكة", labelEn: "Mecca" },
    { value: "medina", labelAr: "المدينة", labelEn: "Medina" },
    { value: "khobar", labelAr: "الخبر", labelEn: "Khobar" },
    { value: "abha", labelAr: "أبها", labelEn: "Abha" },
    { value: "remote", labelAr: "عن بعد", labelEn: "Remote" },
  ]

  useEffect(() => {
    fetchJobDetails()
  }, [params.id])

  const fetchJobDetails = async () => {
    try {
      setLoading(true)
      // Assuming generic endpoint works for fetching by ID
      const response = await api.get(`/jobs/${params.id}`)
      if (response.data.success) {
        const job = response.data.data
        
        // Populate form data
        setFormData({
          title: job.title || "",
          titleAr: job.titleAr || "",
          description: job.description || "",
          descriptionAr: job.descriptionAr || "",
          sport: job.sport || "",
          jobType: job.jobType || "permanent",
          employmentType: job.employmentType || "full_time",
          category: job.category || "other",
          city: job.city || "",
          country: job.country || "Saudi Arabia",
          requirementsText: job.requirements?.description || "",
          skillsText: job.requirements?.skills?.join(", ") || "",
          meetingDate: job.meetingDate ? new Date(job.meetingDate).toISOString().split('T')[0] : "",
          meetingTime: job.meetingTime || "",
          meetingLocation: job.meetingLocation || "",
          expectedStartDate: job.expectedStartDate ? new Date(job.expectedStartDate).toISOString().split('T')[0] : "",
          applicationDeadline: job.applicationDeadline ? new Date(job.applicationDeadline).toISOString().split('T')[0] : "",
          numberOfPositions: job.numberOfPositions?.toString() || "1",
          salaryMin: job.salary?.min?.toString() || "",
          salaryMax: job.salary?.max?.toString() || "",
          salaryCurrency: job.salary?.currency || "SAR",
          status: job.status || "active"
        })
      }
    } catch (error) {
      console.error('Error fetching job details:', error)
      toast.error(language === 'ar' ? 'فشل تحميل تفاصيل الوظيفة' : 'Failed to load job details')
      router.push('/dashboard/job-publisher')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleUpdate = async () => {
    const basicValid = formData.title && formData.description && formData.sport && formData.city && formData.country
    if (!basicValid) {
      toast.error(
        language === "ar"
          ? "يرجى تعبئة الحقول الأساسية"
          : "Please fill basic fields"
      )
      return
    }

    setIsSubmitting(true)

    try {
      const skills = formData.skillsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)

      const payload = {
        title: formData.title,
        titleAr: formData.titleAr || formData.title,
        description: formData.description,
        descriptionAr: formData.descriptionAr || formData.description,
        sport: formData.sport,
        jobType: formData.jobType,
        category: formData.category,
        employmentType: formData.employmentType,
        numberOfPositions: Number(formData.numberOfPositions) || 1,
        city: formData.city,
        country: formData.country,
        requirements: {
          description: formData.requirementsText || formData.description,
          skills,
        },
        meetingDate: formData.meetingDate || undefined,
        meetingTime: formData.meetingTime || undefined,
        meetingLocation: formData.meetingLocation || undefined,
        expectedStartDate: formData.expectedStartDate || undefined,
        applicationDeadline: formData.applicationDeadline || undefined,
        salary: {
          min: formData.salaryMin ? Number(formData.salaryMin) : undefined,
          max: formData.salaryMax ? Number(formData.salaryMax) : undefined,
          currency: formData.salaryCurrency,
        },
        status: formData.status,
      }

      const response = await api.put(`/jobs/${params.id}`, payload)

      if (response.data.success) {
        toast.success(language === "ar" ? "تم تحديث الوظيفة بنجاح" : "Job updated successfully")
        setIsEditing(false)
      }
    } catch (error: any) {
      console.error("Failed to update job:", error)
      toast.error(error.response?.data?.messageAr || (language === "ar" ? "فشل تحديث الوظيفة" : "Failed to update job"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذه الوظيفة؟' : 'Are you sure you want to delete this job?')) {
      return
    }

    try {
      await api.delete(`/jobs/${params.id}`)
      toast.success(language === 'ar' ? 'تم حذف الوظيفة بنجاح' : 'Job deleted successfully')
      router.push('/dashboard/job-publisher')
    } catch (error) {
      toast.error(language === 'ar' ? 'فشل حذف الوظيفة' : 'Failed to delete job')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className={`w-4 h-4 ${language === "ar" ? "rotate-180" : ""}`} />
          {language === "ar" ? "رجوع" : "Back"}
        </Button>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {language === "ar" ? "حذف" : "Delete"}
              </Button>
              <Button
                onClick={() => setIsEditing(true)}
                className="gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <FileText className="w-4 h-4" />
                {language === "ar" ? "تعديل" : "Edit"}
              </Button>
            </>
          ) : (
            <>
               <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="gap-2"
              >
                {language === "ar" ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={isSubmitting}
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {language === "ar" ? "حفظ التغييرات" : "Save Changes"}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isEditing ? (language === "ar" ? "تعديل الوظيفة" : "Edit Job") : formData.title}
          </h1>
          <p className="text-gray-500">
            {language === "ar" 
              ? "تفاصيل الوظيفة ومعلوماتها" 
              : "Job details and information"}
          </p>
        </div>

        {/* Basic Info */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900 border-b pb-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            {language === "ar" ? "المعلومات الأساسية" : "Basic Information"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {language === "ar" ? "عنوان الوظيفة (بالعربية)" : "Job Title (Arabic)"} <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.titleAr}
                onChange={(e) => handleInputChange("titleAr", e.target.value)}
                placeholder={language === "ar" ? "مثال: مدرب كرة قدم" : "e.g. Football Coach"}
                className="text-right"
                dir="rtl"
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {language === "ar" ? "عنوان الوظيفة (بالنجليزي)" : "Job Title (English)"} <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g. Football Coach"
                dir="ltr"
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {language === "ar" ? "الرياضة" : "Sport"} <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.sport}
                onValueChange={(value) => handleInputChange("sport", value)}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder={language === "ar" ? "اختر الرياضة" : "Select Sport"} />
                </SelectTrigger>
                <SelectContent>
                  {sportOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {language === "ar" ? option.labelAr : option.labelEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {language === "ar" ? "نوع الوظيفة" : "Job Type"}
              </label>
              <Select
                value={formData.jobType}
                onValueChange={(value) => handleInputChange("jobType", value)}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {jobTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {language === "ar" ? option.labelAr : option.labelEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {language === "ar" ? "طبيعة العمل" : "Employment Type"}
              </label>
              <Select
                value={formData.employmentType}
                onValueChange={(value) => handleInputChange("employmentType", value)}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {employmentTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {language === "ar" ? option.labelAr : option.labelEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {language === "ar" ? "عدد الشواغر" : "Number of Positions"}
              </label>
              <Input
                type="number"
                min="1"
                value={formData.numberOfPositions}
                onChange={(e) => handleInputChange("numberOfPositions", e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900 border-b pb-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            {language === "ar" ? "الموقع" : "Location"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {language === "ar" ? "المدينة" : "City"} <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.city}
                onValueChange={(value) => handleInputChange("city", value)}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder={language === "ar" ? "اختر المدينة" : "Select City"} />
                </SelectTrigger>
                <SelectContent>
                  {locationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {language === "ar" ? option.labelAr : option.labelEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {language === "ar" ? "الدولة" : "Country"}
              </label>
              <Input
                value={formData.country}
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>
        </div>

        {/* Description & Requirements */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900 border-b pb-2">
            <FileText className="w-5 h-5 text-blue-600" />
            {language === "ar" ? "الوصف والمتطلبات" : "Description & Requirements"}
          </h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {language === "ar" ? "الوصف الوظيفي (بالعربية)" : "Job Description (Arabic)"}
              </label>
              <Textarea
                value={formData.descriptionAr}
                onChange={(e) => handleInputChange("descriptionAr", e.target.value)}
                rows={4}
                dir="rtl"
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {language === "ar" ? "الوصف الوظيفي (بالنجليزي)" : "Job Description (English)"} <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
                dir="ltr"
                disabled={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {language === "ar" ? "المتطلبات (اختياري)" : "Requirements (Optional)"}
              </label>
              <Textarea
                value={formData.requirementsText}
                onChange={(e) => handleInputChange("requirementsText", e.target.value)}
                rows={4}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {language === "ar" ? "المهارات (افصل بينها بفاصلة)" : "Skills (Comma separated)"}
              </label>
              <Input
                value={formData.skillsText}
                onChange={(e) => handleInputChange("skillsText", e.target.value)}
                placeholder={language === "ar" ? "مثال: تدريب, لياقة, تخطيط" : "e.g. Coaching, Fitness, Planning"}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Salary */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900 border-b pb-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            {language === "ar" ? "الراتب (اختياري)" : "Salary (Optional)"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {language === "ar" ? "الحد الأدنى" : "Minimum"}
              </label>
              <Input
                type="number"
                value={formData.salaryMin}
                onChange={(e) => handleInputChange("salaryMin", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {language === "ar" ? "الحد الأقصى" : "Maximum"}
              </label>
              <Input
                type="number"
                value={formData.salaryMax}
                onChange={(e) => handleInputChange("salaryMax", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {language === "ar" ? "العملة" : "Currency"}
              </label>
              <Input
                value={formData.salaryCurrency}
                onChange={(e) => handleInputChange("salaryCurrency", e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900 border-b pb-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            {language === "ar" ? "التواريخ والمواعيد" : "Dates & Schedule"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {language === "ar" ? "تاريخ بدء العمل المتوقع" : "Expected Start Date"}
              </label>
              <Input
                type="date"
                value={formData.expectedStartDate}
                onChange={(e) => handleInputChange("expectedStartDate", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {language === "ar" ? "الموعد النهائي للتقديم" : "Application Deadline"}
              </label>
              <Input
                type="date"
                value={formData.applicationDeadline}
                onChange={(e) => handleInputChange("applicationDeadline", e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
