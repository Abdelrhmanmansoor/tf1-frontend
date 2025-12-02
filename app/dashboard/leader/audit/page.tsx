'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AuditLog } from '@/types/rbac'
import {
  ArrowLeft,
  Search,
  Loader2,
  ClipboardList,
  User,
  Clock,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  Activity
} from 'lucide-react'

export default function AuditLogPage() {
  const { language } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'success' | 'failure'>('all')

  useEffect(() => {
    if (user?.role !== 'leader') {
      router.push('/dashboard/leader/fallback')
      return
    }
    fetchAuditLogs()
  }, [user, router])

  const fetchAuditLogs = async () => {
    try {
      setLoading(true)
      
      const localLogs = localStorage.getItem('auditLogs')
      if (localLogs) {
        setLogs(JSON.parse(localLogs))
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://tf1-backend.onrender.com/api/v1'}/leader/audit`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      if (response.ok) {
        const result = await response.json()
        if (result.data?.logs?.length > 0) {
          setLogs(result.data.logs)
        }
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityType?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' || log.status === filter
    return matchesSearch && matchesFilter
  })

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')
  }

  const exportLogs = () => {
    const csv = [
      ['Timestamp', 'User', 'Role', 'Action', 'Entity Type', 'Status'].join(','),
      ...filteredLogs.map(log => [
        log.timestamp,
        log.userName,
        log.userRole,
        log.action,
        log.entityType,
        log.status
      ].join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/leader')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'سجل التدقيق' : 'Audit Log'}
              </h1>
            </div>
            <Button onClick={exportLogs} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'تصدير' : 'Export'}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'success', 'failure'] as const).map((status) => (
              <Button
                key={status}
                variant={filter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(status)}
                className={filter === status ? 'bg-indigo-600 text-white' : ''}
              >
                {status === 'all' && (language === 'ar' ? 'الكل' : 'All')}
                {status === 'success' && (language === 'ar' ? 'نجاح' : 'Success')}
                {status === 'failure' && (language === 'ar' ? 'فشل' : 'Failure')}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {language === 'ar' ? 'لا توجد سجلات' : 'No Audit Logs'}
            </h3>
            <p className="text-gray-500">
              {language === 'ar' ? 'ستظهر السجلات هنا عند إجراء أي عمليات' : 'Logs will appear here when actions are performed'}
            </p>
          </motion.div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                      {language === 'ar' ? 'الوقت' : 'Time'}
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                      {language === 'ar' ? 'المستخدم' : 'User'}
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                      {language === 'ar' ? 'الإجراء' : 'Action'}
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                      {language === 'ar' ? 'النوع' : 'Entity'}
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                      {language === 'ar' ? 'الحالة' : 'Status'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredLogs.map((log, index) => (
                    <motion.tr
                      key={log.id || index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          {formatDate(log.timestamp)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{log.userName}</p>
                            <p className="text-xs text-gray-500">{log.userRole}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">
                          {language === 'ar' ? log.actionAr : log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                          {log.entityType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          log.status === 'success' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {log.status === 'success' 
                            ? <CheckCircle className="w-3 h-3" />
                            : <XCircle className="w-3 h-3" />
                          }
                          {log.status === 'success' 
                            ? (language === 'ar' ? 'نجاح' : 'Success')
                            : (language === 'ar' ? 'فشل' : 'Failure')
                          }
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
