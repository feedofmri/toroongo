import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, X, Send, ChevronDown, LogIn, AlertCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

function formatTime(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export default function LiveChatWidget() {
    const { user } = useAuth();
    const [open, setOpen]         = useState(false);
    const [messages, setMessages] = useState([]);
    const [text, setText]         = useState('');
    const [sending, setSending]   = useState(false);
    const [unread, setUnread]     = useState(0);
    const [loading, setLoading]   = useState(false);
    const [error, setError]       = useState(null);
    const bottomRef = useRef(null);
    const pollRef   = useRef(null);

    const fetchMessages = useCallback(async (silent = false) => {
        if (!user) return;
        if (!silent) setLoading(true);
        setError(null);
        try {
            const data = await api('/chat/messages');
            const msgs = Array.isArray(data) ? data : [];
            setMessages(msgs);
            if (!open) {
                setUnread(msgs.filter(m => !m.from_me && !m.read).length);
            } else {
                setUnread(0);
            }
        } catch (err) {
            if (!silent) setError('Unable to load messages.');
        } finally {
            if (!silent) setLoading(false);
        }
    }, [user, open]);

    useEffect(() => {
        if (!user) return;
        fetchMessages();
        pollRef.current = setInterval(() => fetchMessages(true), 8000);
        return () => clearInterval(pollRef.current);
    }, [fetchMessages, user]);

    // Allow other components (e.g. HelpCenter) to programmatically open the widget
    useEffect(() => {
        const handler = () => setOpen(true);
        window.addEventListener('open-live-chat', handler);
        return () => window.removeEventListener('open-live-chat', handler);
    }, []);

    useEffect(() => {
        if (open && user) {
            setUnread(0);
            setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 80);
        }
    }, [open, messages, user]);

    const handleSend = async () => {
        if (!text.trim() || sending || !user) return;
        const msgText = text.trim();
        setText('');
        setSending(true);
        try {
            const msg = await api('/chat/send', { method: 'POST', body: JSON.stringify({ text: msgText }) });
            setMessages(prev => [...prev, msg]);
            setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
        } catch {
            setText(msgText); // restore message on failure
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            {/* Chat Panel */}
            {open && (
                <div className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-border-soft overflow-hidden flex flex-col animate-slide-up"
                     style={{ height: '480px' }}>
                    {/* Header */}
                    <div className="bg-brand-primary p-4 flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <MessageCircle size={16} className="text-white" />
                            </div>
                            <div>
                                <p className="text-white font-semibold text-sm">Toroongo Support</p>
                                <p className="text-white/70 text-[10px]">Usually replies instantly</p>
                            </div>
                        </div>
                        <button onClick={() => setOpen(false)}
                            className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors">
                            <ChevronDown size={18} />
                        </button>
                    </div>

                    {/* Body */}
                    {!user ? (
                        /* Guest state */
                        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                            <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-4">
                                <MessageCircle size={24} className="text-brand-primary" />
                            </div>
                            <p className="text-sm font-semibold text-text-primary mb-1">Chat with our support team</p>
                            <p className="text-xs text-text-muted mb-5">Please log in to start a conversation with us.</p>
                            <Link to="/login" onClick={() => setOpen(false)}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white text-sm font-medium rounded-xl hover:bg-brand-primary/90 transition-colors">
                                <LogIn size={15} /> Log in to chat
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-surface-bg/30">
                                {loading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="w-5 h-5 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                                    </div>
                                ) : error ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center px-4">
                                        <AlertCircle size={22} className="text-red-400 mb-2" />
                                        <p className="text-xs text-text-muted mb-3">{error}</p>
                                        <button onClick={() => fetchMessages()}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 transition-colors">
                                            <RefreshCw size={12} /> Retry
                                        </button>
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center px-4">
                                        <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-3">
                                            <MessageCircle size={20} className="text-brand-primary" />
                                        </div>
                                        <p className="text-sm font-semibold text-text-primary mb-1">How can we help?</p>
                                        <p className="text-xs text-text-muted">Send us a message and we'll respond as soon as possible.</p>
                                    </div>
                                ) : (
                                    messages.map((msg, i) => (
                                        <div key={msg.id ?? i} className={`flex ${msg.from_me ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[78%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                                                msg.from_me
                                                    ? 'bg-brand-primary text-white rounded-br-sm'
                                                    : 'bg-white text-text-primary shadow-sm border border-border-soft rounded-bl-sm'
                                            }`}>
                                                <p>{msg.text}</p>
                                                <p className={`text-[9px] mt-0.5 ${msg.from_me ? 'text-white/60' : 'text-text-muted'}`}>
                                                    {formatTime(msg.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                                <div ref={bottomRef} />
                            </div>

                            {/* Input */}
                            <div className="p-3 border-t border-border-soft bg-white flex-shrink-0">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={text}
                                        onChange={e => setText(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                                        placeholder="Type a message…"
                                        className="flex-1 px-3.5 py-2 bg-surface-bg border border-border-soft rounded-xl text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 outline-none transition-all"
                                    />
                                    <button onClick={handleSend} disabled={!text.trim() || sending}
                                        className="w-10 h-10 bg-brand-primary text-white rounded-xl flex items-center justify-center hover:bg-brand-primary/90 transition-colors disabled:opacity-50">
                                        {sending
                                            ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            : <Send size={15} />
                                        }
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* FAB Button — always visible */}
            <button
                onClick={() => setOpen(o => !o)}
                className="relative w-14 h-14 bg-brand-primary text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center"
            >
                {open ? <X size={22} /> : <MessageCircle size={22} />}
                {!open && unread > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                        {unread > 9 ? '9+' : unread}
                    </span>
                )}
            </button>
        </div>
    );
}
