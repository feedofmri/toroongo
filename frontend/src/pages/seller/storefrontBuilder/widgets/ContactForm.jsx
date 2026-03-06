import React, { useState } from 'react';
import { Send } from 'lucide-react';

/**
 * ContactForm Widget
 * Simple contact form (Name, Email, Message) with submit handling.
 */
export default function ContactForm({ title, subtitle, fields = ['name', 'email', 'message'], buttonText = 'Send Message' }) {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--seller-brand, #06B6D4) 10%, transparent)' }}>
                    <Send size={24} style={{ color: 'var(--seller-brand, #06B6D4)' }} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--seller-text, #0F172A)' }}>Message Sent!</h3>
                <p className="text-sm" style={{ color: 'var(--seller-text-muted, #64748B)' }}>We'll get back to you soon.</p>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto">
            {title && (
                <h2 className="text-xl sm:text-2xl font-bold mb-2 text-center"
                    style={{ color: 'var(--seller-text, #0F172A)', fontFamily: 'var(--seller-heading-font, inherit)' }}>
                    {title}
                </h2>
            )}
            {subtitle && (
                <p className="text-sm mb-6 text-center" style={{ color: 'var(--seller-text-muted, #64748B)' }}>
                    {subtitle}
                </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                {fields.includes('name') && (
                    <input
                        type="text"
                        placeholder="Your Name"
                        required
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
                        style={{ borderRadius: 'var(--seller-radius, 0.75rem)' }}
                    />
                )}
                {fields.includes('email') && (
                    <input
                        type="email"
                        placeholder="Your Email"
                        required
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
                        style={{ borderRadius: 'var(--seller-radius, 0.75rem)' }}
                    />
                )}
                {fields.includes('message') && (
                    <textarea
                        placeholder="Your Message"
                        rows={4}
                        required
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 resize-none"
                        style={{ borderRadius: 'var(--seller-radius, 0.75rem)' }}
                    />
                )}
                <button
                    type="submit"
                    className="w-full px-6 py-3 text-sm font-semibold text-white transition-colors hover:opacity-90"
                    style={{
                        backgroundColor: 'var(--seller-brand, #06B6D4)',
                        borderRadius: 'var(--seller-radius, 0.75rem)',
                    }}
                >
                    {buttonText}
                </button>
            </form>
        </div>
    );
}
