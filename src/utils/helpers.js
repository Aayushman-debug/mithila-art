/**
 * Mithila Art - Utility Helpers
 */

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;
const DISPOSABLE_EMAIL_PATTERNS = [
  'tempmail',
  '10minutemail',
  'mailinator',
  'yopmail',
  'guerrillamail',
  'trashmail',
  'dispostable',
  'maildrop',
  'temp-mail',
  'fakeinbox',
];

export function validateEmail(email) {
  return typeof email === 'string' && EMAIL_REGEX.test(email.trim());
}

export function isDisposableEmail(email) {
  if (typeof email !== 'string') return false;
  const normalized = email.trim().toLowerCase();
  const domain = normalized.split('@')[1] || '';
  return DISPOSABLE_EMAIL_PATTERNS.some((pattern) => domain.includes(pattern));
}

export function validateIndianPhone(phone) {
  return typeof phone === 'string' && PHONE_REGEX.test(phone.trim());
}

/**
 * Format a number as Indian Rupee currency string.
 * @param {number} amount — price in INR
 * @returns {string} e.g. "₹1,23,456"
 */
export function formatPrice(amount) {
  if (typeof amount !== 'number' || Number.isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Smoothly scroll to the top of the page.
 */
export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Create a debounced version of a function.
 * @param {Function} fn — function to debounce
 * @param {number} delay — debounce delay in ms (default: 300)
 * @returns {Function} debounced function with a `.cancel()` method
 */
export function debounce(fn, delay = 300) {
  let timerId = null;

  function debounced(...args) {
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn.apply(this, args);
      timerId = null;
    }, delay);
  }

  debounced.cancel = () => {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
  };

  return debounced;
}

/**
 * Generate a WhatsApp click-to-chat link with a pre-filled message.
 * @param {string} message — text to pre-fill
 * @param {string} [phone='+917488337792'] — phone number with country code
 * @returns {string} WhatsApp URL
 */
export function generateWhatsAppLink(message, phone = '+917488337792') {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encoded}`;
}

/**
 * Truncate text to a maximum length, appending an ellipsis if truncated.
 * @param {string} text — input string
 * @param {number} length — max character count (default: 100)
 * @returns {string}
 */
export function truncateText(text, length = 100) {
  if (!text || typeof text !== 'string') return '';
  if (text.length <= length) return text;
  // Avoid cutting in the middle of a word
  const truncated = text.slice(0, length);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + '…';
}

/**
 * Generate a Picsum placeholder image URL.
 * @param {string|number} seed — deterministic seed for the image
 * @param {number} [width=800]
 * @param {number} [height=600]
 * @returns {string} URL
 */
export function getImagePlaceholder(seed, width = 800, height = 600) {
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}
