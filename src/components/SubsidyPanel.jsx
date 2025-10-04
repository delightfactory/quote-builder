import { Gift, Percent, DollarSign, TrendingDown, ChevronDown, ChevronUp } from 'lucide-react';
import Button from './ui/Button';
import Badge from './ui/Badge';
import Input from './ui/Input';
import { formatCurrency } from '@/utils/csvParser';
import { useState, useEffect } from 'react';

const SubsidyPanel = ({ item, maxSubsidy, onSubsidyChange }) => {
  const [percentage, setPercentage] = useState(item.subsidyPercentage || 0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setPercentage(item.subsidyPercentage || 0);
  }, [item.subsidyPercentage]);

  const handleChange = (value) => {
    const pct = Math.max(0, Math.min(100, parseFloat(value) || 0));
    setPercentage(pct);
    onSubsidyChange(pct);
  };

  const subsidyAmount = (maxSubsidy * percentage) / 100;
  const newCost = Math.max(0, item.cost - subsidyAmount);

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg border-2 border-purple-200 dark:border-purple-700 overflow-hidden animate-slideIn">
      {/* Compact Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 flex items-center justify-between hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-purple-600" />
          <span className="font-bold text-purple-700 dark:text-purple-300 text-sm">دعم المصنع</span>
          {percentage > 0 && (
            <Badge className="bg-purple-600 text-white text-xs">
              {percentage.toFixed(0)}%
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {percentage > 0 ? (
            <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
              {formatCurrency(subsidyAmount)} ج.م
            </span>
          ) : (
            <span className="text-xs text-purple-600/70 dark:text-purple-400/70">
              متاح: {formatCurrency(maxSubsidy)} ج.م
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-purple-600" />
          ) : (
            <ChevronDown className="h-4 w-4 text-purple-600" />
          )}
        </div>
      </button>

      {/* Expanded Controls */}
      {isExpanded && (
        <div className="p-3 pt-0 space-y-3 animate-fadeIn">
          {/* Quick Buttons */}
          <div className="grid grid-cols-5 gap-1">
            <Button 
              size="sm" 
              variant={percentage === 0 ? "default" : "outline"}
              onClick={() => handleChange(0)} 
              className="h-8 text-xs"
            >
              0%
            </Button>
            <Button 
              size="sm" 
              variant={percentage === 25 ? "default" : "outline"}
              onClick={() => handleChange(25)} 
              className="h-8 text-xs"
            >
              25%
            </Button>
            <Button 
              size="sm" 
              variant={percentage === 50 ? "default" : "outline"}
              onClick={() => handleChange(50)} 
              className="h-8 text-xs"
            >
              50%
            </Button>
            <Button 
              size="sm" 
              variant={percentage === 75 ? "default" : "outline"}
              onClick={() => handleChange(75)} 
              className="h-8 text-xs"
            >
              75%
            </Button>
            <Button 
              size="sm" 
              variant={percentage === 100 ? "default" : "outline"}
              onClick={() => handleChange(100)} 
              className="h-8 text-xs font-bold"
            >
              MAX
            </Button>
          </div>

          {/* Slider */}
          <div className="space-y-1">
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={percentage}
              onChange={(e) => handleChange(e.target.value)}
              className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-xs text-purple-600/70 dark:text-purple-400/70">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Custom Input */}
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="0"
              max="100"
              step="1"
              value={percentage}
              onChange={(e) => handleChange(e.target.value)}
              className="text-center font-bold h-9"
              placeholder="نسبة مخصصة"
            />
            <span className="text-sm text-purple-600 dark:text-purple-400 font-bold">%</span>
          </div>

          {/* Results */}
          <div className="space-y-2 pt-2 border-t border-purple-200 dark:border-purple-700">
            <div className="flex justify-between items-center text-sm">
              <span className="text-purple-700 dark:text-purple-300">قيمة الدعم:</span>
              <span className="font-bold text-purple-600 dark:text-purple-400">
                {formatCurrency(subsidyAmount)} ج.م
              </span>
            </div>
            <div className="flex justify-between items-center text-sm bg-green-100 dark:bg-green-900/30 rounded p-2">
              <span className="text-green-700 dark:text-green-300 font-semibold">التكلفة الفعلية:</span>
              <span className="font-bold text-green-600 dark:text-green-400">
                {formatCurrency(newCost)} ج.م
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubsidyPanel;
