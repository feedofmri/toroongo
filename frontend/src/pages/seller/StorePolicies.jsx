import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Truck, RotateCcw, HelpCircle, ShieldCheck } from 'lucide-react';

const POLICIES = [
    {
        icon: Truck,
        title: 'Shipping Policy',
        content: [
            'Processing time: 1-3 business days',
            'Standard Shipping: 5-7 business days',
            'Express Shipping: 2-3 business days',
            'Free standard shipping on orders over $50',
            'We ship to all 50 US states and select international destinations',
            'Tracking information will be provided via email once your order ships',
        ],
    },
    {
        icon: RotateCcw,
        title: 'Return & Refund Policy',
        content: [
            'Items can be returned within 30 days of delivery',
            'Products must be unused, unworn, and in original packaging',
            'Refunds are processed within 5-7 business days after receiving the return',
            'Return shipping costs are the responsibility of the buyer unless the item is defective',
            'Sale items are eligible for store credit only',
        ],
    },
    {
        icon: ShieldCheck,
        title: 'Warranty',
        content: [
            'All products come with a standard manufacturer warranty',
            'Warranty period varies by product category',
            'Defective items can be replaced free of charge within the warranty period',
            'Contact us with your order number for warranty claims',
        ],
    },
    {
        icon: HelpCircle,
        title: 'FAQ',
        content: [
            'Q: How do I track my order? — A: Once shipped, you will receive an email with tracking info.',
            'Q: Can I cancel my order? — A: Orders can be cancelled within 24 hours of placement.',
            'Q: Do you offer gift wrapping? — A: Yes! Select the gift wrap option during checkout.',
            'Q: How do I contact support? — A: Use the message feature on Toroongo to reach us directly.',
        ],
    },
];

export default function StorePolicies() {
    const { seller } = useOutletContext();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-3xl">
                <h2 className="text-2xl font-bold text-text-primary mb-6">Store Policies</h2>
                <p className="text-text-muted text-sm mb-8">
                    {seller.name}'s policies for shipping, returns, warranty, and frequently asked questions.
                </p>

                <div className="space-y-6">
                    {POLICIES.map((policy) => (
                        <div key={policy.title} className="border border-border-soft rounded-2xl overflow-hidden">
                            <div className="px-5 py-4 bg-surface-bg border-b border-border-soft flex items-center gap-3">
                                <policy.icon size={18} style={{ color: 'var(--seller-brand)' }} />
                                <h3 className="font-semibold text-text-primary">{policy.title}</h3>
                            </div>
                            <div className="p-5">
                                <ul className="space-y-2.5">
                                    {policy.content.map((item, idx) => (
                                        <li key={idx} className="flex gap-2.5 text-sm text-text-muted">
                                            <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: 'var(--seller-brand)' }} />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
