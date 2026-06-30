import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { interestsService } from './interests.service';

export class InterestsController {
  async sendInterest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { listingId, message } = req.body;
      const interest = await interestsService.sendInterest(req.user!.id, listingId, message);
      res.status(201).json({
        success: true,
        message: 'Interest sent successfully',
        data: interest,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateInterestStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const interest = await interestsService.updateInterestStatus(
        req.user!.id,
        req.params.id,
        req.body.status
      );
      res.status(200).json({
        success: true,
        message: 'Interest status updated',
        data: interest,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyInterests(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const interests = await interestsService.getMyInterests(req.user!.id, req.user!.role);
      res.status(200).json({
        success: true,
        data: interests,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const interestsController = new InterestsController();
