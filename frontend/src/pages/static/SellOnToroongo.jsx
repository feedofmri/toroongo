import React from 'react';
import { Link } from 'react-router-dom';
import { Store, TrendingUp, Globe, Zap, ArrowRight, CheckCircle } from 'lucide-react';

export default function SellOnToroongo() {
    return (
        <div className="animate-fade-in">
            {/* Hero */}
            <div className="bg-gradient-to-br from-brand-primary to-brand-secondary text-white py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4">Sell on Toroongo</h1>
                    <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">
                        Launch your online store in minutes. Reach millions of buyers with your own customizable storefront.
                    </p>
                    <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-text-primary font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                        Start Selling Free <ArrowRight size={16} />
                    </Link>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
                    {[
                        { icon: Store, title: 'Your Own Storefront', desc: 'Customize your shop with your brand colors, logo, and banner. Like having your own website.' },
                        { icon: TrendingUp, title: 'Powerful Analytics', desc: 'Track sales, revenue, and customer insights with your seller dashboard.' },
                        { icon: Globe, title: 'Global Audience', desc: 'Access millions of buyers from around the world through the Toroongo marketplace.' },
                        { icon: Zap, title: 'Easy Management', desc: 'List products, manage orders, and handle messages — all from one place.' },
                    ].map((item) => (
                        <div key={item.title} className="p-6 border border-border-soft rounded-2xl">
                            <item.icon size={24} className="text-brand-primary mb-3" />
                            <h3 className="text-lg font-semibold text-text-primary mb-2">{item.title}</h3>
                            <p className="text-sm text-text-muted leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* How it works */}
                <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">How It Works</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
                    {[
                        { step: '01', title: 'Sign Up', desc: 'Create your seller account in under 2 minutes.' },
                        { step: '02', title: 'List Products', desc: 'Add your products, set prices, and upload images.' },
                        { step: '03', title: 'Start Selling', desc: 'Your store goes live and orders start coming in.' },
                    ].map((item) => (
                        <div key={item.step} className="text-center">
                            <div className="w-12 h-12 bg-brand-primary text-white font-bold text-lg rounded-2xl flex items-center justify-center mx-auto mb-4">{item.step}</div>
                            <h3 className="font-semibold text-text-primary mb-1">{item.title}</h3>
                            <p className="text-sm text-text-muted">{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Pricing */}
                <div className="bg-surface-bg rounded-2xl p-8 border border-border-soft text-center">
                    <h2 className="text-2xl font-bold text-text-primary mb-2">Simple, Transparent Pricing</h2>
                    <p className="text-text-muted text-sm mb-6">No monthly fees. Just a 10% commission on each sale.</p>
                    <ul className="max-w-sm mx-auto space-y-2 mb-6 text-left">
                        {['No setup fees', 'No monthly subscription', 'Free storefront customization', 'Payments processed weekly', '24/7 seller support'].map((item) => (
                            <li key={item} className="flex items-center gap-2 text-sm text-text-muted">
                                <CheckCircle size={14} className="text-green-500 flex-shrink-0" /> {item}
                            </li>
                        ))}
                    </ul>
                    <Link to="/signup" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white font-semibold rounded-xl hover:bg-brand-secondary transition-colors">
                        Create Seller Account <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
