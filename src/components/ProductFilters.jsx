import { Search, SlidersHorizontal, X, ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import Input from './ui/Input';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { getCategories } from '@/utils/csvParser';
import { useState } from 'react';

const ProductFilters = () => {
  const {
    products,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    resetFilters,
    filteredProducts,
  } = useApp();

  const [showFilters, setShowFilters] = useState(true);
  const categories = getCategories(products);
  const hasActiveFilters = searchTerm || selectedCategory || sortBy !== 'name';

  const sortOptions = [
    { value: 'name', label: 'الاسم (أ-ي)' },
    { value: 'price', label: 'السعر (الأعلى أولاً)' },
    { value: 'price-asc', label: 'السعر (الأقل أولاً)' },
    { value: 'cost', label: 'التكلفة (الأعلى أولاً)' },
    { value: 'cost-asc', label: 'التكلفة (الأقل أولاً)' },
    { value: 'margin', label: 'هامش الربح (الأعلى أولاً)' },
  ];

  return (
    <div className="bg-card border-2 rounded-xl shadow-lg overflow-hidden animate-slideIn">
      {/* Filter Header */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-3 sm:p-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-base sm:text-lg">البحث والفلترة</h3>
          {hasActiveFilters && (
            <Badge variant="destructive" className="animate-pulse">
              نشط
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden"
        >
          {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      <div className={`p-3 sm:p-4 space-y-4 ${!showFilters ? 'hidden md:block' : ''}`}>
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/60" />
          <Input
            type="text"
            placeholder="ابحث عن المنتجات بالاسم أو الكود..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10 h-11 text-base border-2 focus:border-primary shadow-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Categories */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-5 bg-primary rounded-full" />
            <span className="text-sm font-semibold">التصنيفات</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={!selectedCategory ? 'default' : 'outline'}
              className="cursor-pointer transition-all hover:scale-105 shadow-sm text-sm py-2 px-3"
              onClick={() => setSelectedCategory('')}
            >
              الكل ({products.length})
            </Badge>
            {categories.map((category) => {
              const count = products.filter(p => p.category === category).length;
              return (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  className="cursor-pointer transition-all hover:scale-105 shadow-sm text-sm py-2 px-3"
                  onClick={() => setSelectedCategory(category === selectedCategory ? '' : category)}
                >
                  {category} ({count})
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Sort Options */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-5 bg-primary rounded-full" />
            <span className="text-sm font-semibold">الترتيب</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {sortOptions.map((option) => (
              <Badge
                key={option.value}
                variant={sortBy === option.value ? 'default' : 'outline'}
                className="cursor-pointer transition-all hover:scale-105 text-center justify-center py-2.5 text-xs sm:text-sm shadow-sm"
                onClick={() => setSortBy(option.value)}
              >
                {option.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Results & Reset */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t-2">
          <div className="bg-primary/10 rounded-lg px-4 py-2 border border-primary/20">
            <div className="text-xs text-muted-foreground mb-0.5">عدد النتائج</div>
            <div className="text-sm font-bold">
              <span className="text-xl text-primary">{filteredProducts.length}</span>
              <span className="text-muted-foreground mx-1">من</span>
              <span className="text-foreground">{products.length}</span>
            </div>
          </div>
          
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground w-full sm:w-auto"
            >
              <X className="h-4 w-4 ml-1" />
              إعادة تعيين الفلاتر
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
