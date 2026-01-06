'use client'

import { useState, useEffect } from 'react'
import { 
  Shield, Lock, Activity, Users, FileText, LogOut, Eye, EyeOff, Settings, 
  BarChart3, AlertCircle, Database, Server, HardDrive, Cpu, Network, 
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle, XCircle, 
  UserCheck, UserX, Briefcase, FileCheck, FileX, Clock, Globe, 
  Zap, Target, PieChart, LineChart, Monitor, LockIcon
} from 'lucide-react'
import { toast } from 'sonner'
import API_CONFIG from '@/config/api'

interface ComprehensiveStats {
  period?: {
    days: number
    startDate: string
    endDate: string
  }
  users?: {
    total: number
    active: number
    blocked: number
    byRole: Array<{ _id: string; count: number }>
    newToday: number
    newThisWeek: number
    newThisMonth: number
    lastLoginCount: number
    registrationTrend: Array<{ _id: string; count: number }>
  }
  jobs?: {
    total: number
    active: number
    closed: number
    byCategory: Array<{ _id: string; count: number }>
    byType: Array<{ _id: string; count: number }>
    newToday: number
    newThisWeek: number
    withApplications: number
    creationTrend: Array<{ _id: string; count: number }>
  }
  applications?: {
    total: number
    new: number
    underReview: number
    accepted: number
    rejected: number
    today: number
    thisWeek: number
    byStatus: Array<{ _id: string; count: number }>
    trend: Array<{ _id: string; count: number }>
  }
  cvs?: {
    totalCVs: number
    completedCVs: number
    incompleteCVs: number
    cvsWithFiles: number
    cvsToday: number
    cvsThisWeek: number
  }
  system?: {
    database: {
      status: string
      connectionState: number
    }
    server: {
      uptime: number
      uptimeFormatted: string
      memory: {
        used: number
        total: number
        external: number
        rss: number
      }
      nodeVersion: string
    }
  }
  security?: {
    blockedUsers: number
    suspiciousActivity: number
    failedLoginAttempts: number
    activeSessions: number
  }
  timestamp?: string
}

export default function SysAdminSecurePanelPage() {
  const [adminKey, setAdminKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<ComprehensiveStats | null>(null)
  const [currentPage, setCurrentPage] = useState('overview')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(30) // seconds

  // Get base URL for admin panel API
  const getApiBaseUrl = () => {
    if (typeof window === 'undefined') return '/sys-admin-secure-panel/api'
    const baseUrl = API_CONFIG.BASE_URL.replace('/api/v1', '')
    return `${baseUrl}/sys-admin-secure-panel/api`
  }
  
  const API_BASE_URL = getApiBaseUrl()

  // Check if already authenticated on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedKey = localStorage.getItem('admin_key')
      if (storedKey) {
        setAdminKey(storedKey)
        setIsAuthenticated(true)
        fetchComprehensiveStats(storedKey)
      }
    }
  }, [])

  // Auto-refresh stats
  useEffect(() => {
    if (!isAuthenticated || !autoRefresh || !adminKey) return

    const interval = setInterval(() => {
      fetchComprehensiveStats(adminKey)
    }, refreshInterval * 1000)

    return () => clearInterval(interval)
  }, [isAuthenticated, autoRefresh, refreshInterval, adminKey])

  const apiCall = async (endpoint: string, key: string, options: RequestInit = {}) => {
    try {
      const url = `${API_BASE_URL}${endpoint}`
      
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': key,
          ...options.headers,
        },
        credentials: 'include',
        ...options,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        if (response.status === 401) {
          throw new Error(errorData.message || 'Invalid admin key')
        }
        if (response.status === 403) {
          throw new Error(errorData.message || 'Access denied')
        }
        if (response.status === 429) {
          throw new Error(errorData.message || 'Too many requests. Please wait.')
        }
        throw new Error(errorData.message || `API Error: ${response.status}`)
      }

      return await response.json()
    } catch (err: any) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        throw new Error('Network error: Cannot connect to server. Please check your connection and try again.')
      }
      throw new Error(err.message || 'API request failed')
    }
  }

  const fetchComprehensiveStats = async (key: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiCall('/stats/comprehensive?days=30', key)
      setStats(data.data || data)
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching comprehensive stats:', err)
      toast.error(err.message || 'Failed to fetch statistics')
    } finally {
      setLoading(false)
    }
  }

  // Test admin key (for development)
  const TEST_ADMIN_KEY = 'sk_admin_2a2097d2dbf949c50e3a5f2eaa231e81c4f5d2fb1128443165a6198201b758eb'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!adminKey.trim()) {
      toast.error('Please enter admin key')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await fetchComprehensiveStats(adminKey)
      localStorage.setItem('admin_key', adminKey)
      setIsAuthenticated(true)
      toast.success('Access granted - Full system control activated')
    } catch (err: any) {
      setError(err.message)
      setIsAuthenticated(false)
      toast.error(err.message || 'Invalid admin key')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_key')
    setIsAuthenticated(false)
    setAdminKey('')
    setStats(null)
    toast.info('Logged out securely - All access revoked')
  }

  // Login Page
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
        <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">System Admin Panel</h1>
            <p className="text-gray-400 text-sm mt-2">Restricted Access • Secure Entry</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="admin-key" className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-widest">
                Admin Key Authorization
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  id="admin-key"
                  type={showKey ? 'text' : 'password'}
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-700 text-white pl-10 pr-12 py-3 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-mono placeholder:text-gray-600"
                  placeholder="ENTER-ADMIN-KEY"
                  autoComplete="off"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {process.env.NODE_ENV === 'development' && (
                <button
                  type="button"
                  onClick={() => {
                    setAdminKey(TEST_ADMIN_KEY)
                    toast.info('Test key loaded (Development only)')
                  }}
                  className="mt-2 text-xs text-gray-500 hover:text-gray-400 underline"
                >
                  Use Test Key (Dev Only)
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={!adminKey || loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  Authenticating...
                </>
              ) : (
                'Authenticate'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-700 text-center">
            <p className="text-xs text-gray-500">
              IP Logged • Unauthorized attempts will be reported.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Dashboard Page - THE SCARY ONE
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1920px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="w-6 h-6 text-red-500" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </div>
            <span className="font-bold text-lg tracking-tight">System Admin Panel</span>
            <span className="px-2 py-1 bg-red-500/10 text-red-500 text-xs rounded border border-red-500/20 font-mono">
              FULL CONTROL MODE
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>LIVE</span>
            </div>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-1 text-xs rounded border transition-colors ${
                autoRefresh
                  ? 'bg-green-500/10 text-green-500 border-green-500/20'
                  : 'bg-gray-800 text-gray-400 border-gray-700'
              }`}
            >
              Auto: {autoRefresh ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1920px] mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-800 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'jobs', label: 'Jobs', icon: Briefcase },
            { id: 'applications', label: 'Applications', icon: FileCheck },
            { id: 'cvs', label: 'CVs', icon: FileText },
            { id: 'system', label: 'System', icon: Server },
            { id: 'security', label: 'Security', icon: LockIcon },
            { id: 'logs', label: 'Activity Logs', icon: Activity },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentPage(tab.id)}
                className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                  currentPage === tab.id
                    ? 'text-red-500 border-b-2 border-red-500'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Content */}
        {loading && currentPage === 'overview' && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-red-400 mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          </div>
        )}

        {currentPage === 'overview' && stats && (
          <div className="space-y-6">
            {/* Critical System Status */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-red-900/20 to-red-950/20 border border-red-500/30 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Database</span>
                  {stats.system?.database?.status === 'connected' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <p className="text-2xl font-bold">
                  {stats.system?.database?.status === 'connected' ? 'CONNECTED' : 'DISCONNECTED'}
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-900/20 to-blue-950/20 border border-blue-500/30 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Uptime</span>
                  <Server className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-2xl font-bold">{stats.system?.server?.uptimeFormatted || 'N/A'}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-900/20 to-purple-950/20 border border-purple-500/30 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Memory</span>
                  <HardDrive className="w-5 h-5 text-purple-500" />
                </div>
                <p className="text-2xl font-bold">
                  {stats.system?.server?.memory?.used || 0}MB / {stats.system?.server?.memory?.total || 0}MB
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-900/20 to-green-950/20 border border-green-500/30 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Node Version</span>
                  <Zap className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-lg font-bold font-mono">{stats.system?.server?.nodeVersion || 'N/A'}</p>
              </div>
            </div>

            {/* Users Statistics - SCARY LEVEL */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Users className="w-6 h-6 text-red-500" />
                  Users Control & Monitoring
                </h2>
                <span className="px-3 py-1 bg-red-500/10 text-red-500 text-xs rounded border border-red-500/20 font-mono">
                  TOTAL SURVEILLANCE
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
                <StatCard
                  label="Total Users"
                  value={stats.users?.total || 0}
                  icon={Users}
                  color="blue"
                  trend={stats.users?.newToday || 0}
                  trendLabel="New Today"
                />
                <StatCard
                  label="Active"
                  value={stats.users?.active || 0}
                  icon={UserCheck}
                  color="green"
                />
                <StatCard
                  label="Blocked"
                  value={stats.users?.blocked || 0}
                  icon={UserX}
                  color="red"
                />
                <StatCard
                  label="New Today"
                  value={stats.users?.newToday || 0}
                  icon={TrendingUp}
                  color="purple"
                />
                <StatCard
                  label="New This Week"
                  value={stats.users?.newThisWeek || 0}
                  icon={TrendingUp}
                  color="purple"
                />
                <StatCard
                  label="New This Month"
                  value={stats.users?.newThisMonth || 0}
                  icon={TrendingUp}
                  color="purple"
                />
                <StatCard
                  label="Recent Logins"
                  value={stats.users?.lastLoginCount || 0}
                  icon={Clock}
                  color="yellow"
                />
              </div>

              {/* Users by Role */}
              {stats.users?.byRole && stats.users.byRole.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Users by Role</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {stats.users.byRole.map((role) => (
                      <div
                        key={role._id}
                        className="bg-gray-800/50 border border-gray-700 rounded-lg p-3"
                      >
                        <div className="text-xs text-gray-500 mb-1">{role._id || 'Unknown'}</div>
                        <div className="text-xl font-bold">{role.count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Jobs Statistics */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-blue-500" />
                  Jobs Management
                </h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <StatCard label="Total Jobs" value={stats.jobs?.total || 0} icon={Briefcase} color="blue" />
                <StatCard label="Active" value={stats.jobs?.active || 0} icon={CheckCircle} color="green" />
                <StatCard label="Closed" value={stats.jobs?.closed || 0} icon={XCircle} color="red" />
                <StatCard label="New Today" value={stats.jobs?.newToday || 0} icon={TrendingUp} color="purple" />
                <StatCard label="New This Week" value={stats.jobs?.newThisWeek || 0} icon={TrendingUp} color="purple" />
                <StatCard label="With Applications" value={stats.jobs?.withApplications || 0} icon={FileCheck} color="yellow" />
              </div>
            </div>

            {/* Applications Statistics */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FileCheck className="w-6 h-6 text-green-500" />
                  Applications Monitoring
                </h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <StatCard label="Total" value={stats.applications?.total || 0} icon={FileCheck} color="blue" />
                <StatCard label="New" value={stats.applications?.new || 0} icon={Clock} color="yellow" />
                <StatCard label="Under Review" value={stats.applications?.underReview || 0} icon={Clock} color="yellow" />
                <StatCard label="Accepted" value={stats.applications?.accepted || 0} icon={CheckCircle} color="green" />
                <StatCard label="Rejected" value={stats.applications?.rejected || 0} icon={XCircle} color="red" />
                <StatCard label="Today" value={stats.applications?.today || 0} icon={TrendingUp} color="purple" />
                <StatCard label="This Week" value={stats.applications?.thisWeek || 0} icon={TrendingUp} color="purple" />
              </div>
            </div>

            {/* CVs Statistics */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FileText className="w-6 h-6 text-purple-500" />
                  CVs Database
                </h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <StatCard label="Total CVs" value={stats.cvs?.totalCVs || 0} icon={FileText} color="blue" />
                <StatCard label="Completed" value={stats.cvs?.completedCVs || 0} icon={CheckCircle} color="green" />
                <StatCard label="With Files" value={stats.cvs?.cvsWithFiles || 0} icon={FileCheck} color="purple" />
                <StatCard label="Today" value={stats.cvs?.cvsToday || 0} icon={TrendingUp} color="yellow" />
                <StatCard label="This Week" value={stats.cvs?.cvsThisWeek || 0} icon={TrendingUp} color="yellow" />
              </div>
            </div>

            {/* Security Metrics */}
            <div className="bg-gradient-to-br from-red-900/20 to-red-950/20 border border-red-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <LockIcon className="w-6 h-6 text-red-500" />
                  Security & Threat Monitoring
                </h2>
                <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded border border-red-500/30 font-mono">
                  BANKING-LEVEL SECURITY
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Blocked Users" value={stats.security?.blockedUsers || 0} icon={UserX} color="red" />
                <StatCard label="Suspicious Activity" value={stats.security?.suspiciousActivity || 0} icon={AlertTriangle} color="red" />
                <StatCard label="Failed Logins" value={stats.security?.failedLoginAttempts || 0} icon={XCircle} color="red" />
                <StatCard label="Active Sessions" value={stats.security?.activeSessions || 0} icon={Monitor} color="green" />
              </div>
            </div>
          </div>
        )}

        {/* Site Content Management */}
        {currentPage === 'settings' && (
          <SiteContentManager adminKey={adminKey} apiCall={apiCall} />
        )}

        {/* Other pages placeholders */}
        {currentPage !== 'overview' && currentPage !== 'settings' && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">
              {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)} Management
            </h3>
            <p className="text-gray-400">This section is being developed...</p>
          </div>
        )}
      </main>
    </div>
  )
}

// Site Content Manager Component
function SiteContentManager({ adminKey, apiCall }: { adminKey: string; apiCall: any }) {
  const [content, setContent] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState({ type: 'header', key: '', content: '', language: 'ar' })

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    setLoading(true)
    try {
      const data = await apiCall('/site-content', adminKey)
      setContent(data.data || [])
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch content')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      await apiCall('/site-content', adminKey, {
        method: 'PUT',
        body: JSON.stringify(formData),
      })
      toast.success('Content updated successfully')
      setEditing(null)
      fetchContent()
    } catch (err: any) {
      toast.error(err.message || 'Failed to update content')
    }
  }

  const contentTypes = [
    { value: 'header', label: 'Header' },
    { value: 'footer', label: 'Footer' },
    { value: 'text', label: 'Text' },
    { value: 'banner', label: 'Banner' },
    { value: 'notification', label: 'Notification' },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-500" />
            Site Content Management
          </h2>
          <button
            onClick={() => setEditing('new')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
          >
            Add New Content
          </button>
        </div>

        {editing === 'new' && (
          <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Add/Edit Content</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded-lg"
                >
                  {contentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Key (Identifier)</label>
                <input
                  type="text"
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded-lg"
                  placeholder="e.g., main-header, footer-links"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded-lg h-32"
                  placeholder="Enter content (HTML, JSON, or plain text)"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Language</label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded-lg"
                >
                  <option value="ar">Arabic</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditing(null)
                    setFormData({ type: 'header', key: '', content: '', language: 'ar' })
                  }}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {content.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No content found. Add new content to get started.</p>
            ) : (
              content.map((item: any) => (
                <div key={item._id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-xs text-gray-500 uppercase">{item.type}</span>
                      <span className="mx-2 text-gray-600">•</span>
                      <span className="text-sm font-mono text-gray-400">{item.key}</span>
                      <span className="mx-2 text-gray-600">•</span>
                      <span className="text-xs text-gray-500">{item.language}</span>
                    </div>
                    <button
                      onClick={() => {
                        setEditing(item._id)
                        setFormData({
                          type: item.type,
                          key: item.key,
                          content: typeof item.content === 'string' ? item.content : JSON.stringify(item.content),
                          language: item.language,
                        })
                      }}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="text-sm text-gray-300 mt-2">
                    {typeof item.content === 'string' ? (
                      <pre className="whitespace-pre-wrap">{item.content}</pre>
                    ) : (
                      <pre>{JSON.stringify(item.content, null, 2)}</pre>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  color = 'blue',
  trend,
  trendLabel 
}: {
  label: string
  value: number
  icon: any
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple'
  trend?: number
  trendLabel?: string
}) {
  const colorClasses = {
    blue: 'text-blue-500 border-blue-500/20 bg-blue-500/10',
    green: 'text-green-500 border-green-500/20 bg-green-500/10',
    red: 'text-red-500 border-red-500/20 bg-red-500/10',
    yellow: 'text-yellow-500 border-yellow-500/20 bg-yellow-500/10',
    purple: 'text-purple-500 border-purple-500/20 bg-purple-500/10',
  }

  return (
    <div className={`bg-gray-800/50 border ${colorClasses[color]} rounded-xl p-4`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400 uppercase tracking-wider">{label}</span>
        <Icon className={`w-4 h-4 ${colorClasses[color].split(' ')[0]}`} />
      </div>
      <p className="text-2xl font-bold">{value.toLocaleString()}</p>
      {trend !== undefined && trendLabel && (
        <p className="text-xs text-gray-500 mt-1">{trendLabel}: {trend}</p>
      )}
    </div>
  )
}
