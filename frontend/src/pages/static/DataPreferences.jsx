import React from 'react';

export default function DataPreferences() {
    return (
        <div className="animate-fade-in max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Data Preferences</h1>
            <p className="text-sm text-text-muted mb-8">Last updated: March 1, 2026</p>

            <div className="space-y-6 text-sm text-text-muted leading-relaxed">
                <section>
                    <h2 className="text-lg font-semibold text-text-primary mb-2">1. What Are Cookies</h2>
                    <p>Cookies are small text files stored on your device when you visit a website. They help us remember your preferences, keep you signed in, and understand how you use our platform so we can improve your experience.</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-text-primary mb-2">2. How We Use Cookies</h2>
                    <p>We use cookies for the following purposes:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Essential Cookies:</strong> Required for the platform to function. These include session management, authentication, and security cookies.</li>
                        <li><strong>Preference Cookies:</strong> Remember your settings such as language, currency, and display preferences.</li>
                        <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with the site, which pages are most popular, and where users encounter issues.</li>
                        <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements and measure the effectiveness of our marketing campaigns.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-text-primary mb-2">3. Third-Party Cookies</h2>
                    <p>Some cookies are placed by third-party services that appear on our pages. These include analytics providers (such as Google Analytics), payment processors, and social media platforms. We do not control the cookies set by third parties.</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-text-primary mb-2">4. Managing Cookies</h2>
                    <p>You can control and manage cookies through your browser settings. Most browsers allow you to block or delete cookies, though doing so may affect your ability to use certain features of our platform. You can also opt out of non-essential cookies through our cookie consent banner.</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-text-primary mb-2">5. Cookie Retention</h2>
                    <p>Session cookies are deleted when you close your browser. Persistent cookies remain on your device for a set period or until you delete them manually. The retention period varies depending on the purpose of the cookie, typically ranging from 30 days to 2 years.</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-text-primary mb-2">6. Changes to This Policy</h2>
                    <p>We may update this Cookie Policy periodically. Any changes will be posted on this page with a revised "Last updated" date. We encourage you to review this policy regularly to stay informed about our use of cookies.</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-text-primary mb-2">7. Contact Us</h2>
                    <p>If you have questions about our use of cookies, please contact us at <a href="mailto:privacy@toroongo.com" className="text-brand-primary hover:text-brand-secondary">privacy@toroongo.com</a>.</p>
                </section>
            </div>
        </div>
    );
}
