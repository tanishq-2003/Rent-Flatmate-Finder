import { Router } from 'express';
import { uploadController } from './upload.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { upload } from '../../middleware/upload.middleware';

const router = Router();

router.use(authenticate);

router.post('/', upload.single('image'), uploadController.uploadImage);

export default router;
