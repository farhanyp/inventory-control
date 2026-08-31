import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import type { Unit } from '@/types';
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
    unit: Unit | null;
    onSuccess?: () => void;
}

export function EditDialog({ open, onOpenChange, unit, onSuccess }: EditDialogProps) {
    const { data, setData, put, processing, errors, reset, clearErrors } = useForm({
        unit_name: '',
    });

    useEffect(() => {
        if (unit) {
            setData('unit_name', unit.unit_name);
        } else {
            reset();
        }
        clearErrors();
    }, [unit]);

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (unit) {
            put(`/units/${unit.id}`, {
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
                    <DialogTitle>Edit Satuan</DialogTitle>
                    <DialogDescription>Perbarui nama satuan.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleEdit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit_unit_name">Nama Satuan</Label>
                            <Input
                                id="edit_unit_name"
                                value={data.unit_name}
                                onChange={(e) => setData('unit_name', e.target.value)}
                            />
                            {errors.unit_name && <p className="text-sm text-destructive">{errors.unit_name}</p>}
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
