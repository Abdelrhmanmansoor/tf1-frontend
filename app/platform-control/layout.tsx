import { Metadata } from 'next'
import { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { jwtVerify } from 'jose'

export const metadata: Metadata = {
    title: 'Platform Control | TF1 Sports Platform',
    description: 'Restricted Access Only',
    robots: 'noindex, nofollow',
}

const encoder = new TextEncoder()

async function getSession() {
    const cookieStore = await cookies()
    const token = cookieStore.get('sportx_access_token')?.value
    const secret = process.env.JWT_ACCESS_SECRET
    if (!token || !secret) return null
    try {
        const { payload } = await jwtVerify(token, encoder.encode(secret), {
            issuer: 'sportsplatform-api',
        })
        return payload
    } catch (err) {
        console.warn(`[platform-control] token rejected: ${String(err)}`)
        return null
    }
}

export default async function PlatformControlLayout({ children }: { children: ReactNode }) {
    const session = await getSession()
    const role = (session as any)?.role
    if (!session || role !== 'leader') {
        redirect('/login?redirect=%2Fplatform-control&reason=forbidden')
    }
    return <div className="min-h-screen bg-gray-900 text-white">{children}</div>
}
