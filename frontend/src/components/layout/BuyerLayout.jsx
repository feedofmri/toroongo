import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * Layout wrapper for all buyer-facing pages.
 * Renders Navbar at the top, child route via <Outlet />, and Footer at the bottom.
 */
export default function BuyerLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
