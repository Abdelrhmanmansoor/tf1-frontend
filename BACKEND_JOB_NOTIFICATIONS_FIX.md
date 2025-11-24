# 🔧 Backend - إصلاح إشعارات الوظائف وتحميل الملفات

## ✅ Frontend جاهز!

الـ Frontend محدّث بالكامل ويستخدم:
- ✅ Socket.io event: `new_notification`
- ✅ دعم ثنائي اللغة (Arabic/English)
- ✅ فلترة الإشعارات حسب النوع
- ✅ عرض الإشعارات في 4 داشبوردات (Player, Coach, Club, Specialist)

**الآن كل شيء جاهز في الـ Frontend - المشاكل التالية في الباك اند فقط!**

---

## 🚨 المشاكل التي يجب حلها في الباك اند:

### 1. ⚠️ اسم المتقدم يظهر "USER" بدلاً من الاسم الحقيقي

**المشكلة:**
عند إرسال إشعار للنادي عن طلب توظيف جديد، اسم المتقدم يظهر "USER" بدلاً من اسمه الحقيقي.

**السبب:**
الباك اند لا يرسل حقل `applicantName` بشكل صحيح في الإشعار.

**✅ الحل:**

عند إنشاء إشعار لطلب توظيف جديد، تأكد من إرسال اسم المتقدم:

```javascript
// ❌ خطأ - لا ترسل هذا:
socket.emit('new_notification', {
  type: 'job_application',
  notificationType: 'new_application',
  applicantName: 'USER', // ❌ خطأ!
  // ...
});

// ✅ صح - أرسل الاسم الحقيقي:
const applicant = await User.findById(application.applicantId);

socket.emit('new_notification', {
  type: 'job_application',
  notificationType: 'new_application',
  applicantName: applicant.fullName || `${applicant.firstName} ${applicant.lastName}`, // ✅ صح
  jobTitle: job.title,
  jobTitleAr: job.titleAr,
  clubName: club.name,
  title: 'New Job Application',
  titleAr: 'طلب توظيف جديد',
  message: `${applicant.fullName} applied for ${job.title} position`,
  messageAr: `${applicant.fullName} تقدم لوظيفة ${job.titleAr}`,
  actionUrl: `/club/applications/${application._id}`,
  userId: club.userId,
  applicationId: application._id,
  jobId: job._id,
  priority: 'normal',
  isRead: false,
  createdAt: new Date().toISOString(),
  storedIn: 'mongodb'
});
```

---

### 2. ⚠️ ملف CV يُحمّل بصيغة خاطئة

**المشكلة:**
عند تحميل ملف CV/Resume، الملف ينزل بدون اسمه الأصلي أو بصيغة خاطئة.

**السبب:**
Endpoint تحميل الملف لا يرسل `Content-Disposition` header بشكل صحيح.

**✅ الحل:**

أنشئ endpoint جديد لتحميل الملفات:

```javascript
// GET /api/v1/jobs/applications/:applicationId/download/:attachmentIndex
router.get(
  '/applications/:applicationId/download/:attachmentIndex',
  authMiddleware,
  async (req, res) => {
    try {
      const { applicationId, attachmentIndex } = req.params;
      const userId = req.user._id;

      // 1. جلب الطلب
      const application = await Application.findById(applicationId)
        .populate('jobId')
        .populate('applicantId');

      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }

      // 2. التحقق من الصلاحيات
      const job = application.jobId;
      const isClubOwner = job.clubId.toString() === userId.toString();
      const isApplicant = application.applicantId._id.toString() === userId.toString();

      if (!isClubOwner && !isApplicant) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      // 3. جلب الملف
      const index = parseInt(attachmentIndex);
      const attachment = application.attachments[index];

      if (!attachment) {
        return res.status(404).json({ error: 'Attachment not found' });
      }

      // 4. تحميل الملف من Cloudinary/Storage
      const fileUrl = attachment.url;
      const fileName = attachment.name;
      const fileType = attachment.type;

      // إذا كان الملف على Cloudinary
      if (fileUrl.includes('cloudinary')) {
        // Redirect to Cloudinary URL with proper headers
        const response = await axios.get(fileUrl, {
          responseType: 'stream'
        });

        // ✅ إضافة Headers الصحيحة
        res.setHeader('Content-Type', response.headers['content-type'] || 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        
        response.data.pipe(res);
      } else {
        // للملفات المخزنة محلياً
        const filePath = path.join(__dirname, '../uploads/', fileName);
        
        res.setHeader('Content-Type', mime.lookup(fileName) || 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
      }

    } catch (error) {
      console.error('Download error:', error);
      res.status(500).json({ error: 'Failed to download file' });
    }
  }
);
```

---

### 3. ✅ تأكد من `populate` في endpoint الطلبات

عند جلب طلبات التوظيف، تأكد من `populate` حقل `applicantId` بالكامل:

```javascript
// ❌ خطأ:
const applications = await Application.find({ jobId });

// ✅ صح:
const applications = await Application.find({ jobId })
  .populate('applicantId', 'fullName firstName lastName email profilePhoto isVerified')
  .populate('jobId', 'title titleAr sport');
```

---

## 🧪 اختبار سريع:

### اختبار الإشعار:

```bash
# يجب أن يظهر اسم المتقدم الحقيقي
curl -X POST http://localhost:3000/api/v1/jobs/JOB_ID/apply \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "resume=@cv.pdf" \
  -F "coverLetter=Hello"

# افحص الإشعار المُرسل - يجب أن يحتوي على:
# applicantName: "أحمد محمد" (الاسم الحقيقي)
# وليس "USER"
```

### اختبار تحميل الملف:

```bash
# يجب أن ينزل الملف بنفس الاسم والصيغة
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/jobs/applications/APP_ID/download/0 \
  --output downloaded_cv.pdf

# افحص الملف:
file downloaded_cv.pdf
# يجب أن يعرض: PDF document
```

---

## 📋 Checklist للباك اند:

### إشعارات الوظائف:
- [ ] استخدام `new_notification` event (ليس `job:notification`)
- [ ] إرسال `applicantName` من جدول Users (ليس "USER")
- [ ] إرسال `titleAr` و `messageAr` للدعم ثنائي اللغة
- [ ] إرسال `actionUrl` للرابط المخصص
- [ ] إرسال `priority` (normal, high, urgent)

### تحميل الملفات:
- [ ] إنشاء endpoint: `GET /api/v1/jobs/applications/:applicationId/download/:attachmentIndex`
- [ ] إضافة `Content-Type` header الصحيح
- [ ] إضافة `Content-Disposition` header مع اسم الملف
- [ ] التحقق من الصلاحيات (صاحب النادي أو المتقدم فقط)

### Populate البيانات:
- [ ] `populate('applicantId')` في كل endpoints الطلبات
- [ ] إرجاع `fullName`, `email`, `profilePhoto` في البيانات

---

## 📝 ملاحظات مهمة:

1. **MIME Types**: استخدم مكتبة مثل `mime-types` لتحديد نوع الملف تلقائياً
2. **File Streaming**: استخدم streaming للملفات الكبيرة (لا تقرأ الملف كله في الذاكرة)
3. **Security**: تأكد من التحقق من الصلاحيات قبل السماح بالتحميل
4. **Error Handling**: أرسل رسائل خطأ واضحة عند فشل التحميل

---

## 🔗 ملفات مرتبطة:

- `FRONTEND_JOB_NOTIFICATIONS_GUIDE.md` - دليل Frontend للإشعارات
- `ADMIN_BACKEND_COMMANDS.md` - دليل endpoints الأدمن

---

**آخر تحديث**: نوفمبر 24، 2025
