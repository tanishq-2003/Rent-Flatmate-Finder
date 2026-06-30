import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env';

// This will only work if the user has provided a CLOUDINARY_URL in .env
if (process.env.CLOUDINARY_URL) {
  // It automatically configures itself if CLOUDINARY_URL is present
} else {
  console.warn('⚠️ CLOUDINARY_URL is missing. Image uploads will fail.');
}

export { cloudinary };
