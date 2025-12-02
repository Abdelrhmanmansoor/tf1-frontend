# Backend API Endpoints Required

## Leader Dashboard Endpoints

### 1. Dashboard Data
**GET** `/api/v1/leader/dashboard`
- Returns: `{ stats, permissions, roles, recentLogs, settings }`
- Stats: totalUsers, totalTeamMembers, totalJobs, totalApplications, pendingActions, activeUsers

### 2. Permissions
**GET** `/api/v1/leader/permissions`
- Returns: Array of all available permissions
- Fields: id, name, description, category

### 3. Roles
**GET** `/api/v1/leader/roles`
- Returns: Array of all roles
- Fields: id, name, description, permissions[]

**PUT** `/api/v1/leader/roles/{roleId}/permissions`
- Body: `{ permissions: string[] }`
- Returns: Updated role

### 4. Users Management
**GET** `/api/v1/leader/users?page=1&limit=50`
- Returns: `{ users: [], total: number }`

### 5. Teams Management
**GET** `/api/v1/leader/teams`
- Returns: Array of teams

**POST** `/api/v1/leader/teams/members`
- Body: `{ userId: string, permissions: string[] }`
- Returns: Created team member

**PUT** `/api/v1/leader/teams/members/{memberId}/permissions`
- Body: `{ permissions: string[] }`
- Returns: Updated member

### 6. Audit Logs
**GET** `/api/v1/leader/audit-logs?page=1&limit=50`
- Returns: `{ logs: [], total: number }`
- Fields: id, action, actor, target, timestamp, status

### 7. Settings
**GET** `/api/v1/leader/settings`
- Returns: Settings object

**PUT** `/api/v1/leader/settings`
- Body: Settings object
- Returns: Updated settings

### 8. Analytics
**GET** `/api/v1/leader/analytics?startDate=&endDate=`
- Returns: Analytics data

---

## Team Dashboard Endpoints

### 1. Team Permissions
**GET** `/api/v1/team/permissions`
- Returns: Array of permissions assigned to this team member
- Fields: id, name, description, enabled, category

### 2. Team Dashboard
**GET** `/api/v1/team/dashboard`
- Returns: `{ permissions, memberInfo, accessibleModules }`

### 3. Permission Check
**GET** `/api/v1/team/permissions/{permissionId}/check`
- Returns: `{ hasPermission: boolean }`

### 4. Conditional Endpoints (based on permissions)

**GET** `/api/v1/team/users?page=1&limit=50` (if users.view permission)
- Returns: `{ users: [], total: number }`

**GET** `/api/v1/team/content?page=1&limit=50` (if content.view permission)
- Returns: `{ content: [], total: number }`

**GET** `/api/v1/team/jobs?page=1&limit=50` (if jobs.view permission)
- Returns: `{ jobs: [], total: number }`

**GET** `/api/v1/team/applications?page=1&limit=50` (if applications.view permission)
- Returns: `{ applications: [], total: number }`

**GET** `/api/v1/team/notifications` (if notifications.view permission)
- Returns: Array of notifications

**GET** `/api/v1/team/messages` (if messages.view permission)
- Returns: Array of messages

### 5. Access Denied Logging
**POST** `/api/v1/team/access-denied`
- Body: `{ reason: string }`
- Purpose: Log when team member tries to access restricted resource

---

## Key Implementation Notes

1. **All endpoints require Bearer token authentication**
2. **Team endpoints must check permissions on backend before returning data**
3. **404 pages should NOT be thrown - use access-denied instead**
4. **Team permissions are permission-by-permission (not role-based)**
5. **Leader has 100% access to everything**

---

## Example Request

```bash
curl -X GET https://tf1-backend.onrender.com/api/v1/leader/dashboard \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json"
```

---

## Implementation Status
- ✅ Frontend API services created: `services/leader.ts`, `services/team.ts`
- ⏳ Backend endpoints: AWAITING IMPLEMENTATION
- ✅ Frontend dashboard pages: READY at `/dashboard/leader` and `/dashboard/team`
