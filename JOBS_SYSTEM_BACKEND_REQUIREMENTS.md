# Backend Requirements for Jobs & Applications System

## Overview
This document outlines the backend API requirements needed to support the enhanced jobs and applications system in the frontend.

## Table of Contents
1. [Job Posting Endpoints](#job-posting-endpoints)
2. [Application Endpoints](#application-endpoints)
3. [Notification Endpoints](#notification-endpoints)
4. [Data Models](#data-models)
5. [Email Notifications](#email-notifications)

---

## Job Posting Endpoints

### 1. Create Job Posting
**Endpoint:** `POST /api/v1/clubs/jobs`

**Request Body:**
```json
{
  "title": "Football Coach",
  "titleAr": "مدرب كرة قدم",
  "description": "We are looking for an experienced football coach...",
  "descriptionAr": "نبحث عن مدرب كرة قدم ذو خبرة...",
  "jobType": "permanent",
  "category": "coach",
  "sport": "Football",
  "employmentType": "full_time",
  "city": "Riyadh",
  "country": "Saudi Arabia",
  "requirements": {
    "description": "Minimum 5 years experience...",
    "minimumExperience": 5,
    "educationLevel": "Bachelor's Degree",
    "skills": ["Leadership", "Communication", "Planning"]
  },
  "numberOfPositions": 2,
  "applicationDeadline": "2024-12-31T23:59:59Z",
  "expectedStartDate": "2025-01-15",
  "meetingDate": "2025-01-10",
  "meetingTime": "10:00",
  "meetingLocation": "Club Stadium"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Job created successfully",
  "job": {
    "_id": "job123",
    "title": "Football Coach",
    "status": "active",
    "createdAt": "2024-12-10T10:00:00Z",
    ...
  }
}
```

### 2. Get Club Jobs
**Endpoint:** `GET /api/v1/clubs/jobs`

**Query Parameters:**
- `status` (optional): active, closed, filled, draft
- `category` (optional): coach, player, specialist, staff
- `sport` (optional): Sport name

**Response:**
```json
{
  "success": true,
  "jobs": [...],
  "total": 10
}
```

---

## Application Endpoints

### 1. Submit Job Application
**Endpoint:** `POST /api/v1/jobs/:jobId/apply`

**Request:** Multipart form data
```
resume: File (PDF, DOC, DOCX - max 10MB)
phone: "+966501234567"
whatsapp: "+966501234567"
age: "25"
city: "Riyadh"
qualification: "Bachelor in Sports Science"
experienceYears: "5"
coverLetter: "I am writing to express my interest..."
portfolio: "https://myportfolio.com" (optional)
linkedin: "https://linkedin.com/in/username" (optional)
```

**Response:**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "application": {
    "_id": "app123",
    "jobId": "job123",
    "applicantId": "user123",
    "status": "new",
    "attachments": [
      {
        "type": "resume",
        "name": "resume.pdf",
        "url": "https://storage.example.com/resumes/resume123.pdf",
        "uploadedAt": "2024-12-10T10:00:00Z"
      }
    ],
    "applicantSnapshot": {
      "phone": "+966501234567",
      "age": 25,
      "city": "Riyadh",
      "qualification": "Bachelor in Sports Science",
      "experienceYears": 5
    },
    "whatsapp": "+966501234567",
    "portfolio": "https://myportfolio.com",
    "linkedin": "https://linkedin.com/in/username",
    "coverLetter": "I am writing to express...",
    "createdAt": "2024-12-10T10:00:00Z"
  }
}
```

### 2. Get Club Applications
**Endpoint:** `GET /api/v1/clubs/applications`

**Query Parameters:**
- `status` (optional): new, under_review, interviewed, offered, hired, rejected
- `jobId` (optional): Filter by specific job
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**
```json
{
  "success": true,
  "applications": [
    {
      "_id": "app123",
      "jobId": {
        "_id": "job123",
        "title": "Football Coach"
      },
      "applicantId": {
        "_id": "user123",
        "fullName": "Ahmed Ali",
        "email": "ahmed@example.com"
      },
      "status": "new",
      "applicantSnapshot": {
        "phone": "+966501234567",
        "age": 25,
        "city": "Riyadh",
        "qualification": "Bachelor",
        "experienceYears": 5
      },
      "whatsapp": "+966501234567",
      "portfolio": "https://portfolio.com",
      "linkedin": "https://linkedin.com/in/user",
      "coverLetter": "...",
      "attachments": [
        {
          "type": "resume",
          "url": "https://storage.example.com/resume.pdf",
          "name": "resume.pdf"
        }
      ],
      "createdAt": "2024-12-10T10:00:00Z",
      "updatedAt": "2024-12-10T10:00:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalClubs": 50,
    "limit": 10
  }
}
```

### 3. Get Applicant's Applications
**Endpoint:** `GET /api/v1/applications/my-applications`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "applications": [
    {
      "_id": "app123",
      "jobId": {
        "_id": "job123",
        "title": "Football Coach",
        "titleAr": "مدرب كرة قدم",
        "clubId": {
          "clubName": "Al Hilal FC",
          "clubNameAr": "نادي الهلال",
          "logo": "https://..."
        }
      },
      "status": "under_review",
      "createdAt": "2024-12-10T10:00:00Z",
      "updatedAt": "2024-12-11T14:30:00Z",
      "interview": {
        "isScheduled": true,
        "scheduledDate": "2024-12-20T10:00:00Z",
        "type": "in_person",
        "location": "Club Stadium"
      },
      "statusHistory": [
        {
          "status": "new",
          "date": "2024-12-10T10:00:00Z"
        },
        {
          "status": "under_review",
          "date": "2024-12-11T14:30:00Z",
          "message": "Your application is being reviewed"
        }
      ]
    }
  ]
}
```

### 4. Update Application Status
**Endpoint:** `POST /api/v1/clubs/applications/:applicationId/review`
**Endpoint:** `POST /api/v1/clubs/applications/:applicationId/interview`
**Endpoint:** `POST /api/v1/clubs/applications/:applicationId/offer`
**Endpoint:** `POST /api/v1/clubs/applications/:applicationId/hire`
**Endpoint:** `POST /api/v1/clubs/applications/:applicationId/reject`

**Request Body (for offer/hire):**
```json
{
  "message": "Congratulations! We would like to offer you the position...",
  "contactPhone": "+966501234567",
  "contactAddress": "Club Stadium, Riyadh",
  "meetingDate": "2024-12-20",
  "meetingTime": "10:00",
  "meetingLocation": "Club Office",
  "applicantName": "Ahmed Ali",
  "applicantEmail": "ahmed@example.com",
  "jobTitle": "Football Coach"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Application status updated",
  "application": {
    "_id": "app123",
    "status": "offered",
    "updatedAt": "2024-12-15T10:00:00Z"
  }
}
```

**Important:** When status is updated to "offered" or "hired", the backend should:
1. Send an email notification to the applicant
2. Create an in-app notification for the applicant
3. Include contact information and meeting details in the email

---

## Notification Endpoints

### 1. Get Notifications
**Endpoint:** `GET /api/v1/notifications`

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page (default: 20)
- `type` (optional): Filter by notification type
- `types` (optional): Comma-separated list of types

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "_id": "notif123",
        "userId": "user123",
        "recipientId": "club456",
        "type": "application_received",
        "title": "New Job Application",
        "titleAr": "طلب وظيفة جديد",
        "message": "You have received a new application for Football Coach position",
        "messageAr": "لقد تلقيت طلب جديد لوظيفة مدرب كرة قدم",
        "read": false,
        "jobId": "job123",
        "applicationId": "app123",
        "clubId": "club456",
        "applicantData": {
          "name": "Ahmed Ali",
          "email": "ahmed@example.com"
        },
        "jobData": {
          "title": "Football Coach",
          "titleAr": "مدرب كرة قدم"
        },
        "createdAt": "2024-12-10T10:00:00Z"
      }
    ],
    "total": 25,
    "page": 1,
    "limit": 20,
    "unreadCount": 5
  }
}
```

### 2. Mark Notification as Read
**Endpoint:** `PATCH /api/v1/notifications/:notificationId/read`

**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

### 3. Mark All as Read
**Endpoint:** `PATCH /api/v1/notifications/read-all`

**Response:**
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

### 4. Get Unread Count
**Endpoint:** `GET /api/v1/notifications/unread-count`

**Response:**
```json
{
  "success": true,
  "data": {
    "count": 5
  }
}
```

### 5. Delete Notification
**Endpoint:** `DELETE /api/v1/notifications/:notificationId`

**Response:**
```json
{
  "success": true,
  "message": "Notification deleted"
}
```

---

## Data Models

### Job Model
```javascript
{
  _id: ObjectId,
  clubId: ObjectId (ref: 'Club'),
  title: String (required),
  titleAr: String,
  description: String (required),
  descriptionAr: String,
  jobType: String (enum: ['permanent', 'contract', 'temporary', 'internship']),
  category: String (enum: ['coach', 'player', 'specialist', 'staff', 'management']),
  sport: String,
  employmentType: String (enum: ['full_time', 'part_time', 'freelance']),
  city: String,
  country: String,
  requirements: {
    description: String,
    minimumExperience: Number,
    educationLevel: String,
    certifications: [String],
    skills: [String],
    languages: [String]
  },
  responsibilities: [{
    responsibility: String,
    responsibilityAr: String
  }],
  numberOfPositions: Number (default: 1),
  applicationDeadline: Date,
  expectedStartDate: String,
  meetingDate: String,
  meetingTime: String,
  meetingLocation: String,
  status: String (enum: ['draft', 'active', 'closed', 'filled'], default: 'active'),
  applicationStats: {
    totalApplications: Number (default: 0),
    newApplications: Number (default: 0),
    interviewed: Number (default: 0)
  },
  views: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### Application Model
```javascript
{
  _id: ObjectId,
  jobId: ObjectId (ref: 'Job'),
  clubId: ObjectId (ref: 'Club'),
  applicantId: ObjectId (ref: 'User'),
  status: String (enum: ['new', 'under_review', 'interviewed', 'offered', 'hired', 'rejected'], default: 'new'),
  applicantSnapshot: {
    phone: String,
    age: Number,
    city: String,
    qualification: String,
    experienceYears: Number,
    rating: Number
  },
  coverLetter: String,
  whatsapp: String,
  portfolio: String,
  linkedin: String,
  attachments: [{
    type: String (enum: ['resume', 'cv', 'certificate', 'portfolio', 'video', 'other']),
    name: String,
    url: String,
    uploadedAt: Date
  }],
  interview: {
    isScheduled: Boolean (default: false),
    scheduledDate: Date,
    type: String (enum: ['in_person', 'video', 'phone']),
    location: String,
    notes: String
  },
  hiring: {
    membershipId: ObjectId,
    startDate: String,
    contractUrl: String
  },
  statusHistory: [{
    status: String,
    date: Date,
    message: String,
    updatedBy: ObjectId (ref: 'User')
  }],
  adminNotes: String,
  createdAt: Date,
  updatedAt: Date,
  submittedAt: Date
}
```

### Notification Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'), // Creator of notification
  recipientId: ObjectId (ref: 'User'), // Recipient
  type: String (enum: [
    'application_received',
    'application_submitted',
    'application_accepted',
    'application_rejected',
    'application_reviewed',
    'new_job',
    'job_match',
    'urgent_job',
    'general'
  ]),
  title: String (required),
  titleAr: String (required),
  message: String (required),
  messageAr: String (required),
  read: Boolean (default: false),
  jobId: ObjectId (ref: 'Job'),
  applicationId: ObjectId (ref: 'Application'),
  clubId: ObjectId (ref: 'Club'),
  applicantId: ObjectId (ref: 'User'),
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
  metadata: Mixed,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Email Notifications

### When Application is Submitted
**Trigger:** POST /api/v1/jobs/:jobId/apply

**Email to Club:**
- **Subject:** "New Job Application Received - [Job Title]"
- **Content:**
  - Applicant name
  - Job title
  - Application date
  - Link to view application in dashboard

**Email to Applicant:**
- **Subject:** "Application Submitted Successfully - [Job Title]"
- **Content:**
  - Confirmation message
  - Job title and club name
  - Application reference number
  - What to expect next

### When Application Status Changes to "Offered" or "Hired"
**Trigger:** POST /api/v1/clubs/applications/:id/offer or /hire

**Email to Applicant:**
- **Subject:** "Congratulations! Job Offer from [Club Name]"
- **Content:**
  - Congratulations message
  - Job title and club name
  - Custom message from club
  - Contact information (phone, address)
  - Meeting details (date, time, location)
  - Next steps

**Example Email Template:**
```
Subject: Congratulations! Job Offer from Al Hilal FC

Dear Ahmed Ali,

Congratulations! We are pleased to offer you the position of Football Coach at Al Hilal FC.

Message from the club:
[Custom message from club]

Meeting Details:
Date: December 20, 2024
Time: 10:00 AM
Location: Club Office, Riyadh

Contact Information:
Phone: +966 50 123 4567
Address: Al Hilal Stadium, Riyadh, Saudi Arabia

Please contact us at your earliest convenience to discuss the next steps.

Best regards,
Al Hilal FC
```

### When Application Status Changes to "Rejected"
**Email to Applicant:**
- **Subject:** "Application Status Update - [Job Title]"
- **Content:**
  - Thank you message
  - Notification of decision
  - Encouragement to apply for future positions

---

## Implementation Notes

### File Upload
- Use cloud storage (AWS S3, Google Cloud Storage, or similar)
- Generate secure, time-limited URLs for viewing CVs
- Implement proper access control (only club can view their applicants' CVs)
- Support PDF, DOC, DOCX formats
- Maximum file size: 10MB

### Permissions
- Only club owners/admins can view applications for their jobs
- Only applicants can view their own application details
- Implement proper role-based access control (RBAC)

### Notifications
- Create notification when application is submitted (for club)
- Create notification when status changes (for applicant)
- Support real-time updates (WebSocket/Socket.io recommended)
- Store notifications in database for persistence
- Mark notifications as read/unread

### Data Population
When fetching applications, populate:
- `applicantId` with user details (fullName, email, profilePhoto)
- `jobId` with job details (title, titleAr, sport)
- `clubId` with club details (clubName, clubNameAr, logo)

### Validation
- Validate file types and sizes
- Validate phone numbers format
- Validate dates (deadline must be in future)
- Validate required fields
- Sanitize user inputs

---

## Testing Checklist

- [ ] Create job with all fields
- [ ] Submit application with CV upload
- [ ] View applications in club dashboard
- [ ] Display applicant's real name (not "user")
- [ ] View CV/resume from club dashboard
- [ ] Update application status
- [ ] Send email notifications on status change
- [ ] Create in-app notifications
- [ ] View notifications in notification bell
- [ ] Mark notifications as read
- [ ] View applicant's applications in their dashboard
- [ ] Filter applications by status
- [ ] Validate form inputs
- [ ] Handle file upload errors
- [ ] Test permissions and access control

---

## Additional Recommendations

1. **Search & Filtering:** Add search functionality for jobs and applications
2. **Analytics:** Track application conversion rates, time-to-hire, etc.
3. **Bulk Actions:** Allow clubs to perform bulk status updates
4. **Export:** Allow clubs to export applications to CSV/Excel
5. **Calendar Integration:** Add calendar invites for interviews
6. **SMS Notifications:** Consider adding SMS for critical updates
7. **Application Tracking:** Add application tracking number for applicants
8. **Auto-close Jobs:** Automatically close jobs after deadline
9. **Duplicate Prevention:** Prevent duplicate applications from same user
10. **Rating System:** Allow clubs to rate applicants after hiring

---

## Contact
For questions or clarifications about these requirements, please contact the frontend development team.

**Last Updated:** December 10, 2024
