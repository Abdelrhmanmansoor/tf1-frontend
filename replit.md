# TF1 Sports Platform

## Overview

TF1 is a sports networking platform for Egypt and the Middle East, envisioned as a "LinkedIn for sports." It aims to connect sports professionals (players, coaches, clubs, specialists) to foster career growth and community. The platform provides a robust, bilingual, multi-role online environment, enabling users to manage profiles, find opportunities, and communicate in real-time.

## User Preferences

- **Design**: Simple, elegant, minimal with blue-cyan-green gradients
- **Performance**: Lightweight, fast-loading pages
- **Language**: Arabic preferred, with English support
- **Direction**: RTL for Arabic, LTR for English

## System Architecture

The TF1 platform is a Next.js 15 web application using the App Router, TypeScript, Tailwind CSS, and Radix UI. State is managed with Zustand, data fetching with TanStack React Query v5 and Axios, and forms with React Hook Form and Zod. It supports internationalization with `next-intl` (Arabic and English, including RTL layout), theming with `next-themes`, real-time features with Socket.io, and animations with Framer Motion.

**UI/UX Decisions:**
- Modern gradient designs (blue-cyan-green) for authentication pages, featuring multi-step forms with real-time validation.
- Consistent footer and navigation.
- Animated and responsive sections for testimonials and statistics.

**Technical Implementations:**
- Frontend routes are organized in the `app/` directory.
- API service layer is under `services/`.
- TypeScript types are defined in `types/`.
- Utility functions are in `lib/`.
- Environment variables (`NEXT_PUBLIC_API_URL`) are used for backend API endpoints.
- Image handling is integrated with Cloudinary.

**Feature Specifications:**
- **Multi-Role System**: Players, Coaches, Clubs, Specialists, and various administrative roles (Administrator, Age Group Supervisor, Sports Director, Executive Director, Secretary), each with dedicated dashboards and profile management.
- **Authentication**: JWT-based with email verification and password reset.
- **Profile Management**: Role-specific dashboards and profiles.
- **Messaging**: Real-time chat.
- **Opportunities**: Sports job board with smart notifications.
- **Admin Dashboards**: Comprehensive site management for various administrative roles, including user control, content management, RBAC, and audit logging.
- **Blog System**: Bilingual content management.
- **Search**: Global search for users, clubs, and opportunities.
- **Bilingual Support**: Full Arabic and English with dynamic RTL/LTR layouts.
- **Join a Match**: Functionality to find and join matches with filtering.
- **Player Age Category System**: Management of player age categories, teams, training programs, matches, performance tracking, and announcements, including specific API endpoints for player dashboards.
- **Real-time Jobs Ticker Bar**: Displays live job events on the landing page, utilizing REST API endpoints and WebSocket events.
- **Player Training Requests System**: Allows players to request and manage training sessions with coaches, including specific API endpoints for request creation, status tracking, and enhanced training session details.

## Recent Changes (Dec 3, 2025)

- **Added separate leader login page** (`/leader/login`) with purple-pink gradient for admin/leader/supervisor access
- **Removed red admin quick-login button** from public `/login` page for security
- **Added home button** with back-to-home navigation on both login and register pages
- **Added logo display** on authentication pages for brand consistency
- **Auto-routing** after login based on user role to appropriate dashboards

## Authentication Pages

- **`/login`** - General public login (blue-cyan-green gradient)
- **`/register`** - Multi-step registration with role selection
- **`/leader/login`** - Dedicated leader/admin/supervisor login (purple-pink gradient)
  - Restricted to admin roles (leader, administrator, sports-director, executive-director)
  - Auto-routes to appropriate dashboard on successful login

## External Dependencies

-   **Backend API**: `https://tf1-backend.onrender.com/api/v1` (configurable via `NEXT_PUBLIC_API_URL`)
-   **Image Storage**: Cloudinary
-   **Real-time Communication**: Socket.io