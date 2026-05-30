import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './i18n'; // Import i18n config

import { AuthProvider } from './context/AuthProvider'
import { CartProvider } from './context/CartContext'
import { ProductProvider } from './context/ProductContext'
import { WishlistProvider } from './context/WishlistContext'

import { NotificationProvider } from './context/NotificationProvider.jsx'
import { SubscriptionProvider } from './context/SubscriptionProvider.jsx'

import React, { Suspense } from 'react';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <SubscriptionProvider>
        <NotificationProvider>
          <WishlistProvider>
            <ProductProvider>
              <CartProvider>
                <Suspense fallback={<div>Loading...</div>}>
                  <App />
                </Suspense>
              </CartProvider>
            </ProductProvider>
          </WishlistProvider>
        </NotificationProvider>
      </SubscriptionProvider>
    </AuthProvider>
  </StrictMode>,
)
