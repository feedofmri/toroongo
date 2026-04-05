export class User {
    constructor({ id, name, email, password, role = 'buyer', avatar = null, ...rest }) {
        this.id = id || Date.now().toString();
        this.name = name;
        this.email = email;
        this.password = password; // In a real app this would be hashed
        this.role = role; // 'buyer', 'seller', 'admin'
        this.avatar = avatar;
        this.createdAt = new Date().toISOString();

        // Dynamic properties based on role
        if (role === 'seller') {
            this.sellerDetails = {
                storeName: rest.storeName || name,
                description: rest.description || '',
                logo: rest.logo || avatar,
                banner: rest.banner || null,
                rating: rest.rating || 0,
                totalProducts: rest.totalProducts || 0,
                brandColor: rest.brandColor || '#000000',
                slug: rest.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                joinedDate: rest.joinedDate || this.createdAt,
            };
        }
    }
}
