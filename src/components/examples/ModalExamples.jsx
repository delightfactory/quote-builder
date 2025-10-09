import { useState } from 'react';
import { useModal } from '@/contexts/ModalContext';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { Card } from '../ui/Card';
import { AlertTriangle, Info, CheckCircle, Settings, User, FileText } from 'lucide-react';

const ModalExamples = () => {
  const { openModal, showConfirm, showAlert } = useModal();
  const [customModalOpen, setCustomModalOpen] = useState(false);

  // Example 1: Simple Alert
  const handleSimpleAlert = () => {
    showAlert({
      title: 'معلومة مهمة',
      message: 'تم حفظ البيانات بنجاح في قاعدة البيانات المحلية.',
      buttonText: 'فهمت'
    });
  };

  // Example 2: Confirmation Dialog
  const handleConfirmation = () => {
    showConfirm({
      title: 'تأكيد الحذف',
      message: 'هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.',
      confirmText: 'حذف',
      cancelText: 'إلغاء',
      variant: 'destructive',
      onConfirm: () => {
        console.log('تم الحذف');
        showAlert({
          title: 'تم الحذف',
          message: 'تم حذف العنصر بنجاح.',
        });
      },
      onCancel: () => {
        console.log('تم الإلغاء');
      }
    });
  };

  // Example 3: Custom Modal with Form
  const handleCustomModal = () => {
    openModal({
      title: 'إعدادات المستخدم',
      description: 'قم بتحديث معلومات حسابك الشخصي',
      size: 'default',
      children: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">الاسم الأول</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="أدخل اسمك الأول"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">الاسم الأخير</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="أدخل اسمك الأخير"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
            <input 
              type="email" 
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="example@domain.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">نبذة شخصية</label>
            <textarea 
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="اكتب نبذة مختصرة عنك..."
            />
          </div>
        </div>
      ),
      footer: (
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => {}}>
            إلغاء
          </Button>
          <Button onClick={() => {
            showAlert({
              title: 'تم الحفظ',
              message: 'تم حفظ إعداداتك بنجاح.',
            });
          }}>
            حفظ التغييرات
          </Button>
        </div>
      )
    });
  };

  // Example 4: Large Modal with Content
  const handleLargeModal = () => {
    openModal({
      title: 'تقرير مفصل',
      description: 'عرض شامل لجميع البيانات والإحصائيات',
      size: 'xl',
      children: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Card key={item} className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">عنصر {item}</h4>
                    <p className="text-sm text-muted-foreground">وصف مختصر</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>القيمة:</span>
                    <span className="font-medium">{item * 100} ج.م</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>النسبة:</span>
                    <span className="font-medium">{item * 10}%</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="font-semibold mb-2">ملاحظات إضافية</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              هذا مثال على محتوى طويل داخل نموذج كبير. يمكن أن يحتوي على جداول، رسوم بيانية، 
              أو أي محتوى آخر يتطلب مساحة أكبر للعرض. النموذج يتكيف تلقائياً مع حجم المحتوى 
              ويوفر تمرير عمودي عند الحاجة.
            </p>
          </div>
        </div>
      ),
      footer: (
        <div className="flex gap-3 justify-between">
          <Button variant="outline">
            تصدير PDF
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost">
              إغلاق
            </Button>
            <Button>
              طباعة
            </Button>
          </div>
        </div>
      )
    });
  };

  // Example 5: Small Modal
  const handleSmallModal = () => {
    setCustomModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">أمثلة على النماذج المخصصة</h2>
        <p className="text-muted-foreground mb-6">
          مجموعة من الأمثلة التوضيحية لاستخدام نظام النماذج الجديد
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Info className="h-6 w-6 text-blue-500" />
            <h3 className="font-semibold">تنبيه بسيط</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            عرض رسالة معلوماتية بسيطة للمستخدم
          </p>
          <Button onClick={handleSimpleAlert} className="w-full">
            عرض التنبيه
          </Button>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="h-6 w-6 text-orange-500" />
            <h3 className="font-semibold">تأكيد الإجراء</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            طلب تأكيد من المستخدم قبل تنفيذ إجراء مهم
          </p>
          <Button onClick={handleConfirmation} variant="destructive" className="w-full">
            حذف عنصر
          </Button>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <User className="h-6 w-6 text-green-500" />
            <h3 className="font-semibold">نموذج مخصص</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            نموذج يحتوي على نموذج إدخال بيانات
          </p>
          <Button onClick={handleCustomModal} className="w-full">
            فتح الإعدادات
          </Button>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="h-6 w-6 text-purple-500" />
            <h3 className="font-semibold">نموذج كبير</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            نموذج بحجم كبير لعرض محتوى مفصل
          </p>
          <Button onClick={handleLargeModal} className="w-full">
            عرض التقرير
          </Button>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Settings className="h-6 w-6 text-gray-500" />
            <h3 className="font-semibold">نموذج صغير</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            نموذج بحجم صغير للإجراءات السريعة
          </p>
          <Button onClick={handleSmallModal} variant="outline" className="w-full">
            إعدادات سريعة
          </Button>
        </Card>
      </div>

      {/* Custom Modal Example */}
      <Modal
        isOpen={customModalOpen}
        onClose={() => setCustomModalOpen(false)}
        title="إعدادات سريعة"
        size="sm"
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setCustomModalOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={() => setCustomModalOpen(false)}>
              تطبيق
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">الإشعارات</span>
            <input type="checkbox" className="rounded" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">الوضع الداكن</span>
            <input type="checkbox" className="rounded" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">الحفظ التلقائي</span>
            <input type="checkbox" className="rounded" defaultChecked />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ModalExamples;
