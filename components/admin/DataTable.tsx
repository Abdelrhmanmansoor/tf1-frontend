'use client'

import { useState, useMemo } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  Download,
  RefreshCw,
  MoreHorizontal,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export interface Column<T> {
  key: string
  header: string
  headerAr?: string
  cell?: (row: T) => React.ReactNode
  sortable?: boolean
  className?: string
  headerClassName?: string
}

export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  isLoading?: boolean
  totalItems?: number
  page?: number
  pageSize?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
  onSearch?: (query: string) => void
  onSort?: (key: string, order: 'asc' | 'desc') => void
  onRefresh?: () => void
  onExport?: () => void
  onRowSelect?: (selectedRows: T[]) => void
  searchPlaceholder?: string
  searchPlaceholderAr?: string
  selectable?: boolean
  actions?: (row: T) => React.ReactNode
  emptyMessage?: string
  emptyMessageAr?: string
  className?: string
  getRowId?: (row: T) => string
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  isLoading = false,
  totalItems = 0,
  page = 1,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  onSearch,
  onSort,
  onRefresh,
  onExport,
  onRowSelect,
  searchPlaceholder = 'Search...',
  searchPlaceholderAr = 'بحث...',
  selectable = false,
  actions,
  emptyMessage = 'No data found',
  emptyMessageAr = 'لا توجد بيانات',
  className,
  getRowId = (row) => String(row.id || Math.random()),
}: DataTableProps<T>) {
  const { language } = useLanguage()
  const isRTL = language === 'ar'

  const [searchQuery, setSearchQuery] = useState('')
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())

  const totalPages = Math.ceil(totalItems / pageSize) || 1

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    onSearch?.(value)
  }

  const handleSort = (key: string) => {
    const newOrder = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc'
    setSortKey(key)
    setSortOrder(newOrder)
    onSort?.(key, newOrder)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(data.map(getRowId))
      setSelectedRows(allIds)
      onRowSelect?.(data)
    } else {
      setSelectedRows(new Set())
      onRowSelect?.([])
    }
  }

  const handleSelectRow = (rowId: string, checked: boolean) => {
    const newSelected = new Set(selectedRows)
    if (checked) {
      newSelected.add(rowId)
    } else {
      newSelected.delete(rowId)
    }
    setSelectedRows(newSelected)
    onRowSelect?.(data.filter(row => newSelected.has(getRowId(row))))
  }

  const allSelected = data.length > 0 && data.every(row => selectedRows.has(getRowId(row)))
  const someSelected = data.some(row => selectedRows.has(getRowId(row))) && !allSelected

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortKey !== columnKey) {
      return <ArrowUpDown className="h-4 w-4 ms-1 opacity-50" />
    }
    return sortOrder === 'asc' 
      ? <ArrowUp className="h-4 w-4 ms-1" />
      : <ArrowDown className="h-4 w-4 ms-1" />
  }

  const pageSizeOptions = [10, 20, 50, 100]

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search */}
        {onSearch && (
          <div className="relative w-full sm:w-72">
            <Search className={cn(
              "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground",
              isRTL ? "right-3" : "left-3"
            )} />
            <Input
              type="search"
              placeholder={isRTL ? searchPlaceholderAr : searchPlaceholder}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className={cn(isRTL ? "pr-10" : "pl-10")}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {onRefresh && (
            <Button variant="outline" size="icon" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          {onExport && (
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="h-4 w-4 me-2" />
              {isRTL ? 'تصدير' : 'Export'}
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                {selectable && (
                  <TableHead className="w-12">
                    <Checkbox
                      checked={allSelected}
                      // @ts-ignore
                      indeterminate={someSelected}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                )}
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className={cn(
                      column.sortable && "cursor-pointer select-none",
                      column.headerClassName
                    )}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center">
                      {isRTL && column.headerAr ? column.headerAr : column.header}
                      {column.sortable && <SortIcon columnKey={column.key} />}
                    </div>
                  </TableHead>
                ))}
                {actions && (
                  <TableHead className="w-12">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {selectable && (
                      <TableCell>
                        <Skeleton className="h-4 w-4" />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell key={column.key}>
                        <Skeleton className="h-4 w-full max-w-[200px]" />
                      </TableCell>
                    ))}
                    {actions && (
                      <TableCell>
                        <Skeleton className="h-8 w-8" />
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : data.length === 0 ? (
                // Empty state
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}
                    className="h-32 text-center text-muted-foreground"
                  >
                    {isRTL ? emptyMessageAr : emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                // Data rows
                data.map((row) => {
                  const rowId = getRowId(row)
                  const isSelected = selectedRows.has(rowId)

                  return (
                    <TableRow
                      key={rowId}
                      className={cn(isSelected && "bg-muted/50")}
                    >
                      {selectable && (
                        <TableCell>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => handleSelectRow(rowId, !!checked)}
                          />
                        </TableCell>
                      )}
                      {columns.map((column) => (
                        <TableCell key={column.key} className={column.className}>
                          {column.cell
                            ? column.cell(row)
                            : String(row[column.key] ?? '')}
                        </TableCell>
                      ))}
                      {actions && (
                        <TableCell>
                          {actions(row)}
                        </TableCell>
                      )}
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Page size selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {isRTL ? 'عرض' : 'Show'}
            </span>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => onPageSizeChange?.(Number(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              {isRTL ? `من ${totalItems}` : `of ${totalItems}`}
            </span>
          </div>

          {/* Page navigation */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange?.(1)}
              disabled={page === 1}
            >
              {isRTL ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange?.(page - 1)}
              disabled={page === 1}
            >
              {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
            <span className="px-4 text-sm">
              {isRTL 
                ? `${page} من ${totalPages}`
                : `${page} of ${totalPages}`
              }
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange?.(page + 1)}
              disabled={page === totalPages}
            >
              {isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange?.(totalPages)}
              disabled={page === totalPages}
            >
              {isRTL ? <ChevronsLeft className="h-4 w-4" /> : <ChevronsRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// Table component (simplified shadcn/ui table)
function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <table
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  )
}

function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("[&_tr]:border-b", className)} {...props} />
}

function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />
}

function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "h-12 px-4 text-start align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
      {...props}
    />
  )
}

// Checkbox component (simplified)
function Checkbox({ 
  checked, 
  onCheckedChange, 
  className,
  ...props 
}: { 
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  className?: string
}) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      className={cn(
        "h-4 w-4 rounded border border-primary text-primary focus:ring-primary",
        className
      )}
      {...props}
    />
  )
}

export default DataTable
