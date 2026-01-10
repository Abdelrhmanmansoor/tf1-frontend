'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Ban,
  CheckCircle,
  Mail,
  Key,
  Shield,
  UserCog,
  Copy,
  ExternalLink,
} from 'lucide-react'
import type { User } from '@/services/admin.service'

interface UserActionsProps {
  user: User
  onView?: (user: User) => void
  onEdit?: (user: User) => void
  onDelete?: (user: User) => void
  onSuspend?: (user: User, reason?: string) => void
  onActivate?: (user: User) => void
  onResetPassword?: (user: User) => void
  onChangeRole?: (user: User, role: string) => void
  onSendEmail?: (user: User) => void
}

export function UserActions({
  user,
  onView,
  onEdit,
  onDelete,
  onSuspend,
  onActivate,
  onResetPassword,
  onChangeRole,
  onSendEmail,
}: UserActionsProps) {
  const { language } = useLanguage()
  const isRTL = language === 'ar'

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [suspendReason, setSuspendReason] = useState('')

  const handleDelete = () => {
    onDelete?.(user)
    setDeleteDialogOpen(false)
  }

  const handleSuspend = () => {
    onSuspend?.(user, suspendReason)
    setSuspendDialogOpen(false)
    setSuspendReason('')
  }

  const isActive = user.status === 'active'
  const isSuspended = user.status === 'suspended'

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-48">
          <DropdownMenuLabel>
            {isRTL ? 'إجراءات' : 'Actions'}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* View */}
          {onView && (
            <DropdownMenuItem onClick={() => onView(user)}>
              <Eye className="h-4 w-4 me-2" />
              {isRTL ? 'عرض التفاصيل' : 'View Details'}
            </DropdownMenuItem>
          )}

          {/* Edit */}
          {onEdit && (
            <DropdownMenuItem onClick={() => onEdit(user)}>
              <Pencil className="h-4 w-4 me-2" />
              {isRTL ? 'تعديل' : 'Edit'}
            </DropdownMenuItem>
          )}

          {/* Send Email */}
          {onSendEmail && (
            <DropdownMenuItem onClick={() => onSendEmail(user)}>
              <Mail className="h-4 w-4 me-2" />
              {isRTL ? 'إرسال بريد' : 'Send Email'}
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          {/* Reset Password */}
          {onResetPassword && (
            <DropdownMenuItem onClick={() => onResetPassword(user)}>
              <Key className="h-4 w-4 me-2" />
              {isRTL ? 'إعادة تعيين كلمة المرور' : 'Reset Password'}
            </DropdownMenuItem>
          )}

          {/* Suspend/Activate */}
          {isActive && onSuspend && (
            <DropdownMenuItem 
              onClick={() => setSuspendDialogOpen(true)}
              className="text-yellow-600 focus:text-yellow-600"
            >
              <Ban className="h-4 w-4 me-2" />
              {isRTL ? 'تعليق الحساب' : 'Suspend Account'}
            </DropdownMenuItem>
          )}

          {isSuspended && onActivate && (
            <DropdownMenuItem 
              onClick={() => onActivate(user)}
              className="text-green-600 focus:text-green-600"
            >
              <CheckCircle className="h-4 w-4 me-2" />
              {isRTL ? 'تفعيل الحساب' : 'Activate Account'}
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          {/* Delete */}
          {onDelete && (
            <DropdownMenuItem 
              onClick={() => setDeleteDialogOpen(true)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 me-2" />
              {isRTL ? 'حذف' : 'Delete'}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isRTL ? 'تأكيد الحذف' : 'Confirm Delete'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isRTL 
                ? `هل أنت متأكد من حذف المستخدم "${user.name}"؟ هذا الإجراء لا يمكن التراجع عنه.`
                : `Are you sure you want to delete user "${user.name}"? This action cannot be undone.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {isRTL ? 'إلغاء' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              {isRTL ? 'حذف' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Suspend Dialog */}
      <Dialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isRTL ? 'تعليق الحساب' : 'Suspend Account'}
            </DialogTitle>
            <DialogDescription>
              {isRTL 
                ? `سيتم تعليق حساب "${user.name}" ولن يتمكن من تسجيل الدخول.`
                : `Account "${user.name}" will be suspended and won't be able to log in.`
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {isRTL ? 'سبب التعليق (اختياري)' : 'Suspension Reason (optional)'}
              </label>
              <Textarea
                placeholder={isRTL ? 'أدخل سبب التعليق...' : 'Enter suspension reason...'}
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuspendDialogOpen(false)}>
              {isRTL ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button onClick={handleSuspend} variant="destructive">
              {isRTL ? 'تعليق' : 'Suspend'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Status Badge Component
interface StatusBadgeProps {
  status: User['status']
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { language } = useLanguage()
  const isRTL = language === 'ar'

  const statusConfig = {
    active: {
      labelAr: 'نشط',
      labelEn: 'Active',
      className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    },
    inactive: {
      labelAr: 'غير نشط',
      labelEn: 'Inactive',
      className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    },
    suspended: {
      labelAr: 'معلق',
      labelEn: 'Suspended',
      className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    },
    pending: {
      labelAr: 'قيد الانتظار',
      labelEn: 'Pending',
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    },
  }

  const config = statusConfig[status] || statusConfig.inactive

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      config.className,
      className
    )}>
      {isRTL ? config.labelAr : config.labelEn}
    </span>
  )
}

// Role Badge Component
interface RoleBadgeProps {
  role: string
  className?: string
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const { language } = useLanguage()
  const isRTL = language === 'ar'

  const roleConfig: Record<string, { labelAr: string; labelEn: string; className: string }> = {
    admin: {
      labelAr: 'مدير',
      labelEn: 'Admin',
      className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    },
    moderator: {
      labelAr: 'مشرف',
      labelEn: 'Moderator',
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    },
    user: {
      labelAr: 'مستخدم',
      labelEn: 'User',
      className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    },
    applicant: {
      labelAr: 'متقدم',
      labelEn: 'Applicant',
      className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    },
    employer: {
      labelAr: 'صاحب عمل',
      labelEn: 'Employer',
      className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    },
  }

  const config = roleConfig[role.toLowerCase()] || {
    labelAr: role,
    labelEn: role,
    className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  }

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      config.className,
      className
    )}>
      {isRTL ? config.labelAr : config.labelEn}
    </span>
  )
}

export default UserActions
