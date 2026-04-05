import React from 'react';

/**
 * Reusable skeleton placeholder block with a shimmer animation.
 * Use to build skeleton loading states that match real component layouts.
 */
export default function Skeleton({ className = '', width, height, rounded = 'rounded-md', ...props }) {
    return (
        <div
            className={`bg-gray-200 animate-skeleton ${rounded} ${className}`}
            style={{
                width: width || '100%',
                height: height || '1rem',
            }}
            {...props}
        />
    );
}
