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
    <Card 
      variant="interactive" 
      className="group animate-fadeIn overflow-hidden hover:border-primary/40 h-full flex flex-col hover-lift bg-gradient-to-br from-card via-card to-surface/50"
    >
      {/* Enhanced Header */}
      <CardHeader className="p-3 pb-2 space-y-0 flex-shrink-0 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-xl"></div>
        <div className="flex items-start gap-2 mb-1 relative z-10">
          <div className="flex-1 min-w-0">
            <CardTitle 
              size="sm" 
              className="text-xs sm:text-sm line-clamp-2 leading-tight group-hover:text-primary transition-all duration-300 group-hover:scale-[1.02]"
            >
              {product.name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-[10px] text-muted-foreground font-mono">#{product.code}</p>
              <div className="w-1 h-1 bg-muted-foreground/30 rounded-full"></div>
              <p className="text-[10px] text-muted-foreground">منتج</p>
            </div>
          </div>
          <Badge className={`${getCategoryColor(product.category)} text-white shrink-0 text-[9px] px-2 py-1 leading-none shadow-sm hover-scale`}>
            {product.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-0 space-y-2 flex-1">
        {/* Enhanced Pricing Grid */}
        <div className="grid grid-cols-3 gap-1.5">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/50 dark:to-orange-900/30 rounded-lg px-2 py-1.5 text-center border border-orange-200/50 dark:border-orange-800/30 hover-scale">
            <p className="text-[9px] text-orange-600/70 dark:text-orange-400/70 leading-none font-medium">تكلفة</p>
            <p className="text-xs font-bold text-orange-600 dark:text-orange-400 leading-none mt-1">
              {formatCurrency(product.cost)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/50 dark:to-green-900/30 rounded-lg px-2 py-1.5 text-center border border-green-200/50 dark:border-green-800/30 hover-scale">
            <p className="text-[9px] text-green-600/70 dark:text-green-400/70 leading-none font-medium">بيع</p>
            <p className="text-xs font-bold text-green-600 dark:text-green-400 leading-none mt-1">
              {formatCurrency(product.price)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg px-2 py-1.5 text-center border border-primary/20 hover-scale">
            <p className="text-[9px] text-primary/70 leading-none font-medium">هامش</p>
            <p className={`text-xs font-bold leading-none mt-1 ${getMarginColor(product.margin)}`}>
              {product.margin.toFixed(0)}%
            </p>
          </div>
        </div>

        {/* Enhanced Profit Display */}
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-50/70 to-blue-100/50 dark:from-blue-950/40 dark:to-blue-900/30 rounded-lg px-2 py-1.5 border border-blue-200/50 dark:border-blue-800/30">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse-soft"></div>
            <span className="text-[10px] text-blue-700 dark:text-blue-300 font-medium">صافي الربح</span>
          </div>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(product.price - product.cost)}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-3 pt-0 flex-shrink-0">
        {!inQuote ? (
          <Button
            onClick={() => addToQuote(product)}
            className="w-full h-9 text-xs font-semibold hover-scale shadow-md"
            size="sm"
          >
            <Plus className="h-3.5 w-3.5 ml-1" />
            إضافة للعرض
          </Button>
        ) : (
          <div className="w-full space-y-2">
            <div className="flex items-center gap-2">
              <Button
                size="icon-sm"
                variant="outline"
                onClick={() => updateQuoteItemQuantity(product.id, quantity - 1)}
                className="h-8 w-8 hover-scale shadow-sm"
              >
                <Minus className="h-3 w-3" />
              </Button>
              
              <div className="flex-1 bg-gradient-to-r from-primary/10 to-primary/20 rounded-lg py-1.5 text-center border border-primary/20">
                <span className="text-[10px] text-muted-foreground font-medium">الكمية: </span>
                <span className="text-sm font-bold text-primary">{quantity}</span>
              </div>
              
              <Button
                size="icon-sm"
                variant="outline"
                onClick={() => updateQuoteItemQuantity(product.id, quantity + 1)}
                className="h-8 w-8 hover-scale shadow-sm"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="text-center bg-gradient-to-r from-success/10 to-success/20 rounded-lg py-1 border border-success/20">
              <div className="text-[11px] text-success font-semibold flex items-center justify-center gap-1">
                <Check className="h-3 w-3 animate-pulse-soft" />
                مُضاف للعرض
              </div>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
