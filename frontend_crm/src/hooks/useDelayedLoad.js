import { useState, useEffect } from 'react';

/**
 * Simulates an API loading delay to demonstrate skeleton loaders.
 * @param {*} sourceData - The data to "load" after the delay.
 * @param {number} delayMs - How long to show skeleton state (default: 800ms).
 * @returns {{ data: *, isLoading: boolean }}
 */
export function useDelayedLoad(sourceData, delayMs = 800) {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        setData(null);

        const timer = setTimeout(() => {
            setData(sourceData);
            setIsLoading(false);
        }, delayMs);

        return () => clearTimeout(timer);
    }, [sourceData, delayMs]); // re-run when data or delay changes

    return { data, isLoading };
}
