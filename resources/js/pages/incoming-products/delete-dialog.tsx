import React from 'react';
import { useForm } from '@inertiajs/react';
import type { IncomingProduct } from '@/types';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';

interface DeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    incomingProduct: IncomingProduct | null;
    onSuccess?: () => void;
}

export function DeleteDialog({ open, onOpenChange, incomingProduct, onSuccess }: DeleteDialogProps) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        if (incomingProduct) {
            destroy(`/incoming-products/${incomingProduct.id}`, {
                onSuccess: () => {
                    onOpenChange(false);
                    if (onSuccess) onSuccess();
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Hapus Barang Masuk</DialogTitle>
                    <DialogDescription>
                        Apakah Anda yakin ingin menghapus data transaksi barang masuk dengan invoice <strong>{incomingProduct?.invoice_number}</strong>? Tindakan ini tidak dapat dibatalkan.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
                    <Button type="button" variant="destructive" onClick={handleDelete} disabled={processing}>Hapus</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
