/**
 * Date and Currency Formatters for StockLuhh
 * Using Malaysian locale (ms-MY) and Ringgit (RM)
 */

import { format, formatDistanceToNow, differenceInDays, parseISO, isValid } from 'date-fns';
import { DEFAULT_SETTINGS } from './constants';

/**
 * Format a date string to Malaysian format (dd/MM/yyyy)
 * @param dateString - ISO date string or Date object
 * @param formatStr - Optional custom format (default: dd/MM/yyyy)
 * @returns Formatted date string
 */
export function formatDate(
    dateString: string | Date | undefined | null,
    formatStr: string = DEFAULT_SETTINGS.dateFormat
): string {
    if (!dateString) return '-';

    try {
        const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
        if (!isValid(date)) return '-';
        return format(date, formatStr);
    } catch {
        return '-';
    }
}

/**
 * Format currency in Malaysian Ringgit (RM)
 * @param amount - Number to format
 * @param showSymbol - Whether to show RM symbol
 * @returns Formatted currency string
 */
export function formatCurrency(
    amount: number | undefined | null,
    showSymbol: boolean = true
): string {
    if (amount === undefined || amount === null) return '-';

    const formatted = amount.toLocaleString('ms-MY', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return showSymbol ? `${DEFAULT_SETTINGS.currency}${formatted}` : formatted;
}

/**
 * Get relative time (e.g., "2 days ago", "in 3 days")
 * @param dateString - ISO date string
 * @returns Relative time string
 */
export function formatRelativeDate(dateString: string | undefined | null): string {
    if (!dateString) return '-';

    try {
        const date = parseISO(dateString);
        if (!isValid(date)) return '-';
        return formatDistanceToNow(date, { addSuffix: true });
    } catch {
        return '-';
    }
}

/**
 * Calculate days until a date (positive = future, negative = past)
 * @param dateString - ISO date string
 * @returns Number of days, or null if invalid
 */
export function getDaysUntil(dateString: string | undefined | null): number | null {
    if (!dateString) return null;

    try {
        const date = parseISO(dateString);
        if (!isValid(date)) return null;
        return differenceInDays(date, new Date());
    } catch {
        return null;
    }
}

/**
 * Get urgency level for expiry dates
 * @param expiryDate - ISO date string
 * @returns Urgency object with label and color classes
 */
export function getExpiryUrgency(expiryDate: string | undefined | null): {
    label: string;
    color: string;
    bg: string;
    level: 'expired' | 'critical' | 'warning' | 'safe';
} {
    const days = getDaysUntil(expiryDate);

    if (days === null) {
        return { label: 'No expiry', color: 'text-muted-foreground', bg: 'bg-muted', level: 'safe' };
    }

    if (days < 0) {
        return { label: 'Expired', color: 'text-stock-expired', bg: 'bg-stock-expired/10', level: 'expired' };
    }

    if (days <= 7) {
        return { label: 'This week', color: 'text-stock-empty', bg: 'bg-stock-empty/10', level: 'critical' };
    }

    if (days <= 14) {
        return { label: '2 weeks', color: 'text-stock-low', bg: 'bg-stock-low/10', level: 'warning' };
    }

    if (days <= 30) {
        return { label: '30 days', color: 'text-stock-good', bg: 'bg-stock-good/10', level: 'safe' };
    }

    return { label: 'Good', color: 'text-stock-full', bg: 'bg-stock-full/10', level: 'safe' };
}

/**
 * Format quantity with unit
 * @param quantity - Number
 * @param unit - Optional unit string
 * @returns Formatted string
 */
export function formatQuantity(quantity: number, unit?: string): string {
    if (unit) {
        return `${quantity} ${unit}`;
    }
    return quantity === 1 ? '1 item' : `${quantity} items`;
}

/**
 * Format file size (for potential future image uploads)
 * @param bytes - Size in bytes
 * @returns Formatted size string
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
