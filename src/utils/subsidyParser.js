/**
 * Subsidy Parser - Load and manage factory subsidy data
 */

import Papa from 'papaparse';

let subsidyData = {};

/**
 * Load subsidy data from CSV
 */
export const loadSubsidyData = async (csvPath) => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvPath, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Create a map of code -> subsidy info
        subsidyData = {};
        
        results.data.forEach(row => {
          const code = row['الكود الموحّد']?.trim();
          const maxSubsidy = parseFloat(row['أقصى قيمة الدعم']);
          const cost = parseFloat(row['سعر التكلفة']);
          
          if (code && !isNaN(maxSubsidy) && !isNaN(cost)) {
            subsidyData[code] = {
              code,
              productName: row['اسم المنتج']?.trim(),
              cost,
              maxSubsidy,
            };
          }
        });
        
        console.log(`✅ Loaded ${Object.keys(subsidyData).length} subsidized products`);
        resolve(subsidyData);
      },
      error: (error) => {
        console.error('Error loading subsidy data:', error);
        reject(error);
      }
    });
  });
};

/**
 * Check if product is subsidized
 */
export const isProductSubsidized = (productCode) => {
  return subsidyData.hasOwnProperty(productCode);
};

/**
 * Get subsidy info for product
 */
export const getSubsidyInfo = (productCode) => {
  return subsidyData[productCode] || null;
};

/**
 * Get all subsidized products
 */
export const getAllSubsidizedProducts = () => {
  return subsidyData;
};

/**
 * Calculate subsidy amount (0 to maxSubsidy)
 */
export const calculateSubsidyAmount = (productCode, percentage) => {
  const info = getSubsidyInfo(productCode);
  if (!info) return 0;
  
  const pct = Math.max(0, Math.min(100, percentage));
  return (info.maxSubsidy * pct) / 100;
};

/**
 * Calculate cost after subsidy
 */
export const calculateCostAfterSubsidy = (originalCost, subsidyAmount) => {
  return Math.max(0, originalCost - subsidyAmount);
};

/**
 * Calculate quote subsidy summary
 */
export const calculateQuoteSubsidySummary = (quoteItems) => {
  let totalOriginalCost = 0;
  let totalSubsidyAmount = 0;
  let subsidizedItemsCount = 0;
  
  quoteItems.forEach(item => {
    const quantity = item.quantity || 1;
    const itemCost = item.cost * quantity;
    totalOriginalCost += itemCost;
    
    if (item.subsidyPercentage > 0) {
      const subsidyPerItem = calculateSubsidyAmount(item.code, item.subsidyPercentage);
      const totalItemSubsidy = subsidyPerItem * quantity;
      totalSubsidyAmount += totalItemSubsidy;
      subsidizedItemsCount++;
    }
  });
  
  const totalCostAfterSubsidy = totalOriginalCost - totalSubsidyAmount;
  
  return {
    totalOriginalCost,
    totalSubsidyAmount,
    totalCostAfterSubsidy,
    subsidizedItemsCount,
    totalItemsCount: quoteItems.length,
    averageSubsidyPercentage: totalOriginalCost > 0 
      ? (totalSubsidyAmount / totalOriginalCost) * 100 
      : 0,
  };
};

/**
 * Apply maximum subsidy to all eligible items
 */
export const applyMaxSubsidyToItems = (quoteItems) => {
  return quoteItems.map(item => {
    if (isProductSubsidized(item.code)) {
      return {
        ...item,
        subsidyPercentage: 100, // Maximum subsidy
      };
    }
    return item;
  });
};

/**
 * Remove all subsidies from items
 */
export const removeAllSubsidies = (quoteItems) => {
  return quoteItems.map(item => ({
    ...item,
    subsidyPercentage: 0,
  }));
};

/**
 * Format subsidy percentage for display
 */
export const formatSubsidyPercentage = (percentage) => {
  return `${percentage.toFixed(0)}%`;
};
