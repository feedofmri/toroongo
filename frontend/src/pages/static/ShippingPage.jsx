import React from 'react';
import { Truck, Clock, Globe, Package, MapPin, ShieldCheck } from 'lucide-react';

export default function ShippingPage() {
    return (
        <div className="animate-fade-in max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-3xl font-bold text-text-primary mb-2 text-center">Shipping & Delivery</h1>
            <p className="text-text-muted text-center mb-12">Everything you need to know about how your orders are shipped and delivered.</p>

            {/* Shipping options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
                {[
                    { icon: Truck, title: 'Standard Shipping', time: '5-7 business days', price: 'Free over $50' },
                    { icon: Clock, title: 'Express Shipping', time: '2-3 business days', price: 'From $9.99' },
                    { icon: Globe, title: 'International', time: '7-14 business days', price: 'From $14.99' },
                ].map((opt) => (
                    <div key={opt.title} className="p-6 border border-border-soft rounded-2xl text-center">
                        <opt.icon size={28} className="text-brand-primary mx-auto mb-3" />
                        <h3 className="font-semibold text-text-primary mb-1">{opt.title}</h3>
                        <p className="text-sm text-text-muted mb-1">{opt.time}</p>
                        <p className="text-xs font-semibold text-brand-primary">{opt.price}</p>
                    </div>
                ))}
            </div>

            {/* Details */}
            <div className="space-y-8">
                <section>
                    <div className="flex items-center gap-2 mb-3">
                        <Package size={18} className="text-brand-primary" />
                        <h2 className="text-lg font-semibold text-text-primary">Order Processing</h2>
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed">Orders are typically processed within 1-2 business days. You will receive a confirmation email with tracking information once your order ships. Processing times may vary during peak seasons and promotional events.</p>
                </section>

                <section>
                    <div className="flex items-center gap-2 mb-3">
                        <MapPin size={18} className="text-brand-primary" />
                        <h2 className="text-lg font-semibold text-text-primary">Tracking Your Order</h2>
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed">Once your order has shipped, you can track it in real-time through your account dashboard under "My Orders." You will also receive email and SMS notifications at each stage of delivery. All major carriers provide end-to-end tracking.</p>
                </section>

                <section>
                    <div className="flex items-center gap-2 mb-3">
                        <Globe size={18} className="text-brand-primary" />
                        <h2 className="text-lg font-semibold text-text-primary">International Shipping</h2>
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed">We ship to over 100 countries worldwide. International orders may be subject to customs duties, taxes, and fees levied by the destination country. These charges are the responsibility of the recipient. Delivery times for international orders vary by location and carrier.</p>
                </section>

                <section>
                    <div className="flex items-center gap-2 mb-3">
                        <ShieldCheck size={18} className="text-brand-primary" />
                        <h2 className="text-lg font-semibold text-text-primary">Shipping Protection</h2>
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed">All shipments are insured against loss and damage during transit. If your package arrives damaged or does not arrive at all, contact our support team within 7 days and we will arrange a replacement or full refund.</p>
                </section>
            </div>
        </div>
    );
}
