import { useState } from 'react';
import { useModal } from '@/contexts/ModalContext';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';

const ModalTest = () => {
  const { showAlert, showConfirm, openModal } = useModal();
  const [directModalOpen, setDirectModalOpen] = useState(false);

  const testAlert = () => {
    showAlert({
      title: '🎉 اختبار التنبيه',
      message: 'هذا اختبار لنموذج التنبيه. يجب أن يظهر فوق كل شيء آخر.',
      buttonText: 'فهمت'
    });
  };

  const testConfirm = () => {
    showConfirm({
      title: '⚠️ اختبار التأكيد',
      message: 'هل تريد المتابعة؟ هذا اختبار لنموذج التأكيد.',
      confirmText: 'نعم، متابعة',
      cancelText: 'إلغاء',
      onConfirm: () => {
        showAlert({
          title: '✅ تم التأكيد',
          message: 'تم تأكيد الإجراء بنجاح!'
        });
      }
    });
  };

  const testCustomModal = () => {
    openModal({
      title: '🔧 نموذج مخصص للاختبار',
      description: 'هذا نموذج مخصص لاختبار النظام الجديد',
      size: 'lg',
      children: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-success/10 rounded-lg border border-success/20">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-success" />
                <h4 className="font-semibold text-success">نجح الاختبار</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                النموذج يظهر بشكل صحيح
              </p>
            </div>
            
            <div className="p-4 bg-info/10 rounded-lg border border-info/20">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-5 w-5 text-info" />
                <h4 className="font-semibold text-info">معلومات</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                z-index يعمل بشكل صحيح
              </p>
            </div>
            
            <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <h4 className="font-semibold text-warning">تحذير</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                تأكد من عمل التمرير
              </p>
            </div>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="font-semibold mb-2">اختبار التمرير</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {Array.from({ length: 20 }, (_, i) => (
                <p key={i} className="text-sm text-muted-foreground">
                  سطر رقم {i + 1} - هذا نص لاختبار التمرير داخل النموذج
                </p>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => testAlert()}
              variant="outline"
              className="flex-1"
            >
              اختبار تنبيه من داخل النموذج
            </Button>
            <Button 
              onClick={() => testConfirm()}
              variant="outline"
              className="flex-1"
            >
              اختبار تأكيد من داخل النموذج
            </Button>
          </div>
        </div>
      ),
      footer: (
        <div className="flex gap-3 justify-end">
          <Button variant="ghost">
            إلغاء
          </Button>
          <Button>
            حفظ
          </Button>
        </div>
      )
    });
  };

  const testDirectModal = () => {
    setDirectModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">🧪 اختبار نظام النماذج</h2>
        <p className="text-muted-foreground">
          اختبر النماذج للتأكد من عمل z-index والعرض بشكل صحيح
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button 
          onClick={testAlert}
          className="h-16 flex flex-col gap-1"
        >
          <Info className="h-5 w-5" />
          <span className="text-sm">اختبار التنبيه</span>
        </Button>

        <Button 
          onClick={testConfirm}
          variant="destructive"
          className="h-16 flex flex-col gap-1"
        >
          <AlertTriangle className="h-5 w-5" />
          <span className="text-sm">اختبار التأكيد</span>
        </Button>

        <Button 
          onClick={testCustomModal}
          variant="secondary"
          className="h-16 flex flex-col gap-1"
        >
          <CheckCircle className="h-5 w-5" />
          <span className="text-sm">نموذج مخصص</span>
        </Button>

        <Button 
          onClick={testDirectModal}
          variant="outline"
          className="h-16 flex flex-col gap-1"
        >
          <Info className="h-5 w-5" />
          <span className="text-sm">نموذج مباشر</span>
        </Button>
      </div>

      {/* Direct Modal Test */}
      <Modal
        isOpen={directModalOpen}
        onClose={() => setDirectModalOpen(false)}
        title="📋 نموذج مباشر للاختبار"
        size="default"
        footer={
          <div className="flex gap-2 justify-end">
            <Button 
              variant="ghost" 
              onClick={() => setDirectModalOpen(false)}
            >
              إغلاق
            </Button>
            <Button onClick={() => {
              testAlert();
              setDirectModalOpen(false);
            }}>
              اختبار وإغلاق
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-base">
            هذا نموذج مباشر يستخدم useState بدلاً من ModalProvider.
          </p>
          
          <div className="bg-info/10 border border-info/20 rounded-lg p-4">
            <h4 className="font-semibold text-info mb-2">معلومات الاختبار:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• يجب أن يظهر النموذج فوق كل شيء</li>
              <li>• يجب أن يعمل الإغلاق بـ Escape</li>
              <li>• يجب أن يعمل الإغلاق بالنقر خارج النموذج</li>
              <li>• يجب أن يمنع تمرير الجسم</li>
            </ul>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={testAlert}
              size="sm"
              className="flex-1"
            >
              اختبار تنبيه
            </Button>
            <Button 
              onClick={testConfirm}
              size="sm"
              variant="destructive"
              className="flex-1"
            >
              اختبار تأكيد
            </Button>
          </div>
        </div>
      </Modal>

      <div className="mt-8 p-4 bg-muted/30 rounded-lg">
        <h3 className="font-semibold mb-2">🔍 نصائح الاختبار:</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• تأكد من ظهور النماذج فوق كل العناصر الأخرى</li>
          <li>• اختبر الإغلاق بمفتاح Escape</li>
          <li>• اختبر الإغلاق بالنقر خارج النموذج</li>
          <li>• تأكد من عدم إمكانية تمرير الصفحة عند فتح النموذج</li>
          <li>• اختبر النماذج المتداخلة (نموذج من داخل نموذج)</li>
        </ul>
      </div>
    </div>
  );
};

export default ModalTest;
