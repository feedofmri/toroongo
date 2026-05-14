import React, { useState } from 'react';

/**
 * ImageZoom Component
 * Provides a premium hover-to-zoom effect for images.
 * 
 * @param {string} src - Image source URL
 * @param {string} alt - Alt text for the image
 * @param {string} className - Additional CSS classes for the container
 */
export default function ImageZoom({ src, alt, className = "" }) {
    const [zoomStyle, setZoomStyle] = useState({
        transformOrigin: 'center center',
        transform: 'scale(1)'
    });
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        
        // Calculate mouse position relative to the element
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        
        setZoomStyle({
            transformOrigin: `${x}% ${y}%`,
            transform: 'scale(2.2)' // Adjust zoom level here
        });
    };

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        setZoomStyle({
            transformOrigin: 'center center',
            transform: 'scale(1)'
        });
    };

    return (
        <div 
            className={`relative overflow-hidden cursor-crosshair h-full w-full ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <img
                src={src}
                alt={alt}
                className={`w-full h-full object-cover transition-transform duration-500 ease-out
                           ${isHovering ? 'opacity-100' : ''}`}
                style={zoomStyle}
            />
            
            {/* Optional: Add a subtle overlay or indicator when not hovering */}
            {!isHovering && (
                <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        <line x1="11" y1="8" x2="11" y2="14"></line>
                        <line x1="8" y1="11" x2="14" y2="11"></line>
                    </svg>
                </div>
            )}
        </div>
    );
}
