# 🎛️ Admin Dashboard - Backend Integration Guide

## Dashboard Location
```
https://tf1one.com/dashboard/admin
```

---

## 🔌 Backend Endpoints Required

### 1. **Get Dashboard Stats**
```bash
GET /api/v1/admin/dashboard
```

**Response:**
```json
{
  "stats": {
    "totalUsers": 1500,
    "totalClubs": 250,
    "totalJobs": 890,
    "activeUsers": 450
  }
}
```

---

### 2. **Get All Users**
```bash
GET /api/v1/admin/users
```

**Response:**
```json
{
  "users": [
    {
      "_id": "user123",
      "email": "player@tf1.com",
      "name": "أحمد محمد",
      "role": "player",
      "blocked": false
    }
  ]
}
```

---

### 3. **Block User**
```bash
PATCH /api/v1/admin/users/:userId/block
Content-Type: application/json

{
  "reason": "سلوك غير مناسب"
}
```

**Response:**
```json
{
  "user": {
    "_id": "user123",
    "email": "player@tf1.com",
    "blocked": true,
    "blockedReason": "سلوك غير مناسب"
  }
}
```

---

### 4. **Unblock User**
```bash
PATCH /api/v1/admin/users/:userId/unblock
```

**Response:**
```json
{
  "user": {
    "_id": "user123",
    "blocked": false
  }
}
```

---

### 5. **Get/Update Settings**
```bash
GET /api/v1/admin/settings
```

**Response:**
```json
{
  "settings": {
    "_id": "settings1",
    "siteName": "TF1 Sports",
    "primaryColor": "#3B82F6",
    "secondaryColor": "#A855F7",
    "maintenanceMode": false
  }
}
```

**Update Settings:**
```bash
PATCH /api/v1/admin/settings
Content-Type: application/json

{
  "siteName": "TF1 Sports Platform",
  "primaryColor": "#3B82F6",
  "secondaryColor": "#A855F7",
  "maintenanceMode": false
}
```

---

### 6. **Get Activity Logs**
```bash
GET /api/v1/admin/logs?limit=50
```

**Response:**
```json
{
  "logs": [
    {
      "_id": "log123",
      "userId": "user123",
      "action": "login",
      "details": { "ip": "192.168.1.1" },
      "timestamp": "2025-11-24T12:00:00Z"
    }
  ]
}
```

---

### 7. **Get User Activity**
```bash
GET /api/v1/admin/user-activity/:userId
```

**Response:**
```json
{
  "activities": [
    {
      "_id": "activity123",
      "action": "profile_updated",
      "timestamp": "2025-11-24T12:00:00Z",
      "details": { "updatedFields": ["bio", "phone"] }
    }
  ]
}
```

---

## 📝 Backend Implementation Checklist

### 1. Create Admin Controller
```javascript
// src/controllers/adminController.js

exports.getDashboardStats = async (req, res) => {
  // Return: totalUsers, totalClubs, totalJobs, activeUsers
  // Query from User, Club, Job, and Activity models
};

exports.getAllUsers = async (req, res) => {
  // Return array of users with: _id, email, name, role, blocked
};

exports.blockUser = async (req, res) => {
  // Update user: blocked = true, blockedReason = req.body.reason
  // Log the action
};

exports.unblockUser = async (req, res) => {
  // Update user: blocked = false, blockedReason = null
};

exports.getSettings = async (req, res) => {
  // Return settings document with colors, siteName, maintenance mode
};

exports.updateSettings = async (req, res) => {
  // Update settings with new values
};

exports.getActivityLogs = async (req, res) => {
  // Return activity logs with pagination
};

exports.getUserActivity = async (req, res) => {
  // Return specific user's activity
};
```

---

### 2. Create Activity Logging Middleware
```javascript
// src/middleware/logActivity.js

const logActivity = async (req, res, next) => {
  // Before response, log: userId, action, details, timestamp
  // Save to ActivityLog model
};
```

---

### 3. Create Admin Routes
```javascript
// src/routes/admin.js

router.get('/admin/dashboard', getDashboardStats);
router.get('/admin/users', getAllUsers);
router.patch('/admin/users/:userId/block', blockUser);
router.patch('/admin/users/:userId/unblock', unblockUser);
router.get('/admin/settings', getSettings);
router.patch('/admin/settings', updateSettings);
router.get('/admin/logs', getActivityLogs);
router.get('/admin/user-activity/:userId', getUserActivity);
```

---

### 4. Database Models Needed

**ActivityLog Model:**
```javascript
{
  userId: ObjectId,
  action: String,
  details: Object,
  timestamp: Date (default: now),
  ipAddress: String
}
```

**Settings Model:**
```javascript
{
  siteName: String,
  primaryColor: String,
  secondaryColor: String,
  maintenanceMode: Boolean,
  updatedAt: Date
}
```

---

## 🔐 Security Requirements

- ✅ Add `adminCheck` middleware to all admin routes
- ✅ Only allow admins to access these endpoints
- ✅ Log all admin actions for audit trail
- ✅ Validate input data before processing
- ✅ Return meaningful error messages

---

## 🧪 Testing the Endpoints

### cURL Examples:

```bash
# Get stats
curl https://tf1-backend.onrender.com/api/v1/admin/dashboard

# Get users
curl https://tf1-backend.onrender.com/api/v1/admin/users

# Block user
curl -X PATCH https://tf1-backend.onrender.com/api/v1/admin/users/user123/block \
  -H "Content-Type: application/json" \
  -d '{"reason": "سلوك غير مناسب"}'

# Get settings
curl https://tf1-backend.onrender.com/api/v1/admin/settings

# Update settings
curl -X PATCH https://tf1-backend.onrender.com/api/v1/admin/settings \
  -H "Content-Type: application/json" \
  -d '{"primaryColor": "#FF0000", "siteName": "New Name"}'
```

---

## 📞 Integration Notes

- Frontend is ready at `/dashboard/admin`
- All endpoints are called to `https://tf1-backend.onrender.com`
- Dashboard will auto-refresh when backend is ready
- No authentication required for initial setup (can add JWT later)

---

**Status: ⏳ Waiting for Backend Implementation**
