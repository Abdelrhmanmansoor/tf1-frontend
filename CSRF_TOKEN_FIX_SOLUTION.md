# حل مشكلة CSRF Token Missing

## المشكلة
كانت تظهر رسالة التحذير التالية في الـ Backend:
```
[2026-01-13 02:51:01] WARN  CSRF: Token missing in header
```

## السبب
الـ Frontend كان يحاول إرسال POST/PUT/DELETE requests بدون CSRF token. رغم وجود interceptor لجلب الـ token تلقائياً، كان هناك احتمال لحدوث race condition أو عدم جلب الـ token قبل أول request.

## الحل المطبق

### 1. تحسين آلية جلب CSRF Token
- **الملف:** `services/api.ts`
- **التحسينات:**
  - إنشاء دالة مخصصة `fetchCsrfToken()` لجلب الـ token
  - حماية ضد concurrent requests (منع جلب الـ token أكثر من مرة في نفس الوقت)
  - استخدام `axios` مباشرة بدلاً من `api` instance لتجنب infinite loops
  - تحسين error handling والـ logging

### 2. تهيئة CSRF Token عند بدء التطبيق
- **الملفات الجديدة:**
  - `components/CsrfInitializer.tsx`: Component لتهيئة الـ token عند بدء التطبيق
  
- **التعديلات:**
  - إضافة `CsrfInitializer` في `app/layout.tsx`
  - تصدير `initializeCsrfToken` من `services/api.ts`

### 3. آلية العمل الجديدة

```
1. App Startup
   ↓
2. CsrfInitializer يجلب CSRF token
   ↓
3. Token يُحفظ في memory + localStorage
   ↓
4. عند أي POST/PUT/PATCH/DELETE request:
   - Interceptor يتحقق من وجود token
   - إذا موجود: يُرفق في الـ header
   - إذا غير موجود: يجلبه تلقائياً
   ↓
5. إذا كان Token منتهي الصلاحية (403):
   - يجلب token جديد
   - يعيد المحاولة تلقائياً
```

## الفوائد

✅ **منع التحذيرات:** لن تظهر رسالة "Token missing" بعد الآن
✅ **تجربة مستخدم أفضل:** Token جاهز قبل أي request
✅ **حماية من race conditions:** Concurrent requests لن تسبب مشاكل
✅ **Auto-retry:** إعادة المحاولة تلقائياً عند انتهاء صلاحية الـ token
✅ **Logging محسّن:** رسائل واضحة في console للـ debugging

## كيفية الاختبار

1. **افتح Developer Console في المتصفح**
2. **راقب الرسائل عند تحميل الصفحة:**
   ```
   [API] Fetching CSRF token...
   [API] CSRF token fetched and cached successfully
   ```

3. **راقب الرسائل عند إرسال POST request:**
   ```
   [API] CSRF token attached to request: eyJub25jZSI6...
   ```

4. **تأكد من عدم ظهور:**
   ```
   ❌ [API] No CSRF token available for request
   ❌ CSRF: Token missing in header
   ```

## ملاحظات مهمة

### للمطورين
- الـ CSRF token يُحفظ في:
  - **Memory:** `csrfTokenCache` (أسرع)
  - **localStorage:** `csrf_token` (يبقى بعد refresh)
  - **Cookie:** `XSRF-TOKEN` (للـ backend)

- الـ token صالح لمدة ساعة واحدة (configurable في backend)
- عند logout، يُمسح الـ token من كل الأماكن

### الأمان
- CSRF token مُوقّع cryptographically (HMAC SHA256)
- Origin validation على كل state-changing request
- Token expiration بعد ساعة للحماية
- Rate limiting على endpoint الـ CSRF

## الملفات المعدلة

1. ✅ `services/api.ts` - تحسين آلية جلب الـ token
2. ✅ `components/CsrfInitializer.tsx` - component جديد للتهيئة
3. ✅ `app/layout.tsx` - إضافة CsrfInitializer

## المرجع
- Backend CSRF implementation: `src/middleware/csrf.js`
- CSRF endpoint: `GET /api/v1/auth/csrf-token`
- Documentation: `CSRF_*.md` files in backend
