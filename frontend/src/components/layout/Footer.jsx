import React from 'react';
import { Link } from 'react-router-dom';
import { footerLinks } from '../../data/mockData';

export default function Footer() {
    return (
        <footer className="bg-surface-bg border-t border-border-soft mt-16">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

                    {/* About */}
                    <div>
                        <h3 className="text-sm font-semibold text-text-primary mb-4">About</h3>
                        <ul className="space-y-2.5">
                            {footerLinks.about.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.href}
                                        className="text-sm text-text-muted hover:text-brand-primary transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-sm font-semibold text-text-primary mb-4">Customer Service</h3>
                        <ul className="space-y-2.5">
                            {footerLinks.customerService.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.href}
                                        className="text-sm text-text-muted hover:text-brand-primary transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Sell on Toroongo */}
                    <div>
                        <h3 className="text-sm font-semibold text-text-primary mb-4">Sell on Toroongo</h3>
                        <ul className="space-y-2.5">
                            {footerLinks.sellOnToroongo.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.href}
                                        className="text-sm text-text-muted hover:text-brand-primary transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h3 className="text-sm font-semibold text-text-primary mb-4">Legal</h3>
                        <ul className="space-y-2.5">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.href}
                                        className="text-sm text-text-muted hover:text-brand-primary transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-border-soft">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-brand-primary rounded-md flex items-center justify-center">
                                <span className="text-white font-bold text-xs">T</span>
                            </div>
                            <span className="text-sm font-semibold text-text-primary">Toroongo</span>
                        </div>
                        <p className="text-xs text-text-muted">
                            © {new Date().getFullYear()} Toroongo. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
