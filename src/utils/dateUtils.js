/**
 * Safe date/timestamp utilities for the app.
 * Use these when formatting values that may come from Firestore (Timestamp objects)
 * or be null/undefined, to avoid crashes and "Invalid Date" for any user.
 */

/**
 * Convert a value to a Date, safely handling Firestore Timestamps and null/undefined.
 * @param {*} value - Firestore Timestamp, Date, number (ms), or ISO string
 * @returns {Date|null} - Date instance or null if invalid/missing
 */
export function toDate(value) {
  if (value == null) return null;
  try {
    if (typeof value.toDate === 'function') return value.toDate();
    if (typeof value.toMillis === 'function') return new Date(value.toMillis());
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

/**
 * Format a timestamp as "X minutes ago" / "X hours ago" / "X days ago".
 * Safe for Firestore Timestamps and null/undefined.
 * @param {*} value - Firestore Timestamp, Date, number, or ISO string
 * @returns {string} - Human-readable string or empty string if invalid
 */
export function formatTimeAgo(value) {
  const time = toDate(value);
  if (!time) return '';

  const now = new Date();
  const diffInSeconds = Math.floor((now - time) / 1000);
  if (Number.isNaN(diffInSeconds) || diffInSeconds < 0) return '';

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  }
  const days = Math.floor(diffInSeconds / 86400);
  return `${days} day${days !== 1 ? 's' : ''} ago`;
}

/**
 * Format a timestamp as locale date/time string.
 * Safe for Firestore Timestamps and null/undefined.
 * @param {*} value - Firestore Timestamp, Date, number, or ISO string
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted string or fallback (e.g. '—') if invalid
 */
export function formatDateTime(value, options = {}) {
  const time = toDate(value);
  if (!time) return '—';
  try {
    return time.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      ...options
    });
  } catch {
    return '—';
  }
}
