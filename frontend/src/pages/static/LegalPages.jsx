import React from 'react';

function LegalPage({ title, children }) {
    return (
        <div className="animate-fade-in max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-3xl font-bold text-text-primary mb-2">{title}</h1>
            <p className="text-sm text-text-muted mb-8">Last updated: March 1, 2026</p>
            <div className="prose prose-sm prose-slate max-w-none text-text-muted leading-relaxed space-y-6">
                {children}
            </div>
        </div>
    );
}

export function TermsOfService() {
    return (
        <LegalPage title="Terms of Service">
            <section>
                <h2 className="text-lg font-semibold text-text-primary mb-2">1. Acceptance of Terms</h2>
                <p>By accessing or using the Toroongo platform, you agree to be bound by these Terms of Service. If you do not agree, you may not use our services.</p>
            </section>
            <section>
                <h2 className="text-lg font-semibold text-text-primary mb-2">2. User Accounts</h2>
                <p>You must provide accurate information when creating an account. You are responsible for maintaining the security of your account credentials and for all activities under your account.</p>
            </section>
            <section>
                <h2 className="text-lg font-semibold text-text-primary mb-2">3. Buyer Responsibilities</h2>
                <p>Buyers agree to pay for items purchased, provide accurate shipping information, and communicate respectfully with sellers. Abuse of the dispute system may result in account suspension.</p>
            </section>
            <section>
                <h2 className="text-lg font-semibold text-text-primary mb-2">4. Seller Obligations</h2>
                <p>Sellers must provide accurate product descriptions, ship orders promptly, and comply with all applicable laws. Toroongo charges a 10% commission on each sale.</p>
            </section>
            <section>
                <h2 className="text-lg font-semibold text-text-primary mb-2">5. Prohibited Activities</h2>
                <p>Users may not sell counterfeit goods, engage in fraud, harass other users, or violate any applicable laws or regulations while using the platform.</p>
            </section>
            <section>
                <h2 className="text-lg font-semibold text-text-primary mb-2">6. Limitation of Liability</h2>
                <p>Toroongo acts as a marketplace facilitator and is not responsible for the quality, safety, or legality of items sold by third-party sellers on the platform.</p>
            </section>
        </LegalPage>
    );
}

export function PrivacyPolicy() {
    return (
        <LegalPage title="Privacy Policy">
            <section>
                <h2 className="text-lg font-semibold text-text-primary mb-2">1. Information We Collect</h2>
                <p>We collect information you provide directly (name, email, shipping address) as well as usage data (browsing behavior, device information, IP address) to improve your experience.</p>
            </section>
            <section>
                <h2 className="text-lg font-semibold text-text-primary mb-2">2. How We Use Your Information</h2>
                <p>We use your data to process orders, personalize your shopping experience, send relevant communications, prevent fraud, and improve our platform.</p>
            </section>
            <section>
                <h2 className="text-lg font-semibold text-text-primary mb-2">3. Data Sharing</h2>
                <p>We share necessary information with sellers to fulfill orders. We do not sell personal data to third parties. We may share data with service providers who assist our operations.</p>
            </section>
            <section>
                <h2 className="text-lg font-semibold text-text-primary mb-2">4. Data Security</h2>
                <p>We implement industry-standard security measures including encryption, secure servers, and regular security audits to protect your information.</p>
            </section>
            <section>
                <h2 className="text-lg font-semibold text-text-primary mb-2">5. Your Rights</h2>
                <p>You may request access to, correction of, or deletion of your personal data at any time by contacting our support team or through your account settings.</p>
            </section>
        </LegalPage>
    );
}
