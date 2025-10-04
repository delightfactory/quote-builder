import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { calculateSubsidyAmount } from '@/utils/subsidyParser';
import {
  saveTheme,
  getTheme,
  saveCurrentQuote,
  getCurrentQuote,
  clearCurrentQuote,
  saveFilters,
  getFilters,
  saveViewMode,
  getViewMode,
  addRecentSearch,
  savePreferences,
  getPreferences,
  saveQuote,
  getSavedQuotes,
  deleteQuote,
  addToQuoteHistory,
} from '@/utils/localStorage';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Theme state - Load from localStorage
  const [theme, setTheme] = useState(() => getTheme());

  // Products state
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Quote state - Load from localStorage
  const [quoteItems, setQuoteItems] = useState(() => {
    const current = getCurrentQuote();
    return current?.items || [];
  });
  const [quoteName, setQuoteName] = useState(() => {
    const current = getCurrentQuote();
    return current?.quoteName || '';
  });
  const [quoteCustomer, setQuoteCustomer] = useState(() => {
    const current = getCurrentQuote();
    return current?.quoteCustomer || '';
  });

  // Subsidy state
  const [subsidyEnabled, setSubsidyEnabled] = useState(false);

  // Filter state - Load from localStorage
  const [searchTerm, setSearchTerm] = useState(() => {
    const filters = getFilters();
    return filters.searchTerm || '';
  });
  const [selectedCategory, setSelectedCategory] = useState(() => {
    const filters = getFilters();
    return filters.selectedCategory || '';
  });
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
  const [sortBy, setSortBy] = useState(() => {
    const filters = getFilters();
    return filters.sortBy || 'name';
  });

  // View state - Load from localStorage
  const [currentView, setCurrentView] = useState('products');
  const [viewMode, setViewMode] = useState(() => getViewMode());

  // Saved quotes
  const [savedQuotes, setSavedQuotes] = useState(() => getSavedQuotes());

  // Preferences
  const [preferences, setPreferences] = useState(() => getPreferences());

  // Apply theme
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    saveTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Auto-save current quote
  useEffect(() => {
    if (quoteItems.length > 0 || quoteName || quoteCustomer) {
      const quoteData = {
        items: quoteItems,
        quoteName,
        quoteCustomer,
      };
      saveCurrentQuote(quoteData);
    }
  }, [quoteItems, quoteName, quoteCustomer]);

  // Save filters to localStorage
  useEffect(() => {
    saveFilters({
      searchTerm,
      selectedCategory,
      sortBy,
    });
  }, [searchTerm, selectedCategory, sortBy]);

  // Save view mode
  useEffect(() => {
    saveViewMode(viewMode);
  }, [viewMode]);

  // Filter products
  useEffect(() => {
    let filtered = [...products];

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      // Add to recent searches
      addRecentSearch(searchTerm);
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Apply price range
    filtered = filtered.filter(p =>
      p.price >= priceRange.min && p.price <= priceRange.max
    );

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name, 'ar');
        case 'price':
          return b.price - a.price;
        case 'cost':
          return b.cost - a.cost;
        case 'margin':
          return b.margin - a.margin;
        case 'price-asc':
          return a.price - b.price;
        case 'cost-asc':
          return a.cost - b.cost;
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);

  // Quote management functions
  const addToQuote = (product, quantity = 1) => {
    setQuoteItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id);
      
      if (existingIndex >= 0) {
        // Update quantity
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        // Add new item with subsidy support
        return [...prev, { ...product, quantity, subsidyPercentage: 0 }];
      }
    });
  };

  const removeFromQuote = (productId) => {
    setQuoteItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuoteItemQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromQuote(productId);
      return;
    }
    
    setQuoteItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const updateQuoteItemSubsidy = (productId, subsidyPercentage) => {
    setQuoteItems(prev =>
      prev.map(item => {
        if (item.id === productId) {
          const clampedPercentage = Math.max(0, Math.min(100, subsidyPercentage));
          
          // Calculate subsidy amount (per unit)
          let subsidyAmount = 0;
          try {
            subsidyAmount = calculateSubsidyAmount(item.code, clampedPercentage);
          } catch (e) {
            subsidyAmount = 0;
          }
          
          return { 
            ...item, 
            subsidyPercentage: clampedPercentage,
            subsidyAmount: subsidyAmount // Store per-unit subsidy amount
          };
        }
        return item;
      })
    );
  };

  const clearQuote = () => {
    setQuoteItems([]);
    setQuoteName('');
    setQuoteCustomer('');
    clearCurrentQuote();
  };

  // Save quote permanently
  const saveQuotePermanently = useCallback((customName = null) => {
    const quoteData = {
      items: quoteItems,
      quoteName: customName || quoteName || `عرض ${new Date().toLocaleDateString('ar-EG')}`,
      quoteCustomer,
      itemCount: quoteItems.length,
      createdAt: new Date().toISOString(),
    };
    
    const success = saveQuote(quoteData);
    if (success) {
      setSavedQuotes(getSavedQuotes());
      addToQuoteHistory(quoteData);
    }
    return success;
  }, [quoteItems, quoteName, quoteCustomer]);

  // Load saved quote
  const loadSavedQuote = useCallback((quoteId) => {
    const quotes = getSavedQuotes();
    const quote = quotes.find(q => q.id === quoteId);
    
    if (quote) {
      setQuoteItems(quote.items || []);
      setQuoteName(quote.quoteName || '');
      setQuoteCustomer(quote.quoteCustomer || '');
      setCurrentView('quote');
      return true;
    }
    return false;
  }, []);

  // Delete saved quote
  const deleteSavedQuote = useCallback((quoteId) => {
    const success = deleteQuote(quoteId);
    if (success) {
      setSavedQuotes(getSavedQuotes());
    }
    return success;
  }, []);

  // Update preferences
  const updatePreferences = useCallback((newPrefs) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);
    savePreferences(updated);
  }, [preferences]);

  const isInQuote = (productId) => {
    return quoteItems.some(item => item.id === productId);
  };

  const getQuoteItemQuantity = (productId) => {
    const item = quoteItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange({ min: 0, max: Infinity });
    setSortBy('name');
  };

  const value = {
    // Theme
    theme,
    toggleTheme,
    
    // Products
    products,
    setProducts,
    filteredProducts,
    
    // Filters
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    resetFilters,
    
    // Quote
    quoteItems,
    quoteName,
    setQuoteName,
    quoteCustomer,
    setQuoteCustomer,
    addToQuote,
    removeFromQuote,
    updateQuoteItemQuantity,
    clearQuote,
    isInQuote,
    getQuoteItemQuantity,
    
    // Saved Quotes
    savedQuotes,
    saveQuotePermanently,
    loadSavedQuote,
    deleteSavedQuote,
    
    // View
    currentView,
    setCurrentView,
    viewMode,
    setViewMode,
    
    // Preferences
    preferences,
    updatePreferences,

    // Subsidy
    subsidyEnabled,
    setSubsidyEnabled,
    updateQuoteItemSubsidy,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
