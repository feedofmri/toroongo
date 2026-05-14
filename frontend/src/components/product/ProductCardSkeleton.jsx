import React from 'react';
import Skeleton from '../ui/Skeleton';

/**
 * Skeleton loading state for ProductCard.
 * Matches the exact layout dimensions of the real ProductCard component.
 */
export default function ProductCardSkeleton() {
    return (
        <div className="flex flex-col bg-white rounded-2xl border border-border-soft overflow-hidden">
            {/* Image skeleton */}
            <Skeleton className="aspect-square" height="auto" rounded="rounded-none" />

            {/* Info skeleton */}
            <div className="flex flex-col p-2.5 sm:p-4 gap-2 sm:gap-2.5">
                {/* Seller */}
                <Skeleton width="40%" height="0.65rem" rounded="rounded" />

                {/* Title line 1 */}
                <Skeleton width="100%" height="0.75rem" rounded="rounded" />
                {/* Title line 2 */}
                <Skeleton width="70%" height="0.75rem" rounded="rounded" />

                {/* Rating */}
                <div className="flex gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} width="14px" height="14px" rounded="rounded-sm" />
                    ))}
                    <Skeleton width="2rem" height="0.65rem" rounded="rounded" className="ml-1" />
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mt-2">
                    <Skeleton width="4rem" height="1.25rem" rounded="rounded" />
                    <Skeleton width="3rem" height="0.75rem" rounded="rounded" />
                </div>
            </div>
        </div>
    );
}
