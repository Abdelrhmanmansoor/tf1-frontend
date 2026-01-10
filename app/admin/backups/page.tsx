'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useAdminBackups, useCreateBackup, useDeleteBackup, useRestoreBackup } from '@/hooks/use-admin'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import {
  Database,
  Download,
  MoreVertical,
  Plus,
  RefreshCw,
  Trash2,
  Upload,
  HardDrive,
  Clock,
  CheckCircle,
  AlertTriangle,
  Loader2,
} from 'lucide-react'
import type { Backup } from '@/services/admin.service'

export default function BackupsPage() {
  const { language } = useLanguage()
  const isRTL = language === 'ar'

  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false)
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null)

  // Queries & Mutations
  const { data: backups, isLoading, refetch } = useAdminBackups()
  const createBackup = useCreateBackup()
  const deleteBackup = useDeleteBackup()
  const restoreBackup = useRestoreBackup()

  // Mock data
  const mockBackups: Backup[] = [
    { id: '1', name: 'backup-2024-01-20-full', size: 1500000000, createdAt: '2024-01-20T03:00:00Z', type: 'full', status: 'completed' },
    { id: '2', name: 'backup-2024-01-19-database', size: 250000000, createdAt: '2024-01-19T03:00:00Z', type: 'database', status: 'completed' },
    { id: '3', name: 'backup-2024-01-18-full', size: 1450000000, createdAt: '2024-01-18T03:00:00Z', type: 'full', status: 'completed' },
    { id: '4', name: 'backup-2024-01-17-partial', size: 500000000, createdAt: '2024-01-17T03:00:00Z', type: 'partial', status: 'failed' },
    { id: '5', name: 'backup-2024-01-20-new', size: 0, createdAt: '2024-01-20T10:00:00Z', type: 'full', status: 'pending' },
  ]

  const backupList = backups || mockBackups

  // Format size
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '-'
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
  }

  // Get status badge
  const getStatusBadge = (status: Backup['status']) => {
    const config = {
      completed: { 
        icon: CheckCircle, 
        label: isRTL ? 'مكتمل' : 'Completed', 
        className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
      },
      pending: { 
        icon: Loader2, 
        label: isRTL ? 'جاري...' : 'In Progress', 
        className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
      },
      failed: { 
        icon: AlertTriangle, 
        label: isRTL ? 'فشل' : 'Failed', 
        className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
      },
    }
    const { icon: Icon, label, className } = config[status]
    return (
      <Badge variant="secondary" className={cn("gap-1", className)}>
        <Icon className={cn("h-3 w-3", status === 'pending' && "animate-spin")} />
        {label}
      </Badge>
    )
  }

  // Get type badge
  const getTypeBadge = (type: Backup['type']) => {
    const labels = {
      full: isRTL ? 'كامل' : 'Full',
      partial: isRTL ? 'جزئي' : 'Partial',
      database: isRTL ? 'قاعدة البيانات' : 'Database',
    }
    return <Badge variant="outline">{labels[type]}</Badge>
  }

  // Handle restore
  const handleRestore = () => {
    if (selectedBackup) {
      restoreBackup.mutate(selectedBackup.id)
      setRestoreDialogOpen(false)
      setSelectedBackup(null)
    }
  }

  // Stats
  const completedBackups = backupList.filter(b => b.status === 'completed')
  const totalSize = completedBackups.reduce((acc, b) => acc + b.size, 0)
  const lastBackup = completedBackups[0]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isRTL ? 'النسخ الاحتياطي' : 'Backups'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isRTL 
              ? 'إدارة النسخ الاحتياطية للنظام'
              : 'Manage system backups'
            }
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 me-2" />
            {isRTL ? 'تحديث' : 'Refresh'}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button disabled={createBackup.isPending}>
                <Plus className="h-4 w-4 me-2" />
                {isRTL ? 'نسخة جديدة' : 'New Backup'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRTL ? "start" : "end"}>
              <DropdownMenuItem onClick={() => createBackup.mutate('full')}>
                <Database className="h-4 w-4 me-2" />
                {isRTL ? 'نسخة كاملة' : 'Full Backup'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => createBackup.mutate('database')}>
                <HardDrive className="h-4 w-4 me-2" />
                {isRTL ? 'قاعدة البيانات فقط' : 'Database Only'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => createBackup.mutate('partial')}>
                <Download className="h-4 w-4 me-2" />
                {isRTL ? 'نسخة جزئية' : 'Partial Backup'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? 'إجمالي النسخ' : 'Total Backups'}
                </p>
                <p className="text-2xl font-bold">{completedBackups.length}</p>
              </div>
              <Database className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? 'المساحة المستخدمة' : 'Storage Used'}
                </p>
                <p className="text-2xl font-bold">{formatSize(totalSize)}</p>
              </div>
              <HardDrive className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? 'آخر نسخة' : 'Last Backup'}
                </p>
                <p className="text-2xl font-bold">
                  {lastBackup 
                    ? new Date(lastBackup.createdAt).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')
                    : '-'
                  }
                </p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Backups List */}
      <Card>
        <CardHeader>
          <CardTitle>{isRTL ? 'قائمة النسخ الاحتياطية' : 'Backup List'}</CardTitle>
          <CardDescription>
            {isRTL ? 'جميع النسخ الاحتياطية المتاحة' : 'All available backups'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : backupList.length === 0 ? (
            <div className="text-center py-12">
              <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {isRTL ? 'لا توجد نسخ احتياطية' : 'No backups found'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {backupList.map((backup) => (
                <div
                  key={backup.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Database className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{backup.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{formatSize(backup.size)}</span>
                        <span>•</span>
                        <span>{new Date(backup.createdAt).toLocaleString(isRTL ? 'ar-SA' : 'en-US')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getTypeBadge(backup.type)}
                    {getStatusBadge(backup.status)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={backup.status !== 'completed'}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align={isRTL ? "start" : "end"}>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 me-2" />
                          {isRTL ? 'تحميل' : 'Download'}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedBackup(backup)
                            setRestoreDialogOpen(true)
                          }}
                        >
                          <Upload className="h-4 w-4 me-2" />
                          {isRTL ? 'استعادة' : 'Restore'}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => deleteBackup.mutate(backup.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 me-2" />
                          {isRTL ? 'حذف' : 'Delete'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Restore Dialog */}
      <AlertDialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isRTL ? 'تأكيد الاستعادة' : 'Confirm Restore'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isRTL 
                ? 'هل أنت متأكد من استعادة هذه النسخة الاحتياطية؟ سيتم استبدال جميع البيانات الحالية.'
                : 'Are you sure you want to restore this backup? All current data will be replaced.'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{isRTL ? 'إلغاء' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction onClick={handleRestore}>
              {isRTL ? 'استعادة' : 'Restore'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
