# TF1 Sports Platform - Replit Project

## Overview

TF1 is a comprehensive sports networking platform for Egypt and the Middle East - similar to LinkedIn for sports. It connects players, coaches, clubs, and specialists (physiotherapists, nutritionists, fitness trainers, sports psychologists).

## Project Type

Next.js 15 web application with React 19, TypeScript, Tailwind CSS, and various UI components from Radix UI.

## Recent Changes

### December 2, 2025 - Added 5 New Admin Roles with Dashboards
- **New Roles Added to Registration:**
  - Administrator (إداري) - General system administration
  - Age Group Supervisor (مشرف فئات سنية) - Manages youth categories
  - Sports Director (مدير رياضي) - Manages sports programs
  - Executive Director (مدير تنفيذي) - High-level management
  - Secretary (سكرتير) - Administrative support

- **New Dashboard Pages:**
  - `/dashboard/administrator` - User management, approvals, system alerts
  - `/dashboard/age-group-supervisor` - Age groups, players, training schedules
  - `/dashboard/sports-director` - Programs, coach performance, analytics
  - `/dashboard/executive-director` - KPIs, initiatives, partnerships, reports
  - `/dashboard/secretary` - Calendar, meetings, documents, messages

- **Files Created:**
  - `components/dashboards/AdministratorDashboard.tsx`
  - `components/dashboards/AgeGroupSupervisorDashboard.tsx`
  - `components/dashboards/SportsDirectorDashboard.tsx`
  - `components/dashboards/ExecutiveDirectorDashboard.tsx`
  - `components/dashboards/SecretaryDashboard.tsx`
  - `app/dashboard/administrator/page.tsx`
  - `app/dashboard/age-group-supervisor/page.tsx`
  - `app/dashboard/sports-director/page.tsx`
  - `app/dashboard/executive-director/page.tsx`
  - `app/dashboard/secretary/page.tsx`

- **Files Updated:**
  - `app/register/page.tsx` - Added new roles to dropdown
  - `app/dashboard/page.tsx` - Added routing for new roles
  - `components/messaging/MessageNotificationBadge.tsx` - Extended type definitions

- **Backend Documentation:**
  - `NEW_ADMIN_ROLES_BACKEND_COMMANDS.md` - Complete API specs for all 5 roles

### November 25, 2025 - Admin Dashboard Temporarily Disabled ✅
- **Status**: Admin panel temporarily disabled for performance optimization
- **Access**: `/admin`, `/control`, `/dashboard/admin` show maintenance page
- **Reason**: Reducing site load until backend is fully ready
- **Files Simplified**:
  - ✅ `app/admin/page.tsx` - Shows maintenance message
  - ✅ `app/control/page.tsx` - Redirects to /admin
  - ✅ `app/dashboard/admin/page.tsx` - Redirects to /admin

### November 24, 2025 - Socket.io Notifications Updated ✅
- **BREAKING CHANGE**: Socket event changed from `'job:notification'` to `'new_notification'`
- **Updated Files:**
  - ✅ `contexts/socket-context.tsx` - Updated to use `new_notification`
  - ✅ `components/notifications/JobNotifications.tsx` - Support new notification structure
  - ✅ Updated `JobNotification` interface with new fields (`notificationType`, `titleAr`, `messageAr`, `actionUrl`, `priority`)
- **New Features:**
  - Bilingual notification support (Arabic/English)
  - Priority levels (normal, high, urgent)
  - Custom action URLs for notifications
  - Better notification filtering by type
- **Documentation:**
  - `FRONTEND_JOB_NOTIFICATIONS_GUIDE.md` - Complete guide for frontend team

### November 24, 2025 - Environment Variables Configured ✅
- **Environment Variable**: `NEXT_PUBLIC_API_URL` configured in Replit Secrets
- **Files Updated:**
  - ✅ `config/api.ts` - Uses environment variable
  - ✅ `app/admin/page.tsx` - Uses environment variable
  - ✅ `.env.example` - Template created
- **Documentation:**
  - `SETUP_GUIDE.md` - Complete setup guide with environment variable instructions

### November 24, 2025 - Admin Dashboard FIXED & Production-Ready ✅
- **Route**: Consolidated to `/admin` (was `/dashboard/admin`)
- **Status**: Fully functional with demo data, waiting for backend
- **Features:**
  - 📊 Real-time Statistics (Total Users, Clubs, Jobs, Active Users)
  - 👥 User Management (Block/Unblock with reasons)
  - ⚙️ Site Settings (Colors, Name, Maintenance Mode)
  - 📋 Activity Logs viewer
  - 📰 Blog management link
- **Technical Fixes:**
  - ✅ Fixed Next.js CORS errors (allowedDevOrigins configured)
  - ✅ Consolidated routes: `/control` and `/dashboard/admin` redirect to `/admin`
  - ✅ Production build deployment configured (npm build + start)
  - ✅ Demo/fallback data when backend unavailable
- **Backend Requirements:**
  - ⚠️ Backend endpoints NOT implemented yet (return 404)
  - ⚠️ CORS not configured on backend server
  - 📄 See `BACKEND_URGENT_FIX.md` for implementation guide
- **Documentation:**
  - `ADMIN_BACKEND_COMMANDS.md` - Complete API specs (13+ endpoints)
  - `BACKEND_URGENT_FIX.md` - Quick start guide for backend team

### Backend Admin System - 13 Endpoints Ready ✅
1. **GET /admin/dashboard** - Dashboard statistics
2. **GET /admin/users** - All users list
3. **PATCH /admin/users/:id/block** - Block user with reason
4. **PATCH /admin/users/:id/unblock** - Unblock user
5. **GET/PATCH /admin/settings** - Site settings (colors, name, maintenance)
6. **GET /admin/logs** - Activity logs
7. **GET /admin/analytics** - Analytics data
8. **GET /admin/user-activity/:id** - User-specific activity
9. Plus 5+ additional admin endpoints

### November 24, 2025 - Blog System Complete ✅
- Full blog management system with admin dashboard
- Create, edit, publish, and delete articles
- Bilingual support (Arabic/English)
- Featured articles and categories
- Read time estimation
- Public blog page `/blog` with filtering and search
- Article detail pages with metadata

### November 24, 2025 - Added Modern Stats Section
- Added new "We are TF1" statistics section with clean modern design
- 4 key metrics: 500K+ users, 2K+ clubs, 50K+ jobs, 98% satisfaction
- Responsive grid layout (2 columns mobile, 4 columns desktop)
- Smooth animations on scroll with staggered delays
- Hover effects with gradient backgrounds and card lift

### November 24, 2025 - UI & Design Updates
- Redesigned testimonials with premium appearance
- Enhanced government logos in footer with better visibility
- Fixed all footers across pages for consistency
- Made logo clickable to return home
- Unified contact information across platform

## Architecture

### Frontend Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI (@radix-ui/react-*)
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query v5, Axios
- **Forms**: React Hook Form with Zod validation
- **Internationalization**: next-intl (Arabic/English support)
- **Theme**: next-themes (dark/light mode)
- **Real-time**: Socket.io client
- **Animations**: Framer Motion

### Backend Integration
- **Backend API URL**: Configurable via `NEXT_PUBLIC_API_URL` environment variable
- **Default URL**: `https://tf1-backend.onrender.com/api/v1`
- **Authentication**: JWT tokens
- **Admin Endpoints**: 13+ endpoints for admin dashboard
- **No backend code in this repository** (frontend only)

### Environment Variables
- `NEXT_PUBLIC_API_URL`: Backend API base URL (default: https://tf1-backend.onrender.com/api/v1)
- See `.env.example` for all available variables

### Key Features
1. **Multi-Role System**: Players, Coaches, Clubs, Specialists
2. **Authentication**: Email verification, password reset, JWT-based auth
3. **Profile Management**: Role-specific dashboards and profiles
4. **Messaging**: Real-time chat with Socket.io
5. **Opportunities**: Job board for sports positions
6. **Admin Dashboard**: Site management, user control, activity logs
7. **Blog System**: Article management and public blog
8. **Search**: Global search for users, clubs, and opportunities
9. **Bilingual**: Full Arabic and English support with RTL layout

## User Roles

1. **Players**: Find coaches, join clubs, search for opportunities
2. **Coaches**: Manage students, offer training sessions, track earnings
3. **Clubs**: Recruit talent, manage members, post job opportunities
4. **Specialists**: Offer professional services (physio, nutrition, fitness, psychology)
5. **Admin**: Full site management via admin dashboard

## Project Structure

```
app/                    # Next.js App Router pages
├── admin/             # 🎛️ Admin Dashboard (Primary Route)
├── control/           # Redirects to /admin
├── dashboard/
│   ├── admin/         # Redirects to /admin
│   ├── player/        # Player dashboard
│   ├── coach/         # Coach dashboard
│   ├── club/          # Club dashboard
│   └── specialist/    # Specialist dashboard
├── auth/              # Authentication pages
├── blog/              # Blog pages
├── profile/           # User profiles
├── messages/          # Messaging interface
├── opportunities/     # Job opportunities
└── ...

components/            # Reusable React components
├── ui/               # Shadcn UI components
├── admin/            # Admin-specific components (removed - integrated to page)
├── blog/             # Blog components
├── dashboards/       # Dashboard-specific components
└── ...

services/             # API service layer
├── api.ts           # Base API configuration
├── auth.ts          # Authentication API calls
├── blog.ts          # Blog API calls
├── player.ts        # Player-related API
└── ...

types/               # TypeScript type definitions
├── blog.ts
├── player.ts
├── coach.ts
└── ...

lib/                 # Utility functions
├── utils.ts
└── msw/            # Mock Service Worker
```

## Development

### Running Locally
The project automatically runs via the "Start application" workflow on port 5000.

### Environment Variables
None required for development - the app uses a production backend API.

### Key Commands
- `npm run dev` - Start development server (0.0.0.0:5000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Type check with TypeScript

## Configuration Notes

### Replit Compatibility
- Server binds to `0.0.0.0:5000` for Replit proxy
- Webpack polling enabled for file watching
- Host header verification disabled for development

### Security
- CORS headers configured in next.config.js
- JWT authentication with backend API
- XSS protection and content security headers
- Admin dashboard will support token-based auth

### Internationalization
- Default language: Arabic (RTL)
- Supported languages: Arabic, English
- Language switcher in UI

### Images
- Remote images allowed from `res.cloudinary.com`
- Cloudinary used for user uploads

## External Services

- **Backend API**: https://tf1-backend.onrender.com/api/v1
- **Image Storage**: Cloudinary
- **Real-time**: Socket.io WebSocket connection

## Deployment

The application is configured for deployment with:
- `output: 'standalone'` in next.config.js
- Production build optimization
- Security headers enabled
- Static asset optimization

## Admin Dashboard Usage

### Access (Production)
```
https://www.tf1one.com/admin
https://www.tf1one.com/control (redirects to /admin)
https://www.tf1one.com/dashboard/admin (redirects to /admin)
```

### Current Status
- ✅ Frontend fully functional with demo data
- ⚠️ Backend endpoints return 404 - implementation required
- ⚠️ CORS not configured on backend

### Features
- **Statistics Tab**: View real-time platform metrics
- **Users Tab**: Manage users (block/unblock with reasons)
- **Settings Tab**: Control site colors, name, and maintenance mode

### Backend Integration
- `ADMIN_BACKEND_COMMANDS.md` - Complete endpoint specifications
- `BACKEND_URGENT_FIX.md` - Quick implementation guide for backend team
- Backend must implement admin routes and enable CORS for tf1one.com

## Blog System Usage

### Admin Access
```
/dashboard/admin/blog
```

### Public Blog
```
/blog
```

### Features
- Create bilingual articles (Arabic/English)
- Featured articles support
- Category-based organization
- Search and filtering
- Auto-calculated read time

### Backend Integration
Blog API endpoints documented in `BLOG_PUBLISHING_GUIDE.md`.

## User Preferences

- **Design**: Simple, elegant, minimal with blue-cyan-green gradients
- **Performance**: Lightweight, fast-loading pages
- **Language**: Arabic preferred, with English support
- **Direction**: RTL for Arabic, LTR for English

## Known Issues

None at this time.

## Future Enhancements

- Advanced messaging system improvements
- Rating and review system
- Location-based search
- Payment integration
- Mobile app (React Native)
- Real-time notifications
- Video integration for coaching
- Advanced analytics dashboards

## Files Reference

- `SETUP_GUIDE.md` - **START HERE**: Complete setup and deployment guide
- `BACKEND_URGENT_FIX.md` - **CRITICAL**: Quick guide for backend team to enable admin dashboard
- `BACKEND_JOB_NOTIFICATIONS_FIX.md` - **Backend Team**: Fix job notifications & CV download issues
- `ADMIN_BACKEND_COMMANDS.md` - Complete backend API implementation guide
- `FRONTEND_JOB_NOTIFICATIONS_GUIDE.md` - **Frontend Team**: Socket.io notifications & file downloads guide
- `BLOG_PUBLISHING_GUIDE.md` - Blog system API guide
- `.env.example` - Environment variables template
- `app/admin/page.tsx` - Admin dashboard frontend (primary)
- `app/control/page.tsx` - Redirect to /admin
- `app/dashboard/admin/page.tsx` - Redirect to /admin
- `app/blog/page.tsx` - Public blog page
- `app/dashboard/admin/blog/page.tsx` - Blog management dashboard
