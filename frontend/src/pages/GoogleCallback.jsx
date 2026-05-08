import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function GoogleCallback() {
    const location = useLocation();
    const navigate = useNavigate();
    const { handleGoogleCallback } = useAuth();
    const processingRef = useRef(false);

    useEffect(() => {
        if (processingRef.current) return;

        const processCallback = async () => {
            processingRef.current = true;
            try {
                const savedRole = localStorage.getItem('auth_role') || 'buyer';
                const savedIntent = localStorage.getItem('auth_intent') || 'signup';
                const queryParams = location.search + 
                    (location.search.includes('?') ? '&' : '?') + 
                    `role=${savedRole}&intent=${savedIntent}`;
                
                const user = await handleGoogleCallback(queryParams);
                
                const savedRedirect = localStorage.getItem('auth_redirect');
                localStorage.removeItem('auth_role');
                localStorage.removeItem('auth_intent');

                // Check if profile is complete
                const isSellerMissingInfo = user.role === 'seller' && (!user.store_name || !user.country);
                const isBuyerMissingInfo = user.role === 'buyer' && !user.country;

                if (isSellerMissingInfo || isBuyerMissingInfo) {
                    const redirectParam = savedRedirect ? `&redirect=${encodeURIComponent(savedRedirect)}` : '';
                    navigate(`/signup?complete_profile=true${redirectParam}`);
                    return;
                }

                if (savedRedirect) {
                    localStorage.removeItem('auth_redirect');
                    navigate(savedRedirect);
                } else {
                    navigate('/'); // Redirect to home on success
                }
            } catch (error) {
                console.error('Google auth error:', error);
                const errorMessage = error.response?.data?.message || error.message || 'google_failed';
                navigate(`/login?error=${encodeURIComponent(errorMessage)}`);
            }
        };

        if (location.search) {
            processCallback();
        } else {
            navigate('/login');
        }
    }, [location.search, handleGoogleCallback, navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-surface-bg">
            <Loader2 className="w-12 h-12 text-brand-primary animate-spin mb-4" />
            <p className="text-text-primary font-medium">Authenticating with Google...</p>
        </div>
    );
}
