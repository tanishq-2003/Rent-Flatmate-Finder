import { Request, Response, NextFunction } from 'express';
import { cloudinary } from '../../utils/cloudinary';
import { AppError } from '../../middleware/error.middleware';

export class UploadController {
  async uploadImage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new AppError('No image provided', 400);
      }

      // Convert buffer to Base64 string for Cloudinary
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'flatmatch',
        resource_type: 'auto',
      });

      res.status(200).json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
          url: result.secure_url,
          publicId: result.public_id,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const uploadController = new UploadController();
