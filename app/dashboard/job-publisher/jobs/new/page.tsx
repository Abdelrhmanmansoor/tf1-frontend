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
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Loader2,
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
    category: "other",
    employmentType: "full-time",
    experienceLevel: "",
    city: "",
    cityAr: "",
    country: "Saudi Arabia",
    countryAr: "المملكة العربية السعودية",
    isRemote: false,
    requirementsText: "",
    responsibilitiesText: "",
    skillsText: "",
    benefitsText: "",
    minExperienceYears: "",
    maxExperienceYears: "",
    applicationDeadline: "",
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

  const categoryOptions = [
    { value: "coach", labelAr: "مدرب", labelEn: "Coach" },
    { value: "trainer", labelAr: "مدرب لياقة", labelEn: "Fitness Trainer" },
    { value: "physiotherapist", labelAr: "أخصائي علاج طبيعي", labelEn: "Physiotherapist" },
    { value: "nutritionist", labelAr: "أخصائي تغذية", labelEn: "Nutritionist" },
    { value: "manager", labelAr: "مدير", labelEn: "Manager" },
    { value: "admin", labelAr: "إداري", labelEn: "Admin" },
    { value: "other", labelAr: "أخرى", labelEn: "Other" },
  ]

  const employmentTypeOptions = [
    { value: "full-time", labelAr: "دوام كامل", labelEn: "Full Time" },
    { value: "part-time", labelAr: "دوام جزئي", labelEn: "Part Time" },
    { value: "contract", labelAr: "عقد مؤقت", labelEn: "Contract" },
    { value: "temporary", labelAr: "مؤقت", labelEn: "Temporary" },
    { value: "internship", labelAr: "تدريب", labelEn: "Internship" },
  ]

  const experienceLevelOptions = [
    { value: "entry", labelAr: "مبتدئ", labelEn: "Entry Level" },
    { value: "intermediate", labelAr: "متوسط", labelEn: "Intermediate" },
    { value: "senior", labelAr: "خبير", labelEn: "Senior" },
    { value: "expert", labelAr: "خبير متقدم", labelEn: "Expert" },
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (isDraft = false) => {
    // Validate required fields
    const basicValid = formData.title && formData.description && formData.sport && formData.category &&
                       formData.employmentType && formData.experienceLevel && formData.city
    if (!basicValid) {
      toast.error(
        language === "ar"
          ? "يرجى تعبئة الحقول المطلوبة (المسمى، الوصف، الرياضة، التصنيف، نوع العمل، المستوى، المدينة)"
          : "Please fill required fields (title, description, sport, category, employment type, experience level, city)"
      )
      return
    }

    // Validate description length (backend requires min 50 chars)
    if (formData.description.length < 50) {
      toast.error(
        language === "ar"
          ? "الوصف يجب أن يكون 50 حرفاً على الأقل"
          : "Description must be at least 50 characters"
      )
      return
    }

    // Validate requirements
    if (!formData.requirementsText || formData.requirementsText.trim().length === 0) {
      toast.error(
        language === "ar"
          ? "يرجى إدخال متطلبات الوظيفة"
          : "Please enter job requirements"
      )
      return
    }

    // Validate responsibilities
    if (!formData.responsibilitiesText || formData.responsibilitiesText.trim().length === 0) {
      toast.error(
        language === "ar"
          ? "يرجى إدخال مسؤوليات الوظيفة"
          : "Please enter job responsibilities"
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
      // Parse comma-separated lists into arrays
      const requirements = formData.requirementsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)

      const responsibilities = formData.responsibilitiesText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)

      const skills = formData.skillsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)

      const benefits = formData.benefitsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)

      // Build payload matching backend Joi schema
      const payload: any = {
        title: formData.title,
        titleAr: formData.titleAr || formData.title,
        description: formData.description,
        descriptionAr: formData.descriptionAr || formData.description,
        sport: formData.sport,
        category: formData.category,
        employmentType: formData.employmentType,
        experienceLevel: formData.experienceLevel,

        location: {
          city: formData.city,
          cityAr: formData.cityAr || formData.city,
          country: formData.country,
          countryAr: formData.countryAr,
          isRemote: formData.isRemote,
        },

        requirements,
        responsibilities,

        status: isDraft ? "draft" : "active",
      }

      // Add optional fields only if they have values
      if (skills.length > 0) {
        payload.skills = skills
      }

      if (benefits.length > 0) {
        payload.benefits = benefits
      }

      if (formData.minExperienceYears) {
        payload.minExperienceYears = Number(formData.minExperienceYears)
      }

      if (formData.maxExperienceYears) {
        payload.maxExperienceYears = Number(formData.maxExperienceYears)
      }

      if (formData.salaryMin) {
        payload.salaryMin = Number(formData.salaryMin)
      }

      if (formData.salaryMax) {
        payload.salaryMax = Number(formData.salaryMax)
      }

      if (formData.salaryCurrency) {
        payload.salaryCurrency = formData.salaryCurrency
      }

      if (formData.applicationDeadline) {
        payload.applicationDeadline = formData.applicationDeadline
      }

      const response = await api.post("/api/v1/job-publisher/jobs", payload)

      if (response.data.success) {
        toast.success(language === "ar" ? "تم إنشاء الوظيفة بنجاح" : "Job created successfully")
        router.push("/dashboard/job-publisher")
      }
    } catch (error: any) {
      console.error("Failed to create job:", error)

      // Handle subscription limit errors
      if (error.response?.status === 403) {
        toast.error(
          error.response?.data?.messageAr ||
          (language === "ar" ? "لقد وصلت للحد الأقصى من الوظائف في باقتك" : "You've reached your job posting limit")
        )
      } else if (error.response?.status === 400) {
        // Validation errors
        toast.error(
          error.response?.data?.messageAr ||
          error.response?.data?.message ||
          (language === "ar" ? "خطأ في البيانات المدخلة" : "Invalid input data")
        )
      } else {
        toast.error(
          error.response?.data?.messageAr ||
          (language === "ar" ? "فشل إنشاء الوظيفة" : "Failed to create job")
        )
      }
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
                  <label className="text-sm font-medium text-gray-700">{language === "ar" ? "التصنيف" : "Category"} <span className="text-red-500">*</span></label>
                  <SelectField
                    options={categoryOptions}
                    value={formData.category}
                    onChange={(value: string) => handleInputChange("category", value)}
                    placeholder={language === "ar" ? "اختر التصنيف" : "Select category"}
                    icon={Briefcase}
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
                    icon={Clock}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{language === "ar" ? "مستوى الخبرة" : "Experience Level"} <span className="text-red-500">*</span></label>
                  <SelectField
                    options={experienceLevelOptions}
                    value={formData.experienceLevel}
                    onChange={(value: string) => handleInputChange("experienceLevel", value)}
                    placeholder={language === "ar" ? "اختر مستوى الخبرة" : "Select experience level"}
                    icon={Users}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{language === "ar" ? "الحد الأدنى لسنوات الخبرة" : "Min Experience (Years)"}</label>
                  <Input
                    type="number"
                    min={0}
                    max={50}
                    placeholder={language === "ar" ? "مثال: 3" : "e.g. 3"}
                    value={formData.minExperienceYears}
                    onChange={(e) => handleInputChange("minExperienceYears", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{language === "ar" ? "الحد الأقصى لسنوات الخبرة" : "Max Experience (Years)"}</label>
                  <Input
                    type="number"
                    min={0}
                    max={50}
                    placeholder={language === "ar" ? "مثال: 10" : "e.g. 10"}
                    value={formData.maxExperienceYears}
                    onChange={(e) => handleInputChange("maxExperienceYears", e.target.value)}
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
                  <label className="text-sm font-medium text-gray-700">{language === "ar" ? "المدينة (بالإنجليزية)" : "City (English)"} <span className="text-red-500">*</span></label>
                  <Input
                    placeholder={language === "ar" ? "مثال: Riyadh" : "e.g. Riyadh"}
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{language === "ar" ? "المدينة (بالعربية)" : "City (Arabic)"}</label>
                  <Input
                    placeholder={language === "ar" ? "مثال: الرياض" : "e.g. الرياض"}
                    value={formData.cityAr}
                    onChange={(e) => handleInputChange("cityAr", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{language === "ar" ? "الدولة" : "Country"} <span className="text-red-500">*</span></label>
                  <Input
                    placeholder={language === "ar" ? "المملكة العربية السعودية" : "Saudi Arabia"}
                    value={formData.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    {language === "ar" ? "عمل عن بعد" : "Remote Work"}
                    <input
                      type="checkbox"
                      checked={formData.isRemote}
                      onChange={(e) => setFormData((prev) => ({ ...prev, isRemote: e.target.checked }))}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    {language === "ar" ? "ضع علامة إذا كانت الوظيفة عن بعد" : "Check if this is a remote position"}
                  </p>
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
                  <label className="text-sm font-medium text-gray-700">
                    {language === "ar" ? "متطلبات الوظيفة (كل متطلب في سطر)" : "Job Requirements (one per line)"} <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    placeholder={language === "ar" ? "مثال:\nشهادة بكالوريوس\n5 سنوات خبرة\nرخصة قيادة سارية" : "e.g.\nBachelor's degree\n5+ years experience\nValid driving license"}
                    value={formData.requirementsText}
                    onChange={(e) => handleInputChange("requirementsText", e.target.value)}
                    rows={6}
                    className="w-full border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {language === "ar" ? "المسؤوليات (كل مسؤولية في سطر)" : "Responsibilities (one per line)"} <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    placeholder={language === "ar" ? "مثال:\nتدريب الفريق\nإعداد خطط التدريب\nمتابعة الأداء" : "e.g.\nTrain the team\nDevelop training plans\nMonitor performance"}
                    value={formData.responsibilitiesText}
                    onChange={(e) => handleInputChange("responsibilitiesText", e.target.value)}
                    rows={6}
                    className="w-full border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{language === "ar" ? "المهارات المطلوبة (مفصولة بفاصلة)" : "Required Skills (comma separated)"}</label>
                  <Textarea
                    placeholder={language === "ar" ? "مثال: قيادة فريق، تخطيط تدريبي، تواصل" : "e.g. Team leadership, training plans, communication"}
                    value={formData.skillsText}
                    onChange={(e) => handleInputChange("skillsText", e.target.value)}
                    rows={4}
                    className="w-full border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{language === "ar" ? "المزايا (كل ميزة في سطر)" : "Benefits (one per line)"}</label>
                  <Textarea
                    placeholder={language === "ar" ? "مثال:\nتأمين صحي\nبدل سكن\nبدل مواصلات" : "e.g.\nHealth insurance\nHousing allowance\nTransportation"}
                    value={formData.benefitsText}
                    onChange={(e) => handleInputChange("benefitsText", e.target.value)}
                    rows={4}
                    className="w-full border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <DollarSign className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">{language === "ar" ? "الراتب والمواعيد" : "Salary & Dates"}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{language === "ar" ? "الحد الأدنى للراتب" : "Min Salary"}</label>
                  <Input
                    type="number"
                    placeholder="5000"
                    value={formData.salaryMin}
                    onChange={(e) => handleInputChange("salaryMin", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{language === "ar" ? "الحد الأعلى للراتب" : "Max Salary"}</label>
                  <Input
                    type="number"
                    placeholder="15000"
                    value={formData.salaryMax}
                    onChange={(e) => handleInputChange("salaryMax", e.target.value)}
                  />
                </div>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{language === "ar" ? "آخر موعد للتقديم" : "Application Deadline"}</label>
                  <Input
                    type="date"
                    value={formData.applicationDeadline}
                    onChange={(e) => handleInputChange("applicationDeadline", e.target.value)}
                  />
                </div>
              </div>
            </section>

            <section className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
              <p className="text-sm text-gray-500">
                {language === "ar"
                  ? "تحقق من البيانات قبل النشر."
                  : "Review details before publishing."}
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
