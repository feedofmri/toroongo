import React, { useState } from 'react';

/**
 * NewsletterSignup Widget
 * Email capture form with optional discount messaging.
 */
export default function NewsletterSignup({ heading, subheading, placeholderText, buttonText = 'Subscribe', buttonColor }) {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email.trim()) setSubmitted(true);
    };

    return (
        <div className="text-center max-w-lg mx-auto">
            {heading && (
                <h2
                    className="text-xl sm:text-2xl font-bold mb-2"
                    style={{ color: 'var(--seller-text, #0F172A)', fontFamily: 'var(--seller-heading-font, inherit)' }}
                >
                    {heading}
                </h2>
            )}
            {subheading && (
                <p className="text-sm mb-6" style={{ color: 'var(--seller-text-muted, #64748B)' }}>
                    {subheading}
                </p>
            )}
            {submitted ? (
                <div className="py-4 px-6 bg-green-50 text-green-700 rounded-xl text-sm font-medium">
                    ✓ Thanks for subscribing!
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={placeholderText || 'Enter your email'}
                        required
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
                        style={{
                            borderRadius: 'var(--seller-radius, 0.75rem)',
                            focusRingColor: 'var(--seller-brand)',
                        }}
                    />
                    <button
                        type="submit"
                        className="px-6 py-3 text-sm font-semibold text-white rounded-xl transition-colors hover:opacity-90"
                        style={{
                            backgroundColor: buttonColor || 'var(--seller-brand, #06B6D4)',
                            borderRadius: 'var(--seller-radius, 0.75rem)',
                        }}
                    >
                        {buttonText}
                    </button>
                </form>
            )}
        </div>
    );
}
