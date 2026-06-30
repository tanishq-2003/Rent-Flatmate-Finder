import prisma from '../../utils/prisma';
import { AppError } from '../../middleware/error.middleware';

export class ChatService {
  async getMyChats(userId: string) {
    // ParticipantIds is a string array. We find chats where this user's ID is in the array.
    const chats = await prisma.chat.findMany({
      where: {
        participantIds: {
          has: userId,
        },
      },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1, // Get latest message for preview
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // We also need to fetch user details for the other participants
    // This could be optimized, but works for now
    const chatsWithDetails = await Promise.all(
      chats.map(async (chat) => {
        const otherParticipantId = chat.participantIds.find((id) => id !== userId);
        let otherUser = null;
        if (otherParticipantId) {
          otherUser = await prisma.user.findUnique({
            where: { id: otherParticipantId },
            select: { id: true, profile: { select: { name: true, photo: true } } },
          });
        }
        return { ...chat, otherUser };
      })
    );

    return chatsWithDetails;
  }

  async getChatMessages(chatId: string, userId: string, limit: number = 50, cursor?: string) {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
    });

    if (!chat) throw new AppError('Chat not found', 404);
    if (!chat.participantIds.includes(userId)) throw new AppError('Not authorized', 403);

    const query: any = {
      where: { chatId },
      take: limit,
      orderBy: { createdAt: 'desc' },
    };

    if (cursor) {
      query.cursor = { id: cursor };
      query.skip = 1;
    }

    const messages = await prisma.message.findMany(query);

    return messages.reverse(); // Return chronologically
  }

  async saveMessage(chatId: string, senderId: string, content: string, type: string = 'TEXT') {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
    });

    if (!chat) throw new Error('Chat not found');
    if (!chat.participantIds.includes(senderId)) throw new Error('Not authorized');

    const message = await prisma.message.create({
      data: {
        chatId,
        senderId,
        content,
        type,
      },
    });

    // Update chat timestamp
    await prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    });

    return message;
  }
}

export const chatService = new ChatService();
