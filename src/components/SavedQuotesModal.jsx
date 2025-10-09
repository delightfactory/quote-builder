import { useState } from 'react';
import { FolderOpen, Trash2, Clock, Calendar, ShoppingBag, FileText, Download, AlertTriangle } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useModal } from '@/contexts/ModalContext';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { Card } from './ui/Card';
import Badge from './ui/Badge';

const SavedQuotesModal = ({ isOpen, onClose }) => {
  const { savedQuotes, loadSavedQuote, deleteSavedQuote } = useApp();
  const { showConfirm, showAlert } = useModal();
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoad = async (quote) => {
    setIsLoading(true);
    try {
      const success = loadSavedQuote(quote.id);
      if (success) {
        showAlert({
          title: '✅ تم التحميل بنجاح',
          message: `تم تحميل العرض "${quote.quoteName || 'عرض بدون اسم'}" بنجاح`,
          buttonText: 'موافق'
        });
        onClose();
      } else {
        showAlert({
          title: '❌ فشل التحميل',
          message: 'حدث خطأ أثناء تحميل العرض. يرجى المحاولة مرة أخرى.',
          buttonText: 'موافق'
        });
      }
    } catch (error) {
      console.error('Error loading quote:', error);
      showAlert({
        title: '❌ خطأ في النظام',
        message: 'حدث خطأ غير متوقع. يرجى إعادة تحميل الصفحة والمحاولة مرة أخرى.',
        buttonText: 'موافق'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (quote) => {
    showConfirm({
      title: '🗑️ حذف العرض',
      message: `هل أنت متأكد من حذف العرض "${quote.quoteName || 'عرض بدون اسم'}"؟\n\nلا يمكن التراجع عن هذا الإجراء.`,
      confirmText: 'حذف',
      cancelText: 'إلغاء',
      variant: 'destructive',
      onConfirm: () => {
        deleteSavedQuote(quote.id);
        if (selectedQuote?.id === quote.id) {
          setSelectedQuote(null);
        }
      }
    });
  };

  const handleDeleteAll = () => {
    showConfirm({
      title: '⚠️ حذف جميع العروض',
      message: `هل أنت متأكد من حذف جميع العروض المحفوظة (${savedQuotes.length} عرض)؟\n\nلا يمكن التراجع عن هذا الإجراء.`,
      confirmText: 'حذف الكل',
      cancelText: 'إلغاء',
      variant: 'destructive',
      onConfirm: () => {
        savedQuotes.forEach(quote => deleteSavedQuote(quote.id));
        setSelectedQuote(null);
      }
    });
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return 'تاريخ غير صحيح';
    }
  };

  const getQuoteStats = (quote) => {
    const itemCount = quote.itemCount || quote.items?.length || 0;
    const hasCustomer = Boolean(quote.quoteCustomer);
    const hasName = Boolean(quote.quoteName);
    return { itemCount, hasCustomer, hasName };
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
      <div className="relative mb-8">
        <div className="bg-gradient-to-br from-muted/40 to-muted/20 rounded-full p-8 sm:p-10">
          <FileText className="h-16 w-16 sm:h-20 sm:w-20 text-muted-foreground/50 animate-float" />
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary/20 rounded-full animate-pulse-soft"></div>
      </div>
      
      <div className="space-y-4 max-w-sm">
        <h3 className="text-xl sm:text-2xl font-bold text-foreground">
          لا توجد عروض محفوظة
        </h3>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          قم بإنشاء عرض جديد وإضافة منتجات إليه، ثم اضغط على "حفظ العرض" لحفظه هنا
        </p>
        <div className="pt-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="hover-lift"
          >
            <FolderOpen className="h-4 w-4 ml-2" />
            إنشاء عرض جديد
          </Button>
        </div>
      </div>
    </div>
  );

  const QuoteCard = ({ quote, index }) => {
    const stats = getQuoteStats(quote);
    const isSelected = selectedQuote?.id === quote.id;

    return (
      <Card
        variant="interactive"
        className={`p-4 transition-all cursor-pointer animate-slideIn hover-lift ${
          isSelected ? 'ring-2 ring-primary bg-primary/5 shadow-lg' : ''
        }`}
        onClick={() => setSelectedQuote(isSelected ? null : quote)}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        {/* Quote Header */}
        <div className="flex items-start justify-between mb-3 gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base sm:text-lg truncate text-foreground group-hover:text-primary transition-colors">
              {quote.quoteName || 'عرض بدون اسم'}
            </h3>
            {quote.quoteCustomer && (
              <p className="text-xs sm:text-sm text-muted-foreground truncate mt-1">
                العميل: {quote.quoteCustomer}
              </p>
            )}
          </div>
          <Badge 
            variant="outline" 
            className="shrink-0 text-xs bg-primary/10 border-primary/30 text-primary font-semibold"
          >
            {stats.itemCount} منتج
          </Badge>
        </div>

        {/* Quote Info */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <div className="p-1.5 bg-muted/50 rounded-lg">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
            </div>
            <span className="truncate">{formatDate(quote.savedAt || quote.createdAt)}</span>
          </div>
          
          {quote.items && quote.items.length > 0 && (
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              </div>
              <span className="text-primary font-semibold">
                {quote.items.length} منتج في العرض
              </span>
            </div>
          )}
          
          {/* Status Indicators */}
          <div className="flex items-center justify-between text-xs pt-2 border-t border-border/50">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-muted-foreground">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse-soft"></div>
                محفوظ محلياً
              </span>
              {stats.hasName && (
                <span className="text-success">✓ له اسم</span>
              )}
              {stats.hasCustomer && (
                <span className="text-info">👤 له عميل</span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1 hover-scale shadow-sm font-semibold"
            onClick={(e) => {
              e.stopPropagation();
              handleLoad(quote);
            }}
            disabled={isLoading}
          >
            <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1" />
            <span className="text-xs sm:text-sm">
              {isLoading ? 'جاري التحميل...' : 'تحميل العرض'}
            </span>
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="hover-scale shadow-sm mobile-tap"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(quote);
            }}
            title="حذف العرض"
          >
            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </Card>
    );
  };

  const footer = (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
        <div className="p-1.5 bg-info/10 rounded-lg">
          <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-info" />
        </div>
        <span>يتم الحفظ التلقائي للعرض الحالي</span>
      </div>
      
      <div className="flex gap-2 w-full sm:w-auto">
        {savedQuotes.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 sm:flex-none hover-lift"
            onClick={handleDeleteAll}
          >
            <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
            <span className="text-xs sm:text-sm">حذف الكل</span>
          </Button>
        )}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
          className="flex-1 sm:flex-none hover-lift mobile-tap"
        >
          <span className="text-xs sm:text-sm">إغلاق</span>
        </Button>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="العروض المحفوظة"
      description={`${savedQuotes.length} عرض محفوظ • جاهز للتحميل والاستخدام`}
      size="lg"
      footer={footer}
      className="modal-safe-area"
    >
      {savedQuotes.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {savedQuotes.map((quote, index) => (
            <QuoteCard key={quote.id} quote={quote} index={index} />
          ))}
        </div>
      )}
    </Modal>
  );
};

export default SavedQuotesModal;
