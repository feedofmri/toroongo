import React, { useState } from 'react';
import { MessageSquare, Send, Search, ChevronLeft } from 'lucide-react';

const MOCK_CONVERSATIONS = [
    {
        id: 1,
        seller: 'Sony Electronics',
        avatar: 'S',
        lastMessage: 'Your order has been shipped! Here is the tracking number...',
        time: '2 hours ago',
        unread: true,
        messages: [
            { from: 'buyer', text: 'Hi, when will my order be shipped?', time: '10:00 AM' },
            { from: 'seller', text: 'Hello! Your order is being processed and will ship within 24 hours.', time: '10:15 AM' },
            { from: 'buyer', text: 'Thank you for the update!', time: '10:20 AM' },
            { from: 'seller', text: 'Your order has been shipped! Here is the tracking number: TRK-9284756. You can track it on our website.', time: '2:00 PM' },
        ],
    },
    {
        id: 2,
        seller: 'NaturGlow',
        avatar: 'N',
        lastMessage: 'Thank you for your purchase! Feel free to reach out if you have any questions.',
        time: '1 day ago',
        unread: false,
        messages: [
            { from: 'buyer', text: 'Is the Vitamin C serum suitable for sensitive skin?', time: '9:00 AM' },
            { from: 'seller', text: 'Yes! Our serum is formulated with gentle, organic ingredients safe for all skin types, including sensitive skin.', time: '9:30 AM' },
            { from: 'buyer', text: 'Great, I just placed an order!', time: '9:45 AM' },
            { from: 'seller', text: 'Thank you for your purchase! Feel free to reach out if you have any questions.', time: '10:00 AM' },
        ],
    },
    {
        id: 3,
        seller: 'TechVault',
        avatar: 'T',
        lastMessage: 'We have the black and silver variants in stock.',
        time: '3 days ago',
        unread: false,
        messages: [
            { from: 'buyer', text: 'Do you have the Keychron Q1 in black?', time: '3:00 PM' },
            { from: 'seller', text: 'We have the black and silver variants in stock.', time: '3:20 PM' },
        ],
    },
];

export default function MessageCenter() {
    const [activeConvo, setActiveConvo] = useState(null);
    const [newMessage, setNewMessage] = useState('');

    const selectedConvo = MOCK_CONVERSATIONS.find((c) => c.id === activeConvo);

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
                            {MOCK_CONVERSATIONS.map((convo) => (
                                <button
                                    key={convo.id}
                                    onClick={() => setActiveConvo(convo.id)}
                                    className={`w-full text-left p-4 flex gap-3 border-b border-border-soft transition-colors
                    ${activeConvo === convo.id ? 'bg-brand-primary/5' : 'hover:bg-surface-bg'}`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold
                    ${convo.unread ? 'bg-brand-primary text-white' : 'bg-surface-bg text-text-muted border border-border-soft'}`}>
                                        {convo.avatar}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span className={`text-sm ${convo.unread ? 'font-bold text-text-primary' : 'font-medium text-text-primary'}`}>
                                                {convo.seller}
                                            </span>
                                            <span className="text-[10px] text-text-muted flex-shrink-0">{convo.time}</span>
                                        </div>
                                        <p className={`text-xs mt-0.5 line-clamp-1 ${convo.unread ? 'text-text-primary font-medium' : 'text-text-muted'}`}>
                                            {convo.lastMessage}
                                        </p>
                                    </div>
                                    {convo.unread && (
                                        <div className="w-2.5 h-2.5 bg-brand-primary rounded-full flex-shrink-0 mt-1" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className={`${activeConvo ? 'flex' : 'hidden md:flex'} flex-col flex-1`}>
                        {selectedConvo ? (
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
                                        <span className="text-xs font-bold text-brand-primary">{selectedConvo.avatar}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-text-primary">{selectedConvo.seller}</span>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {selectedConvo.messages.map((msg, idx) => (
                                        <div key={idx} className={`flex ${msg.from === 'buyer' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm
                        ${msg.from === 'buyer'
                                                    ? 'bg-brand-primary text-white rounded-br-none'
                                                    : 'bg-surface-bg text-text-primary border border-border-soft rounded-bl-none'
                                                }`}>
                                                <p>{msg.text}</p>
                                                <p className={`text-[10px] mt-1 ${msg.from === 'buyer' ? 'text-white/60' : 'text-text-muted'}`}>
                                                    {msg.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Input */}
                                <div className="p-3 border-t border-border-soft">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Type a message..."
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            className="flex-1 px-4 py-2.5 text-sm bg-surface-bg border border-border-soft rounded-xl
                               focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                                        />
                                        <button className="p-2.5 bg-brand-primary text-white rounded-xl hover:bg-brand-secondary transition-colors">
                                            <Send size={16} />
                                        </button>
                                    </div>
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
