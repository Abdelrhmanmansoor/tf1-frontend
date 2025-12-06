# Backend Notifications System Requirements

## Overview
The frontend notification system is fully implemented and ready to receive notifications from the backend. The backend MUST implement the following functionality to enable real-time notifications.

## Required Backend Endpoints

### 1. GET /api/v1/notifications
Fetch user's notifications with pagination.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `type` (string, optional): Filter by notification type
- `types` (string, optional): Comma-separated list of types

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "_id": "string",
        "userId": "string",
        "recipientId": "string",
        "type": "application_received | application_submitted | application_accepted | application_rejected | application_reviewed | new_job | job_match",
        "title": "string",
        "titleAr": "string",
        "message": "string",
        "messageAr": "string",
        "read": false,
        "createdAt": "ISO date string",
        "jobId": "string (optional)",
        "applicationId": "string (optional)",
        "clubId": "string (optional)",
        "applicantId": "string (optional)",
        "jobData": {
          "title": "string",
          "titleAr": "string",
          "clubName": "string",
          "clubNameAr": "string"
        },
        "applicantData": {
          "name": "string",
          "email": "string",
          "phone": "string"
        }
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 20,
    "unreadCount": 5
  }
}
```

### 2. PATCH /api/v1/notifications/:id/read
Mark a single notification as read.

**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

### 3. PATCH /api/v1/notifications/read-all
Mark all notifications as read for the authenticated user.

**Response:**
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

### 4. GET /api/v1/notifications/unread-count
Get the count of unread notifications.

**Response:**
```json
{
  "success": true,
  "data": {
    "count": 5
  }
}
```

### 5. DELETE /api/v1/notifications/:id
Delete a notification.

**Response:**
```json
{
  "success": true,
  "message": "Notification deleted"
}
```

## Automatic Notification Creation

### CRITICAL: Backend MUST create notifications automatically in these scenarios:

#### 1. When a new job application is submitted (POST /api/v1/jobs/:id/apply)
Create notification for the CLUB owner:
```json
{
  "recipientId": "<club_owner_user_id>",
  "type": "application_received",
  "title": "New Application Received",
  "titleAr": "تم استلام طلب جديد",
  "message": "John Doe has applied for the Football Coach position",
  "messageAr": "قام John Doe بالتقديم على وظيفة مدرب كرة القدم",
  "jobId": "<job_id>",
  "applicationId": "<application_id>",
  "applicantData": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

Create notification for the APPLICANT:
```json
{
  "recipientId": "<applicant_user_id>",
  "type": "application_submitted",
  "title": "Application Submitted",
  "titleAr": "تم إرسال طلبك",
  "message": "Your application for Football Coach at Al-Ahly Club has been submitted",
  "messageAr": "تم إرسال طلبك لوظيفة مدرب كرة القدم في نادي الأهلي",
  "jobId": "<job_id>",
  "applicationId": "<application_id>",
  "jobData": {
    "title": "Football Coach",
    "clubName": "Al-Ahly Club"
  }
}
```

#### 2. When application status changes (PUT /api/v1/club/applications/:id/status)
Create notification for the APPLICANT based on new status:

**If status = "accepted":**
```json
{
  "recipientId": "<applicant_user_id>",
  "type": "application_accepted",
  "title": "Application Accepted!",
  "titleAr": "تم قبول طلبك!",
  "message": "Congratulations! Your application for Football Coach at Al-Ahly Club has been accepted",
  "messageAr": "مبروك! تم قبول طلبك لوظيفة مدرب كرة القدم في نادي الأهلي",
  "jobId": "<job_id>",
  "applicationId": "<application_id>"
}
```

**If status = "rejected":**
```json
{
  "recipientId": "<applicant_user_id>",
  "type": "application_rejected",
  "title": "Application Status Update",
  "titleAr": "تحديث حالة الطلب",
  "message": "Your application for Football Coach at Al-Ahly Club was not selected",
  "messageAr": "لم يتم اختيار طلبك لوظيفة مدرب كرة القدم في نادي الأهلي",
  "jobId": "<job_id>",
  "applicationId": "<application_id>"
}
```

**If status = "under_review" or "interviewed":**
```json
{
  "recipientId": "<applicant_user_id>",
  "type": "application_reviewed",
  "title": "Application Under Review",
  "titleAr": "طلبك قيد المراجعة",
  "message": "Your application for Football Coach is being reviewed by Al-Ahly Club",
  "messageAr": "طلبك لوظيفة مدرب كرة القدم قيد المراجعة من قبل نادي الأهلي",
  "jobId": "<job_id>",
  "applicationId": "<application_id>"
}
```

## WebSocket Events (Real-time)

The frontend listens for the `new_notification` Socket.io event.

When creating a notification, emit to the recipient's socket room:
```javascript
io.to(recipientUserId).emit('new_notification', notificationObject);
```

## Notification Types

| Type | Description | Recipient |
|------|-------------|-----------|
| `application_received` | New application submitted | Club owner |
| `application_submitted` | Confirmation of submission | Applicant |
| `application_accepted` | Application was accepted | Applicant |
| `application_rejected` | Application was rejected | Applicant |
| `application_reviewed` | Application is under review | Applicant |
| `new_job` | New job posted | Matched users |
| `job_match` | Job matches user profile | Matched users |

## Database Schema (MongoDB)

```javascript
const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  type: {
    type: String,
    enum: ['application_received', 'application_submitted', 'application_accepted', 'application_rejected', 'application_reviewed', 'new_job', 'job_match', 'general'],
    required: true
  },
  title: { type: String, required: true },
  titleAr: { type: String },
  message: { type: String, required: true },
  messageAr: { type: String },
  read: { type: Boolean, default: false },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
  clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club' },
  applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  jobData: {
    title: String,
    titleAr: String,
    clubName: String,
    clubNameAr: String
  },
  applicantData: {
    name: String,
    email: String,
    phone: String
  },
  metadata: { type: mongoose.Schema.Types.Mixed }
}, {
  timestamps: true
});

// Indexes for efficient queries
NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ recipientId: 1, createdAt: -1 });
```

## Implementation Priority

1. **HIGH**: Create notifications when application status changes
2. **HIGH**: Create notifications when new application is submitted
3. **MEDIUM**: WebSocket real-time delivery
4. **LOW**: Job matching notifications

## Testing

After implementing, test by:
1. Submitting a job application → Club should see notification
2. Changing application status to "accepted" → Applicant should see notification
3. Changing application status to "rejected" → Applicant should see notification
4. Check /notifications endpoint returns correct data
