import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { api } from '../../../../services/api.js';

export default function ContactForm({
    title,
    subtitle,
    fields = ['name', 'email', 'message'],
    buttonText = 'Send Message',
    showPhone = false,
    showSubject = false,
    successMessage,
    backgroundColor,
    sellerId,
}) {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({});

    const set = (key, val) => setFormData((prev) => ({ ...prev, [key]: val }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api('/contact', {
                method: 'POST',
                body: JSON.stringify({ ...formData, seller_id: sellerId }),
            });
            setSubmitted(true);
        } catch (err) {
            setError(err?.response?.message || err?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        'w-full px-4 py-3.5 border border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[color:var(--seller-brand,#008080)] focus:border-transparent transition-all shadow-sm disabled:opacity-60';

    const wrapperStyle = backgroundColor
        ? {
              backgroundColor,
              padding: '2.5rem 2rem',
              borderRadius: 'var(--seller-widget-radius, 1rem)',
          }
        : {};

    if (submitted) {
        return (
            <div className="text-center py-10" style={wrapperStyle}>
                <div
                    className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--seller-brand, #008080) 12%, transparent)' }}
                >
                    <Send size={24} style={{ color: 'var(--seller-brand, #008080)' }} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--seller-text, #0F172A)' }}>
                    {successMessage ? successMessage.split('.')[0] : 'Message Sent!'}
                </h3>
                <p className="text-sm" style={{ color: 'var(--seller-text-muted, #64748B)' }}>
                    {successMessage || "We'll get back to you soon."}
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto" style={wrapperStyle}>
            {title && (
                <h2
                    className="text-xl sm:text-2xl font-bold mb-2 text-center"
                    style={{ color: 'var(--seller-text, #0F172A)', fontFamily: 'var(--seller-heading-font, inherit)' }}
                >
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
                        disabled={loading}
                        onChange={(e) => set('name', e.target.value)}
                        className={inputClass}
                        style={{ borderRadius: 'var(--seller-radius, 0.75rem)' }}
                    />
                )}
                {fields.includes('email') && (
                    <input
                        type="email"
                        placeholder="Your Email"
                        required
                        disabled={loading}
                        onChange={(e) => set('email', e.target.value)}
                        className={inputClass}
                        style={{ borderRadius: 'var(--seller-radius, 0.75rem)' }}
                    />
                )}
                {showPhone && (
                    <input
                        type="tel"
                        placeholder="Your Phone (optional)"
                        disabled={loading}
                        onChange={(e) => set('phone', e.target.value)}
                        className={inputClass}
                        style={{ borderRadius: 'var(--seller-radius, 0.75rem)' }}
                    />
                )}
                {showSubject && (
                    <input
                        type="text"
                        placeholder="Subject"
                        disabled={loading}
                        onChange={(e) => set('subject', e.target.value)}
                        className={inputClass}
                        style={{ borderRadius: 'var(--seller-radius, 0.75rem)' }}
                    />
                )}
                {fields.includes('message') && (
                    <textarea
                        placeholder="Your Message..."
                        rows={5}
                        required
                        disabled={loading}
                        onChange={(e) => set('message', e.target.value)}
                        className={`${inputClass} resize-none`}
                        style={{ borderRadius: 'var(--seller-radius, 0.75rem)' }}
                    />
                )}

                {error && (
                    <p className="text-xs font-medium text-red-500">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3.5 mt-1 text-sm font-bold text-white transition-all duration-300 hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:pointer-events-none"
                    style={{
                        backgroundColor: 'var(--seller-brand, #008080)',
                        borderRadius: 'var(--seller-radius, 0.75rem)',
                        boxShadow: '0 4px 14px 0 color-mix(in srgb, var(--seller-brand, #008080) 35%, transparent)',
                    }}
                >
                    {loading ? 'Sending…' : buttonText}
                </button>
            </form>
        </div>
    );
}
