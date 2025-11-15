/**
 * Format a Date object or ISO string to "YYYY-MM-DD"
 * Commonly used for input fields, database storage, or API parameters.
 *
 * @param {Date|string} date - A Date object or ISO string (e.g. "2025-11-03T09:15:00Z")
 * @returns {string} - The formatted date (e.g. "2025-11-03")
 */
export function formatDateYYYYMMDD(date) {
  // Return an empty string if the input is invalid or missing
  if (!date) return ''

  // Create a Date object from the input (handles both string and Date types)
  const d = new Date(date)

  // Extract year, month, and day values
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0') // Months are zero-indexed
  const day = String(d.getDate()).padStart(2, '0')

  // Return formatted date in "YYYY-MM-DD" format
  return `${year}-${month}-${day}`
}


/**
 * Format a Date object to "MMM DD, YYYY" string
 * @param {Date|string} date
 * @returns {string}
 */
export function formatDateReadable(date) {
  if (!date) return ''
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(date).toLocaleDateString(undefined, options)
}


/**
 * Extract and format the time portion from an ISO datetime string.
 * Useful for showing flight times, booking timestamps, etc.
 *
 * @param {string|Date} date - A Date object or ISO datetime string (e.g. "2025-11-03T09:15:00Z")
 * @returns {string} - The formatted local time (e.g. "5:15 PM")
 */
export function formatTimeReadable(date) {
  // Return an empty string if input is invalid
  if (!date) return ''

  // Convert the input to a Date object
  const d = new Date(date)

  // Format the time in the user's local timezone, with AM/PM
  const options = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }

  return d.toLocaleTimeString(undefined, options)
}

/**
 * Converts total minutes to "X hours Y minutes" format.
 * @param {number} totalMinutes - The total number of minutes.
 * @returns {string} Formatted time string.
 */
export function formatMinutes(totalMinutes) {

  if (isNaN(totalMinutes) || totalMinutes < 0) return "Invalid time";

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes} m`;
  if (minutes === 0) return `${hours} h`;

  return `${hours}h ${minutes}m`;
}


/**
 * Converts a date to "YYYY-MM-DD hh:mm AM/PM" format
 * @param {Date | string} inputDate - Date object or date string
 * @returns {string} formatted date
 */
export function formatDateTime(inputDate) {
  const date = new Date(inputDate);

  if (isNaN(date)) return ""; // Invalid date

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours === 0 ? 12 : hours; // 0 hour should be 12
  const formattedHours = String(hours).padStart(2, "0");

  return `${year}-${month}-${day} ${formattedHours}:${minutes} ${ampm}`;
}
