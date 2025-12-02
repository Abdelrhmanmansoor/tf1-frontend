# Backend API Endpoints Required

## Leader Dashboard Endpoints

### 1. Dashboard Data
**GET** `/api/v1/leader/dashboard`
- Returns: `{ stats, permissions, roles, recentLogs, settings }`
- Stats: totalUsers, totalTeamMembers, totalJobs, totalApplications, pendingActions, activeUsers

### 2. Permissions
**GET** `/api/v1/leader/permissions`
- Returns: Array of all available permissions

**GET** `/api/v1/leader/roles`
- Returns: Array of all roles

**PUT** `/api/v1/leader/roles/{roleId}/permissions`
- Body: `{ permissions: string[] }`

### 3. Users & Teams
**GET** `/api/v1/leader/users?page=1&limit=50`
**GET** `/api/v1/leader/teams`
**POST** `/api/v1/leader/teams/members`
**PUT** `/api/v1/leader/teams/members/{memberId}/permissions`

### 4. System
**GET** `/api/v1/leader/audit-logs?page=1&limit=50`
**GET** `/api/v1/leader/settings`
**PUT** `/api/v1/leader/settings`
**GET** `/api/v1/leader/analytics`

---

## Team Dashboard Endpoints

**GET** `/api/v1/team/permissions`
**GET** `/api/v1/team/dashboard`
**GET** `/api/v1/team/permissions/{permissionId}/check`
**GET** `/api/v1/team/users?page=1&limit=50` (if users.view permission)
**GET** `/api/v1/team/content?page=1&limit=50` (if content.view permission)
**GET** `/api/v1/team/jobs?page=1&limit=50` (if jobs.view permission)
**GET** `/api/v1/team/applications?page=1&limit=50` (if applications.view permission)
**GET** `/api/v1/team/notifications` (if notifications.view permission)
**GET** `/api/v1/team/messages` (if messages.view permission)
**POST** `/api/v1/team/access-denied`

---

## NEW: Job Application & Notifications Endpoints

### Job Application
**POST** `/api/v1/jobs/{jobId}/apply`
- Body: FormData with resume file, whatsapp, portfolio, linkedin, coverLetter
- Returns: Application confirmation with ID
- Triggers: Real-time notification to club

### Notifications - Applicant Side
**GET** `/api/v1/notifications/jobs?page=1&limit=20`
- Returns: List of job-related notifications for current user
- Fields: _id, userId, jobId, type, title, titleAr, message, messageAr, read, createdAt

**PUT** `/api/v1/notifications/{notificationId}/read`
- Marks single notification as read

**PUT** `/api/v1/notifications/mark-all-read`
- Marks all notifications as read

**GET** `/api/v1/notifications/unread-count`
- Returns: `{ count: number }`

**DELETE** `/api/v1/notifications/{notificationId}`
- Deletes a notification

### Notifications - Club Side
**GET** `/api/v1/notifications/club/applications?page=1&limit=20`
- Returns: List of applications received for club's jobs
- Fields: Same as notifications + applicantData, jobData

### Send Notifications
**POST** `/api/v1/notifications/job-application`
- Body: `{ jobId, applicantInfo: { name, email, whatsapp, portfolio, linkedin, coverLetter } }`
- Purpose: Send instant notifications to both applicant and club

---

## Real-time WebSocket Events

**Event:** `application_submitted`
- Sent to: Applicant (browser)
- Data: `{ jobId, jobTitle, clubName, timestamp }`

**Event:** `application_received`
- Sent to: Club (admin dashboard)
- Data: `{ jobId, jobTitle, applicantName, applicantEmail, timestamp }`

---

## Implementation Status

### Frontend (100% Ready)
- ✅ `services/leader.ts` - Leader dashboard API calls
- ✅ `services/team.ts` - Team dashboard API calls
- ✅ `services/notifications.ts` - Notification management
- ✅ `components/JobApplicationForm.tsx` - Enhanced job application form
- ✅ Dashboard pages: `/dashboard/leader`, `/dashboard/team`
- ✅ Job application page with real-time notifications

### Backend (AWAITING IMPLEMENTATION)
- ⏳ Leader dashboard endpoints
- ⏳ Team dashboard endpoints  
- ⏳ Job application endpoint with validation
- ⏳ Notification service with WebSocket support
- ⏳ Notification endpoints for CRUD operations
- ⏳ Real-time notification broadcasting via Socket.io

---

## Key Features

1. **Job Application**
   - Resume upload (PDF, DOC, DOCX - max 10MB)
   - Contact info (WhatsApp, LinkedIn, Portfolio)
   - Optional cover letter
   - Duplicate application prevention (409 status)

2. **Instant Notifications**
   - Applicant gets confirmation notification
   - Club gets application notification immediately
   - Real-time updates via WebSocket

3. **Notification Center**
   - View all job notifications
   - Mark as read / mark all as read
   - Delete notifications
   - Unread count badge

4. **Bilingual Support**
   - Arabic and English notifications
   - RTL/LTR layout support
