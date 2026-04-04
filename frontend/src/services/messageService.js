import { api } from './api';

export const messageService = {
    async getConversations(userId) {
        const convos = await api('/messages/conversations');
        // Transform to match frontend expectations
        return convos.map(c => ({
            ...c,
            lastMessage: {
                ...c.lastMessage || c.last_message,
                senderId: (c.lastMessage || c.last_message)?.sender_id,
                receiverId: (c.lastMessage || c.last_message)?.receiver_id,
                createdAt: (c.lastMessage || c.last_message)?.created_at,
            },
            otherUser: c.otherUser || c.other_user,
        }));
    },

    async getMessages(userId, otherUserId) {
        const msgs = await api(`/messages/${otherUserId}`);
        return msgs.map(m => ({
            ...m,
            senderId: m.sender_id,
            receiverId: m.receiver_id,
            createdAt: m.created_at,
        }));
    },

    async sendMessage(senderId, receiverId, text) {
        const msg = await api('/messages', {
            method: 'POST',
            body: JSON.stringify({ receiver_id: receiverId, text }),
        });
        return { ...msg, senderId: msg.sender_id, receiverId: msg.receiver_id, createdAt: msg.created_at };
    },

    async markAsRead(userId, otherUserId) {
        return await api(`/messages/${otherUserId}/read`, { method: 'PUT' });
    }
};
