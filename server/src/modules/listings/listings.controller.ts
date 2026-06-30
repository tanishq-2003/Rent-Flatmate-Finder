import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { listingsService } from './listings.service';

export class ListingsController {
  async createListing(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const listing = await listingsService.createListing(req.user!.id, req.body);
      res.status(201).json({
        success: true,
        message: 'Listing created successfully',
        data: listing,
      });
    } catch (error) {
      next(error);
    }
  }

  async getListings(req: Request, res: Response, next: NextFunction) {
    try {
      let currentUserId = undefined;
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
          const { verifyAccessToken } = require('../../utils/jwt');
          const decoded = verifyAccessToken(token);
          currentUserId = decoded.id;
        } catch (e) {
          // Ignore token errors for public route
        }
      }

      const result = await listingsService.getListings(req.query, currentUserId);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getListingById(req: Request, res: Response, next: NextFunction) {
    try {
      const listing = await listingsService.getListingById(req.params.id);
      res.status(200).json({
        success: true,
        data: listing,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateListing(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const listing = await listingsService.updateListing(req.params.id, req.user!.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Listing updated successfully',
        data: listing,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteListing(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await listingsService.deleteListing(req.params.id, req.user!.id);
      res.status(200).json({
        success: true,
        message: 'Listing deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const listingsController = new ListingsController();
