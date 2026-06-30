import prisma from '../../utils/prisma';
import { AppError } from '../../middleware/error.middleware';

export class ProfilesService {
  async getProfile(userId: string) {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: { email: true, role: true, isVerified: true },
        },
      },
    });

    if (!profile) {
      throw new AppError('Profile not found', 404);
    }

    return profile;
  }

  async updateProfile(userId: string, data: any) {
    // If we have profile completion tracking, we'd update it here
    const profile = await prisma.profile.update({
      where: { userId },
      data,
    });

    return profile;
  }
}

export const profilesService = new ProfilesService();
