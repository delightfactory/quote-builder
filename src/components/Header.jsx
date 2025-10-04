import { Moon, Sun, ShoppingCart, FileText, Package, Menu, FolderOpen } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import Button from './ui/Button';
import Badge from './ui/Badge';
import SavedQuotesPanel from './SavedQuotesPanel';
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
            <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">أداة هندسة العروض</h1>
            <p className="text-xs text-muted-foreground">Quote Builder Pro</p>
          </div>
          <div className="sm:hidden">
            <h1 className="text-base font-bold">هندسة العروض</h1>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            const itemCount = item.id === 'quote' ? quoteItems.length : 0;

            return (
              <Button
                key={item.id}
                variant={isActive ? 'default' : 'ghost'}
                onClick={() => handleNavClick(item.id)}
                className="relative transition-all"
              >
                <Icon className="h-4 w-4 ml-2" />
                {item.label}
                {itemCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -left-2 h-5 w-5 rounded-full p-0 flex items-center justify-center animate-pulse"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>
            );
          })}
        </nav>

        {/* Mobile & Theme Controls */}
        <div className="flex items-center gap-2">
          {/* Saved Quotes Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSavedQuotes(true)}
            className="rounded-full relative transition-transform hover:scale-110"
            title="العروض المحفوظة"
          >
            <FolderOpen className="h-5 w-5" />
            {savedQuotes.length > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -left-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
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
            className="rounded-full transition-transform hover:scale-110"
            title={theme === 'light' ? 'الوضع الداكن' : 'الوضع الفاتح'}
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-full"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur animate-slideIn">
          <nav className="container mx-auto px-4 py-3 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              const itemCount = item.id === 'quote' ? quoteItems.length : 0;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-md' 
                      : 'bg-muted/50 hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {itemCount > 0 && (
                    <Badge variant={isActive ? 'secondary' : 'destructive'}>
                      {itemCount}
                    </Badge>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {/* Saved Quotes Panel */}
      {showSavedQuotes && (
        <SavedQuotesPanel onClose={() => setShowSavedQuotes(false)} />
      )}
    </header>
  );
};

export default Header;
