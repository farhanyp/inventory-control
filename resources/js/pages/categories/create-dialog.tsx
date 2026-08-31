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
import type { CategoryDialogProps } from '@/types/category';

export function CreateDialog({ open, onOpenChange, onSuccess }: CategoryDialogProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        category_name: '',
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/categories', {
            onSuccess: () => {
                onOpenChange(false);
                reset();
                if (onSuccess) onSuccess();
            },
        });
    };

    // Reset form when dialog closes without saving
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
                    <DialogTitle>Tambah Kategori</DialogTitle>
                    <DialogDescription>Masukkan nama kategori baru.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreate}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="category_name">Nama Kategori</Label>
                            <Input
                                id="category_name"
                                value={data.category_name}
                                onChange={(e) => setData('category_name', e.target.value)}
                                placeholder="Contoh: Elektronik"
                            />
                            {errors.category_name && <p className="text-sm text-destructive">{errors.category_name}</p>}
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
