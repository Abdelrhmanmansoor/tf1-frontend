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
  // CRITICAL FIX: Handle missing JWT secret gracefully
  const secret = process.env[secretEnv]
  const hasSecret = !!secret

  // Runtime logging: Only log boolean existence, NEVER the actual value
  console.log(`[middleware] ${secretEnv} exists:`, hasSecret)

  if (!hasSecret) {
    console.error(`[middleware] ❌ CRITICAL: ${secretEnv} is not set in environment variables!`)
    console.error(`[middleware] This will cause all authenticated requests to fail.`)
    console.error(`[middleware] Available JWT-related env keys:`,
      Object.keys(process.env)
        .filter(k => k.includes('JWT') || k.includes('SECRET'))
        .join(', ') || 'NONE FOUND'
    )

    // Environment-specific error handling
    if (process.env.NODE_ENV === 'development') {
      // Development: Throw error with instructions
      console.error(`[middleware] 🔧 DEVELOPMENT MODE - Fix required:`)
      console.error(`[middleware] Add this to your .env.local file:`)
      console.error(`[middleware] ${secretEnv}=your-secret-key-here`)
      console.error(`[middleware] Get the value from your backend .env file`)

      // Still return null to trigger redirect with proper reason
      return null
    } else {
      // Production: Log error but handle gracefully
      console.error(`[middleware] 🚨 PRODUCTION ERROR - Environment misconfigured`)
      console.error(`[middleware] Add ${secretEnv} to Vercel Environment Variables:`)
      console.error(`[middleware] 1. Go to: Vercel Dashboard → Settings → Environment Variables`)
      console.error(`[middleware] 2. Add: ${secretEnv}`)
      console.error(`[middleware] 3. Set for: Production, Preview, Development`)
      console.error(`[middleware] 4. Redeploy the application`)

      return null
    }
  }

  // Secret exists, proceed with verification
  console.log(`[middleware] ✓ ${secretEnv} is configured, verifying token...`)

  try {
    const verified = await jwtVerify(token, new TextEncoder().encode(secret), {
      issuer: 'sportsplatform-api',
    })

    const userId = (verified.payload as any)?.userId
    const role = (verified.payload as any)?.role

    console.log(`[middleware] ✅ Token verified successfully`)
    console.log(`[middleware] User ID:`, userId)
    console.log(`[middleware] Role:`, role)

    return verified.payload
  } catch (err) {
    const errorMessage = String(err)
    console.warn(`[middleware] ❌ JWT verification failed:`, errorMessage)

    // Provide specific error feedback
    if (errorMessage.includes('expired')) {
      console.warn(`[middleware] Token has expired - user needs to re-login`)
    } else if (errorMessage.includes('signature')) {
      console.warn(`[middleware] Invalid signature - JWT_ACCESS_SECRET might not match backend`)
    } else if (errorMessage.includes('issuer')) {
      console.warn(`[middleware] Invalid issuer - expected: sportsplatform-api`)
    }

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
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.hs-scripts.com https://js-eu1.hs-scripts.com https://js-eu1.usemessages.com https://js-eu1.hs-banner.com https://js-eu1.hs-analytics.net https://js-eu1.hscollectedforms.net https://vercel.live",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://tf1-backend.onrender.com wss: https://vitals.vercel-insights.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "frame-src 'self' https://vercel.live",
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

  // For dashboard routes, check authentication via cookie
  if (isDashboardRoute(pathname)) {
    // CRITICAL: Check both cookie names - backend sets 'accessToken', legacy/client uses 'sportx_access_token'
    const accessToken = request.cookies.get('accessToken')?.value
    const legacyToken = request.cookies.get('sportx_access_token')?.value
    const token = accessToken || legacyToken

    // Debug: Log all cookies for troubleshooting
    const allCookies = request.cookies.getAll().map(c => c.name).join(', ')
    console.log('[middleware] Dashboard route:', pathname)
    console.log('[middleware] Available cookies:', allCookies || 'NONE')
    console.log('[middleware] accessToken:', accessToken ? 'EXISTS' : 'MISSING')
    console.log('[middleware] sportx_access_token:', legacyToken ? 'EXISTS' : 'MISSING')

    // No token found - redirect to login
    if (!token) {
      console.warn('[middleware] ❌ No auth token found for dashboard route:', pathname)
      console.warn('[middleware] User must login to access this page')

      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      loginUrl.searchParams.set('reason', 'no_session')
      return NextResponse.redirect(loginUrl)
    }

    console.log('[middleware] ✓ Token found, verifying...')

    // Verify main access token
    const payload = await verifyJwt(token, 'JWT_ACCESS_SECRET')

    if (!payload) {
      console.warn('[middleware] ❌ Token verification failed - invalid, expired, or misconfigured')

      // Check if JWT_ACCESS_SECRET is missing (misconfiguration)
      const hasSecret = !!process.env.JWT_ACCESS_SECRET

      // إذا كان السر مفقود، هذه مشكلة في الإعداد وليست مشكلة المستخدم
      if (!hasSecret) {
        console.error('[middleware] 🚨 CRITICAL: JWT_ACCESS_SECRET is not configured!')
        console.error('[middleware] This is a SERVER CONFIGURATION issue, not a user authentication issue')
        console.error('[middleware] User should NOT be logged out - this is a server-side problem')

        // في الإنتاج، نعرض صفحة خطأ بدلاً من تسجيل الخروج القسري
        if (process.env.NODE_ENV === 'production') {
          console.error('[middleware] Redirecting to error page instead of forcing logout')
          return NextResponse.redirect(new URL('/error?code=server_misconfigured', request.url))
        } else {
          // في التطوير، نعرض رسالة واضحة
          console.error('[middleware] 🔧 DEVELOPMENT MODE - Fix required:')
          console.error('[middleware] Add JWT_ACCESS_SECRET to your .env.local file')
          console.error('[middleware] Get the value from your backend .env file')
        }
      }

      const reason = hasSecret ? 'invalid_session' : 'misconfigured_env'

      // Redirect to login with appropriate reason
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      loginUrl.searchParams.set('reason', reason)

      // فقط احذف الـ Cookies إذا كانت المشكلة في التوكن نفسه وليس في إعدادات السيرفر
      const response = NextResponse.redirect(loginUrl)
      if (hasSecret) {
        response.cookies.delete('accessToken')
        response.cookies.delete('sportx_access_token')
      }
      return response
    }

    console.log('[middleware] ✅ Token verified successfully')

    // Check role-based access
    const role = (payload as any)?.role || null
    console.log('[middleware] User role:', role)

    if (
      role &&
      pathname !== '/dashboard' &&
      pathname !== '/dashboard/notifications'
    ) {
      if (!canAccessRoute(role, pathname)) {
        console.warn('[middleware] ⚠️  User role', role, 'cannot access', pathname)

        // Redirect to user's correct dashboard
        const correctDashboard = ROLE_ROUTE_MAP[role]?.[0] || '/dashboard'
        console.log('[middleware] Redirecting to correct dashboard:', correctDashboard)
        return NextResponse.redirect(new URL(correctDashboard, request.url))
      }
    }

    console.log('[middleware] ✅ Access granted to', pathname)
  }

  const res = NextResponse.next()
  applySecurityHeaders(res)
  return res
}

export const config = {
  matcher:
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.ico).*)',
}
