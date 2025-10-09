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
    <div className="space-y-4 sm:space-y-6 animate-slideIn">
      {/* Enhanced Filters */}
      <div className="animate-slideInFromRight">
        <ProductFilters />
      </div>

      {/* Enhanced View Controls & Stats */}
      {filteredProducts.length > 0 && (
        <div className="bg-gradient-to-r from-primary/8 via-primary/5 to-transparent rounded-2xl p-4 sm:p-6 border-2 border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 animate-scaleIn">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
                <Sparkles className="h-6 w-6 text-primary animate-float" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-foreground">عرض {filteredProducts.length} منتج</h3>
                  <div className="px-2 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">
                    متاح
                  </div>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <span>من إجمالي {products.length} منتج</span>
                  <div className="w-1 h-1 bg-muted-foreground/50 rounded-full"></div>
                  <span>جاهز للإضافة</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Mobile View Toggle */}
              <div className="sm:hidden flex items-center gap-1 bg-surface rounded-xl p-1 border shadow-sm">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 px-3"
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 px-3"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Desktop View Toggle */}
              <div className="hidden sm:flex items-center gap-2 bg-surface rounded-xl p-1.5 border shadow-sm">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-9 px-4 font-medium"
                >
                  <Grid3x3 className="h-4 w-4 ml-2" />
                  شبكة
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-9 px-4 font-medium"
                >
                  <List className="h-4 w-4 ml-2" />
                  قائمة
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Products Grid/List */}
      {filteredProducts.length > 0 ? (
        <div className="animate-fadeIn">
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5'
            : 'grid grid-cols-1 gap-4 sm:gap-5'
          }>
            {filteredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className="animate-slideIn"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          
          {/* Load More Indicator (if needed) */}
          {filteredProducts.length > 50 && (
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full text-sm text-muted-foreground">
                <Package className="h-4 w-4" />
                تم عرض {Math.min(50, filteredProducts.length)} من {filteredProducts.length} منتج
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 sm:py-24 text-center px-4 animate-scaleIn">
          <div className="relative mb-8">
            <div className="bg-gradient-to-br from-muted/40 to-muted/20 rounded-full p-8 mb-4">
              <Package className="h-20 w-20 sm:h-24 sm:w-24 text-muted-foreground/50 animate-float" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-destructive/20 rounded-full animate-pulse-soft"></div>
          </div>
          
          <div className="max-w-md space-y-4">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground">لا توجد منتجات</h3>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              لم يتم العثور على منتجات تطابق معايير البحث الحالية.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="hover-lift"
              >
                إعادة تحميل المنتجات
              </Button>
              <Button 
                variant="ghost"
                onClick={() => {
                  // Reset filters - this would need to be implemented in ProductFilters
                  console.log('Reset filters');
                }}
                className="hover-lift"
              >
                إعادة تعيين الفلاتر
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsView;
