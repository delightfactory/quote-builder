import { useState, useEffect } from 'react';
import { useApp, AppProvider } from './contexts/AppContext';
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
        // Load products
        const products = await parseProducts('/items_final_with_care_category_v3.csv');
        setProducts(products);
        
        // Load subsidy data
        await loadSubsidyData('/final_unified_products.csv');
        console.log('✅ Subsidy data loaded successfully');
      } catch (error) {
        console.error('Failed to load data:', error);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-destructive/5 via-background to-destructive/5 px-4">
        <div className="text-center max-w-md">
          <div className="bg-destructive/10 rounded-full p-6 w-fit mx-auto mb-6">
            <AlertCircle className="h-16 w-16 sm:h-20 sm:w-20 text-destructive" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">حدث خطأ</h2>
          <p className="text-muted-foreground mb-6 text-sm sm:text-base">{error}</p>
          <div className="space-y-3">
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full sm:w-auto"
              size="lg"
            >
              <RefreshCw className="h-4 w-4 ml-2" />
              إعادة المحاولة
            </Button>
            <p className="text-xs text-muted-foreground">
              تأكد من وجود ملف CSV في مجلد public
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {currentView === 'products' && <ProductsView />}
        {currentView === 'quote' && <QuoteView />}
      </main>
      <InstallPWA />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
