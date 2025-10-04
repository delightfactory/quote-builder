import { useState } from 'react';
import { 
  FileText, 
  Trash2, 
  Plus, 
  Minus, 
  Save, 
  Printer,
  Calculator,
  TrendingUp,
  DollarSign,
  ShoppingBag
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import Badge from './ui/Badge';
import { 
  calculateQuoteStats, 
  formatCurrency, 
  calculatePriceFromMargin,
  calculateMarginFromPrice,
  calculateCustomerSavings
} from '@/utils/csvParser';
import { calculateQuoteSubsidySummary } from '@/utils/subsidyParser';
import QuotePreview from './QuotePreview';
import QuoteItemCard from './QuoteItemCard';
import SubsidySummary from './SubsidySummary';

const QuoteView = () => {
  const {
    quoteItems,
    quoteName,
    setQuoteName,
    quoteCustomer,
    setQuoteCustomer,
    updateQuoteItemQuantity,
    updateQuoteItemSubsidy,
    removeFromQuote,
    clearQuote,
    saveQuotePermanently,
    savedQuotes,
    loadSavedQuote,
    deleteSavedQuote,
    subsidyEnabled,
    setSubsidyEnabled,
  } = useApp();

  const [pricingMode, setPricingMode] = useState('margin'); // 'margin' or 'direct'
  const [customMargin, setCustomMargin] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const stats = calculateQuoteStats(quoteItems);
  
  // Calculate final price and margin
  // Use effective margin when there's subsidy, otherwise use original margin
  let finalPrice = stats.totalPrice;
  let finalMargin = stats.totalSubsidy > 0 ? stats.effectiveMargin : stats.originalMargin;

  if (pricingMode === 'margin' && customMargin) {
    const margin = parseFloat(customMargin);
    if (!isNaN(margin) && margin >= 0 && margin < 100) {
      finalPrice = calculatePriceFromMargin(stats.totalCost, margin);
      finalMargin = margin;
    }
  } else if (pricingMode === 'direct' && customPrice) {
    const price = parseFloat(customPrice);
    if (!isNaN(price) && price > 0) {
      finalPrice = price;
      finalMargin = calculateMarginFromPrice(price, stats.totalCost);
    }
  }

  // Final profit is based on effective cost (after subsidy)
  const finalProfit = finalPrice - stats.totalCost;
  const customerSavings = calculateCustomerSavings(stats.totalPrice, finalPrice);

  if (showPreview) {
    return (
      <QuotePreview
        quoteItems={quoteItems}
        quoteName={quoteName}
        quoteCustomer={quoteCustomer}
        finalPrice={finalPrice}
        finalMargin={finalMargin}
        onClose={() => setShowPreview(false)}
      />
    );
  }

  if (quoteItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShoppingBag className="h-20 w-20 text-muted-foreground/30 mb-4" />
        <h3 className="text-2xl font-semibold mb-2">العرض فارغ</h3>
        <p className="text-muted-foreground max-w-md mb-6">
          ابدأ بإضافة منتجات من صفحة المنتجات لبناء عرضك الاحترافي
        </p>
        <Button onClick={() => window.location.reload()}>
          <Plus className="h-4 w-4 ml-2" />
          تصفح المنتجات
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slideIn">
      {/* Quote Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            معلومات العرض
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">اسم العرض</label>
              <Input
                placeholder="مثال: عرض صيانة شاملة"
                value={quoteName}
                onChange={(e) => setQuoteName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">اسم العميل</label>
              <Input
                placeholder="مثال: شركة XYZ"
                value={quoteCustomer}
                onChange={(e) => setQuoteCustomer(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subsidy Summary */}
      <SubsidySummary 
        quoteItems={quoteItems}
        subsidyEnabled={subsidyEnabled}
        onToggleSubsidy={() => setSubsidyEnabled(!subsidyEnabled)}
      />

      {/* Quote Items */}
      <Card className="border-2 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              المنتجات
              <Badge className="mr-1">{quoteItems.length}</Badge>
            </CardTitle>
            <Button variant="destructive" size="sm" onClick={clearQuote} className="w-full sm:w-auto">
              <Trash2 className="h-4 w-4 ml-2" />
              حذف الكل
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {quoteItems.map((item) => (
              <QuoteItemCard
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuoteItemQuantity}
                onRemove={removeFromQuote}
                onUpdateSubsidy={updateQuoteItemSubsidy}
                subsidyEnabled={subsidyEnabled}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pricing Strategy */}
      <Card className="border-2 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 sm:h-6 sm:w-6" />
            استراتيجية التسعير
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mode Selection */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={pricingMode === 'margin' ? 'default' : 'outline'}
              onClick={() => setPricingMode('margin')}
              className="h-auto py-3 sm:py-4 flex-col gap-2 shadow-md"
            >
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm sm:text-base">حساب بالهامش</span>
            </Button>
            <Button
              variant={pricingMode === 'direct' ? 'default' : 'outline'}
              onClick={() => setPricingMode('direct')}
              className="h-auto py-3 sm:py-4 flex-col gap-2 shadow-md"
            >
              <DollarSign className="h-5 w-5" />
              <span className="text-sm sm:text-base">سعر مباشر</span>
            </Button>
          </div>

          {/* Input Fields */}
          {pricingMode === 'margin' ? (
            <div>
              <label className="text-sm font-medium mb-2 block">
                هامش الربح المطلوب (%)
              </label>
              <Input
                type="number"
                placeholder={`الهامش الأصلي: ${stats.originalMargin.toFixed(2)}%`}
                value={customMargin}
                onChange={(e) => setCustomMargin(e.target.value)}
                min="0"
                max="99"
                step="0.1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                أدخل نسبة هامش الربح المطلوبة (مثال: 30 للحصول على هامش 30%)
              </p>
            </div>
          ) : (
            <div>
              <label className="text-sm font-medium mb-2 block">
                السعر النهائي المطلوب (ج.م)
              </label>
              <Input
                type="number"
                placeholder={`السعر الأصلي: ${formatCurrency(stats.totalPrice)}`}
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                min="0"
                step="0.01"
              />
              <p className="text-xs text-muted-foreground mt-1">
                أدخل السعر النهائي للعرض وسيتم حساب الهامش تلقائياً
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-2 border-primary/30 shadow-xl">
        <CardHeader className="border-b border-primary/20">
          <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
            <div className="w-1 h-8 bg-primary rounded-full" />
            ملخص العرض
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Customer Savings Highlight - Only show if there are savings */}
          {customerSavings.isSavings && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-2 border-purple-300 dark:border-purple-700 rounded-xl p-4 shadow-lg animate-slideIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-500 text-white rounded-full p-2">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-700 dark:text-purple-300 font-semibold">🎉 استفادة العميل</p>
                    <p className="text-xs text-purple-600/80 dark:text-purple-400/80">مقارنة بالسعر الأصلي</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {formatCurrency(customerSavings.savingsAmount)}
                  </p>
                  <p className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                    {customerSavings.savingsPercentage.toFixed(1)}% توفير
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Subsidy Info - Show if there's any subsidy applied */}
          {stats.totalSubsidy > 0 && (
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 border-2 border-purple-300 dark:border-purple-600 rounded-xl p-4 shadow-md mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-1">
                    💰 دعم المصنع المطبق
                  </p>
                  <p className="text-xs text-purple-600/80 dark:text-purple-400/80">
                    تم تخفيض التكلفة بمقدار {formatCurrency(stats.totalSubsidy)} ج.م
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-purple-600 dark:text-purple-400">التكلفة الأصلية</p>
                  <p className="text-lg font-bold text-purple-500 dark:text-purple-400 line-through">
                    {formatCurrency(stats.totalOriginalCost)}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    التكلفة الفعلية: {formatCurrency(stats.totalCost)} ج.م
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 backdrop-blur rounded-xl p-3 sm:p-4 border-2 border-orange-200 dark:border-orange-800 shadow-md">
              <p className="text-xs sm:text-sm text-orange-700 dark:text-orange-300 mb-2 flex items-center gap-1">
                <span className="w-2 h-2 bg-orange-500 rounded-full" />
                {stats.totalSubsidy > 0 ? 'التكلفة الفعلية' : 'إجمالي التكلفة'}
              </p>
              <p className="text-lg sm:text-2xl font-bold text-orange-600 dark:text-orange-400">
                {formatCurrency(stats.totalCost)}
              </p>
              <p className="text-xs text-orange-600/70 dark:text-orange-400/70 mt-1">
                {stats.totalSubsidy > 0 && `بعد دعم ${formatCurrency(stats.totalSubsidy)} ج.م`}
                {stats.totalSubsidy === 0 && 'ج.م'}
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 backdrop-blur rounded-xl p-3 sm:p-4 border-2 border-gray-200 dark:border-gray-700 shadow-md">
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                <span className="w-2 h-2 bg-gray-500 rounded-full" />
                السعر الأصلي
              </p>
              <p className="text-lg sm:text-2xl font-bold text-gray-600 dark:text-gray-400">
                {formatCurrency(stats.totalPrice)}
              </p>
              <p className="text-xs text-gray-600/70 dark:text-gray-400/70 mt-1">ج.م</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 backdrop-blur rounded-xl p-3 sm:p-4 border-2 border-green-200 dark:border-green-800 shadow-md">
              <p className="text-xs sm:text-sm text-green-700 dark:text-green-300 mb-2 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                السعر النهائي
              </p>
              <p className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(finalPrice)}
              </p>
              <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-1">ج.م</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 backdrop-blur rounded-xl p-3 sm:p-4 border-2 border-purple-200 dark:border-purple-800 shadow-md">
              <p className="text-xs sm:text-sm text-purple-700 dark:text-purple-300 mb-2 flex items-center gap-1">
                <span className="w-2 h-2 bg-purple-500 rounded-full" />
                توفير العميل
              </p>
              <p className="text-lg sm:text-2xl font-bold text-purple-600 dark:text-purple-400">
                {formatCurrency(Math.abs(customerSavings.savingsAmount))}
              </p>
              <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-1">
                {Math.abs(customerSavings.savingsPercentage).toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Second Row - Company Metrics */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-3 border-t border-primary/20">
            <div className="bg-gradient-to-br from-primary/10 to-primary/20 backdrop-blur rounded-xl p-3 sm:p-4 border-2 border-primary/30 shadow-md">
              <p className="text-xs sm:text-sm text-primary/80 mb-2 flex items-center gap-1">
                <span className="w-2 h-2 bg-primary rounded-full" />
                {stats.totalSubsidy > 0 ? 'الهامش الفعلي' : 'هامش الربح'}
              </p>
              <p className="text-lg sm:text-2xl font-bold text-primary">
                {finalMargin.toFixed(2)}
              </p>
              <p className="text-xs text-primary/70 mt-1">
                {stats.totalSubsidy > 0 && stats.originalMargin !== finalMargin && (
                  <span>
                    كان: <span className="line-through">{stats.originalMargin.toFixed(1)}%</span> → 
                  </span>
                )}
                %
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 backdrop-blur rounded-xl p-3 sm:p-4 border-2 border-blue-200 dark:border-blue-800 shadow-md">
              <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-500 rounded-full" />
                قيمة الربح
              </p>
              <p className="text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(finalProfit)}
              </p>
              <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">ج.م</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button className="flex-1" size="lg" onClick={() => setShowPreview(true)}>
              <Printer className="h-5 w-5 ml-2" />
              معاينة وطباعة
            </Button>
            <Button 
              variant="outline" 
              className="flex-1" 
              size="lg"
              onClick={() => {
                const success = saveQuotePermanently();
                if (success) {
                  alert('✅ تم حفظ العرض بنجاح!');
                } else {
                  alert('❌ فشل حفظ العرض');
                }
              }}
            >
              <Save className="h-5 w-5 ml-2" />
              حفظ العرض
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuoteView;
