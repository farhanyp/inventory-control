import React from 'react';
import { useForm } from '@inertiajs/react';
import type { Category, Unit } from '@/types';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface CreateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    categories: Category[];
    units: Unit[];
    onSuccess?: () => void;
}

export function CreateDialog({ open, onOpenChange, categories, units, onSuccess }: CreateDialogProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        product_name: '',
        category_id: '',
        unit_id: '',
        purchase_price: '',
        selling_price: '',
        min_stock: '',
        status: 'active',
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/products', {
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

    const handleNumberChange = (field: 'purchase_price' | 'selling_price' | 'min_stock', value: string) => {
        const rawValue = value.replace(/[^\d]/g, '');
        setData(field, rawValue);
    };

    const formatNumber = (value: string | number) => {
        if (!value) return '';
        const rawValue = String(value).replace(/[^\d]/g, '');
        if (!rawValue) return '';
        return new Intl.NumberFormat('id-ID').format(Number(rawValue));
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Tambah Produk</DialogTitle>
                    <DialogDescription>Masukkan detail produk baru.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreate}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="product_name">Nama Produk</Label>
                            <Input
                                id="product_name"
                                value={data.product_name}
                                onChange={(e) => setData('product_name', e.target.value)}
                                placeholder="Contoh: Kopi Bubuk"
                            />
                            {errors.product_name && <p className="text-sm text-destructive">{errors.product_name}</p>}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="category_id">Kategori</Label>
                                <Select value={data.category_id} onValueChange={(val) => setData('category_id', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((c) => (
                                            <SelectItem key={c.id} value={c.id.toString()}>{c.category_name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category_id && <p className="text-sm text-destructive">{errors.category_id}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="unit_id">Satuan</Label>
                                <Select value={data.unit_id} onValueChange={(val) => setData('unit_id', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Satuan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {units.map((u) => (
                                            <SelectItem key={u.id} value={u.id.toString()}>{u.unit_name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.unit_id && <p className="text-sm text-destructive">{errors.unit_id}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="purchase_price">Harga Beli</Label>
                                <Input
                                    id="purchase_price"
                                    type="text"
                                    value={formatNumber(data.purchase_price)}
                                    onChange={(e) => handleNumberChange('purchase_price', e.target.value)}
                                    placeholder="Contoh: 10.000"
                                />
                                {errors.purchase_price && <p className="text-sm text-destructive">{errors.purchase_price}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="selling_price">Harga Jual</Label>
                                <Input
                                    id="selling_price"
                                    type="text"
                                    value={formatNumber(data.selling_price)}
                                    onChange={(e) => handleNumberChange('selling_price', e.target.value)}
                                    placeholder="Contoh: 15.000"
                                />
                                {errors.selling_price && <p className="text-sm text-destructive">{errors.selling_price}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="min_stock">Stok Minimal</Label>
                                <Input
                                    id="min_stock"
                                    type="text"
                                    value={formatNumber(data.min_stock)}
                                    onChange={(e) => handleNumberChange('min_stock', e.target.value)}
                                    placeholder="Contoh: 10"
                                />
                                {errors.min_stock && <p className="text-sm text-destructive">{errors.min_stock}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={data.status} onValueChange={(val) => setData('status', val as any)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                            </div>
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
