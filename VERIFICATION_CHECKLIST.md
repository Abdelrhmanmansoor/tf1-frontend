# ✅ قائمة التحقق - إشعارات الوظائف وتحميل الملفات

## 🎯 Frontend - تم ✅

### Socket.io Notifications
- [x] تغيير event من `'job:notification'` إلى `'new_notification'`
- [x] تحديث `contexts/socket-context.tsx`
- [x] تحديث `components/notifications/JobNotifications.tsx`
- [x] إضافة دعم `notificationType`, `titleAr`, `messageAr`, `actionUrl`, `priority`
- [x] فلترة الإشعارات حسب النوع (`job_application`, `club_accepted`, `club_rejected`)
- [x] استخدام `userId` للتحقق من المستلم

### عرض الإشعارات في الداشبوردات
- [x] `components/dashboards/PlayerDashboard.tsx` - يعرض إشعارات الوظائف
- [x] `components/dashboards/CoachDashboard.tsx` - يعرض إشعارات الوظائف
- [x] `components/dashboards/ClubDashboard.tsx` - يعرض إشعارات الوظائف
- [x] `components/dashboards/SpecialistDashboard.tsx` - يعرض إشعارات الوظائف

### Environment Variables
- [x] `NEXT_PUBLIC_API_URL` مضبوط في Replit Secrets
- [x] `config/api.ts` يستخدم Environment Variable
- [x] `app/admin/page.tsx` يستخدم Environment Variable
- [x] `.env.example` جاهز

### التوثيق
- [x] `FRONTEND_JOB_NOTIFICATIONS_GUIDE.md` - دليل كامل للـ Frontend
- [x] `BACKEND_JOB_NOTIFICATIONS_FIX.md` - دليل إصلاح للـ Backend
- [x] `SETUP_GUIDE.md` - دليل الإعداد
- [x] `replit.md` - محدّث

---

## ⚠️ Backend - يحتاج عمل!

### 1. إشعارات الوظائف

#### عند تقديم طلب توظيف:
- [ ] استخدام event: `socket.emit('new_notification', {...})`
- [ ] إرسال `applicantName` من جدول Users (ليس "USER")
- [ ] إرسال `fullName` أو `firstName + lastName`
- [ ] إرسال `titleAr` و `messageAr`
- [ ] إرسال `actionUrl` (مثل: `/club/applications/:id`)
- [ ] إرسال `priority` (normal, high, urgent)

#### إشعار النادي (new_application):
```javascript
{
  type: 'job_application',
  notificationType: 'new_application',
  applicantName: applicant.fullName, // ✅ الاسم الحقيقي
  jobTitle: job.title,
  jobTitleAr: job.titleAr,
  clubName: club.name,
  title: 'New Job Application',
  titleAr: 'طلب توظيف جديد',
  message: `${applicant.fullName} applied for ${job.title}`,
  messageAr: `${applicant.fullName} تقدم لوظيفة ${job.titleAr}`,
  actionUrl: `/club/applications/${application._id}`,
  userId: club.userId, // ✅ userId صاحب النادي
  applicationId: application._id,
  jobId: job._id,
  priority: 'normal',
  isRead: false,
  createdAt: new Date().toISOString()
}
```

#### إشعار المتقدم (application_submitted):
```javascript
{
  type: 'job_application',
  notificationType: 'application_submitted',
  jobTitle: job.title,
  jobTitleAr: job.titleAr,
  title: 'Application Submitted',
  titleAr: 'تم إرسال طلبك',
  message: `Your application for ${job.title} has been submitted`,
  messageAr: `تم إرسال طلبك لوظيفة ${job.titleAr} بنجاح`,
  actionUrl: `/jobs/${job._id}/application/${application._id}`,
  userId: applicant._id, // ✅ userId المتقدم
  applicationId: application._id,
  jobId: job._id,
  priority: 'normal',
  isRead: false,
  createdAt: new Date().toISOString()
}
```

---

### 2. تحميل الملفات (CV/Resume)

#### Endpoint المطلوب:
```
GET /api/v1/jobs/applications/:applicationId/download/:attachmentIndex
```

#### المطلوب:
- [ ] إنشاء endpoint جديد للتحميل
- [ ] التحقق من الصلاحيات (صاحب النادي أو المتقدم فقط)
- [ ] إرسال `Content-Type` header الصحيح
- [ ] إرسال `Content-Disposition` مع اسم الملف الأصلي
- [ ] دعم streaming للملفات الكبيرة

#### مثال كود:
```javascript
router.get('/applications/:applicationId/download/:attachmentIndex', 
  authMiddleware, 
  async (req, res) => {
    const { applicationId, attachmentIndex } = req.params;
    const application = await Application.findById(applicationId);
    
    // التحقق من الصلاحيات
    const isAuthorized = /* ... */;
    if (!isAuthorized) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const attachment = application.attachments[attachmentIndex];
    
    // Headers الصحيحة
    res.setHeader('Content-Type', 'application/pdf'); // أو نوع الملف
    res.setHeader('Content-Disposition', `attachment; filename="${attachment.name}"`);
    
    // Streaming
    const fileStream = /* ... */;
    fileStream.pipe(res);
  }
);
```

---

### 3. Populate البيانات

#### في endpoint جلب الطلبات:
- [ ] `populate('applicantId', 'fullName firstName lastName email profilePhoto')`
- [ ] `populate('jobId', 'title titleAr sport')`

#### مثال:
```javascript
const applications = await Application.find({ jobId })
  .populate('applicantId', 'fullName firstName lastName email profilePhoto isVerified')
  .populate('jobId', 'title titleAr sport');
```

---

## 🧪 الاختبار

### اختبار الإشعارات:

#### 1. تقديم طلب توظيف:
```bash
curl -X POST http://localhost:3000/api/v1/jobs/JOB_ID/apply \
  -H "Authorization: Bearer PLAYER_TOKEN" \
  -F "resume=@cv.pdf" \
  -F "coverLetter=Hello, I am interested"
```

#### 2. التحقق من الإشعار:
- ✅ النادي يستلم إشعار مع اسم المتقدم الحقيقي (ليس "USER")
- ✅ المتقدم يستلم إشعار تأكيد
- ✅ الإشعارات تظهر في الداشبورد
- ✅ الإشعارات بالعربي/الإنجليزي حسب اللغة

### اختبار تحميل الملف:

#### 1. فتح الطلب في داشبورد النادي
#### 2. الضغط على "تحميل CV"
```bash
curl -H "Authorization: Bearer CLUB_TOKEN" \
  http://localhost:3000/api/v1/jobs/applications/APP_ID/download/0 \
  --output cv.pdf
```

#### 3. التحقق:
- ✅ الملف يُحمّل بنفس الاسم الأصلي
- ✅ الصيغة صحيحة (PDF/DOCX/etc)
- ✅ الملف يفتح بدون مشاكل

---

## 📋 Checklist النهائي

### قبل الإطلاق:
- [ ] كل الإشعارات تستخدم `new_notification` event
- [ ] اسم المتقدم يظهر بشكل صحيح (ليس "USER")
- [ ] الملفات تُحمّل بأسمائها وصيغها الأصلية
- [ ] الإشعارات ثنائية اللغة (Arabic/English)
- [ ] الإشعارات تظهر في الداشبوردات الأربع
- [ ] الصلاحيات محمية (Authorization)

---

## 📞 الدعم

إذا واجهت مشاكل:
1. راجع `FRONTEND_JOB_NOTIFICATIONS_GUIDE.md` للـ Frontend
2. راجع `BACKEND_JOB_NOTIFICATIONS_FIX.md` للـ Backend
3. تحقق من أن Socket.io متصل
4. تحقق من الـ Browser Console للأخطاء

---

**آخر تحديث**: نوفمبر 24، 2025
