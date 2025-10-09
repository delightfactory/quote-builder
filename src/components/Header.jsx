import { Moon, Sun, ShoppingCart, FileText, Package, Menu, FolderOpen } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import Button from './ui/Button';
import Badge from './ui/Badge';
import SavedQuotesModal from './SavedQuotesModal';
import { useState } from 'react';

const Header = () => {
  const { theme, toggleTheme, currentView, setCurrentView, quoteItems, savedQuotes } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSavedQuotes, setShowSavedQuotes] = useState(false);

  const navItems = [
    { id: 'products', label: 'المنتجات', icon: Package },
    { id: 'quote', label: 'العرض', icon: FileText },
  ];

  const handleNavClick = (id) => {
    setCurrentView(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg">
      <div className="container mx-auto flex h-16 lg:h-18 items-center justify-between px-4 lg:px-6">
        {/* Logo & Title */}
        <div className="flex items-center gap-3 lg:gap-4 animate-slideInFromRight">
          <div className="flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 text-primary-foreground shadow-xl hover-lift">
            <ShoppingCart className="h-5 w-5 lg:h-7 lg:w-7" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg lg:text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
              أداة هندسة العروض
            </h1>
            <p className="text-xs lg:text-sm text-muted-foreground font-medium">Quote Builder Pro</p>
          </div>
          <div className="sm:hidden">
            <h1 className="text-base font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              هندسة العروض
            </h1>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 bg-surface/50 rounded-xl p-1 border shadow-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            const itemCount = item.id === 'quote' ? quoteItems.length : 0;

            return (
              <Button
                key={item.id}
                variant={isActive ? 'default' : 'ghost'}
                onClick={() => handleNavClick(item.id)}
                className={`relative transition-all duration-300 hover-scale ${
                  isActive 
                    ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md' 
                    : 'hover:bg-hover'
                }`}
                size="lg"
              >
                <Icon className="h-4 w-4 lg:h-5 lg:w-5 ml-2" />
                <span className="font-medium">{item.label}</span>
                {itemCount > 0 && (
                  <Badge 
                    variant={isActive ? 'secondary' : 'destructive'}
                    className="absolute -top-2 -left-2 h-5 w-5 rounded-full p-0 flex items-center justify-center animate-pulse-soft text-xs font-bold"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>
            );
          })}
        </nav>

        {/* Mobile & Theme Controls */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Saved Quotes Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSavedQuotes(true)}
            className="rounded-xl relative hover-lift bg-surface/50 border shadow-sm mobile-tap"
            title="العروض المحفوظة"
          >
            <FolderOpen className="h-5 w-5 lg:h-6 lg:w-6" />
            {savedQuotes.length > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -left-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-bold animate-pulse-soft"
              >
                {savedQuotes.length}
              </Badge>
            )}
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-xl hover-lift bg-surface/50 border shadow-sm mobile-tap"
            title={theme === 'light' ? 'الوضع الداكن' : 'الوضع الفاتح'}
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5 lg:h-6 lg:w-6" />
            ) : (
              <Sun className="h-5 w-5 lg:h-6 lg:w-6" />
            )}
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-xl hover-lift bg-surface/50 border shadow-sm mobile-tap"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Enhanced Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-gradient-to-b from-background/98 to-surface/95 backdrop-blur-xl animate-slideIn shadow-xl">
          <nav className="container mx-auto px-4 py-4 space-y-3">
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground font-medium">التنقل السريع</p>
              <div className="w-12 h-0.5 bg-gradient-to-r from-primary to-primary/60 mx-auto mt-2 rounded-full"></div>
            </div>
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              const itemCount = item.id === 'quote' ? quoteItems.length : 0;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 mobile-tap animate-slideIn ${
                    isActive 
                      ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg border-2 border-primary/30' 
                      : 'bg-elevated/80 hover:bg-hover border-2 border-border/50 hover:border-primary/30 hover-lift'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      isActive 
                        ? 'bg-primary-foreground/20' 
                        : 'bg-primary/10'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-base">{item.label}</span>
                      <p className="text-xs opacity-70 mt-0.5">
                        {item.id === 'products' ? 'تصفح وإضافة المنتجات' : 'إدارة وطباعة العروض'}
                      </p>
                    </div>
                  </div>
                  {itemCount > 0 && (
                    <Badge 
                      variant={isActive ? 'secondary' : 'destructive'}
                      className="text-sm font-bold px-3 py-1 animate-pulse-soft"
                    >
                      {itemCount}
                    </Badge>
                  )}
                </button>
              );
            })}
            
            {/* Quick Actions in Mobile Menu */}
            <div className="pt-3 mt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground text-center mb-3 font-medium">إجراءات سريعة</p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowSavedQuotes(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 justify-center py-3 hover-lift"
                >
                  <FolderOpen className="h-4 w-4" />
                  <span className="text-sm">العروض المحفوظة</span>
                  {savedQuotes.length > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {savedQuotes.length}
                    </Badge>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toggleTheme();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 justify-center py-3 hover-lift"
                >
                  {theme === 'light' ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                  <span className="text-sm">
                    {theme === 'light' ? 'وضع داكن' : 'وضع فاتح'}
                  </span>
                </Button>
              </div>
            </div>
          </nav>
        </div>
      )}

      {/* Saved Quotes Modal */}
      <SavedQuotesModal 
        isOpen={showSavedQuotes} 
        onClose={() => setShowSavedQuotes(false)} 
      />
    </header>
  );
};

export default Header;
