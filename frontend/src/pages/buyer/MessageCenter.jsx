import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { MessageSquare, Send, Search, ChevronLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { messageService } from '../../services';

export default function MessageCenter() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeConvo, setActiveConvo] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    
    const scrollAreaRef = useRef(null);
    const hasHandledDeepLink = useRef(false);
    const lastMessageCount = useRef(0);

    const scrollToBottom = (instant = false) => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current;
            scrollContainer.scrollTo({
                top: scrollContainer.scrollHeight,
                behavior: instant ? 'auto' : 'smooth'
            });
        }
    };

    const loadConversations = async (silent = false) => {
        if (!user) return;
        if (!silent) setLoading(true);
        try {
            const convos = await messageService.getConversations(user.id);
            setConversations(convos || []);

            // Update active conversation data if it exists
            if (activeConvo) {
                const updatedActive = convos.find(c => String(c.otherUserId) === String(activeConvo.otherUserId));
                if (updatedActive) {
                    // Update metadata but keep the active state
                    setActiveConvo(prev => ({ ...prev, ...updatedActive }));
                }
            }
        } catch (error) {
            console.error("Failed to load conversations:", error);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const loadMessages = async (silent = false) => {
        if (!user || !activeConvo) return;
        try {
            const msgs = await messageService.getMessages(user.id, activeConvo.otherUserId);
            setMessages(msgs || []);
        } catch (error) {
            console.error("Failed to load messages:", error);
        }
    };

    // Deep Linking Handler - separated from polling to avoid loops
    useEffect(() => {
        if (conversations.length > 0 && !hasHandledDeepLink.current) {
            const queryParams = new URLSearchParams(location.search);
            const targetUserId = queryParams.get('userId');
            
            if (targetUserId) {
                const targetConvo = conversations.find(c => String(c.otherUserId) === String(targetUserId));
                if (targetConvo) {
                    hasHandledDeepLink.current = true;
                    handleSelectConversation(targetConvo);
                    // Standard cleanup
                    navigate(location.pathname, { replace: true });
                }
            }
        }
    }, [conversations, location.search]);

    // Initial load
    useEffect(() => {
        loadConversations();
    }, [user]);

    // Polling
    useEffect(() => {
        const interval = setInterval(() => {
            loadConversations(true);
            if (activeConvo) {
                loadMessages(true);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [user, activeConvo?.otherUserId]);

    // Smart Scroll Trigger
    useEffect(() => {
        if (!scrollAreaRef.current) return;
        
        const isNewMessage = messages.length > lastMessageCount.current;
        const scrollContainer = scrollAreaRef.current;
        const isNearBottom = scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight < 150;

        if (isNewMessage) {
            // If user sent the message or is already at the bottom, auto-scroll
            const lastMsg = messages[messages.length - 1];
            const iSentIt = String(lastMsg?.senderId) === String(user?.id);
            
            if (iSentIt || isNearBottom || lastMessageCount.current === 0) {
                // Use setTimeout to ensure DOM is updated
                setTimeout(() => scrollToBottom(lastMessageCount.current === 0), 100);
            }
        }
        
        lastMessageCount.current = messages.length;
    }, [messages, user?.id]);

    const handleSelectConversation = async (convo) => {
        if (!convo) return;
        setActiveConvo(convo);
        try {
            const msgs = await messageService.getMessages(user.id, convo.otherUserId);
            setMessages(msgs || []);
            
            // Mark as read and refresh unread status silently
            await messageService.markAsRead(user.id, convo.otherUserId);
            const updatedConvos = await messageService.getConversations(user.id);
            setConversations(updatedConvos || []);
        } catch (error) {
            console.error("Selection error:", error);
        }
    };

    const handleSendMessage = async (e) => {
        e?.preventDefault();
        const text = newMessage.trim();
        if (!text || !activeConvo || sending) return;
        
        setSending(true);
        setNewMessage('');
        
        try {
            await messageService.sendMessage(user.id, activeConvo.otherUserId, text);
            await loadMessages(true);
            loadConversations(true);
        } catch (error) {
            console.error("Send error:", error);
            setNewMessage(text);
        } finally {
            setSending(false);
        }
    };

    const formatTime = (isoString) => {
        if (!isoString) return '';
        try {
            const d = new Date(isoString);
            if (isNaN(d.getTime())) return '';
            return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            return '';
        }
    };

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
                <MessageSquare className="text-brand-primary" />
                {t('messages.title', 'Messages')}
            </h2>

            <div className="bg-white border border-border-soft rounded-3xl overflow-hidden shadow-sm flex h-[600px]">
                {/* Conversation List */}
                <div className={`${activeConvo ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 border-r border-border-soft bg-surface-bg/10`}>
                    <div className="p-4 border-b border-border-soft">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                            <input 
                                type="text" 
                                placeholder={t('messages.searchPlaceholder', 'Find a conversation...')} 
                                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-border-soft rounded-xl focus:border-brand-primary outline-none" 
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="p-12 text-center">
                                <Loader2 size={24} className="animate-spin text-brand-primary mx-auto mb-3" />
                                <p className="text-sm text-text-muted">Loading...</p>
                            </div>
                        ) : conversations.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-sm text-text-muted">No messages yet.</p>
                            </div>
                        ) : (
                            conversations.map((convo) => (
                                <button
                                    key={convo.otherUserId}
                                    onClick={() => handleSelectConversation(convo)}
                                    className={`w-full text-left p-4 flex gap-3 border-b border-border-soft transition-all relative
                                        ${activeConvo?.otherUserId === convo.otherUserId ? 'bg-white shadow-sm' : 'hover:bg-surface-bg'}`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-sm font-bold
                                        ${convo.unreadCount > 0 ? 'bg-brand-primary text-white' : 'bg-surface-bg text-text-muted border border-border-soft'}`}>
                                        {(convo.otherUser?.name || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <span className={`text-sm truncate ${convo.unreadCount > 0 ? 'font-bold text-text-primary' : 'font-semibold text-text-primary'}`}>
                                                {convo.otherUser?.name || 'Unknown User'}
                                            </span>
                                            <span className="text-[10px] text-text-muted">
                                                {formatTime(convo.lastMessage?.createdAt)}
                                            </span>
                                        </div>
                                        <p className={`text-xs line-clamp-1 ${convo.unreadCount > 0 ? 'text-text-primary font-medium' : 'text-text-muted'}`}>
                                            {convo.lastMessage?.text || ''}
                                        </p>
                                    </div>
                                    {convo.unreadCount > 0 && (
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-brand-primary rounded-full shadow-lg shadow-brand-primary/40" />
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className={`${activeConvo ? 'flex' : 'hidden md:flex'} flex-col flex-1 bg-white`}>
                    {activeConvo ? (
                        <>
                            {/* Chat Header */}
                            <div className="px-6 py-4 border-b border-border-soft flex items-center justify-between bg-white z-10 shadow-sm shadow-black/[0.02]">
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => setActiveConvo(null)} 
                                        className="md:hidden p-2 -ml-2 text-text-muted hover:text-text-primary"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 flex items-center justify-center">
                                        <span className="text-sm font-bold text-brand-primary">{(activeConvo.otherUser?.name || 'U').charAt(0).toUpperCase()}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-text-primary">{activeConvo.otherUser?.name || 'Unknown User'}</h3>
                                        <div className="flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                            <p className="text-[10px] text-text-muted font-medium">Business Account</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div 
                                ref={scrollAreaRef}
                                className="flex-1 overflow-y-auto p-6 space-y-4 bg-surface-bg/5 scroll-smooth"
                            >
                                {messages.map((msg, idx) => {
                                    const isBuyer = String(msg.senderId) === String(user?.id);
                                    return (
                                        <div key={idx} className={`flex ${isBuyer ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm shadow-sm
                                                ${isBuyer 
                                                    ? 'bg-brand-primary text-white rounded-br-none' 
                                                    : 'bg-white text-text-primary border border-border-soft rounded-bl-none'
                                                }`}>
                                                <p className="leading-relaxed">{msg.text}</p>
                                                <div className={`flex items-center gap-1.5 mt-1.5 ${isBuyer ? 'text-white/60' : 'text-text-muted'}`}>
                                                    <span className="text-[10px]">{formatTime(msg.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Input */}
                            <div className="p-4 bg-white border-t border-border-soft">
                                <form onSubmit={handleSendMessage} className="flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder={t('messages.typeMessage', 'A message for the seller...')} 
                                        value={newMessage} 
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className="flex-1 px-5 py-3 text-sm bg-surface-bg border border-border-soft rounded-2xl focus:border-brand-primary outline-none transition-all" 
                                    />
                                    <button 
                                        disabled={sending || !newMessage.trim()} 
                                        type="submit" 
                                        className="p-3.5 bg-brand-primary text-white rounded-2xl hover:bg-brand-secondary transition-all shadow-lg shadow-brand-primary/20 disabled:opacity-50"
                                    >
                                        {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                            <div className="w-16 h-16 bg-brand-primary/5 rounded-3xl flex items-center justify-center mb-4">
                                <MessageSquare size={32} className="text-brand-primary/40" />
                            </div>
                            <h3 className="text-lg font-bold text-text-primary">Your Messages</h3>
                            <p className="text-sm text-text-muted max-w-sm mx-auto mt-2">
                                When you contact a seller regarding a product, your conversations will appear here. Select one to continue.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
