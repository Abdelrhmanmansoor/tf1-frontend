import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',

  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/verify-email-notice',
  '/register-success',
  '/delivery-suspended',
  '/about',
  '/contact',
  '/blog',
  '/jobs',
  '/privacy',
  '/terms',
  '/matches',
  '/matches/login',
  '/matches/register',
  '/matches/verify-email',
]

const DASHBOARD_ROUTES = ['/dashboard']
const MATCHES_DASHBOARD_ROUTES = ['/matches/dashboard', '/matches/create', '/matches/join']

const ROLE_ROUTE_MAP: Record<string, string[]> = {
  player: ['/dashboard/player', '/dashboard/notifications'],
  coach: ['/dashboard/coach', '/dashboard/notifications'],
  club: ['/dashboard/club', '/dashboard/notifications'],
  specialist: ['/dashboard/specialist', '/dashboard/notifications'],
  administrator: ['/dashboard/administrator', '/dashboard/notifications'],
  'age-group-supervisor': [
    '/dashboard/age-group-supervisor',
    '/dashboard/notifications',
  ],
  'sports-director': ['/dashboard/sports-director', '/dashboard/notifications'],
  'executive-director': [
    '/dashboard/executive-director',
    '/dashboard/notifications',
  ],
  secretary: ['/dashboard/secretary', '/dashboard/notifications'],
  'sports-administrator': ['/dashboard/sports-admin', '/dashboard/notifications'],
  team: ['/dashboard/team', '/dashboard/notifications'],
}

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) =>
      pathname === route ||
      pathname.startsWith('/api/') ||
      pathname.startsWith('/_next/') ||
      pathname.includes('.')
  )
}

function isDashboardRoute(pathname: string): boolean {
  return DASHBOARD_ROUTES.some((route) => pathname.startsWith(route))
}

function isMatchesDashboardRoute(pathname: string): boolean {
  return MATCHES_DASHBOARD_ROUTES.some((route) => pathname.startsWith(route))
}

function parseJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

function isTokenExpired(token: string): boolean {
  const payload = parseJWT(token)
  if (!payload || !payload.exp) return false
  const currentTime = Math.floor(Date.now() / 1000)
  return payload.exp < currentTime
}

function getRoleFromToken(token: string): string | null {
  const payload = parseJWT(token)
  return payload?.role || null
}

function canAccessRoute(role: string, pathname: string): boolean {
  const allowedRoutes = ROLE_ROUTE_MAP[role] || []
  return allowedRoutes.some((route) => pathname.startsWith(route))
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if website is suspended pending client delivery acceptance
  const isSuspended = process.env.DELIVERY_SUSPENDED === 'true'
  const isSuspensionPage = pathname === '/delivery-suspended'

  if (isSuspended && !isSuspensionPage) {
    return NextResponse.redirect(new URL('/delivery-suspended', request.url))
  }

  if (!isSuspended && isSuspensionPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Skip auth check for public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  // For matches dashboard routes, check matches_token
  if (isMatchesDashboardRoute(pathname)) {
    let token = request.cookies.get('matches_token')?.value

    // Fallback: Check sportx_access_token (for backward compatibility during transition)
    // TODO: Remove this fallback after backend migration is complete (Target: Q1 2026)
    // This temporary fallback allows gradual migration without breaking existing users
    if (!token) {
      token = request.cookies.get('sportx_access_token')?.value
    }

    // No token found - redirect to matches login
    if (!token) {
      const loginUrl = new URL('/matches/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      loginUrl.searchParams.set('reason', 'no_session')
      return NextResponse.redirect(loginUrl)
    }

    // Check if token is expired
    if (isTokenExpired(token)) {
      const loginUrl = new URL('/matches/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      loginUrl.searchParams.set('reason', 'session_expired')

      // Clear the expired cookie
      const response = NextResponse.redirect(loginUrl)
      response.cookies.delete('matches_token')
      response.cookies.delete('sportx_access_token')
      return response
    }

    return NextResponse.next()
  }

  // For dashboard routes, check authentication via cookie or header
  if (isDashboardRoute(pathname)) {
    // Try to get token from cookie first (more secure)
    let token = request.cookies.get('sportx_access_token')?.value

    // Fallback: Check Authorization header
    if (!token) {
      const authHeader = request.headers.get('authorization')
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7)
      }
    }

    // No token found - redirect to appropriate login
    if (!token) {
      // For regular dashboard, redirect to regular login
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      loginUrl.searchParams.set('reason', 'no_session')
      return NextResponse.redirect(loginUrl)
    }

    // Check if token is expired
    if (isTokenExpired(token)) {
      // For regular dashboard
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      loginUrl.searchParams.set('reason', 'session_expired')

      // Clear the expired cookie
      const response = NextResponse.redirect(loginUrl)
      response.cookies.delete('sportx_access_token')
      return response
    }

    // Get role from token and check access (only for regular dashboard)
    const role = getRoleFromToken(token)
    if (
      role &&
      pathname !== '/dashboard' &&
      pathname !== '/dashboard/notifications'
    ) {
      if (!canAccessRoute(role, pathname)) {
        // Redirect to user's correct dashboard
        const correctDashboard = ROLE_ROUTE_MAP[role]?.[0] || '/dashboard'
        return NextResponse.redirect(new URL(correctDashboard, request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher:
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.ico).*)',
}
