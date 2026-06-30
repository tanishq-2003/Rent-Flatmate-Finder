import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { chatService } from './chat.service';

export class ChatController {
  async getMyChats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const chats = await chatService.getMyChats(req.user!.id);
      res.status(200).json({
        success: true,
        data: chats,
      });
    } catch (error) {
      next(error);
    }
  }

  async getChatMessages(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const cursor = req.query.cursor as string;
      const messages = await chatService.getChatMessages(req.params.id, req.user!.id, limit, cursor);
      res.status(200).json({
        success: true,
        data: messages,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const chatController = new ChatController();
