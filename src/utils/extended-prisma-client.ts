import { PrismaClient, capture } from '@prisma/client';

/**
 * Extending the Prisma Client.
 *
 * https://www.prisma.io/docs/orm/prisma-client/client-extensions
 */
export const extendedPrismaClient = new PrismaClient().$extends({
  result: {
    /**
     * Capture Extension.
     *
     * Why? Prisma will format 'time' columns as js Date objects.
     * This formats the time columns to return as '10:10:10' and not '1970-01-01T10:10:10'.
     */
    capture: {
      capture_time: {
        needs: { capture_time: true },
        compute(capture: capture) {
          return capture.capture_time && capture.capture_time.toLocaleTimeString('it-IT');
        }
      },
      release_time: {
        needs: { release_time: true },
        compute(capture: capture) {
          return capture.release_time && capture.release_time.toLocaleTimeString('it-IT');
        }
      }
    }
  }
});

export type PrismaClientExtended = typeof extendedPrismaClient;
