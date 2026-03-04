import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Users, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="animate-fade-in">
            {/* Hero */}
            <div className="bg-slate-900 text-white py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4">About Toroongo</h1>
                    <p className="text-lg text-white/70 max-w-2xl mx-auto">
                        We're building the future of e-commerce — a global marketplace where every seller can shine
                        and every buyer can discover something extraordinary.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Mission */}
                <section className="mb-16 text-center">
                    <h2 className="text-2xl font-bold text-text-primary mb-4">Our Mission</h2>
                    <p className="text-text-muted leading-relaxed max-w-2xl mx-auto">
                        Toroongo empowers sellers to build their brand while giving buyers access to a curated,
                        global marketplace. We believe in creating an ecosystem where quality, trust, and creativity thrive.
                    </p>
                </section>

                {/* Values */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">What We Stand For</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {[
                            { icon: Globe, title: 'Global Reach', desc: 'Connecting sellers and buyers across borders, making commerce truly borderless.' },
                            { icon: ShieldCheck, title: 'Trust & Safety', desc: 'Buyer protection, verified sellers, and secure payments on every transaction.' },
                            { icon: Users, title: 'Community First', desc: 'Building lasting relationships between sellers and their loyal customers.' },
                            { icon: Sparkles, title: 'Innovation', desc: 'Continuously improving the shopping and selling experience with cutting-edge tools.' },
                        ].map((item) => (
                            <div key={item.title} className="p-6 border border-border-soft rounded-2xl">
                                <item.icon size={24} className="text-brand-primary mb-3" />
                                <h3 className="text-lg font-semibold text-text-primary mb-2">{item.title}</h3>
                                <p className="text-sm text-text-muted leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="text-center bg-brand-primary/5 rounded-2xl p-10 border border-brand-primary/10">
                    <h2 className="text-2xl font-bold text-text-primary mb-3">Ready to Join Us?</h2>
                    <p className="text-text-muted mb-6">Whether you're a buyer or a seller, there's a place for you on Toroongo.</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link to="/signup" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white font-semibold rounded-xl hover:bg-brand-secondary transition-colors">
                            Get Started <ArrowRight size={16} />
                        </Link>
                        <Link to="/sell" className="inline-flex items-center gap-2 px-6 py-3 border border-border-soft text-text-primary font-medium rounded-xl hover:bg-surface-bg transition-colors">
                            Start Selling
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
