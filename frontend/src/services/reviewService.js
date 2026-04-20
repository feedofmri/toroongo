import { api } from './api';

export const reviewService = {
  async getProductReviews(productId) {
    return await api(`/products/${productId}/reviews`);
  },

  async getMyReviews() {
    return await api('/reviews/my');
  },

  async storeReview(reviewData) {
    return await api('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
  },

  async updateReview(id, reviewData) {
    return await api(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData)
    });
  },

  async deleteReview(id) {
    return await api(`/reviews/${id}`, { 
      method: 'DELETE' 
    });
  }
};
