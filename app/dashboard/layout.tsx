import { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { jwtVerify } from 'jose'

const encoder = new TextEncoder()

async function getVerifiedSession() {
  const cookieStore = await cookies()
  // Check both cookie names for compatibility
  const token = cookieStore.get('accessToken')?.value || 
                cookieStore.get('sportx_access_token')?.value
  const secret = process.env.JWT_ACCESS_SECRET
  
  if (!token || !secret) {
    console.warn('[dashboard-layout] No token or secret found', {
      hasToken: !!token,
      hasSecret: !!secret,
      cookieNames: (await cookies()).getAll().map(c => c.name).join(', ')
    })
    return null
  }
  
  try {
    const { payload } = await jwtVerify(token, encoder.encode(secret), {
      issuer: 'sportsplatform-api',
    })
    console.log('[dashboard-layout] Token verified successfully for user:', (payload as any)?.userId)
    return payload
  } catch (err) {
    console.warn(`[dashboard-layout] token rejected: ${String(err)}`)
    return null
  }
}

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getVerifiedSession()
  if (!session) {
    redirect('/login?redirect=%2Fdashboard&reason=no_session')
  }
  return <>{children}</>
}
