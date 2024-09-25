import { Prisma, capture } from '@prisma/client';
import { toPgDateString, toPgTimeString } from '../utils/datetime';

/**
 * Prisma $queryRaw extension.
 *
 * Why? Prisma does not have a built-in $queryRaw method when extending the client.
 *
 */
export const rawQueryExtension = Prisma.defineExtension({
  query: {
    $queryRaw({ args, query }) {
      return query(args);
    }
  }
});

/**
 * Prisma capture extension.
 *
 * Why? Prisma will format 'time' / 'date' columns on request to js Date objects.
 * This parses the responses to simple date / time strings.
 */
export const captureExtension = Prisma.defineExtension({
  name: 'captureDateTimeFormats',
  result: {
    capture: {
      capture_date: {
        needs: { capture_date: true },
        compute(capture: capture) {
          return toPgDateString(capture.capture_date); // 2024-01-01
        }
      },
      capture_time: {
        needs: { capture_time: true },
        compute(capture: capture) {
          return capture.capture_time && toPgTimeString(capture.capture_time); // 10:10:10 | null
        }
      },
      release_date: {
        needs: { release_date: true },
        compute(capture: capture) {
          return capture.release_date && toPgDateString(capture.release_date); // 2024-01-01 | null
        }
      },
      release_time: {
        needs: { release_time: true },
        compute(capture: capture) {
          return capture.release_time && toPgTimeString(capture.release_time); // 10:10:10 | null
        }
      }
    }
  }
});
