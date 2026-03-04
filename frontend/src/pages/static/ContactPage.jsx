import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
    const inputClass = `w-full px-4 py-3 text-sm bg-white border border-border-soft rounded-xl
    focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors`;

    return (
        <div className="animate-fade-in max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-3xl font-bold text-text-primary mb-3 text-center">Contact Us</h1>
            <p className="text-text-muted text-center mb-12">Have a question? We'd love to hear from you.</p>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                {/* Contact info */}
                <div className="lg:col-span-2 space-y-6">
                    {[
                        { icon: Mail, label: 'Email', value: 'support@toroongo.com' },
                        { icon: Phone, label: 'Phone', value: '+1 (800) 123-4567' },
                        { icon: MapPin, label: 'Address', value: '100 Market St, Suite 400\nSan Francisco, CA 94105' },
                    ].map((item) => (
                        <div key={item.label} className="flex gap-4">
                            <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                <item.icon size={18} className="text-brand-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-text-primary">{item.label}</p>
                                <p className="text-sm text-text-muted whitespace-pre-line">{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact form */}
                <form onSubmit={(e) => e.preventDefault()} className="lg:col-span-3 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input type="text" placeholder="First name" className={inputClass} />
                        <input type="text" placeholder="Last name" className={inputClass} />
                    </div>
                    <input type="email" placeholder="Email address" className={inputClass} />
                    <input type="text" placeholder="Subject" className={inputClass} />
                    <textarea rows={5} placeholder="Your message..." className={`${inputClass} resize-none`} />
                    <button type="submit" className="px-6 py-3 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors">
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
}
