import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import type { Sales } from '@/types/sales';
import type { Product } from '@/types/product';
import type { Reseller } from '@/types/reseller';
import { ShoppingCart, Plus, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreateDialog } from './create-dialog';
import { Pagination } from '@/components/pagination';

interface SalesIndexProps {
    sales: {
        data: Sales[];
        current_page: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    products: (Product & { total_stock: string | number })[];
    resellers: Reseller[];
}

export default function SalesIndex({ sales, products, resellers }: SalesIndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const formatCurrency = (value: string | number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(parseFloat(value as string));
    };

    return (
        <>
            <Head title="Kasir / Penjualan" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6 bg-slate-50/50 dark:bg-transparent">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <ShoppingCart className="w-6 h-6 text-primary" />
                            Riwayat Penjualan
                        </h2>
                        <p className="text-muted-foreground mt-1">Daftar transaksi penjualan yang telah dilakukan.</p>
                    </div>
                    <Button
                        onClick={() => setIsCreateOpen(true)}
                        className="h-10 px-4 py-2 gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Transaksi Baru
                    </Button>
                </div>

                <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex-1">
                    <div className="p-0 overflow-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr className="border-b">
                                    <th className="h-12 px-4 text-left font-medium text-muted-foreground">No. Transaksi</th>
                                    <th className="h-12 px-4 text-left font-medium text-muted-foreground">Tanggal</th>
                                    <th className="h-12 px-4 text-left font-medium text-muted-foreground">Pelanggan (Reseller)</th>
                                    <th className="h-12 px-4 text-left font-medium text-muted-foreground">Metode Bayar</th>
                                    <th className="h-12 px-4 text-right font-medium text-muted-foreground">Total Belanja</th>
                                    <th className="h-12 px-4 text-center font-medium text-muted-foreground">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sales.data.map((item) => (
                                    <tr key={item.id} className="border-b transition-colors hover:bg-muted/50 last:border-0">
                                        <td className="p-4 font-medium">{item.transaction_number}</td>
                                        <td className="p-4">{new Date(item.transaction_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                        <td className="p-4">{item.reseller?.name || '-'}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${item.payment_method === 'Cash' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                                {item.payment_method}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right font-bold text-primary">{formatCurrency(item.total)}</td>
                                        <td className="p-4 text-center">
                                            <Link
                                                href={`/sales/${item.id}`}
                                                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent hover:text-accent-foreground h-8 w-8"
                                                title="Lihat Detail"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {sales.data.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="h-24 text-center text-muted-foreground">
                                            Belum ada data transaksi penjualan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-border/50 bg-muted/10">
                        <Pagination links={sales.links} />
                    </div>
                </div>
            </div>

            <CreateDialog 
                open={isCreateOpen} 
                onOpenChange={setIsCreateOpen} 
                products={products}
                resellers={resellers}
            />
        </>
    );
}
