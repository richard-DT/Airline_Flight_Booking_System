/**
 * Capitalizes the first letter of a given string.
 * @param {string} str - The input string to capitalize.
 * @returns {string} - A new string with the first letter capitalized.
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}



/**
 * Formats a number into Philippine Peso currency format.
 * @param {number} amount - The amount to format.
 * @returns {string} - Formatted currency string (e.g. "₱1,234.56")
 */
export function formatMoney(amount) {
  if (isNaN(amount)) return "₱0.00";
  return amount.toLocaleString("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  });
}


/**
 * Formats a tax name into human-readable label.
 * @param {string} taxName -Name of the tax item.
 * @returns {string} - Formatted tax name
 */
export function formatTaxName(key) {
  if (!key) return '';

  // Handle special cases
  const specialCases = {
    VAT: 'VAT',
    adminFee: 'Admin Fee',
    subtotal: 'Subtotal',
  };

  if (specialCases[key]) return specialCases[key];

  // Split camelCase or PascalCase words and capitalize each
  return key
    .replace(/([A-Z])/g, ' $1')   // insert space before capital letters
    .replace(/^./, str => str.toUpperCase()) // capitalize first letter
    .trim();
}
