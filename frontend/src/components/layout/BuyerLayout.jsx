import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import LiveChatWidget from '../ui/LiveChatWidget';

export default function BuyerLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
            <LiveChatWidget />
        </div>
    );
}
