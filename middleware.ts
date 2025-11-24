import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if website is suspended pending client delivery acceptance
  // Default: OFF (website runs normally)
  const isSuspended = process.env.DELIVERY_SUSPENDED === 'true'
  const isSuspensionPage = request.nextUrl.pathname === '/delivery-suspended'

  // If suspended and not on suspension page, redirect to suspension page
  if (isSuspended && !isSuspensionPage) {
    return NextResponse.redirect(new URL('/delivery-suspended', request.url))
  }

  // If not suspended and on suspension page, redirect to home
  if (!isSuspended && isSuspensionPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// Apply middleware to all routes except Next.js internals and static files
export const config = {
  matcher:
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg).*)',
}
