"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import api from "@/services/api"
import { toast } from "sonner"
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
} from "lucide-react"

export default function CreateJobPage() {
  const { language } = useLanguage()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (isDraft = false) => {
    const basicValid = formData.title && formData.description && formData.sport && formData.city && formData.country
    if (!basicValid) {
      toast.error(
        language === "ar"
          ? "يرجى تعبئة الحقول الأساسية (المسمى، الوصف، المدينة، نوع الوظيفة)"
          : "Please fill title, description, city, and job type"
      )
      return
    }

    if (formData.applicationDeadline) {
      const deadlineDate = new Date(formData.applicationDeadline)
      if (deadlineDate < new Date()) {
        toast.error(language === "ar" ? "تاريخ إغلاق التقديم يجب أن يكون مستقبلياً" : "Application deadline must be in the future")
        return
      }
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
        status: isDraft ? "draft" : "active",
      }

      const response = await api.post("/clubs/jobs", payload)

      if (response.data.success) {
        toast.success(language === "ar" ? "تم إنشاء الوظيفة بنجاح" : "Job created successfully")
        router.push("/dashboard/job-publisher")
      }
    } catch (error: any) {
      console.error("Failed to create job:", error)
      toast.error(error.response?.data?.messageAr || (language === "ar" ? "فشل إنشاء الوظيفة" : "Failed to create job"))
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
            {language === "ar" ? option.labelAr : option.labelEn}
          </option>
        ))}
      </select>
      {Icon && <Icon className={`absolute ${language === "ar" ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none`} />}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{language === "ar" ? "نشر وظيفة جديدة" : "Post New Job"}</h1>
            <p className="mt-2 text-gray-600">
              {language === "ar"
                ? "سيتم استخدام نفس API النشر الخاص بالنادي مع الحفاظ على الحقول الحالية."
                : "Uses the existing club jobs API and current job schema."}
            </p>
          </div>
          <Link href="/dashboard/job-publisher">
            <Button variant="outline" className="gap-2">
              {language === "ar" ? <ArrowLeft className="w-4 h-4 rotate-180" /> : <ArrowLeft className="w-4 h-4" />}
              {language === "ar" ? "عودة للوحة التحكم" : "Back to Dashboard"}
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 space-y-8">
            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">{language === "ar" ? "المعلومات الأساسية" : "Basic Information"}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {language === "ar" ? "المسمى الوظيفي (بالعربية)" : "Job Title (Arabic)"} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder={language === "ar" ? "مثال: مدرب لياقة بدنية" : "e.g. Fitness Coach"}
                    value={formData.titleAr}
                    onChange={(e) => handleInputChange("titleAr", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {language === "ar" ? "المسمى الوظيفي (بالإنجليزية)" : "Job Title (English)"} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder={language === "ar" ? "مثال: Fitness Coach" : "e.g. Fitness Coach"}
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {language === "ar" ? "الوصف (بالعربية)" : "Description (Arabic)"} <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    placeholder={language === "ar" ? "صف المهام والمسؤوليات..." : "Describe responsibilities..."}
                    value={formData.descriptionAr}
                    onChange={(e) => handleInputChange("descriptionAr", e.target.value)}
                    rows={4}
                    className="w-full border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {language === "ar" ? "الوصف (بالإنجليزية)" : "Description (English)"} <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    placeholder={language === "ar" ? "صف المهام والمسؤوليات..." : "Describe responsibilities..."}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={4}
                    className="w-full border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-semibold text-gray-900">{language === "ar" ? "تفاصيل الوظيفة" : "Job Details"}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{language === "ar" ? "الرياضة" : "Sport"} <span className="text-red-500">*</span></label>
                  <SelectField
                    options={sportOptions}
                    value={formData.sport}
                    onChange={(value: string) => handleInputChange("sport", value)}
                    placeholder={language === "ar" ? "اختر الرياضة" : "Select sport"}
                    icon={Trophy}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{language === "ar" ? "نوع الوظيفة" : "Job Type"} <span className="text-red-500">*</span></label>
                  <SelectField
                    options={jobTypeOptions}
                    value={formData.jobType}
                    onChange={(value: string) => handleInputChange("jobType", value)}
                    placeholder={language === "ar" ? "اختر نوع الوظيفة" : "Select job type"}
                    icon={Clock}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{language === "ar" ? "طبيعة العمل" : "Employment Type"} <span className="text-red-500">*</span></label>
                  <SelectField
                    options={employmentTypeOptions}
                    value={formData.employmentType}
                    onChange={(value: string) => handleInputChange("employmentType", value)}
                    placeholder={language === "ar" ? "اختر طبيعة العمل" : "Select employment type"}
                    icon={Briefcase}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{language === "ar" ? "التصنيف" : "Category"}</label>
                  <Input
                    placeholder={language === "ar" ? "مثال: مدربين، إداريين" : "e.g. coaches, admin"}
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                  />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <MapPinned className="w-5 h-5 text-red-500" />
                <h2 className="text-lg font-semibold text-gray-900">{language === "ar" ? "الموقع" : "Location"}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{language === "ar" ? "المدينة" : "City"} <span className="text-red-500">*</span></label>
                  <SelectField
                    options={locationOptions}
                    value={formData.city}
                    onChange={(value: string) => handleInputChange("city", value)}
                    placeholder={language === "ar" ? "اختر المدينة" : "Select city"}
                    icon={MapPin}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{language === "ar" ? "الدولة" : "Country"} <span className="text-red-500">*</span></label>
                  <Input
                    placeholder={language === "ar" ? "المملكة العربية السعودية" : "Saudi Arabia"}
                    value={formData.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                  />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">{language === "ar" ? "المتطلبات والمهارات" : "Requirements & Skills"}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{language === "ar" ? "متطلبات الوظيفة" : "Job Requirements"}</label>
                  <Textarea
                    placeholder={language === "ar" ? "أدخل متطلبات الوظيفة بالتفصيل" : "Enter detailed requirements"}
                    value={formData.requirementsText}
                    onChange={(e) => handleInputChange("requirementsText", e.target.value)}
                    rows={4}
                    className="w-full border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{language === "ar" ? "المهارات المطلوبة (مفصولة بفاصلة)" : "Required skills (comma separated)"}</label>
                  <Textarea
                    placeholder={language === "ar" ? "مثال: قيادة فريق، تخطيط تدريبي، تواصل" : "e.g. Team leadership, training plans, communication"}
                    value={formData.skillsText}
                    onChange={(e) => handleInputChange("skillsText", e.target.value)}
                    rows={4}
                    className="w-full border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <Calendar className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-900">{language === "ar" ? "التواريخ والراتب" : "Dates & Salary"}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{language === "ar" ? "تاريخ البدء المتوقع" : "Expected Start Date"}</label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={formData.expectedStartDate}
                      onChange={(e) => handleInputChange("expectedStartDate", e.target.value)}
                      className="pr-10"
                    />
                    <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{language === "ar" ? "آخر موعد للتقديم" : "Application Deadline"}</label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={formData.applicationDeadline}
                      onChange={(e) => handleInputChange("applicationDeadline", e.target.value)}
                      className="pr-10"
                    />
                    <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{language === "ar" ? "عدد الشواغر" : "Positions count"}</label>
                  <Input
                    type="number"
                    min={1}
                    value={formData.numberOfPositions}
                    onChange={(e) => handleInputChange("numberOfPositions", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{language === "ar" ? "الحد الأدنى للراتب" : "Min Salary"}</label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <Input
                      type="number"
                      placeholder="5000"
                      value={formData.salaryMin}
                      onChange={(e) => handleInputChange("salaryMin", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{language === "ar" ? "الحد الأعلى للراتب" : "Max Salary"}</label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <Input
                      type="number"
                      placeholder="15000"
                      value={formData.salaryMax}
                      onChange={(e) => handleInputChange("salaryMax", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{language === "ar" ? "العملة" : "Currency"}</label>
                  <select
                    value={formData.salaryCurrency}
                    onChange={(e) => handleInputChange("salaryCurrency", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="SAR">SAR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <Users className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-gray-900">{language === "ar" ? "تفاصيل المقابلة" : "Interview Details"}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{language === "ar" ? "تاريخ المقابلة" : "Interview Date"}</label>
                  <Input type="date" value={formData.meetingDate} onChange={(e) => handleInputChange("meetingDate", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{language === "ar" ? "وقت المقابلة" : "Interview Time"}</label>
                  <Input type="time" value={formData.meetingTime} onChange={(e) => handleInputChange("meetingTime", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{language === "ar" ? "مكان المقابلة / الرابط" : "Interview Location / Link"}</label>
                  <Input
                    placeholder={language === "ar" ? "عنوان أو رابط مقابلة" : "Meeting location or link"}
                    value={formData.meetingLocation}
                    onChange={(e) => handleInputChange("meetingLocation", e.target.value)}
                  />
                </div>
              </div>
            </section>

            <section className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
              <p className="text-sm text-gray-500">
                {language === "ar"
                  ? "سيتم حفظ كل وظيفة في نفس API المستخدم للواجهة العامة. تحقق من البيانات قبل النشر."
                  : "Jobs are posted to the same public jobs API. Review details before publishing."}
              </p>
              <div className="flex items-center gap-3">
                <Button onClick={() => handleSubmit(true)} variant="outline" className="border-gray-300" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
                  {language === "ar" ? "حفظ كمسودة" : "Save Draft"}
                </Button>

                <Button
                  onClick={() => handleSubmit(false)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                  {language === "ar" ? "نشر الوظيفة الآن" : "Publish Job"}
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
