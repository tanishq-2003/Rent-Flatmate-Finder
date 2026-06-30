import { Router } from 'express';
import { interestsController } from './interests.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { sendInterestSchema, updateInterestStatusSchema } from './interests.schema';

const router = Router();

router.use(authenticate);

// Tenants send interest
router.post('/', authorize('TENANT'), validate(sendInterestSchema), interestsController.sendInterest);

// Owners update interest status
router.put('/:id/status', authorize('OWNER'), validate(updateInterestStatusSchema), interestsController.updateInterestStatus);

// Both view interests
router.get('/me', interestsController.getMyInterests);

export default router;
