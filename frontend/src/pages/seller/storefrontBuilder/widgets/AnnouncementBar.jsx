import React, { useState } from 'react';
import { X } from 'lucide-react';

/**
 * AnnouncementBar Widget
 * Promotional banner with optional scrolling marquee, emoji, and inline link.
 */
export default function AnnouncementBar({
    text,
    emoji,
    linkText,
    linkUrl,
    backgroundColor,
    textColor = '#FFFFFF',
    scrolling = false,
    dismissible = true,
}) {
    const [dismissed, setDismissed] = useState(false);
    if (dismissed) return null;

    const content = (
        <span className="inline-flex items-center gap-2">
            {emoji && <span aria-hidden="true">{emoji}</span>}
            <span>{text}</span>
            {linkUrl && linkText && (
                <a
                    href={linkUrl}
                    className="underline underline-offset-2 font-bold opacity-90 hover:opacity-100 transition-opacity ml-1"
                    style={{ color: textColor }}
                >
                    {linkText} →
                </a>
            )}
        </span>
    );

    return (
        <div
            className="w-full py-3 text-sm font-medium relative overflow-hidden"
            style={{
                backgroundColor: backgroundColor || 'var(--seller-brand, #008080)',
                color: textColor,
            }}
        >
            {scrolling ? (
                <>
                    <style>{`@keyframes _announcementScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
                    <div className="overflow-hidden">
                        <div
                            style={{
                                display: 'inline-flex',
                                animation: '_announcementScroll 28s linear infinite',
                                whiteSpace: 'nowrap',
                                gap: '6rem',
                            }}
                        >
                            {content}
                            {content}
                            {content}
                            {content}
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-center px-8">{content}</div>
            )}

            {dismissible && (
                <button
                    onClick={() => setDismissed(true)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity p-1 rounded"
                    aria-label="Dismiss"
                >
                    <X size={14} />
                </button>
            )}
        </div>
    );
}
