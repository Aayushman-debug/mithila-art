const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;

const blockedTempDomains = [
  '10minutemail',
  'temp-mail',
  'tempemail',
  'tempmail',
  'guerrillamail',
  'mailinator',
  'maildrop',
  'getnada',
  'dispostable',
  'trashmail',
  'sharklasers',
  'yopmail',
  'mintemail',
  'mailnesia',
  'fakeinbox',
  'temp-mail.org',
  'xamppmail',
  'getairmail',
  'mail-temp',
  'spambox',
];

const bannedPhonePatterns = new Set([
  '0000000000',
  '1111111111',
  '2222222222',
  '3333333333',
  '4444444444',
  '5555555555',
  '6666666666',
  '7777777777',
  '8888888888',
  '9999999999',
  '1234567890',
  '0987654321',
]);

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return EMAIL_REGEX.test(email.trim());
}

function isDisposableEmail(email) {
  const normalized = normalizeEmail(email);
  if (!normalized.includes('@')) return false;
  const domain = normalized.split('@')[1];
  return blockedTempDomains.some((pattern) => domain.includes(pattern));
}

function normalizePhone(phone) {
  if (typeof phone !== 'string') return '';
  // Remove all non-numeric characters (spaces, +, -, etc.)
  let cleaned = phone.replace(/\D/g, '');
  // If it starts with 91 and is 12 digits long, strip the leading 91
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    cleaned = cleaned.slice(2);
  }
  return cleaned;
}

function validateIndianPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  const normalized = normalizePhone(phone);
  return PHONE_REGEX.test(normalized) && !bannedPhonePatterns.has(normalized);
}

module.exports = {
  EMAIL_REGEX,
  PHONE_REGEX,
  blockedTempDomains,
  bannedPhonePatterns,
  normalizeEmail,
  validateEmail,
  isDisposableEmail,
  normalizePhone,
  validateIndianPhone,
};
