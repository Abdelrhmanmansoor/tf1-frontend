import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

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
  leader: ['/dashboard/leader', '/platform-control', '/dashboard/notifications'],
  applicant: ['/dashboard/applicant', '/dashboard/notifications'],
  'job-publisher': ['/dashboard/job-publisher', '/dashboard/notifications'],
}

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname === route)
}

function isDashboardRoute(pathname: string): boolean {
  return DASHBOARD_ROUTES.some((route) => pathname.startsWith(route))
}

function isMatchesDashboardRoute(pathname: string): boolean {
  return MATCHES_DASHBOARD_ROUTES.some((route) => pathname.startsWith(route))
}

async function verifyJwt(token: string, secretEnv: string): Promise<any | null> {
  const secret = process.env[secretEnv]
  if (!secret) {
    console.warn(`[middleware] Missing ${secretEnv}, rejecting token`)
    return null
  }
  try {
    const verified = await jwtVerify(token, new TextEncoder().encode(secret), {
      issuer: 'sportsplatform-api',
    })
    return verified.payload
  } catch (err) {
    console.warn(`[middleware] JWT verification failed: ${String(err)}`)
    return null
  }
}

function canAccessRoute(role: string, pathname: string): boolean {
  const allowedRoutes = ROLE_ROUTE_MAP[role] || []
  return allowedRoutes.some((route) => pathname.startsWith(route))
}

function applySecurityHeaders(response: NextResponse) {
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=()')
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'", 
      "script-src 'self' 'unsafe-inline' https://js.hs-scripts.com", 
      "style-src 'self' 'unsafe-inline'", 
      "img-src 'self' data: https://tf1-backend.onrender.com", 
      "connect-src 'self' https://tf1-backend.onrender.com wss:", 
      "font-src 'self' data:",
      "frame-ancestors 'self'",
      "form-action 'self'",
      "base-uri 'self'",
      'upgrade-insecure-requests',
    ].join('; ')
  )
}

export async function middleware(request: NextRequest) {
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

  // Skip auth check for public routes and framework assets
  if (
    isPublicRoute(pathname) ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp)$/)
  ) {
    const res = NextResponse.next()
    applySecurityHeaders(res)
    return res
  }

  // For matches dashboard routes, check matches_token
  if (isMatchesDashboardRoute(pathname)) {
    const token = request.cookies.get('matches_token')?.value

    // No token found - redirect to matches login
    if (!token) {
      const loginUrl = new URL('/matches/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      loginUrl.searchParams.set('reason', 'no_session')
      return NextResponse.redirect(loginUrl)
    }

    // Verify matches token signature and expiry
    const payload = await verifyJwt(token, 'MATCHES_JWT_SECRET')
    if (!payload) {
      const loginUrl = new URL('/matches/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      loginUrl.searchParams.set('reason', 'invalid_session')

      // Clear the expired cookie
      const response = NextResponse.redirect(loginUrl)
      response.cookies.delete('matches_token')
      return response
    }

    const res = NextResponse.next()
    applySecurityHeaders(res)
    return res
  }

  // For dashboard routes, check authentication via cookie or header
  if (isDashboardRoute(pathname)) {
    // Check both cookie names - backend sets 'accessToken', legacy/client uses 'sportx_access_token'
    const token = request.cookies.get('accessToken')?.value || 
                  request.cookies.get('sportx_access_token')?.value

    // No token found - redirect to appropriate login
    if (!token) {
      console.log('[middleware] No auth token found for dashboard route:', pathname)
      // For regular dashboard, redirect to regular login
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      loginUrl.searchParams.set('reason', 'no_session')
      return NextResponse.redirect(loginUrl)
    }

    // Verify main access token
    const payload = await verifyJwt(token, 'JWT_ACCESS_SECRET')
    if (!payload) {
      // For regular dashboard invalid/expired session
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      loginUrl.searchParams.set('reason', 'invalid_session')

      // Clear the expired cookies (both potential names)
      const response = NextResponse.redirect(loginUrl)
      response.cookies.delete('accessToken')
      response.cookies.delete('sportx_access_token')
      return response
    }

    const role = (payload as any)?.role || null
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

  const res = NextResponse.next()
  applySecurityHeaders(res)
  return res
}

export const config = {
  matcher:
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.ico).*)',
}
