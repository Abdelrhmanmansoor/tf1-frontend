'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useAdminLogs, useExportLogs } from '@/hooks/use-admin'
import { DataTable, Column } from '../DataTable'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  Download,
  Filter,
  Calendar,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  Activity,
  User,
  Shield,
  FileText,
  Settings,
  LogIn,
  LogOut,
  Trash2,
  Edit,
  Plus,
} from 'lucide-react'
import type { ActivityLog } from '@/services/admin.service'

export function LogsPage() {
  const { language } = useLanguage()
  const isRTL = language === 'ar'

  // State
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Queries & Mutations
  const { data: logsData, isLoading, refetch } = useAdminLogs({
    page,
    limit: pageSize,
    search,
    action: actionFilter || undefined,
    status: statusFilter || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  })

  const exportLogs = useExportLogs()

  // Mock data
  const mockLogs: ActivityLog[] = [
    { id: '1', action: 'user_login', description: 'تسجيل دخول ناجح', userId: '1', userName: 'أحمد محمد', userRole: 'admin', timestamp: '2024-01-20T15:30:00Z', status: 'success', ipAddress: '192.168.1.100' },
    { id: '2', action: 'user_created', description: 'إنشاء مستخدم جديد', userId: '1', userName: 'أحمد محمد', userRole: 'admin', timestamp: '2024-01-20T14:00:00Z', status: 'success', resource: 'users', resourceId: '123' },
    { id: '3', action: 'login_failed', description: 'محاولة تسجيل دخول فاشلة', userId: '0', userName: 'مجهول', userRole: 'unknown', timestamp: '2024-01-20T13:45:00Z', status: 'warning', ipAddress: '10.0.0.50' },
    { id: '4', action: 'post_published', description: 'نشر مقال جديد', userId: '2', userName: 'سارة علي', userRole: 'editor', timestamp: '2024-01-20T12:00:00Z', status: 'success', resource: 'posts', resourceId: '456' },
    { id: '5', action: 'settings_updated', description: 'تحديث إعدادات النظام', userId: '1', userName: 'أحمد محمد', userRole: 'admin', timestamp: '2024-01-20T11:30:00Z', status: 'info' },
    { id: '6', action: 'user_deleted', description: 'حذف مستخدم', userId: '1', userName: 'أحمد محمد', userRole: 'admin', timestamp: '2024-01-20T10:00:00Z', status: 'warning', resource: 'users', resourceId: '789' },
    { id: '7', action: 'backup_failed', description: 'فشل في إنشاء نسخة احتياطية', userId: '0', userName: 'النظام', userRole: 'system', timestamp: '2024-01-20T09:00:00Z', status: 'error' },
    { id: '8', action: 'user_logout', description: 'تسجيل خروج', userId: '3', userName: 'عمر خالد', userRole: 'user', timestamp: '2024-01-20T08:00:00Z', status: 'info' },
  ]

  const logs = logsData?.data || mockLogs
  const totalItems = logsData?.total || mockLogs.length

  // Get action icon
  const getActionIcon = (action: string) => {
    if (action.includes('login')) return LogIn
    if (action.includes('logout')) return LogOut
    if (action.includes('user')) return User
    if (action.includes('post')) return FileText
    if (action.includes('settings')) return Settings
    if (action.includes('delete')) return Trash2
    if (action.includes('create') || action.includes('new')) return Plus
    if (action.includes('update') || action.includes('edit')) return Edit
    return Activity
  }

  // Get status badge
  const getStatusBadge = (status: ActivityLog['status']) => {
    const config = {
      success: { 
        icon: CheckCircle, 
        label: isRTL ? 'نجاح' : 'Success', 
        className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
      },
      warning: { 
        icon: AlertTriangle, 
        label: isRTL ? 'تحذير' : 'Warning', 
        className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' 
      },
      error: { 
        icon: XCircle, 
        label: isRTL ? 'خطأ' : 'Error', 
        className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
      },
      info: { 
        icon: Info, 
        label: isRTL ? 'معلومات' : 'Info', 
        className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
      },
    }
    const { icon: Icon, label, className } = config[status]
    return (
      <Badge variant="secondary" className={cn("gap-1", className)}>
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    )
  }

  // Get action label
  const getActionLabel = (action: string) => {
    const actions: Record<string, { ar: string; en: string }> = {
      user_login: { ar: 'تسجيل دخول', en: 'User Login' },
      user_logout: { ar: 'تسجيل خروج', en: 'User Logout' },
      user_created: { ar: 'إنشاء مستخدم', en: 'User Created' },
      user_updated: { ar: 'تحديث مستخدم', en: 'User Updated' },
      user_deleted: { ar: 'حذف مستخدم', en: 'User Deleted' },
      login_failed: { ar: 'فشل تسجيل الدخول', en: 'Login Failed' },
      post_created: { ar: 'إنشاء منشور', en: 'Post Created' },
      post_published: { ar: 'نشر منشور', en: 'Post Published' },
      post_deleted: { ar: 'حذف منشور', en: 'Post Deleted' },
      settings_updated: { ar: 'تحديث الإعدادات', en: 'Settings Updated' },
      backup_created: { ar: 'إنشاء نسخة احتياطية', en: 'Backup Created' },
      backup_failed: { ar: 'فشل النسخ الاحتياطي', en: 'Backup Failed' },
    }
    return actions[action]?.[isRTL ? 'ar' : 'en'] || action
  }

  // Table columns
  const columns: Column<ActivityLog>[] = [
    {
      key: 'timestamp',
      header: 'Time',
      headerAr: 'الوقت',
      cell: (row) => {
        const date = new Date(row.timestamp)
        return (
          <div className="text-sm">
            <p>{date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}</p>
            <p className="text-muted-foreground">{date.toLocaleTimeString(isRTL ? 'ar-SA' : 'en-US')}</p>
          </div>
        )
      },
      sortable: true,
    },
    {
      key: 'action',
      header: 'Action',
      headerAr: 'الإجراء',
      cell: (row) => {
        const Icon = getActionIcon(row.action)
        return (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
              <Icon className="h-4 w-4" />
            </div>
            <span className="font-medium">{getActionLabel(row.action)}</span>
          </div>
        )
      },
      sortable: true,
    },
    {
      key: 'description',
      header: 'Description',
      headerAr: 'الوصف',
      cell: (row) => (
        <span className="text-sm text-muted-foreground">{row.description}</span>
      ),
    },
    {
      key: 'userName',
      header: 'User',
      headerAr: 'المستخدم',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">{row.userName}</p>
            <p className="text-xs text-muted-foreground">{row.userRole}</p>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      headerAr: 'الحالة',
      cell: (row) => getStatusBadge(row.status),
      sortable: true,
    },
    {
      key: 'ipAddress',
      header: 'IP Address',
      headerAr: 'عنوان IP',
      cell: (row) => (
        <span className="text-sm font-mono text-muted-foreground">
          {row.ipAddress || '-'}
        </span>
      ),
    },
  ]

  // Stats
  const stats = {
    total: logs.length,
    success: logs.filter(l => l.status === 'success').length,
    warning: logs.filter(l => l.status === 'warning').length,
    error: logs.filter(l => l.status === 'error').length,
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isRTL ? 'سجل النشاط' : 'Activity Logs'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isRTL 
              ? 'تتبع جميع الأنشطة والأحداث في النظام'
              : 'Track all activities and events in the system'
            }
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => exportLogs.mutate({ format: 'csv' })}
          disabled={exportLogs.isPending}
        >
          <Download className="h-4 w-4 me-2" />
          {isRTL ? 'تصدير' : 'Export'}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{isRTL ? 'إجمالي السجلات' : 'Total Logs'}</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{isRTL ? 'ناجح' : 'Success'}</p>
                <p className="text-2xl font-bold text-green-600">{stats.success}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{isRTL ? 'تحذيرات' : 'Warnings'}</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.warning}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{isRTL ? 'أخطاء' : 'Errors'}</p>
                <p className="text-2xl font-bold text-red-600">{stats.error}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 me-2" />
            <SelectValue placeholder={isRTL ? 'الإجراء' : 'Action'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">{isRTL ? 'جميع الإجراءات' : 'All Actions'}</SelectItem>
            <SelectItem value="user_login">{isRTL ? 'تسجيل دخول' : 'Login'}</SelectItem>
            <SelectItem value="user_logout">{isRTL ? 'تسجيل خروج' : 'Logout'}</SelectItem>
            <SelectItem value="user_created">{isRTL ? 'إنشاء مستخدم' : 'User Created'}</SelectItem>
            <SelectItem value="user_deleted">{isRTL ? 'حذف مستخدم' : 'User Deleted'}</SelectItem>
            <SelectItem value="post_published">{isRTL ? 'نشر منشور' : 'Post Published'}</SelectItem>
            <SelectItem value="settings_updated">{isRTL ? 'تحديث الإعدادات' : 'Settings Updated'}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder={isRTL ? 'الحالة' : 'Status'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">{isRTL ? 'الكل' : 'All'}</SelectItem>
            <SelectItem value="success">{isRTL ? 'نجاح' : 'Success'}</SelectItem>
            <SelectItem value="warning">{isRTL ? 'تحذير' : 'Warning'}</SelectItem>
            <SelectItem value="error">{isRTL ? 'خطأ' : 'Error'}</SelectItem>
            <SelectItem value="info">{isRTL ? 'معلومات' : 'Info'}</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-40"
            placeholder={isRTL ? 'من' : 'From'}
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-40"
            placeholder={isRTL ? 'إلى' : 'To'}
          />
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={logs}
        columns={columns}
        isLoading={isLoading}
        totalItems={totalItems}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onSearch={setSearch}
        onRefresh={() => refetch()}
        searchPlaceholder="Search logs..."
        searchPlaceholderAr="البحث في السجلات..."
        emptyMessage="No logs found"
        emptyMessageAr="لم يتم العثور على سجلات"
        getRowId={(row) => row.id}
      />
    </div>
  )
}

export default LogsPage
