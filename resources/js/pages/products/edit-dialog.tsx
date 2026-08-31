import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import type { Product, Category, Unit } from '@/types';
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

interface EditDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product: Product | null;
    categories: Category[];
    units: Unit[];
    onSuccess?: () => void;
}

export function EditDialog({ open, onOpenChange, product, categories, units, onSuccess }: EditDialogProps) {
    const { data, setData, put, processing, errors, reset, clearErrors } = useForm({
        product_name: '',
        category_id: '',
        unit_id: '',
        purchase_price: '',
        selling_price: '',
        min_stock: '',
        status: 'active',
    });

    useEffect(() => {
        if (open) {
            if (product) {
                setData({
                    product_name: product.product_name || '',
                    category_id: product.category_id ? product.category_id.toString() : '',
                    unit_id: product.unit_id ? product.unit_id.toString() : '',
                    purchase_price: product.purchase_price != null ? parseInt(String(product.purchase_price), 10).toString() : '',
                    selling_price: product.selling_price != null ? parseInt(String(product.selling_price), 10).toString() : '',
                    min_stock: product.min_stock != null ? parseInt(String(product.min_stock), 10).toString() : '',
                    status: product.status || 'active',
                });
            } else {
                reset();
            }
            clearErrors();
        }
    }, [product, open]);

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (product) {
            put(`/products/${product.id}`, {
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
                    <DialogTitle>Edit Produk</DialogTitle>
                    <DialogDescription>Perbarui data produk.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleEdit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit_product_code">Kode Produk</Label>
                            <Input
                                id="edit_product_code"
                                value={product?.product_code || ''}
                                disabled
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit_product_name">Nama Produk</Label>
                            <Input
                                id="edit_product_name"
                                value={data.product_name}
                                onChange={(e) => setData('product_name', e.target.value)}
                            />
                            {errors.product_name && <p className="text-sm text-destructive">{errors.product_name}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit_category_id">Kategori</Label>
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
                                <Label htmlFor="edit_unit_id">Satuan</Label>
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
                                <Label htmlFor="edit_purchase_price">Harga Beli</Label>
                                <Input
                                    id="edit_purchase_price"
                                    type="text"
                                    value={formatNumber(data.purchase_price)}
                                    onChange={(e) => handleNumberChange('purchase_price', e.target.value)}
                                />
                                {errors.purchase_price && <p className="text-sm text-destructive">{errors.purchase_price}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit_selling_price">Harga Jual</Label>
                                <Input
                                    id="edit_selling_price"
                                    type="text"
                                    value={formatNumber(data.selling_price)}
                                    onChange={(e) => handleNumberChange('selling_price', e.target.value)}
                                />
                                {errors.selling_price && <p className="text-sm text-destructive">{errors.selling_price}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit_min_stock">Stok Minimal</Label>
                                <Input
                                    id="edit_min_stock"
                                    type="text"
                                    value={formatNumber(data.min_stock)}
                                    onChange={(e) => handleNumberChange('min_stock', e.target.value)}
                                />
                                {errors.min_stock && <p className="text-sm text-destructive">{errors.min_stock}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit_status">Status</Label>
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
                        <Button type="submit" disabled={processing}>Simpan Perubahan</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
