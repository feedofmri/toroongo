import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, Truck, MapPin, ChevronRight, Lock, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useProduct } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services';

export default function Checkout() {
    const navigate = useNavigate();
    const { cart: cartSummary, clearCart } = useCart();
    const { products: allProducts } = useProduct();
    const { user } = useAuth();
    const [step, setStep] = useState(1); // 1=shipping, 2=payment, 3=review
    const [shipping, setShipping] = useState({
        firstName: '', lastName: '', email: '', phone: '',
        address: '', city: '', state: '', zip: '', country: 'US',
    });
    const [shippingMethod, setShippingMethod] = useState('standard');
    const [payment, setPayment] = useState({
        cardNumber: '', expiry: '', cvv: '', nameOnCard: '',
    });

    const subtotal = cartSummary.reduce((sum, item) => {
        const p = allProducts.find((pr) => String(pr.id) === String(item.id));
        return sum + (p ? p.price * item.quantity : 0);
    }, 0);
    const shippingCost = shippingMethod === 'express' ? 12.99 : subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shippingCost + tax;

    const steps = [
        { num: 1, label: 'Shipping', icon: MapPin },
        { num: 2, label: 'Payment', icon: CreditCard },
        { num: 3, label: 'Review', icon: ShieldCheck },
    ];

    const handleInputChange = (setter, field, value) => {
        setter((prev) => ({ ...prev, [field]: value }));
    };

    const inputClass = `w-full px-4 py-3 text-sm bg-white border border-border-soft rounded-xl
    focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors
    placeholder:text-text-muted/50`;

    const handlePlaceOrder = async () => {
        if (!user) {
            // Should be handled by protected route ideally but let's be safe
            alert("Please login to place order");
            return;
        }

        const orderData = {
            buyerId: user.id,
            items: cartSummary.map(item => {
                const p = allProducts.find((pr) => String(pr.id) === String(item.id));
                return {
                    productId: item.id,
                    quantity: item.quantity,
                    sellerId: p ? p.sellerId : 1,
                    priceAtPurchase: p ? p.price : 0
                };
            }),
            shippingAddress: shipping,
            paymentMethod: "Credit Card ending in " + (payment.cardNumber || '4242').slice(-4)
        };

        try {
            await orderService.createOrder(orderData);
            clearCart();
            navigate('/order-confirmation');
        } catch (error) {
            alert("Order failed: " + error.message);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Step Indicator */}
                <div className="flex items-center justify-center mb-10">
                    {steps.map((s, idx) => (
                        <React.Fragment key={s.num}>
                            <button
                                onClick={() => s.num < step && setStep(s.num)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${step === s.num ? 'bg-brand-primary text-white' : step > s.num ? 'bg-brand-primary/10 text-brand-primary cursor-pointer' : 'bg-surface-bg text-text-muted'}`}
                            >
                                <s.icon size={15} />
                                <span className="hidden sm:inline">{s.label}</span>
                            </button>
                            {idx < steps.length - 1 && (
                                <div className={`w-8 sm:w-16 h-px mx-2 ${step > s.num ? 'bg-brand-primary' : 'bg-border-soft'}`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* ── Form Area ──────────────────────────────────── */}
                    <div className="lg:col-span-3">
                        {/* Step 1: Shipping */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-text-primary">Shipping Information</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input type="text" placeholder="First name" value={shipping.firstName}
                                        onChange={(e) => handleInputChange(setShipping, 'firstName', e.target.value)} className={inputClass} />
                                    <input type="text" placeholder="Last name" value={shipping.lastName}
                                        onChange={(e) => handleInputChange(setShipping, 'lastName', e.target.value)} className={inputClass} />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input type="email" placeholder="Email address" value={shipping.email}
                                        onChange={(e) => handleInputChange(setShipping, 'email', e.target.value)} className={inputClass} />
                                    <input type="tel" placeholder="Phone number" value={shipping.phone}
                                        onChange={(e) => handleInputChange(setShipping, 'phone', e.target.value)} className={inputClass} />
                                </div>
                                <input type="text" placeholder="Street address" value={shipping.address}
                                    onChange={(e) => handleInputChange(setShipping, 'address', e.target.value)} className={inputClass} />
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    <input type="text" placeholder="City" value={shipping.city}
                                        onChange={(e) => handleInputChange(setShipping, 'city', e.target.value)} className={inputClass} />
                                    <input type="text" placeholder="State" value={shipping.state}
                                        onChange={(e) => handleInputChange(setShipping, 'state', e.target.value)} className={inputClass} />
                                    <input type="text" placeholder="ZIP Code" value={shipping.zip}
                                        onChange={(e) => handleInputChange(setShipping, 'zip', e.target.value)} className={`${inputClass} col-span-2 sm:col-span-1`} />
                                </div>

                                {/* Shipping method */}
                                <div className="mt-6">
                                    <h3 className="text-sm font-semibold text-text-primary mb-3">Shipping Method</h3>
                                    <div className="space-y-3">
                                        {[
                                            { value: 'standard', label: 'Standard Shipping', desc: '5-7 business days', price: subtotal > 50 ? 'Free' : '$5.99' },
                                            { value: 'express', label: 'Express Shipping', desc: '2-3 business days', price: '$12.99' },
                                        ].map((method) => (
                                            <label
                                                key={method.value}
                                                className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors
                          ${shippingMethod === method.value ? 'border-brand-primary bg-brand-primary/5' : 'border-border-soft hover:border-gray-300'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="radio"
                                                        name="shipping"
                                                        value={method.value}
                                                        checked={shippingMethod === method.value}
                                                        onChange={(e) => setShippingMethod(e.target.value)}
                                                        className="accent-brand-primary"
                                                    />
                                                    <div>
                                                        <p className="text-sm font-medium text-text-primary">{method.label}</p>
                                                        <p className="text-xs text-text-muted">{method.desc}</p>
                                                    </div>
                                                </div>
                                                <span className={`text-sm font-semibold ${method.price === 'Free' ? 'text-green-600' : 'text-text-primary'}`}>
                                                    {method.price}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setStep(2)}
                                    className="w-full py-3.5 bg-brand-primary text-white font-semibold rounded-xl
                           hover:bg-brand-secondary transition-colors flex items-center justify-center gap-2"
                                >
                                    Continue to Payment <ChevronRight size={16} />
                                </button>
                            </div>
                        )}

                        {/* Step 2: Payment */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-text-primary">Payment Details</h2>
                                <div className="p-4 bg-surface-bg rounded-xl flex items-center gap-2 text-xs text-text-muted border border-border-soft">
                                    <Lock size={14} className="text-brand-primary" />
                                    Your payment information is encrypted and secure.
                                </div>
                                <input type="text" placeholder="Name on card" value={payment.nameOnCard}
                                    onChange={(e) => handleInputChange(setPayment, 'nameOnCard', e.target.value)} className={inputClass} />
                                <input type="text" placeholder="Card number" value={payment.cardNumber}
                                    onChange={(e) => handleInputChange(setPayment, 'cardNumber', e.target.value)} className={inputClass} />
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="MM / YY" value={payment.expiry}
                                        onChange={(e) => handleInputChange(setPayment, 'expiry', e.target.value)} className={inputClass} />
                                    <input type="text" placeholder="CVV" value={payment.cvv}
                                        onChange={(e) => handleInputChange(setPayment, 'cvv', e.target.value)} className={inputClass} />
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="flex-1 py-3.5 text-sm font-medium text-text-muted border border-border-soft rounded-xl
                             hover:bg-surface-bg transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={() => setStep(3)}
                                        className="flex-1 py-3.5 bg-brand-primary text-white font-semibold rounded-xl
                             hover:bg-brand-secondary transition-colors flex items-center justify-center gap-2"
                                    >
                                        Review Order <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Review */}
                        {step === 3 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-text-primary">Review Your Order</h2>

                                {/* Shipping summary */}
                                <div className="p-5 bg-surface-bg rounded-xl border border-border-soft">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                                            <MapPin size={14} className="text-brand-primary" /> Shipping to
                                        </h4>
                                        <button onClick={() => setStep(1)} className="text-xs text-brand-primary font-medium hover:text-brand-secondary">Edit</button>
                                    </div>
                                    <p className="text-sm text-text-muted">
                                        {shipping.firstName || 'John'} {shipping.lastName || 'Doe'}<br />
                                        {shipping.address || '123 Main St'}, {shipping.city || 'New York'}, {shipping.state || 'NY'} {shipping.zip || '10001'}
                                    </p>
                                </div>

                                {/* Payment summary */}
                                <div className="p-5 bg-surface-bg rounded-xl border border-border-soft">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                                            <CreditCard size={14} className="text-brand-primary" /> Payment
                                        </h4>
                                        <button onClick={() => setStep(2)} className="text-xs text-brand-primary font-medium hover:text-brand-secondary">Edit</button>
                                    </div>
                                    <p className="text-sm text-text-muted">
                                        Card ending in •••• {(payment.cardNumber || '4242').slice(-4)}
                                    </p>
                                </div>

                                {/* Order items */}
                                <div className="border border-border-soft rounded-xl divide-y divide-border-soft">
                                    {cartSummary.map((item) => {
                                        const p = allProducts.find((pr) => String(pr.id) === String(item.id));
                                        if (!p) return null;
                                        return (
                                            <div key={p.id} className="flex gap-4 p-4">
                                                <div className="w-14 h-14 rounded-lg overflow-hidden bg-surface-bg flex-shrink-0">
                                                    <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-text-primary line-clamp-1">{p.title}</p>
                                                    <p className="text-xs text-text-muted mt-0.5">Qty: {item.quantity}</p>
                                                </div>
                                                <span className="text-sm font-semibold text-text-primary">${(p.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setStep(2)}
                                        className="flex-1 py-3.5 text-sm font-medium text-text-muted border border-border-soft rounded-xl
                             hover:bg-surface-bg transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handlePlaceOrder}
                                        className="flex-1 py-3.5 bg-brand-primary text-white font-semibold rounded-xl
                             hover:bg-brand-secondary transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20"
                                    >
                                        <Lock size={15} /> Place Order
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Order Summary Sidebar ──────────────────────── */}
                    <div className="lg:col-span-2">
                        <div className="sticky top-24 border border-border-soft rounded-2xl p-5">
                            <h3 className="text-base font-semibold text-text-primary mb-4">Order Summary</h3>
                            <div className="space-y-2.5 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-text-muted">Subtotal ({cartSummary.length} items)</span>
                                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-muted">Shipping</span>
                                    <span className={`font-medium ${shippingCost === 0 ? 'text-green-600' : ''}`}>
                                        {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-muted">Est. Tax</span>
                                    <span className="font-medium">${tax.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-border-soft pt-2.5 flex justify-between">
                                    <span className="font-semibold text-text-primary">Total</span>
                                    <span className="text-lg font-bold text-text-primary">${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
