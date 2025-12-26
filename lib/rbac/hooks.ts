'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { hasPermission as checkPermission } from './permission-map'
import { LEADER_PERMISSIONS } from '@/types/rbac'

interface UsePermissionResult {
  hasPermission: (_permissions: string | string[], _requireAll?: boolean) => boolean
  userPermissions: string[]
  isLeader: boolean
  isTeam: boolean
  loading: boolean
}

export function usePermission(): UsePermissionResult {
  const { user } = useAuth()
  const [userPermissions, setUserPermissions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const isLeader = user?.role === 'leader'
  const isTeam = user?.role === 'team'

  useEffect(() => {
    if (user) {
      if (isLeader) {
        setUserPermissions(LEADER_PERMISSIONS)
      } else {
        const storedPermissions = localStorage.getItem('userPermissions')
        if (storedPermissions) {
          try {
            setUserPermissions(JSON.parse(storedPermissions))
          } catch {
            setUserPermissions([])
          }
        }
      }
      setLoading(false)
    }
  }, [user, isLeader])

  const hasPermission = useCallback((permissions: string | string[], requireAll = false): boolean => {
    if (isLeader) return true
    
    const permArray = Array.isArray(permissions) ? permissions : [permissions]
    return checkPermission(userPermissions, permArray, requireAll)
  }, [userPermissions, isLeader])

  return {
    hasPermission,
    userPermissions,
    isLeader,
    isTeam,
    loading
  }
}

export function useAuditLog() {
  const { user } = useAuth()

  const logAction = useCallback(async (
    action: string,
    actionAr: string,
    entityType: string,
    entityId?: string,
    metadata?: Record<string, any>
  ) => {
    if (!user) return

    try {
      const logEntry = {
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        userRole: user.role,
        action,
        actionAr,
        entityType,
        entityId,
        metadata,
        timestamp: new Date().toISOString(),
        status: 'success'
      }

      const existingLogs = localStorage.getItem('auditLogs')
      const logs = existingLogs ? JSON.parse(existingLogs) : []
      logs.unshift(logEntry)
      
      if (logs.length > 1000) {
        logs.splice(1000)
      }
      
      localStorage.setItem('auditLogs', JSON.stringify(logs))

      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://tf1-backend.onrender.com/api/v1'}/audit/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(logEntry)
      }).catch(() => {})

    } catch (error) {
      console.error('Failed to log action:', error)
    }
  }, [user])

  return { logAction }
}
