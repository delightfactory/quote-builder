import { useState, useEffect } from 'react';
import { useApp, AppProvider } from './contexts/AppContext';
import { ModalProvider } from './contexts/ModalContext';
import Header from './components/Header';
import ProductsView from './components/ProductsView';
import QuoteView from './components/QuoteView';
import LoadingScreen from './components/LoadingScreen';
import InstallPWA from './components/InstallPWA';
import { parseProducts } from './utils/csvParser';
import { loadSubsidyData } from './utils/subsidyParser';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './components/ui/Button';

const AppContent = () => {
  const { currentView, setProducts } = useApp();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🔄 Loading products...');
        // Load products
        const products = await parseProducts('/items_final_with_care_category_v3.csv');
        setProducts(products);
        console.log(`✅ Loaded ${products.length} products`);
        
        // Load subsidy data
        console.log('🔄 Loading subsidy data...');
        try {
          await loadSubsidyData('/final_unified_products.csv');
          console.log('✅ Subsidy data loaded successfully');
        } catch (subsidyError) {
          console.warn('⚠️ Subsidy data failed to load, continuing without it:', subsidyError);
          // Don't fail the entire app if subsidy data fails
        }
      } catch (error) {
        console.error('❌ Failed to load data:', error);
        setError('فشل تحميل البيانات. يرجى المحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [setProducts]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-destructive/8 via-background to-destructive/5 px-4 animate-fadeIn">
        <div className="text-center max-w-lg">
          <div className="relative mb-8">
            <div className="bg-gradient-to-br from-destructive/15 to-destructive/10 rounded-2xl p-8 w-fit mx-auto mb-6 animate-float">
              <AlertCircle className="h-20 w-20 sm:h-24 sm:w-24 text-destructive" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-destructive/30 rounded-full animate-pulse-soft"></div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground animate-slideIn">حدث خطأ</h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed animate-slideIn" style={{animationDelay: '100ms'}}>
              {error}
            </p>
            
            <div className="bg-muted/30 rounded-xl p-4 mb-6 animate-slideIn" style={{animationDelay: '200ms'}}>
              <p className="text-sm text-muted-foreground">
                تأكد من وجود ملفات CSV في مجلد public وأن الاتصال بالإنترنت مستقر
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center animate-slideIn" style={{animationDelay: '300ms'}}>
              <Button 
                onClick={() => window.location.reload()} 
                className="hover-lift shadow-lg"
                size="lg"
              >
                <RefreshCw className="h-5 w-5 ml-2" />
                إعادة المحاولة
              </Button>
              <Button 
                variant="outline"
                onClick={() => console.log('Contact support')}
                className="hover-lift"
                size="lg"
              >
                الحصول على مساعدة
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface/30 to-background">
      <Header />
      <main className="container mx-auto px-4 lg:px-6 py-6 sm:py-8 lg:py-10">
        <div className="animate-fadeIn">
          {currentView === 'products' && <ProductsView />}
          {currentView === 'quote' && <QuoteView />}
        </div>
      </main>
      <InstallPWA />
      
      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <ModalProvider>
        <div className="font-sans antialiased">
          <AppContent />
        </div>
      </ModalProvider>
    </AppProvider>
  );
}

export default App;
