import React, { useState, useEffect } from 'react';

/**
 * CountdownTimer Widget
 * FOMO widget for flash sales or limited-time offers.
 */
export default function CountdownTimer({ heading, endDate, backgroundColor, textColor = '#FFFFFF' }) {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endDate));

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(endDate));
        }, 1000);
        return () => clearInterval(timer);
    }, [endDate]);

    const units = [
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Minutes', value: timeLeft.minutes },
        { label: 'Seconds', value: timeLeft.seconds },
    ];

    return (
        <div
            className="py-10 px-6 text-center"
            style={{
                backgroundColor: backgroundColor || 'var(--seller-brand, #008080)',
                color: textColor,
                borderRadius: 'var(--seller-widget-radius, 1rem)',
            }}
        >
            {heading && (
                <h2 className="text-xl sm:text-2xl font-bold mb-6" style={{ fontFamily: 'var(--seller-heading-font, inherit)' }}>
                    {heading}
                </h2>
            )}
            <div className="flex justify-center gap-4 sm:gap-6">
                {units.map((unit) => (
                    <div key={unit.label} className="flex flex-col items-center">
                        <span className="text-3xl sm:text-5xl font-bold tabular-nums bg-black/10 backdrop-blur-sm rounded-xl min-w-[3.5rem] sm:min-w-[5rem] py-3 sm:py-4 mb-2 shadow-inner">
                            {String(unit.value).padStart(2, '0')}
                        </span>
                        <span className="text-[10px] sm:text-xs font-semibold opacity-90 uppercase tracking-widest">
                            {unit.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function calculateTimeLeft(endDate) {
    const diff = Math.max(0, new Date(endDate).getTime() - Date.now());
    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
    };
}
