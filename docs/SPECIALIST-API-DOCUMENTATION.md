# Specialist API Documentation

## Overview

The Specialist API provides comprehensive functionality for sports specialists including physiotherapists, nutritionists, fitness trainers, and sports psychologists to manage their profiles, consultations, clients, and programs on the SportX platform.

**Base URL:** `http://localhost:4000/api/v1/specialists`

**Important:** This is a **FREE platform** - no payment or earnings system is implemented.

## Table of Contents

1. [Authentication](#authentication)
2. [Profile Management](#profile-management)
3. [Search & Discovery](#search--discovery)
4. [Availability Management](#availability-management)
5. [Consultation Requests](#consultation-requests)
6. [Session Management](#session-management)
7. [Client Management](#client-management)
8. [Program Management](#program-management)
9. [Dashboard & Analytics](#dashboard--analytics)
10. [Media Gallery](#media-gallery)
11. [Settings](#settings)
12. [Specialization Types](#specialization-types)
13. [Workflow Examples](#workflow-examples)

---

## Authentication

All endpoints marked as **Private** require authentication via JWT token in the Authorization header:

```bash
Authorization: Bearer <your_jwt_token>
```

**Role Required:** `specialist` (unless specified otherwise)

---

## Profile Management

### 1. Create Specialist Profile

**POST** `/profile`

Create a new specialist profile.

**Access:** Private (Specialist)

**Request Body:**

```json
{
  "primarySpecialization": "sports_physiotherapy",
  "additionalSpecializations": ["injury_rehabilitation", "sports_massage"],
  "bio": {
    "en": "Experienced sports physiotherapist specializing in ACL rehabilitation",
    "ar": "أخصائي علاج طبيعي رياضي متخصص في إعادة تأهيل الرباط الصليبي"
  },
  "education": [
    {
      "degree": "Master of Physiotherapy",
      "institution": "Cairo University",
      "graduationYear": 2018,
      "fieldOfStudy": "Sports Rehabilitation"
    }
  ],
  "certifications": [
    {
      "name": "Certified Athletic Trainer",
      "issuingOrganization": "NATA",
      "issueDate": "2019-06-15",
      "expiryDate": "2024-06-15",
      "credentialId": "CAT123456"
    }
  ],
  "licenses": [
    {
      "licenseNumber": "PT123456",
      "issuingAuthority": "Egyptian Medical Syndicate",
      "issueDate": "2018-09-01",
      "expiryDate": "2028-09-01",
      "status": "active"
    }
  ],
  "yearsOfExperience": 6,
  "specializations": {
    "sports": ["football", "basketball", "tennis"],
    "ageGroups": ["youth", "adult", "professional"]
  },
  "physiotherapy": {
    "injuryTypes": ["ACL", "meniscus", "muscle_tear", "shoulder_injury"],
    "treatmentTechniques": [
      "manual_therapy",
      "electrotherapy",
      "kinesio_taping",
      "exercise_therapy"
    ],
    "equipmentUsed": ["ultrasound", "TENS unit", "resistance bands"]
  },
  "languages": ["en", "ar"],
  "serviceLocations": [
    {
      "type": "clinic",
      "name": "Sports Health Clinic",
      "address": {
        "street": "123 Medical St",
        "city": "Cairo",
        "state": "Cairo Governorate",
        "country": "Egypt",
        "postalCode": "11511"
      },
      "coordinates": {
        "type": "Point",
        "coordinates": [31.2357, 30.0444]
      },
      "isPrimary": true
    }
  ],
  "consultationTypes": ["individual", "group"],
  "onlineConsultation": {
    "available": true,
    "platforms": ["zoom", "google_meet"]
  }
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Specialist profile created successfully",
  "profile": {
    /* profile object */
  }
}
```

---

### 2. Get My Profile

**GET** `/profile/me`

Get the authenticated specialist's profile.

**Access:** Private (Specialist)

**Response (200):**

```json
{
  "success": true,
  "profile": {
    "_id": "spec123",
    "userId": "user123",
    "primarySpecialization": "sports_physiotherapy",
    "bio": {
      /* bilingual bio */
    },
    "rating": {
      "average": 4.8,
      "count": 24
    },
    "clientStats": {
      "totalClients": 45,
      "activeClients": 12
    }
    /* ... other fields */
  }
}
```

---

### 3. Get Profile by ID

**GET** `/profile/:id`

Get a specialist's public profile.

**Access:** Public

**Response (200):**

```json
{
  "success": true,
  "profile": {
    /* profile object */
  }
}
```

---

### 4. Update Profile

**PUT** `/profile`

Update specialist profile.

**Access:** Private (Specialist)

**Request Body:** (partial update supported)

```json
{
  "bio": {
    "en": "Updated bio text"
  },
  "yearsOfExperience": 7,
  "certifications": [
    /* updated certifications */
  ]
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "profile": {
    /* updated profile */
  }
}
```

---

### 5. Delete Profile

**DELETE** `/profile`

Soft delete specialist profile.

**Access:** Private (Specialist)

**Response (200):**

```json
{
  "success": true,
  "message": "Profile deleted successfully"
}
```

---

## Search & Discovery

### 6. Search Specialists

**GET** `/search`

Search for specialists with various filters.

**Access:** Public

**Query Parameters:**

- `specialization` - Primary specialization type
- `location` - City or area
- `sport` - Specific sport expertise
- `minRating` - Minimum average rating
- `maxDistance` - Maximum distance in km (requires lat/lng)
- `lat` - Latitude for proximity search
- `lng` - Longitude for proximity search
- `injuryType` - For physiotherapy specialists
- `dietType` - For nutrition specialists
- `trainingStyle` - For fitness specialists
- `onlineAvailable` - Filter for online consultation availability
- `language` - Preferred language
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 20)

**Example Request:**

```bash
curl "http://localhost:4000/api/v1/specialists/search?specialization=sports_physiotherapy&sport=football&minRating=4.5&page=1&limit=10"
```

**Response (200):**

```json
{
  "success": true,
  "count": 10,
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  },
  "specialists": [
    {
      "_id": "spec123",
      "primarySpecialization": "sports_physiotherapy",
      "bio": {
        /* bio */
      },
      "rating": { "average": 4.8, "count": 24 },
      "yearsOfExperience": 6,
      "serviceLocations": [
        /* locations */
      ]
    }
    /* ... more specialists */
  ]
}
```

---

### 7. Get Nearby Specialists

**GET** `/nearby`

Find specialists near a specific location using geospatial search.

**Access:** Public

**Query Parameters:**

- `lat` - Latitude (required)
- `lng` - Longitude (required)
- `maxDistance` - Maximum distance in km (default: 10)
- `specialization` - Filter by specialization type
- `limit` - Results limit (default: 20)

**Example Request:**

```bash
curl "http://localhost:4000/api/v1/specialists/nearby?lat=30.0444&lng=31.2357&maxDistance=5&specialization=sports_physiotherapy"
```

**Response (200):**

```json
{
  "success": true,
  "count": 5,
  "specialists": [
    {
      "_id": "spec123",
      "primarySpecialization": "sports_physiotherapy",
      "distance": 1.2,
      "serviceLocations": [
        /* nearby locations */
      ]
    }
  ]
}
```

---

## Availability Management

### 8. Get My Availability

**GET** `/availability`

Get the specialist's availability settings.

**Access:** Private (Specialist)

**Response (200):**

```json
{
  "success": true,
  "availability": {
    "_id": "avail123",
    "specialistId": "spec123",
    "weeklySchedule": [
      {
        "day": "monday",
        "isAvailable": true,
        "slots": [
          {
            "startTime": "09:00",
            "endTime": "10:00",
            "isBooked": false
          },
          {
            "startTime": "10:00",
            "endTime": "11:00",
            "isBooked": true,
            "bookingId": "session123"
          }
        ]
      }
    ],
    "dateOverrides": [],
    "blockedPeriods": [],
    "bookingSettings": {
      "minNoticeHours": 24,
      "maxAdvanceBookingDays": 30,
      "sessionDurations": [30, 60, 90]
    }
  }
}
```

---

### 9. Get Available Slots

**GET** `/availability/:specialistId/slots`

Get available time slots for a specific date.

**Access:** Public

**Query Parameters:**

- `date` - Date (YYYY-MM-DD) (required)
- `duration` - Session duration in minutes (default: 60)

**Example Request:**

```bash
curl "http://localhost:4000/api/v1/specialists/availability/spec123/slots?date=2025-10-10&duration=60"
```

**Response (200):**

```json
{
  "success": true,
  "date": "2025-10-10",
  "duration": 60,
  "availableSlots": [
    {
      "startTime": "09:00",
      "endTime": "10:00"
    },
    {
      "startTime": "14:00",
      "endTime": "15:00"
    }
  ]
}
```

---

### 10. Update Weekly Schedule

**PUT** `/availability/weekly`

Update the recurring weekly schedule.

**Access:** Private (Specialist)

**Request Body:**

```json
{
  "weeklySchedule": [
    {
      "day": "monday",
      "isAvailable": true,
      "slots": [
        { "startTime": "09:00", "endTime": "10:00" },
        { "startTime": "10:00", "endTime": "11:00" },
        { "startTime": "14:00", "endTime": "15:00" }
      ]
    },
    {
      "day": "tuesday",
      "isAvailable": true,
      "slots": [{ "startTime": "09:00", "endTime": "12:00" }]
    },
    {
      "day": "friday",
      "isAvailable": false,
      "slots": []
    }
  ]
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Weekly schedule updated successfully",
  "availability": {
    /* updated availability */
  }
}
```

---

### 11. Block Specific Date

**POST** `/availability/block-date`

Block or override availability for a specific date.

**Access:** Private (Specialist)

**Request Body:**

```json
{
  "date": "2025-10-15",
  "isAvailable": false,
  "reason": "Public holiday"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Date blocked successfully",
  "availability": {
    /* updated availability */
  }
}
```

---

### 12. Unblock Date

**DELETE** `/availability/block-date`

Remove date override.

**Access:** Private (Specialist)

**Request Body:**

```json
{
  "date": "2025-10-15"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Date unblocked successfully"
}
```

---

### 13. Block Period (Vacation)

**POST** `/availability/block-period`

Block a range of dates (e.g., vacation).

**Access:** Private (Specialist)

**Request Body:**

```json
{
  "startDate": "2025-12-20",
  "endDate": "2025-12-31",
  "reason": "Winter vacation"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Period blocked successfully",
  "availability": {
    /* updated availability */
  }
}
```

---

## Consultation Requests

### 14. Get Consultation Requests

**GET** `/requests`

Get all consultation requests received.

**Access:** Private (Specialist)

**Query Parameters:**

- `status` - Filter by status (pending, accepted, rejected, etc.)
- `page` - Page number
- `limit` - Results per page

**Response (200):**

```json
{
  "success": true,
  "count": 5,
  "pagination": {
    /* pagination info */
  },
  "requests": [
    {
      "_id": "req123",
      "clientId": "user456",
      "specialistId": "spec123",
      "serviceType": "physiotherapy",
      "specialization": "sports_physiotherapy",
      "status": "pending",
      "preferredDates": [
        {
          "date": "2025-10-10",
          "timeSlots": ["09:00-10:00", "14:00-15:00"]
        }
      ],
      "clientMessage": "I need help with ACL rehabilitation",
      "injuryDetails": {
        "type": "ACL tear",
        "date": "2025-09-15",
        "currentStatus": "Post-surgery week 3"
      },
      "createdAt": "2025-10-04T10:00:00Z"
    }
  ]
}
```

---

### 15. Accept Request

**PUT** `/requests/:requestId/accept`

Accept a consultation request.

**Access:** Private (Specialist)

**Request Body:**

```json
{
  "message": "I'd be happy to help with your rehabilitation. Let's schedule for Monday.",
  "suggestedDate": "2025-10-10",
  "suggestedTime": "09:00",
  "duration": 60
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Request accepted successfully",
  "request": {
    /* updated request with status 'accepted' */
  }
}
```

---

### 16. Reject Request

**PUT** `/requests/:requestId/reject`

Reject a consultation request.

**Access:** Private (Specialist)

**Request Body:**

```json
{
  "reason": "Fully booked for the requested dates"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Request rejected successfully",
  "request": {
    /* updated request */
  }
}
```

---

### 17. Confirm Booking

**PUT** `/requests/:requestId/confirm`

Confirm the booking and create a consultation session.

**Access:** Private (Specialist)

**Request Body:**

```json
{
  "date": "2025-10-10",
  "time": "09:00",
  "duration": 60,
  "location": {
    "type": "clinic",
    "name": "Sports Health Clinic",
    "address": "123 Medical St, Cairo"
  },
  "notes": "Please bring any recent medical reports"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Booking confirmed and session created",
  "request": {
    /* updated request */
  },
  "session": {
    "_id": "session123",
    "scheduledDate": "2025-10-10",
    "scheduledTime": "09:00",
    "duration": 60,
    "status": "scheduled"
  }
}
```

---

## Session Management

### 18. Get All Sessions

**GET** `/sessions`

Get all consultation sessions.

**Access:** Private (Specialist)

**Query Parameters:**

- `status` - Filter by status (scheduled, completed, cancelled, etc.)
- `clientId` - Filter by specific client
- `dateFrom` - Start date filter
- `dateTo` - End date filter
- `page` - Page number
- `limit` - Results per page

**Response (200):**

```json
{
  "success": true,
  "count": 10,
  "pagination": {
    /* pagination */
  },
  "sessions": [
    {
      "_id": "session123",
      "specialistId": "spec123",
      "clientId": "user456",
      "sessionType": "individual",
      "scheduledDate": "2025-10-10",
      "scheduledTime": "09:00",
      "duration": 60,
      "location": {
        /* location details */
      },
      "attendance": {
        "status": "scheduled"
      },
      "price": 0
    }
  ]
}
```

---

### 19. Get Today's Sessions

**GET** `/sessions/today`

Get all sessions scheduled for today.

**Access:** Private (Specialist)

**Response (200):**

```json
{
  "success": true,
  "count": 3,
  "sessions": [
    /* today's sessions */
  ]
}
```

---

### 20. Get Session by ID

**GET** `/sessions/:sessionId`

Get detailed session information.

**Access:** Private (Specialist or Client)

**Response (200):**

```json
{
  "success": true,
  "session": {
    "_id": "session123",
    "specialistId": {
      /* populated specialist info */
    },
    "clientId": {
      /* populated client info */
    },
    "sessionType": "individual",
    "scheduledDate": "2025-10-10",
    "scheduledTime": "09:00",
    "duration": 60,
    "location": {
      /* location */
    },
    "physiotherapy": {
      "painLevel": 6,
      "rangeOfMotion": {
        "affected": "right knee",
        "before": "90 degrees",
        "after": "110 degrees"
      },
      "treatmentProvided": [
        {
          "technique": "manual_therapy",
          "duration": 20
        }
      ],
      "exercisesAssigned": [
        {
          "exercise": "Quad sets",
          "sets": 3,
          "reps": 15,
          "frequency": "3 times daily"
        }
      ]
    },
    "sessionNotes": "Good progress, increased ROM by 20 degrees",
    "attendance": {
      "status": "completed",
      "checkInTime": "2025-10-10T09:05:00Z",
      "checkOutTime": "2025-10-10T10:00:00Z"
    }
  }
}
```

---

### 21. Create Session

**POST** `/sessions`

Create a consultation session manually.

**Access:** Private (Specialist)

**Request Body:**

```json
{
  "clientId": "user456",
  "sessionType": "individual",
  "scheduledDate": "2025-10-12",
  "scheduledTime": "14:00",
  "duration": 60,
  "location": {
    "type": "clinic",
    "name": "Sports Health Clinic"
  },
  "notes": "Follow-up session"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Session created successfully",
  "session": {
    /* created session */
  }
}
```

---

### 22. Update Session

**PUT** `/sessions/:sessionId`

Update session details before it's completed.

**Access:** Private (Specialist)

**Request Body:**

```json
{
  "physiotherapy": {
    "painLevel": 6,
    "rangeOfMotion": {
      "affected": "right knee",
      "before": "90 degrees",
      "after": "110 degrees"
    },
    "treatmentProvided": [
      {
        "technique": "manual_therapy",
        "duration": 20
      }
    ]
  },
  "sessionNotes": "In-progress notes"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Session updated successfully",
  "session": {
    /* updated session */
  }
}
```

---

### 23. Complete Session

**PUT** `/sessions/:sessionId/complete`

Mark session as completed and add final notes.

**Access:** Private (Specialist)

**Request Body:**

```json
{
  "sessionNotes": "Excellent progress. Client showing 20-degree improvement in ROM. Continue with assigned exercises.",
  "physiotherapy": {
    "painLevel": 4,
    "rangeOfMotion": {
      "affected": "right knee",
      "before": "90 degrees",
      "after": "110 degrees"
    },
    "treatmentProvided": [
      {
        "technique": "manual_therapy",
        "duration": 20
      },
      {
        "technique": "exercise_therapy",
        "duration": 30
      }
    ],
    "exercisesAssigned": [
      {
        "exercise": "Quad sets",
        "sets": 3,
        "reps": 15,
        "frequency": "3 times daily",
        "instructions": "Hold for 5 seconds"
      },
      {
        "exercise": "Straight leg raises",
        "sets": 3,
        "reps": 10,
        "frequency": "2 times daily"
      }
    ]
  },
  "progress": {
    "summary": "ROM improved by 20 degrees",
    "nextSteps": "Continue exercises, follow-up in 1 week"
  }
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Session completed successfully",
  "session": {
    "_id": "session123",
    "attendance": {
      "status": "completed",
      "checkOutTime": "2025-10-10T10:00:00Z"
    }
    /* ... session details */
  }
}
```

---

### 24. Cancel Session

**PUT** `/sessions/:sessionId/cancel`

Cancel a scheduled session.

**Access:** Private (Specialist or Client)

**Request Body:**

```json
{
  "reason": "Emergency situation",
  "cancelledBy": "specialist"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Session cancelled successfully",
  "session": {
    /* cancelled session */
  }
}
```

---

### 25. Reschedule Session

**PUT** `/sessions/:sessionId/reschedule`

Reschedule a session to a different date/time.

**Access:** Private (Specialist)

**Request Body:**

```json
{
  "newDate": "2025-10-12",
  "newTime": "11:00",
  "reason": "Schedule conflict"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Session rescheduled successfully",
  "session": {
    /* rescheduled session */
  }
}
```

---

## Client Management

### 26. Get All Clients

**GET** `/clients`

Get all clients of the specialist.

**Access:** Private (Specialist)

**Query Parameters:**

- `status` - Filter by status (active, inactive, completed)
- `search` - Search by name or email
- `page` - Page number
- `limit` - Results per page

**Response (200):**

```json
{
  "success": true,
  "count": 12,
  "pagination": {
    /* pagination */
  },
  "clients": [
    {
      "_id": "client123",
      "specialistId": "spec123",
      "clientId": "user456",
      "status": "active",
      "startDate": "2025-09-01",
      "goals": [
        {
          "description": "Full ACL recovery",
          "targetDate": "2026-03-01",
          "status": "in_progress",
          "progress": 30
        }
      ],
      "sessionStats": {
        "totalSessions": 8,
        "completedSessions": 6,
        "upcomingSessions": 2
      }
    }
  ]
}
```

---

### 27. Get Client Details

**GET** `/clients/:clientId`

Get detailed client information with full history.

**Access:** Private (Specialist)

**Response (200):**

```json
{
  "success": true,
  "client": {
    "_id": "client123",
    "specialistId": "spec123",
    "clientId": {
      "_id": "user456",
      "firstName": "Ahmed",
      "lastName": "Hassan",
      "email": "ahmed@example.com"
    },
    "status": "active",
    "goals": [
      /* goals */
    ],
    "medicalHistory": {
      "conditions": ["Hypertension"],
      "previousInjuries": [
        {
          "injury": "ACL tear",
          "date": "2025-08-15",
          "severity": "severe",
          "treatment": "Surgical reconstruction",
          "fullyRecovered": false
        }
      ],
      "allergies": ["Penicillin"],
      "medications": [
        {
          "name": "Blood pressure medication",
          "dosage": "10mg",
          "frequency": "daily"
        }
      ]
    },
    "measurements": [
      {
        "date": "2025-09-01",
        "weight": 85,
        "bodyFatPercentage": 18,
        "muscleMass": 40
      }
    ],
    "painTracking": [
      {
        "date": "2025-10-01",
        "area": "right knee",
        "painLevel": 6,
        "description": "Pain during flexion"
      }
    ],
    "assignedPrograms": [
      {
        "programId": "prog123",
        "assignedDate": "2025-09-01",
        "status": "active",
        "compliance": 85
      }
    ],
    "notes": [
      {
        "date": "2025-10-01",
        "note": "Client is very motivated and following exercises diligently",
        "category": "progress",
        "isPrivate": true
      }
    ]
  },
  "sessions": [
    /* all sessions with this client */
  ],
  "programs": [
    /* assigned programs */
  ]
}
```

---

### 28. Add Client Note

**POST** `/clients/:clientId/notes`

Add a private note about the client.

**Access:** Private (Specialist)

**Request Body:**

```json
{
  "note": "Client showed significant improvement in ROM today",
  "category": "progress"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Note added successfully",
  "client": {
    /* updated client */
  }
}
```

---

### 29. Add Client Measurement

**POST** `/clients/:clientId/measurements`

Add body measurements for tracking progress.

**Access:** Private (Specialist)

**Request Body:**

```json
{
  "weight": 83,
  "bodyFatPercentage": 16,
  "muscleMass": 42,
  "chest": 100,
  "waist": 85,
  "hips": 95,
  "thigh": 55
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Measurement added successfully",
  "client": {
    /* updated client */
  }
}
```

---

### 30. Update Client Goals

**PUT** `/clients/:clientId/goals`

Update client goals and objectives.

**Access:** Private (Specialist)

**Request Body:**

```json
{
  "goals": [
    {
      "description": "Full ACL recovery",
      "targetDate": "2026-03-01",
      "status": "in_progress",
      "progress": 40
    },
    {
      "description": "Return to football training",
      "targetDate": "2026-04-01",
      "status": "pending",
      "progress": 0
    }
  ]
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Client goals updated successfully",
  "client": {
    /* updated client */
  }
}
```

---

### 31. Add Pain Tracking

**POST** `/clients/:clientId/pain-tracking`

Add pain tracking entry for physiotherapy clients.

**Access:** Private (Specialist)

**Request Body:**

```json
{
  "area": "right knee",
  "painLevel": 5,
  "description": "Reduced pain during flexion, still present with deep squats"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Pain tracking added successfully",
  "client": {
    /* updated client */
  }
}
```

---

### 32. Add Fitness Metrics

**POST** `/clients/:clientId/fitness-metrics`

Add fitness metrics for tracking athletic performance.

**Access:** Private (Specialist)

**Request Body:**

```json
{
  "benchPress": 80,
  "squat": 100,
  "deadlift": 120,
  "vo2Max": 45,
  "flexibilityScore": 7,
  "notes": "Strength improving steadily"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Fitness metrics added successfully",
  "client": {
    /* updated client */
  }
}
```

---

## Program Management

### 33. Get All Programs

**GET** `/programs`

Get all programs created by the specialist.

**Access:** Private (Specialist)

**Query Parameters:**

- `programType` - Filter by type (physiotherapy, nutrition, fitness, psychology)
- `isTemplate` - Filter templates (true/false)
- `status` - Filter by status
- `category` - Filter by category

**Response (200):**

```json
{
  "success": true,
  "count": 8,
  "programs": [
    {
      "_id": "prog123",
      "specialistId": "spec123",
      "programType": "physiotherapy",
      "title": {
        "en": "ACL Rehabilitation Program - Phase 1",
        "ar": "برنامج إعادة تأهيل الرباط الصليبي - المرحلة 1"
      },
      "description": {
        "en": "Post-surgery rehabilitation for ACL reconstruction",
        "ar": "إعادة التأهيل بعد جراحة إعادة بناء الرباط الصليبي"
      },
      "duration": {
        "value": 6,
        "unit": "weeks"
      },
      "isTemplate": true,
      "usageStats": {
        "timesAssigned": 12,
        "activeClients": 4
      }
    }
  ]
}
```

---

### 34. Get Program Templates

**GET** `/programs/templates`

Get reusable program templates.

**Access:** Private (Specialist)

**Query Parameters:**

- `programType` - Filter by type

**Response (200):**

```json
{
  "success": true,
  "count": 5,
  "templates": [
    /* program templates */
  ]
}
```

---

### 35. Get Program by ID

**GET** `/programs/:programId`

Get detailed program information.

**Access:** Private (Specialist)

**Response (200):**

```json
{
  "success": true,
  "program": {
    "_id": "prog123",
    "programType": "physiotherapy",
    "title": {
      /* bilingual title */
    },
    "physiotherapy": {
      "phases": [
        {
          "phaseNumber": 1,
          "name": "Protection Phase",
          "duration": "Weeks 1-2",
          "goals": [
            "Reduce swelling",
            "Protect graft",
            "Restore ROM to 0-90 degrees"
          ],
          "exercises": [
            {
              "exercise": "Quad sets",
              "sets": 3,
              "reps": 15,
              "frequency": "3 times daily",
              "instructions": "Hold for 5 seconds, focus on muscle contraction"
            },
            {
              "exercise": "Ankle pumps",
              "sets": 3,
              "reps": 20,
              "frequency": "Hourly when awake"
            }
          ],
          "precautions": [
            "No weight bearing without brace",
            "Keep incisions clean and dry"
          ]
        }
      ],
      "restrictions": ["No pivoting movements", "No running until week 12"],
      "homeExercises": [
        /* home exercise program */
      ]
    }
  }
}
```

---

### 36. Create Program

**POST** `/programs`

Create a new program or template.

**Access:** Private (Specialist)

**Request Body (Physiotherapy):**

```json
{
  "programType": "physiotherapy",
  "title": {
    "en": "ACL Rehabilitation - Complete Program",
    "ar": "إعادة تأهيل الرباط الصليبي - برنامج كامل"
  },
  "description": {
    "en": "Comprehensive 6-month ACL rehabilitation program",
    "ar": "برنامج شامل لإعادة تأهيل الرباط الصليبي لمدة 6 أشهر"
  },
  "duration": {
    "value": 24,
    "unit": "weeks"
  },
  "isTemplate": true,
  "physiotherapy": {
    "phases": [
      {
        "phaseNumber": 1,
        "name": "Protection Phase",
        "duration": "Weeks 1-2",
        "goals": ["Reduce swelling", "Protect graft", "Restore ROM 0-90°"],
        "exercises": [
          {
            "exercise": "Quad sets",
            "sets": 3,
            "reps": 15,
            "frequency": "3x daily",
            "instructions": "Hold 5 seconds"
          }
        ]
      }
    ],
    "restrictions": ["No pivoting", "No running until week 12"],
    "homeExercises": [
      /* exercises */
    ]
  }
}
```

**Request Body (Nutrition):**

```json
{
  "programType": "nutrition",
  "title": {
    "en": "Muscle Gain Nutrition Plan",
    "ar": "خطة تغذية لزيادة الكتلة العضلية"
  },
  "duration": {
    "value": 12,
    "unit": "weeks"
  },
  "isTemplate": true,
  "nutrition": {
    "calorieTarget": {
      "daily": 3000
    },
    "macronutrients": {
      "protein": 200,
      "carbs": 350,
      "fats": 80
    },
    "mealPlan": [
      {
        "day": "monday",
        "meals": [
          {
            "mealType": "breakfast",
            "items": [
              {
                "food": "Oatmeal with banana",
                "quantity": "1 cup",
                "calories": 300,
                "protein": 10,
                "carbs": 50,
                "fats": 5
              },
              {
                "food": "Eggs",
                "quantity": "4 whole",
                "calories": 280,
                "protein": 24,
                "carbs": 2,
                "fats": 20
              }
            ]
          }
        ]
      }
    ],
    "supplementsRecommended": [
      {
        "name": "Whey Protein",
        "dosage": "30g",
        "timing": "Post-workout"
      }
    ],
    "hydrationTarget": "3-4 liters daily"
  }
}
```

**Request Body (Fitness):**

```json
{
  "programType": "fitness",
  "title": {
    "en": "Strength Building Program - 12 Weeks",
    "ar": "برنامج بناء القوة - 12 أسبوع"
  },
  "duration": {
    "value": 12,
    "unit": "weeks"
  },
  "isTemplate": true,
  "fitness": {
    "workoutPlan": [
      {
        "day": "monday",
        "focus": "Upper Body - Push",
        "warmUp": {
          "duration": 10,
          "activities": ["Dynamic stretching", "Light cardio"]
        },
        "mainWorkout": [
          {
            "exercise": "Bench Press",
            "sets": 4,
            "reps": "8-10",
            "restPeriod": "90 seconds",
            "weight": "Progressive",
            "instructions": "Control the descent, explosive push"
          },
          {
            "exercise": "Shoulder Press",
            "sets": 3,
            "reps": "10-12",
            "restPeriod": "60 seconds",
            "weight": "Progressive"
          }
        ],
        "coolDown": {
          "duration": 10,
          "activities": ["Static stretching", "Foam rolling"]
        }
      }
    ],
    "progressionPlan": "Increase weight by 2.5kg when you can complete all sets with good form"
  }
}
```

**Request Body (Psychology):**

```json
{
  "programType": "psychology",
  "title": {
    "en": "Performance Anxiety Management",
    "ar": "إدارة قلق الأداء"
  },
  "duration": {
    "value": 8,
    "unit": "weeks"
  },
  "isTemplate": true,
  "psychology": {
    "focus": ["anxiety", "confidence", "focus"],
    "techniques": [
      {
        "name": "Progressive Muscle Relaxation",
        "description": "Systematic tension and relaxation of muscle groups",
        "frequency": "Daily, before practice"
      },
      {
        "name": "Visualization",
        "description": "Mental rehearsal of successful performance",
        "frequency": "3 times per week"
      }
    ],
    "sessionStructure": [
      {
        "week": 1,
        "topic": "Understanding Performance Anxiety",
        "activities": ["Assessment", "Education", "Goal setting"]
      }
    ],
    "dailyPractices": [
      {
        "practice": "Breathing exercises",
        "duration": 10,
        "frequency": "Twice daily"
      }
    ],
    "milestones": [
      {
        "week": 4,
        "description": "Demonstrate effective use of relaxation techniques",
        "assessment": "Self-report anxiety reduced by 30%"
      }
    ]
  }
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Program created successfully",
  "program": {
    /* created program */
  }
}
```

---

### 37. Update Program

**PUT** `/programs/:programId`

Update an existing program.

**Access:** Private (Specialist)

**Request Body:** (partial update supported)

```json
{
  "title": {
    "en": "Updated Program Title"
  },
  "physiotherapy": {
    "phases": [
      /* updated phases */
    ]
  }
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Program updated successfully",
  "program": {
    /* updated program */
  }
}
```

---

### 38. Delete Program

**DELETE** `/programs/:programId`

Soft delete a program.

**Access:** Private (Specialist)

**Response (200):**

```json
{
  "success": true,
  "message": "Program deleted successfully"
}
```

---

### 39. Assign Program to Client

**POST** `/programs/:programId/assign/:clientId`

Assign a program to a client.

**Access:** Private (Specialist)

**Request Body:**

```json
{
  "startDate": "2025-10-10",
  "customizations": {
    "notes": "Modified intensity for current recovery stage"
  }
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Program assigned to client successfully",
  "assignment": {
    "programId": "prog123",
    "clientId": "client123",
    "assignedDate": "2025-10-10",
    "status": "active"
  }
}
```

---

### 40. Clone Program as Template

**POST** `/programs/:programId/clone`

Clone an existing program as a reusable template.

**Access:** Private (Specialist)

**Response (201):**

```json
{
  "success": true,
  "message": "Program cloned as template successfully",
  "template": {
    /* cloned template */
  }
}
```

---

## Dashboard & Analytics

### 41. Get Dashboard Stats

**GET** `/dashboard`

Get dashboard overview statistics.

**Access:** Private (Specialist)

**Response (200):**

```json
{
  "success": true,
  "stats": {
    "todaySessions": {
      "total": 5,
      "completed": 2,
      "upcoming": 3
    },
    "thisWeekSessions": {
      "total": 18,
      "completed": 12,
      "upcoming": 6
    },
    "clients": {
      "total": 45,
      "active": 12,
      "newThisMonth": 3
    },
    "pendingRequests": 4,
    "upcomingSessionsToday": [
      {
        "_id": "session123",
        "clientName": "Ahmed Hassan",
        "time": "14:00",
        "duration": 60
      }
    ],
    "recentActivity": [
      {
        "type": "session_completed",
        "timestamp": "2025-10-04T09:00:00Z",
        "description": "Session with Ahmed Hassan completed"
      }
    ]
  }
}
```

---

### 42. Get Analytics

**GET** `/analytics`

Get detailed analytics for a specific period.

**Access:** Private (Specialist)

**Query Parameters:**

- `period` - Time period (week, month, year)

**Response (200):**

```json
{
  "success": true,
  "analytics": {
    "period": "month",
    "totalSessions": 48,
    "completedSessions": 42,
    "cancelledSessions": 4,
    "noShowSessions": 2,
    "newClients": 5,
    "totalClients": 45,
    "activeClients": 12,
    "averageRating": 4.8,
    "totalReviews": 24,
    "sessionTypes": {
      "individual": 40,
      "group": 8,
      "online": 15
    },
    "specializationBreakdown": {
      "sports_physiotherapy": 30,
      "injury_rehabilitation": 18
    }
  }
}
```

---

## Media Gallery

### 43. Add Photo

**POST** `/gallery/photos`

Add a photo to the profile gallery.

**Access:** Private (Specialist)

**Request Body:**

```json
{
  "url": "https://example.com/photos/clinic.jpg",
  "caption": {
    "en": "Our modern physiotherapy clinic",
    "ar": "عيادة العلاج الطبيعي الحديثة"
  },
  "category": "facility"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Photo added successfully",
  "profile": {
    /* updated profile */
  }
}
```

---

### 44. Remove Photo

**DELETE** `/gallery/photos/:photoId`

Remove a photo from the gallery.

**Access:** Private (Specialist)

**Response (200):**

```json
{
  "success": true,
  "message": "Photo removed successfully"
}
```

---

### 45. Add Video

**POST** `/gallery/videos`

Add a video to the profile gallery.

**Access:** Private (Specialist)

**Request Body:**

```json
{
  "url": "https://youtube.com/watch?v=example",
  "thumbnail": "https://example.com/thumbnails/video1.jpg",
  "title": {
    "en": "ACL Rehabilitation Exercises",
    "ar": "تمارين إعادة تأهيل الرباط الصليبي"
  },
  "description": {
    "en": "Demonstration of home exercises for ACL recovery"
  }
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Video added successfully",
  "profile": {
    /* updated profile */
  }
}
```

---

### 46. Remove Video

**DELETE** `/gallery/videos/:videoId`

Remove a video from the gallery.

**Access:** Private (Specialist)

**Response (200):**

```json
{
  "success": true,
  "message": "Video removed successfully"
}
```

---

## Settings

### 47. Update Privacy Settings

**PUT** `/settings/privacy`

Update privacy settings.

**Access:** Private (Specialist)

**Request Body:**

```json
{
  "privacy": {
    "showEmail": false,
    "showPhone": true,
    "showLocation": true,
    "allowDirectBooking": true,
    "profileVisibility": "public"
  }
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Privacy settings updated successfully",
  "profile": {
    /* updated profile */
  }
}
```

---

### 48. Update Notification Settings

**PUT** `/settings/notifications`

Update notification preferences.

**Access:** Private (Specialist)

**Request Body:**

```json
{
  "notifications": {
    "emailNotifications": true,
    "smsNotifications": false,
    "pushNotifications": true,
    "newRequests": true,
    "sessionReminders": true,
    "cancellations": true,
    "reviews": true
  }
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Notification settings updated successfully",
  "profile": {
    /* updated profile */
  }
}
```

---

## Specialization Types

### Primary Specializations

1. **sports_physiotherapy** (علاج طبيعي رياضي)
   - Focus: Sports injuries, rehabilitation
   - Common treatments: Manual therapy, electrotherapy, exercise therapy

2. **sports_nutrition** (تغذية رياضية)
   - Focus: Athletic performance, body composition
   - Services: Meal planning, supplementation, diet optimization

3. **fitness_training** (لياقة بدنية)
   - Focus: Strength, conditioning, athletic performance
   - Services: Workout programs, performance coaching

4. **sports_psychology** (علم نفس رياضي)
   - Focus: Mental performance, confidence, anxiety management
   - Services: Mental training, performance psychology

5. **injury_rehabilitation** (إعادة تأهيل الإصابات)
   - Focus: Post-injury recovery
   - Services: Comprehensive rehabilitation programs

6. **sports_massage** (تدليك رياضي)
   - Focus: Recovery, muscle therapy
   - Services: Sports massage, recovery techniques

---

## Workflow Examples

### Workflow 1: Complete Consultation Booking Flow

1. **Client searches for specialists**

```bash
GET /api/v1/specialists/search?specialization=sports_physiotherapy&sport=football&location=Cairo
```

2. **Client views specialist profile**

```bash
GET /api/v1/specialists/profile/spec123
```

3. **Client checks availability**

```bash
GET /api/v1/specialists/availability/spec123/slots?date=2025-10-10&duration=60
```

4. **Client sends consultation request**

```bash
POST /api/v1/specialists/requests
{
  "specialistId": "spec123",
  "serviceType": "physiotherapy",
  "preferredDates": [...]
}
```

5. **Specialist reviews requests**

```bash
GET /api/v1/specialists/requests?status=pending
```

6. **Specialist accepts request**

```bash
PUT /api/v1/specialists/requests/req123/accept
{
  "message": "Happy to help!",
  "suggestedDate": "2025-10-10",
  "suggestedTime": "09:00"
}
```

7. **Specialist confirms booking**

```bash
PUT /api/v1/specialists/requests/req123/confirm
{
  "date": "2025-10-10",
  "time": "09:00",
  "duration": 60,
  "location": {...}
}
```

8. **Session is created automatically**

9. **Specialist completes session**

```bash
PUT /api/v1/specialists/sessions/session123/complete
{
  "sessionNotes": "Excellent progress...",
  "physiotherapy": {...}
}
```

---

### Workflow 2: Client Management & Program Assignment

1. **View all clients**

```bash
GET /api/v1/specialists/clients?status=active
```

2. **View specific client details**

```bash
GET /api/v1/specialists/clients/client123
```

3. **Add client measurement**

```bash
POST /api/v1/specialists/clients/client123/measurements
{
  "weight": 83,
  "bodyFatPercentage": 16
}
```

4. **Create rehabilitation program**

```bash
POST /api/v1/specialists/programs
{
  "programType": "physiotherapy",
  "title": {...},
  "physiotherapy": {...}
}
```

5. **Assign program to client**

```bash
POST /api/v1/specialists/programs/prog123/assign/client123
{
  "startDate": "2025-10-10"
}
```

6. **Track progress through sessions**

```bash
PUT /api/v1/specialists/sessions/session123/complete
{
  "sessionNotes": "Week 3 - ROM improved to 110 degrees",
  "physiotherapy": {...}
}
```

7. **Update client goals**

```bash
PUT /api/v1/specialists/clients/client123/goals
{
  "goals": [{...}]
}
```

---

### Workflow 3: Availability Management

1. **Set up weekly schedule**

```bash
PUT /api/v1/specialists/availability/weekly
{
  "weeklySchedule": [
    {
      "day": "monday",
      "isAvailable": true,
      "slots": [
        {"startTime": "09:00", "endTime": "10:00"},
        {"startTime": "10:00", "endTime": "11:00"}
      ]
    }
  ]
}
```

2. **Block specific date (holiday)**

```bash
POST /api/v1/specialists/availability/block-date
{
  "date": "2025-12-25",
  "isAvailable": false,
  "reason": "Christmas holiday"
}
```

3. **Block vacation period**

```bash
POST /api/v1/specialists/availability/block-period
{
  "startDate": "2025-12-20",
  "endDate": "2025-12-31",
  "reason": "Winter vacation"
}
```

4. **Check available slots**

```bash
GET /api/v1/specialists/availability/spec123/slots?date=2025-10-10
```

---

## Error Responses

All endpoints return consistent error responses:

**400 Bad Request:**

```json
{
  "success": false,
  "message": "Validation error",
  "error": "Invalid date format"
}
```

**401 Unauthorized:**

```json
{
  "success": false,
  "message": "Not authenticated"
}
```

**403 Forbidden:**

```json
{
  "success": false,
  "message": "Not authorized to access this resource"
}
```

**404 Not Found:**

```json
{
  "success": false,
  "message": "Resource not found"
}
```

**500 Internal Server Error:**

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

---

## Testing the API

### Using cURL

**Get all specialists:**

```bash
curl http://localhost:4000/api/v1/specialists/search
```

**Create profile (requires auth):**

```bash
curl -X POST http://localhost:4000/api/v1/specialists/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "primarySpecialization": "sports_physiotherapy",
    "bio": {
      "en": "Experienced physiotherapist"
    },
    "yearsOfExperience": 5
  }'
```

**Search nearby specialists:**

```bash
curl "http://localhost:4000/api/v1/specialists/nearby?lat=30.0444&lng=31.2357&maxDistance=5"
```

---

## Platform Features

✅ **Free Platform** - No payment processing
✅ **Multi-specialization Support** - 4 specialization types
✅ **Bilingual** - English & Arabic support
✅ **Geospatial Search** - Find nearby specialists
✅ **Complete Booking Workflow** - From request to completion
✅ **Client Health Tracking** - Encrypted medical data
✅ **Progress Monitoring** - Measurements, pain levels, metrics
✅ **Program Management** - Customizable programs per specialization
✅ **Session Tracking** - Complete lifecycle management
✅ **Analytics Dashboard** - Performance insights

---

## Notes

- All dates should be in ISO 8601 format (YYYY-MM-DD)
- Times should be in 24-hour format (HH:MM)
- All endpoints support pagination where applicable
- Bilingual fields support `en` and `ar` keys
- Medical data is encrypted at rest
- This is a **FREE platform** - no pricing or payment features

---

**API Version:** v1
**Last Updated:** October 2025
**Server:** http://localhost:4000
