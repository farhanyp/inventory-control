import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { AlertCircle } from 'lucide-react';
import type { Unit } from '@/types';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface DeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    unit: Unit | null;
    onSuccess?: () => void;
}

export function DeleteDialog({ open, onOpenChange, unit, onSuccess }: DeleteDialogProps) {
    const { delete: destroy, processing, errors, clearErrors } = useForm<{ message: string }>();

    useEffect(() => {
        if (!open) {
            clearErrors();
        }
    }, [open, clearErrors]);

    const handleDelete = () => {
        if (unit) {
            destroy(`/units/${unit.id}`, {
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
                    <DialogTitle>Hapus Satuan</DialogTitle>
                    <DialogDescription>
                        Apakah Anda yakin ingin menghapus satuan <strong>{unit?.unit_name}</strong>? Tindakan ini tidak dapat dibatalkan.
                    </DialogDescription>
                </DialogHeader>
                
                {errors.message && (
                    <Alert variant="destructive" className="mt-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Gagal Menghapus</AlertTitle>
                        <AlertDescription>{errors.message}</AlertDescription>
                    </Alert>
                )}

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
                    <Button type="button" variant="destructive" onClick={handleDelete} disabled={processing}>Hapus</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
