'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useAdminUsers, useDeleteUser, useSuspendUser, useActivateUser } from '@/hooks/use-admin'
import { DataTable, Column } from '../DataTable'
import { UserActions, StatusBadge, RoleBadge } from '../UserActions'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UserPlus, Filter } from 'lucide-react'
import type { User } from '@/services/admin.service'

export function UsersPage() {
  const { language } = useLanguage()
  const isRTL = language === 'ar'

  // State
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  // Queries & Mutations
  const { data: usersData, isLoading, refetch } = useAdminUsers({
    page,
    limit: pageSize,
    search,
    role: roleFilter || undefined,
    status: statusFilter || undefined,
    sortBy,
    sortOrder,
  })

  const deleteUser = useDeleteUser()
  const suspendUser = useSuspendUser()
  const activateUser = useActivateUser()

  // Mock data for demonstration
  const mockUsers: User[] = [
    { id: '1', email: 'ahmed@example.com', name: 'أحمد محمد', role: 'applicant', status: 'active', createdAt: '2024-01-15T10:00:00Z', lastLogin: '2024-01-20T15:30:00Z' },
    { id: '2', email: 'sara@example.com', name: 'سارة علي', role: 'employer', status: 'active', createdAt: '2024-01-10T08:00:00Z', lastLogin: '2024-01-19T12:00:00Z' },
    { id: '3', email: 'omar@example.com', name: 'عمر خالد', role: 'applicant', status: 'suspended', createdAt: '2024-01-05T14:00:00Z', lastLogin: '2024-01-18T09:00:00Z' },
    { id: '4', email: 'fatima@example.com', name: 'فاطمة أحمد', role: 'moderator', status: 'active', createdAt: '2024-01-01T11:00:00Z', lastLogin: '2024-01-20T16:00:00Z' },
    { id: '5', email: 'khalid@example.com', name: 'خالد عبدالله', role: 'admin', status: 'active', createdAt: '2023-12-20T09:00:00Z', lastLogin: '2024-01-20T17:00:00Z' },
  ]

  const users = usersData?.data || mockUsers
  const totalItems = usersData?.total || mockUsers.length

  // Table columns
  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'User',
      headerAr: 'المستخدم',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={row.avatar} alt={row.name} />
            <AvatarFallback className="text-xs">
              {row.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'role',
      header: 'Role',
      headerAr: 'الدور',
      cell: (row) => <RoleBadge role={row.role} />,
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      headerAr: 'الحالة',
      cell: (row) => <StatusBadge status={row.status} />,
      sortable: true,
    },
    {
      key: 'createdAt',
      header: 'Joined',
      headerAr: 'تاريخ التسجيل',
      cell: (row) => (
        <span className="text-sm text-muted-foreground">
          {new Date(row.createdAt).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'lastLogin',
      header: 'Last Login',
      headerAr: 'آخر دخول',
      cell: (row) => (
        <span className="text-sm text-muted-foreground">
          {row.lastLogin 
            ? new Date(row.lastLogin).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')
            : isRTL ? 'لم يسجل دخول' : 'Never'
          }
        </span>
      ),
      sortable: true,
    },
  ]

  // Handlers
  const handleView = (user: User) => {
    setSelectedUser(user)
    setViewDialogOpen(true)
  }

  const handleEdit = (user: User) => {
    // Navigate to edit page or open edit dialog
    console.log('Edit user:', user)
  }

  const handleDelete = (user: User) => {
    deleteUser.mutate(user.id)
  }

  const handleSuspend = (user: User, reason?: string) => {
    suspendUser.mutate({ id: user.id, reason })
  }

  const handleActivate = (user: User) => {
    activateUser.mutate(user.id)
  }

  const handleSort = (key: string, order: 'asc' | 'desc') => {
    setSortBy(key)
    setSortOrder(order)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isRTL ? 'إدارة المستخدمين' : 'User Management'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isRTL 
              ? 'عرض وإدارة جميع المستخدمين المسجلين'
              : 'View and manage all registered users'
            }
          </p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 me-2" />
          {isRTL ? 'إضافة مستخدم' : 'Add User'}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 me-2" />
            <SelectValue placeholder={isRTL ? 'الدور' : 'Role'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">{isRTL ? 'جميع الأدوار' : 'All Roles'}</SelectItem>
            <SelectItem value="admin">{isRTL ? 'مدير' : 'Admin'}</SelectItem>
            <SelectItem value="moderator">{isRTL ? 'مشرف' : 'Moderator'}</SelectItem>
            <SelectItem value="employer">{isRTL ? 'صاحب عمل' : 'Employer'}</SelectItem>
            <SelectItem value="applicant">{isRTL ? 'متقدم' : 'Applicant'}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder={isRTL ? 'الحالة' : 'Status'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">{isRTL ? 'جميع الحالات' : 'All Status'}</SelectItem>
            <SelectItem value="active">{isRTL ? 'نشط' : 'Active'}</SelectItem>
            <SelectItem value="inactive">{isRTL ? 'غير نشط' : 'Inactive'}</SelectItem>
            <SelectItem value="suspended">{isRTL ? 'معلق' : 'Suspended'}</SelectItem>
            <SelectItem value="pending">{isRTL ? 'قيد الانتظار' : 'Pending'}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Data Table */}
      <DataTable
        data={users}
        columns={columns}
        isLoading={isLoading}
        totalItems={totalItems}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onSearch={setSearch}
        onSort={handleSort}
        onRefresh={() => refetch()}
        searchPlaceholder="Search users..."
        searchPlaceholderAr="البحث عن مستخدمين..."
        selectable
        emptyMessage="No users found"
        emptyMessageAr="لم يتم العثور على مستخدمين"
        getRowId={(row) => row.id}
        actions={(row) => (
          <UserActions
            user={row}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSuspend={handleSuspend}
            onActivate={handleActivate}
          />
        )}
      />

      {/* View User Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isRTL ? 'تفاصيل المستخدم' : 'User Details'}
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.avatar} />
                  <AvatarFallback className="text-lg">
                    {selectedUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-xs text-muted-foreground">{isRTL ? 'الدور' : 'Role'}</p>
                  <RoleBadge role={selectedUser.role} className="mt-1" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{isRTL ? 'الحالة' : 'Status'}</p>
                  <StatusBadge status={selectedUser.status} className="mt-1" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{isRTL ? 'تاريخ التسجيل' : 'Joined'}</p>
                  <p className="text-sm font-medium mt-1">
                    {new Date(selectedUser.createdAt).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{isRTL ? 'آخر دخول' : 'Last Login'}</p>
                  <p className="text-sm font-medium mt-1">
                    {selectedUser.lastLogin 
                      ? new Date(selectedUser.lastLogin).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')
                      : isRTL ? 'لم يسجل دخول' : 'Never'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UsersPage
