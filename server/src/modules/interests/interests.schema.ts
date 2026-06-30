import { z } from 'zod';
import { InterestStatus } from '@prisma/client';

export const sendInterestSchema = z.object({
  body: z.object({
    listingId: z.string().uuid(),
    message: z.string().max(500).optional(),
  }),
});

export const updateInterestStatusSchema = z.object({
  body: z.object({
    status: z.enum([InterestStatus.ACCEPTED, InterestStatus.REJECTED]),
  }),
});
