'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useAdminKeys, useCreateAdminKey, useRevokeAdminKey } from '@/hooks/use-admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
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
import { cn } from '@/lib/utils'
import {
  Key,
  Plus,
  RefreshCw,
  Trash2,
  Copy,
  Check,
  Eye,
  EyeOff,
  Shield,
  Clock,
  AlertTriangle,
} from 'lucide-react'
import type { AdminKey } from '@/services/admin.service'

export default function AdminKeysPage() {
  const { language } = useLanguage()
  const isRTL = language === 'ar'

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false)
  const [selectedKey, setSelectedKey] = useState<AdminKey | null>(null)
  const [newKeyName, setNewKeyName] = useState('')
  const [showKeys, setShowKeys] = useState<Set<string>>(new Set())
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // Queries & Mutations
  const { data: adminKeys, isLoading, refetch } = useAdminKeys()
  const createKey = useCreateAdminKey()
  const revokeKey = useRevokeAdminKey()

  // Mock data
  const mockKeys: AdminKey[] = [
    { id: '1', name: 'Production API Key', key: 'ak_prod_xxxxxxxxxxxxxxxxxxxx', permissions: ['read', 'write', 'admin'], createdAt: '2024-01-01T10:00:00Z', lastUsed: '2024-01-20T15:30:00Z', isActive: true },
    { id: '2', name: 'Development Key', key: 'ak_dev_yyyyyyyyyyyyyyyyyy', permissions: ['read', 'write'], createdAt: '2024-01-10T14:00:00Z', lastUsed: '2024-01-19T12:00:00Z', isActive: true },
    { id: '3', name: 'Read-only Key', key: 'ak_ro_zzzzzzzzzzzzzzzzzz', permissions: ['read'], createdAt: '2024-01-15T09:00:00Z', expiresAt: '2024-06-15T09:00:00Z', isActive: true },
    { id: '4', name: 'Old Key (Revoked)', key: 'ak_old_aaaaaaaaaaaaaaaaaa', permissions: ['read', 'write'], createdAt: '2023-06-01T10:00:00Z', isActive: false },
  ]

  const keys = adminKeys || mockKeys

  // Toggle key visibility
  const toggleKeyVisibility = (id: string) => {
    const newShowKeys = new Set(showKeys)
    if (newShowKeys.has(id)) {
      newShowKeys.delete(id)
    } else {
      newShowKeys.add(id)
    }
    setShowKeys(newShowKeys)
  }

  // Copy key to clipboard
  const copyToClipboard = (key: string, id: string) => {
    navigator.clipboard.writeText(key)
    setCopiedKey(id)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  // Mask key
  const maskKey = (key: string) => {
    return key.substring(0, 10) + '••••••••••••••'
  }

  // Handle create
  const handleCreate = () => {
    createKey.mutate({ name: newKeyName, permissions: ['read', 'write'] })
    setNewKeyName('')
    setCreateDialogOpen(false)
  }

  // Handle revoke
  const handleRevoke = () => {
    if (selectedKey) {
      revokeKey.mutate(selectedKey.id)
      setRevokeDialogOpen(false)
      setSelectedKey(null)
    }
  }

  // Get permission badge
  const getPermissionBadge = (permission: string) => {
    const config: Record<string, { label: string; className: string }> = {
      read: { label: isRTL ? 'قراءة' : 'Read', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
      write: { label: isRTL ? 'كتابة' : 'Write', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
      admin: { label: isRTL ? 'مدير' : 'Admin', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
    }
    const { label, className } = config[permission] || { label: permission, className: '' }
    return <Badge key={permission} variant="secondary" className={className}>{label}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isRTL ? 'مفاتيح API' : 'API Keys'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isRTL 
              ? 'إدارة مفاتيح الوصول للنظام'
              : 'Manage system access keys'
            }
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 me-2" />
            {isRTL ? 'تحديث' : 'Refresh'}
          </Button>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 me-2" />
            {isRTL ? 'مفتاح جديد' : 'New Key'}
          </Button>
        </div>
      </div>

      {/* Warning Card */}
      <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-yellow-600 shrink-0" />
            <div>
              <h3 className="font-medium text-yellow-800 dark:text-yellow-200">
                {isRTL ? 'تحذير أمني' : 'Security Warning'}
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                {isRTL 
                  ? 'لا تشارك مفاتيح API الخاصة بك مع أي شخص. المفاتيح تمنح وصولاً كاملاً للنظام.'
                  : 'Never share your API keys with anyone. Keys grant full system access.'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keys List */}
      <Card>
        <CardHeader>
          <CardTitle>{isRTL ? 'المفاتيح النشطة' : 'Active Keys'}</CardTitle>
          <CardDescription>
            {isRTL ? 'قائمة مفاتيح الوصول للنظام' : 'List of system access keys'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : keys.length === 0 ? (
            <div className="text-center py-12">
              <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {isRTL ? 'لا توجد مفاتيح' : 'No keys found'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {keys.map((key) => (
                <div
                  key={key.id}
                  className={cn(
                    "p-4 rounded-lg border transition-colors",
                    key.isActive ? "hover:bg-muted/50" : "bg-muted/30 opacity-75"
                  )}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Key className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium">{key.name}</span>
                        {!key.isActive && (
                          <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                            {isRTL ? 'ملغي' : 'Revoked'}
                          </Badge>
                        )}
                      </div>
                      
                      {/* Key Value */}
                      <div className="flex items-center gap-2 font-mono text-sm bg-muted rounded-lg p-2">
                        <span>{showKeys.has(key.id) ? key.key : maskKey(key.key)}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => toggleKeyVisibility(key.id)}
                        >
                          {showKeys.has(key.id) ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(key.key, key.id)}
                        >
                          {copiedKey === key.id ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                        </Button>
                      </div>

                      {/* Permissions */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {key.permissions.map(getPermissionBadge)}
                      </div>

                      {/* Metadata */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {isRTL ? 'أُنشئ:' : 'Created:'} {new Date(key.createdAt).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                        </span>
                        {key.lastUsed && (
                          <span>
                            {isRTL ? 'آخر استخدام:' : 'Last used:'} {new Date(key.lastUsed).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                          </span>
                        )}
                        {key.expiresAt && (
                          <span className="text-yellow-600">
                            {isRTL ? 'ينتهي:' : 'Expires:'} {new Date(key.expiresAt).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    {key.isActive && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedKey(key)
                          setRevokeDialogOpen(true)
                        }}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 me-2" />
                        {isRTL ? 'إلغاء' : 'Revoke'}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isRTL ? 'إنشاء مفتاح جديد' : 'Create New Key'}</DialogTitle>
            <DialogDescription>
              {isRTL 
                ? 'أنشئ مفتاح API جديد للوصول للنظام'
                : 'Create a new API key for system access'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {isRTL ? 'اسم المفتاح' : 'Key Name'}
              </label>
              <Input
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder={isRTL ? 'مثال: مفتاح الإنتاج' : 'e.g., Production API Key'}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              {isRTL ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button onClick={handleCreate} disabled={!newKeyName || createKey.isPending}>
              {isRTL ? 'إنشاء' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke Dialog */}
      <AlertDialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isRTL ? 'تأكيد الإلغاء' : 'Confirm Revocation'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isRTL 
                ? `هل أنت متأكد من إلغاء المفتاح "${selectedKey?.name}"؟ لن يمكن استخدامه بعد الإلغاء.`
                : `Are you sure you want to revoke "${selectedKey?.name}"? It will no longer be usable.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{isRTL ? 'إلغاء' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction onClick={handleRevoke} className="bg-destructive hover:bg-destructive/90">
              {isRTL ? 'إلغاء المفتاح' : 'Revoke Key'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
