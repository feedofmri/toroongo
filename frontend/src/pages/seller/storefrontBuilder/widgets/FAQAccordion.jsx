import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * FAQAccordion Widget
 * Collapsible list of Frequently Asked Questions.
 */
export default function FAQAccordion({ title, items = [] }) {
    const [openIndex, setOpenIndex] = useState(null);

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
            <div className="max-w-2xl mx-auto space-y-3">
                {items.map((item, i) => (
                    <div
                        key={i}
                        className="border border-gray-100 rounded-xl overflow-hidden"
                        style={{ borderRadius: 'var(--seller-radius, 0.75rem)' }}
                    >
                        <button
                            onClick={() => setOpenIndex(openIndex === i ? null : i)}
                            className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium hover:bg-gray-50 transition-colors"
                            style={{ color: 'var(--seller-text, #0F172A)' }}
                        >
                            {item.question}
                            <ChevronDown
                                size={16}
                                className={`ml-2 shrink-0 transition-transform duration-200 ${openIndex === i ? 'rotate-180' : ''}`}
                            />
                        </button>
                        {openIndex === i && (
                            <div className="px-5 pb-4 text-sm leading-relaxed" style={{ color: 'var(--seller-text-muted, #64748B)' }}>
                                {item.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
