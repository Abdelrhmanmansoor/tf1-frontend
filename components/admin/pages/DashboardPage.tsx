'use client'

import { useLanguage } from '@/contexts/language-context'
import { useAdminOverview } from '@/hooks/use-admin'
import { StatsCard, StatsGrid } from '../StatsCard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Users,
  FileText,
  Image,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
} from 'lucide-react'

export function DashboardPage() {
  const { language } = useLanguage()
  const isRTL = language === 'ar'
  const { data: overview, isLoading, error } = useAdminOverview()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.RelativeTimeFormat(isRTL ? 'ar' : 'en', { numeric: 'auto' }).format(
      Math.round((date.getTime() - Date.now()) / (1000 * 60)),
      'minute'
    )
  }

  // Mock data for demonstration when API is not available
  const mockOverview = {
    totalUsers: 1250,
    activeUsers: 890,
    totalPosts: 456,
    publishedPosts: 320,
    totalMedia: 1890,
    storageUsed: '4.2 GB',
    recentActivity: [
      { id: '1', action: 'user_registered', description: 'مستخدم جديد سجل في المنصة', userName: 'أحمد محمد', userRole: 'applicant', timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), status: 'success' as const, userId: '1' },
      { id: '2', action: 'post_created', description: 'تم إنشاء منشور جديد', userName: 'سارة علي', userRole: 'employer', timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), status: 'info' as const, userId: '2' },
      { id: '3', action: 'login_failed', description: 'محاولة تسجيل دخول فاشلة', userName: 'مجهول', userRole: 'unknown', timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), status: 'warning' as const, userId: '3' },
      { id: '4', action: 'backup_completed', description: 'اكتمل النسخ الاحتياطي', userName: 'النظام', userRole: 'system', timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(), status: 'success' as const, userId: '4' },
    ],
    userGrowth: [],
    postStats: [],
  }

  const data = overview || mockOverview

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isRTL ? 'لوحة التحكم' : 'Dashboard'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {isRTL 
            ? 'نظرة عامة على إحصائيات المنصة والنشاط الأخير'
            : 'Overview of platform statistics and recent activity'
          }
        </p>
      </div>

      {/* Stats Cards */}
      <StatsGrid columns={4}>
        <StatsCard
          title={isRTL ? 'إجمالي المستخدمين' : 'Total Users'}
          value={data.totalUsers.toLocaleString()}
          icon={Users}
          variant="primary"
          trend={{
            value: 12,
            label: isRTL ? 'من الشهر الماضي' : 'from last month',
            isPositive: true,
          }}
          isLoading={isLoading}
        />
        <StatsCard
          title={isRTL ? 'المستخدمين النشطين' : 'Active Users'}
          value={data.activeUsers.toLocaleString()}
          icon={Activity}
          variant="success"
          trend={{
            value: 8,
            label: isRTL ? 'من الأسبوع الماضي' : 'from last week',
            isPositive: true,
          }}
          isLoading={isLoading}
        />
        <StatsCard
          title={isRTL ? 'المنشورات' : 'Posts'}
          value={data.totalPosts.toLocaleString()}
          icon={FileText}
          variant="warning"
          description={isRTL ? `${data.publishedPosts} منشور منشور` : `${data.publishedPosts} published`}
          isLoading={isLoading}
        />
        <StatsCard
          title={isRTL ? 'ملفات الوسائط' : 'Media Files'}
          value={data.totalMedia.toLocaleString()}
          icon={Image}
          variant="default"
          description={isRTL ? `المساحة المستخدمة: ${data.storageUsed}` : `Storage used: ${data.storageUsed}`}
          isLoading={isLoading}
        />
      </StatsGrid>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {isRTL ? 'النشاط الأخير' : 'Recent Activity'}
            </CardTitle>
            <CardDescription>
              {isRTL ? 'آخر الأحداث في المنصة' : 'Latest events on the platform'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {data.recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="mt-1">
                        {getStatusIcon(activity.status)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">
                          {activity.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{activity.userName}</span>
                          <span>•</span>
                          <span>{formatDate(activity.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {isRTL ? 'إحصائيات سريعة' : 'Quick Stats'}
            </CardTitle>
            <CardDescription>
              {isRTL ? 'ملخص الأداء' : 'Performance summary'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* User Types */}
              <div>
                <h4 className="text-sm font-medium mb-3">
                  {isRTL ? 'توزيع المستخدمين' : 'User Distribution'}
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {isRTL ? 'باحثين عن عمل' : 'Job Seekers'}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full w-[65%] bg-primary rounded-full" />
                      </div>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {isRTL ? 'أصحاب عمل' : 'Employers'}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full w-[25%] bg-green-500 rounded-full" />
                      </div>
                      <span className="text-sm font-medium">25%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {isRTL ? 'مديرين' : 'Admins'}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full w-[10%] bg-purple-500 rounded-full" />
                      </div>
                      <span className="text-sm font-medium">10%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Post Status */}
              <div>
                <h4 className="text-sm font-medium mb-3">
                  {isRTL ? 'حالة المنشورات' : 'Post Status'}
                </h4>
                <div className="flex gap-4">
                  <div className="flex-1 p-3 rounded-lg bg-green-50 dark:bg-green-950/30">
                    <p className="text-2xl font-bold text-green-600">{data.publishedPosts}</p>
                    <p className="text-xs text-green-600/80">
                      {isRTL ? 'منشور' : 'Published'}
                    </p>
                  </div>
                  <div className="flex-1 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/30">
                    <p className="text-2xl font-bold text-yellow-600">
                      {data.totalPosts - data.publishedPosts}
                    </p>
                    <p className="text-xs text-yellow-600/80">
                      {isRTL ? 'مسودة' : 'Draft'}
                    </p>
                  </div>
                </div>
              </div>

              {/* System Health */}
              <div>
                <h4 className="text-sm font-medium mb-3">
                  {isRTL ? 'صحة النظام' : 'System Health'}
                </h4>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm text-muted-foreground">
                    {isRTL ? 'جميع الأنظمة تعمل بشكل طبيعي' : 'All systems operational'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage
