import { useState } from 'react';
import { X, FolderOpen, Trash2, Clock, Calendar, ShoppingBag, FileText } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import Button from './ui/Button';
import { Card } from './ui/Card';
import Badge from './ui/Badge';
import { formatCurrency } from '@/utils/csvParser';

const SavedQuotesPanel = ({ onClose }) => {
  const { savedQuotes, loadSavedQuote, deleteSavedQuote } = useApp();
  const [selectedQuote, setSelectedQuote] = useState(null);

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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-background rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-slideIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <FolderOpen className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">العروض المحفوظة</h2>
              <p className="text-sm text-muted-foreground">
                {savedQuotes.length} عرض محفوظ
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {savedQuotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="bg-muted/30 rounded-full p-6 mb-4">
                <FileText className="h-16 w-16 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-bold mb-2">لا توجد عروض محفوظة</h3>
              <p className="text-muted-foreground max-w-md">
                قم بإنشاء عرض جديد واضغط على "حفظ العرض" لحفظه هنا
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedQuotes.map((quote) => (
                <Card
                  key={quote.id}
                  className={`p-4 hover:shadow-lg transition-all cursor-pointer ${
                    selectedQuote?.id === quote.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedQuote(quote)}
                >
                  {/* Quote Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg truncate">
                        {quote.quoteName || 'عرض بدون اسم'}
                      </h3>
                      {quote.quoteCustomer && (
                        <p className="text-sm text-muted-foreground truncate">
                          {quote.quoteCustomer}
                        </p>
                      )}
                    </div>
                    <Badge variant="outline" className="shrink-0">
                      {quote.itemCount || quote.items?.length || 0} منتج
                    </Badge>
                  </div>

                  {/* Quote Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(quote.savedAt || quote.createdAt)}</span>
                    </div>
                    
                    {quote.items && quote.items.length > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <ShoppingBag className="h-4 w-4 text-primary" />
                        <span className="text-primary font-semibold">
                          {quote.items.length} منتج
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLoad(quote.id);
                      }}
                    >
                      <FolderOpen className="h-4 w-4 ml-1" />
                      تحميل
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(quote.id, quote.quoteName);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-muted/30">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>يتم الحفظ التلقائي للعرض الحالي</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              إغلاق
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedQuotesPanel;
