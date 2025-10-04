import { Package, Grid3x3, List, Sparkles } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import ProductCard from './ProductCard';
import ProductFilters from './ProductFilters';
import { useState } from 'react';
import Button from './ui/Button';

const ProductsView = () => {
  const { filteredProducts, products } = useApp();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Filters */}
      <ProductFilters />

      {/* View Controls & Stats */}
      {filteredProducts.length > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-3 sm:p-4 border-2 border-primary/20 shadow-md">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <div>
              <p className="text-sm font-semibold">عرض {filteredProducts.length} منتج</p>
              <p className="text-xs text-muted-foreground">من إجمالي {products.length} منتج متاح</p>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-2 bg-background rounded-lg p-1 border">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Products Grid/List */}
      {filteredProducts.length > 0 ? (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-3'
          : 'grid grid-cols-1 gap-3 sm:gap-4'
        }>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center px-4">
          <div className="bg-muted/30 rounded-full p-6 mb-6">
            <Package className="h-16 w-16 sm:h-20 sm:w-20 text-muted-foreground/50" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold mb-2">لا توجد منتجات</h3>
          <p className="text-muted-foreground max-w-md text-sm sm:text-base">
            لم يتم العثور على منتجات تطابق معايير البحث.
            <br />
            جرب تغيير الفلاتر أو البحث عن شيء آخر.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductsView;
