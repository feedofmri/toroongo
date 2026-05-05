import { api } from "./api";

export const shippingAreaService = {
  async getCheckoutAreas(sellerIds = []) {
    const query = sellerIds.length
      ? `?seller_ids=${encodeURIComponent(sellerIds.join(","))}`
      : "";
    return await api(`/shipping-areas/checkout${query}`);
  },

  async getMyAreas() {
    return await api("/shipping-areas");
  },

  async createArea(areaData) {
    return await api("/shipping-areas", {
      method: "POST",
      body: JSON.stringify(areaData),
    });
  },

  async updateArea(id, areaData) {
    return await api(`/shipping-areas/${id}`, {
      method: "PUT",
      body: JSON.stringify(areaData),
    });
  },

  async deleteArea(id) {
    return await api(`/shipping-areas/${id}`, {
      method: "DELETE",
    });
  },
};
