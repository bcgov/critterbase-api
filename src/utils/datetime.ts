type NullishTime = string | undefined | null;

/**
 * Get 'time' in Postgres DateTime format.
 *
 * @param {Date | string | undefined | null} time - Time string ie: '10:10:10'
 * @returns {Date | undefined | null}
 */
export const getPrismaTime = (time: NullishTime): null | undefined | Date => {
  if (time === '') {
    return null;
  }
  // Undefined or null
  if (time == null) {
    return time;
  }

  // Postgres only uses the time portion, year/month/day is not used
  return new Date(`1990-01-01T${time}`);
};
