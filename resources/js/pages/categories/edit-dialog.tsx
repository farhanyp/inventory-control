import React, { useEffect } from 'react';
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
import type { CategoryActionDialogProps } from '@/types/category';

export function EditDialog({ open, onOpenChange, category, onSuccess }: CategoryActionDialogProps) {
    const { data, setData, put, processing, errors, reset, clearErrors } = useForm({
        category_name: '',
    });

    // Populate form when category changes
    useEffect(() => {
        if (category) {
            setData('category_name', category.category_name);
        } else {
            reset();
        }
        clearErrors();
    }, [category]);

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (category) {
            put(`/categories/${category.id}`, {
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
                    <DialogTitle>Edit Kategori</DialogTitle>
                    <DialogDescription>Perbarui nama kategori.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleEdit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit_category_name">Nama Kategori</Label>
                            <Input
                                id="edit_category_name"
                                value={data.category_name}
                                onChange={(e) => setData('category_name', e.target.value)}
                            />
                            {errors.category_name && <p className="text-sm text-destructive">{errors.category_name}</p>}
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
