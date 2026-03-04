import React from 'react';
import { RotateCcw, CheckCircle, AlertCircle, Clock, Package, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const STEPS = [
    { step: '01', title: 'Initiate Return', desc: 'Go to My Orders in your account and select the item you want to return.' },
    { step: '02', title: 'Pack & Ship', desc: 'Repackage the item securely and ship it using the provided return label.' },
    { step: '03', title: 'Get Refunded', desc: 'Once inspected, your refund will be processed within 3-5 business days.' },
];

export default function ReturnsPage() {
    return (
        <div className="animate-fade-in max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-3xl font-bold text-text-primary mb-2 text-center">Returns & Refunds</h1>
            <p className="text-text-muted text-center mb-12">We want you to love every purchase. If something is not right, we make returns easy.</p>

            {/* Policy highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
                {[
                    { icon: RotateCcw, title: '30-Day Returns', desc: 'Return most items within 30 days of delivery.' },
                    { icon: CheckCircle, title: 'Free Return Shipping', desc: 'We cover return shipping on eligible items.' },
                    { icon: Clock, title: 'Fast Refunds', desc: 'Refunds processed within 3-5 business days.' },
                ].map((item) => (
                    <div key={item.title} className="p-6 border border-border-soft rounded-2xl text-center">
                        <item.icon size={28} className="text-brand-primary mx-auto mb-3" />
                        <h3 className="font-semibold text-text-primary mb-1">{item.title}</h3>
                        <p className="text-xs text-text-muted">{item.desc}</p>
                    </div>
                ))}
            </div>

            {/* How it works */}
            <h2 className="text-xl font-bold text-text-primary mb-6 text-center">How Returns Work</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                {STEPS.map((s) => (
                    <div key={s.step} className="text-center">
                        <div className="w-12 h-12 bg-brand-primary text-white font-bold text-lg rounded-2xl flex items-center justify-center mx-auto mb-3">{s.step}</div>
                        <h3 className="font-semibold text-text-primary text-sm mb-1">{s.title}</h3>
                        <p className="text-xs text-text-muted">{s.desc}</p>
                    </div>
                ))}
            </div>

            {/* Eligibility */}
            <div className="bg-white border border-border-soft rounded-2xl p-6 mb-8">
                <h2 className="text-lg font-semibold text-text-primary mb-4">Return Eligibility</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <h4 className="flex items-center gap-1.5 text-sm font-semibold text-green-600 mb-2"><CheckCircle size={14} /> Eligible for Return</h4>
                        <ul className="space-y-1.5 text-sm text-text-muted">
                            <li>- Unused items in original packaging</li>
                            <li>- Defective or damaged products</li>
                            <li>- Wrong item received</li>
                            <li>- Item significantly not as described</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="flex items-center gap-1.5 text-sm font-semibold text-red-500 mb-2"><AlertCircle size={14} /> Not Eligible</h4>
                        <ul className="space-y-1.5 text-sm text-text-muted">
                            <li>- Personalized or custom-made items</li>
                            <li>- Perishable goods</li>
                            <li>- Digital downloads</li>
                            <li>- Items returned after 30 days</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="text-center bg-surface-bg rounded-2xl p-8 border border-border-soft">
                <Package size={28} className="text-brand-primary mx-auto mb-3" />
                <h3 className="text-lg font-bold text-text-primary mb-2">Need to Return Something?</h3>
                <p className="text-sm text-text-muted mb-4">Start a return from your order history page or contact our support team.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to="/account" className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors">
                        My Orders <ArrowRight size={14} />
                    </Link>
                    <Link to="/help" className="inline-flex items-center gap-2 px-5 py-2.5 border border-border-soft text-text-primary text-sm font-medium rounded-xl hover:bg-surface-bg transition-colors">
                        Get Help
                    </Link>
                </div>
            </div>
        </div>
    );
}
