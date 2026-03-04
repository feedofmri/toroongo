import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Video, FileText, MessageSquare, TrendingUp, Camera, Package, BarChart3, ArrowRight } from 'lucide-react';

const GUIDES = [
    { icon: BookOpen, title: 'Getting Started Guide', desc: 'Everything you need to set up your store and make your first sale.', tag: 'Beginner' },
    { icon: Camera, title: 'Product Photography', desc: 'Tips and techniques for taking professional product photos.', tag: 'Marketing' },
    { icon: TrendingUp, title: 'SEO for Sellers', desc: 'Optimize your listings to rank higher in search results.', tag: 'Marketing' },
    { icon: Package, title: 'Shipping Best Practices', desc: 'How to pack, ship, and track orders efficiently.', tag: 'Operations' },
    { icon: BarChart3, title: 'Understanding Analytics', desc: 'Use your dashboard data to grow your business.', tag: 'Analytics' },
    { icon: FileText, title: 'Writing Product Descriptions', desc: 'Craft compelling descriptions that convert browsers to buyers.', tag: 'Content' },
];

const RESOURCES = [
    { icon: Video, title: 'Video Tutorials', desc: 'Step-by-step video guides for every feature.', cta: 'Watch Now' },
    { icon: MessageSquare, title: 'Seller Community', desc: 'Connect with other sellers, share tips, and ask questions.', cta: 'Join Forum' },
    { icon: FileText, title: 'Help Documentation', desc: 'Detailed docs covering every aspect of selling on Toroongo.', cta: 'Read Docs' },
];

export default function SellerResources() {
    return (
        <div className="animate-fade-in">
            <div className="bg-gradient-to-br from-brand-primary to-brand-secondary text-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-3">Seller Resources</h1>
                    <p className="text-white/80 max-w-lg mx-auto">Guides, tutorials, and tools to help you succeed on Toroongo.</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Guides */}
                <h2 className="text-xl font-bold text-text-primary mb-6">Seller Guides</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                    {GUIDES.map((guide) => (
                        <div key={guide.title} className="p-5 bg-white border border-border-soft rounded-2xl hover:border-brand-primary/20 transition-colors group cursor-pointer">
                            <div className="flex items-center justify-between mb-3">
                                <guide.icon size={22} className="text-brand-primary" />
                                <span className="text-[10px] font-bold uppercase text-text-muted bg-surface-bg px-2 py-0.5 rounded-md">{guide.tag}</span>
                            </div>
                            <h3 className="font-semibold text-text-primary text-sm mb-1 group-hover:text-brand-primary transition-colors">{guide.title}</h3>
                            <p className="text-xs text-text-muted leading-relaxed">{guide.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Additional Resources */}
                <h2 className="text-xl font-bold text-text-primary mb-6">More Resources</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
                    {RESOURCES.map((res) => (
                        <div key={res.title} className="p-6 border border-border-soft rounded-2xl text-center">
                            <res.icon size={28} className="text-brand-primary mx-auto mb-3" />
                            <h3 className="font-semibold text-text-primary mb-1">{res.title}</h3>
                            <p className="text-xs text-text-muted mb-3">{res.desc}</p>
                            <button className="text-xs font-semibold text-brand-primary hover:text-brand-secondary">{res.cta} &rarr;</button>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="bg-surface-bg rounded-2xl p-8 border border-border-soft text-center">
                    <h3 className="text-lg font-bold text-text-primary mb-2">Ready to Start Selling?</h3>
                    <p className="text-sm text-text-muted mb-4">Create your free seller account and launch your store today.</p>
                    <Link to="/sell" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors">
                        Get Started <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
