import React, { useState } from 'react';
import { MessageSquare, Send, Search, ChevronLeft } from 'lucide-react';

const MOCK_CONVERSATIONS = [
    {
        id: 1, customer: 'Sarah M.', avatar: 'S', time: '1 hour ago', unread: true,
        lastMessage: 'When will my headphones be shipped?',
        messages: [
            { from: 'customer', text: 'Hi, I ordered the WH-1000XM5 yesterday.', time: '2:00 PM' },
            { from: 'customer', text: 'When will my headphones be shipped?', time: '2:01 PM' },
        ],
    },
    {
        id: 2, customer: 'James K.', avatar: 'J', time: '3 hours ago', unread: false,
        lastMessage: 'Thank you for the quick response!',
        messages: [
            { from: 'customer', text: 'Is the desk lamp compatible with smart home?', time: '10:00 AM' },
            { from: 'seller', text: 'The lamp has a standard E26 socket. You can use any smart bulb with it.', time: '10:15 AM' },
            { from: 'customer', text: 'Thank you for the quick response!', time: '10:20 AM' },
        ],
    },
    {
        id: 3, customer: 'Emily R.', avatar: 'E', time: '1 day ago', unread: false,
        lastMessage: 'Order received, everything looks great!',
        messages: [
            { from: 'customer', text: 'Got my package today.', time: '4:00 PM' },
            { from: 'customer', text: 'Order received, everything looks great!', time: '4:01 PM' },
            { from: 'seller', text: 'Glad to hear that! Thank you for shopping with us.', time: '4:30 PM' },
        ],
    },
];

export default function SellerMessages() {
    const [activeConvo, setActiveConvo] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const selectedConvo = MOCK_CONVERSATIONS.find((c) => c.id === activeConvo);

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Messages</h2>

            <div className="bg-white border border-border-soft rounded-2xl overflow-hidden" style={{ height: '500px' }}>
                <div className="flex h-full">
                    {/* Conversation List */}
                    <div className={`${activeConvo ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-72 border-r border-border-soft`}>
                        <div className="p-3 border-b border-border-soft">
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                                <input type="text" placeholder="Search..." className="w-full pl-9 pr-3 py-2 text-sm bg-surface-bg border border-border-soft rounded-lg focus:border-brand-primary outline-none" />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {MOCK_CONVERSATIONS.map((convo) => (
                                <button
                                    key={convo.id}
                                    onClick={() => setActiveConvo(convo.id)}
                                    className={`w-full text-left p-3 flex gap-3 border-b border-border-soft transition-colors
                    ${activeConvo === convo.id ? 'bg-brand-primary/5' : 'hover:bg-surface-bg'}`}
                                >
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold
                    ${convo.unread ? 'bg-brand-primary text-white' : 'bg-surface-bg text-text-muted border border-border-soft'}`}>
                                        {convo.avatar}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span className={`text-sm ${convo.unread ? 'font-bold' : 'font-medium'} text-text-primary`}>{convo.customer}</span>
                                            <span className="text-[10px] text-text-muted">{convo.time}</span>
                                        </div>
                                        <p className="text-xs text-text-muted line-clamp-1 mt-0.5">{convo.lastMessage}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className={`${activeConvo ? 'flex' : 'hidden md:flex'} flex-col flex-1`}>
                        {selectedConvo ? (
                            <>
                                <div className="px-4 py-3 border-b border-border-soft flex items-center gap-3">
                                    <button onClick={() => setActiveConvo(null)} className="md:hidden p-1 text-text-muted"><ChevronLeft size={18} /></button>
                                    <div className="w-8 h-8 bg-brand-primary/10 rounded-full flex items-center justify-center">
                                        <span className="text-xs font-bold text-brand-primary">{selectedConvo.avatar}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-text-primary">{selectedConvo.customer}</span>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {selectedConvo.messages.map((msg, idx) => (
                                        <div key={idx} className={`flex ${msg.from === 'seller' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm
                        ${msg.from === 'seller' ? 'bg-brand-primary text-white rounded-br-none' : 'bg-surface-bg text-text-primary border border-border-soft rounded-bl-none'}`}>
                                                <p>{msg.text}</p>
                                                <p className={`text-[10px] mt-1 ${msg.from === 'seller' ? 'text-white/60' : 'text-text-muted'}`}>{msg.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-3 border-t border-border-soft">
                                    <div className="flex gap-2">
                                        <input type="text" placeholder="Type a reply..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                                            className="flex-1 px-4 py-2.5 text-sm bg-surface-bg border border-border-soft rounded-xl focus:border-brand-primary outline-none" />
                                        <button className="p-2.5 bg-brand-primary text-white rounded-xl hover:bg-brand-secondary transition-colors"><Send size={16} /></button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                                <MessageSquare size={40} className="text-text-muted/30 mb-4" />
                                <p className="text-text-primary font-medium">Select a conversation</p>
                                <p className="text-sm text-text-muted">Choose a customer message to reply.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
