import Papa from 'papaparse';

/**
 * Parse CSV file and convert to products array
 * @param {File} file - CSV file
 * @returns {Promise<Array>} Array of product objects
 */
export const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      encoding: 'UTF-8',
      complete: (results) => {
        try {
          const products = results.data.map((row, index) => {
            const code = row['كود المنتج'] || row['code'] || '';
            const name = row['اسم المنتج'] || row['name'] || '';
            const category = row['بند العناية'] || row['category'] || '';
            const cost = parseFloat(row['سعر التكلفة'] || row['cost'] || 0);
            const price = parseFloat(row['سعر البيع'] || row['price'] || 0);
            
            const margin = price > 0 && cost > 0 
              ? ((price - cost) / price * 100).toFixed(2)
              : 0;

            return {
              id: `${code}-${index}`,
              code,
              name,
              category,
              cost,
              price,
              margin: parseFloat(margin),
            };
          }).filter(p => p.code && p.name); // Filter out invalid entries

          resolve(products);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

/**
 * Load products from CSV file path
 * @param {string} filePath - Path to CSV file
 * @returns {Promise<Array>} Array of product objects
 */
export const parseProducts = async (filePath) => {
  try {
    const response = await fetch(filePath);
    const text = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const products = results.data.map((row, index) => {
              const code = row['كود المنتج'] || row['code'] || '';
              const name = row['اسم المنتج'] || row['name'] || '';
              const category = row['بند العناية'] || row['category'] || '';
              const cost = parseFloat(row['سعر التكلفة'] || row['cost'] || 0);
              const price = parseFloat(row['سعر البيع'] || row['price'] || 0);
              
              const margin = price > 0 && cost > 0 
                ? ((price - cost) / price * 100).toFixed(2)
                : 0;

              return {
                id: `${code}-${index}`,
                code,
                name,
                category,
                cost,
                price,
                margin: parseFloat(margin),
              };
            }).filter(p => p.code && p.name);

            resolve(products);
          } catch (error) {
            reject(error);
          }
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Get unique categories from products
 * @param {Array} products - Array of products
 * @returns {Array} Array of unique categories
 */
export const getCategories = (products) => {
  const categories = [...new Set(products.map(p => p.category))];
  return categories.filter(Boolean).sort();
};

/**
 * Calculate quote statistics with subsidy support
 * @param {Array} quoteItems - Array of quote items
 * @returns {Object} Statistics object
 */
export const calculateQuoteStats = (quoteItems) => {
  let totalCost = 0;
  let totalOriginalCost = 0;
  let totalSubsidy = 0;

  quoteItems.forEach(item => {
    const originalItemCost = item.cost * item.quantity;
    totalOriginalCost += originalItemCost;

    // Calculate subsidy if applicable
    // The subsidy is already embedded in the item data structure
    let subsidyAmount = 0;
    if (item.subsidyPercentage > 0 && item.subsidyAmount) {
      subsidyAmount = item.subsidyAmount * item.quantity;
      totalSubsidy += subsidyAmount;
    }

    // Effective cost after subsidy
    const effectiveItemCost = Math.max(0, originalItemCost - subsidyAmount);
    totalCost += effectiveItemCost;
  });

  const totalPrice = quoteItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const originalMargin = totalPrice > 0 ? ((totalPrice - totalOriginalCost) / totalPrice * 100) : 0;
  const effectiveMargin = totalPrice > 0 ? ((totalPrice - totalCost) / totalPrice * 100) : 0;
  
  return {
    totalCost, // Effective cost after subsidy
    totalOriginalCost, // Original cost before subsidy
    totalSubsidy, // Total subsidy amount
    totalPrice, // Original total price (sum of all items at their original prices)
    originalMargin, // Margin based on original cost
    effectiveMargin, // Margin based on cost after subsidy
    itemCount: quoteItems.length,
    totalQuantity: quoteItems.reduce((sum, item) => sum + item.quantity, 0),
  };
};

/**
 * Calculate customer savings
 * @param {number} originalPrice - Original total price
 * @param {number} finalPrice - Final quote price
 * @returns {Object} Savings object
 */
export const calculateCustomerSavings = (originalPrice, finalPrice) => {
  const savingsAmount = originalPrice - finalPrice;
  const savingsPercentage = originalPrice > 0 ? ((savingsAmount / originalPrice) * 100) : 0;
  
  return {
    savingsAmount,
    savingsPercentage,
    isSavings: savingsAmount > 0, // true if customer is saving money
  };
};

/**
 * Calculate final price based on margin
 * @param {number} totalCost - Total cost
 * @param {number} marginPercentage - Desired margin percentage
 * @returns {number} Final price
 */
export const calculatePriceFromMargin = (totalCost, marginPercentage) => {
  if (marginPercentage >= 100 || marginPercentage < 0) return totalCost;
  return totalCost / (1 - marginPercentage / 100);
};

/**
 * Calculate margin from price and cost
 * @param {number} price - Final price
 * @param {number} cost - Total cost
 * @returns {number} Margin percentage
 */
export const calculateMarginFromPrice = (price, cost) => {
  if (price <= 0) return 0;
  return ((price - cost) / price * 100);
};

/**
 * Format number as currency with English numerals
 * @param {number} value - Number to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Format number without decimals (for display purposes)
 * @param {number} value - Number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (value) => {
  return new Intl.NumberFormat('en-US').format(value);
};
