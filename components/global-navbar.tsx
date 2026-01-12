'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/navbar'

export function GlobalNavbar() {
  const pathname = usePathname()

  // Don't render global navbar on home page because LandingPage component has its own
  if (pathname === '/') {
    return null
  }

  // You might also want to exclude it from dashboard if dashboard has its own sidebar/header structure
  // if (pathname?.startsWith('/dashboard')) {
  //   return null
  // }

  return <Navbar />
}
