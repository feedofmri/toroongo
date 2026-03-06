import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Search, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { messageService } from '../../services';

export default function MessageCenter() {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeConvo, setActiveConvo] = useState(null); // The other party's user object
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);

    const loadConversations = async () => {
        if (!user) return;
        try {
            const convos = await messageService.getConversations(user.id);
            setConversations(convos);
        } catch (error) {
            console.error("Failed to load conversations:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadConversations();
    }, [user]);

    const handleSelectConversation = async (convo) => {
        setActiveConvo(convo);
        try {
            await messageService.markAsRead(user.id, convo.otherUserId);
            const msgs = await messageService.getMessages(user.id, convo.otherUserId);
            setMessages(msgs);
            // Optimization: refresh conversations unread count without a full network delay call if possible,
            // but calling loadConversations is easiest.
            loadConversations();
        } catch (error) {
            console.error(error);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !activeConvo) return;
        setSending(true);
        try {
            await messageService.sendMessage(user.id, activeConvo.otherUserId, newMessage);
            setNewMessage('');
            // Reload messages
            const msgs = await messageService.getMessages(user.id, activeConvo.otherUserId);
            setMessages(msgs);
            loadConversations();
        } catch (error) {
            console.error(error);
        } finally {
            setSending(false);
        }
    };

    const formatTime = (isoString) => {
        const d = new Date(isoString);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div>
            <h2 className="text-xl font-bold text-text-primary mb-6">Messages</h2>

            <div className="border border-border-soft rounded-2xl overflow-hidden" style={{ height: '500px' }}>
                <div className="flex h-full">
                    {/* Conversation List */}
                    <div className={`${activeConvo ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 border-r border-border-soft`}>
                        {/* Search */}
                        <div className="p-3 border-b border-border-soft">
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                                <input
                                    type="text"
                                    placeholder="Search messages..."
                                    className="w-full pl-9 pr-3 py-2 text-sm bg-surface-bg border border-border-soft rounded-lg
                           focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                                />
                            </div>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto">
                            {loading ? (
                                <div className="p-8 text-center text-text-muted text-sm">Loading messages...</div>
                            ) : conversations.map((convo) => (
                                <button
                                    key={convo.otherUserId}
                                    onClick={() => handleSelectConversation(convo)}
                                    className={`w-full text-left p-4 flex gap-3 border-b border-border-soft transition-colors
                    ${activeConvo?.otherUserId === convo.otherUserId ? 'bg-brand-primary/5' : 'hover:bg-surface-bg'}`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold
                    ${convo.unreadCount > 0 ? 'bg-brand-primary text-white' : 'bg-surface-bg text-text-muted border border-border-soft'}`}>
                                        {convo.otherUser.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span className={`text-sm ${convo.unreadCount > 0 ? 'font-bold text-text-primary' : 'font-medium text-text-primary'}`}>
                                                {convo.otherUser.name}
                                            </span>
                                            <span className="text-[10px] text-text-muted flex-shrink-0">{formatTime(convo.lastMessage.createdAt)}</span>
                                        </div>
                                        <p className={`text-xs mt-0.5 line-clamp-1 ${convo.unreadCount > 0 ? 'text-text-primary font-medium' : 'text-text-muted'}`}>
                                            {convo.lastMessage.text}
                                        </p>
                                    </div>
                                    {convo.unreadCount > 0 && (
                                        <div className="w-2.5 h-2.5 bg-brand-primary rounded-full flex-shrink-0 mt-1" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className={`${activeConvo ? 'flex' : 'hidden md:flex'} flex-col flex-1`}>
                        {activeConvo ? (
                            <>
                                {/* Chat header */}
                                <div className="px-4 py-3 border-b border-border-soft flex items-center gap-3">
                                    <button
                                        onClick={() => setActiveConvo(null)}
                                        className="md:hidden p-1 text-text-muted hover:text-text-primary"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    <div className="w-8 h-8 bg-brand-primary/10 rounded-full flex items-center justify-center">
                                        <span className="text-xs font-bold text-brand-primary">{activeConvo.otherUser.name.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-text-primary">{activeConvo.otherUser.name}</span>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {messages.map((msg, idx) => {
                                        const isBuyer = msg.senderId === user.id;
                                        return (
                                            <div key={idx} className={`flex ${isBuyer ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm
                        ${isBuyer
                                                        ? 'bg-brand-primary text-white rounded-br-none'
                                                        : 'bg-surface-bg text-text-primary border border-border-soft rounded-bl-none'
                                                    }`}>
                                                    <p>{msg.text}</p>
                                                    <p className={`text-[10px] mt-1 ${isBuyer ? 'text-white/60' : 'text-text-muted'}`}>
                                                        {formatTime(msg.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Input */}
                                <div className="p-3 border-t border-border-soft">
                                    <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Type a message..."
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            className="flex-1 px-4 py-2.5 text-sm bg-surface-bg border border-border-soft rounded-xl
                               focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                                        />
                                        <button
                                            type="submit"
                                            disabled={sending || !newMessage.trim()}
                                            className="p-2.5 bg-brand-primary text-white rounded-xl hover:bg-brand-secondary transition-colors disabled:opacity-50"
                                        >
                                            <Send size={16} />
                                        </button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                                <MessageSquare size={40} className="text-text-muted/30 mb-4" />
                                <p className="text-text-primary font-medium mb-1">Select a conversation</p>
                                <p className="text-sm text-text-muted">Choose a seller to view your messages.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
