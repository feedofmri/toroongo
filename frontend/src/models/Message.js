export class Message {
    constructor({ id, senderId, receiverId, text, read = false, createdAt }) {
        this.id = id || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.text = text;
        this.read = read;
        this.createdAt = createdAt || new Date().toISOString();
    }
}
