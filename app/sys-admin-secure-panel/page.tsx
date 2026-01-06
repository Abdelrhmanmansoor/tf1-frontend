'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Lock, Activity, Users, FileText, LogOut, Eye, EyeOff, Settings, Database, BarChart3, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface OverviewData {
  failureRate?: {
    total: number
    successRate: number
    failed: number
  }
  topAdmins?: Array<{
    admin: string
    actions: number
  }>
  stats?: any
  timeline?: any
}

export default function SysAdminSecurePanelPage() {
  const router = useRouter()
  const [adminKey, setAdminKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [overview, setOverview] = useState<OverviewData | null>(null)
  const [currentPage, setCurrentPage] = useState('overview')

  // Use full URL for API calls (Next.js will proxy or use absolute URL)
  const API_BASE_URL = typeof window !== 'undefined' 
    ? `${window.location.origin}/sys-admin-secure-panel/api`
    : '/sys-admin-secure-panel/api'

  // Check if already authenticated on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedKey = localStorage.getItem('admin_key')
      if (storedKey) {
        setAdminKey(storedKey)
        setIsAuthenticated(true)
        fetchOverview(storedKey)
      }
    }
  }, [])

  const apiCall = async (endpoint: string, key: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': key,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid admin key')
        }
        throw new Error(`API Error: ${response.status}`)
      }

      return await response.json()
    } catch (err: any) {
      throw new Error(err.message || 'API request failed')
    }
  }

  const fetchOverview = async (key: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiCall('/overview?days=7', key)
      setOverview(data.data || data)
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching overview:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!adminKey.trim()) {
      toast.error('Please enter admin key')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Test the key by fetching overview
      await fetchOverview(adminKey)
      
      // If successful, save key and authenticate
      localStorage.setItem('admin_key', adminKey)
      setIsAuthenticated(true)
      toast.success('Access granted')
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
    setOverview(null)
    toast.info('Logged out securely')
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

  // Dashboard Page
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-red-500" />
            <span className="font-bold text-lg tracking-tight">System Admin Panel</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-2 py-1 bg-red-500/10 text-red-500 text-xs rounded border border-red-500/20 font-mono">
              ADMIN MODE
            </span>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-800">
          <button
            onClick={() => setCurrentPage('overview')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              currentPage === 'overview'
                ? 'text-red-500 border-b-2 border-red-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setCurrentPage('users')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              currentPage === 'users'
                ? 'text-red-500 border-b-2 border-red-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setCurrentPage('logs')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              currentPage === 'logs'
                ? 'text-red-500 border-b-2 border-red-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Activity Logs
          </button>
          <button
            onClick={() => setCurrentPage('settings')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              currentPage === 'settings'
                ? 'text-red-500 border-b-2 border-red-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Settings
          </button>
        </div>

        {/* Content */}
        {currentPage === 'overview' && (
          <div>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-red-400">
                {error}
              </div>
            ) : overview ? (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-400 text-sm font-medium">Total Actions</h3>
                      <BarChart3 className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-3xl font-bold">{overview.failureRate?.total || 0}</p>
                  </div>

                  <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-400 text-sm font-medium">Success Rate</h3>
                      <Activity className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-3xl font-bold">
                      {overview.failureRate?.successRate?.toFixed(1) || 0}%
                    </p>
                  </div>

                  <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-400 text-sm font-medium">Failed Actions</h3>
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    </div>
                    <p className="text-3xl font-bold">{overview.failureRate?.failed || 0}</p>
                  </div>
                </div>

                {/* Top Admins */}
                {overview.topAdmins && overview.topAdmins.length > 0 && (
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Top Active Admins
                    </h3>
                    <div className="space-y-3">
                      {overview.topAdmins.map((admin: any, i: number) => (
                        <div
                          key={i}
                          className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0"
                        >
                          <div>
                            <p className="text-sm font-medium">{admin.admin || 'Unknown'}</p>
                          </div>
                          <span className="text-xs px-2 py-1 bg-gray-800 rounded">
                            {admin.actions || 0} actions
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No data available. Try refreshing.
              </div>
            )}
          </div>
        )}

        {currentPage === 'users' && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">User Management</h3>
            <p className="text-gray-400">User management features coming soon...</p>
          </div>
        )}

        {currentPage === 'logs' && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Activity Logs
            </h3>
            <p className="text-gray-400">Activity logs will be displayed here...</p>
          </div>
        )}

        {currentPage === 'settings' && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              System Settings
            </h3>
            <p className="text-gray-400">System settings will be available here...</p>
          </div>
        )}
      </main>
    </div>
  )
}
