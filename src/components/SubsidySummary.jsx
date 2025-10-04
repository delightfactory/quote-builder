import { Gift, DollarSign, TrendingDown, ToggleLeft, ToggleRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { formatCurrency } from '@/utils/csvParser';
import { calculateQuoteSubsidySummary } from '@/utils/subsidyParser';

const SubsidySummary = ({ quoteItems, subsidyEnabled, onToggleSubsidy }) => {
  const summary = calculateQuoteSubsidySummary(quoteItems);

  if (summary.subsidizedItemsCount === 0) {
    return null; // No subsidized items
  }

  return (
    <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-purple-950/30 border-2 border-purple-300 dark:border-purple-700 shadow-xl">
      <CardHeader className="border-b border-purple-200 dark:border-purple-700 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-purple-500 text-white p-2 rounded-lg">
              <Gift className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
                دعم المصنع
                <Badge variant="outline" className="bg-white dark:bg-gray-800">
                  {summary.subsidizedItemsCount} من {summary.totalItemsCount} منتج
                </Badge>
              </CardTitle>
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                إجمالي الدعم المتاح للعرض
              </p>
            </div>
          </div>
          
          <Button
            variant={subsidyEnabled ? "default" : "outline"}
            size="lg"
            onClick={onToggleSubsidy}
            className="gap-2"
          >
            {subsidyEnabled ? (
              <>
                <ToggleRight className="h-5 w-5" />
                مفعّل
              </>
            ) : (
              <>
                <ToggleLeft className="h-5 w-5" />
                معطّل
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-6">
        {/* Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Original Cost */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-orange-600" />
              <p className="text-sm text-orange-600 dark:text-orange-400 font-semibold">
                التكلفة الأصلية
              </p>
            </div>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {formatCurrency(summary.totalOriginalCost)}
            </p>
            <p className="text-xs text-orange-600/70 dark:text-orange-400/70 mt-1">ج.م</p>
          </div>

          {/* Subsidy Amount */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-purple-300 dark:border-purple-700">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="h-5 w-5 text-purple-600" />
              <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold">
                قيمة الدعم
              </p>
            </div>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {formatCurrency(summary.totalSubsidyAmount)}
            </p>
            <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-1">
              {summary.averageSubsidyPercentage.toFixed(1)}% متوسط
            </p>
          </div>

          {/* Cost After Subsidy */}
          <div className="bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-950/30 rounded-xl p-4 border-2 border-green-400 dark:border-green-700">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-5 w-5 text-green-600" />
              <p className="text-sm text-green-700 dark:text-green-300 font-semibold">
                التكلفة بعد الدعم
              </p>
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(summary.totalCostAfterSubsidy)}
            </p>
            <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-1">
              وفّرت {formatCurrency(summary.totalSubsidyAmount)} ج.م
            </p>
          </div>
        </div>

        {/* Info Message */}
        <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-4 border border-purple-300 dark:border-purple-700">
          <div className="flex items-start gap-3">
            <Gift className="h-5 w-5 text-purple-600 mt-0.5 shrink-0" />
            <div className="text-sm text-purple-700 dark:text-purple-300">
              <p className="font-semibold mb-1">💡 ملاحظة:</p>
              <p>
                الدعم المصنعي يقلل من <strong>تكلفة المنتج</strong> مما يزيد من هامش الربح للشركة.
                يمكنك ضبط نسبة الدعم لكل منتج مدعوم بشكل منفصل.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubsidySummary;
