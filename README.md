# 🛠️ أداة عروض الأسعار الاحترافية - Quote Builder Pro

![PWA Ready](https://img.shields.io/badge/PWA-Ready-success)
![React](https://img.shields.io/badge/React-18-blue)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)

تطبيق ويب احترافي متقدم (PWA) لإنشاء وإدارة عروض الأسعار مع دعم المصنع والحسابات التلقائية الذكية.

## ✨ المميزات الرئيسية

### **إدارة المنتجات والعروض**
- 📦 **إدارة المنتجات**: عرض وفلترة 100+ منتج حسب التصنيف والسعر
- 💰 **حسابات ذكية**: حساب تلقائي للتكلفة والهوامش الربحية والأرباح
- 🎯 **هندسة العروض**: بناء عروض احترافية مع تحكم كامل في الكميات والأسعار
- 📊 **معاينة شاملة**: معاينة مفصلة للعروض قبل الطباعة
- 💾 **حفظ العروض**: حفظ وإدارة عروض متعددة في LocalStorage

### **نظام دعم المصنع 🎁**
- 🏭 **40+ منتج مدعوم**: دعم مصنعي على منتجات محددة
- 🎚️ **3 طرق للتحكم**: أزرار سريعة، Slider، إدخال مباشر
- 💸 **حسابات دقيقة**: حساب تلقائي للتكلفة الفعلية بعد الدعم
- 📈 **زيادة الهامش**: رفع هامش الربح حتى 90%+
- 🎨 **واجهة قابلة للطي**: توفير المساحة مع سهولة الوصول

### **Progressive Web App (PWA)**
- 📱 **قابل للتثبيت**: تثبيت التطبيق على الهاتف/الكمبيوتر
- ⚡ **سريع جداً**: تحميل فوري مع Cache ذكي
- 🔌 **العمل بدون إنترنت**: استمرار العمل في وضع Offline
- 🔄 **تحديثات تلقائية**: تحديث Service Worker التلقائي
- 🎯 **تجربة Native**: يعمل مثل تطبيق حقيقي

### **تجربة المستخدم**
- 🌓 **الوضع الداكن**: دعم كامل للوضع الفاتح والداكن
- 📱 **تصميم متجاوب**: يعمل على جميع أحجام الشاشات
- 🎨 **واجهة عصرية**: تصميم احترافي مع Animations سلسة
- 🇪🇬 **أرقام إنجليزية**: عرض جميع الأرقام بالإنجليزية

## 🚀 البدء السريع

### 1. التثبيت

```bash
npm install
```

### 2. توليد الأيقونات

```bash
npm run generate-icons
```

### 3. التشغيل المحلي

```bash
npm run dev
```

الموقع سيعمل على: `http://localhost:5173`

### 4. البناء للإنتاج

```bash
npm run build
```

### 5. معاينة Production

```bash
npm run preview
```

---

## 🌐 النشر على Vercel

### الطريقة السريعة:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### خطوات مفصلة:

```bash
# 1. تثبيت Vercel CLI
npm install -g vercel

# 2. تسجيل الدخول
vercel login

# 3. النشر
vercel --prod
```

**أو عبر GitHub:**
1. ارفع المشروع على GitHub
2. اربط Repository مع Vercel
3. Deploy تلقائي عند كل Push

📚 **دليل كامل**: اقرأ [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## 🏗️ التقنيات المستخدمة

### **Frontend**
- **React 18** - مكتبة واجهة المستخدم الحديثة
- **Vite** - أداة البناء السريعة
- **TailwindCSS** - إطار عمل CSS Utility-First
- **Lucide React** - مكتبة أيقونات عصرية
- **PapaParse** - معالجة ملفات CSV

### **PWA Stack**
- **Service Worker** - للعمل بدون إنترنت
- **Web App Manifest** - للتثبيت على الأجهزة
- **Cache API** - لتحسين السرعة

### **State Management**
- **React Context API** - إدارة الحالة العامة
- **LocalStorage** - حفظ البيانات محلياً

### **Deployment**
- **Vercel** - استضافة وCDN عالمي
- **GitHub** - Version Control

## 📋 بنية المشروع

```
saletool-v2/
├── public/
│   ├── icons/                    # أيقونات PWA بجميع الأحجام
│   ├── manifest.json             # Web App Manifest
│   ├── service-worker.js         # Service Worker
│   ├── browserconfig.xml         # إعدادات Microsoft
│   ├── items_final_*.csv         # بيانات المنتجات
│   └── final_unified_products.csv # بيانات الدعم
│
├── src/
│   ├── components/
│   │   ├── ui/                   # مكونات UI أساسية
│   │   ├── Header.jsx            # الترويسة
│   │   ├── ProductsView.jsx      # عرض المنتجات
│   │   ├── QuoteView.jsx         # عرض العرض
│   │   ├── QuoteItemCard.jsx     # بطاقة منتج مع دعم
│   │   ├── SubsidyPanel.jsx      # لوحة الدعم
│   │   ├── SubsidySummary.jsx    # ملخص الدعم
│   │   ├── QuotePreview.jsx      # معاينة العرض
│   │   ├── InstallPWA.jsx        # مكون تثبيت PWA
│   │   └── ...
│   │
│   ├── contexts/
│   │   └── AppContext.jsx        # Context رئيسي
│   │
│   ├── utils/
│   │   ├── csvParser.js          # معالجة CSV
│   │   ├── subsidyParser.js      # نظام الدعم
│   │   ├── localStorage.js       # LocalStorage utilities
│   │   └── registerServiceWorker.js # PWA utilities
│   │
│   ├── App.jsx                   # المكون الرئيسي
│   ├── main.jsx                  # نقطة الدخول
│   └── index.css                 # Styles عامة
│
├── vercel.json                   # إعدادات Vercel
├── generate-icons.js             # script توليد الأيقونات
├── DEPLOYMENT_GUIDE.md           # دليل النشر
├── SUBSIDY_SYSTEM_GUIDE.md       # دليل نظام الدعم
└── README.md                     # هذا الملف
```

## 🎨 التصميم

التطبيق مصمم بعناية فائقة مع:
- واجهة مستخدم عصرية واحترافية
- تجربة مستخدم سلسة وتفاعلية
- ألوان متناسقة في الوضعين الفاتح والداكن
- رسوم متحركة سلسة

## 📝 دليل الاستخدام

### **إنشاء عرض جديد:**

1. **استعراض المنتجات** 📦
   - تصفح 100+ منتج
   - ابحث بالاسم أو الكود
   - فلتر حسب الفئة والسعر

2. **إضافة المنتجات** ➕
   - اضغط "إضافة للعرض"
   - حدد الكمية المطلوبة
   - المنتجات المدعومة تظهر بـ 🎁

3. **تطبيق الدعم** 💰 (للمنتجات المدعومة)
   - افتح لوحة الدعم
   - اختر نسبة الدعم (0-100%)
   - 3 طرق: أزرار سريعة / Slider / إدخال مباشر
   - شاهد التكلفة الفعلية فوراً

4. **تحديد السعر النهائي** 🎯
   - **طريقة 1**: حدد هامش الربح المطلوب
   - **طريقة 2**: أدخل السعر النهائي مباشرة
   - الحسابات تتم تلقائياً

5. **المعاينة والحفظ** 💾
   - راجع ملخص العرض
   - اطبع أو صدّر PDF
   - احفظ العرض للرجوع إليه لاحقاً

### **تثبيت كـ PWA:**

#### **على الهاتف:**
- **Android**: Menu → "Install app"
- **iOS**: Share → "Add to Home Screen"

#### **على الكمبيوتر:**
- اضغط أيقونة التثبيت (+) في شريط العنوان
- أو اضغط الإشعار الذي سيظهر

---

## 🎁 نظام دعم المصنع

### **المميزات:**
```
✅ 40+ منتج مدعوم من المصنع
✅ لوحة تحكم قابلة للطي
✅ 3 طرق لضبط نسبة الدعم
✅ حسابات فورية للتكلفة الفعلية
✅ عرض الهامش قبل وبعد الدعم
✅ ملخص شامل لإجمالي الدعم
```

### **مثال:**
```
منتج: BLACK- RECHARGE 200 ML
التكلفة الأصلية: 18.06 ج.م
أقصى دعم: 30.69 ج.م

عند تطبيق 50% دعم:
→ قيمة الدعم: 15.35 ج.م
→ التكلفة الفعلية: 2.71 ج.م
→ الهامش الفعلي: 94.4% 🚀
```

📚 **دليل كامل**: اقرأ [SUBSIDY_SYSTEM_GUIDE.md](./SUBSIDY_SYSTEM_GUIDE.md)

---

## 📱 PWA Features

### **ماذا يعني PWA؟**
Progressive Web App = تطبيق ويب يعمل مثل تطبيق حقيقي!

### **المزايا:**
- ⚡ **سريع**: تحميل فوري مع Cache
- 🔌 **Offline**: العمل بدون إنترنت
- 📲 **Installable**: تثبيت على الجهاز
- 🔄 **Auto-Update**: تحديثات تلقائية
- 🎯 **Native-like**: تجربة مثل التطبيقات

### **التحقق من PWA:**
```bash
# في Chrome DevTools
F12 → Application → Manifest
F12 → Application → Service Workers
F12 → Lighthouse → Run PWA Audit
```

---

## 🔧 البيئة والإعدادات

### **المتطلبات:**
- Node.js 18+ 
- npm 9+

### **Scripts المتاحة:**
```bash
npm run dev           # تشغيل Development
npm run build         # بناء Production
npm run preview       # معاينة Build
npm run lint          # فحص الكود
npm run generate-icons # توليد أيقونات PWA
npm run vercel-build  # بناء لـ Vercel
```

### **Environment Variables:**
لا توجد متغيرات بيئة مطلوبة حالياً. جميع البيانات من CSV files.

---

## 📊 الأداء

### **Metrics:**
```
⚡ First Contentful Paint: < 1s
⚡ Time to Interactive: < 2s
⚡ Lighthouse Score: 95+
📦 Bundle Size: ~200KB gzipped
🔄 Cache Hit Rate: 98%+
```

### **Optimizations:**
- Code Splitting
- Tree Shaking
- Service Worker Caching
- LocalStorage للبيانات
- Lazy Loading للمكونات

---

## 🐛 استكشاف الأخطاء

### **المشكلة: Service Worker لا يعمل**
```bash
# حل: امسح Cache وأعد تحميل
Ctrl+Shift+R  # Hard Refresh
```

### **المشكلة: البيانات لا تظهر**
```bash
# حل: تأكد من وجود CSV files في /public
ls public/*.csv
```

### **المشكلة: Build يفشل**
```bash
# حل: امسح node_modules وأعد التثبيت
rm -rf node_modules
npm install
npm run build
```

---

## 🤝 المساهمة

مساهماتك مرحب بها! 

### **خطوات المساهمة:**
1. Fork المشروع
2. أنشئ Branch جديد (`git checkout -b feature/amazing`)
3. Commit تعديلاتك (`git commit -m 'Add amazing feature'`)
4. Push للـ Branch (`git push origin feature/amazing`)
5. افتح Pull Request

---

## 📄 الترخيص

هذا المشروع مفتوح المصدر ومتاح للاستخدام الشخصي والتجاري.

---

## 📞 الدعم

لأي استفسارات أو مشاكل:
- افتح Issue على GitHub
- راجع [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- راجع [SUBSIDY_SYSTEM_GUIDE.md](./SUBSIDY_SYSTEM_GUIDE.md)

---

## 🎉 الميزات القادمة

- [ ] Export إلى Excel
- [ ] Multi-language support
- [ ] Cloud sync
- [ ] Templates للعروض
- [ ] Analytics dashboard
- [ ] Email integration

---

**صُنع بـ ❤️ في مصر 🇪🇬**

**🚀 جرّب الآن: [Deploy على Vercel](https://vercel.com/new)**
