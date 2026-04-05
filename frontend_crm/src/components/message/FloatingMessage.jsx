import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, ChevronLeft, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { messageService } from '../../services';

export default function FloatingMessage() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [conversations, setConversations] = useState([]);
    const [activeConvo, setActiveConvo] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [unreadTotal, setUnreadTotal] = useState(0);
    const messagesEndRef = useRef(null);

    // Load conversations when the widget opens
    const loadConversations = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const convos = await messageService.getConversations(user.id);
            setConversations(convos);
            const total = convos.reduce((sum, c) => sum + c.unreadCount, 0);
            setUnreadTotal(total);
        } catch (err) {
            console.error('Failed to load conversations:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) loadConversations();
    }, [user]);

    // Refresh conversations periodically when widget is open
    useEffect(() => {
        if (!isOpen || !user) return;
        loadConversations();
        const interval = setInterval(loadConversations, 10000);
        return () => clearInterval(interval);
    }, [isOpen, user]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Don't render if not logged in
    if (!user) return null;

    const handleSelectConversation = async (convo) => {
        setActiveConvo(convo);
        try {
            await messageService.markAsRead(user.id, convo.otherUserId);
            const msgs = await messageService.getMessages(user.id, convo.otherUserId);
            setMessages(msgs);
            loadConversations();
        } catch (err) {
            console.error(err);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !activeConvo) return;
        setSending(true);
        try {
            await messageService.sendMessage(user.id, activeConvo.otherUserId, newMessage);
            setNewMessage('');
            const msgs = await messageService.getMessages(user.id, activeConvo.otherUserId);
            setMessages(msgs);
            loadConversations();
        } catch (err) {
            console.error(err);
        } finally {
            setSending(false);
        }
    };

    const formatTime = (isoString) => {
        const d = new Date(isoString);
        const now = new Date();
        const diffMs = now - d;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return d.toLocaleDateString();
    };

    const filteredConversations = conversations.filter(c =>
        c.otherUser.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                data-debug="hook-fix-v1"
                className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-brand-primary text-white rounded-full shadow-2xl
                           hover:bg-brand-secondary transition-all duration-300 flex items-center justify-center
                           hover:scale-110 active:scale-95"
                style={{
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
            >
                {isOpen ? <X size={22} /> : <MessageSquare size={22} />}
                {!isOpen && unreadTotal > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold
                                     rounded-full flex items-center justify-center animate-bounce">
                        {unreadTotal > 9 ? '9+' : unreadTotal}
                    </span>
                )}
            </button>

            {/* Message Widget Popup */}
            {isOpen && (
                <div
                    className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl
                               border border-border-soft overflow-hidden animate-fade-in"
                    style={{
                        height: '520px',
                        boxShadow: '0 24px 80px rgba(0, 0, 0, 0.15), 0 8px 24px rgba(0, 0, 0, 0.08)'
                    }}
                >
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="px-4 py-3 bg-brand-primary text-white flex items-center justify-between flex-shrink-0">
                            {activeConvo ? (
                                <>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => { setActiveConvo(null); setMessages([]); }}
                                            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                                        >
                                            <ChevronLeft size={18} />
                                        </button>
                                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                                            {activeConvo.otherUser.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold leading-tight">{activeConvo.otherUser.name}</p>
                                            <p className="text-[10px] text-white/70">
                                                {activeConvo.otherUser.role === 'seller' ? 'Seller' : 'Buyer'}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center gap-2">
                                        <MessageSquare size={18} />
                                        <span className="font-semibold text-sm">Messages</span>
                                        {unreadTotal > 0 && (
                                            <span className="bg-white/20 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                                {unreadTotal}
                                            </span>
                                        )}
                                    </div>
                                </>
                            )}
                            <button
                                onClick={() => { setIsOpen(false); setActiveConvo(null); setMessages([]); }}
                                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Body */}
                        {activeConvo ? (
                            /* ─── Active Chat View ─── */
                            <>
                                <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50/50">
                                    {messages.length === 0 && (
                                        <div className="text-center py-10 text-text-muted text-sm">
                                            No messages yet. Start the conversation!
                                        </div>
                                    )}
                                    {messages.map((msg, idx) => {
                                        const isMe = msg.senderId === user.id;
                                        return (
                                            <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-[13px] leading-relaxed
                                                    ${isMe
                                                        ? 'bg-brand-primary text-white rounded-br-sm'
                                                        : 'bg-white text-text-primary border border-border-soft rounded-bl-sm shadow-sm'
                                                    }`}>
                                                    <p className="whitespace-pre-wrap">{msg.text}</p>
                                                    <p className={`text-[9px] mt-1 ${isMe ? 'text-white/50' : 'text-text-muted'}`}>
                                                        {formatTime(msg.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Message Input */}
                                <div className="p-2.5 border-t border-border-soft bg-white flex-shrink-0">
                                    <form
                                        onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                                        className="flex gap-2"
                                    >
                                        <input
                                            type="text"
                                            placeholder="Type a message..."
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            className="flex-1 px-3.5 py-2 text-[13px] bg-gray-50 border border-border-soft rounded-xl
                                                       focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                                        />
                                        <button
                                            type="submit"
                                            disabled={sending || !newMessage.trim()}
                                            className="p-2 bg-brand-primary text-white rounded-xl hover:bg-brand-secondary transition-colors disabled:opacity-40"
                                        >
                                            <Send size={16} />
                                        </button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            /* ─── Conversation List View ─── */
                            <>
                                {/* Search */}
                                <div className="px-3 py-2 border-b border-border-soft flex-shrink-0">
                                    <div className="relative">
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                                        <input
                                            type="text"
                                            placeholder="Search conversations..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-9 pr-3 py-2 text-[13px] bg-gray-50 border border-border-soft rounded-lg
                                                       focus:border-brand-primary outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Conversations */}
                                <div className="flex-1 overflow-y-auto">
                                    {loading ? (
                                        <div className="p-8 text-center text-text-muted text-sm">Loading...</div>
                                    ) : filteredConversations.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-center p-6">
                                            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                                <MessageSquare size={24} className="text-text-muted/40" />
                                            </div>
                                            <p className="text-sm font-medium text-text-primary mb-1">No conversations yet</p>
                                            <p className="text-xs text-text-muted">
                                                Start a conversation by messaging a seller from a product page.
                                            </p>
                                        </div>
                                    ) : (
                                        filteredConversations.map((convo) => (
                                            <button
                                                key={convo.otherUserId}
                                                onClick={() => handleSelectConversation(convo)}
                                                className="w-full text-left px-3.5 py-3 flex gap-3 border-b border-border-soft/50
                                                           hover:bg-gray-50 transition-colors"
                                            >
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                                                                 text-[13px] font-bold
                                                    ${convo.unreadCount > 0
                                                        ? 'bg-brand-primary text-white'
                                                        : 'bg-gray-100 text-text-muted'
                                                    }`}>
                                                    {convo.otherUser.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <span className={`text-[13px] ${convo.unreadCount > 0 ? 'font-bold text-text-primary' : 'font-medium text-text-primary'}`}>
                                                            {convo.otherUser.name}
                                                        </span>
                                                        <span className="text-[10px] text-text-muted flex-shrink-0">
                                                            {formatTime(convo.lastMessage.createdAt)}
                                                        </span>
                                                    </div>
                                                    <p className={`text-[11px] mt-0.5 line-clamp-1
                                                        ${convo.unreadCount > 0 ? 'text-text-primary font-medium' : 'text-text-muted'}`}>
                                                        {convo.lastMessage.senderId === user.id ? 'You: ' : ''}
                                                        {convo.lastMessage.text}
                                                    </p>
                                                </div>
                                                {convo.unreadCount > 0 && (
                                                    <div className="flex items-center">
                                                        <span className="w-5 h-5 bg-brand-primary text-white text-[10px] font-bold
                                                                         rounded-full flex items-center justify-center">
                                                            {convo.unreadCount}
                                                        </span>
                                                    </div>
                                                )}
                                            </button>
                                        ))
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
