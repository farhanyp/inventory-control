import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import type { Supplier } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';

interface EditDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    supplier: Supplier | null;
    onSuccess?: () => void;
}

export function EditDialog({ open, onOpenChange, supplier, onSuccess }: EditDialogProps) {
    const { data, setData, put, processing, errors, reset, clearErrors } = useForm({
        supplier_code: '',
        supplier_name: '',
        phone_number: '',
        address: '',
    });

    useEffect(() => {
        if (supplier) {
            setData({
                supplier_code: supplier.supplier_code || '',
                supplier_name: supplier.supplier_name || '',
                phone_number: supplier.phone_number || '',
                address: supplier.address || '',
            });
        } else {
            reset();
        }
        clearErrors();
    }, [supplier]);

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (supplier) {
            put(`/suppliers/${supplier.id}`, {
                onSuccess: () => {
                    onOpenChange(false);
                    if (onSuccess) onSuccess();
                },
            });
        }
    };

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            reset();
            clearErrors();
        }
        onOpenChange(isOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Supplier</DialogTitle>
                    <DialogDescription>Perbarui data supplier.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleEdit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit_supplier_code">Kode Supplier</Label>
                            <Input
                                id="edit_supplier_code"
                                value={data.supplier_code}
                                disabled
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit_supplier_name">Nama Supplier</Label>
                            <Input
                                id="edit_supplier_name"
                                value={data.supplier_name}
                                onChange={(e) => setData('supplier_name', e.target.value)}
                            />
                            {errors.supplier_name && <p className="text-sm text-destructive">{errors.supplier_name}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit_phone_number">No. Telepon (Opsional)</Label>
                            <Input
                                id="edit_phone_number"
                                value={data.phone_number}
                                onChange={(e) => setData('phone_number', e.target.value)}
                            />
                            {errors.phone_number && <p className="text-sm text-destructive">{errors.phone_number}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit_address">Alamat (Opsional)</Label>
                            <Input
                                id="edit_address"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                            />
                            {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>Batal</Button>
                        <Button type="submit" disabled={processing}>Simpan Perubahan</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
