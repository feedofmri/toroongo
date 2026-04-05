export class Order {
    constructor({ id, buyerId, items = [], shippingAddress, paymentMethod, status = 'processing' }) {
        this.id = id || `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        this.buyerId = buyerId;
        this.items = items; // Array of { productId, sellerId, quantity, priceAtPurchase }
        this.shippingAddress = shippingAddress;
        this.paymentMethod = paymentMethod;
        this.status = status; // 'processing', 'shipped', 'delivered', 'cancelled'
        this.subtotal = this.calculateSubtotal();
        this.shippingCost = this.calculateShipping();
        this.tax = this.calculateTax();
        this.total = this.subtotal + this.shippingCost + this.tax;
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    calculateSubtotal() {
        return this.items.reduce((sum, item) => sum + (item.priceAtPurchase * item.quantity), 0);
    }

    calculateShipping() {
        return this.subtotal > 50 ? 0 : 5.99; // Free shipping over $50
    }

    calculateTax() {
        return this.subtotal * 0.08; // 8% flat tax for calculation
    }
}
