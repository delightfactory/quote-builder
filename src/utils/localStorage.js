/**
 * LocalStorage utility functions for Quote Builder
 * Provides smart caching and data persistence
 */

const STORAGE_KEYS = {
  THEME: 'quote_builder_theme',
  QUOTES: 'quote_builder_saved_quotes',
  CURRENT_QUOTE: 'quote_builder_current_quote',
  FILTERS: 'quote_builder_filters',
  VIEW_MODE: 'quote_builder_view_mode',
  RECENT_SEARCHES: 'quote_builder_recent_searches',
  PREFERENCES: 'quote_builder_preferences',
  QUOTE_HISTORY: 'quote_builder_quote_history',
};

// Maximum items to keep in arrays
const MAX_SAVED_QUOTES = 50;
const MAX_RECENT_SEARCHES = 10;
const MAX_QUOTE_HISTORY = 100;

/**
 * Safely get item from localStorage
 */
const getItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

/**
 * Remove item from localStorage
 */
const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
    return false;
  }
};

/**
 * Clear old data when quota is exceeded
 */
const clearOldData = () => {
  try {
    // Keep only recent 10 quotes
    const quotes = getItem(STORAGE_KEYS.QUOTES, []);
    if (quotes.length > 10) {
      localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(quotes.slice(-10)));
    }
    
    // Keep only recent 20 history items
    const history = getItem(STORAGE_KEYS.QUOTE_HISTORY, []);
    if (history.length > 20) {
      localStorage.setItem(STORAGE_KEYS.QUOTE_HISTORY, JSON.stringify(history.slice(-20)));
    }
  } catch (error) {
    console.error('Error clearing old data:', error);
  }
};

/**
 * Safely set item to localStorage
 */
const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
    // Handle quota exceeded
    if (error.name === 'QuotaExceededError') {
      console.warn('LocalStorage quota exceeded. Clearing old data...');
      clearOldData();
    }
    return false;
  }
};

// ==================== THEME ====================

export const saveTheme = (theme) => {
  return setItem(STORAGE_KEYS.THEME, theme);
};

export const getTheme = () => {
  return getItem(STORAGE_KEYS.THEME, 'light');
};

// ==================== QUOTES ====================

export const saveQuote = (quote) => {
  const quotes = getItem(STORAGE_KEYS.QUOTES, []);
  const quoteWithId = {
    ...quote,
    id: quote.id || `quote_${Date.now()}`,
    savedAt: new Date().toISOString(),
  };
  
  // Check if quote already exists
  const existingIndex = quotes.findIndex(q => q.id === quoteWithId.id);
  
  if (existingIndex >= 0) {
    // Update existing
    quotes[existingIndex] = quoteWithId;
  } else {
    // Add new
    quotes.push(quoteWithId);
  }
  
  // Keep only MAX_SAVED_QUOTES
  const trimmedQuotes = quotes.slice(-MAX_SAVED_QUOTES);
  
  return setItem(STORAGE_KEYS.QUOTES, trimmedQuotes);
};

export const getSavedQuotes = () => {
  return getItem(STORAGE_KEYS.QUOTES, []);
};

export const deleteQuote = (quoteId) => {
  const quotes = getItem(STORAGE_KEYS.QUOTES, []);
  const filtered = quotes.filter(q => q.id !== quoteId);
  return setItem(STORAGE_KEYS.QUOTES, filtered);
};

export const clearAllQuotes = () => {
  return removeItem(STORAGE_KEYS.QUOTES);
};

// ==================== CURRENT QUOTE (Auto-save) ====================

export const saveCurrentQuote = (quoteData) => {
  const data = {
    ...quoteData,
    lastModified: new Date().toISOString(),
  };
  return setItem(STORAGE_KEYS.CURRENT_QUOTE, data);
};

export const getCurrentQuote = () => {
  return getItem(STORAGE_KEYS.CURRENT_QUOTE, null);
};

export const clearCurrentQuote = () => {
  return removeItem(STORAGE_KEYS.CURRENT_QUOTE);
};

// ==================== FILTERS ====================

export const saveFilters = (filters) => {
  return setItem(STORAGE_KEYS.FILTERS, filters);
};

export const getFilters = () => {
  return getItem(STORAGE_KEYS.FILTERS, {
    searchTerm: '',
    selectedCategory: '',
    sortBy: 'name',
  });
};

// ==================== VIEW MODE ====================

export const saveViewMode = (mode) => {
  return setItem(STORAGE_KEYS.VIEW_MODE, mode);
};

export const getViewMode = () => {
  return getItem(STORAGE_KEYS.VIEW_MODE, 'grid');
};

// ==================== RECENT SEARCHES ====================

export const addRecentSearch = (searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') return;
  
  const searches = getItem(STORAGE_KEYS.RECENT_SEARCHES, []);
  
  // Remove if already exists
  const filtered = searches.filter(s => s !== searchTerm);
  
  // Add to beginning
  filtered.unshift(searchTerm);
  
  // Keep only MAX_RECENT_SEARCHES
  const trimmed = filtered.slice(0, MAX_RECENT_SEARCHES);
  
  return setItem(STORAGE_KEYS.RECENT_SEARCHES, trimmed);
};

export const getRecentSearches = () => {
  return getItem(STORAGE_KEYS.RECENT_SEARCHES, []);
};

export const clearRecentSearches = () => {
  return removeItem(STORAGE_KEYS.RECENT_SEARCHES);
};

// ==================== PREFERENCES ====================

export const savePreferences = (preferences) => {
  const current = getPreferences();
  const updated = { ...current, ...preferences };
  return setItem(STORAGE_KEYS.PREFERENCES, updated);
};

export const getPreferences = () => {
  return getItem(STORAGE_KEYS.PREFERENCES, {
    showWelcomeMessage: true,
    autoSaveEnabled: true,
    defaultPricingMode: 'margin',
    defaultMargin: '',
    companyName: '',
    companyPhone: '',
    companyEmail: '',
  });
};

// ==================== QUOTE HISTORY ====================

export const addToQuoteHistory = (quoteData) => {
  const history = getItem(STORAGE_KEYS.QUOTE_HISTORY, []);
  
  const historyItem = {
    id: `history_${Date.now()}`,
    quoteName: quoteData.quoteName,
    customer: quoteData.quoteCustomer,
    totalItems: quoteData.items?.length || 0,
    finalPrice: quoteData.finalPrice,
    createdAt: new Date().toISOString(),
  };
  
  history.unshift(historyItem);
  
  // Keep only MAX_QUOTE_HISTORY
  const trimmed = history.slice(0, MAX_QUOTE_HISTORY);
  
  return setItem(STORAGE_KEYS.QUOTE_HISTORY, trimmed);
};

export const getQuoteHistory = () => {
  return getItem(STORAGE_KEYS.QUOTE_HISTORY, []);
};

export const clearQuoteHistory = () => {
  return removeItem(STORAGE_KEYS.QUOTE_HISTORY);
};

// ==================== UTILITIES ====================

/**
 * Get storage usage info
 */
export const getStorageInfo = () => {
  try {
    let total = 0;
    const details = {};
    
    Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
      const item = localStorage.getItem(key);
      const size = item ? new Blob([item]).size : 0;
      details[name] = size;
      total += size;
    });
    
    return {
      total,
      totalKB: (total / 1024).toFixed(2),
      details,
      available: 5 * 1024 * 1024, // ~5MB typical limit
      percentUsed: ((total / (5 * 1024 * 1024)) * 100).toFixed(2),
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return null;
  }
};

/**
 * Clear all app data
 */
export const clearAllAppData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Error clearing app data:', error);
    return false;
  }
};

/**
 * Export all data (for backup)
 */
export const exportAllData = () => {
  const data = {};
  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    data[name] = getItem(key);
  });
  
  return {
    exportDate: new Date().toISOString(),
    version: '1.0',
    data,
  };
};

/**
 * Import data (from backup)
 */
export const importData = (backup) => {
  try {
    if (!backup.data) return false;
    
    Object.entries(backup.data).forEach(([name, value]) => {
      const key = STORAGE_KEYS[name];
      if (key && value !== null) {
        setItem(key, value);
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};
