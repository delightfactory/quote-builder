import { Loader2, ShoppingCart } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/5">
      <div className="text-center space-y-6 px-4">
        {/* Animated Logo */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 mx-auto items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-2xl animate-bounce-slow">
            <ShoppingCart className="h-10 w-10 sm:h-12 sm:w-12" />
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            أداة هندسة العروض
          </h2>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <p className="text-sm sm:text-base">جاري تحميل البيانات...</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-64 sm:w-80 mx-auto">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-primary/70 animate-shimmer" />
          </div>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
          يرجى الانتظار بينما نقوم بتحميل منتجاتك...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
