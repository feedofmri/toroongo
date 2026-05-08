import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Search, ChevronLeft, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { messageService } from '../../services';

export default function SellerMessages() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeConvo, setActiveConvo] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const scrollAreaRef = useRef(null);
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
            
            // Update metadata for active conversation
            if (activeConvo) {
                const updatedActive = convos.find(c => String(c.otherUserId) === String(activeConvo.otherUserId));
                if (updatedActive) {
                    setActiveConvo(prev => ({ ...prev, ...updatedActive }));
                }
            }
        } catch (error) {
            console.error("Failed to load seller conversations:", error);
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
            console.error("Failed to load seller messages:", error);
        }
    };

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
            const lastMsg = messages[messages.length - 1];
            const iSentIt = String(lastMsg?.senderId) === String(user?.id);
            
            if (iSentIt || isNearBottom || lastMessageCount.current === 0) {
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
            
            // Read status update
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
        <div className="h-[calc(100vh-180px)] flex flex-col animate-fade-in">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-text-primary">{t('sellerMessages.title', 'Customer Messages')}</h2>
                    <p className="text-sm text-text-muted mt-1">{t('sellerMessages.subtitle', 'Manage inquiries and support requests from your buyers.')}</p>
                </div>
            </div>

            <div className="flex-1 bg-white border border-border-soft rounded-3xl overflow-hidden shadow-sm flex">
                {/* Conversation List */}
                <div className={`${activeConvo ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 border-r border-border-soft bg-surface-bg/10`}>
                    <div className="p-4 border-b border-border-soft">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                            <input 
                                type="text" 
                                placeholder={t('sellerMessages.searchPlaceholder', 'Search customers...')} 
                                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-border-soft rounded-xl focus:border-brand-primary outline-none" 
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="p-12 text-center">
                                <Loader2 size={24} className="animate-spin text-brand-primary mx-auto mb-3" />
                                <p className="text-sm text-text-muted">{t('common.loading', 'Loading...')}</p>
                            </div>
                        ) : conversations.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-sm text-text-muted">{t('sellerMessages.noMessages', 'No messages yet.')}</p>
                            </div>
                        ) : (
                            conversations.map((convo) => (
                                <button
                                    key={convo.otherUserId}
                                    onClick={() => handleSelectConversation(convo)}
                                    className={`w-full text-left p-4 flex gap-3 border-b border-border-soft transition-all relative
                                        ${activeConvo?.otherUserId === convo.otherUserId ? 'bg-white shadow-sm z-10' : 'hover:bg-surface-bg'}`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-sm font-bold
                                        ${convo.unreadCount > 0 ? 'bg-brand-primary text-white' : 'bg-surface-bg text-text-muted border border-border-soft'}`}>
                                        {(convo.otherUser?.name || 'C').charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <span className={`text-sm truncate ${convo.unreadCount > 0 ? 'font-bold text-text-primary' : 'font-semibold text-text-primary'}`}>
                                                {convo.otherUser?.name || t('common.customer', 'Customer')}
                                            </span>
                                            <span className="text-[10px] text-text-muted whitespace-nowrap ml-2">
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
                            <div className="px-6 py-4 border-b border-border-soft flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => setActiveConvo(null)} 
                                        className="md:hidden p-2 -ml-2 text-text-muted hover:text-text-primary transition-colors"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 flex items-center justify-center">
                                        <span className="text-sm font-bold text-brand-primary">{(activeConvo.otherUser?.name || 'C').charAt(0).toUpperCase()}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-text-primary">{activeConvo.otherUser?.name || t('common.customer', 'Customer')}</h3>
                                        <p className="text-[10px] text-green-500 font-bold uppercase tracking-wider">{t('sellerMessages.buyerAccount', 'Buyer Account')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Messages List */}
                            <div 
                                ref={scrollAreaRef}
                                className="flex-1 overflow-y-auto p-6 space-y-4 bg-surface-bg/5 scroll-smooth"
                            >
                                {messages.map((msg, idx) => {
                                    const isSeller = String(msg.senderId) === String(user?.id);
                                    return (
                                        <div key={idx} className={`flex ${isSeller ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm shadow-sm
                                                ${isSeller 
                                                    ? 'bg-brand-primary text-white rounded-br-none' 
                                                    : 'bg-white text-text-primary border border-border-soft rounded-bl-none'
                                                }`}>
                                                <p className="leading-relaxed">{msg.text}</p>
                                                <div className={`flex items-center gap-1.5 mt-1.5 ${isSeller ? 'text-white/60' : 'text-text-muted'}`}>
                                                    <span className="text-[10px]">{formatTime(msg.createdAt)}</span>
                                                    {isSeller && msg.read && <span className="text-[10px] font-bold ml-1">{t('sellerMessages.read', 'Read')}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Input Area */}
                            <div className="p-4 bg-white border-t border-border-soft">
                                <form onSubmit={handleSendMessage} className="flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder={t('sellerMessages.typePlaceholder', 'Write a reply...')} 
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
                            <div className="w-16 h-16 bg-surface-bg rounded-3xl flex items-center justify-center mb-4">
                                <MessageSquare size={32} className="text-text-muted/40" />
                            </div>
                            <h3 className="text-lg font-bold text-text-primary">{t('sellerMessages.select', 'Select a conversation')}</h3>
                            <p className="text-sm text-text-muted max-w-xs mx-auto mt-2">
                                {t('sellerMessages.selectDesc', 'Choose a customer message from the list to view the history and send a reply.')}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
