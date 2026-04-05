import { api } from './api';

export const blogService = {
    async getAllBlogs() {
        return await api('/blogs');
    },

    async getBlogById(id) {
        return await api(`/blogs/${id}`);
    },

    async getBlogBySlug(slug) {
        return await api(`/blogs/${slug}`);
    },

    async createBlog(blogData) {
        return await api('/blogs', {
            method: 'POST',
            body: JSON.stringify(blogData),
        });
    },

    async updateBlog(id, blogData) {
        return await api(`/blogs/${id}`, {
            method: 'PUT',
            body: JSON.stringify(blogData),
        });
    },

    async deleteBlog(id) {
        return await api(`/blogs/${id}`, { method: 'DELETE' });
    },

    async getBlogsBySeller(sellerId) {
        return await api(`/blogs/seller/${sellerId}`);
    },

    async incrementViews(id) {
        return await api(`/blogs/${id}/views`, { method: 'POST' });
    }
};
