const TO_LOCALE_TIME_FORMAT = 'it-IT'; // 00:10:10

const TO_LOCALE_DATE_FORMAT = 'fr-CA'; // 2024-01-01

/**
 * Parse formatted date string from Date object.
 *
 * @param {Date} date - Date to format
 * @returns {string}
 */
export const toPgDateString = (date: Date): string => {
  return date.toLocaleDateString(TO_LOCALE_DATE_FORMAT); // 2024-01-01
};

/**
 * Parse formatted time string from Date object.
 *
 * @param {Date} date - Date to format
 * @returns {string}
 */
export const toPgTimeString = (date: Date): string => {
  return date.toLocaleTimeString(TO_LOCALE_TIME_FORMAT); // 00:10:10
};
