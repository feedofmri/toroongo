export class Product {
    constructor({ id, title, price, originalPrice = null, description = '', sellerId, seller = '', category, badge = null, imageUrl, images = [], stock = 50, specifications = {}, isFeatured = false }) {
        this.id = id || Date.now().toString();
        this.title = title;
        this.price = Number(price);
        this.originalPrice = originalPrice ? Number(originalPrice) : null;
        this.discount = this.originalPrice ? Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100) : 0;
        this.description = description;
        this.sellerId = sellerId;
        this.seller = seller;
        this.category = category;
        this.badge = badge;
        this.imageUrl = imageUrl || (images[0] || null);
        this.images = images.length ? images : (imageUrl ? [imageUrl] : []);
        this.stock = Number(stock);
        this.specifications = specifications;
        this.rating = 0;
        this.reviews = 0;
        this.isFeatured = isFeatured;
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }
}
