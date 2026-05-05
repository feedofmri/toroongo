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
                await handleGoogleCallback(location.search);
                navigate('/'); // Redirect to home on success
            } catch (error) {
                console.error('Google Auth Error:', error);
                navigate('/login?error=google_failed');
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
