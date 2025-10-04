import { X, Printer, Download, FileText } from 'lucide-react';
import Button from './ui/Button';
import { formatCurrency, formatNumber, calculateQuoteStats, calculateCustomerSavings } from '@/utils/csvParser';

const QuotePreview = ({ quoteItems, quoteName, quoteCustomer, finalPrice, finalMargin, onClose }) => {
  const stats = calculateQuoteStats(quoteItems);
  const finalProfit = finalPrice - stats.totalCost;
  const customerSavings = calculateCustomerSavings(stats.totalPrice, finalPrice);
  const today = new Date();
  const quoteNumber = `Q${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleExportData = () => {
    // Create CSV data
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Product Code,Product Name,Quantity,Unit Price,Total Price\n";
    
    quoteItems.forEach(item => {
      csvContent += `${item.code},"${item.name}",${item.quantity},${item.price},${item.price * item.quantity}\n`;
    });
    
    csvContent += `\n,,,Total Cost,${stats.totalCost}\n`;
    csvContent += `,,,,Final Price,${finalPrice}\n`;
    csvContent += `,,,,Profit,${finalProfit}\n`;
    csvContent += `,,,,Margin,${finalMargin.toFixed(2)}%\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `quote_${quoteNumber}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-auto">
      {/* Header - No Print */}
      <div className="no-print sticky top-0 bg-background border-b z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              معاينة العرض
            </h2>
            <Button variant="outline" onClick={onClose} size="sm">
              <X className="h-4 w-4 ml-2" />
              إغلاق
            </Button>
          </div>
          <div className="flex gap-2">
            <Button onClick={handlePrint} className="flex-1">
              <Printer className="h-4 w-4 ml-2" />
              طباعة / حفظ PDF
            </Button>
            <Button variant="outline" onClick={handleExportData} className="flex-1">
              <Download className="h-4 w-4 ml-2" />
              تصدير Excel
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Content - Printable */}
      <div className="container mx-auto px-4 py-8 max-w-5xl print-full-width">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg print:shadow-none print:bg-white print:border print:border-gray-300">
          {/* Print Header with Logo Area */}
          <div className="hidden print:block bg-gradient-to-r from-primary/10 to-primary/5 p-6 border-b-4 border-primary">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-primary mb-1">عرض سعر / Quotation</h1>
                <p className="text-sm text-gray-600">Quote Builder Pro - Professional Quote System</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-600 mb-1">رقم العرض / Quote #</div>
                <div className="text-lg font-bold text-primary">{quoteNumber}</div>
              </div>
            </div>
          </div>
          
          <div className="p-6 sm:p-8">
          {/* Screen Header - Hidden on Print */}
          <div className="border-b-2 border-primary/20 pb-4 mb-6 print:hidden">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-primary mb-2">عرض سعر</h1>
                <p className="text-base text-muted-foreground">Professional Quote Proposal</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-1">رقم العرض</p>
                <p className="text-lg font-bold text-primary">{quoteNumber}</p>
                <p className="text-xs text-muted-foreground mt-2">التاريخ</p>
                <p className="font-semibold">{new Date().toLocaleDateString('en-GB')}</p>
              </div>
            </div>
          </div>

          {/* Quote Information */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">اسم العرض</h3>
              <p className="text-lg font-semibold">{quoteName || 'عرض سعر'}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">العميل</h3>
              <p className="text-lg font-semibold">{quoteCustomer || 'غير محدد'}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">تفاصيل المنتجات</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border p-3 text-right">#</th>
                    <th className="border p-3 text-right">كود المنتج</th>
                    <th className="border p-3 text-right">اسم المنتج</th>
                    <th className="border p-3 text-center">الكمية</th>
                    <th className="border p-3 text-right">سعر الوحدة</th>
                    <th className="border p-3 text-right">الإجمالي</th>
                  </tr>
                </thead>
                <tbody>
                  {quoteItems.map((item, index) => (
                    <tr key={item.id} className="hover:bg-muted/50">
                      <td className="border p-3 text-right">{index + 1}</td>
                      <td className="border p-3 text-right font-mono">{item.code}</td>
                      <td className="border p-3 text-right font-semibold">{item.name}</td>
                      <td className="border p-3 text-center font-semibold">{item.quantity}</td>
                      <td className="border p-3 text-right">{formatCurrency(item.price)} ج.م</td>
                      <td className="border p-3 text-right font-semibold">
                        {formatCurrency(item.price * item.quantity)} ج.م
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="border-t-2 border-muted pt-6">
            <div className="flex justify-end">
              <div className="w-full max-w-md space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                  <span className="text-muted-foreground">عدد الأصناف:</span>
                  <span className="font-semibold">{quoteItems.length} صنف</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                  <span className="text-muted-foreground">إجمالي الكمية:</span>
                  <span className="font-semibold">{stats.totalQuantity} قطعة</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-950 rounded print:bg-orange-50">
                  <span className="text-orange-700 dark:text-orange-300 font-semibold">
                    إجمالي التكلفة:
                  </span>
                  <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
                    {formatCurrency(stats.totalCost)} ج.م
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-800 rounded print:bg-gray-100">
                  <span className="text-gray-700 dark:text-gray-300 font-semibold">
                    السعر الأصلي:
                  </span>
                  <span className="text-xl font-bold text-gray-600 dark:text-gray-400">
                    {formatCurrency(stats.totalPrice)} ج.م
                  </span>
                </div>

                {/* Customer Savings - Highlighted */}
                {customerSavings.isSavings && (
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-lg border-2 border-purple-400 print:bg-purple-50">
                    <div>
                      <span className="text-purple-700 dark:text-purple-300 text-lg font-bold block">
                        🎉 استفادة العميل:
                      </span>
                      <span className="text-xs text-purple-600 dark:text-purple-400">
                        ({customerSavings.savingsPercentage.toFixed(1)}% توفير)
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {formatCurrency(customerSavings.savingsAmount)} ج.م
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center p-3 bg-primary/10 rounded print:bg-blue-50">
                  <span className="text-primary font-semibold">هامش الربح:</span>
                  <span className="text-xl font-bold text-primary">
                    {finalMargin.toFixed(2)}%
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950 rounded print:bg-blue-50">
                  <span className="text-blue-700 dark:text-blue-300 font-semibold">
                    قيمة الربح:
                  </span>
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(finalProfit)} ج.م
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg border-2 border-green-500 print:bg-green-50">
                  <span className="text-green-700 dark:text-green-300 text-lg font-bold">
                    الإجمالي النهائي:
                  </span>
                  <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(finalPrice)} ج.م
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Notes */}
          <div className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground print:text-gray-600">
            <p>الأسعار المذكورة سارية لمدة 30 يوماً من تاريخ العرض</p>
            <p className="mt-2">شكراً لثقتكم بنا</p>
            <p className="mt-4 text-xs">Quote Generated by Quote Builder Pro © {new Date().getFullYear()}</p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotePreview;
