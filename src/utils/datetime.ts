import { isDate } from 'util/types';

type NullishDate = Date | undefined | null;

type NullishStringDate = NullishDate | string;

/**
 * Get 'time' in Postgres DateTime format.
 *
 * @param {Date | string | undefined | null} time - Time string ie: '10:10:10'
 * @returns {Date | undefined | null}
 */
export const getPostgresTime = (time: NullishStringDate): NullishDate => {
  if (time === '') {
    return null;
  }
  // Undefined or null
  if (time == null) {
    return time;
  }

  if (isDate(time)) {
    return time;
  }

  // Time string can be formatted to a Date
  if (isDate(new Date(time))) {
    return new Date(time);
  }

  // Postgres only uses the time portion, year/month/day is not used
  return new Date(`1970-01-01 ${time}`);
};
