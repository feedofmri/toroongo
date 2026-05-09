import React, { useState, useEffect } from 'react';

/**
 * CountdownTimer Widget
 * FOMO widget with optional subtext, CTA link, expired message, and hide-seconds option.
 */
export default function CountdownTimer({
    heading,
    subtext,
    endDate,
    expiredMessage,
    targetUrl,
    showSeconds = true,
    backgroundColor,
    textColor = '#FFFFFF',
}) {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endDate));

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(endDate));
        }, 1000);
        return () => clearInterval(timer);
    }, [endDate]);

    const expired = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

    const wrapperStyle = {
        backgroundColor: backgroundColor || 'var(--seller-brand, #008080)',
        color: textColor,
        borderRadius: 'var(--seller-widget-radius, 1rem)',
    };

    if (expired) {
        return (
            <div className="py-12 px-6 text-center" style={wrapperStyle}>
                <p className="text-xl sm:text-2xl font-bold mb-4">
                    {expiredMessage || 'This sale has ended.'}
                </p>
                {targetUrl && (
                    <a
                        href={targetUrl}
                        className="inline-block mt-2 px-8 py-3 text-sm font-bold bg-white/20 hover:bg-white/30 border border-white/40 backdrop-blur-sm transition-colors rounded-xl"
                    >
                        Shop Now
                    </a>
                )}
            </div>
        );
    }

    const units = [
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Minutes', value: timeLeft.minutes },
        ...(showSeconds ? [{ label: 'Seconds', value: timeLeft.seconds }] : []),
    ];

    return (
        <div className="py-12 px-6 text-center" style={wrapperStyle}>
            {heading && (
                <h2
                    className="text-xl sm:text-3xl font-extrabold mb-2"
                    style={{ fontFamily: 'var(--seller-heading-font, inherit)' }}
                >
                    {heading}
                </h2>
            )}
            {subtext && (
                <p className="text-sm mb-8 opacity-85 max-w-md mx-auto">{subtext}</p>
            )}
            {!subtext && heading && <div className="mb-8" />}

            <div className="flex justify-center gap-3 sm:gap-6">
                {units.map((unit, i) => (
                    <React.Fragment key={unit.label}>
                        <div className="flex flex-col items-center">
                            <span
                                className="text-4xl sm:text-6xl font-bold tabular-nums bg-black/15 backdrop-blur-sm rounded-2xl min-w-[4rem] sm:min-w-[6rem] py-4 sm:py-5 mb-2 shadow-inner"
                            >
                                {String(unit.value).padStart(2, '0')}
                            </span>
                            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest opacity-85">
                                {unit.label}
                            </span>
                        </div>
                        {i < units.length - 1 && (
                            <div className="flex items-center pb-8 text-3xl sm:text-5xl font-bold opacity-60 select-none">:</div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            {targetUrl && (
                <a
                    href={targetUrl}
                    className="inline-block mt-8 px-8 py-3 text-sm font-bold bg-white/20 hover:bg-white/30 border border-white/40 backdrop-blur-sm transition-colors rounded-xl"
                >
                    Shop the Sale →
                </a>
            )}
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
