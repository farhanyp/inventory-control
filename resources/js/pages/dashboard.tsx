import { Head } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { Package, AlertTriangle, Clock, TrendingUp } from 'lucide-react';
import { formatNumber, getRemainingDays } from '@/lib/utils';
import type { DashboardProps } from '@/types/dashboard';

export default function Dashboard({ metrics, lowStockTop, expiringTop, recentIncoming }: DashboardProps) {
    return (
        <>
            <Head title="Dasbor" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 md:p-6 bg-slate-50/50 dark:bg-transparent">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {/* Card 1: Total Produk */}
                    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-4 md:p-6 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Produk Aktif</p>
                                <h3 className="text-xl md:text-2xl font-bold tracking-tight">{formatNumber(metrics.totalProducts)}</h3>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Low Stock */}
                    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-4 md:p-6 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                                <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Stok Menipis</p>
                                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-orange-600 dark:text-orange-400">
                                    {formatNumber(metrics.lowStockCount)} <span className="text-sm font-normal text-muted-foreground">produk</span>
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Expiring Soon */}
                    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-4 md:p-6 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                                <Clock className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Mendekati Kedaluwarsa</p>
                                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-red-600 dark:text-red-400">
                                    {formatNumber(metrics.expiringCount)} <span className="text-sm font-normal text-muted-foreground">batch</span>
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Low Stock List as Cards */}
                    <div className="rounded-xl border border-border bg-card shadow-sm flex flex-col">
                        <div className="border-b border-border p-4">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-orange-500" /> 
                                Top 5 Produk Stok Menipis
                            </h3>
                        </div>
                        <div className="p-4 flex-1 flex flex-col gap-3">
                            {lowStockTop.map(product => (
                                <div key={product.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-lg border border-border/50 bg-muted/10 hover:bg-muted/20 transition-colors">
                                    <div className="mb-2 sm:mb-0">
                                        <p className="font-medium text-sm md:text-base">{product.product_name}</p>
                                        <p className="text-xs text-muted-foreground">Batas Min: {formatNumber(product.min_stock)}</p>
                                    </div>
                                    <div className="text-left sm:text-right">
                                        <p className="text-sm font-bold text-orange-600">Sisa {formatNumber((product as any).total_stock || 0)}</p>
                                    </div>
                                </div>
                            ))}
                            {lowStockTop.length === 0 && (
                                <div className="p-8 text-center text-muted-foreground">Stok semua produk dalam keadaan aman.</div>
                            )}
                        </div>
                    </div>

                    {/* Expiring Batches List as Cards */}
                    <div className="rounded-xl border border-border bg-card shadow-sm flex flex-col">
                        <div className="border-b border-border p-4">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Clock className="h-5 w-5 text-red-500" /> 
                                Top 5 Batch Mendekati Kedaluwarsa
                            </h3>
                        </div>
                        <div className="p-4 flex-1 flex flex-col gap-3">
                            {expiringTop.map(batch => (
                                <div key={batch.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-lg border border-border/50 bg-muted/10 hover:bg-muted/20 transition-colors">
                                    <div className="mb-2 sm:mb-0">
                                        <p className="font-medium text-sm md:text-base">{batch.product?.product_name}</p>
                                        <p className="text-xs text-muted-foreground">Batch: {batch.batch_no}</p>
                                    </div>
                                    <div className="text-left sm:text-right">
                                        <p className="text-sm font-bold text-red-600">{getRemainingDays(batch.expired_date)}</p>
                                    </div>
                                </div>
                            ))}
                            {expiringTop.length === 0 && (
                                <div className="p-8 text-center text-muted-foreground">Tidak ada batch yang mendekati kedaluwarsa.</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Incoming List as Cards */}
                <div className="rounded-xl border border-border bg-card shadow-sm">
                    <div className="border-b border-border p-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-green-500" /> 
                            Barang Masuk Terbaru
                        </h3>
                    </div>
                    <div className="p-4 flex flex-col gap-3">
                        {recentIncoming.map(incoming => (
                            <div key={incoming.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-lg border border-border/50 bg-muted/10 hover:bg-muted/20 transition-colors">
                                <div className="mb-2 sm:mb-0">
                                    <p className="font-medium text-sm md:text-base">{incoming.product?.product_name}</p>
                                    <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                                        <span>{incoming.invoice_number}</span>
                                        <span>•</span>
                                        <span>{incoming.supplier?.supplier_name}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start sm:items-end w-full sm:w-auto mt-1 sm:mt-0">
                                    <p className="text-sm font-bold text-green-600">+{formatNumber(incoming.quantity)}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(incoming.created_at || incoming.incoming_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {recentIncoming.length === 0 && (
                            <div className="p-8 text-center text-muted-foreground">Belum ada riwayat transaksi barang masuk.</div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dasbor',
            href: dashboard(),
        },
    ],
};
