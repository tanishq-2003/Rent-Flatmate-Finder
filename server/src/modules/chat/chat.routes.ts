import { Router } from 'express';
import { chatController } from './chat.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', chatController.getMyChats);
router.get('/:id/messages', chatController.getChatMessages);

export default router;
