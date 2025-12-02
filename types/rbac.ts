// Role-Based Access Control Types

export type SystemRole = 'leader' | 'team' | 'player' | 'coach' | 'club' | 'specialist' | 'administrative-officer' | 'age-group-supervisor' | 'sports-director' | 'executive-director' | 'secretary'

export interface Permission {
  id: string
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  module: string
  action: 'view' | 'create' | 'edit' | 'delete' | 'manage' | 'all'
}

export interface Role {
  id: string
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  type: 'system' | 'job'
  permissions: string[]
  isSystemRole: boolean
}

export interface TeamMember {
  id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  accessKey: string
  permissions: string[]
  status: 'active' | 'inactive' | 'suspended'
  createdAt: string
  lastLogin?: string
  createdBy: string
}

export interface AuditLog {
  id: string
  userId: string
  userName: string
  userRole: string
  action: string
  actionAr: string
  entityType: string
  entityId?: string
  metadata?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  timestamp: string
  status: 'success' | 'failure'
}

export interface AccessKey {
  id: string
  userId: string
  key: string
  status: 'active' | 'revoked' | 'expired'
  createdAt: string
  expiresAt?: string
  lastUsed?: string
}

export const MODULES = {
  USERS: 'users',
  ROLES: 'roles',
  PERMISSIONS: 'permissions',
  TEAMS: 'teams',
  CONTENT: 'content',
  JOBS: 'jobs',
  APPLICATIONS: 'applications',
  ANALYTICS: 'analytics',
  SETTINGS: 'settings',
  AUDIT: 'audit',
  MARKETING: 'marketing',
  CATEGORIES: 'categories',
  NOTIFICATIONS: 'notifications',
  MESSAGES: 'messages',
  REPORTS: 'reports',
  PLAYERS: 'players',
  COACHES: 'coaches',
  CLUBS: 'clubs',
  MATCHES: 'matches',
  TRAINING: 'training',
  AGE_GROUPS: 'age_groups',
  REGISTRATIONS: 'registrations'
} as const

export const ACTIONS = {
  VIEW: 'view',
  CREATE: 'create',
  EDIT: 'edit',
  DELETE: 'delete',
  MANAGE: 'manage',
  ALL: 'all'
} as const

export const DEFAULT_PERMISSIONS: Record<string, Permission> = {
  'users.view': { id: 'users.view', name: 'View Users', nameAr: 'عرض المستخدمين', description: 'View user list', descriptionAr: 'عرض قائمة المستخدمين', module: 'users', action: 'view' },
  'users.create': { id: 'users.create', name: 'Create Users', nameAr: 'إنشاء مستخدمين', description: 'Create new users', descriptionAr: 'إنشاء مستخدمين جدد', module: 'users', action: 'create' },
  'users.edit': { id: 'users.edit', name: 'Edit Users', nameAr: 'تعديل المستخدمين', description: 'Edit user profiles', descriptionAr: 'تعديل ملفات المستخدمين', module: 'users', action: 'edit' },
  'users.delete': { id: 'users.delete', name: 'Delete Users', nameAr: 'حذف المستخدمين', description: 'Delete users', descriptionAr: 'حذف المستخدمين', module: 'users', action: 'delete' },
  
  'teams.view': { id: 'teams.view', name: 'View Teams', nameAr: 'عرض الفرق', description: 'View team members', descriptionAr: 'عرض أعضاء الفريق', module: 'teams', action: 'view' },
  'teams.create': { id: 'teams.create', name: 'Create Teams', nameAr: 'إنشاء فرق', description: 'Create team accounts', descriptionAr: 'إنشاء حسابات الفريق', module: 'teams', action: 'create' },
  'teams.edit': { id: 'teams.edit', name: 'Edit Teams', nameAr: 'تعديل الفرق', description: 'Edit team permissions', descriptionAr: 'تعديل صلاحيات الفريق', module: 'teams', action: 'edit' },
  'teams.delete': { id: 'teams.delete', name: 'Delete Teams', nameAr: 'حذف الفرق', description: 'Remove team members', descriptionAr: 'إزالة أعضاء الفريق', module: 'teams', action: 'delete' },
  
  'content.view': { id: 'content.view', name: 'View Content', nameAr: 'عرض المحتوى', description: 'View all content', descriptionAr: 'عرض كل المحتوى', module: 'content', action: 'view' },
  'content.create': { id: 'content.create', name: 'Create Content', nameAr: 'إنشاء محتوى', description: 'Create new content', descriptionAr: 'إنشاء محتوى جديد', module: 'content', action: 'create' },
  'content.edit': { id: 'content.edit', name: 'Edit Content', nameAr: 'تعديل المحتوى', description: 'Edit existing content', descriptionAr: 'تعديل المحتوى الموجود', module: 'content', action: 'edit' },
  'content.delete': { id: 'content.delete', name: 'Delete Content', nameAr: 'حذف المحتوى', description: 'Delete content', descriptionAr: 'حذف المحتوى', module: 'content', action: 'delete' },
  
  'jobs.view': { id: 'jobs.view', name: 'View Jobs', nameAr: 'عرض الوظائف', description: 'View job listings', descriptionAr: 'عرض قوائم الوظائف', module: 'jobs', action: 'view' },
  'jobs.create': { id: 'jobs.create', name: 'Create Jobs', nameAr: 'إنشاء وظائف', description: 'Create job listings', descriptionAr: 'إنشاء قوائم وظائف', module: 'jobs', action: 'create' },
  'jobs.edit': { id: 'jobs.edit', name: 'Edit Jobs', nameAr: 'تعديل الوظائف', description: 'Edit job listings', descriptionAr: 'تعديل قوائم الوظائف', module: 'jobs', action: 'edit' },
  'jobs.delete': { id: 'jobs.delete', name: 'Delete Jobs', nameAr: 'حذف الوظائف', description: 'Delete job listings', descriptionAr: 'حذف قوائم الوظائف', module: 'jobs', action: 'delete' },
  
  'applications.view': { id: 'applications.view', name: 'View Applications', nameAr: 'عرض الطلبات', description: 'View job applications', descriptionAr: 'عرض طلبات التوظيف', module: 'applications', action: 'view' },
  'applications.manage': { id: 'applications.manage', name: 'Manage Applications', nameAr: 'إدارة الطلبات', description: 'Manage applications', descriptionAr: 'إدارة الطلبات', module: 'applications', action: 'manage' },
  
  'analytics.view': { id: 'analytics.view', name: 'View Analytics', nameAr: 'عرض التحليلات', description: 'View platform analytics', descriptionAr: 'عرض تحليلات المنصة', module: 'analytics', action: 'view' },
  
  'settings.view': { id: 'settings.view', name: 'View Settings', nameAr: 'عرض الإعدادات', description: 'View platform settings', descriptionAr: 'عرض إعدادات المنصة', module: 'settings', action: 'view' },
  'settings.edit': { id: 'settings.edit', name: 'Edit Settings', nameAr: 'تعديل الإعدادات', description: 'Edit platform settings', descriptionAr: 'تعديل إعدادات المنصة', module: 'settings', action: 'edit' },
  
  'audit.view': { id: 'audit.view', name: 'View Audit Logs', nameAr: 'عرض سجلات التدقيق', description: 'View audit logs', descriptionAr: 'عرض سجلات التدقيق', module: 'audit', action: 'view' },
  
  'notifications.view': { id: 'notifications.view', name: 'View Notifications', nameAr: 'عرض الإشعارات', description: 'View notifications', descriptionAr: 'عرض الإشعارات', module: 'notifications', action: 'view' },
  'notifications.manage': { id: 'notifications.manage', name: 'Manage Notifications', nameAr: 'إدارة الإشعارات', description: 'Manage notifications', descriptionAr: 'إدارة الإشعارات', module: 'notifications', action: 'manage' },
  
  'messages.view': { id: 'messages.view', name: 'View Messages', nameAr: 'عرض الرسائل', description: 'View messages', descriptionAr: 'عرض الرسائل', module: 'messages', action: 'view' },
  'messages.manage': { id: 'messages.manage', name: 'Manage Messages', nameAr: 'إدارة الرسائل', description: 'Manage messages', descriptionAr: 'إدارة الرسائل', module: 'messages', action: 'manage' },
  
  'categories.view': { id: 'categories.view', name: 'View Categories', nameAr: 'عرض الفئات', description: 'View categories', descriptionAr: 'عرض الفئات', module: 'categories', action: 'view' },
  'categories.manage': { id: 'categories.manage', name: 'Manage Categories', nameAr: 'إدارة الفئات', description: 'Manage categories', descriptionAr: 'إدارة الفئات', module: 'categories', action: 'manage' },
  
  'reports.view': { id: 'reports.view', name: 'View Reports', nameAr: 'عرض التقارير', description: 'View reports', descriptionAr: 'عرض التقارير', module: 'reports', action: 'view' },
  'reports.create': { id: 'reports.create', name: 'Create Reports', nameAr: 'إنشاء تقارير', description: 'Create reports', descriptionAr: 'إنشاء تقارير', module: 'reports', action: 'create' },
}

export const LEADER_PERMISSIONS = Object.keys(DEFAULT_PERMISSIONS)

export const DEFAULT_TEAM_PERMISSIONS = [
  'users.view',
  'content.view',
  'jobs.view',
  'applications.view',
  'notifications.view',
  'messages.view'
]
