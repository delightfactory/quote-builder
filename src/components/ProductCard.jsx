import { Plus, Check, Minus } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { useApp } from '@/contexts/AppContext';
import { formatCurrency } from '@/utils/csvParser';

const ProductCard = ({ product }) => {
  const { 
    addToQuote, 
    removeFromQuote, 
    isInQuote, 
    getQuoteItemQuantity,
    updateQuoteItemQuantity 
  } = useApp();

  const inQuote = isInQuote(product.id);
  const quantity = getQuoteItemQuantity(product.id);

  const getCategoryColor = (category) => {
    const colors = {
      'الموتور': 'bg-blue-500',
      'الفرش': 'bg-green-500',
      'خارجى': 'bg-purple-500',
      'التابلو': 'bg-orange-500',
      'الكاوتش': 'bg-red-500',
      'تولز': 'bg-gray-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  const getMarginColor = (margin) => {
    if (margin >= 40) return 'text-green-600 dark:text-green-400';
    if (margin >= 25) return 'text-blue-600 dark:text-blue-400';
    if (margin >= 15) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200 animate-fadeIn overflow-hidden hover:border-primary/30 h-full flex flex-col">
      {/* Header - Ultra Compact */}
      <CardHeader className="p-2.5 pb-2 space-y-0 flex-shrink-0">
        <div className="flex items-start gap-1.5 mb-1">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xs sm:text-sm font-bold line-clamp-2 leading-tight group-hover:text-primary transition-colors">
              {product.name}
            </CardTitle>
            <p className="text-[10px] text-muted-foreground font-mono mt-0.5">#{product.code}</p>
          </div>
          <Badge className={`${getCategoryColor(product.category)} text-white shrink-0 text-[9px] px-1.5 py-0.5 leading-none`}>
            {product.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-2.5 pt-0 space-y-1.5 flex-1">
        {/* Pricing Info - Ultra Compact Grid */}
        <div className="grid grid-cols-3 gap-1">
          <div className="bg-orange-50 dark:bg-orange-950/50 rounded px-1 py-1 text-center">
            <p className="text-[9px] text-orange-600/70 dark:text-orange-400/70 leading-none">تكلفة</p>
            <p className="text-xs font-bold text-orange-600 dark:text-orange-400 leading-none mt-0.5">
              {formatCurrency(product.cost)}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-950/50 rounded px-1 py-1 text-center">
            <p className="text-[9px] text-green-600/70 dark:text-green-400/70 leading-none">بيع</p>
            <p className="text-xs font-bold text-green-600 dark:text-green-400 leading-none mt-0.5">
              {formatCurrency(product.price)}
            </p>
          </div>
          <div className="bg-primary/10 rounded px-1 py-1 text-center">
            <p className="text-[9px] text-primary/70 leading-none">هامش</p>
            <p className={`text-xs font-bold leading-none mt-0.5 ${getMarginColor(product.margin)}`}>
              {product.margin.toFixed(0)}%
            </p>
          </div>
        </div>

        {/* Profit - Compact Line */}
        <div className="flex items-center justify-between bg-blue-50/50 dark:bg-blue-950/30 rounded px-1.5 py-1">
          <span className="text-[10px] text-blue-700 dark:text-blue-300">ربح</span>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(product.price - product.cost)}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-2.5 pt-0 flex-shrink-0">
        {!inQuote ? (
          <Button
            onClick={() => addToQuote(product)}
            className="w-full h-8 text-xs"
            size="sm"
          >
            <Plus className="h-3 w-3 ml-1" />
            إضافة
          </Button>
        ) : (
          <div className="w-full space-y-1">
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="outline"
                onClick={() => updateQuoteItemQuantity(product.id, quantity - 1)}
                className="h-7 w-7"
              >
                <Minus className="h-2.5 w-2.5" />
              </Button>
              
              <div className="flex-1 bg-primary/10 rounded py-0.5 text-center">
                <span className="text-[10px] text-muted-foreground">كمية </span>
                <span className="text-sm font-bold text-primary">{quantity}</span>
              </div>
              
              <Button
                size="icon"
                variant="outline"
                onClick={() => updateQuoteItemQuantity(product.id, quantity + 1)}
                className="h-7 w-7"
              >
                <Plus className="h-2.5 w-2.5" />
              </Button>
            </div>
            
            <div className="text-center text-[10px] text-green-600 dark:text-green-400 font-medium flex items-center justify-center gap-1">
              <Check className="h-2.5 w-2.5" />
              في العرض
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
