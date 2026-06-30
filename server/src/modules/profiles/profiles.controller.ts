import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { profilesService } from './profiles.service';

export class ProfilesController {
  async getMyProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const profile = await profilesService.getProfile(req.user!.id);
      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateMyProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const profile = await profilesService.updateProfile(req.user!.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfileById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const profile = await profilesService.getProfile(req.params.userId);
      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const profilesController = new ProfilesController();
