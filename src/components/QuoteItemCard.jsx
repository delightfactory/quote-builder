import { Minus, Plus, Trash2, Gift } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';
import SubsidyPanel from './SubsidyPanel';
import { formatCurrency } from '@/utils/csvParser';
import { getSubsidyInfo, calculateSubsidyAmount, isProductSubsidized } from '@/utils/subsidyParser';

const QuoteItemCard = ({ item, onUpdateQuantity, onRemove, onUpdateSubsidy, subsidyEnabled }) => {
  const subsidyInfo = getSubsidyInfo(item.code);
  const isSubsidized = isProductSubsidized(item.code);
  
  // Always calculate subsidy if there's a percentage set
  const subsidyAmount = item.subsidyPercentage > 0 
    ? calculateSubsidyAmount(item.code, item.subsidyPercentage)
    : 0;
  
  const effectiveCost = Math.max(0, item.cost - subsidyAmount);
  const totalCost = effectiveCost * item.quantity;
  const totalPrice = item.price * item.quantity;
  const totalProfit = totalPrice - totalCost;
  const effectiveMargin = totalPrice > 0 ? ((totalProfit / totalPrice) * 100) : 0;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base line-clamp-2 mb-1">{item.name}</h3>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">#{item.code}</Badge>
              <Badge className="text-xs bg-primary/10 text-primary">{item.category}</Badge>
              {isSubsidized && (
                <Badge className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                  <Gift className="h-3 w-3 ml-1" />
                  قابل للدعم
                </Badge>
              )}
            </div>
          </div>
          
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onRemove(item.id)}
            className="text-destructive hover:bg-destructive/10 shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div className="bg-orange-50 dark:bg-orange-950/30 rounded p-2">
            <p className="text-xs text-orange-600/70 dark:text-orange-400/70">تكلفة/وحدة</p>
            <p className="font-bold text-orange-600 dark:text-orange-400">
              {formatCurrency(item.cost)}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-950/30 rounded p-2">
            <p className="text-xs text-green-600/70 dark:text-green-400/70">سعر/وحدة</p>
            <p className="font-bold text-green-600 dark:text-green-400">
              {formatCurrency(item.price)}
            </p>
          </div>
          <div className="bg-primary/10 rounded p-2">
            <p className="text-xs text-primary/70">هامش</p>
            <p className="font-bold text-primary">{item.margin.toFixed(0)}%</p>
          </div>
        </div>

        {/* Subsidy Panel - Always show for subsidized products */}
        {isSubsidized && subsidyInfo && (
          <SubsidyPanel
            item={item}
            maxSubsidy={subsidyInfo.maxSubsidy}
            onSubsidyChange={(percentage) => onUpdateSubsidy(item.id, percentage)}
          />
        )}

        {/* After Subsidy Cost (if applicable) */}
        {subsidyAmount > 0 && (
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg p-3 border-2 border-green-400 dark:border-green-600 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-semibold text-green-700 dark:text-green-300">بعد تطبيق الدعم</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white dark:bg-gray-800 rounded p-2">
                <p className="text-xs text-green-600 dark:text-green-400 mb-1">تكلفة فعلية/وحدة</p>
                <p className="font-bold text-green-700 dark:text-green-300 text-base">
                  {formatCurrency(effectiveCost)}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded p-2">
                <p className="text-xs text-green-600 dark:text-green-400 mb-1">هامش فعلي</p>
                <p className="font-bold text-green-700 dark:text-green-300 text-base">
                  {effectiveMargin.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quantity Controls */}
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="h-9 w-9 shrink-0"
          >
            <Minus className="h-4 w-4" />
          </Button>
          
          <div className="flex-1 bg-primary/5 rounded py-2 text-center">
            <span className="text-xs text-muted-foreground">الكمية: </span>
            <span className="text-lg font-bold text-primary">{item.quantity}</span>
          </div>
          
          <Button
            size="icon"
            variant="outline"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="h-9 w-9 shrink-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Totals */}
        <div className="bg-muted/30 rounded-lg p-3 space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">إجمالي التكلفة:</span>
            <span className="font-bold text-orange-600 dark:text-orange-400">
              {formatCurrency(totalCost)} ج.م
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">إجمالي السعر:</span>
            <span className="font-bold text-green-600 dark:text-green-400">
              {formatCurrency(totalPrice)} ج.م
            </span>
          </div>
          <div className="flex justify-between items-center text-sm pt-2 border-t">
            <span className="font-semibold">إجمالي الربح:</span>
            <span className="font-bold text-lg text-primary">
              {formatCurrency(totalProfit)} ج.م
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteItemCard;
