# CSRF Protection - Quick Reference 🔒

## ⚡ مرجع سريع للمطورين

### ✅ كيف تتحقق أن CSRF يعمل؟

#### في Developer Console:
```javascript
// 1. تحقق من التهيئة
window.__csrfInitialized  // يجب أن يكون true

// 2. تحقق من وجود Token
localStorage.getItem('csrf_token')  // يجب أن يُرجع token

// 3. تحقق من جاهزية CSRF
import { isCsrfReady } from '@/services/api'
isCsrfReady()  // يجب أن يُرجع true
```

#### في Console Logs:
```bash
# عند تحميل الصفحة:
[CSRF Init] 🚀 Starting CSRF protection initialization...
[CSRF] 🔄 Fetching new CSRF token from server...
[CSRF] ✅ Token fetched and cached: eyJub25jZSI6...
[CSRF Init] ✅ CSRF protection ready

# عند POST Request:
[CSRF] ✓ Token attached to POST /api/v1/auth/login: eyJub25jZSI6...
```

---

## 🛠️ Helper Functions

### تهيئة CSRF (تلقائي - في layout.tsx)
```typescript
import { initializeCsrfToken } from '@/services/api'

await initializeCsrfToken()
```

### التحقق من جاهزية CSRF
```typescript
import { isCsrfReady } from '@/services/api'

if (isCsrfReady()) {
  console.log('CSRF ready ✅')
} else {
  console.log('CSRF not ready ❌')
}
```

### تحديث Token يدوياً
```typescript
import { refreshCsrfToken } from '@/services/api'

const success = await refreshCsrfToken()
if (success) {
  console.log('Token refreshed ✅')
}
```

---

## 🐛 Debug في Development

### استخدام Debug Panel
```typescript
// في app/layout.tsx
import { CsrfDebugPanel } from '@/components/CsrfDebugPanel'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        {process.env.NODE_ENV === 'development' && <CsrfDebugPanel />}
      </body>
    </html>
  )
}
```

### رؤية حالة CSRF
- اضغط على أيقونة 🔒 في أسفل يمين الشاشة
- تظهر panel تعرض:
  - Status: ✅ Ready / ❌ Not Ready
  - Token: Cached / Missing
  - زر Refresh للتحديث اليدوي

---

## ❌ استكشاف الأخطاء

### المشكلة: "Token missing in header"

**الحل السريع:**
```javascript
// 1. امسح cache
localStorage.clear()

// 2. حدّث الصفحة
location.reload()

// 3. افحص Console للتأكد من التهيئة
```

**إذا استمرت المشكلة:**
```javascript
// افحص Network Tab
// 1. هل تم استدعاء /auth/csrf-token؟
// 2. هل Response يحتوي على token؟
// 3. هل Request Headers تحتوي على X-CSRF-Token؟
```

---

### المشكلة: Token Expired بسرعة

**الحل:**
```javascript
// في Backend: src/middleware/csrf.js
const CSRF_TOKEN_TTL_MS = 7200000 // 2 hours (بدلاً من 1 hour)
```

---

### المشكلة: CORS Error

**الحل:**
تأكد من CORS settings في Backend:
```javascript
// في server.js
allowedHeaders: [
  'Content-Type',
  'Authorization',
  'X-CSRF-Token',     // مهم!
  'x-csrf-token',     // مهم!
],
exposedHeaders: [
  'X-CSRF-Token',     // مهم!
]
```

---

## 📝 Console Logs Reference

### ✅ Logs طبيعية (كل شيء يعمل)

```bash
[CSRF Init] 🚀 Starting CSRF protection initialization...
[CSRF] 🔄 Fetching new CSRF token from server...
[CSRF] ✅ Token fetched and cached: eyJub25jZSI6IjRh...
[CSRF] Token will be attached to all POST/PUT/PATCH/DELETE requests
[CSRF Init] ✅ CSRF protection ready
[CSRF] ✓ Token attached to POST /api/v1/auth/login: eyJub25jZSI6...
```

### ⚠️ Logs تحذيرية (لكن لا مشكلة)

```bash
[CSRF] Already fetching token, waiting...
# → عدة requests في نفس الوقت، ينتظرون نفس الـ fetch

[CSRF] ⚠️  No cached token found, fetching new one...
# → Token مسح أو expired، سيجلب واحد جديد

[CSRF] 🔄 Error detected (CSRF_TOKEN_EXPIRED), fetching new token and retrying...
# → Token انتهت صلاحيته، auto-retry
```

### ❌ Logs خطأ (تحتاج تدخل)

```bash
[CSRF] ❌ Invalid token received from server
# → Backend لم يُرجع token صحيح - افحص الـ endpoint

[CSRF] ❌ Failed to fetch CSRF token: Network Error
# → Backend غير متاح - تأكد من أنه يعمل

[CSRF] ❌ CRITICAL: No CSRF token available for POST...
# → Token غير موجود والـ fetch فشل - الـ request سيفشل بـ 403
```

---

## 🔐 الأمان - Best Practices

### ✅ افعل:
- استخدم HTTPS في production
- حافظ على CSRF_SECRET سري في .env
- استخدم token expiration معقول (1-2 ساعات)
- راقب الـ logs للـ suspicious activity

### ❌ لا تفعل:
- لا تعطل CSRF protection في production
- لا تشارك CSRF_SECRET في الكود
- لا تزيد expiration عن 24 ساعة
- لا تسمح بـ wildcard CORS في production

---

## 📚 الملفات المهمة

### Frontend:
- `services/api.ts` - CSRF logic
- `components/CsrfInitializer.tsx` - Auto initialization
- `components/CsrfDebugPanel.tsx` - Debug tool
- `app/layout.tsx` - Initialization mount point

### Backend:
- `src/middleware/csrf.js` - CSRF middleware
- `src/modules/auth/routes/auth.routes.js` - CSRF endpoint
- `server.js` - CORS configuration

---

## 🎯 نصائح للإنتاجية

### عند تطوير ميزة جديدة:
1. لا تقلق من CSRF - يعمل تلقائياً
2. استخدم Debug Panel للتحقق إذا واجهت مشكلة
3. افحص Console logs قبل البحث عن الخطأ

### عند Debugging:
1. افتح Console أولاً
2. ابحث عن CSRF logs
3. استخدم `isCsrfReady()` للتحقق السريع
4. استخدم `refreshCsrfToken()` لإعادة المحاولة

### عند Deploy:
1. تأكد من CSRF_SECRET في .env
2. تأكد من CORS settings صحيحة
3. راقب الـ logs بعد الـ deploy
4. اختبر login/register للتأكد

---

**للمزيد من التفاصيل، راجع: `CSRF_TOKEN_FIX_SOLUTION.md`**
