import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import logoColourful from '../../assets/Logo/logo_colourful.png';

export default function Footer() {
    const { t } = useTranslation();
    const { user, isAuthenticated } = useAuth();
    const role = isAuthenticated ? user?.role : 'guest';

    const customLinks = {
        guest: {
            title: t('footer.sections.sell', 'Sell on Toroongo'),
            links: [
                { name: t('footer.links.becomeSeller', 'Become a Seller'), href: "/sell" },
                { name: t('footer.links.sellerPricing', 'Seller Pricing'), href: "/pricing" },
                { name: t('footer.links.sellerResources', 'Seller Resources'), href: "/sell/resources" },
                { name: t('footer.links.sellerFaq', 'Seller FAQs'), href: "/help" },
            ]
        },
        buyer: {
            title: t('footer.sections.myAccount', 'My Account'),
            links: [
                { name: t('footer.links.dashboard', 'Dashboard'), href: "/account" },
                { name: t('footer.links.orders', 'Order History'), href: "/account/orders" },
                { name: t('footer.links.wishlist', 'Wishlist'), href: "/account/wishlist" },
                { name: t('footer.links.messages', 'Messages'), href: "/account/messages" }
            ]
        },
        seller: {
            title: t('footer.sections.sellerCentral', 'Seller Central'),
            links: [
                { name: t('footer.links.dashboard', 'Dashboard'), href: "/seller" },
                { name: t('footer.links.products', 'Products'), href: "/seller/products" },
                { name: t('footer.links.orders', 'Orders'), href: "/seller/orders" },
                { name: t('footer.links.storefront', 'Storefront Builder'), href: "/seller/storefront-builder" }
            ]
        },
        admin: {
            title: t('footer.sections.adminPanel', 'Admin Panel'),
            links: [
                { name: t('footer.links.overview', 'Overview'), href: "/admin" },
                { name: t('footer.links.manageUsers', 'Manage Users'), href: "/admin/users" },
                { name: t('footer.links.manageSellers', 'Manage Sellers'), href: "/admin/sellers" },
                { name: t('footer.links.disputes', 'Disputes'), href: "/admin/disputes" }
            ]
        }
    };

    const dynamicSection = customLinks[role] || customLinks['guest'];

    return (
        <footer className="bg-surface-bg border-t border-border-soft mt-16">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

                    {/* About */}
                    <div>
                        <h3 className="text-sm font-semibold text-text-primary mb-4">{t('footer.sections.about', 'About')}</h3>
                        <ul className="space-y-2.5">
                            {[
                                { name: t('footer.links.aboutUs', 'About Toroongo'), href: '/about' },
                                { name: t('footer.links.careers', 'Careers'), href: '/careers' },
                                { name: t('footer.links.press', 'Press & Media'), href: '/press' },
                                { name: t('footer.links.impact', 'Social Impact'), href: '/impact' }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link to={link.href} className="text-sm text-text-muted hover:text-brand-primary transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-sm font-semibold text-text-primary mb-4">{t('footer.sections.customerService', 'Customer Service')}</h3>
                        <ul className="space-y-2.5">
                            {[
                                { name: t('footer.links.help', 'Help Center'), href: '/help' },
                                { name: t('footer.links.shipping', 'Shipping & Delivery'), href: '/shipping' },
                                { name: t('footer.links.returns', 'Returns & Refunds'), href: '/returns' },
                                { name: t('footer.links.contact', 'Contact Us'), href: '/contact' }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link to={link.href} className="text-sm text-text-muted hover:text-brand-primary transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Dynamic Role-Based Section */}
                    <div>
                        <h3 className="text-sm font-semibold text-text-primary mb-4">{dynamicSection.title}</h3>
                        <ul className="space-y-2.5">
                            {dynamicSection.links.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.href} className="text-sm text-text-muted hover:text-brand-primary transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-sm font-semibold text-text-primary mb-4">{t('footer.sections.legal', 'Legal')}</h3>
                        <ul className="space-y-2.5">
                            {[
                                { name: t('footer.links.terms', 'Terms of Use'), href: '/terms' },
                                { name: t('footer.links.privacy', 'Privacy Policy'), href: '/privacy' },
                                { name: t('footer.links.cookie', 'Cookie Policy'), href: '/cookies' },
                                { name: t('footer.links.sellerAgreement', 'Seller Agreement'), href: '/seller-agreement' }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link to={link.href} className="text-sm text-text-muted hover:text-brand-primary transition-colors">
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
                            <img src={logoColourful} alt="Toroongo" className="h-6 w-auto" />
                        </div>
                        <p className="text-xs text-text-muted">
                            © {new Date().getFullYear()} Toroongo. {t('footer.rights', 'All rights reserved.')}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
