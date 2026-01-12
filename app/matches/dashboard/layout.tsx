import { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { jwtVerify } from 'jose'

const encoder = new TextEncoder()

async function getVerifiedMatchesSession() {
    const cookieStore = await cookies()
    const token = cookieStore.get('matches_token')?.value
    const secret = process.env.MATCHES_JWT_SECRET
    if (!token || !secret) return null
    try {
        const { payload } = await jwtVerify(token, encoder.encode(secret), {
            issuer: 'sportsplatform-api',
        })
        return payload
    } catch (err) {
        console.warn(`[matches-dashboard] token rejected: ${String(err)}`)
        return null
    }
}

export default async function MatchesDashboardLayout({ children }: { children: ReactNode }) {
    const session = await getVerifiedMatchesSession()
    if (!session) {
        redirect('/matches/login?redirect=%2Fmatches%2Fdashboard&reason=no_session')
    }
    return <>{children}</>
}
