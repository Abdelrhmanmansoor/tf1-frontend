'use client'

import { OpportunitySearchParams } from '@/services/opportunities'
import { useLanguage } from '@/contexts/language-context'
import { Search, X, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface OpportunityFiltersProps {
  filters: OpportunitySearchParams
  onFilterChange: (filters: Partial<OpportunitySearchParams>) => void
}

const OpportunityFilters = ({
  filters,
  onFilterChange,
}: OpportunityFiltersProps) => {
  const { language } = useLanguage()
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const hasActiveFilters = Object.keys(filters).some(
    (key) =>
      key !== 'page' &&
      key !== 'limit' &&
      key !== 'sortBy' &&
      filters[key as keyof OpportunitySearchParams]
  )

  const clearAllFilters = () => {
    onFilterChange({
      q: undefined,
      sport: undefined,
      location: undefined,
      jobType: undefined,
      salaryMin: undefined,
      salaryMax: undefined,
      postedWithin: undefined,
      page: 1,
    })
  }

  const filterContent = (
    <div className="space-y-6">
      {/* Search Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar' ? 'بحث' : 'Search'}
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={
              language === 'ar' ? 'ابحث عن فرص...' : 'Search opportunities...'
            }
            value={filters.q || ''}
            onChange={(e) => onFilterChange({ q: e.target.value || undefined })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Sport Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar' ? 'الرياضة' : 'Sport'}
        </label>
        <select
          value={filters.sport || ''}
          onChange={(e) =>
            onFilterChange({ sport: e.target.value || undefined })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">
            {language === 'ar' ? 'جميع الرياضات' : 'All Sports'}
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
          <option value="volleyball">
            {language === 'ar' ? 'الكرة الطائرة' : 'Volleyball'}
          </option>
          <option value="handball">
            {language === 'ar' ? 'كرة اليد' : 'Handball'}
          </option>
        </select>
      </div>

      {/* Location Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar' ? 'الموقع' : 'Location'}
        </label>
        <input
          type="text"
          placeholder={language === 'ar' ? 'المدينة...' : 'City...'}
          value={filters.location || ''}
          onChange={(e) =>
            onFilterChange({ location: e.target.value || undefined })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Job Type Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar' ? 'نوع الوظيفة' : 'Job Type'}
        </label>
        <select
          value={filters.jobType || ''}
          onChange={(e) =>
            onFilterChange({ jobType: (e.target.value as any) || undefined })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">
            {language === 'ar' ? 'جميع الأنواع' : 'All Types'}
          </option>
          <option value="permanent">
            {language === 'ar' ? 'دائم' : 'Permanent'}
          </option>
          <option value="seasonal">
            {language === 'ar' ? 'موسمي' : 'Seasonal'}
          </option>
          <option value="temporary">
            {language === 'ar' ? 'مؤقت' : 'Temporary'}
          </option>
          <option value="trial">
            {language === 'ar' ? 'تجريبي' : 'Trial'}
          </option>
          <option value="internship">
            {language === 'ar' ? 'تدريب' : 'Internship'}
          </option>
          <option value="volunteer">
            {language === 'ar' ? 'تطوع' : 'Volunteer'}
          </option>
        </select>
      </div>

      {/* Salary Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar' ? 'نطاق الراتب' : 'Salary Range'}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder={language === 'ar' ? 'الحد الأدنى' : 'Min'}
            value={filters.salaryMin || ''}
            onChange={(e) =>
              onFilterChange({
                salaryMin: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="number"
            placeholder={language === 'ar' ? 'الحد الأقصى' : 'Max'}
            value={filters.salaryMax || ''}
            onChange={(e) =>
              onFilterChange({
                salaryMax: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Posted Within */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar' ? 'نُشر خلال' : 'Posted Within'}
        </label>
        <select
          value={filters.postedWithin || ''}
          onChange={(e) =>
            onFilterChange({ postedWithin: e.target.value || undefined })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">{language === 'ar' ? 'أي وقت' : 'Any time'}</option>
          <option value="7d">
            {language === 'ar' ? 'آخر 7 أيام' : 'Last 7 days'}
          </option>
          <option value="14d">
            {language === 'ar' ? 'آخر 14 يوم' : 'Last 14 days'}
          </option>
          <option value="30d">
            {language === 'ar' ? 'آخر 30 يوم' : 'Last 30 days'}
          </option>
        </select>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar' ? 'ترتيب حسب' : 'Sort By'}
        </label>
        <select
          value={filters.sortBy || 'date'}
          onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="date">
            {language === 'ar' ? 'الأحدث' : 'Most Recent'}
          </option>
          <option value="salary_high">
            {language === 'ar' ? 'أعلى راتب' : 'Highest Salary'}
          </option>
          <option value="salary_low">
            {language === 'ar' ? 'أقل راتب' : 'Lowest Salary'}
          </option>
          <option value="deadline">
            {language === 'ar'
              ? 'الموعد النهائي (الأقرب)'
              : 'Deadline (Soonest)'}
          </option>
        </select>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button
          onClick={clearAllFilters}
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
        >
          <X className="w-4 h-4" />
          {language === 'ar' ? 'مسح الفلاتر' : 'Clear All Filters'}
        </Button>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <Button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full flex items-center justify-center gap-2"
        >
          <Filter className="w-4 h-4" />
          {language === 'ar' ? 'الفلاتر' : 'Filters'}
          {hasActiveFilters && (
            <span className="ml-2 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              !
            </span>
          )}
        </Button>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:block bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">
            {language === 'ar' ? 'الفلاتر' : 'Filters'}
          </h3>
          {hasActiveFilters && (
            <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
              {language === 'ar' ? 'نشط' : 'Active'}
            </span>
          )}
        </div>
        {filterContent}
      </div>

      {/* Mobile Filters Drawer */}
      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50">
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-white p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                {language === 'ar' ? 'الفلاتر' : 'Filters'}
              </h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {filterContent}
          </div>
        </div>
      )}
    </>
  )
}

export default OpportunityFilters
