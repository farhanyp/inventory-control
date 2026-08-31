import React from 'react';
import { useForm } from '@inertiajs/react';
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

interface CreateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function CreateDialog({ open, onOpenChange, onSuccess }: CreateDialogProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        supplier_name: '',
        phone_number: '',
        address: '',
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/suppliers', {
            onSuccess: () => {
                onOpenChange(false);
                reset();
                if (onSuccess) onSuccess();
            },
        });
    };

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            reset();
        }
        onOpenChange(isOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tambah Supplier</DialogTitle>
                    <DialogDescription>Masukkan data supplier baru.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreate}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="supplier_name">Nama Supplier</Label>
                            <Input
                                id="supplier_name"
                                value={data.supplier_name}
                                onChange={(e) => setData('supplier_name', e.target.value)}
                                placeholder="Contoh: PT. Sumber Makmur"
                            />
                            {errors.supplier_name && <p className="text-sm text-destructive">{errors.supplier_name}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone_number">No. Telepon (Opsional)</Label>
                            <Input
                                id="phone_number"
                                value={data.phone_number}
                                onChange={(e) => setData('phone_number', e.target.value)}
                                placeholder="Contoh: 08123456789"
                            />
                            {errors.phone_number && <p className="text-sm text-destructive">{errors.phone_number}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="address">Alamat (Opsional)</Label>
                            <Input
                                id="address"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                placeholder="Contoh: Jl. Merdeka No. 10"
                            />
                            {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>Batal</Button>
                        <Button type="submit" disabled={processing}>Simpan</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
