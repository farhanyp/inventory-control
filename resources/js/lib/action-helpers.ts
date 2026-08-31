import { router } from '@inertiajs/react';

/**
 * Menampilkan konfirmasi sebelum menghapus data.
 * @param url URL untuk menghapus data.
 * @param message Pesan konfirmasi yang akan ditampilkan.
 */
export function confirmDelete(url: string, message: string = 'Apakah Anda yakin ingin menghapus data ini?') {
    if (window.confirm(message)) {
        router.delete(url, {
            preserveScroll: true,
        });
    }
}
