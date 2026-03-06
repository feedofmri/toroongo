export class Blog {
    constructor({ id, title, summary, content, author, sellerId, tags = [], category, readTime, color, imageUrl = null }) {
        this.id = id || Date.now().toString() + Math.random().toString(36).substr(2, 5);
        this.title = title;
        this.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        this.summary = summary;
        this.content = content;
        this.author = author;
        this.sellerId = sellerId || null;
        this.tags = tags;
        this.category = category || 'General';
        this.readTime = readTime || '5 min read';
        this.color = color || 'bg-brand-primary';
        this.imageUrl = imageUrl;
        this.views = 0;
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }
}
