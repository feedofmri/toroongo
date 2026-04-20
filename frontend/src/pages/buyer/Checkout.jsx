import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, Truck, MapPin, ChevronRight, Lock, ShieldCheck, Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useProduct } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';
import { orderService, addressService } from '../../services';
import { formatPrice } from '../../utils/currency';

export default function Checkout() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { cart: cartSummary, clearCart } = useCart();
    const { products: allProducts } = useProduct();
    const { user } = useAuth();
    const [step, setStep] = useState(1); // 1=shipping, 2=payment, 3=review
    const [shipping, setShipping] = useState({
        firstName: '', lastName: '', email: '', phone: '',
        address: '', city: '', state: '', zip: '', country: 'BD',
    });
    const [payment, setPayment] = useState({
        nameOnCard: '', cardNumber: '', expiry: '', cvv: '',
    });
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [loadingAddresses, setLoadingAddresses] = useState(false);

    useEffect(() => {
        if (user) {
            // Pre-fill from user profile
            const [firstName, ...lastNameParts] = (user.name || '').split(' ');
            const lastName = lastNameParts.join(' ');
            
            setShipping(prev => ({
                ...prev,
                firstName: firstName || prev.firstName,
                lastName: lastName || prev.lastName,
                email: user.email || prev.email,
                phone: user.phone || prev.phone,
            }));

            // Fetch and pre-fill from addresses
            const fetchAndFillAddress = async () => {
                setLoadingAddresses(true);
                try {
                    const data = await addressService.getAddresses();
                    setSavedAddresses(data);
                    if (data.length > 0) {
                        const defaultAddr = data[0]; // For now, use the first one
                        setShipping(prev => ({
                            ...prev,
                            firstName: defaultAddr.first_name || prev.firstName,
                            lastName: defaultAddr.last_name || prev.lastName,
                            email: defaultAddr.email || prev.email,
                            phone: defaultAddr.phone || prev.phone,
                            address: defaultAddr.address || prev.address,
                            city: defaultAddr.city || prev.city,
                            state: defaultAddr.state || prev.state,
                            zip: defaultAddr.zip || prev.zip,
                            country: defaultAddr.country || prev.country,
                        }));
                    }
                } catch (error) {
                    console.error('Failed to auto-fill address:', error);
                } finally {
                    setLoadingAddresses(false);
                }
            };

            fetchAndFillAddress();
        }
    }, [user]);

    const handleAddressSelect = (addr) => {
        setSelectedAddressId(addr.id);
        setShipping({
            firstName: addr.first_name || '',
            lastName: addr.last_name || '',
            email: addr.email || '',
            phone: addr.phone || '',
            address: addr.address || '',
            city: addr.city || '',
            state: addr.state || '',
            zip: addr.zip || '',
            country: addr.country || 'BD',
        });
    };

    const handleManualEntry = () => {
        setSelectedAddressId(null);
        setShipping({
            firstName: '', lastName: '', email: '', phone: '',
            address: '', city: '', state: '', zip: '', country: 'BD',
        });
    };

    const subtotal = useMemo(() => {
        return cartSummary.reduce((sum, item) => {
            const p = allProducts.find((pr) => String(pr.id) === String(item.id));
            return sum + (p ? (p.price * item.quantity) : 0);
        }, 0);
    }, [cartSummary, allProducts]);

    const shippingCost = useMemo(() => {
        return cartSummary.reduce((sum, item) => {
            const p = allProducts.find((pr) => String(pr.id) === String(item.id));
            return sum + (p ? (p.shipping_fee || 0) : 0);
        }, 0);
    }, [cartSummary, allProducts]);

    const tax = subtotal * 0.08;
    const total = subtotal + shippingCost + tax;

    const steps = [
        { num: 1, label: t('checkout.shipping', 'Shipping'), icon: MapPin },
        { num: 2, label: t('checkout.payment', 'Payment'), icon: CreditCard },
        { num: 3, label: t('checkout.review', 'Review'), icon: ShieldCheck },
    ];

    const handleInputChange = (setter, field, value) => {
        setter((prev) => ({ ...prev, [field]: value }));
    };

    const validateShipping = () => {
        const { firstName, lastName, email, phone, address, city, state, zip } = shipping;
        if (!firstName || !lastName || !email || !phone || !address || !city || !state || !zip) {
            alert(t('checkout.fillFields', 'Please fill in all shipping fields.'));
            return false;
        }
        return true;
    };

    const validatePayment = () => {
        if (paymentMethod === 'credit_card') {
            const { nameOnCard, cardNumber, expiry, cvv } = payment;
            if (!nameOnCard || !cardNumber || !expiry || !cvv) {
                alert(t('checkout.fillFields', 'Please fill in all payment fields.'));
                return false;
            }
        }
        return true;
    };

    const inputClass = `w-full px-4 py-3 text-sm bg-white border border-border-soft rounded-xl
    focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors
    placeholder:text-text-muted/50`;

    const handlePlaceOrder = async () => {
        if (!user) {
            // Should be handled by protected route ideally but let's be safe
            alert(t('checkout.loginRequired', 'Please login to place order'));
            return;
        }

        let paymentDesc = "Credit Card ending in " + (payment.cardNumber || '4242').slice(-4);
        if (paymentMethod === 'cod') paymentDesc = "Cash on Delivery";
        if (paymentMethod === 'bkash') paymentDesc = "bKash Digital Payment";
        if (paymentMethod === 'nagad') paymentDesc = "Nagad Digital Payment";
        if (paymentMethod === 'paypal') paymentDesc = "PayPal Checkout";

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
            paymentMethod: paymentDesc
        };

        try {
            await orderService.createOrder(orderData);
            clearCart();
            navigate('/order-confirmation');
        } catch (error) {
            alert(t('checkout.orderFailed', 'Order failed: ') + error.message);
        }
    };

    if (!user) {
        return (
            <div className="max-w-md mx-auto px-4 py-16 text-center animate-fade-in">
                <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock size={24} className="text-brand-primary" />
                </div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">{t('checkout.loginRequiredTitle', 'Login Required')}</h2>
                <p className="text-text-muted mb-6">{t('checkout.loginRequiredMsg', 'Please log in to your account to continue securely with your checkout.')}</p>
                <Link to="/login" state={{ from: '/checkout' }} className="inline-flex items-center justify-center w-full py-3.5 bg-brand-primary text-white font-semibold rounded-xl hover:bg-brand-secondary transition-colors">
                    {t('checkout.loginButton', 'Login to Continue')}
                </Link>
            </div>
        );
    }

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
                                <h2 className="text-xl font-bold text-text-primary">{t('checkout.shippingInfo', 'Shipping Information')}</h2>

                                {savedAddresses.length > 0 && (
                                    <div className="space-y-3">
                                        <p className="text-sm font-medium text-text-muted">{t('checkout.selectSavedAddress', 'Select a saved address')}</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {savedAddresses.map((addr) => (
                                                <button
                                                    key={addr.id}
                                                    onClick={() => handleAddressSelect(addr)}
                                                    className={`p-4 border text-left rounded-xl transition-all ${selectedAddressId === addr.id 
                                                        ? 'border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary' 
                                                        : 'border-border-soft hover:border-gray-300 bg-white'}`}
                                                >
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">{addr.label}</span>
                                                        {selectedAddressId === addr.id && <div className="w-2 h-2 rounded-full bg-brand-primary"></div>}
                                                    </div>
                                                    <p className="text-sm font-bold text-text-primary">{addr.first_name} {addr.last_name}</p>
                                                    <p className="text-xs text-text-muted line-clamp-1 mt-0.5">{addr.address}, {addr.city}</p>
                                                </button>
                                            ))}
                                            <button
                                                onClick={handleManualEntry}
                                                className={`p-4 border text-left rounded-xl transition-all flex flex-col justify-center items-center gap-1 border-dashed ${!selectedAddressId 
                                                    ? 'border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary' 
                                                    : 'border-border-soft hover:border-gray-300 bg-white'}`}
                                            >
                                                <Plus size={16} className="text-text-muted" />
                                                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('checkout.newAddress', 'New Address')}</span>
                                            </button>
                                        </div>
                                    </div>
                                )}


                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input type="text" placeholder={t('checkout.firstName', 'First name')} value={shipping.firstName}
                                        onChange={(e) => handleInputChange(setShipping, 'firstName', e.target.value)} className={inputClass} />
                                    <input type="text" placeholder={t('checkout.lastName', 'Last name')} value={shipping.lastName}
                                        onChange={(e) => handleInputChange(setShipping, 'lastName', e.target.value)} className={inputClass} />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input type="email" placeholder={t('checkout.email', 'Email address')} value={shipping.email}
                                        onChange={(e) => handleInputChange(setShipping, 'email', e.target.value)} className={inputClass} />
                                    <input type="tel" placeholder={t('checkout.phone', 'Phone number')} value={shipping.phone}
                                        onChange={(e) => handleInputChange(setShipping, 'phone', e.target.value)} className={inputClass} />
                                </div>
                                <input type="text" placeholder={t('checkout.address', 'Street address')} value={shipping.address}
                                    onChange={(e) => handleInputChange(setShipping, 'address', e.target.value)} className={inputClass} />
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    <input type="text" placeholder={t('checkout.city', 'City')} value={shipping.city}
                                        onChange={(e) => handleInputChange(setShipping, 'city', e.target.value)} className={inputClass} />
                                    <input type="text" placeholder={t('checkout.state', 'State')} value={shipping.state}
                                        onChange={(e) => handleInputChange(setShipping, 'state', e.target.value)} className={inputClass} />
                                    <input type="text" placeholder={t('checkout.zip', 'ZIP Code')} value={shipping.zip}
                                        onChange={(e) => handleInputChange(setShipping, 'zip', e.target.value)} className={`${inputClass} col-span-2 sm:col-span-1`} />
                                </div>

                                {/* Shipping details provided by sellers */}
                                <div className="mt-2 p-4 bg-surface-bg rounded-xl border border-border-soft">
                                    <p className="text-xs text-text-muted">
                                        {t('checkout.sellerShippingNote', 'Shipping costs are set by individual sellers and are included in your total.')}
                                    </p>
                                </div>

                                <button
                                    onClick={() => { if (validateShipping()) setStep(2); }}
                                    className="w-full py-3.5 bg-brand-primary text-white font-semibold rounded-xl
                           hover:bg-brand-secondary transition-colors flex items-center justify-center gap-2"
                                >
                                    {t('checkout.continueToPayment', 'Continue to Payment')} <ChevronRight size={16} />
                                </button>
                            </div>
                        )}

                        {/* Step 2: Payment */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-text-primary mb-6">Payment Details</h2>

                                <div className="space-y-3 mb-8">
                                    {[
                                        { id: 'credit_card', label: t('checkout.creditCard', 'Credit Card'), icon: CreditCard },
                                        { id: 'cod', label: t('checkout.cod', 'Cash on Delivery'), icon: Truck },
                                        { id: 'bkash', label: t('checkout.bkash', 'bKash'), icon: Lock },
                                        { id: 'nagad', label: t('checkout.nagad', 'Nagad'), icon: Lock },
                                        { id: 'paypal', label: t('checkout.paypal', 'PayPal'), icon: Lock }
                                    ].map(method => (
                                        <label key={method.id} className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === method.id ? 'border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary' : 'border-border-soft hover:border-gray-300'}`}>
                                            <input type="radio" name="paymentMethod" value={method.id} checked={paymentMethod === method.id} onChange={(e) => setPaymentMethod(e.target.value)} className="accent-brand-primary" />
                                            <method.icon size={18} className={paymentMethod === method.id ? 'text-brand-primary' : 'text-text-muted'} />
                                            <span className="text-sm font-medium text-text-primary">{method.label}</span>
                                        </label>
                                    ))}
                                </div>

                                {paymentMethod === 'credit_card' && (
                                    <div className="space-y-4 animate-fade-in">
                                        <div className="p-4 bg-surface-bg rounded-xl flex items-center gap-2 text-xs text-text-muted border border-border-soft">
                                            <Lock size={14} className="text-brand-primary" />
                                            {t('checkout.secureInfo', 'Your payment information is encrypted and secure.')}
                                        </div>
                                        <input type="text" placeholder={t('checkout.nameOnCard', 'Name on card')} value={payment.nameOnCard} onChange={(e) => handleInputChange(setPayment, 'nameOnCard', e.target.value)} className={inputClass} />
                                        <input type="text" placeholder={t('checkout.cardNumber', 'Card number')} value={payment.cardNumber} onChange={(e) => handleInputChange(setPayment, 'cardNumber', e.target.value)} className={inputClass} />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input type="text" placeholder={t('checkout.expiry', 'MM / YY')} value={payment.expiry} onChange={(e) => handleInputChange(setPayment, 'expiry', e.target.value)} className={inputClass} />
                                            <input type="text" placeholder={t('checkout.cvv', 'CVV')} value={payment.cvv} onChange={(e) => handleInputChange(setPayment, 'cvv', e.target.value)} className={inputClass} />
                                        </div>
                                    </div>
                                )}

                                {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
                                    <div className="space-y-4 animate-fade-in">
                                        <p className="text-sm text-text-muted">
                                            {t('checkout.bkashNagadDesc', 'Please enter your {{method}} account number. We will send an OTP for verification.', { method: paymentMethod === 'bkash' ? 'bKash' : 'Nagad' })}
                                        </p>
                                        <input type="text" placeholder="Account Number (e.g., 017...)" className={inputClass} />
                                    </div>
                                )}

                                {paymentMethod === 'paypal' && (
                                    <div className="p-4 bg-surface-bg rounded-xl text-sm text-text-muted border border-border-soft animate-fade-in">
                                        {t('checkout.paypalDesc', 'You will be redirected to PayPal to complete your purchase securely after clicking "Review Order".')}
                                    </div>
                                )}

                                {paymentMethod === 'cod' && (
                                    <div className="p-4 bg-surface-bg rounded-xl text-sm text-text-muted border border-border-soft animate-fade-in">
                                        {t('checkout.codDesc', 'Pay with cash upon delivery of your order. No advance payment required.')}
                                    </div>
                                )}

                                <div className="flex gap-3 mt-8">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="flex-1 py-3.5 text-sm font-medium text-text-muted border border-border-soft rounded-xl
                             hover:bg-surface-bg transition-colors"
                                    >
                                        {t('checkout.back', 'Back')}
                                    </button>
                                    <button
                                        onClick={() => { if (validatePayment()) setStep(3); }}
                                        className="flex-1 py-3.5 bg-brand-primary text-white font-semibold rounded-xl
                             hover:bg-brand-secondary transition-colors flex items-center justify-center gap-2"
                                    >
                                        {t('checkout.reviewOrder', 'Review Order')} <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Review */}
                        {step === 3 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-text-primary">{t('checkout.reviewTitle', 'Review Your Order')}</h2>

                                {/* Shipping summary */}
                                <div className="p-5 bg-surface-bg rounded-xl border border-border-soft">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                                            <MapPin size={14} className="text-brand-primary" /> {t('checkout.shippingTo', 'Shipping to')}
                                        </h4>
                                        <button onClick={() => setStep(1)} className="text-xs text-brand-primary font-medium hover:text-brand-secondary">{t('checkout.edit', 'Edit')}</button>
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
                                            <CreditCard size={14} className="text-brand-primary" /> {t('checkout.payment', 'Payment')}
                                        </h4>
                                        <button onClick={() => setStep(2)} className="text-xs text-brand-primary font-medium hover:text-brand-secondary">{t('checkout.edit', 'Edit')}</button>
                                    </div>
                                    <p className="text-sm text-text-muted">
                                        {paymentMethod === 'credit_card' && `Card ending in •••• ${(payment.cardNumber || '4242').slice(-4)}`}
                                        {paymentMethod === 'cod' && "Cash on Delivery"}
                                        {paymentMethod === 'bkash' && "bKash Digital Payment"}
                                        {paymentMethod === 'nagad' && "Nagad Digital Payment"}
                                        {paymentMethod === 'paypal' && "PayPal Account"}
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
                                                <span className="text-sm font-semibold text-text-primary">{formatPrice((p.price * item.quantity))}</span>
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
                                        {t('checkout.back', 'Back')}
                                    </button>
                                    <button
                                        onClick={handlePlaceOrder}
                                        className="flex-1 py-3.5 bg-brand-primary text-white font-semibold rounded-xl
                             hover:bg-brand-secondary transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20"
                                    >
                                        <Lock size={15} /> {t('checkout.placeOrder', 'Place Order')}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Order Summary Sidebar ──────────────────────── */}
                    <div className="lg:col-span-2">
                        <div className="sticky top-24 border border-border-soft rounded-2xl p-5">
                            <h3 className="text-base font-semibold text-text-primary mb-4">{t('checkout.orderSummary', 'Order Summary')}</h3>
                            <div className="space-y-2.5 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-text-muted">{t('checkout.subtotal', 'Subtotal')} ({cartSummary.length} {t('checkout.items', 'items')})</span>
                                    <span className="font-medium">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-muted">{t('checkout.shippingCost', 'Shipping')}</span>
                                    <span className={`font-medium ${shippingCost === 0 ? 'text-green-600' : ''}`}>
                                        {shippingCost === 0 ? t('checkout.free', 'Free') : `${formatPrice(shippingCost)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-muted">{t('checkout.tax', 'Est. Tax')}</span>
                                    <span className="font-medium">{formatPrice(tax)}</span>
                                </div>
                                <div className="border-t border-border-soft pt-2.5 flex justify-between">
                                    <span className="font-semibold text-text-primary">{t('checkout.total', 'Total')}</span>
                                    <span className="text-lg font-bold text-text-primary">{formatPrice(total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
