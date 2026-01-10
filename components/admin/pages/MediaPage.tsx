'use client'

import { useState, useCallback } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useAdminMedia, useUploadMedia, useDeleteMedia, useBulkDeleteMedia } from '@/hooks/use-admin'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import {
  Upload,
  Search,
  Grid3X3,
  List,
  Image as ImageIcon,
  Video,
  FileText,
  Music,
  MoreVertical,
  Trash2,
  Download,
  Copy,
  Eye,
  RefreshCw,
  FolderOpen,
  X,
  Check,
} from 'lucide-react'
import type { MediaFile } from '@/services/admin.service'

export function MediaPage() {
  const { language } = useLanguage()
  const isRTL = language === 'ar'

  // State
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [previewFile, setPreviewFile] = useState<MediaFile | null>(null)

  // Queries & Mutations
  const { data: mediaData, isLoading, refetch } = useAdminMedia({
    page,
    limit: pageSize,
    search,
    type: typeFilter || undefined,
  })

  const uploadMedia = useUploadMedia()
  const deleteMedia = useDeleteMedia()
  const bulkDeleteMedia = useBulkDeleteMedia()

  // Mock data
  const mockMedia: MediaFile[] = [
    { id: '1', name: 'logo.png', type: 'image', size: 45000, url: '/images/logo.png', uploadedBy: 'Admin', uploadedAt: '2024-01-15T10:00:00Z' },
    { id: '2', name: 'hero-banner.jpg', type: 'image', size: 250000, url: '/images/hero.jpg', uploadedBy: 'Admin', uploadedAt: '2024-01-14T09:00:00Z' },
    { id: '3', name: 'company-video.mp4', type: 'video', size: 15000000, url: '/videos/company.mp4', uploadedBy: 'Marketing', uploadedAt: '2024-01-10T14:00:00Z' },
    { id: '4', name: 'terms.pdf', type: 'document', size: 120000, url: '/docs/terms.pdf', uploadedBy: 'Legal', uploadedAt: '2024-01-08T11:00:00Z' },
    { id: '5', name: 'podcast-ep1.mp3', type: 'audio', size: 8500000, url: '/audio/podcast.mp3', uploadedBy: 'Content', uploadedAt: '2024-01-05T16:00:00Z' },
    { id: '6', name: 'team-photo.jpg', type: 'image', size: 180000, url: '/images/team.jpg', uploadedBy: 'HR', uploadedAt: '2024-01-03T13:00:00Z' },
  ]

  const media = mediaData?.data || mockMedia
  const totalItems = mediaData?.total || mockMedia.length

  // Get file icon
  const getFileIcon = (type: MediaFile['type']) => {
    switch (type) {
      case 'image': return ImageIcon
      case 'video': return Video
      case 'document': return FileText
      case 'audio': return Music
      default: return FileText
    }
  }

  // Format file size
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
  }

  // Handle file selection
  const toggleFileSelection = (id: string) => {
    const newSelected = new Set(selectedFiles)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedFiles(newSelected)
  }

  // Handle file upload
  const handleFileUpload = useCallback((files: FileList | null) => {
    if (!files) return
    Array.from(files).forEach(file => {
      uploadMedia.mutate({ file })
    })
    setUploadDialogOpen(false)
  }, [uploadMedia])

  // Handle bulk delete
  const handleBulkDelete = () => {
    bulkDeleteMedia.mutate(Array.from(selectedFiles))
    setSelectedFiles(new Set())
  }

  // Handle copy URL
  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isRTL ? 'مكتبة الوسائط' : 'Media Library'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isRTL 
              ? 'إدارة الصور والفيديوهات والملفات'
              : 'Manage images, videos, and files'
            }
          </p>
        </div>
        <Button onClick={() => setUploadDialogOpen(true)}>
          <Upload className="h-4 w-4 me-2" />
          {isRTL ? 'رفع ملف' : 'Upload File'}
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="relative w-64">
            <Search className={cn(
              "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground",
              isRTL ? "right-3" : "left-3"
            )} />
            <Input
              type="search"
              placeholder={isRTL ? 'بحث...' : 'Search...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(isRTL ? "pr-10" : "pl-10")}
            />
          </div>

          {/* Type Filter */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={isRTL ? 'النوع' : 'Type'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{isRTL ? 'الكل' : 'All'}</SelectItem>
              <SelectItem value="image">{isRTL ? 'صور' : 'Images'}</SelectItem>
              <SelectItem value="video">{isRTL ? 'فيديو' : 'Videos'}</SelectItem>
              <SelectItem value="document">{isRTL ? 'مستندات' : 'Documents'}</SelectItem>
              <SelectItem value="audio">{isRTL ? 'صوت' : 'Audio'}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          {/* Bulk Actions */}
          {selectedFiles.size > 0 && (
            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
              <Trash2 className="h-4 w-4 me-2" />
              {isRTL ? `حذف (${selectedFiles.size})` : `Delete (${selectedFiles.size})`}
            </Button>
          )}

          {/* Refresh */}
          <Button variant="outline" size="icon" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>

          {/* View Toggle */}
          <div className="flex items-center border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="rounded-e-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="rounded-s-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Media Grid/List */}
      {isLoading ? (
        <div className={cn(
          viewMode === 'grid' 
            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
            : "space-y-2"
        )}>
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton 
              key={i} 
              className={viewMode === 'grid' ? "aspect-square rounded-lg" : "h-16 rounded-lg"} 
            />
          ))}
        </div>
      ) : media.length === 0 ? (
        <Card className="py-12">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">
              {isRTL ? 'لا توجد ملفات' : 'No files found'}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {isRTL ? 'ابدأ برفع ملفاتك' : 'Start by uploading your files'}
            </p>
            <Button className="mt-4" onClick={() => setUploadDialogOpen(true)}>
              <Upload className="h-4 w-4 me-2" />
              {isRTL ? 'رفع ملف' : 'Upload File'}
            </Button>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {media.map((file) => {
            const Icon = getFileIcon(file.type)
            const isSelected = selectedFiles.has(file.id)

            return (
              <div
                key={file.id}
                className={cn(
                  "group relative aspect-square rounded-lg border overflow-hidden cursor-pointer transition-all",
                  isSelected && "ring-2 ring-primary"
                )}
                onClick={() => toggleFileSelection(file.id)}
              >
                {/* Thumbnail */}
                {file.type === 'image' ? (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextElementSibling?.classList.remove('hidden')
                    }}
                  />
                ) : null}
                <div className={cn(
                  "w-full h-full flex items-center justify-center bg-muted",
                  file.type === 'image' && "hidden"
                )}>
                  <Icon className="h-12 w-12 text-muted-foreground" />
                </div>

                {/* Selection Checkbox */}
                <div className={cn(
                  "absolute top-2 start-2 h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all",
                  isSelected ? "bg-primary border-primary" : "bg-white/80 border-gray-300 opacity-0 group-hover:opacity-100"
                )}>
                  {isSelected && <Check className="h-3 w-3 text-white" />}
                </div>

                {/* Actions */}
                <div className="absolute top-2 end-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="secondary" size="icon" className="h-7 w-7">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align={isRTL ? "start" : "end"}>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setPreviewFile(file) }}>
                        <Eye className="h-4 w-4 me-2" />
                        {isRTL ? 'معاينة' : 'Preview'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); copyUrl(file.url) }}>
                        <Copy className="h-4 w-4 me-2" />
                        {isRTL ? 'نسخ الرابط' : 'Copy URL'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); window.open(file.url) }}>
                        <Download className="h-4 w-4 me-2" />
                        {isRTL ? 'تحميل' : 'Download'}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => { e.stopPropagation(); deleteMedia.mutate(file.id) }}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 me-2" />
                        {isRTL ? 'حذف' : 'Delete'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* File Info */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <p className="text-white text-xs truncate">{file.name}</p>
                  <p className="text-white/70 text-xs">{formatSize(file.size)}</p>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {media.map((file) => {
            const Icon = getFileIcon(file.type)
            const isSelected = selectedFiles.has(file.id)

            return (
              <div
                key={file.id}
                className={cn(
                  "flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer",
                  isSelected && "bg-primary/10 border-primary"
                )}
                onClick={() => toggleFileSelection(file.id)}
              >
                <div className={cn(
                  "h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0",
                  isSelected ? "bg-primary border-primary" : "border-gray-300"
                )}>
                  {isSelected && <Check className="h-3 w-3 text-white" />}
                </div>
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align={isRTL ? "start" : "end"}>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setPreviewFile(file) }}>
                      <Eye className="h-4 w-4 me-2" />
                      {isRTL ? 'معاينة' : 'Preview'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); copyUrl(file.url) }}>
                      <Copy className="h-4 w-4 me-2" />
                      {isRTL ? 'نسخ الرابط' : 'Copy URL'}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => { e.stopPropagation(); deleteMedia.mutate(file.id) }}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 me-2" />
                      {isRTL ? 'حذف' : 'Delete'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )
          })}
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isRTL ? 'رفع ملف' : 'Upload File'}</DialogTitle>
            <DialogDescription>
              {isRTL ? 'اختر الملفات التي تريد رفعها' : 'Select files to upload'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-8">
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'اسحب الملفات هنا أو انقر للاختيار' : 'Drag files here or click to select'}
              </p>
              <input
                type="file"
                className="hidden"
                multiple
                onChange={(e) => handleFileUpload(e.target.files)}
              />
            </label>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{previewFile?.name}</DialogTitle>
          </DialogHeader>
          {previewFile?.type === 'image' && (
            <img src={previewFile.url} alt={previewFile.name} className="w-full rounded-lg" />
          )}
          {previewFile?.type === 'video' && (
            <video src={previewFile.url} controls className="w-full rounded-lg" />
          )}
          {previewFile?.type === 'audio' && (
            <audio src={previewFile.url} controls className="w-full" />
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => copyUrl(previewFile?.url || '')}>
              <Copy className="h-4 w-4 me-2" />
              {isRTL ? 'نسخ الرابط' : 'Copy URL'}
            </Button>
            <Button onClick={() => window.open(previewFile?.url)}>
              <Download className="h-4 w-4 me-2" />
              {isRTL ? 'تحميل' : 'Download'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MediaPage
