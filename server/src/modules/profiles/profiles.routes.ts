import { Router } from 'express';
import { profilesController } from './profiles.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { updateProfileSchema } from './profiles.schema';

const router = Router();

router.use(authenticate);

router.get('/me', profilesController.getMyProfile);
router.put('/me', validate(updateProfileSchema), profilesController.updateMyProfile);
router.get('/:userId', profilesController.getProfileById);

export default router;
