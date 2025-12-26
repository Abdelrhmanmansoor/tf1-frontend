// Permission Map - Routes and their required permissions

import { MODULES } from '@/types/rbac'

export interface RoutePermission {
  path: string
  permissions: string[]
  fallbackPath: string
  requireAll?: boolean
}

export const LEADER_ROUTES: RoutePermission[] = [
  { path: '/dashboard/leader', permissions: [], fallbackPath: '/dashboard/leader' },
  { path: '/dashboard/leader/users', permissions: ['users.view'], fallbackPath: '/dashboard/leader/fallback' },
  { path: '/dashboard/leader/permissions', permissions: ['permissions.manage'], fallbackPath: '/dashboard/leader/fallback' },
  { path: '/dashboard/leader/teams', permissions: ['teams.view'], fallbackPath: '/dashboard/leader/fallback' },
  { path: '/dashboard/leader/audit', permissions: ['audit.view'], fallbackPath: '/dashboard/leader/fallback' },
  { path: '/dashboard/leader/settings', permissions: ['settings.view'], fallbackPath: '/dashboard/leader/fallback' },
  { path: '/dashboard/leader/analytics', permissions: ['analytics.view'], fallbackPath: '/dashboard/leader/fallback' },
  { path: '/dashboard/leader/content', permissions: ['content.view'], fallbackPath: '/dashboard/leader/fallback' },
  { path: '/dashboard/leader/jobs', permissions: ['jobs.view'], fallbackPath: '/dashboard/leader/fallback' },
  { path: '/dashboard/leader/categories', permissions: ['categories.view'], fallbackPath: '/dashboard/leader/fallback' },
  { path: '/dashboard/leader/notifications', permissions: ['notifications.view'], fallbackPath: '/dashboard/leader/fallback' },
]

export const TEAM_ROUTES: RoutePermission[] = [
  { path: '/dashboard/team', permissions: [], fallbackPath: '/dashboard/team' },
  { path: '/dashboard/team/users', permissions: ['users.view'], fallbackPath: '/dashboard/team/access-denied' },
  { path: '/dashboard/team/content', permissions: ['content.view'], fallbackPath: '/dashboard/team/access-denied' },
  { path: '/dashboard/team/jobs', permissions: ['jobs.view'], fallbackPath: '/dashboard/team/access-denied' },
  { path: '/dashboard/team/applications', permissions: ['applications.view'], fallbackPath: '/dashboard/team/access-denied' },
  { path: '/dashboard/team/messages', permissions: ['messages.view'], fallbackPath: '/dashboard/team/access-denied' },
  { path: '/dashboard/team/notifications', permissions: ['notifications.view'], fallbackPath: '/dashboard/team/access-denied' },
]

export function getRoutePermission(path: string, role: string): RoutePermission | null {
  const routes = role === 'leader' ? LEADER_ROUTES : TEAM_ROUTES
  return routes.find(r => path.startsWith(r.path)) || null
}

export function hasPermission(userPermissions: string[], requiredPermissions: string[], requireAll = false): boolean {
  if (requiredPermissions.length === 0) return true
  
  if (requireAll) {
    return requiredPermissions.every(p => userPermissions.includes(p))
  }
  
  return requiredPermissions.some(p => userPermissions.includes(p))
}

export function getFallbackPath(role: string): string {
  return role === 'leader' ? '/dashboard/leader/fallback' : '/dashboard/team/access-denied'
}

export const MODULE_PERMISSIONS_MAP: Record<string, { view: string; create?: string; edit?: string; delete?: string; manage?: string }> = {
  [MODULES.USERS]: { view: 'users.view', create: 'users.create', edit: 'users.edit', delete: 'users.delete' },
  [MODULES.TEAMS]: { view: 'teams.view', create: 'teams.create', edit: 'teams.edit', delete: 'teams.delete' },
  [MODULES.CONTENT]: { view: 'content.view', create: 'content.create', edit: 'content.edit', delete: 'content.delete' },
  [MODULES.JOBS]: { view: 'jobs.view', create: 'jobs.create', edit: 'jobs.edit', delete: 'jobs.delete' },
  [MODULES.APPLICATIONS]: { view: 'applications.view', manage: 'applications.manage' },
  [MODULES.ANALYTICS]: { view: 'analytics.view' },
  [MODULES.SETTINGS]: { view: 'settings.view', edit: 'settings.edit' },
  [MODULES.AUDIT]: { view: 'audit.view' },
  [MODULES.NOTIFICATIONS]: { view: 'notifications.view', manage: 'notifications.manage' },
  [MODULES.MESSAGES]: { view: 'messages.view', manage: 'messages.manage' },
  [MODULES.CATEGORIES]: { view: 'categories.view', manage: 'categories.manage' },
  [MODULES.REPORTS]: { view: 'reports.view', create: 'reports.create' },
}
