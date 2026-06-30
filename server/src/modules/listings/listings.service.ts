import prisma from '../../utils/prisma';
import { AppError } from '../../middleware/error.middleware';
import { ListingStatus } from '@prisma/client';

export class ListingsService {
  async createListing(ownerId: string, data: any) {
    const { images, ...listingData } = data;

    const listing = await prisma.listing.create({
      data: {
        ...listingData,
        ownerId,
        images: images && images.length > 0 ? {
          create: images.map((url: string, index: number) => ({
            url,
            publicId: `mock_${Date.now()}_${index}`,
            order: index
          }))
        } : undefined
      },
      include: {
        images: true
      }
    });

    // TODO: Trigger AI Compatibility Engine in background
    return listing;
  }

  async getListings(query: any, currentUserId?: string) {
    const { 
      page = 1, 
      limit = 10, 
      city, 
      minRent, 
      maxRent, 
      roomType,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const where: any = {
      status: ListingStatus.ACTIVE,
      deletedAt: null
    };

    if (city) where.city = { contains: city as string, mode: 'insensitive' };
    if (minRent || maxRent) {
      where.rent = {};
      if (minRent) where.rent.gte = parseInt(minRent as string);
      if (maxRent) where.rent.lte = parseInt(maxRent as string);
    }
    if (roomType) where.roomType = roomType;

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { [sortBy as string]: sortOrder },
        include: { images: true }
      }),
      prisma.listing.count({ where })
    ]);

    let userProfile = null;
    if (currentUserId) {
      const user = await prisma.user.findUnique({ where: { id: currentUserId }, include: { profile: true } });
      userProfile = user?.profile;
    }

    const listingsWithScores = listings.map(listing => {
      let compatibilityScore = null;
      if (userProfile) {
        let score = 50; // Base Score
        
        // Budget match (+25)
        if (userProfile.budgetMax && listing.rent <= userProfile.budgetMax) {
          score += 25;
        }

        // Gender Match (+15)
        if (listing.genderPreference === 'ANY' || listing.genderPreference === userProfile.gender) {
          score += 15;
        }

        // Pets Match (+10)
        if (!userProfile.pets || (userProfile.pets && listing.petsAllowed)) {
          score += 10;
        }

        compatibilityScore = Math.min(score, 100);
      }
      return { ...listing, compatibilityScore };
    });

    return {
      listings: listingsWithScores,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum)
      }
    };
  }

  async getListingById(id: string) {
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        images: true,
        owner: {
          select: { id: true, email: true, profile: { select: { name: true, photo: true } } }
        }
      }
    });

    if (!listing || listing.deletedAt) {
      throw new AppError('Listing not found', 404);
    }

    return listing;
  }

  async updateListing(id: string, ownerId: string, data: any) {
    const listing = await prisma.listing.findUnique({ where: { id } });

    if (!listing || listing.deletedAt) {
      throw new AppError('Listing not found', 404);
    }

    if (listing.ownerId !== ownerId) {
      throw new AppError('Not authorized to update this listing', 403);
    }

    // TODO: Trigger AI Compatibility if rent/location/amenities changed

    return prisma.listing.update({
      where: { id },
      data,
      include: { images: true }
    });
  }

  async deleteListing(id: string, ownerId: string) {
    const listing = await prisma.listing.findUnique({ where: { id } });

    if (!listing) {
      throw new AppError('Listing not found', 404);
    }

    if (listing.ownerId !== ownerId) {
      throw new AppError('Not authorized to delete this listing', 403);
    }

    return prisma.listing.update({
      where: { id },
      data: { 
        status: ListingStatus.DELETED,
        deletedAt: new Date()
      }
    });
  }
}

export const listingsService = new ListingsService();
