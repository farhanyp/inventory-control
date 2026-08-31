import { Head, Link } from '@inertiajs/react';
import type { Sales } from '@/types/sales';
import { FileText, ArrowLeft, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SalesShowProps {
    sale: Sales;
}

export default function SalesShow({ sale }: SalesShowProps) {
    const formatCurrency = (value: string | number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(parseFloat(value as string));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    return (
        <>
            <Head title={`Detail Transaksi - ${sale.transaction_number}`} />
            <div className="flex flex-col gap-6 p-6 h-full bg-slate-50/50 dark:bg-transparent overflow-x-auto max-w-4xl mx-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <FileText className="w-6 h-6 text-primary" />
                            Detail Transaksi
                        </h2>
                        <p className="text-muted-foreground mt-1">Rincian penjualan dan riwayat pemotongan batch FEFO.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => window.print()} className="gap-2">
                            <Printer className="w-4 h-4" /> Cetak Struk
                        </Button>
                        <Link
                            href="/sales"
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Kembali
                        </Link>
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden print:shadow-none print:border-none">
                    {/* Header Struk */}
                    <div className="p-6 md:p-8 border-b flex flex-col md:flex-row justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-black text-primary mb-2">INVOICE</h1>
                            <p className="font-semibold text-lg">{sale.transaction_number}</p>
                            <p className="text-muted-foreground">{formatDate(sale.transaction_date)}</p>
                        </div>
                        <div className="md:text-right">
                            <p className="text-sm text-muted-foreground mb-1">Pelanggan (Reseller)</p>
                            <p className="font-medium text-lg">{sale.reseller?.name || 'Umum (Tanpa Nama)'}</p>
                            <p className="text-sm text-muted-foreground mt-4 mb-1">Kasir / Petugas</p>
                            <p className="font-medium">{sale.creator?.name || 'Sistem'}</p>
                        </div>
                    </div>

                    {/* Table Items */}
                    <div className="p-0 overflow-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr className="border-b">
                                    <th className="py-3 px-6 text-left font-medium text-muted-foreground">Item / Produk</th>
                                    <th className="py-3 px-6 text-left font-medium text-muted-foreground">Detail Batch (FEFO)</th>
                                    <th className="py-3 px-6 text-right font-medium text-muted-foreground">Harga</th>
                                    <th className="py-3 px-6 text-right font-medium text-muted-foreground">Qty</th>
                                    <th className="py-3 px-6 text-right font-medium text-muted-foreground">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sale.details?.map((detail) => (
                                    <tr key={detail.id} className="border-b last:border-0 hover:bg-muted/20">
                                        <td className="py-4 px-6 font-medium">{detail.product?.product_name}</td>
                                        <td className="py-4 px-6">
                                            <div className="text-xs text-muted-foreground">
                                                <p>Batch: <span className="font-mono text-foreground">{detail.batch_no}</span></p>
                                                <p>Exp: {new Date(detail.expired_date).toLocaleDateString('id-ID')}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right">{formatCurrency(detail.selling_price)}</td>
                                        <td className="py-4 px-6 text-right font-medium">{new Intl.NumberFormat('id-ID').format(parseFloat(detail.quantity as string))}</td>
                                        <td className="py-4 px-6 text-right font-bold">{formatCurrency(detail.subtotal)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer Summary */}
                    <div className="p-6 md:p-8 bg-muted/20 flex flex-col items-end gap-3 border-t">
                        <div className="flex justify-between w-full md:w-1/3">
                            <span className="text-muted-foreground">Total Tagihan:</span>
                            <span className="font-bold text-lg">{formatCurrency(sale.total)}</span>
                        </div>
                        <div className="flex justify-between w-full md:w-1/3 border-b pb-2">
                            <span className="text-muted-foreground">Metode Pembayaran:</span>
                            <span className="font-medium">{sale.payment_method}</span>
                        </div>
                        <div className="flex justify-between w-full md:w-1/3">
                            <span className="text-muted-foreground">Dibayar:</span>
                            <span className="font-medium">{formatCurrency(sale.paid_amount)}</span>
                        </div>
                        <div className="flex justify-between w-full md:w-1/3">
                            <span className="text-muted-foreground">Kembali:</span>
                            <span className="font-bold text-green-600">{formatCurrency(sale.change_amount)}</span>
                        </div>
                    </div>
                    {sale.description && (
                        <div className="p-6 border-t bg-muted/10">
                            <p className="text-sm font-semibold mb-1">Catatan:</p>
                            <p className="text-sm text-muted-foreground italic">{sale.description}</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
