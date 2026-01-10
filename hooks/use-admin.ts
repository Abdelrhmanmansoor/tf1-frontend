'use client'

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
import { adminService, AdminOverview, User, Post, MediaFile, ActivityLog, AdminSettings, Backup, AdminKey, PaginatedResponse } from '@/services/admin.service'
import { toast } from 'sonner'

// Query Keys
export const adminQueryKeys = {
  all: ['admin'] as const,
  overview: () => [...adminQueryKeys.all, 'overview'] as const,
  users: (params?: Record<string, unknown>) => [...adminQueryKeys.all, 'users', params] as const,
  user: (id: string) => [...adminQueryKeys.all, 'users', id] as const,
  posts: (params?: Record<string, unknown>) => [...adminQueryKeys.all, 'posts', params] as const,
  post: (id: string) => [...adminQueryKeys.all, 'posts', id] as const,
  media: (params?: Record<string, unknown>) => [...adminQueryKeys.all, 'media', params] as const,
  logs: (params?: Record<string, unknown>) => [...adminQueryKeys.all, 'logs', params] as const,
  settings: () => [...adminQueryKeys.all, 'settings'] as const,
  backups: () => [...adminQueryKeys.all, 'backups'] as const,
  adminKeys: () => [...adminQueryKeys.all, 'admin-keys'] as const,
}

// =====================
// Overview Hooks
// =====================
export function useAdminOverview(options?: Omit<UseQueryOptions<AdminOverview, Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: adminQueryKeys.overview(),
    queryFn: () => adminService.getOverview(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  })
}

// =====================
// Users Hooks
// =====================
export function useAdminUsers(params?: {
  page?: number
  limit?: number
  search?: string
  role?: string
  status?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}) {
  return useQuery({
    queryKey: adminQueryKeys.users(params),
    queryFn: () => adminService.getUsers(params),
    staleTime: 1000 * 60 * 2,
  })
}

export function useAdminUser(id: string) {
  return useQuery({
    queryKey: adminQueryKeys.user(id),
    queryFn: () => adminService.getUserById(id),
    enabled: !!id,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: Partial<User> & { password: string }) => adminService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.users() })
      toast.success('تم إنشاء المستخدم بنجاح')
    },
    onError: (error: Error) => {
      toast.error(`فشل في إنشاء المستخدم: ${error.message}`)
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) => adminService.updateUser(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.users() })
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.user(id) })
      toast.success('تم تحديث المستخدم بنجاح')
    },
    onError: (error: Error) => {
      toast.error(`فشل في تحديث المستخدم: ${error.message}`)
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => adminService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.users() })
      toast.success('تم حذف المستخدم بنجاح')
    },
    onError: (error: Error) => {
      toast.error(`فشل في حذف المستخدم: ${error.message}`)
    },
  })
}

export function useSuspendUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => adminService.suspendUser(id, reason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.users() })
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.user(id) })
      toast.success('تم تعليق المستخدم بنجاح')
    },
    onError: (error: Error) => {
      toast.error(`فشل في تعليق المستخدم: ${error.message}`)
    },
  })
}

export function useActivateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => adminService.activateUser(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.users() })
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.user(id) })
      toast.success('تم تفعيل المستخدم بنجاح')
    },
    onError: (error: Error) => {
      toast.error(`فشل في تفعيل المستخدم: ${error.message}`)
    },
  })
}

// =====================
// Posts Hooks
// =====================
export function useAdminPosts(params?: {
  page?: number
  limit?: number
  search?: string
  status?: string
  category?: string
  authorId?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}) {
  return useQuery({
    queryKey: adminQueryKeys.posts(params),
    queryFn: () => adminService.getPosts(params),
    staleTime: 1000 * 60 * 2,
  })
}

export function useAdminPost(id: string) {
  return useQuery({
    queryKey: adminQueryKeys.post(id),
    queryFn: () => adminService.getPostById(id),
    enabled: !!id,
  })
}

export function useCreatePost() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: Partial<Post>) => adminService.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.posts() })
      toast.success('تم إنشاء المنشور بنجاح')
    },
    onError: (error: Error) => {
      toast.error(`فشل في إنشاء المنشور: ${error.message}`)
    },
  })
}

export function useUpdatePost() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Post> }) => adminService.updatePost(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.posts() })
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.post(id) })
      toast.success('تم تحديث المنشور بنجاح')
    },
    onError: (error: Error) => {
      toast.error(`فشل في تحديث المنشور: ${error.message}`)
    },
  })
}

export function useDeletePost() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => adminService.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.posts() })
      toast.success('تم حذف المنشور بنجاح')
    },
    onError: (error: Error) => {
      toast.error(`فشل في حذف المنشور: ${error.message}`)
    },
  })
}

export function usePublishPost() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => adminService.publishPost(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.posts() })
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.post(id) })
      toast.success('تم نشر المنشور بنجاح')
    },
    onError: (error: Error) => {
      toast.error(`فشل في نشر المنشور: ${error.message}`)
    },
  })
}

export function useArchivePost() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => adminService.archivePost(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.posts() })
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.post(id) })
      toast.success('تم أرشفة المنشور بنجاح')
    },
    onError: (error: Error) => {
      toast.error(`فشل في أرشفة المنشور: ${error.message}`)
    },
  })
}

// =====================
// Media Hooks
// =====================
export function useAdminMedia(params?: {
  page?: number
  limit?: number
  search?: string
  type?: string
  folder?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}) {
  return useQuery({
    queryKey: adminQueryKeys.media(params),
    queryFn: () => adminService.getMedia(params),
    staleTime: 1000 * 60 * 2,
  })
}

export function useUploadMedia() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ file, folder }: { file: File; folder?: string }) => adminService.uploadMedia(file, folder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.media() })
      toast.success('تم رفع الملف بنجاح')
    },
    onError: (error: Error) => {
      toast.error(`فشل في رفع الملف: ${error.message}`)
    },
  })
}

export function useDeleteMedia() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => adminService.deleteMedia(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.media() })
      toast.success('تم حذف الملف بنجاح')
    },
    onError: (error: Error) => {
      toast.error(`فشل في حذف الملف: ${error.message}`)
    },
  })
}

export function useBulkDeleteMedia() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (ids: string[]) => adminService.bulkDeleteMedia(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.media() })
      toast.success('تم حذف الملفات بنجاح')
    },
    onError: (error: Error) => {
      toast.error(`فشل في حذف الملفات: ${error.message}`)
    },
  })
}

// =====================
// Logs Hooks
// =====================
export function useAdminLogs(params?: {
  page?: number
  limit?: number
  search?: string
  action?: string
  userId?: string
  status?: string
  startDate?: string
  endDate?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}) {
  return useQuery({
    queryKey: adminQueryKeys.logs(params),
    queryFn: () => adminService.getLogs(params),
    staleTime: 1000 * 60,
  })
}

export function useExportLogs() {
  return useMutation({
    mutationFn: (params?: { startDate?: string; endDate?: string; format?: 'csv' | 'json' }) => 
      adminService.exportLogs(params),
    onSuccess: (blob, params) => {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `logs-${new Date().toISOString().split('T')[0]}.${params?.format || 'csv'}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('تم تصدير السجلات بنجاح')
    },
    onError: (error: Error) => {
      toast.error(`فشل في تصدير السجلات: ${error.message}`)
    },
  })
}

// =====================
// Settings Hooks
// =====================
export function useAdminSettings() {
  return useQuery({
    queryKey: adminQueryKeys.settings(),
    queryFn: () => adminService.getSettings(),
    staleTime: 1000 * 60 * 10,
  })
}

export function useUpdateSettings() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: Partial<AdminSettings>) => adminService.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.settings() })
      toast.success('تم تحديث الإعدادات بنجاح')
    },
    onError: (error: Error) => {
      toast.error(`فشل في تحديث الإعدادات: ${error.message}`)
    },
  })
}

export function useTestEmailSettings() {
  return useMutation({
    mutationFn: () => adminService.testEmailSettings(),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message || 'تم إرسال البريد التجريبي بنجاح')
      } else {
        toast.error(result.message || 'فشل في إرسال البريد التجريبي')
      }
    },
    onError: (error: Error) => {
      toast.error(`فشل في اختبار إعدادات البريد: ${error.message}`)
    },
  })
}

// =====================
// Backups Hooks
// =====================
export function useAdminBackups() {
  return useQuery({
    queryKey: adminQueryKeys.backups(),
    queryFn: () => adminService.getBackups(),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateBackup() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (type: 'full' | 'partial' | 'database') => adminService.createBackup(type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.backups() })
      toast.success('بدأ إنشاء النسخة الاحتياطية')
    },
    onError: (error: Error) => {
      toast.error(`فشل في إنشاء النسخة الاحتياطية: ${error.message}`)
    },
  })
}

export function useDeleteBackup() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => adminService.deleteBackup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.backups() })
      toast.success('تم حذف النسخة الاحتياطية')
    },
    onError: (error: Error) => {
      toast.error(`فشل في حذف النسخة الاحتياطية: ${error.message}`)
    },
  })
}

export function useRestoreBackup() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => adminService.restoreBackup(id),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.all })
      toast.success(result.message || 'تم استعادة النسخة الاحتياطية بنجاح')
    },
    onError: (error: Error) => {
      toast.error(`فشل في استعادة النسخة الاحتياطية: ${error.message}`)
    },
  })
}

// =====================
// Admin Keys Hooks
// =====================
export function useAdminKeys() {
  return useQuery({
    queryKey: adminQueryKeys.adminKeys(),
    queryFn: () => adminService.getAdminKeys(),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateAdminKey() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: { name: string; permissions: string[]; expiresAt?: string }) => 
      adminService.createAdminKey(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.adminKeys() })
      toast.success('تم إنشاء مفتاح المدير بنجاح')
    },
    onError: (error: Error) => {
      toast.error(`فشل في إنشاء مفتاح المدير: ${error.message}`)
    },
  })
}

export function useRevokeAdminKey() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => adminService.revokeAdminKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.adminKeys() })
      toast.success('تم إلغاء مفتاح المدير')
    },
    onError: (error: Error) => {
      toast.error(`فشل في إلغاء مفتاح المدير: ${error.message}`)
    },
  })
}
