'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function MatchesDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const pathname = usePathname()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // ✅ 2. جارد الحماية (Matches Route Guard)
        const checkAuth = () => {
            // ✅ البحث عن التوكن الخاص بالمباريات تحديداً
            const token = localStorage.getItem('matches_token')

            if (!token) {
                // ❌ لا يوجد توكن -> توجيه لصفحة الدخول مع السبب
                const loginUrl = `/matches/login?redirect=${encodeURIComponent(pathname)}&reason=no_session`
                router.push(loginUrl)
                return
            }

            // ✅ يوجد توكن -> السماح بالمرور
            setIsLoading(false)
        }

        checkAuth()
    }, [router, pathname])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    <p className="text-gray-500 text-sm">جاري التحقق من الجلسة...</p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
