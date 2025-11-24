'use client'

import { useState, useEffect } from 'react'
import {
  searchOpportunities,
  OpportunitySearchParams,
  Opportunity,
} from '@/services/opportunities'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/contexts/auth-context'
import OpportunityCard from './OpportunityCard'
import OpportunityFilters from './OpportunityFilters'
import { motion } from 'framer-motion'
import { Loader2, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const OpportunitiesPage = () => {
  const { language } = useLanguage()
  const { user } = useAuth()
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  const [totalOpportunities, setTotalOpportunities] = useState(0)

  const [filters, setFilters] = useState<OpportunitySearchParams>({
    page: 1,
    limit: 20,
    sortBy: 'date',
  })

  // Fetch opportunities whenever filters change
  useEffect(() => {
    fetchOpportunities()
  }, [filters])

  const fetchOpportunities = async () => {
    setLoading(true)
    try {
      const response = await searchOpportunities(filters)
      setOpportunities(response.results)
      setTotalPages(response.pages)
      setTotalOpportunities(response.total)
    } catch (error: any) {
      console.error('Failed to fetch opportunities:', error)
      // TODO: Show error toast/notification
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters: Partial<OpportunitySearchParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Get role-specific heading
  const getPageHeading = () => {
    switch (user?.role) {
      case 'player':
        return language === 'ar' ? 'فرص اللاعبين' : 'Player Opportunities'
      case 'coach':
        return language === 'ar' ? 'فرص التدريب' : 'Coaching Opportunities'
      case 'specialist':
        return language === 'ar' ? 'فرص المتخصصين' : 'Specialist Opportunities'
      case 'club':
        return language === 'ar' ? 'جميع الفرص' : 'All Opportunities'
      default:
        return language === 'ar' ? 'الفرص' : 'Opportunities'
    }
  }

  const getEmptyStateMessage = () => {
    switch (user?.role) {
      case 'player':
        return language === 'ar'
          ? 'لا توجد فرص للاعبين متاحة حالياً'
          : 'No player opportunities available right now'
      case 'coach':
        return language === 'ar'
          ? 'لا توجد فرص تدريب متاحة حالياً'
          : 'No coaching opportunities available right now'
      case 'specialist':
        return language === 'ar'
          ? 'لا توجد فرص للمتخصصين متاحة حالياً'
          : 'No specialist opportunities available right now'
      default:
        return language === 'ar'
          ? 'لا توجد فرص متاحة حالياً'
          : 'No opportunities available right now'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            {language === 'ar' ? 'العودة للوحة التحكم' : 'Back to Dashboard'}
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {getPageHeading()}
          </h1>
          <p className="text-gray-600">
            {totalOpportunities}{' '}
            {language === 'ar'
              ? totalOpportunities === 1
                ? 'فرصة متاحة'
                : 'فرص متاحة'
              : totalOpportunities === 1
                ? 'opportunity available'
                : 'opportunities available'}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <OpportunityFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Opportunities List */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">
                    {language === 'ar'
                      ? 'جاري تحميل الفرص...'
                      : 'Loading opportunities...'}
                  </p>
                </div>
              </div>
            ) : opportunities.length > 0 ? (
              <>
                {/* Opportunities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {opportunities.map((opportunity, index) => (
                    <motion.div
                      key={opportunity._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <OpportunityCard opportunity={opportunity} />
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      onClick={() => handlePageChange((filters.page || 1) - 1)}
                      disabled={filters.page === 1}
                      variant="outline"
                      size="sm"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      {language === 'ar' ? 'السابق' : 'Previous'}
                    </Button>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((page) => {
                          const currentPage = filters.page || 1
                          return (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          )
                        })
                        .map((page, index, array) => (
                          <div key={page} className="flex items-center">
                            {index > 0 && array[index - 1] !== page - 1 && (
                              <span className="px-2 text-gray-400">...</span>
                            )}
                            <Button
                              onClick={() => handlePageChange(page)}
                              variant={
                                filters.page === page ? 'default' : 'outline'
                              }
                              size="sm"
                              className="min-w-[40px]"
                            >
                              {page}
                            </Button>
                          </div>
                        ))}
                    </div>

                    <Button
                      onClick={() => handlePageChange((filters.page || 1) + 1)}
                      disabled={filters.page === totalPages}
                      variant="outline"
                      size="sm"
                    >
                      {language === 'ar' ? 'التالي' : 'Next'}
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-gray-200 p-12 text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {getEmptyStateMessage()}
                </h3>
                <p className="text-gray-600 mb-6">
                  {language === 'ar'
                    ? 'جرب تعديل الفلاتر أو تحقق مرة أخرى لاحقاً'
                    : 'Try adjusting your filters or check back later'}
                </p>
                <Button onClick={() => handleFilterChange({})}>
                  {language === 'ar' ? 'مسح الفلاتر' : 'Clear Filters'}
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OpportunitiesPage
