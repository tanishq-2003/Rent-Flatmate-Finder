import { Router } from 'express';
import { listingsController } from './listings.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createListingSchema, updateListingSchema } from './listings.schema';

const router = Router();

// Public routes
router.get('/', listingsController.getListings);
router.get('/:id', listingsController.getListingById);

// Protected routes (Owner only)
router.use(authenticate);
router.use(authorize('OWNER', 'ADMIN'));

router.post('/', validate(createListingSchema), listingsController.createListing);
router.put('/:id', validate(updateListingSchema), listingsController.updateListing);
router.delete('/:id', listingsController.deleteListing);

export default router;
