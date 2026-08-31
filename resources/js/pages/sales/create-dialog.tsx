import { useState, useMemo, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import type { Product } from '@/types/product';
import type { Reseller } from '@/types/reseller';
import { ShoppingBag, Plus, Trash2, Calculator, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CreateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    products: (Product & { total_stock: string | number })[];
    resellers: Reseller[];
}

export function CreateDialog({ open, onOpenChange, products, resellers }: CreateDialogProps) {
    const todayDate = new Date().toISOString().split('T')[0];

    const { data, setData, post, processing, errors, reset } = useForm({
        transaction_date: todayDate,
        customer_name: '',
        payment_method: 'Cash' as 'Cash' | 'Transfer',
        paid_amount: '',
        description: '',
        items: [] as { product_id: number; quantity: number; selling_price: number; product_name: string; total_stock: number }[],
    });

    const [selectedProductId, setSelectedProductId] = useState<string>('');
    const [inputQty, setInputQty] = useState<string>('1');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Reset form when opened
    useEffect(() => {
        if (open) {
            reset();
            setSelectedProductId('');
            setInputQty('1');
            setErrorMsg(null);
        }
    }, [open]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
    };

    const formatNumber = (value: string | number) => {
        if (!value) return '';
        const rawValue = String(value).replace(/[^\d]/g, '');
        if (!rawValue) return '';
        return new Intl.NumberFormat('id-ID').format(Number(rawValue));
    };

    const overallTotal = useMemo(() => {
        return data.items.reduce((sum, item) => sum + (item.selling_price * item.quantity), 0);
    }, [data.items]);

    const changeAmount = useMemo(() => {
        const paid = parseFloat(data.paid_amount) || 0;
        return paid - overallTotal;
    }, [data.paid_amount, overallTotal]);

    const handleAddItem = () => {
        if (!selectedProductId || !inputQty) return;

        const qty = parseFloat(inputQty);
        if (qty <= 0) {
            setErrorMsg('Kuantitas harus lebih dari 0');
            return;
        }

        const product = products.find(p => p.id.toString() === selectedProductId);
        if (!product) return;

        const maxStock = parseFloat(product.total_stock as string) || 0;

        const existingItemIndex = data.items.findIndex(i => i.product_id === product.id);

        let newQty = qty;
        if (existingItemIndex >= 0) {
            newQty = data.items[existingItemIndex].quantity + qty;
        }

        if (newQty > maxStock) {
            setErrorMsg(`Stok tidak mencukupi! Sisa stok untuk ${product.product_name} adalah ${maxStock}`);
            return;
        }

        const newItems = [...data.items];
        if (existingItemIndex >= 0) {
            newItems[existingItemIndex].quantity = newQty;
        } else {
            newItems.push({
                product_id: product.id,
                product_name: product.product_name,
                selling_price: parseFloat(product.selling_price as string),
                quantity: qty,
                total_stock: maxStock,
            });
        }

        setData('items', newItems);
        setSelectedProductId('');
        setInputQty('1');
    };

    const handleRemoveItem = (index: number) => {
        const newItems = [...data.items];
        newItems.splice(index, 1);
        setData('items', newItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (data.items.length === 0) {
            setErrorMsg('Keranjang belanja masih kosong!');
            return;
        }

        const paid = parseFloat(data.paid_amount) || 0;
        if (paid < overallTotal) {
            setErrorMsg('Jumlah uang bayar kurang dari total tagihan!');
            return;
        }

        post('/sales', {
            onSuccess: () => {
                onOpenChange(false);
            },
        });
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in-0 duration-200">
            <div className="relative flex flex-col bg-background text-foreground shadow-2xl rounded-xl w-full max-w-6xl max-h-[95vh] overflow-hidden border animate-in zoom-in-95 duration-200">

                {/* Header Modal */}
                <div className="flex items-center justify-between p-6 border-b bg-card">
                    <div>
                        <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                            <ShoppingBag className="w-6 h-6 text-primary" />
                            Kasir Baru
                        </h2>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Buat transaksi penjualan baru. Sistem menggunakan algoritma FEFO untuk memotong stok.
                        </p>
                    </div>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="rounded-full p-2 transition-colors hover:bg-muted focus:outline-none"
                    >
                        <X className="w-5 h-5 text-muted-foreground" />
                        <span className="sr-only">Close</span>
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-auto flex flex-col md:flex-row bg-slate-50/50 dark:bg-transparent">
                    {/* Left Panel: Form Info & Cart */}
                    <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">

                        {/* Transaction Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="transaction_date">Tanggal Transaksi <span className="text-destructive">*</span></Label>
                                <Input
                                    id="transaction_date"
                                    type="date"
                                    value={data.transaction_date}
                                    onChange={(e) => setData('transaction_date', e.target.value)}
                                    required
                                />
                                {errors.transaction_date && <p className="text-sm text-destructive">{errors.transaction_date}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="customer_name">Reseller (Opsional)</Label>
                                <Input
                                    id="customer_name"
                                    list="resellers-list"
                                    placeholder="Cari atau Ketik Baru..."
                                    value={data.customer_name}
                                    onChange={(e) => setData('customer_name', e.target.value)}
                                    autoComplete="off"
                                />
                                <datalist id="resellers-list">
                                    {resellers && resellers.map((reseller) => (
                                        <option key={reseller.id} value={reseller.reseller_name} />
                                    ))}
                                </datalist>
                                {errors.customer_name && <p className="text-sm text-destructive">{errors.customer_name}</p>}
                            </div>
                        </div>

                        {/* Add Item Row */}
                        <div className="flex flex-col md:flex-row gap-4 items-end bg-muted/30 p-4 rounded-lg border border-border">
                            <div className="space-y-2 flex-1">
                                <Label>Pilih Produk</Label>
                                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="-- Pilih Produk --" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products.map(p => (
                                            <SelectItem key={p.id} value={p.id.toString()}>
                                                {p.product_name} - Sisa Stok: {parseFloat(p.total_stock.toString()).toLocaleString('id-ID')}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 w-full md:w-32">
                                <Label>Qty</Label>
                                <Input
                                    type="text"
                                    value={inputQty ? formatNumber(inputQty) : ''}
                                    onChange={(e) => {
                                        const rawValue = e.target.value.replace(/\D/g, '');
                                        setInputQty(rawValue);
                                    }}
                                    className="text-right"
                                    placeholder="1"
                                />
                            </div>
                            <Button type="button" onClick={handleAddItem} className="gap-2 shrink-0">
                                <Plus className="w-4 h-4" />
                                Tambah
                            </Button>
                        </div>

                        {/* Cart Table */}
                        <div className="border rounded-md overflow-hidden bg-card flex-1 shadow-sm">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                    <tr className="border-b">
                                        <th className="h-10 px-4 text-left font-medium">Produk</th>
                                        <th className="h-10 px-4 text-right font-medium hidden sm:table-cell">Harga</th>
                                        <th className="h-10 px-4 text-right font-medium">Qty</th>
                                        <th className="h-10 px-4 text-right font-medium">Subtotal</th>
                                        <th className="h-10 px-4 text-center font-medium w-12">#</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.items.map((item, index) => (
                                        <tr key={index} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                                            <td className="p-4">{item.product_name}</td>
                                            <td className="p-4 text-right hidden sm:table-cell">{formatCurrency(item.selling_price)}</td>
                                            <td className="p-4 text-right">{formatNumber(item.quantity)}</td>
                                            <td className="p-4 text-right font-medium">{formatCurrency(item.selling_price * item.quantity)}</td>
                                            <td className="p-4 text-center">
                                                <button type="button" onClick={() => handleRemoveItem(index)} className="text-destructive hover:text-destructive/80 p-1 bg-destructive/10 rounded-md transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {data.items.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="p-12 text-center text-muted-foreground">Keranjang masih kosong</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {errors.items && <p className="text-sm text-destructive">{errors.items}</p>}

                    </div>

                    {/* Right Panel: Payment & Summary */}
                    <div className="w-full md:w-80 border-l bg-card flex flex-col overflow-y-auto">
                        <div className="bg-primary p-6 text-primary-foreground text-right shrink-0">
                            <p className="text-sm font-medium text-primary-foreground/80 mb-1">Total Tagihan</p>
                            <h2 className="text-3xl font-bold tracking-tighter truncate" title={formatCurrency(overallTotal)}>{formatCurrency(overallTotal)}</h2>
                        </div>
                        <div className="p-6 flex flex-col gap-5 shrink-0">
                            <div className="space-y-2">
                                <Label>Metode Pembayaran</Label>
                                <Select value={data.payment_method} onValueChange={(val: any) => setData('payment_method', val)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Cash">Cash (Tunai)</SelectItem>
                                        <SelectItem value="Transfer">Transfer Bank</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Nominal Uang Bayar <span className="text-destructive">*</span></Label>
                                <Input
                                    type="text"
                                    value={data.paid_amount ? formatNumber(data.paid_amount) : ''}
                                    onChange={(e) => {
                                        const rawValue = e.target.value.replace(/\D/g, '');
                                        setData('paid_amount', rawValue);
                                    }}
                                    required
                                    className="text-right text-lg font-bold h-12"
                                    placeholder="0"
                                />
                                {errors.paid_amount && <p className="text-sm text-destructive">{errors.paid_amount}</p>}
                            </div>

                            <div className="rounded-lg bg-muted p-4 flex justify-between items-center border">
                                <span className="font-medium text-muted-foreground">Kembalian</span>
                                <span className={`text-xl font-bold ${changeAmount < 0 ? 'text-destructive' : 'text-green-600'}`}>
                                    {formatCurrency(changeAmount < 0 ? 0 : changeAmount)}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <Label>Keterangan Tambahan</Label>
                                <Input
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Catatan..."
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 text-base gap-2 mt-4 font-semibold"
                                disabled={processing || data.items.length === 0 || (parseFloat(data.paid_amount) || 0) < overallTotal}
                            >
                                <Calculator className="w-5 h-5" />
                                {processing ? 'Memproses...' : 'Simpan Transaksi'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Error Modal Popup */}
            {errorMsg && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in-0 duration-200">
                    <div className="bg-background text-foreground shadow-2xl rounded-xl max-w-sm w-full p-6 border animate-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-bold text-destructive mb-3">Peringatan</h3>
                        <p className="text-muted-foreground mb-6 leading-relaxed">{errorMsg}</p>
                        <div className="flex justify-end">
                            <Button onClick={() => setErrorMsg(null)}>Tutup</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
