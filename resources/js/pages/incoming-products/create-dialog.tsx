import React from 'react';
import { useForm } from '@inertiajs/react';
import type { Supplier, Product } from '@/types';
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

interface CreateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    suppliers: Supplier[];
    products: Product[];
    onSuccess?: () => void;
}

export function CreateDialog({ open, onOpenChange, suppliers, products, onSuccess }: CreateDialogProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
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

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/incoming-products', {
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
                    <DialogTitle>Tambah Barang Masuk</DialogTitle>
                    <DialogDescription>Masukkan detail barang masuk baru.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreate}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="incoming_date">Tanggal Masuk</Label>
                            <Input
                                id="incoming_date"
                                type="date"
                                value={data.incoming_date}
                                onChange={(e) => setData('incoming_date', e.target.value)}
                            />
                            {errors.incoming_date && <p className="text-sm text-destructive">{errors.incoming_date}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="supplier_id">Supplier</Label>
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
                                <Label htmlFor="product_id">Produk</Label>
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

                        <div className="grid gap-2">
                            <Label htmlFor="expired_date">Tanggal Kedaluwarsa</Label>
                            <Input
                                id="expired_date"
                                type="date"
                                value={data.expired_date}
                                onChange={(e) => setData('expired_date', e.target.value)}
                            />
                            {errors.expired_date && <p className="text-sm text-destructive">{errors.expired_date}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="quantity">Kuantitas</Label>
                                <Input
                                    id="quantity"
                                    type="text"
                                    value={formatNumber(data.quantity)}
                                    onChange={(e) => handleNumberChange('quantity', e.target.value)}
                                    placeholder="Contoh: 100"
                                />
                                {errors.quantity && <p className="text-sm text-destructive">{errors.quantity}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="purchase_price">Harga Beli (Per Unit)</Label>
                                <Input
                                    id="purchase_price"
                                    type="text"
                                    value={formatNumber(data.purchase_price)}
                                    onChange={(e) => handleNumberChange('purchase_price', e.target.value)}
                                    placeholder="Contoh: 10.000"
                                />
                                {errors.purchase_price && <p className="text-sm text-destructive">{errors.purchase_price}</p>}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Keterangan (Opsional)</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                                placeholder="Tambahkan catatan jika ada..."
                            />
                            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
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
