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
        unit_name: '',
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/units', {
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
                    <DialogTitle>Tambah Satuan</DialogTitle>
                    <DialogDescription>Masukkan nama satuan baru.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreate}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="unit_name">Nama Satuan</Label>
                            <Input
                                id="unit_name"
                                value={data.unit_name}
                                onChange={(e) => setData('unit_name', e.target.value)}
                                placeholder="Contoh: Pcs, Kg, Dus"
                            />
                            {errors.unit_name && <p className="text-sm text-destructive">{errors.unit_name}</p>}
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
