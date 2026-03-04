import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, HelpCircle } from 'lucide-react';

const INCLUDED = [
    'Unlimited product listings',
    'Customizable storefront',
    'Built-in analytics dashboard',
    'Order & inventory management',
    'Customer messaging system',
    'Weekly payouts',
    'Seller support (email + chat)',
    'Marketing tools & promotions',
];

const FAQS = [
    { q: 'When do I get paid?', a: 'Payouts are processed weekly, every Friday. Funds typically arrive in your bank account within 2-3 business days.' },
    { q: 'Are there any hidden fees?', a: 'No. The 10% commission is the only fee. There are no listing fees, monthly fees, or setup charges.' },
    { q: 'What payment methods do you support?', a: 'We process payments via Visa, Mastercard, PayPal, Apple Pay, and Google Pay. All payments are handled securely by our payment partners.' },
    { q: 'Can I change my plan later?', a: 'Our standard plan covers everything you need. As we introduce premium features, you will be notified with upgrade options.' },
];

export default function PricingPage() {
    return (
        <div className="animate-fade-in">
            <div className="bg-surface-bg border-b border-border-soft py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl font-bold text-text-primary mb-2">Pricing & Fees</h1>
                    <p className="text-text-muted">Simple, transparent pricing. No surprises.</p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Pricing Card */}
                <div className="bg-white border-2 border-brand-primary rounded-2xl p-8 text-center mb-12">
                    <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">Standard Plan</span>
                    <div className="mt-4 mb-2">
                        <span className="text-5xl font-bold text-text-primary">10%</span>
                        <span className="text-xl text-text-muted ml-1">per sale</span>
                    </div>
                    <p className="text-sm text-text-muted mb-6">No monthly fees. No listing fees. Pay only when you sell.</p>

                    <ul className="max-w-sm mx-auto space-y-2.5 text-left mb-8">
                        {INCLUDED.map((item) => (
                            <li key={item} className="flex items-center gap-2.5 text-sm text-text-muted">
                                <CheckCircle size={15} className="text-green-500 flex-shrink-0" /> {item}
                            </li>
                        ))}
                    </ul>

                    <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-3 bg-brand-primary text-white font-semibold rounded-xl hover:bg-brand-secondary transition-colors">
                        Start Selling Free <ArrowRight size={16} />
                    </Link>
                </div>

                {/* FAQs */}
                <h2 className="text-xl font-bold text-text-primary mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {FAQS.map((faq, idx) => (
                        <div key={idx} className="p-5 border border-border-soft rounded-xl">
                            <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-1.5">
                                <HelpCircle size={14} className="text-brand-primary flex-shrink-0" /> {faq.q}
                            </h3>
                            <p className="text-sm text-text-muted leading-relaxed pl-6">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
