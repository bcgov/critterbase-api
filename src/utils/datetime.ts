/**
 * Get 'time' in Postgres DateTime format.
 *
 * @param {string | undefined | null} time - Time string ie: '10:10:10'
 * @returns {Date | undefined | null}
 */
export const getPostgresTime = (time: string | undefined | null): Date | undefined | null => {
  if (time === '') {
    return undefined;
  }
  // Undefined or null
  if (time == null) {
    return time;
  }

  return new Date(`1970-01-01 ${time}`);
};
