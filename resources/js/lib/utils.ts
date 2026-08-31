import type { InertiaLinkProps } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

export function formatNumber(val: string | number) {
    return parseFloat(String(val)).toLocaleString('id-ID');
}

export function getRemainingDays(expiredDateStr: string | null) {
    if (!expiredDateStr) return '-';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expired = new Date(expiredDateStr);
    expired.setHours(0, 0, 0, 0);
    
    const diffTime = expired.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Sudah Kedaluwarsa';
    if (diffDays === 0) return 'Hari ini';
    return `${diffDays} hari lagi`;
}

export function formatDate(dateStr: string | null) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatCurrency(value: number | string) {
    return `Rp ${parseFloat(value.toString()).toLocaleString('id-ID')}`;
}
