/**
 * src/utils/formatters.js
 * Utility formatting helpers for MyMoney application.
 * Handles PLN (Polish Złoty) and INR (Indian Rupee) currencies,
 * dates, percentages, and unique ID generation.
 */

/**
 * Formats a numeric value into Polish Złoty (PLN) format.
 * Example: 1500 -> "1,500 PLN" or "1 500.00 PLN"
 * @param {number} amount
 * @param {boolean} showDecimals
 * @returns {string}
 */
export function formatPLN(amount, showDecimals = false) {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Formats a numeric value into Indian Rupee (INR) format using the Indian numbering system (Lakhs/Crores).
 * Example: 1100000 -> "₹11,00,000"
 * @param {number} amount
 * @param {boolean} showDecimals
 * @returns {string}
 */
export function formatINR(amount, showDecimals = false) {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Formats a date string (YYYY-MM-DD) or timestamp into a friendly human-readable format.
 * Example: "2026-11-02" -> "Nov 2, 2026"
 * @param {string|Date} dateValue
 * @returns {string}
 */
export function formatDate(dateValue) {
  if (!dateValue) return 'N/A';
  const d = new Date(dateValue);
  if (isNaN(d.getTime())) return String(dateValue);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Formats a month key (e.g., "2026-11") into a readable month title like "November 2026".
 * @param {string} monthKey
 * @returns {string}
 */
export function formatMonthName(monthKey) {
  if (!monthKey) return '';
  const [year, month] = monthKey.split('-');
  const d = new Date(Number(year), Number(month) - 1, 1);
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

/**
 * Returns current month key in format "YYYY-MM"
 * @returns {string}
 */
export function getCurrentMonthKey() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Formats percentage value
 * @param {number} val
 * @returns {string}
 */
export function formatPercentage(val) {
  const num = Number(val) || 0;
  return `${num.toFixed(1)}%`;
}

/**
 * Generates a clean random unique identifier for local records.
 * @returns {string}
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

