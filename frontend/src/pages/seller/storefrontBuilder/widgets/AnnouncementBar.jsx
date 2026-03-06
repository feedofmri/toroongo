import React from 'react';
import { X } from 'lucide-react';

/**
 * AnnouncementBar Widget
 * Thin bar at top of page for promotions. Uses brand color by default.
 */
export default function AnnouncementBar({ text, backgroundColor, textColor = '#FFFFFF', dismissible = true }) {
    const [dismissed, setDismissed] = React.useState(false);
    if (dismissed) return null;

    return (
        <div
            className="w-full py-2.5 px-4 text-center text-sm font-medium relative"
            style={{
                backgroundColor: backgroundColor || 'var(--seller-brand, #008080)',
                color: textColor,
            }}
        >
            <span>{text}</span>
            {dismissible && (
                <button
                    onClick={() => setDismissed(true)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity"
                    aria-label="Dismiss"
                >
                    <X size={14} />
                </button>
            )}
        </div>
    );
}
