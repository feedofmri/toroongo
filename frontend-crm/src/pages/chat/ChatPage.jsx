import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageSquare, Send, User, Search, RefreshCw } from 'lucide-react';
import { adminService } from '../../services/adminService';

function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ChatPage() {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages]           = useState([]);
  const [activeUser, setActiveUser]       = useState(null);
  const [text, setText]                   = useState('');
  const [search, setSearch]               = useState('');
  const [loadingConvs, setLoadingConvs]   = useState(true);
  const [loadingMsgs, setLoadingMsgs]     = useState(false);
  const [sending, setSending]             = useState(false);
  const bottomRef = useRef(null);
  const pollRef   = useRef(null);

  const fetchConversations = useCallback(() => {
    adminService.getChatConversations()
      .then(res => setConversations(Array.isArray(res) ? res : []))
      .catch(() => {})
      .finally(() => setLoadingConvs(false));
  }, []);

  const fetchMessages = useCallback((userId) => {
    if (!userId) return;
    setLoadingMsgs(true);
    adminService.getChatMessages(userId)
      .then(res => {
        setMessages(Array.isArray(res) ? res : []);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
        // Update unread count in conversation list
        setConversations(list => list.map(c => c.user_id === userId ? { ...c, unread_count: 0 } : c));
      })
      .catch(() => {})
      .finally(() => setLoadingMsgs(false));
  }, []);

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 10000);
    return () => clearInterval(interval);
  }, [fetchConversations]);

  useEffect(() => {
    if (!activeUser) return;
    fetchMessages(activeUser.user_id);
    pollRef.current = setInterval(() => fetchMessages(activeUser.user_id), 5000);
    return () => clearInterval(pollRef.current);
  }, [activeUser, fetchMessages]);

  const handleSend = async () => {
    if (!text.trim() || !activeUser || sending) return;
    const msgText = text.trim();
    setText('');
    setSending(true);
    try {
      const msg = await adminService.sendChatMessage(activeUser.user_id, msgText);
      setMessages(prev => [...prev, msg]);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    } catch (e) { console.error(e); }
    finally { setSending(false); }
  };

  const filtered = conversations.filter(c =>
    !search || c.user_name.toLowerCase().includes(search.toLowerCase()) || c.user_email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Live Chat</h1>
        <p className="text-sm text-text-muted mt-0.5">Support conversations with users</p>
      </div>

      <div className="bg-white rounded-2xl border border-border-soft overflow-hidden" style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}>
        <div className="flex h-full">

          {/* Sidebar — conversation list */}
          <div className="w-72 flex-shrink-0 border-r border-border-soft flex flex-col">
            <div className="p-4 border-b border-border-soft">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                <input type="text" placeholder="Search conversations…" value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-surface-bg border border-border-soft rounded-xl text-sm focus:border-brand-primary outline-none"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loadingConvs ? (
                <div className="p-4 space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-full bg-surface-bg animate-pulse flex-shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 bg-surface-bg rounded w-3/4 animate-pulse" />
                        <div className="h-2.5 bg-surface-bg rounded w-1/2 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="p-6 text-center">
                  <MessageSquare size={28} className="text-text-muted/30 mx-auto mb-2" />
                  <p className="text-sm text-text-muted">No conversations yet</p>
                </div>
              ) : (
                filtered.sort((a, b) => new Date(b.last_at) - new Date(a.last_at)).map(conv => (
                  <button key={conv.user_id} onClick={() => setActiveUser(conv)}
                    className={`w-full p-4 text-left hover:bg-surface-bg/50 transition-colors border-b border-border-soft/50 ${activeUser?.user_id === conv.user_id ? 'bg-brand-primary/5 border-l-2 border-l-brand-primary' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                        <User size={14} className="text-brand-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-sm font-semibold text-text-primary truncate">{conv.user_name}</p>
                          {conv.unread_count > 0 && (
                            <span className="flex-shrink-0 w-5 h-5 bg-brand-primary rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                              {conv.unread_count}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-text-muted truncate mt-0.5">{conv.last_message}</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-text-muted mt-1.5 text-right">{formatDate(conv.last_at)}</p>
                  </button>
                ))
              )}
            </div>

            <div className="p-3 border-t border-border-soft">
              <button onClick={fetchConversations} className="w-full flex items-center justify-center gap-2 py-2 text-xs text-text-muted hover:text-brand-primary transition-colors rounded-xl hover:bg-surface-bg">
                <RefreshCw size={12} /> Refresh
              </button>
            </div>
          </div>

          {/* Main chat area */}
          {!activeUser ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-4">
                <MessageSquare size={28} className="text-brand-primary" />
              </div>
              <h3 className="font-bold text-text-primary mb-1">Select a conversation</h3>
              <p className="text-sm text-text-muted">Choose a conversation from the left to start chatting</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-w-0">
              {/* Chat header */}
              <div className="p-4 border-b border-border-soft flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-primary/10 flex items-center justify-center">
                  <User size={14} className="text-brand-primary" />
                </div>
                <div>
                  <p className="font-semibold text-text-primary text-sm">{activeUser.user_name}</p>
                  <p className="text-xs text-text-muted capitalize">{activeUser.user_role} · {activeUser.user_email}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loadingMsgs ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-sm text-text-muted">No messages yet</div>
                ) : (
                  messages.map((msg, i) => (
                    <div key={msg.id ?? i} className={`flex ${msg.from_admin ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.from_admin
                          ? 'bg-brand-primary text-white rounded-br-sm'
                          : 'bg-surface-bg text-text-primary rounded-bl-sm'
                      }`}>
                        <p>{msg.text}</p>
                        <p className={`text-[10px] mt-1 ${msg.from_admin ? 'text-white/60' : 'text-text-muted'}`}>
                          {formatTime(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border-soft">
                <div className="flex gap-2">
                  <input type="text" value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    placeholder="Type a message… (Enter to send)"
                    className="flex-1 px-4 py-2.5 bg-surface-bg border border-border-soft rounded-xl text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 outline-none transition-all"
                  />
                  <button onClick={handleSend} disabled={!text.trim() || sending}
                    className="px-4 py-2.5 bg-brand-primary text-white rounded-xl hover:bg-brand-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm font-semibold">
                    {sending ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send size={15} />}
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
