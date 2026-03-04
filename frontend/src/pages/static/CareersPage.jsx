import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, ArrowRight, Briefcase, Heart, Zap, Globe } from 'lucide-react';

const OPENINGS = [
    { id: 1, title: 'Senior Frontend Engineer', dept: 'Engineering', location: 'San Francisco, CA', type: 'Full-time', posted: '2 days ago' },
    { id: 2, title: 'Product Designer', dept: 'Design', location: 'Remote', type: 'Full-time', posted: '5 days ago' },
    { id: 3, title: 'Backend Engineer (Node.js)', dept: 'Engineering', location: 'New York, NY', type: 'Full-time', posted: '1 week ago' },
    { id: 4, title: 'Marketing Manager', dept: 'Marketing', location: 'Remote', type: 'Full-time', posted: '1 week ago' },
    { id: 5, title: 'Customer Support Lead', dept: 'Support', location: 'Austin, TX', type: 'Full-time', posted: '2 weeks ago' },
    { id: 6, title: 'Data Analyst', dept: 'Analytics', location: 'Remote', type: 'Contract', posted: '3 days ago' },
];

export default function CareersPage() {
    return (
        <div className="animate-fade-in">
            {/* Hero */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4">Join the Toroongo Team</h1>
                    <p className="text-lg text-white/70 max-w-xl mx-auto">
                        Help us reshape the future of e-commerce. We are looking for passionate individuals who want to make an impact.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Perks */}
                <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">Why Work With Us</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
                    {[
                        { icon: Globe, title: 'Remote Friendly', desc: 'Work from anywhere in the world.' },
                        { icon: Heart, title: 'Health & Wellness', desc: 'Full medical, dental, and vision coverage.' },
                        { icon: Zap, title: 'Learning Budget', desc: '$2,000/year for courses and conferences.' },
                        { icon: Briefcase, title: 'Equity Package', desc: 'Every team member is an owner.' },
                    ].map((perk) => (
                        <div key={perk.title} className="text-center p-5 border border-border-soft rounded-2xl">
                            <perk.icon size={24} className="text-brand-primary mx-auto mb-3" />
                            <h3 className="text-sm font-semibold text-text-primary mb-1">{perk.title}</h3>
                            <p className="text-xs text-text-muted">{perk.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Open Positions */}
                <h2 className="text-2xl font-bold text-text-primary mb-6">Open Positions</h2>
                <div className="space-y-3">
                    {OPENINGS.map((job) => (
                        <div key={job.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white border border-border-soft rounded-2xl hover:border-brand-primary/20 transition-colors group">
                            <div>
                                <h3 className="font-semibold text-text-primary group-hover:text-brand-primary transition-colors">{job.title}</h3>
                                <div className="flex flex-wrap gap-3 mt-1.5">
                                    <span className="text-xs text-text-muted">{job.dept}</span>
                                    <span className="flex items-center gap-1 text-xs text-text-muted"><MapPin size={11} /> {job.location}</span>
                                    <span className="flex items-center gap-1 text-xs text-text-muted"><Clock size={11} /> {job.type}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 mt-3 sm:mt-0">
                                <span className="text-[11px] text-text-muted">{job.posted}</span>
                                <button className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-brand-primary border border-brand-primary/30 rounded-xl hover:bg-brand-primary hover:text-white transition-colors">
                                    Apply <ArrowRight size={12} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-12 text-center bg-surface-bg rounded-2xl p-8 border border-border-soft">
                    <h3 className="text-lg font-bold text-text-primary mb-2">Don't see a role for you?</h3>
                    <p className="text-sm text-text-muted mb-4">Send us your resume and we will keep you in mind for future openings.</p>
                    <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors">
                        Get in Touch <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
