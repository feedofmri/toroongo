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
                        className="border border-gray-100 overflow-hidden"
                        style={{ borderRadius: 'var(--seller-widget-radius, 1rem)' }}
                    >
                        <button
                            onClick={() => setOpenIndex(openIndex === i ? null : i)}
                            className="w-full flex items-center justify-between px-6 py-4.5 text-left font-semibold transition-all duration-300 hover:bg-gray-50/80"
                            style={{ color: 'var(--seller-text, #0F172A)' }}
                        >
                            {item.question}
                            <ChevronDown
                                size={18}
                                className={`ml-4 shrink-0 transition-transform duration-300 text-gray-400 ${openIndex === i ? 'rotate-180 text-[color:var(--seller-brand,#008080)]' : ''}`}
                            />
                        </button>
                        <div
                            className="grid transition-all duration-300 ease-in-out"
                            style={{ gridTemplateRows: openIndex === i ? '1fr' : '0fr' }}
                        >
                            <div className="overflow-hidden">
                                <div className="px-6 pb-5 text-sm leading-relaxed" style={{ color: 'var(--seller-text-muted, #64748B)' }}>
                                    {item.answer}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
