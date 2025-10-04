# 🔧 دليل استكشاف أخطاء الإنتاج

## المشاكل الشائعة بعد النشر

---

## 1️⃣ نظام الدعم لا يظهر في Production

### **الأعراض:**
```
✓ التطبيق يعمل
✓ المنتجات تظهر
✗ لوحة الدعم لا تظهر
✗ Badge "🎁 قابل للدعم" غير موجود
```

### **السبب:**
ملف CSV الخاص بالدعم لم يتم تحميله بشكل صحيح.

### **الحل:**

#### **خطوة 1: فحص Console في Production**

```javascript
// افتح DevTools في موقع Production
// اضغط F12 → Console

// ابحث عن هذه الرسائل:
🔄 Loading subsidy data...
✅ Loaded X subsidized products

// إذا رأيت:
❌ Error loading subsidy data
// أو
⚠️ No data found in subsidy CSV
```

#### **خطوة 2: التحقق من وجود الملفات**

```bash
# تأكد من وجود الملفات في /public
ls public/
# يجب أن ترى:
# - final_unified_products.csv
# - items_final_with_care_category_v3.csv
```

#### **خطوة 3: إعادة Build و Deploy**

```bash
# 1. نظف build القديم
rm -rf dist

# 2. Build جديد
npm run build

# 3. تحقق من dist
ls dist/
# يجب أن ترى الملفات CSV

# 4. Re-deploy
git add .
git commit -m "fix: ensure CSV files are included in build"
git push

# أو مع Vercel CLI:
vercel --prod
```

---

## 2️⃣ PWA Install لا يعمل

### **الأعراض:**
```
✗ لا يظهر زر "Install App"
✗ لا notification للتثبيت
✗ لا أيقونة (+) في شريط العنوان
```

### **الأسباب المحتملة:**

#### **A. Service Worker فشل في التسجيل**

**الفحص:**
```javascript
// في Console
navigator.serviceWorker.getRegistrations().then(regs => {
  console.log('Registered SWs:', regs);
  // يجب أن يُرجع array فيه Service Worker
});
```

**الحل:**
```bash
# 1. تحقق من وجود service-worker.js
curl https://your-site.vercel.app/service-worker.js
# يجب أن يُرجع محتوى الملف

# 2. تحقق من Headers
curl -I https://your-site.vercel.app/service-worker.js
# يجب أن ترى:
# Content-Type: application/javascript
# Service-Worker-Allowed: /
```

#### **B. HTTPS غير مفعل**

Service Workers تحتاج HTTPS!

**الفحص:**
```javascript
console.log('Is Secure Context?', window.isSecureContext);
// يجب أن يكون true
```

**الحل:**
- Vercel تلقائياً يوفر HTTPS ✅
- تأكد أنك تفتح https:// وليس http://

#### **C. Manifest.json غير متاح**

**الفحص:**
```bash
curl https://your-site.vercel.app/manifest.json
# يجب أن يُرجع JSON صحيح
```

**الحل:**
```bash
# تأكد من وجود manifest.json في /public
ls public/manifest.json

# Re-deploy
npm run build
vercel --prod
```

#### **D. الأيقونات غير موجودة**

**الفحص:**
```bash
# تحقق من الأيقونات
curl -I https://your-site.vercel.app/icons/icon-192x192.svg
# يجب أن يُرجع 200 OK
```

**الحل:**
```bash
# ولّد الأيقونات مرة أخرى
npm run generate-icons

# تأكد من وجودها
ls public/icons/

# Re-build & deploy
npm run build
git add .
git commit -m "fix: add PWA icons"
git push
```

---

## 3️⃣ خطوات التحقق السريع

### **✅ Checklist بعد كل Deploy:**

```bash
# 1. التحقق من الملفات الأساسية
curl https://YOUR-SITE.vercel.app/manifest.json
curl https://YOUR-SITE.vercel.app/service-worker.js
curl https://YOUR-SITE.vercel.app/final_unified_products.csv
curl https://YOUR-SITE.vercel.app/icons/icon-192x192.svg

# 2. فحص Console في Production
# افتح DevTools → Console
# يجب أن ترى:
✅ Service Worker registered successfully
✅ Loaded X products
✅ Loaded Y subsidized products

# 3. فحص PWA
# في Chrome DevTools:
F12 → Application → Manifest
# يجب أن يظهر manifest.json كامل

F12 → Application → Service Workers
# يجب أن يظهر service-worker.js مفعّل

# 4. اختبار Lighthouse
F12 → Lighthouse → Run PWA Audit
# يجب أن تحصل على درجة 90+
```

---

## 4️⃣ أدوات التشخيص

### **في Production Site:**

```javascript
// في Console، نفّذ هذه الأوامر:

// 1. فحص Service Worker
navigator.serviceWorker.getRegistrations().then(regs => {
  console.log('SWs:', regs.map(r => ({
    scope: r.scope,
    state: r.active?.state,
    updateViaCache: r.updateViaCache
  })));
});

// 2. فحص الـ Manifest
fetch('/manifest.json')
  .then(r => r.json())
  .then(manifest => console.log('Manifest:', manifest))
  .catch(e => console.error('Manifest error:', e));

// 3. فحص ملف الدعم
fetch('/final_unified_products.csv')
  .then(r => r.text())
  .then(text => console.log('CSV loaded, length:', text.length))
  .catch(e => console.error('CSV error:', e));

// 4. فحص Cache
caches.keys().then(keys => console.log('Cache keys:', keys));
```

---

## 5️⃣ إعادة Deploy النظيفة

إذا كل شيء فشل، جرب clean deploy:

```bash
# 1. احذف node_modules و dist
rm -rf node_modules dist

# 2. تثبيت نظيف
npm install

# 3. ولّد الأيقونات
npm run generate-icons

# 4. Build
npm run build

# 5. تحقق من dist
ls dist/
ls dist/icons/
# تأكد من وجود CSV files و icons

# 6. Deploy
vercel --prod --force

# أو عبر Git:
git add .
git commit -m "chore: clean rebuild"
git push --force
```

---

## 6️⃣ مشاكل Vercel محددة

### **Build Logs**

```
1. اذهب إلى Vercel Dashboard
2. اختر المشروع
3. Deployments → اختر آخر deployment
4. اضغط "View Build Logs"
5. ابحث عن أخطاء في:
   - Installing dependencies
   - Building
   - Copying files
```

### **إعدادات Build**

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### **Environment Variables**

لا توجد متغيرات بيئة مطلوبة حالياً ✅

---

## 7️⃣ Testing في Production

### **Test PWA Install:**

```
Android (Chrome):
1. افتح الموقع
2. Menu → "Install app"
3. يجب أن يعمل!

iOS (Safari):
1. افتح الموقع
2. Share → "Add to Home Screen"
3. يجب أن يعمل!

Desktop (Chrome/Edge):
1. افتح الموقع
2. ابحث عن أيقونة (+) في Address Bar
3. أو notification في الأسفل
4. يجب أن يظهر خلال 30 ثانية
```

### **Test Offline Mode:**

```
1. افتح الموقع
2. F12 → Network → ✓ Offline
3. أعد تحميل الصفحة
4. يجب أن يعمل!
```

### **Test Subsidy System:**

```
1. اذهب للمنتجات
2. ابحث عن منتج فيه 🎁 badge
3. أضفه للعرض
4. يجب أن ترى لوحة الدعم
5. اضبط نسبة الدعم
6. يجب أن تتحدث الأرقام فوراً
```

---

## 8️⃣ الحصول على المساعدة

إذا لم تحل المشكلة:

```
1. افتح DevTools Console
2. انسخ جميع الرسائل (خاصة الأخطاء)
3. افتح Issue على GitHub مع:
   - رابط الموقع
   - Screenshots من Console
   - خطوات إعادة المشكلة
```

---

## ✅ النتيجة المتوقعة

بعد الإصلاح، يجب أن ترى في Console:

```
🔄 Loading products...
✅ Loaded 100+ products
🔄 Loading subsidy data...
📂 Attempting to load subsidy data from: /final_unified_products.csv
📊 Parse complete. Results: [...]
✅ Loaded 40+ subsidized products
✅ Subsidy data loaded successfully
🔄 Attempting to register Service Worker...
✅ Service Worker registered successfully
   Scope: https://your-site.vercel.app/
   State: activated
```

وفي التطبيق:
```
✅ المنتجات تظهر
✅ Badge 🎁 يظهر على المنتجات المدعومة
✅ لوحة الدعم تعمل
✅ الحسابات صحيحة
✅ أيقونة Install تظهر
✅ PWA قابل للتثبيت
```

---

**🎉 مبروك! التطبيق يعمل بشكل كامل في Production**
