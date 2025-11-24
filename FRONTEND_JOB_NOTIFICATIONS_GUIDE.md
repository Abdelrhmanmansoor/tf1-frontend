# دليل إشعارات الوظائف وتحميل الملفات - Frontend Integration

## 🔔 Socket.io - إشعارات الوظائف

### التغييرات الجديدة:

تم توحيد جميع أحداث Socket.io للإشعارات. الآن كل الإشعارات تُرسل عبر حدث واحد: **`new_notification`**

### ❌ القديم (لا تستخدمه):

```javascript
// ❌ القديم - لا يعمل بعد الآن
socket.on('job:notification', (data) => {
  // ...
});
```

### ✅ الجديد (استخدم هذا):

```javascript
// ✅ الجديد - يعمل لكل أنواع الإشعارات
socket.on('new_notification', (notification) => {
  console.log('إشعار جديد:', notification);
  
  // تحديث UI
  updateNotificationsUI(notification);
});
```

---

## 📋 أنواع إشعارات الوظائف

### 1️⃣ للنادي (Club):
عند استلام طلب توظيف جديد:

```json
{
  "_id": "notification_id",
  "type": "job_application",
  "notificationType": "new_application",
  "applicationId": "app_id",
  "jobId": "job_id",
  "jobTitle": "مدرب كرة قدم",
  "jobTitleAr": "مدرب كرة قدم",
  "applicantName": "أحمد محمد",
  "clubName": "النادي الأهلي",
  "title": "New Job Application",
  "titleAr": "طلب توظيف جديد",
  "message": "Ahmed Mohamed applied for Coach position",
  "messageAr": "أحمد محمد تقدم لوظيفة مدرب كرة قدم",
  "actionUrl": "/club/applications/app_id",
  "userId": "club_user_id",
  "status": "new",
  "priority": "normal",
  "isRead": false,
  "createdAt": "2025-11-24T18:00:00.000Z",
  "storedIn": "mongodb"
}
```

### 2️⃣ للمتقدم (Applicant):

#### أ) تأكيد إرسال الطلب:

```json
{
  "_id": "notification_id",
  "type": "job_application",
  "notificationType": "application_submitted",
  "applicationId": "app_id",
  "jobId": "job_id",
  "jobTitle": "مدرب كرة قدم",
  "title": "Application Submitted",
  "titleAr": "تم إرسال طلبك",
  "message": "Your application for Coach has been submitted successfully",
  "messageAr": "تم إرسال طلبك لوظيفة مدرب كرة قدم بنجاح",
  "actionUrl": "/jobs/job_id/application/app_id",
  "priority": "normal",
  "isRead": false
}
```

#### ب) بدء المراجعة:

```json
{
  "type": "job_application",
  "notificationType": "application_reviewed",
  "title": "Application Under Review",
  "titleAr": "طلبك قيد المراجعة",
  "message": "Your application is now under review",
  "priority": "high"
}
```

#### ج) جدولة مقابلة:

```json
{
  "type": "job_application",
  "notificationType": "interview_scheduled",
  "title": "Interview Scheduled",
  "titleAr": "تم جدولة المقابلة",
  "interviewDate": "2025-11-30T10:00:00.000Z",
  "priority": "high"
}
```

#### د) استلام عرض عمل:

```json
{
  "type": "job_application",
  "notificationType": "job_offer_received",
  "title": "Job Offer Received!",
  "titleAr": "تم استلام عرض العمل!",
  "offerDetails": {
    "salary": 5000,
    "startDate": "2025-12-01"
  },
  "priority": "urgent"
}
```

#### هـ) القبول النهائي:

```json
{
  "type": "club_accepted",
  "notificationType": "application_accepted",
  "title": "Congratulations - You Are Hired!",
  "titleAr": "تهانينا - تم قبولك!",
  "priority": "urgent"
}
```

#### و) الرفض:

```json
{
  "type": "club_rejected",
  "notificationType": "application_rejected",
  "title": "Application Update",
  "titleAr": "تحديث الطلب",
  "priority": "normal"
}
```

---

## 📥 تحميل الملفات المرفوعة (CV/Resume/Documents)

### المشكلة السابقة:
الملفات كانت تُحمّل بصيغة غريبة بدون اسم أو نوع صحيح.

### ✅ الحل الجديد:

**Endpoint جديد للتحميل:**

```
GET /api/v1/jobs/applications/:applicationId/download/:attachmentIndex
```

**مثال استخدام:**

```javascript
// 1. الحصول على بيانات الطلب
const application = await fetch('/api/v1/jobs/:jobId/applications', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
}).then(res => res.json());

// 2. عرض الملفات المرفقة
application.attachments.forEach((attachment, index) => {
  console.log({
    name: attachment.name,              // اسم الملف الأصلي
    type: attachment.type,              // resume, cv, certificate, etc.
    uploadedAt: attachment.uploadedAt,  // تاريخ الرفع
    downloadLink: `/api/v1/jobs/applications/${application._id}/download/${index}`
  });
});

// 3. تحميل الملف (React/Vue/Angular)
const downloadFile = async (applicationId, attachmentIndex) => {
  const response = await fetch(
    `/api/v1/jobs/applications/${applicationId}/download/${attachmentIndex}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  // الملف سيُحمّل بشكل صحيح مع اسمه الأصلي
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = ''; // اسم الملف سيأتي من Content-Disposition header
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

// 4. استخدام مباشر (HTML)
<a 
  href={`/api/v1/jobs/applications/${applicationId}/download/${index}`}
  download
  target="_blank"
>
  تحميل {attachment.name}
</a>
```

---

## 🔒 الأمان (Authorization)

الـ endpoint يتحقق من:

- ✅ المستخدم مسجل دخول (JWT token)
- ✅ المستخدم إما صاحب الطلب أو صاحب النادي فقط

---

## 🎯 مثال كامل - React Component

```javascript
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

function JobNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // 1. الاتصال بـ Socket.io
    const newSocket = io('https://your-backend-api.com', {
      auth: {
        token: localStorage.getItem('token')
      }
    });

    // 2. الاستماع للإشعارات
    newSocket.on('new_notification', (notification) => {
      console.log('🔔 إشعار جديد:', notification);
      
      // فلترة إشعارات الوظائف فقط
      if (notification.type === 'job_application' || 
          notification.type === 'club_accepted' || 
          notification.type === 'club_rejected') {
        
        setNotifications(prev => [notification, ...prev]);
        
        // عرض Toast/Alert
        showToast({
          title: notification.titleAr || notification.title,
          message: notification.messageAr || notification.message,
          type: notification.priority === 'urgent' ? 'success' : 'info'
        });
      }
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  // 3. تحميل الملف
  const handleDownload = async (applicationId, index, filename) => {
    try {
      const response = await fetch(
        `/api/v1/jobs/applications/${applicationId}/download/${index}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('خطأ في التحميل:', error);
      alert('فشل تحميل الملف');
    }
  };

  return (
    <div className="notifications">
      <h2>الإشعارات</h2>
      {notifications.map(notification => (
        <div key={notification._id} className="notification-card">
          <h3>{notification.titleAr || notification.title}</h3>
          <p>{notification.messageAr || notification.message}</p>
          <small>{new Date(notification.createdAt).toLocaleString('ar-EG')}</small>
          
          {notification.actionUrl && (
            <a href={notification.actionUrl}>عرض التفاصيل</a>
          )}
        </div>
      ))}
    </div>
  );
}

export default JobNotifications;
```

---

## 📝 ملاحظات مهمة:

1. ✅ كل الإشعارات الآن عبر `new_notification` فقط
2. ✅ استخدم `notificationType` للتفريق بين أنواع الإشعارات المختلفة
3. ✅ الملفات الآن تُحمّل بشكل صحيح مع أسمائها الأصلية
4. ✅ Headers صحيحة: `Content-Type` و `Content-Disposition`
5. ✅ Authorization مطلوبة لتحميل الملفات

---

## 🧪 اختبار سريع:

```bash
# اختبار تحميل ملف
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/jobs/applications/APP_ID/download/0 \
  --output resume.pdf
```

---

## ✅ خطوات التنفيذ المطلوبة من فريق Frontend:

### 1. تحديث Socket.io Event Listener
- [ ] البحث عن جميع استخدامات `'job:notification'` في الكود
- [ ] تغييرها إلى `'new_notification'`
- [ ] التأكد من معالجة `notificationType` للتفريق بين الأنواع

### 2. تحديث تحميل الملفات
- [ ] استخدام endpoint الجديد: `/api/v1/jobs/applications/:applicationId/download/:attachmentIndex`
- [ ] إضافة Authorization header لكل طلب تحميل
- [ ] معالجة الملفات كـ blob وتحميلها بشكل صحيح

### 3. الاختبار
- [ ] تقديم طلب توظيف من حساب لاعب/مدرب
- [ ] التأكد من وصول إشعار للنادي
- [ ] التأكد من وصول إشعار تأكيد للمتقدم
- [ ] اختبار تحميل الملفات المرفقة (CV/Resume)
- [ ] اختبار على المتصفحات المختلفة

---

**تم بنجاح! ✅**

*آخر تحديث: نوفمبر 24، 2025*
