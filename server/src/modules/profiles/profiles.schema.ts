import { z } from 'zod';
import { Gender, RoomType } from '@prisma/client';

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    age: z.number().min(18).max(100).optional(),
    gender: z.nativeEnum(Gender).optional(),
    occupation: z.string().optional(),
    budgetMin: z.number().min(0).optional(),
    budgetMax: z.number().min(0).optional(),
    preferredLocations: z.array(z.string()).optional(),
    moveInDate: z.string().datetime().optional(), // ISO string
    preferredRoomType: z.nativeEnum(RoomType).optional(),
    smoking: z.boolean().optional(),
    pets: z.boolean().optional(),
    bio: z.string().max(500).optional(),
    photo: z.string().url().optional(),
  }).refine(data => {
    if (data.budgetMin !== undefined && data.budgetMax !== undefined) {
      return data.budgetMin <= data.budgetMax;
    }
    return true;
  }, {
    message: "budgetMin must be less than or equal to budgetMax",
    path: ["budgetMin"]
  })
});
