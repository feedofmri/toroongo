import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BuyerLayout from './components/layout/BuyerLayout';
import BuyerDashboardLayout from './components/layout/BuyerDashboardLayout';
import Homepage from './pages/buyer/Homepage';
import SearchResults from './pages/buyer/SearchResults';
import ProductDetail from './pages/buyer/ProductDetail';
import ShoppingCart from './pages/buyer/ShoppingCart';
import Checkout from './pages/buyer/Checkout';
import OrderConfirmation from './pages/buyer/OrderConfirmation';
import AuthPage from './pages/buyer/AuthPage';
import OrderHistory from './pages/buyer/OrderHistory';
import Wishlist from './pages/buyer/Wishlist';
import AccountSettings from './pages/buyer/AccountSettings';
import MessageCenter from './pages/buyer/MessageCenter';
import SellerLayout from './components/layout/SellerLayout';
import StoreHome from './pages/seller/StoreHome';
import StoreCatalog from './pages/seller/StoreCatalog';
import StoreAbout from './pages/seller/StoreAbout';
import StorePolicies from './pages/seller/StorePolicies';

// ─── Placeholder pages (to be built in later phases) ─────────
function PlaceholderPage({ title }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-text-primary mb-4">{title}</h1>
        <p className="text-text-muted">This page is coming soon.</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* ── Buyer Experience ──────────────────────────────── */}
        <Route element={<BuyerLayout />}>
          <Route index element={<Homepage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<ShoppingCart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />

          {/* Auth */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/forgot-password" element={<AuthPage />} />

          {/* Buyer Dashboard */}
          <Route path="/account" element={<BuyerDashboardLayout />}>
            <Route index element={<OrderHistory />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="settings" element={<AccountSettings />} />
            <Route path="messages" element={<MessageCenter />} />
          </Route>

          {/* Seller storefront (public) */}
          <Route path="/shop/:slug" element={<SellerLayout />}>
            <Route index element={<StoreHome />} />
            <Route path="products" element={<StoreCatalog />} />
            <Route path="about" element={<StoreAbout />} />
            <Route path="policies" element={<StorePolicies />} />
          </Route>

          {/* Static pages */}
          <Route path="/about" element={<PlaceholderPage title="About Toroongo" />} />
          <Route path="/sell" element={<PlaceholderPage title="Sell on Toroongo" />} />
          <Route path="/help" element={<PlaceholderPage title="Help Center" />} />
          <Route path="/contact" element={<PlaceholderPage title="Contact Us" />} />
          <Route path="/terms" element={<PlaceholderPage title="Terms of Service" />} />
          <Route path="/privacy" element={<PlaceholderPage title="Privacy Policy" />} />
          <Route path="/shipping" element={<PlaceholderPage title="Shipping & Delivery" />} />
          <Route path="/returns" element={<PlaceholderPage title="Returns & Refunds" />} />

          {/* 404 */}
          <Route path="*" element={<PlaceholderPage title="Page Not Found" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
