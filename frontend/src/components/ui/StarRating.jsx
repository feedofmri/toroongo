import React from 'react';
import { Star } from 'lucide-react';

/**
 * Renders a 5-star rating with optional review count.
 * Supports full, half, and empty star states.
 *
 * @param {number} rating - Numeric rating (0-5)
 * @param {number} [reviews] - Number of reviews to display
 * @param {string} [size] - Star icon size (default: 14)
 */
export default function StarRating({ rating = 0, reviews, size = 14 }) {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            // Full star
            stars.push(
                <Star
                    key={i}
                    size={size}
                    className="fill-amber-400 text-amber-400"
                />
            );
        } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
            // Half star — render full star with clip
            stars.push(
                <span key={i} className="relative inline-flex">
                    <Star size={size} className="text-gray-200" />
                    <span className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                        <Star size={size} className="fill-amber-400 text-amber-400" />
                    </span>
                </span>
            );
        } else {
            // Empty star
            stars.push(
                <Star
                    key={i}
                    size={size}
                    className="text-gray-200"
                />
            );
        }
    }

    return (
        <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">{stars}</div>
            {reviews !== undefined && (
                <span className="text-xs text-text-muted ml-1">
                    ({reviews.toLocaleString()})
                </span>
            )}
        </div>
    );
}
