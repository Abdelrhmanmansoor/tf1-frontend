'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useAdminPosts, useDeletePost, usePublishPost, useArchivePost } from '@/hooks/use-admin'
import { DataTable, Column } from '../DataTable'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Send,
  Archive,
  ExternalLink,
  Filter,
} from 'lucide-react'
import type { Post } from '@/services/admin.service'

export function PostsPage() {
  const { language } = useLanguage()
  const isRTL = language === 'ar'

  // State
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')

  // Queries & Mutations
  const { data: postsData, isLoading, refetch } = useAdminPosts({
    page,
    limit: pageSize,
    search,
    status: statusFilter || undefined,
    category: categoryFilter || undefined,
  })

  const deletePost = useDeletePost()
  const publishPost = usePublishPost()
  const archivePost = useArchivePost()

  // Mock data
  const mockPosts: Post[] = [
    { id: '1', title: 'كيف تبني سيرة ذاتية احترافية', content: '', author: 'أحمد محمد', authorId: '1', status: 'published', createdAt: '2024-01-18T10:00:00Z', updatedAt: '2024-01-18T10:00:00Z', views: 1250, likes: 89, category: 'career' },
    { id: '2', title: 'أفضل 10 نصائح للمقابلات الوظيفية', content: '', author: 'سارة علي', authorId: '2', status: 'published', createdAt: '2024-01-15T14:00:00Z', updatedAt: '2024-01-15T14:00:00Z', views: 890, likes: 56, category: 'tips' },
    { id: '3', title: 'دليل شامل للتقديم على الوظائف', content: '', author: 'عمر خالد', authorId: '3', status: 'draft', createdAt: '2024-01-12T09:00:00Z', updatedAt: '2024-01-12T09:00:00Z', views: 0, likes: 0, category: 'guide' },
    { id: '4', title: 'مهارات القرن الحادي والعشرين', content: '', author: 'فاطمة أحمد', authorId: '4', status: 'archived', createdAt: '2024-01-05T11:00:00Z', updatedAt: '2024-01-10T16:00:00Z', views: 2100, likes: 145, category: 'skills' },
  ]

  const posts = postsData?.data || mockPosts
  const totalItems = postsData?.total || mockPosts.length

  // Status badge
  const getStatusBadge = (status: Post['status']) => {
    const config = {
      published: { label: isRTL ? 'منشور' : 'Published', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
      draft: { label: isRTL ? 'مسودة' : 'Draft', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
      archived: { label: isRTL ? 'مؤرشف' : 'Archived', className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' },
    }
    const { label, className } = config[status]
    return <Badge variant="secondary" className={className}>{label}</Badge>
  }

  // Category badge
  const getCategoryLabel = (category: string) => {
    const categories: Record<string, { ar: string; en: string }> = {
      career: { ar: 'مسار مهني', en: 'Career' },
      tips: { ar: 'نصائح', en: 'Tips' },
      guide: { ar: 'دليل', en: 'Guide' },
      skills: { ar: 'مهارات', en: 'Skills' },
      news: { ar: 'أخبار', en: 'News' },
    }
    return categories[category]?.[isRTL ? 'ar' : 'en'] || category
  }

  // Table columns
  const columns: Column<Post>[] = [
    {
      key: 'title',
      header: 'Title',
      headerAr: 'العنوان',
      cell: (row) => (
        <div className="max-w-md">
          <p className="font-medium truncate">{row.title}</p>
          <p className="text-xs text-muted-foreground">
            {isRTL ? 'بواسطة' : 'by'} {row.author}
          </p>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'category',
      header: 'Category',
      headerAr: 'التصنيف',
      cell: (row) => (
        <Badge variant="outline">{getCategoryLabel(row.category)}</Badge>
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
      key: 'views',
      header: 'Views',
      headerAr: 'المشاهدات',
      cell: (row) => (
        <span className="text-sm">{row.views.toLocaleString()}</span>
      ),
      sortable: true,
    },
    {
      key: 'likes',
      header: 'Likes',
      headerAr: 'الإعجابات',
      cell: (row) => (
        <span className="text-sm">{row.likes.toLocaleString()}</span>
      ),
      sortable: true,
    },
    {
      key: 'createdAt',
      header: 'Created',
      headerAr: 'تاريخ الإنشاء',
      cell: (row) => (
        <span className="text-sm text-muted-foreground">
          {new Date(row.createdAt).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
        </span>
      ),
      sortable: true,
    },
  ]

  // Actions
  const renderActions = (post: Post) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRTL ? "start" : "end"}>
        <DropdownMenuItem>
          <Eye className="h-4 w-4 me-2" />
          {isRTL ? 'معاينة' : 'Preview'}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Pencil className="h-4 w-4 me-2" />
          {isRTL ? 'تعديل' : 'Edit'}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ExternalLink className="h-4 w-4 me-2" />
          {isRTL ? 'عرض في الموقع' : 'View on Site'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {post.status === 'draft' && (
          <DropdownMenuItem 
            onClick={() => publishPost.mutate(post.id)}
            className="text-green-600"
          >
            <Send className="h-4 w-4 me-2" />
            {isRTL ? 'نشر' : 'Publish'}
          </DropdownMenuItem>
        )}
        {post.status === 'published' && (
          <DropdownMenuItem 
            onClick={() => archivePost.mutate(post.id)}
            className="text-yellow-600"
          >
            <Archive className="h-4 w-4 me-2" />
            {isRTL ? 'أرشفة' : 'Archive'}
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => deletePost.mutate(post.id)}
          className="text-destructive"
        >
          <Trash2 className="h-4 w-4 me-2" />
          {isRTL ? 'حذف' : 'Delete'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isRTL ? 'إدارة المنشورات' : 'Post Management'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isRTL 
              ? 'إنشاء وتحرير ونشر المقالات والمنشورات'
              : 'Create, edit, and publish articles and posts'
            }
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 me-2" />
          {isRTL ? 'منشور جديد' : 'New Post'}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 me-2" />
            <SelectValue placeholder={isRTL ? 'الحالة' : 'Status'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">{isRTL ? 'جميع الحالات' : 'All Status'}</SelectItem>
            <SelectItem value="published">{isRTL ? 'منشور' : 'Published'}</SelectItem>
            <SelectItem value="draft">{isRTL ? 'مسودة' : 'Draft'}</SelectItem>
            <SelectItem value="archived">{isRTL ? 'مؤرشف' : 'Archived'}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder={isRTL ? 'التصنيف' : 'Category'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">{isRTL ? 'جميع التصنيفات' : 'All Categories'}</SelectItem>
            <SelectItem value="career">{isRTL ? 'مسار مهني' : 'Career'}</SelectItem>
            <SelectItem value="tips">{isRTL ? 'نصائح' : 'Tips'}</SelectItem>
            <SelectItem value="guide">{isRTL ? 'دليل' : 'Guide'}</SelectItem>
            <SelectItem value="skills">{isRTL ? 'مهارات' : 'Skills'}</SelectItem>
            <SelectItem value="news">{isRTL ? 'أخبار' : 'News'}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Data Table */}
      <DataTable
        data={posts}
        columns={columns}
        isLoading={isLoading}
        totalItems={totalItems}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onSearch={setSearch}
        onRefresh={() => refetch()}
        searchPlaceholder="Search posts..."
        searchPlaceholderAr="البحث في المنشورات..."
        selectable
        emptyMessage="No posts found"
        emptyMessageAr="لم يتم العثور على منشورات"
        getRowId={(row) => row.id}
        actions={renderActions}
      />
    </div>
  )
}

export default PostsPage
