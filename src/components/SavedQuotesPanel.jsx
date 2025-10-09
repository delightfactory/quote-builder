import { useState, useEffect } from 'react';
import { X, FolderOpen, Trash2, Clock, Calendar, ShoppingBag, FileText } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import Button from './ui/Button';
import { Card } from './ui/Card';
import Badge from './ui/Badge';
import { formatCurrency } from '@/utils/csvParser';

const SavedQuotesPanel = ({ onClose }) => {
  const { savedQuotes, loadSavedQuote, deleteSavedQuote } = useApp();
  const [selectedQuote, setSelectedQuote] = useState(null);
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);
  
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleLoad = (quoteId) => {
    const success = loadSavedQuote(quoteId);
    if (success) {
      onClose();
    } else {
      alert('❌ فشل تحميل العرض');
    }
  };

  const handleDelete = (quoteId, quoteName) => {
    if (confirm(`هل تريد حذف العرض "${quoteName}"؟`)) {
      deleteSavedQuote(quoteId);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 modal-overlay z-50 flex items-center justify-center p-2 sm:p-4 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-background modal-content rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-[95vw] sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col animate-scaleIn border">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-primary/12 via-primary/8 to-primary/5 p-3 sm:p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-2 sm:p-2.5 rounded-xl shadow-md">
              <FolderOpen className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-foreground truncate">العروض المحفوظة</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {savedQuotes.length} عرض محفوظ • جاهز للتحميل
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="rounded-xl hover-scale shrink-0 mobile-tap"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Enhanced Content */}
        <div className="flex-1 overflow-y-auto modal-scroll p-3 sm:p-4">
          {savedQuotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-center px-4">
              <div className="relative mb-6">
                <div className="bg-gradient-to-br from-muted/40 to-muted/20 rounded-full p-6 sm:p-8 mb-4">
                  <FileText className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground/50 animate-float" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary/20 rounded-full animate-pulse-soft"></div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground">لا توجد عروض محفوظة</h3>
              <p className="text-muted-foreground max-w-sm text-sm sm:text-base leading-relaxed">
                قم بإنشاء عرض جديد واضغط على "حفظ العرض" لحفظه هنا
              </p>
              <Button 
                variant="outline" 
                onClick={onClose}
                className="mt-4 hover-lift"
              >
                إنشاء عرض جديد
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              {savedQuotes.map((quote, index) => (
                <Card
                  key={quote.id}
                  variant="interactive"
                  className={`p-3 sm:p-4 transition-all cursor-pointer animate-slideIn hover-lift ${
                    selectedQuote?.id === quote.id ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setSelectedQuote(quote)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Enhanced Quote Header */}
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base sm:text-lg truncate text-foreground group-hover:text-primary transition-colors">
                        {quote.quoteName || 'عرض بدون اسم'}
                      </h3>
                      {quote.quoteCustomer && (
                        <p className="text-xs sm:text-sm text-muted-foreground truncate mt-0.5">
                          العميل: {quote.quoteCustomer}
                        </p>
                      )}
                    </div>
                    <Badge 
                      variant="outline" 
                      className="shrink-0 text-xs bg-primary/10 border-primary/30 text-primary font-semibold"
                    >
                      {quote.itemCount || quote.items?.length || 0} منتج
                    </Badge>
                  </div>

                  {/* Enhanced Quote Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                      <div className="p-1 bg-muted/50 rounded">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                      </div>
                      <span className="truncate">{formatDate(quote.savedAt || quote.createdAt)}</span>
                    </div>
                    
                    {quote.items && quote.items.length > 0 && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <div className="p-1 bg-primary/10 rounded">
                          <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                        </div>
                        <span className="text-primary font-semibold">
                          {quote.items.length} منتج في العرض
                        </span>
                      </div>
                    )}
                    
                    {/* Additional Info */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
                      <span>محفوظ محلياً</span>
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-success rounded-full animate-pulse-soft"></div>
                        متاح
                      </span>
                    </div>
                  </div>

                  {/* Enhanced Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 hover-scale shadow-sm font-semibold"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLoad(quote.id);
                      }}
                    >
                      <FolderOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1" />
                      <span className="text-xs sm:text-sm">تحميل العرض</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="hover-scale shadow-sm mobile-tap"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(quote.id, quote.quoteName);
                      }}
                      title="حذف العرض"
                    >
                      <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Footer */}
        <div className="border-t p-3 sm:p-4 bg-gradient-to-r from-muted/20 to-muted/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <div className="p-1 bg-info/10 rounded">
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
                  onClick={() => {
                    if (confirm('هل تريد حذف جميع العروض المحفوظة؟')) {
                      savedQuotes.forEach(quote => deleteSavedQuote(quote.id));
                    }
                  }}
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
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
        </div>
      </div>
    </div>
  );
};

export default SavedQuotesPanel;
