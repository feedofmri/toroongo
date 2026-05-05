<?php

namespace App\Utils;

class CurrencyHelper
{
    /**
     * Conversion rates relative to 1 USD.
     * To convert USD -> Currency: multiply by rate.
     * To convert Currency -> USD: divide by rate.
     */
    public const RATES = [
        'USD' => 1.0,
        'BDT' => 120.0,
        'INR' => 85.0,
        'NPR' => 135.0,
        'MYR' => 4.7,
        'IDR' => 16000.0,
        'AED' => 3.67,
        'SAR' => 3.75,
        'QAR' => 3.64,
        'KWD' => 0.31,
        'EGP' => 48.0,
        'JOD' => 0.71,
    ];

    /**
     * Convert an amount from one currency to another.
     *
     * @param float $amount
     * @param string $from
     * @param string $to
     * @return float
     */
    public static function convert(float $amount, string $from, string $to): float
    {
        $from = strtoupper($from);
        $to = strtoupper($to);

        if ($from === $to) {
            return $amount;
        }

        $fromRate = self::RATES[$from] ?? 1.0;
        $toRate = self::RATES[$to] ?? 1.0;

        // Convert to USD first, then to target currency
        $inUsd = $amount / $fromRate;
        return round($inUsd * $toRate, 2);
    }
}
