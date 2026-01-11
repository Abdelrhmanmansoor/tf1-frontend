import { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { jwtVerify } from 'jose'

const encoder = new TextEncoder()

async function getVerifiedSession() {
  const token = cookies().get('sportx_access_token')?.value
  const secret = process.env.JWT_ACCESS_SECRET
  if (!token || !secret) return null
  try {
    const { payload } = await jwtVerify(token, encoder.encode(secret), {
      issuer: 'sportsplatform-api',
    })
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
