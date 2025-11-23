# TF1 Sports Platform - Replit Project

## Overview

TF1 is a comprehensive sports networking platform for Egypt and the Middle East - similar to LinkedIn for sports. It connects players, coaches, clubs, and specialists (physiotherapists, nutritionists, fitness trainers, sports psychologists).

## Project Type

Next.js 15 web application with React 19, TypeScript, Tailwind CSS, and various UI components from Radix UI.

## Recent Changes

### November 24, 2025 - Testimonials Section Redesign
- Redesigned testimonials section with world-class modern design
- Changed content to authentic Saudi success stories (عبدالله الغامدي، نورة السبيعي، خالد القحطاني)
- Added gradient background with subtle dot pattern for visual depth
- Implemented premium card design with hover effects and shadow transitions
- Added icon badges for each testimonial with gradient backgrounds
- Integrated location badges (Jeddah, Riyadh, Dammam) for Saudi context
- Enhanced typography with larger headings and better spacing
- Created separate testimonials for both application and recruitment modes with Saudi-focused content

### November 24, 2025 - Categories Slider Final Fix
- Replaced animation-based carousel with native browser scrolling for better performance
- Fixed navigation arrows to scroll through ALL categories without limitations
- Each arrow click scrolls 2 cards at a time (448px mobile, 520px desktop)
- Removed state-based position tracking in favor of smooth native scrolling
- Navigation arrows now work seamlessly in both directions until the end

### November 24, 2025 - Clean UI Enhancement
- Completely removed smooth-scroll-provider distracting elements (floating emojis, scroll indicators, circular progress, velocity indicators)
- Simplified smooth-scroll-provider to basic passthrough component for cleaner UX
- Added clean ScrollToTop button component that appears after 300px scroll with smooth animations
- Removed all animated navigation elements that appeared during gestures

### November 23, 2025 - Banner Carousel Update
- Replaced gradient text banners with customizable image carousel
- Increased banner height to be more prominent (h-64 sm:h-80 md:h-96)
- Removed shadow effect for cleaner look
- Added dots navigation below carousel for manual slide control
- Implemented auto-scroll every 5 seconds with pause on hover
- Made banner images easily customizable via bannerImages array
- Uses Unsplash stock sports images by default

### November 24, 2025 - Testimonials Content Update
- Replaced big club names with smaller organizations (academies and training centers)
- Updated to: أكاديمية الساحل الرياضية, مركز الرياض للياقة البدنية, مركز التميز الرياضي, أكاديمية النخبة الرياضية
- Kept authentic Saudi names and locations for local relevance

### November 23, 2025 - Replit Setup
- Configured Next.js to run on port 5000 with host 0.0.0.0 for Replit compatibility
- Updated next.config.js with webpack polling for file watching in cloud environment
- Set up "Start application" workflow for development server
- Resolved all LSP errors

## Architecture

### Frontend Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI (@radix-ui/react-*)
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query v5
- **Forms**: React Hook Form with Zod validation
- **Internationalization**: next-intl (Arabic/English support)
- **Theme**: next-themes (dark/light mode)
- **Real-time**: Socket.io client
- **Animations**: Framer Motion

### Backend Integration
- Backend API URL: `https://tf1-backend.onrender.com/api/v1`
- Authentication: JWT tokens stored in localStorage
- No backend code in this repository (frontend only)

### Key Features
1. **Multi-Role System**: Players, Coaches, Clubs, Specialists
2. **Authentication**: Email verification, password reset, JWT-based auth
3. **Profile Management**: Role-specific dashboards and profiles
4. **Messaging**: Real-time chat with Socket.io
5. **Opportunities**: Job board for sports positions
6. **Search**: Global search for users, clubs, and opportunities
7. **Bilingual**: Full Arabic and English support with RTL layout

## User Roles

1. **Players**: Find coaches, join clubs, search for opportunities
2. **Coaches**: Manage students, offer training sessions, track earnings
3. **Clubs**: Recruit talent, manage members, post job opportunities
4. **Specialists**: Offer professional services (physio, nutrition, fitness, psychology)

## Project Structure

```
app/                    # Next.js App Router pages
├── dashboard/         # Role-specific dashboards (player, coach, club, specialist)
├── auth/             # Authentication pages
├── profile/          # User profiles
├── messages/         # Messaging interface
├── opportunities/    # Job opportunities
└── ...

components/            # Reusable React components
├── ui/               # Shadcn UI components
├── dashboards/       # Dashboard-specific components
├── messaging/        # Chat components
├── opportunities/    # Opportunity components
└── ...

contexts/             # React Context providers
├── auth-context.tsx  # Authentication state
├── language-context.tsx  # Internationalization
└── socket-context.tsx    # WebSocket connection

services/             # API service layer
├── auth.ts          # Authentication API calls
├── player.ts        # Player-related API
├── coach.ts         # Coach-related API
├── club.ts          # Club-related API
└── ...

config/              # Configuration files
└── api.ts          # API configuration

lib/                # Utility functions
├── utils.ts       # General utilities
├── auth.ts        # Auth helpers
└── msw/          # Mock Service Worker (for testing)

types/              # TypeScript type definitions
├── player.ts
├── coach.ts
└── club.ts
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

## User Preferences

None specified yet.

## Known Issues

None at this time.

## Future Enhancements

See PROJECT-BRIEF.md for detailed feature roadmap including:
- Advanced messaging system
- Rating and review system
- Location-based search
- Payment integration
- Mobile app (React Native)
