import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import type { Reseller } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EditDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    reseller: Reseller | null;
}

export function EditDialog({ open, onOpenChange, reseller }: EditDialogProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        reseller_code: '',
        reseller_name: '',
        phone_number: '',
        address: '',
    });

    useEffect(() => {
        if (reseller) {
            setData({
                reseller_code: reseller.reseller_code || '',
                reseller_name: reseller.reseller_name || '',
                phone_number: reseller.phone_number || '',
                address: reseller.address || '',
            });
        }
    }, [reseller]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reseller) return;

        put(`/resellers/${reseller.id}`, {
            onSuccess: () => {
                onOpenChange(false);
                reset();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Reseller</DialogTitle>
                    <DialogDescription>Ubah data reseller atau konsumen di sini.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-reseller-code">Kode Reseller</Label>
                            <Input
                                id="edit-reseller-code"
                                value={data.reseller_code}
                                disabled
                                className="bg-muted"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-reseller-name">Nama Reseller <span className="text-red-500">*</span></Label>
                            <Input
                                id="edit-reseller-name"
                                value={data.reseller_name}
                                onChange={(e) => setData('reseller_name', e.target.value)}
                                placeholder="Masukkan nama reseller"
                            />
                            {errors.reseller_name && <p className="text-sm text-red-500">{errors.reseller_name}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-phone">No. Telepon</Label>
                            <Input
                                id="edit-phone"
                                value={data.phone_number}
                                onChange={(e) => setData('phone_number', e.target.value)}
                                placeholder="Masukkan nomor telepon"
                            />
                            {errors.phone_number && <p className="text-sm text-red-500">{errors.phone_number}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-address">Alamat</Label>
                            <Input
                                id="edit-address"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                placeholder="Masukkan alamat"
                            />
                            {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={processing}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Simpan Perubahan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
