import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${import.meta.env.VITE_API_PREFIX || '/api'}`;

export default function AdvertisementCarousel() {
    const [ads, setAds]       = useState([]);
    const [current, setCurrent] = useState(0);
    const [loaded, setLoaded]   = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        fetch(`${API_BASE}/system/advertisements`)
            .then(r => r.ok ? r.json() : [])
            .then(data => { setAds(Array.isArray(data) ? data : []); setLoaded(true); })
            .catch(() => setLoaded(true));
    }, []);

    const next = useCallback(() => setCurrent(c => (c + 1) % ads.length), [ads.length]);
    const prev = useCallback(() => setCurrent(c => (c - 1 + ads.length) % ads.length), [ads.length]);

    useEffect(() => {
        if (ads.length <= 1) return;
        timerRef.current = setInterval(next, 5000);
        return () => clearInterval(timerRef.current);
    }, [ads.length, next]);

    const resetTimer = () => {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(next, 5000);
    };

    if (!loaded || ads.length === 0) return null;

    const ad = ads[current];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
                {/* Slide */}
                <div
                    key={ad.id}
                    className={`relative h-44 sm:h-56 lg:h-64 bg-gradient-to-r ${ad.bg_gradient ?? 'from-teal-500 to-cyan-400'} transition-all duration-500`}
                >
                    {ad.image_url && (
                        <img src={ad.image_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white px-8 max-w-2xl">
                            {ad.badge_text && (
                                <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-2 sm:mb-3">
                                    {ad.badge_text}
                                </span>
                            )}
                            <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold leading-tight mb-1 sm:mb-2">
                                {ad.title}
                            </h2>
                            {ad.subtitle && (
                                <p className="text-sm sm:text-base opacity-90 mb-3 sm:mb-4">{ad.subtitle}</p>
                            )}
                            {ad.cta_text && ad.cta_link && (
                                <Link
                                    to={ad.cta_link}
                                    className="inline-block bg-white text-gray-900 font-semibold text-xs sm:text-sm px-5 sm:px-6 py-2 sm:py-2.5 rounded-full hover:bg-white/90 transition-colors shadow-lg"
                                >
                                    {ad.cta_text}
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Prev/Next arrows */}
                    {ads.length > 1 && (
                        <>
                            <button
                                onClick={() => { prev(); resetTimer(); }}
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-black/25 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                onClick={() => { next(); resetTimer(); }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-black/25 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </>
                    )}
                </div>

                {/* Dots */}
                {ads.length > 1 && (
                    <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5">
                        {ads.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => { setCurrent(i); resetTimer(); }}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
