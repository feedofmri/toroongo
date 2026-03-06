import { localDB } from '../db/localDB';
import { Message } from '../models';

const DELAY = 300;
const simulateDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const messageService = {
    // Get all conversations for a specific user.
    // Groups messages by the "other" participant in the conversation to build a chat list.
    async getConversations(userId) {
        await simulateDelay(DELAY);
        const messages = localDB.data.messages;

        // Find all unique users the current user has chatted with
        const conversationsMap = new Map();

        messages.forEach(msg => {
            if (msg.senderId === userId || msg.receiverId === userId) {
                const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;

                // Keep track of the latest message and unread count
                if (!conversationsMap.has(otherUserId)) {
                    conversationsMap.set(otherUserId, {
                        otherUserId,
                        lastMessage: msg,
                        unreadCount: (!msg.read && msg.receiverId === userId) ? 1 : 0
                    });
                } else {
                    const current = conversationsMap.get(otherUserId);
                    if (new Date(msg.createdAt) > new Date(current.lastMessage.createdAt)) {
                        current.lastMessage = msg;
                    }
                    if (!msg.read && msg.receiverId === userId) {
                        current.unreadCount += 1;
                    }
                }
            }
        });

        // Enrich the conversation objects with the other user's details for easy rendering
        const enrichedConversations = Array.from(conversationsMap.values()).map(convo => {
            const otherUser = localDB.data.users.find(u => u.id === convo.otherUserId);
            return {
                ...convo,
                otherUser: otherUser || { id: convo.otherUserId, name: 'Unknown User', logo: null }
            };
        });

        // Sort by most recent message
        return enrichedConversations.sort((a, b) =>
            new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
        );
    },

    // Fetch the full message history between two specific users
    async getMessages(userId, otherUserId) {
        await simulateDelay(DELAY);
        const history = localDB.data.messages.filter(msg =>
            (msg.senderId === userId && msg.receiverId === otherUserId) ||
            (msg.senderId === otherUserId && msg.receiverId === userId)
        );

        return history.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    },

    // Send a new message
    async sendMessage(senderId, receiverId, text) {
        await simulateDelay(DELAY);
        const newMsg = new Message({ senderId, receiverId, text });
        localDB.data.messages.push(newMsg);
        localDB.save();
        return newMsg;
    },

    // Mark all incoming messages from a specific user as read
    async markAsRead(userId, otherUserId) {
        let updated = false;
        localDB.data.messages.forEach(msg => {
            if (msg.senderId === otherUserId && msg.receiverId === userId && !msg.read) {
                msg.read = true;
                updated = true;
            }
        });

        if (updated) {
            localDB.save();
        }
        return true;
    }
};
