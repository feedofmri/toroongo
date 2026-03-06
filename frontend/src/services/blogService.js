import { localDB } from '../db/localDB';
import { Blog } from '../models';

const DELAY = 400;
const simulateDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const blogService = {
    async getAllBlogs() {
        await simulateDelay(DELAY);
        return [...localDB.data.blogs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    async getBlogById(id) {
        await simulateDelay(DELAY);
        const blog = localDB.data.blogs.find(b => b.id === id);
        if (!blog) throw new Error('Blog not found');
        return blog;
    },

    async getBlogBySlug(slug) {
        await simulateDelay(DELAY);
        const blog = localDB.data.blogs.find(b => b.slug === slug);
        if (!blog) throw new Error('Blog not found');
        return blog;
    },

    async createBlog(blogData) {
        await simulateDelay(DELAY);
        const newBlog = new Blog(blogData);
        localDB.data.blogs.push(newBlog);
        localDB.save();
        return newBlog;
    },

    async updateBlog(id, blogData) {
        await simulateDelay(DELAY);
        const index = localDB.data.blogs.findIndex(b => b.id === id);
        if (index === -1) throw new Error('Blog not found');

        const updatedBlog = {
            ...localDB.data.blogs[index],
            ...blogData,
            slug: blogData.title ? blogData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : localDB.data.blogs[index].slug,
            updatedAt: new Date().toISOString()
        };

        localDB.data.blogs[index] = updatedBlog;
        localDB.save();
        return updatedBlog;
    },

    async deleteBlog(id) {
        await simulateDelay(DELAY);
        const index = localDB.data.blogs.findIndex(b => b.id === id);
        if (index === -1) throw new Error('Blog not found');
        localDB.data.blogs.splice(index, 1);
        localDB.save();
        return true;
    },

    async getBlogsBySeller(sellerId) {
        await simulateDelay(DELAY);
        return localDB.data.blogs
            .filter(b => b.sellerId === sellerId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    async incrementViews(id) {
        const index = localDB.data.blogs.findIndex(b => b.id === id);
        if (index !== -1) {
            localDB.data.blogs[index].views = (localDB.data.blogs[index].views || 0) + 1;
            localDB.save();
        }
    }
};
