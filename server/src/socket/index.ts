import { Server, Socket } from 'socket.io';
import { verifyAccessToken } from '../utils/jwt';
import { chatService } from '../modules/chat/chat.service';
import prisma from '../utils/prisma';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export const setupSocket = (io: Server) => {
  // Authentication Middleware
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers['authorization']?.split(' ')[1];
    
    if (!token) {
      return next(new Error('Authentication error'));
    }
    
    try {
      const decoded = verifyAccessToken(token);
      socket.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    const userId = socket.userId!;
    console.log(`User connected: ${userId} on socket ${socket.id}`);

    // Join personal room for notifications
    socket.join(`user_${userId}`);
    
    // Broadcast online status to others
    socket.broadcast.emit('user_online', { userId });

    socket.on('join_chat', async (chatId: string) => {
      // Verify user belongs to chat
      try {
        const chat = await prisma.chat.findUnique({ where: { id: chatId } });
        if (chat && chat.participantIds.includes(userId)) {
          socket.join(chatId);
          console.log(`User ${userId} joined chat ${chatId}`);
        }
      } catch (error) {
        console.error('Error joining chat:', error);
      }
    });

    socket.on('leave_chat', (chatId: string) => {
      socket.leave(chatId);
    });

    socket.on('send_message', async (data: { chatId: string, content: string }) => {
      try {
        const message = await chatService.saveMessage(data.chatId, userId, data.content);
        
        // Broadcast to room
        io.to(data.chatId).emit('new_message', message);
        
        // Could also emit notification to the personal room of the other participant if they aren't in the chat room
        const chat = await prisma.chat.findUnique({ where: { id: data.chatId } });
        if (chat) {
          const otherParticipant = chat.participantIds.find(id => id !== userId);
          if (otherParticipant) {
            io.to(`user_${otherParticipant}`).emit('notification', {
              type: 'NEW_MESSAGE',
              chatId: data.chatId,
              senderId: userId,
              message: message.content
            });
          }
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    socket.on('typing_start', (chatId: string) => {
      socket.to(chatId).emit('user_typing', { userId, chatId, isTyping: true });
    });

    socket.on('typing_stop', (chatId: string) => {
      socket.to(chatId).emit('user_typing', { userId, chatId, isTyping: false });
    });

    socket.on('mark_read', async (data: { messageId: string, chatId: string }) => {
      try {
        await prisma.message.update({
          where: { id: data.messageId },
          data: { readAt: new Date() }
        });
        socket.to(data.chatId).emit('message_read', { messageId: data.messageId, readBy: userId });
      } catch (error) {
        console.error('Error marking message read:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${userId}`);
      io.emit('user_offline', { userId });
    });
  });
};
