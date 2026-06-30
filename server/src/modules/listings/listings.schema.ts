import { z } from 'zod';
import { RoomType, Gender } from '@prisma/client';

export const createListingSchema = z.object({
  body: z.object({
    title: z.string().min(5).max(100),
    description: z.string().min(20),
    location: z.string().min(2),
    city: z.string().min(2),
    state: z.string().min(2),
    country: z.string().min(2),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    rent: z.number().min(1),
    deposit: z.number().min(0),
    maintenance: z.number().min(0).optional(),
    roomType: z.nativeEnum(RoomType),
    availableDate: z.string().datetime(), // ISO string
    genderPreference: z.nativeEnum(Gender).optional(),
    occupationPreference: z.string().optional(),
    smokingAllowed: z.boolean().optional(),
    petsAllowed: z.boolean().optional(),
    parking: z.boolean().optional(),
    wifi: z.boolean().optional(),
    electricity: z.boolean().optional(),
    ac: z.boolean().optional(),
    kitchen: z.boolean().optional(),
    laundry: z.boolean().optional(),
    furnishing: z.string().optional(),
    images: z.array(z.string().url()).optional(), // Will be handled by upload middleware in real app, but for JSON API
  }),
});

export const updateListingSchema = z.object({
  body: createListingSchema.shape.body.partial(),
});
