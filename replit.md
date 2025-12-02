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