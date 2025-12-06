# Backend Email Notification Requirements - TF1 Platform

## Issue
الايميلات التي يتم إرسالها للمرشحين لا تتضمن معلومات التواصل والمقابلة الكاملة.

## Frontend Now Sends Complete Data

### When Status Changes to "offered" or "hired":
```json
{
  "status": "offered",
  "message": "رسالة للمرشح",
  "contactPhone": "+966568757481",
  "contactAddress": "عنوان النادي الرئيسي",
  "meetingDate": "2025-12-07",
  "meetingTime": "14:00",
  "meetingLocation": "ملعب النادي - المكتب الرئيسي",
  "applicantName": "اسم المرشح",
  "applicantEmail": "applicant@example.com",
  "jobTitle": "مدرب كرة القدم",
  "applicantSnapshot": { ... }
}
```

## Email Template Requirements

### Email Must Include:
1. ✅ **Applicant Name & Job Title**
2. ✅ **Club Contact Phone**: `contactPhone`
3. ✅ **Club Address**: `contactAddress`
4. ✅ **Meeting Location**: `meetingLocation` (where interview/start will be)
5. ✅ **Meeting Date**: `meetingDate` (formatted nicely)
6. ✅ **Meeting Time**: `meetingTime` (formatted nicely)
7. ✅ **Message**: Custom message from club
8. ✅ **Applicant Details**: Personal data for reference

### Example Email Body (Arabic):
```
السلام عليكم ورحمة الله وبركاته

استقبل [اسم المرشح] اهنائنا بعرض وظيفة جديد!

تفاصيل الوظيفة:
- المنصب: [jobTitle]
- المؤسسة: [clubName]

معلومات التواصل:
- رقم الهاتف: [contactPhone]
- عنوان النادي: [contactAddress]

تفاصيل المقابلة:
- مكان المقابلة: [meetingLocation]
- التاريخ: [meetingDate] - التوقيت: [meetingTime]

الرسالة:
[message]

---
برجاء التواصل معنا في حالة الاستفسارات.
```

## Backend Controller Changes

In `matchHubController.js` or similar offer/hire endpoints:

```javascript
// When sending email, include ALL these fields:
const emailData = {
  to: applicantEmail,
  subject: `عرض وظيفة جديد - ${jobTitle}`,
  template: 'offer-email', // or 'hire-email'
  context: {
    applicantName,
    jobTitle,
    clubName,
    contactPhone,
    contactAddress,
    meetingLocation,
    meetingDate,
    meetingTime,
    message,
    applicantSnapshot
  }
}

// Send via SendGrid SMTP
sendEmail(emailData)
```

## Field Mapping

| Frontend Field | Backend Use | Required | Format |
|---|---|---|---|
| `contactPhone` | Club phone for contact | Yes | +966XXXXXXXXX |
| `contactAddress` | Club address | Yes | String |
| `meetingLocation` | Where meeting happens | Yes | String |
| `meetingDate` | Interview/start date | Yes | YYYY-MM-DD |
| `meetingTime` | Interview/start time | Yes | HH:mm |
| `message` | Custom message to applicant | Yes | String |
| `applicantEmail` | Email recipient | Yes | Email |
| `applicantName` | Recipient name | Yes | String |
| `jobTitle` | Job position | Yes | String |

## Testing Steps

1. Update club offer/hire endpoints to accept new fields
2. Modify email template to include all 6 contact/meeting fields
3. Test offer/hire flow with sample data
4. Verify email contains:
   - ✅ Contact phone
   - ✅ Meeting date & time
   - ✅ Meeting location
   - ✅ Club address
   - ✅ Message

## Current Status

**Frontend**: ✅ Ready to send all data  
**Backend**: ⏳ Needs email template update

---
**Contact:** TF1 Frontend Team  
**Date:** December 6, 2025  
**Bilingual:** Arabic & English support required
