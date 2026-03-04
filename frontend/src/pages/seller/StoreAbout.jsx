import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Calendar, Package, Star, MapPin } from 'lucide-react';

export default function StoreAbout() {
    const { seller, sellerProducts } = useOutletContext();

    return (
        <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-text-primary mb-6">About {seller.name}</h2>

            <p className="text-text-muted leading-relaxed mb-8">
                {seller.description} We are committed to providing our customers with the highest quality products
                and exceptional service. Our team carefully curates every item in our catalog to ensure it meets
                our rigorous standards of quality, design, and value. Whether you're a first-time shopper or a
                loyal customer, we strive to make every experience with us memorable.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                {[
                    { icon: Star, label: 'Rating', value: seller.rating },
                    { icon: Package, label: 'Products', value: sellerProducts.length },
                    { icon: Calendar, label: 'Member Since', value: new Date(seller.joinedDate).getFullYear() },
                    { icon: MapPin, label: 'Location', value: 'United States' },
                ].map((stat) => (
                    <div key={stat.label} className="p-4 bg-surface-bg rounded-xl text-center border border-border-soft">
                        <stat.icon size={20} className="mx-auto mb-2" style={{ color: 'var(--seller-brand)' }} />
                        <p className="text-lg font-bold text-text-primary">{stat.value}</p>
                        <p className="text-xs text-text-muted">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Why shop with us */}
            <h3 className="text-lg font-semibold text-text-primary mb-4">Why Shop With Us</h3>
            <div className="space-y-4 mb-8">
                {[
                    { title: 'Quality Guaranteed', desc: 'Every product undergoes rigorous quality checks before reaching you.' },
                    { title: 'Fast & Reliable Shipping', desc: 'We partner with trusted carriers to get your order to you quickly.' },
                    { title: 'Exceptional Support', desc: 'Our dedicated team is always ready to help with any questions or concerns.' },
                    { title: 'Easy Returns', desc: 'Not satisfied? Return any product within 30 days for a full refund.' },
                ].map((item) => (
                    <div key={item.title} className="flex gap-3 p-4 border border-border-soft rounded-xl">
                        <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--seller-brand)' }} />
                        <div>
                            <p className="text-sm font-medium text-text-primary">{item.title}</p>
                            <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
