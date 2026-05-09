import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../../../services/api.js';

export default function NewsletterSignup({
    heading,
    subheading,
    placeholderText,
    buttonText = 'Subscribe',
    buttonColor,
    disclaimer,
    successMessage,
    backgroundColor,
    backgroundImage,
    sellerId,
}) {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const hasBackground = backgroundImage || backgroundColor;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;
        setError('');
        setLoading(true);
        try {
            await api('/newsletter/subscribe', {
                method: 'POST',
                body: JSON.stringify({ email: email.trim(), seller_id: sellerId }),
            });
            setSubmitted(true);
        } catch (err) {
            setError(err?.response?.message || err?.message || t('widgets.newsletter.error'));
        } finally {
            setLoading(false);
        }
    };

    const outerStyle = hasBackground
        ? {
              position: 'relative',
              ...(backgroundImage
                  ? {
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }
                  : { backgroundColor }),
              padding: '4rem 2rem',
              borderRadius: 'var(--seller-widget-radius, 1rem)',
          }
        : {};

    return (
        <div style={outerStyle}>
            {backgroundImage && (
                <div
                    className="absolute inset-0 bg-black/55"
                    style={{ borderRadius: 'var(--seller-widget-radius, 1rem)' }}
                />
            )}
            <div className="relative text-center max-w-lg mx-auto">
                {heading && (
                    <h2
                        className="text-xl sm:text-3xl font-extrabold mb-2"
                        style={{
                            color: hasBackground ? '#fff' : 'var(--seller-text, #0F172A)',
                            fontFamily: 'var(--seller-heading-font, inherit)',
                        }}
                    >
                        {heading}
                    </h2>
                )}
                {subheading && (
                    <p
                        className="text-sm mb-6"
                        style={{ color: hasBackground ? 'rgba(255,255,255,0.85)' : 'var(--seller-text-muted, #64748B)' }}
                    >
                        {subheading}
                    </p>
                )}

                {submitted ? (
                    <div
                        className="py-5 px-6 rounded-xl text-sm font-semibold"
                        style={{
                            backgroundColor: 'color-mix(in srgb, var(--seller-brand, #008080) 15%, #fff)',
                            color: 'var(--seller-brand, #008080)',
                        }}
                    >
                        ✓ {successMessage || t('widgets.newsletter.success')}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setError(''); }}
                            placeholder={placeholderText || t('widgets.newsletter.emailPlaceholder')}
                            required
                            disabled={loading}
                            className="flex-1 px-4 py-3.5 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--seller-brand,#008080)] focus:border-transparent transition-all shadow-sm bg-white disabled:opacity-60"
                            style={{ borderRadius: 'var(--seller-radius, 0.75rem)' }}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-105 shadow-md active:scale-100 disabled:opacity-60 disabled:pointer-events-none"
                            style={{
                                backgroundColor: buttonColor || 'var(--seller-brand, #008080)',
                                borderRadius: 'var(--seller-radius, 0.75rem)',
                            }}
                        >
                            {loading ? t('widgets.newsletter.subscribing') : buttonText}
                        </button>
                    </form>
                )}

                {error && (
                    <p className="mt-2 text-xs font-medium text-red-500">{error}</p>
                )}

                {disclaimer && (
                    <p
                        className="mt-3 text-[11px] leading-relaxed"
                        style={{ color: hasBackground ? 'rgba(255,255,255,0.6)' : 'var(--seller-text-muted, #94a3b8)' }}
                    >
                        {disclaimer}
                    </p>
                )}
            </div>
        </div>
    );
}
