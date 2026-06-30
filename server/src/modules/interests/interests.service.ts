import prisma from '../../utils/prisma';
import { AppError } from '../../middleware/error.middleware';
import { InterestStatus, Role } from '@prisma/client';
import { emailService } from '../../services/email.service';

export class InterestsService {
  async sendInterest(tenantId: string, listingId: string, message?: string) {
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) throw new AppError('Listing not found', 404);

    const existingInterest = await prisma.interest.findUnique({
      where: {
        tenantId_listingId: {
          tenantId,
          listingId,
        },
      },
    });

    if (existingInterest) throw new AppError('Interest already sent', 400);

    const interest = await prisma.interest.create({
      data: {
        tenantId,
        listingId,
        message,
      },
      include: {
        listing: { select: { title: true, owner: { select: { email: true } } } },
        tenant: { select: { profile: { select: { name: true } } } },
      }
    });

    // We could notify owner here
    // emailService.sendEmail(interest.listing.owner.email, ...)

    return interest;
  }

  async updateInterestStatus(ownerId: string, interestId: string, status: InterestStatus) {
    const interest = await prisma.interest.findUnique({
      where: { id: interestId },
      include: {
        listing: true,
        tenant: { include: { profile: true } },
      },
    });

    if (!interest) throw new AppError('Interest not found', 404);
    if (interest.listing.ownerId !== ownerId) throw new AppError('Not authorized', 403);

    const updatedInterest = await prisma.interest.update({
      where: { id: interestId },
      data: { status },
    });

    // Send emails
    if (status === InterestStatus.ACCEPTED) {
      await emailService.sendInterestAccepted(interest.tenant.email, interest.listing.title);
      
      // Also automatically create a Chat room
      await prisma.chat.create({
        data: {
          participantIds: [ownerId, interest.tenantId],
        }
      });
    } else if (status === InterestStatus.REJECTED) {
      await emailService.sendInterestDeclined(interest.tenant.email, interest.listing.title);
    }

    return updatedInterest;
  }

  async getMyInterests(userId: string, role: string) {
    if (role === Role.TENANT) {
      return prisma.interest.findMany({
        where: { tenantId: userId },
        include: {
          listing: {
            include: { images: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else if (role === Role.OWNER) {
      return prisma.interest.findMany({
        where: { listing: { ownerId: userId } },
        include: {
          tenant: { include: { profile: true } },
          listing: { select: { id: true, title: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
    }
    return [];
  }
}

export const interestsService = new InterestsService();
