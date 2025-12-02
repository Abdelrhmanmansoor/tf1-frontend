# TF1 Sports Platform

## Overview

TF1 is a comprehensive sports networking platform designed for Egypt and the Middle East, conceptualized as a "LinkedIn for sports." Its primary goal is to connect various sports professionals, including players, coaches, clubs, and specialists (physiotherapists, nutritionists, fitness trainers, sports psychologists), to facilitate career growth and community building within the sports industry. The platform aims to offer a robust, bilingual, and multi-role online environment for sports professionals.

## User Preferences

- **Design**: Simple, elegant, minimal with blue-cyan-green gradients
- **Performance**: Lightweight, fast-loading pages
- **Language**: Arabic preferred, with English support
- **Direction**: RTL for Arabic, LTR for English

## System Architecture

The TF1 platform is a Next.js 15 web application utilizing the App Router. It uses TypeScript for type safety, Tailwind CSS for styling, and Radix UI for accessible UI components. State is managed with Zustand, and data fetching with TanStack React Query v5 and Axios. Form handling employs React Hook Form with Zod validation. The application supports internationalization with `next-intl` for Arabic and English, including RTL layout. Theming is handled by `next-themes` for dark/light mode, real-time features use Socket.io, and animations are powered by Framer Motion.

**Key Features:**

-   **Multi-Role System**: Supports Players, Coaches, Clubs, Specialists, and various administrative roles (Administrator, Age Group Supervisor, Sports Director, Executive Director, Secretary). Each role has dedicated dashboards and profile management.
-   **Authentication**: JWT-based authentication with email verification and password reset.
-   **Profile Management**: Role-specific dashboards and profiles.
-   **Messaging**: Real-time chat functionality.
-   **Opportunities**: A job board for sports-related positions, integrated with a smart job notification system.
-   **Admin Dashboard**: Comprehensive site management for various administrative roles, including user control, content management, and system analytics. Features include an enterprise-grade dual dashboard (Leader and Team) with Role-Based Access Control (RBAC) and audit logging.
-   **Blog System**: Full content management for articles, supporting bilingual content and categorization.
-   **Search**: Global search capabilities across users, clubs, and opportunities.
-   **Bilingual Support**: Full Arabic and English support with dynamic RTL/LTR layouts.
-   **Join a Match Feature**: Functionality for users to find and join matches, with filtering options.

**UI/UX Decisions:**

-   Modern gradient designs (blue-cyan-green) for login/registration pages, featuring multi-step forms with real-time validation and progress indicators.
-   Consistent footer and navigation elements.
-   Animated and responsive sections for testimonials and statistics.

**Technical Implementations:**

-   Frontend routes are organized within the `app/` directory following Next.js App Router conventions.
-   API service layer is structured under `services/`, with dedicated modules.
-   TypeScript types are centrally defined in `types/`.
-   Utility functions are located in `lib/`.
-   Environment variables (`NEXT_PUBLIC_API_URL`) are used for backend API endpoints.
-   Image handling is integrated with Cloudinary.

**Backend Endpoints (Required for various Admin Roles):**

The platform requires extensive backend support for its multi-role system, including dedicated API endpoints for:

-   **Leader Dashboard**: Authentication, team management (CRUD operations, permission updates, key regeneration), audit logging, platform settings, and analytics.
-   **Age Group Supervisor Dashboard**: Public player registration, dashboard statistics, CRUD operations for age groups, matches, and training schedules, registration management (approve/reject), player/coach listings, and reports.
-   **Secretary Dashboard**: Dashboard statistics, calendar/meeting management, document management (upload, approval, rejection), message sending/listing, task management, and call logging.
-   **Sports Director Dashboard**: Dashboard statistics, CRUD for programs and technical events, management of coaches (performance tracking, assignment) and athletes (performance, attendance), analytics, reports, win rate tracking, and notifications.
-   **Executive Director Dashboard**: Dashboard statistics, KPI management, CRUD for strategic initiatives, partnerships, and announcements, decision management, meetings, and financial analytics/reports.
-   **Smart Job Notifications System**: Global endpoints for all roles to retrieve job notifications, mark them as read, and find matching jobs. Specific endpoints exist for applying to jobs and for clubs to receive applicant notifications.

## External Dependencies

-   **Backend API**: `https://tf1-backend.onrender.com/api/v1` (configurable via `NEXT_PUBLIC_API_URL`)
-   **Image Storage**: Cloudinary
-   **Real-time Communication**: Socket.io (WebSocket connection)