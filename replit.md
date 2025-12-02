# TF1 Sports Platform

## Overview

TF1 is a comprehensive sports networking platform for Egypt and the Middle East, envisioned as a "LinkedIn for sports." It connects players, coaches, clubs, and specialists (physiotherapists, nutritionists, fitness trainers, sports psychologists) to foster career development and community within the sports industry. The platform aims to provide a robust, bilingual, and multi-role online environment for sports professionals.

## User Preferences

- **Design**: Simple, elegant, minimal with blue-cyan-green gradients
- **Performance**: Lightweight, fast-loading pages
- **Language**: Arabic preferred, with English support
- **Direction**: RTL for Arabic, LTR for English

## System Architecture

The TF1 platform is built as a Next.js 15 web application utilizing the App Router. It employs TypeScript for type safety, Tailwind CSS for styling, and Radix UI for accessible UI components. State management is handled by Zustand, and data fetching is managed with TanStack React Query v5 and Axios. Form handling includes React Hook Form with Zod validation. The application supports internationalization with `next-intl` for Arabic and English, including RTL layout for Arabic. Theming is managed by `next-themes` for dark/light mode, and real-time features are implemented using Socket.io. Animations are powered by Framer Motion.

**Key Features:**

-   **Multi-Role System**: Supports Players, Coaches, Clubs, Specialists, and various Admin roles.
-   **Authentication**: JWT-based authentication with email verification and password reset.
-   **Profile Management**: Role-specific dashboards and profiles.
-   **Messaging**: Real-time chat functionality.
-   **Opportunities**: A job board for sports-related positions.
-   **Admin Dashboard**: Comprehensive site management including user control, content management, and system analytics. New administrative roles include Administrator, Age Group Supervisor, Sports Director, Executive Director, and Secretary, each with dedicated dashboards.
-   **Blog System**: Full content management for articles, supporting bilingual content and categorization.
-   **Search**: Global search capabilities across users, clubs, and opportunities.
-   **Bilingual Support**: Full Arabic and English support with dynamic RTL/LTR layouts.

**UI/UX Decisions:**

-   Login and Registration pages feature modern gradient designs (blue-cyan-green) and multi-step forms with real-time validation and progress indicators.
-   Consistent footer and navigation elements across all pages.
-   Testimonials and statistics sections are designed for a premium, modern appearance with animations and responsive layouts.

**Technical Implementations:**

-   Frontend routes are organized within the `app/` directory following Next.js App Router conventions.
-   API service layer is structured under `services/`, with dedicated modules for different functionalities and roles.
-   TypeScript types are centrally defined in `types/`.
-   Utility functions are located in `lib/`.
-   Environment variables (`NEXT_PUBLIC_API_URL`) are used for configurable backend API endpoints.
-   Image handling is integrated with Cloudinary.
-   CORS headers and security configurations are managed within `next.config.js`.

## Recent Changes (December 2025)

-   **Enterprise RBAC System**: Implemented enterprise-grade dual dashboard architecture
    -   Leader Dashboard (`/dashboard/leader`) - Full master control with unlimited access
    -   Team Dashboard (`/dashboard/team`) - Limited access based on assigned permissions
    -   Role-Based Access Control with granular permissions per module
    -   Unique access keys per team member
    -   Audit logging system for tracking all actions
    -   Safe fallback pages (no 404s, no forced logout on errors)
    -   Access denied pages inside dashboard (not logout)
-   **New Files**:
    -   `types/rbac.ts` - RBAC types, permissions, and role definitions
    -   `lib/rbac/permission-map.ts` - Route-permission mapping
    -   `lib/rbac/hooks.ts` - usePermission and useAuditLog hooks
    -   `app/dashboard/leader/*` - All Leader dashboard pages
    -   `app/dashboard/team/*` - All Team dashboard pages
-   **Join a Match Feature**: Added complete "Join a Match" functionality
    -   `/matches` - Main matches page with filters (region, sport, level)
    -   `/matches/my-matches` - User's joined matches page
    -   Services: `services/matches.ts` with all API calls
    -   Types: `types/match.ts` for TypeScript definitions
-   **Navigation**: Added "Matches" link in navbar (Arabic: المباريات)
-   **Registration**: Added TF1 logo with gradient design and privacy policy modal

## Leader Dashboard Backend Endpoints (Required)

The following endpoints need to be implemented on the backend for full Leader/Team functionality:

### Authentication & Access
- `POST /api/v1/leader/auth/login` - Leader login with access key
- `POST /api/v1/team/auth/login` - Team member login with access key
- `GET /api/v1/leader/dashboard` - Get leader dashboard stats

### Team Management
- `GET /api/v1/leader/teams` - List all team members
- `POST /api/v1/leader/teams` - Create new team member with permissions
- `PUT /api/v1/leader/teams/:id/permissions` - Update team member permissions
- `DELETE /api/v1/leader/teams/:id` - Remove team member
- `POST /api/v1/leader/teams/:id/regenerate-key` - Regenerate access key

### Audit Log
- `GET /api/v1/leader/audit` - Get audit logs with pagination and filters
- `POST /api/v1/audit/log` - Log an action (automatic logging)

### Platform Settings
- `GET /api/v1/admin/settings` - Get platform settings
- `PUT /api/v1/admin/settings` - Update platform settings

### Analytics
- `GET /api/v1/admin/analytics` - Get platform analytics and statistics

## External Dependencies

-   **Backend API**: `https://tf1-backend.onrender.com/api/v1` (configurable via `NEXT_PUBLIC_API_URL`)
-   **Image Storage**: Cloudinary
-   **Real-time Communication**: Socket.io (WebSocket connection)

## Age Group Supervisor Backend Endpoints (Required)

The following endpoints need to be implemented on the backend for full Age Group Supervisor functionality:

### Public Player Registration (للتسجيل العام)
- `GET /api/v1/age-groups` - List all available age groups (public endpoint)
- `POST /api/v1/player-registrations` - Submit new player registration request
  - Body: `{ playerName, playerFirstName, playerLastName, dateOfBirth, age, parentName, parentPhone, parentEmail, requestedAgeGroup, requestedAgeGroupId, notes, status: 'pending', submittedAt }`
  - This creates a pending registration that appears in supervisor's registrations page

### Dashboard
- `GET /api/v1/age-group-supervisor/dashboard` - Returns stats: totalAgeGroups, totalPlayers, totalCoaches, upcomingMatches, activeTrainings, pendingRegistrations

### Age Groups CRUD
- `GET /api/v1/age-group-supervisor/groups` - List all age groups
- `POST /api/v1/age-group-supervisor/groups` - Create new age group
- `PUT /api/v1/age-group-supervisor/groups/:id` - Update age group
- `DELETE /api/v1/age-group-supervisor/groups/:id` - Delete age group
- `PATCH /api/v1/age-group-supervisor/groups/:id/coach` - Assign coach to group

### Matches CRUD
- `GET /api/v1/age-group-supervisor/matches` - List all matches
- `POST /api/v1/age-group-supervisor/matches` - Create new match
- `PUT /api/v1/age-group-supervisor/matches/:id` - Update match
- `DELETE /api/v1/age-group-supervisor/matches/:id` - Delete match

### Training Schedule CRUD
- `GET /api/v1/age-group-supervisor/schedule` - List training sessions
- `POST /api/v1/age-group-supervisor/schedule` - Create training session
- `PUT /api/v1/age-group-supervisor/schedule/:id` - Update training session
- `DELETE /api/v1/age-group-supervisor/schedule/:id` - Delete training session

### Registrations Management
- `GET /api/v1/age-group-supervisor/registrations?status=pending|approved|rejected` - List registrations
- `POST /api/v1/age-group-supervisor/registrations/:id/approve` - Approve registration (body: {ageGroupId})
- `POST /api/v1/age-group-supervisor/registrations/:id/reject` - Reject registration (body: {reason})

### Players & Coaches
- `GET /api/v1/age-group-supervisor/players?ageGroupId=xxx` - List players (optional filter)
- `GET /api/v1/age-group-supervisor/coaches` - List available coaches

### Reports
- `GET /api/v1/age-group-supervisor/reports/:type` - Get report (types: players, attendance, performance, registrations)

## Secretary Dashboard Backend Endpoints (Required)

The following endpoints need to be implemented on the backend for full Secretary functionality:

### Dashboard
- `GET /api/v1/secretary/dashboard` - Returns stats: todayMeetings, pendingDocuments, unreadMessages, upcomingCalls, tasksToday, scheduledEvents

### Calendar & Meetings
- `GET /api/v1/secretary/calendar` - List all meetings
- `POST /api/v1/secretary/calendar/meetings` - Create new meeting
  - Body: `{ title, titleAr, date, time, duration, location, locationAr, isOnline, meetingLink, attendees, agenda, agendaAr, status }`
- `PATCH /api/v1/secretary/calendar/meetings/:id` - Update meeting
- `DELETE /api/v1/secretary/calendar/meetings/:id` - Delete meeting

### Documents
- `GET /api/v1/secretary/documents` - List all documents
- `POST /api/v1/secretary/documents` - Upload/create new document
  - Body: `{ name, type, fileUrl, priority, assignedTo, dueDate, notes }`
- `POST /api/v1/secretary/documents/:id/approve` - Approve document
- `POST /api/v1/secretary/documents/:id/reject` - Reject document (body: { reason })

### Messages
- `GET /api/v1/secretary/messages` - List all messages
- `POST /api/v1/secretary/messages` - Send new message
  - Body: `{ from: {id, name, email}, to: {id, name, email}, subject, subjectAr, body, bodyAr, priority }`

### Tasks
- `GET /api/v1/secretary/tasks` - List all tasks
- `POST /api/v1/secretary/tasks` - Create new task
  - Body: `{ title, titleAr, description, priority, dueDate, status, assignedBy }`
- `PATCH /api/v1/secretary/tasks/:id` - Update task (status, etc.)

### Calls
- `GET /api/v1/secretary/calls` - List call logs
- `POST /api/v1/secretary/calls` - Add new call
  - Body: `{ type, contactName, contactPhone, date, time, duration, notes, status }`

## Sports Director Dashboard Backend Endpoints (Required)

The following endpoints need to be implemented on the backend for full Sports Director functionality:

### Dashboard
- `GET /api/v1/sports-director/dashboard` - Returns stats: activePrograms, totalAthletes, coachingStaff, upcomingEvents, winRate, trainingHours, pendingApprovals, recentMatches

### Programs CRUD
- `GET /api/v1/sports-director/programs` - List all programs (supports ?status=active&type=training filters)
- `GET /api/v1/sports-director/programs/:id` - Get single program
- `POST /api/v1/sports-director/programs` - Create new program
  - Body: `{ name, nameAr, type, description, descriptionAr, startDate, endDate, participants, maxParticipants, progress, status, coaches }`
- `PATCH /api/v1/sports-director/programs/:id` - Update program
- `DELETE /api/v1/sports-director/programs/:id` - Delete program
- `PATCH /api/v1/sports-director/programs/:id/status` - Update program status only

### Coaches Management
- `GET /api/v1/sports-director/coaches` - List all coaches (supports ?status=active&specialization=xxx filters)
- `GET /api/v1/sports-director/coaches/:id` - Get single coach details
- `GET /api/v1/sports-director/coaches/performance` - Get all coaches performance stats
- `GET /api/v1/sports-director/coaches/:id/performance` - Get specific coach performance with history
- `PATCH /api/v1/sports-director/coaches/:id/rating` - Update coach rating (body: { rating, notes })
- `POST /api/v1/sports-director/coaches/:id/assign` - Assign coach to program (body: { programId })
- `POST /api/v1/sports-director/coaches/:id/message` - Send message to coach (body: { subject, body })

### Athletes Management
- `GET /api/v1/sports-director/athletes` - List all athletes (supports ?team=xxx&coach=xxx&status=active&category=xxx filters)
- `GET /api/v1/sports-director/athletes/:id` - Get single athlete details
- `GET /api/v1/sports-director/athletes/:id/performance` - Get athlete performance history
- `GET /api/v1/sports-director/athletes/:id/attendance` - Get athlete attendance records

### Technical Events
- `GET /api/v1/sports-director/events` - List all events (supports ?type=match&status=scheduled filters)
- `GET /api/v1/sports-director/events/:id` - Get single event
- `POST /api/v1/sports-director/events` - Create new event
  - Body: `{ title, titleAr, type, date, time, location, locationAr, description, descriptionAr, participants, status }`
- `PATCH /api/v1/sports-director/events/:id` - Update event
- `DELETE /api/v1/sports-director/events/:id` - Delete event

### Analytics & Reports
- `GET /api/v1/sports-director/analytics` - Get general analytics (supports ?period=week|month|quarter|year)
- `GET /api/v1/sports-director/analytics/training` - Get training-specific analytics
- `GET /api/v1/sports-director/analytics/matches` - Get match-specific analytics
- `GET /api/v1/sports-director/reports` - List generated reports (supports ?type=performance|attendance|training|match)
- `POST /api/v1/sports-director/reports/generate` - Generate new report (body: { type, period })

### Win Rate & Achievements
- `GET /api/v1/sports-director/win-rate` - Get win rate stats: { winRate, totalMatches, wins, losses, draws }
- `GET /api/v1/sports-director/achievements` - Get list of achievements

### Training Hours
- `GET /api/v1/sports-director/training-hours` - Get training hours summary (supports ?period=xxx)

### Notifications
- `GET /api/v1/sports-director/notifications` - Get all notifications
- `PATCH /api/v1/sports-director/notifications/:id/read` - Mark notification as read
- `PATCH /api/v1/sports-director/notifications/read-all` - Mark all notifications as read

## Executive Director Dashboard Backend Endpoints (Required)

The following endpoints need to be implemented on the backend for full Executive Director functionality:

### Dashboard
- `GET /api/v1/executive-director/dashboard` - Returns stats: totalRevenue, monthlyGrowth, totalMembers, activePartnerships, pendingDecisions, upcomingMeetings, newMembers, memberRetention

### KPIs (Key Performance Indicators)
- `GET /api/v1/executive-director/kpis` - List all KPIs
- `GET /api/v1/executive-director/kpis/:id/detail` - Get KPI detail with history and breakdown
- `PATCH /api/v1/executive-director/kpis/:id` - Update KPI target or value

### Strategic Initiatives CRUD
- `GET /api/v1/executive-director/initiatives` - List all initiatives (supports ?status=xxx&priority=xxx filters)
- `GET /api/v1/executive-director/initiatives/:id` - Get single initiative
- `POST /api/v1/executive-director/initiatives` - Create new initiative
  - Body: `{ title, titleAr, description, descriptionAr, status, priority, deadline, progress, owner, ownerAr, department, departmentAr, budget, spent, tasks }`
- `PATCH /api/v1/executive-director/initiatives/:id` - Update initiative
- `DELETE /api/v1/executive-director/initiatives/:id` - Delete initiative
- `PATCH /api/v1/executive-director/initiatives/:id/progress` - Update initiative progress (body: { progress })
- `POST /api/v1/executive-director/initiatives/:id/tasks` - Add task to initiative

### Partnerships CRUD
- `GET /api/v1/executive-director/partnerships` - List all partnerships (supports ?status=xxx&type=xxx filters)
- `GET /api/v1/executive-director/partnerships/:id` - Get single partnership
- `POST /api/v1/executive-director/partnerships` - Create new partnership
  - Body: `{ partnerName, partnerNameAr, type, status, startDate, endDate, value, currency, contactPerson, contactEmail, contactPhone, description, descriptionAr, benefits }`
- `PATCH /api/v1/executive-director/partnerships/:id` - Update partnership
- `DELETE /api/v1/executive-director/partnerships/:id` - Delete partnership

### Announcements CRUD
- `GET /api/v1/executive-director/announcements` - List all announcements (supports ?status=xxx&type=xxx filters)
- `GET /api/v1/executive-director/announcements/:id` - Get single announcement
- `POST /api/v1/executive-director/announcements` - Create new announcement
  - Body: `{ title, titleAr, content, contentAr, type, priority, status, targetAudience, publishDate, expiryDate, author, authorId }`
- `PATCH /api/v1/executive-director/announcements/:id` - Update announcement
- `DELETE /api/v1/executive-director/announcements/:id` - Delete announcement
- `PATCH /api/v1/executive-director/announcements/:id/publish` - Publish announcement

### Decisions
- `GET /api/v1/executive-director/decisions` - List pending decisions (supports ?status=xxx filter)
- `PATCH /api/v1/executive-director/decisions/:id/status` - Update decision status (body: { status, notes })

### Meetings
- `GET /api/v1/executive-director/meetings` - List all meetings (supports ?status=xxx filter)
- `POST /api/v1/executive-director/meetings` - Create new meeting
- `PATCH /api/v1/executive-director/meetings/:id` - Update meeting

### Analytics & Reports
- `GET /api/v1/executive-director/analytics` - Get general analytics (supports ?period=week|month|quarter|year)
- `GET /api/v1/executive-director/reports/financial` - Get financial report (supports ?period=month|quarter|year&year=xxx&month=xxx)

### Smart Job Notifications System (Required for ALL Roles)
- `GET /api/v1/executive-director/job-notifications` - Get job notifications for user
- `PATCH /api/v1/executive-director/job-notifications/:id/read` - Mark notification as read
- `GET /api/v1/executive-director/matching-jobs` - Get jobs matching user profile
- `POST /api/v1/jobs/:id/apply` - Apply to a job (body: { note })

## Smart Job Notifications System (Global)

This system must be implemented for ALL dashboard roles. It provides intelligent job matching and notifications.

### Job Posting (When club posts a job)
1. System detects suitable users based on: role, skills, department, profile tags
2. Users receive instant notification with: job title, details, club name, deadline, "Apply Now" button

### Job Application (When user applies)
1. Club receives notification with: applicant name, role, CV link, experience summary
2. Status updates are sent to applicant

### Required Endpoints per Role
Replace `{role}` with: executive-director, sports-director, secretary, coach, admin, player, etc.
- `GET /api/v1/{role}/job-notifications` - Get notifications for this role
- `PATCH /api/v1/{role}/job-notifications/:id/read` - Mark as read
- `GET /api/v1/{role}/matching-jobs` - Get matching jobs based on profile

### Notification Types
- `new_job` - New job posted matching user profile
- `application_received` - Application received (for clubs)
- `application_status` - Application status update
- `job_match` - Smart job match based on profile
- `urgent_job` - Urgent job with deadline