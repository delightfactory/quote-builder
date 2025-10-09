# دليل نظام النماذج المخصص

## نظرة عامة

تم إنشاء نظام نماذج ذكي ومتجاوب يمكن إعادة استخدامه وفقاً لأفضل الممارسات الاحترافية. النظام يوفر:

- **تصميم متجاوب**: يتكيف مع جميع أحجام الشاشات
- **إمكانية الوصول**: دعم كامل للوحة المفاتيح وقارئات الشاشة
- **إدارة التركيز**: حبس التركيز داخل النموذج
- **أداء محسن**: تحميل تدريجي ومنع تمرير الجسم
- **مرونة عالية**: قابل للتخصيص بالكامل

## المكونات الأساسية

### 1. Modal Component (`/src/components/ui/Modal.jsx`)

المكون الأساسي للنماذج مع جميع الميزات المطلوبة.

#### الخصائص (Props):

```jsx
<Modal
  isOpen={boolean}              // حالة فتح/إغلاق النموذج
  onClose={function}            // دالة الإغلاق
  title={string}                // عنوان النموذج
  description={string}          // وصف اختياري
  size="sm|default|lg|xl|full"  // حجم النموذج
  showCloseButton={boolean}     // إظهار زر الإغلاق (افتراضي: true)
  closeOnOverlayClick={boolean} // إغلاق بالنقر خارج النموذج (افتراضي: true)
  closeOnEscape={boolean}       // إغلاق بمفتاح Escape (افتراضي: true)
  className={string}            // فئات CSS إضافية
  headerClassName={string}      // فئات CSS للهيدر
  contentClassName={string}     // فئات CSS للمحتوى
  footerClassName={string}      // فئات CSS للفوتر
  footer={ReactNode}            // محتوى الفوتر
>
  {children}                    // محتوى النموذج
</Modal>
```

### 2. ModalProvider (`/src/contexts/ModalContext.jsx`)

مزود السياق لإدارة النماذج بشكل مركزي.

#### الدوال المتاحة:

```jsx
const {
  openModal,      // فتح نموذج مخصص
  closeModal,     // إغلاق نموذج محدد
  closeAllModals, // إغلاق جميع النماذج
  updateModal,    // تحديث نموذج موجود
  showConfirm,    // عرض نموذج تأكيد
  showAlert       // عرض نموذج تنبيه
} = useModal();
```

## أمثلة الاستخدام

### 1. نموذج بسيط

```jsx
import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

const SimpleModalExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        فتح النموذج
      </Button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="نموذج بسيط"
        size="default"
      >
        <p>هذا محتوى النموذج البسيط.</p>
      </Modal>
    </>
  );
};
```

### 2. استخدام ModalProvider

```jsx
import { useModal } from '@/contexts/ModalContext';
import Button from '@/components/ui/Button';

const ModalProviderExample = () => {
  const { showAlert, showConfirm, openModal } = useModal();

  const handleAlert = () => {
    showAlert({
      title: 'تنبيه',
      message: 'تم حفظ البيانات بنجاح!',
      buttonText: 'موافق'
    });
  };

  const handleConfirm = () => {
    showConfirm({
      title: 'تأكيد الحذف',
      message: 'هل أنت متأكد من حذف هذا العنصر؟',
      confirmText: 'حذف',
      cancelText: 'إلغاء',
      variant: 'destructive',
      onConfirm: () => {
        console.log('تم الحذف');
      }
    });
  };

  const handleCustomModal = () => {
    openModal({
      title: 'نموذج مخصص',
      size: 'lg',
      children: (
        <div>
          <p>محتوى مخصص هنا</p>
        </div>
      ),
      footer: (
        <div className="flex gap-2">
          <Button variant="ghost">إلغاء</Button>
          <Button>حفظ</Button>
        </div>
      )
    });
  };

  return (
    <div className="space-x-2">
      <Button onClick={handleAlert}>تنبيه</Button>
      <Button onClick={handleConfirm}>تأكيد</Button>
      <Button onClick={handleCustomModal}>نموذج مخصص</Button>
    </div>
  );
};
```

### 3. نموذج مع نموذج إدخال

```jsx
import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

const FormModalExample = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        فتح نموذج الإدخال
      </Button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="إدخال البيانات"
        size="default"
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSubmit}>
              حفظ
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">الاسم</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
              placeholder="أدخل اسمك"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
              placeholder="example@domain.com"
            />
          </div>
        </form>
      </Modal>
    </>
  );
};
```

## أحجام النماذج

| الحجم | الوصف | أقصى عرض |
|-------|--------|----------|
| `sm` | صغير للإجراءات السريعة | `max-w-md` |
| `default` | افتراضي للاستخدام العام | `max-w-lg sm:max-w-xl lg:max-w-2xl` |
| `lg` | كبير للمحتوى المفصل | `max-w-2xl sm:max-w-3xl lg:max-w-4xl` |
| `xl` | كبير جداً للتقارير | `max-w-3xl sm:max-w-4xl lg:max-w-5xl` |
| `full` | ملء الشاشة تقريباً | `max-w-[95vw] sm:max-w-[90vw] lg:max-w-[85vw]` |

## الميزات المتقدمة

### 1. إدارة التركيز
- حبس التركيز داخل النموذج
- العودة للعنصر السابق عند الإغلاق
- دعم التنقل بـ Tab

### 2. إمكانية الوصول
- دعم `aria-modal` و `role="dialog"`
- تسميات مناسبة للعناصر
- دعم قارئات الشاشة

### 3. التصميم المتجاوب
- تكيف تلقائي مع أحجام الشاشات
- مساحات آمنة للأجهزة المحمولة
- scrollbar مخصص

### 4. الأداء
- منع تمرير الجسم
- تحميل تدريجي للمحتوى
- إدارة ذاكرة محسنة

## التخصيص

### 1. الأنماط المخصصة

```jsx
<Modal
  className="custom-modal-class"
  headerClassName="custom-header"
  contentClassName="custom-content"
  footerClassName="custom-footer"
>
  {/* المحتوى */}
</Modal>
```

### 2. الأنماط في CSS

```css
/* تخصيص النموذج */
.custom-modal-class {
  border: 2px solid var(--primary);
}

/* تخصيص الهيدر */
.custom-header {
  background: linear-gradient(to right, var(--primary), var(--secondary));
}
```

## أفضل الممارسات

### 1. الاستخدام
- استخدم `showAlert` للرسائل البسيطة
- استخدم `showConfirm` للإجراءات المهمة
- استخدم `openModal` للنماذج المعقدة

### 2. الأداء
- تجنب فتح عدة نماذج في نفس الوقت
- استخدم `closeAllModals` عند الحاجة لإعادة تعيين الحالة

### 3. إمكانية الوصول
- وفر عناوين وصفية واضحة
- استخدم أوصاف مناسبة للمحتوى المعقد
- تأكد من إمكانية الوصول بلوحة المفاتيح

## استكشاف الأخطاء

### مشاكل شائعة:

1. **النموذج لا يظهر**: تأكد من تضمين `ModalProvider` في التطبيق
2. **مشاكل التركيز**: تحقق من وجود عناصر قابلة للتركيز داخل النموذج
3. **مشاكل التمرير**: تأكد من إضافة فئة `.modal-open` للجسم

### حلول:

```jsx
// تأكد من تضمين ModalProvider
function App() {
  return (
    <AppProvider>
      <ModalProvider>
        <YourApp />
      </ModalProvider>
    </AppProvider>
  );
}
```

## الدعم والتطوير

النظام قابل للتوسع ويمكن إضافة ميزات جديدة حسب الحاجة:

- إضافة أنواع نماذج جديدة
- تحسين الأنيميشن
- دعم النماذج المتداخلة
- إضافة ثيمات مخصصة

للمزيد من الأمثلة، راجع ملف `/src/components/examples/ModalExamples.jsx`.
