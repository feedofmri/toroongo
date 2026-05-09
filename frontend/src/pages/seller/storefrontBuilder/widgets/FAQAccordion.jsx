import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * FAQAccordion Widget
 * Collapsible FAQ with bordered, minimal, or filled styles and optional multi-open.
 */
export default function FAQAccordion({
    title,
    items = [],
    allowMultipleOpen = false,
    style: faqStyle = 'bordered',
}) {
    const [openIndexes, setOpenIndexes] = useState([]);

    const toggle = (i) => {
        if (allowMultipleOpen) {
            setOpenIndexes((prev) =>
                prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
            );
        } else {
            setOpenIndexes((prev) => (prev.includes(i) ? [] : [i]));
        }
    };

    const isOpen = (i) => openIndexes.includes(i);

    const itemClass = {
        bordered: 'border border-gray-100 overflow-hidden',
        minimal: 'border-b border-gray-100 last:border-b-0',
        filled: 'bg-gray-50/80 overflow-hidden',
    }[faqStyle] || 'border border-gray-100 overflow-hidden';

    const itemRadius =
        faqStyle !== 'minimal'
            ? { borderRadius: 'var(--seller-widget-radius, 1rem)' }
            : {};

    const buttonHover =
        faqStyle === 'filled' ? 'hover:bg-gray-100/80' : 'hover:bg-gray-50';

    return (
        <div>
            {title && (
                <h2
                    className="text-xl sm:text-2xl font-bold mb-6 text-center"
                    style={{ color: 'var(--seller-text, #0F172A)', fontFamily: 'var(--seller-heading-font, inherit)' }}
                >
                    {title}
                </h2>
            )}
            <div className="max-w-2xl mx-auto space-y-2.5">
                {items.map((item, i) => (
                    <div key={i} className={itemClass} style={itemRadius}>
                        <button
                            onClick={() => toggle(i)}
                            className={`w-full flex items-center justify-between px-6 py-4 text-left font-semibold transition-colors ${buttonHover}`}
                            style={{ color: 'var(--seller-text, #0F172A)' }}
                        >
                            <span className="pr-4 leading-snug">{item.question}</span>
                            <ChevronDown
                                size={18}
                                className={`shrink-0 transition-transform duration-300 text-gray-400 ${
                                    isOpen(i) ? 'rotate-180 !text-[color:var(--seller-brand,#008080)]' : ''
                                }`}
                            />
                        </button>
                        <div
                            className="grid transition-all duration-300 ease-in-out"
                            style={{ gridTemplateRows: isOpen(i) ? '1fr' : '0fr' }}
                        >
                            <div className="overflow-hidden">
                                <div
                                    className="px-6 pb-5 pt-1 text-sm leading-relaxed"
                                    style={{ color: 'var(--seller-text-muted, #64748B)' }}
                                >
                                    {item.answer}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {items.length === 0 && (
                    <p className="text-center text-sm text-gray-400 py-8">
                        No questions yet — add some in the editor.
                    </p>
                )}
            </div>
        </div>
    );
}
