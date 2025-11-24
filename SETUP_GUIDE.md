# 🚀 TF1 Admin Dashboard - Setup Guide

## Environment Variables

### Required Variable
```bash
NEXT_PUBLIC_API_URL=https://tf1-backend.onrender.com/api/v1
```

### How to Change Backend URL

**Option 1: Using Replit Secrets Tab**
1. Open your Replit project
2. Go to **Tools** → **Secrets**
3. Add/Edit: `NEXT_PUBLIC_API_URL`
4. Set value to your backend URL
5. Restart the application

**Option 2: Using .env File** (Local Development)
1. Create `.env` file in root directory
2. Add: `NEXT_PUBLIC_API_URL=your-backend-url/api/v1`
3. Restart the dev server

---

## Admin Dashboard Access

### Production URLs
```
https://www.tf1one.com/admin
https://www.tf1one.com/control (redirects to /admin)
```

### Development URLs
```
http://localhost:5000/admin
http://localhost:5000/control (redirects to /admin)
```

---

## Features

### ✅ Working Now (Frontend)
- 📊 Statistics Dashboard with demo data
- 👥 User Management Interface
- ⚙️ Settings Panel
- 🎨 Clean, responsive design
- 🌐 Bilingual (Arabic/English)

### ⚠️ Requires Backend Implementation
- Real-time data from backend
- Block/Unblock user functionality
- Settings persistence
- Activity logs

---

## Backend Requirements

See `BACKEND_URGENT_FIX.md` for detailed backend implementation guide.

**Critical Endpoints:**
1. `GET /api/v1/admin/dashboard` - Statistics
2. `GET /api/v1/admin/users` - User list
3. `PATCH /api/v1/admin/users/:id/block` - Block user
4. `PATCH /api/v1/admin/settings` - Update settings

**CORS Configuration:**
Backend must allow origins:
- `https://tf1one.com`
- `https://www.tf1one.com`
- `http://localhost:5000` (for development)

---

## Deployment

### Using Replit Publish
1. Click **"Publish"** button (top right)
2. Wait for build to complete (~2-3 minutes)
3. Visit: `https://www.tf1one.com/admin`

### Manual Deployment
```bash
npm run build
npm run start
```

---

## Troubleshooting

### Dashboard shows zeros?
- This is normal until backend endpoints are implemented
- Demo data will load automatically when backend is unavailable

### CORS Errors?
- Backend team must configure CORS headers
- See `BACKEND_URGENT_FIX.md` for implementation

### Need to change backend URL?
- Update `NEXT_PUBLIC_API_URL` environment variable
- Restart the application

---

## Support Files

- `BACKEND_URGENT_FIX.md` - Quick backend setup guide
- `ADMIN_BACKEND_COMMANDS.md` - Complete API documentation
- `.env.example` - Environment variables example
- `replit.md` - Full project documentation

---

**Last Updated**: November 24, 2025
