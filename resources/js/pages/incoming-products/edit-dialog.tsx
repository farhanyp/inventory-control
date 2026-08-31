import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import type { IncomingProduct, Supplier, Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
    incomingProduct: IncomingProduct | null;
    suppliers: Supplier[];
    products: Product[];
    onSuccess?: () => void;
}

export function EditDialog({ open, onOpenChange, incomingProduct, suppliers, products, onSuccess }: EditDialogProps) {
    const { data, setData, put, processing, errors, reset, clearErrors } = useForm({
        incoming_date: '',
        invoice_number: '',
        supplier_id: '',
        product_id: '',
        batch_no: '',
        expired_date: '',
        quantity: '',
        purchase_price: '',
        description: '',
    });

    useEffect(() => {
        if (open) {
            if (incomingProduct) {
                setData({
                    incoming_date: incomingProduct.incoming_date ? incomingProduct.incoming_date.split('T')[0] : '', // Keep YYYY-MM-DD
                    invoice_number: incomingProduct.invoice_number || '',
                    supplier_id: incomingProduct.supplier_id ? incomingProduct.supplier_id.toString() : '',
                    product_id: incomingProduct.product_id ? incomingProduct.product_id.toString() : '',
                    batch_no: incomingProduct.batch_no || '',
                    expired_date: incomingProduct.expired_date ? incomingProduct.expired_date.split('T')[0] : '',
                    quantity: incomingProduct.quantity != null ? parseInt(String(incomingProduct.quantity), 10).toString() : '',
                    purchase_price: incomingProduct.purchase_price != null ? parseInt(String(incomingProduct.purchase_price), 10).toString() : '',
                    description: incomingProduct.description || '',
                });
            } else {
                reset();
            }
            clearErrors();
        }
    }, [incomingProduct, open]);

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (incomingProduct) {
            put(`/incoming-products/${incomingProduct.id}`, {
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

    const handleNumberChange = (field: 'quantity' | 'purchase_price', value: string) => {
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
            <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Barang Masuk</DialogTitle>
                    <DialogDescription>Perbarui data barang masuk.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleEdit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit_incoming_date">Tanggal Masuk</Label>
                                <Input
                                    id="edit_incoming_date"
                                    type="date"
                                    value={data.incoming_date}
                                    onChange={(e) => setData('incoming_date', e.target.value)}
                                />
                                {errors.incoming_date && <p className="text-sm text-destructive">{errors.incoming_date}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit_invoice_number">No. Invoice</Label>
                                <Input
                                    id="edit_invoice_number"
                                    value={data.invoice_number}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit_supplier_id">Supplier</Label>
                                <Select value={data.supplier_id} onValueChange={(val) => setData('supplier_id', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Supplier" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {suppliers.map((s) => (
                                            <SelectItem key={s.id} value={s.id.toString()}>{s.supplier_name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.supplier_id && <p className="text-sm text-destructive">{errors.supplier_id}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit_product_id">Produk</Label>
                                <Select value={data.product_id} onValueChange={(val) => setData('product_id', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Produk" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products.map((p) => (
                                            <SelectItem key={p.id} value={p.id.toString()}>{p.product_name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.product_id && <p className="text-sm text-destructive">{errors.product_id}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit_batch_no">No. Batch</Label>
                                <Input
                                    id="edit_batch_no"
                                    value={data.batch_no}
                                    disabled
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit_expired_date">Tanggal Kedaluwarsa</Label>
                                <Input
                                    id="edit_expired_date"
                                    type="date"
                                    value={data.expired_date}
                                    onChange={(e) => setData('expired_date', e.target.value)}
                                />
                                {errors.expired_date && <p className="text-sm text-destructive">{errors.expired_date}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit_quantity">Kuantitas</Label>
                                <Input
                                    id="edit_quantity"
                                    type="text"
                                    value={formatNumber(data.quantity)}
                                    onChange={(e) => handleNumberChange('quantity', e.target.value)}
                                />
                                {errors.quantity && <p className="text-sm text-destructive">{errors.quantity}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit_purchase_price">Harga Beli (Per Unit)</Label>
                                <Input
                                    id="edit_purchase_price"
                                    type="text"
                                    value={formatNumber(data.purchase_price)}
                                    onChange={(e) => handleNumberChange('purchase_price', e.target.value)}
                                />
                                {errors.purchase_price && <p className="text-sm text-destructive">{errors.purchase_price}</p>}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit_description">Keterangan (Opsional)</Label>
                            <Textarea
                                id="edit_description"
                                value={data.description}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                            />
                            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
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
