'use client'

import { useSearchParams } from 'next/navigation'
import JobPublisherDashboard from '@/components/dashboards/JobPublisherDashboard'

export default function JobPublisherDashboardPage() {
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get('defaultTab') || 'overview'

  return (
    <JobPublisherDashboard defaultTab={defaultTab} />
  )
}

