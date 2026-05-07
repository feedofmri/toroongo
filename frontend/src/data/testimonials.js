/**
 * Testimonial data for the homepage.
 */

export const getTestimonials = (t) => [
    {
        id: 1,
        name: "Emily R.",
        role: t('home.testimonials.roles.fashion', 'Fashion Blogger'),
        text: t('home.testimonials.texts.emily', 'Toroongo has completely changed how I shop for unique pieces. The variety of sellers is incredible and the quality always exceeds expectations!'),
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
        date: t('home.testimonials.dates.twoWeeksAgo', '2 weeks ago'),
        purchased: t('home.testimonials.purchased.silkDress', 'Classic Silk Dress')
    },
    {
        id: 2,
        name: "Michael T.",
        role: t('home.testimonials.roles.tech', 'Tech Enthusiast'),
        text: t('home.testimonials.texts.michael', 'I found exclusive gadgets here that I couldn\'t find anywhere else. The support from sellers is top-notch and delivery was faster than expected.'),
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
        date: t('home.testimonials.dates.oneMonthAgo', '1 month ago'),
        purchased: t('home.testimonials.purchased.headphones', 'Wireless Noise-Cancelling Headphones')
    },
    {
        id: 3,
        name: "Sarah J.",
        role: t('home.testimonials.roles.decor', 'Home Decorator'),
        text: t('home.testimonials.texts.sarah', 'The artisan collection on Toroongo is simply stunning. My home feels so much more personal with the handcrafted items I\'ve discovered here.'),
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
        date: t('home.testimonials.dates.threeWeeksAgo', '3 weeks ago'),
        purchased: t('home.testimonials.purchased.rug', 'Hand-Woven Textures Rug')
    }
];
