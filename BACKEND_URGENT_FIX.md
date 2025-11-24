# 🚨 URGENT: Backend Admin Endpoints Required

## Current Status
- ✅ Frontend admin dashboard is **READY** at `/admin`
- ✅ Frontend configured with environment variable: `NEXT_PUBLIC_API_URL`
- ❌ Backend endpoints return **404 "Route not found"**
- ❌ CORS is blocking requests from frontend

## Environment Configuration
Frontend uses: `NEXT_PUBLIC_API_URL=https://tf1-backend.onrender.com/api/v1`
To change backend URL, update this environment variable in Replit.

## Test Results
```bash
curl https://tf1-backend.onrender.com/api/v1/admin/dashboard
# Response: {"success":false,"error":"Route not found"}
```

---

## 🔧 Required Backend Fixes

### 1. Enable CORS for Frontend
Add to backend CORS configuration:
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'https://tf1one.com',
    'https://www.tf1one.com',
    'http://localhost:5000'
  ],
  credentials: true
}));
```

### 2. Create Admin Endpoints (Priority Order)

#### **HIGH PRIORITY** (Dashboard won't work without these):

```javascript
// 1. Dashboard Statistics
GET /api/v1/admin/dashboard
Response: {
  stats: {
    totalUsers: 1250,
    totalClubs: 42,
    totalJobs: 567,
    activeUsers: 348
  }
}

// 2. Get All Users
GET /api/v1/admin/users
Response: {
  users: [
    {
      _id: "123",
      email: "user@example.com",
      name: "User Name",
      role: "player",
      blocked: false
    }
  ]
}

// 3. Block User
PATCH /api/v1/admin/users/:id/block
Body: {
  reason: "Violation of terms"
}
Response: {
  success: true,
  message: "User blocked"
}

// 4. Unblock User
PATCH /api/v1/admin/users/:id/unblock
Response: {
  success: true,
  message: "User unblocked"
}

// 5. Get Site Settings
GET /api/v1/admin/settings
Response: {
  settings: {
    siteName: "TF1 Sports",
    primaryColor: "#3B82F6",
    secondaryColor: "#A855F7",
    maintenanceMode: false
  }
}

// 6. Update Site Settings
PATCH /api/v1/admin/settings
Body: {
  siteName: "New Name",
  primaryColor: "#FF0000",
  maintenanceMode: true
}
Response: {
  success: true,
  message: "Settings updated"
}
```

#### **MEDIUM PRIORITY**:

```javascript
// 7. Activity Logs
GET /api/v1/admin/logs
Response: {
  logs: [
    {
      _id: "log1",
      action: "User Login",
      user: "user@example.com",
      timestamp: "2025-11-24T12:00:00Z"
    }
  ]
}
```

---

## 📋 Testing Checklist

After implementing, test with:

```bash
# Test dashboard endpoint
curl https://tf1-backend.onrender.com/api/v1/admin/dashboard

# Test users endpoint
curl https://tf1-backend.onrender.com/api/v1/admin/users

# Test CORS
curl -H "Origin: https://tf1one.com" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://tf1-backend.onrender.com/api/v1/admin/dashboard
```

Expected CORS headers in response:
```
Access-Control-Allow-Origin: https://tf1one.com
Access-Control-Allow-Credentials: true
```

---

## 🎯 Timeline

**CRITICAL**: Without these endpoints, the admin dashboard shows only demo data (zeros).

**Estimated Time**: 2-3 hours for basic implementation

---

## 📖 Full Documentation

See `ADMIN_BACKEND_COMMANDS.md` for complete API specifications with examples.

---

## ✅ Verification

Once deployed, notify frontend team. We will verify with:
1. Visit https://www.tf1one.com/admin
2. Check stats appear (not zeros)
3. Test user blocking functionality
4. Confirm settings update

---

**Last Updated**: November 24, 2025  
**Contact**: Frontend Team
