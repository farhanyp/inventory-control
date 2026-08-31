import { useState, Fragment } from 'react';
import { Head } from '@inertiajs/react';
import type { BatchStock, BatchStocksIndexProps } from '@/types';
import { AlertCircle, CheckCircle2, AlertTriangle, Clock, Info, ChevronDown, ChevronUp, Layers, Box } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Pagination } from '@/components/pagination';
import { getRemainingDays, formatNumber } from '@/lib/utils';
import { groupByKey } from '@/lib/helpers';

type ExpandedGroups = Record<number, boolean>;

export default function BatchStocksIndex({ batchStocks }: BatchStocksIndexProps) {
    const [expandedGroups, setExpandedGroups] = useState<ExpandedGroups>({});

    const toggleGroup = (productId: number) => {
        setExpandedGroups(prev => ({ ...prev, [productId]: !prev[productId] }));
    };

    const getStatusBadge = (status?: string) => {
        const renderBadge = (icon: React.ReactNode, text: string, colorClass: string, pulse = false) => (
            <TooltipProvider delayDuration={100}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 sm:px-2.5 sm:py-1 text-xs font-semibold ring-1 ring-inset cursor-help ${colorClass} ${pulse ? 'animate-pulse' : ''}`}>
                            {icon}
                            <span className="hidden sm:inline">{text}</span>
                        </span>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{text}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );

        switch (status) {
            case 'Aman':
                return renderBadge(<CheckCircle2 className="w-3.5 h-3.5" />, 'Aman', 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 dark:text-emerald-400');
            case 'Hampir Expired':
                return renderBadge(<AlertTriangle className="w-3.5 h-3.5" />, 'Hampir Kedaluwarsa', 'bg-orange-500/10 text-orange-600 ring-orange-500/20 dark:text-orange-400');
            case 'Expired':
                return renderBadge(<AlertCircle className="w-3.5 h-3.5" />, 'Kedaluwarsa', 'bg-rose-500/10 text-rose-600 ring-rose-500/20 dark:text-rose-400', true);
            default:
                return renderBadge(<span className="w-3.5 h-3.5 inline-block text-center leading-none">-</span>, '-', 'bg-gray-500/10 text-gray-600 ring-gray-500/20');
        }
    };

    const groupedBatchStocks = groupByKey(batchStocks.data, 'product_id');

    return (
        <>
            <Head title="Stok & Kedaluwarsa" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
                <div className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm text-card-foreground shadow-sm overflow-hidden flex flex-col">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 md:p-6 gap-4 border-b border-border/50 bg-gradient-to-r from-card to-muted/20">
                        <div className="flex flex-col gap-1.5">
                            <h3 className="text-lg md:text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                                <Box className="w-5 h-5 text-primary" />
                                Monitoring Stok & Kedaluwarsa
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Pantau sisa stok produk per batch dan kelola status kedaluwarsanya dengan mudah.
                            </p>
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <button type="button" className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 hover:bg-muted/80 transition-colors px-3 py-1.5 rounded-md border border-border/50 cursor-pointer">
                                    <Info className="w-4 h-4" />
                                    <span>Status Warna</span>
                                    <div className="w-4 h-4 rounded-full border border-muted-foreground/30 flex items-center justify-center ml-1">
                                        <span className="text-[10px] font-bold">?</span>
                                    </div>
                                </button>
                            </DialogTrigger>
                            <DialogContent className="max-w-[90vw] sm:max-w-[400px]">
                                <DialogHeader>
                                    <DialogTitle>Indikator Warna</DialogTitle>
                                    <DialogDescription>
                                        Berikut adalah penjelasan status kedaluwarsa berdasarkan sisa hari:
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="p-2">
                                    <ul className="space-y-3">
                                        <li className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-emerald-500" /> <span className="text-emerald-500 font-medium">Aman:</span> &gt; 30 Hari</li>
                                        <li className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-orange-500" /> <span className="text-orange-500 font-medium">Hampir Kedaluwarsa:</span> 0 - 30 Hari</li>
                                        <li className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-rose-500" /> <span className="text-rose-500 font-medium">Kedaluwarsa:</span> Terlewat</li>
                                    </ul>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                    
                    <div className="p-4 md:p-6 bg-muted/5">
                        {groupedBatchStocks.length === 0 ? (
                            <div className="h-32 flex flex-col items-center justify-center gap-2 text-muted-foreground border border-dashed border-border/60 rounded-xl bg-card/50">
                                <Box className="w-8 h-8 opacity-20" />
                                <p>Belum ada data stok per batch.</p>
                            </div>
                        ) : (
                            <>
                                {/* Tampilan Desktop (Table) */}
                                <div className="hidden md:block relative w-full overflow-auto rounded-md border border-border/50">
                                    <table className="w-full caption-bottom text-sm">
                                        <thead className="[&_tr]:border-b bg-muted/30">
                                            <tr className="border-b transition-colors hover:bg-muted/50">
                                                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground w-12"></th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-48">Status Kedaluwarsa</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Produk</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Supplier</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Batch</th>
                                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Awal</th>
                                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Sisa Stok</th>
                                            </tr>
                                        </thead>
                                        <tbody className="[&_tr:last-child]:border-0 bg-card">
                                            {groupedBatchStocks.map((group) => {
                                                const isMultiple = group.length > 1;
                                                const firstItem = group[0];
                                                const isExpanded = expandedGroups[firstItem.product_id] || false;
                                                
                                                const totalRemaining = group.reduce((sum, item) => sum + parseFloat(item.remaining_quantity.toString()), 0);
                                                const totalInitial = group.reduce((sum, item) => sum + parseFloat(item.initial_quantity.toString()), 0);
                                                const uniqueSuppliers = Array.from(new Set(group.map(item => item.incoming_product?.supplier?.supplier_name || '-')));
                                                const supplierText = uniqueSuppliers.length > 1 ? 'Berbagai Supplier' : uniqueSuppliers[0];
                                                
                                                return (
                                                    <Fragment key={`desktop-group-${firstItem.product_id}`}>
                                                        <tr 
                                                            className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${isMultiple ? 'cursor-pointer' : ''}`}
                                                            onClick={isMultiple ? () => toggleGroup(firstItem.product_id) : undefined}
                                                        >
                                                            <td className="p-4 align-middle text-center">
                                                                {isMultiple && (
                                                                    <div className="flex justify-center items-center h-full">
                                                                        <div className={`p-1 rounded-md transition-colors ${isExpanded ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                                                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="p-4 align-middle whitespace-nowrap">
                                                                {isMultiple ? (
                                                                    <span className="text-muted-foreground italic text-xs">Berbagai Status</span>
                                                                ) : (
                                                                    <div className="flex items-center gap-2">
                                                                        {getStatusBadge(firstItem.expired_status)}
                                                                        <span className="text-xs font-medium text-muted-foreground">
                                                                            {getRemainingDays(firstItem.expired_date)}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="p-4 align-middle font-medium">
                                                                {firstItem.product?.product_name || '-'}
                                                                {isMultiple && (
                                                                    <span className="ml-2 inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider border border-primary/20">
                                                                        <Layers className="w-3 h-3" /> {group.length} Batch
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="p-4 align-middle">
                                                                {isMultiple ? <span className="italic opacity-80">{supplierText}</span> : firstItem.incoming_product?.supplier?.supplier_name || '-'}
                                                            </td>
                                                            <td className="p-4 align-middle text-muted-foreground">
                                                                {isMultiple ? '-' : firstItem.batch_no}
                                                            </td>
                                                            <td className="p-4 align-middle text-right font-medium">
                                                                {formatNumber(totalInitial)}
                                                            </td>
                                                            <td className="p-4 align-middle text-right font-bold text-primary">
                                                                {formatNumber(totalRemaining)}
                                                            </td>
                                                        </tr>
                                                        {isMultiple && isExpanded && group.map((item) => (
                                                            <tr key={`desktop-item-${item.id}`} className="border-b transition-colors bg-muted/20 hover:bg-muted/30">
                                                                <td className="p-3"></td>
                                                                <td className="p-3 align-middle whitespace-nowrap">
                                                                    <div className="flex items-center gap-2">
                                                                        {getStatusBadge(item.expired_status)}
                                                                        <span className="text-xs font-medium text-muted-foreground">
                                                                            {getRemainingDays(item.expired_date)}
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td className="p-3 align-middle text-sm text-muted-foreground">
                                                                    Rincian Batch Produk
                                                                </td>
                                                                <td className="p-3 align-middle text-sm text-muted-foreground">
                                                                    {item.incoming_product?.supplier?.supplier_name || '-'}
                                                                </td>
                                                                <td className="p-3 align-middle text-sm">
                                                                    <span className="font-mono bg-background px-1.5 py-0.5 rounded text-xs border border-border/50 text-foreground">{item.batch_no}</span>
                                                                </td>
                                                                <td className="p-3 align-middle text-right text-sm">
                                                                    {formatNumber(item.initial_quantity)}
                                                                </td>
                                                                <td className="p-3 align-middle text-right text-sm font-semibold text-primary/90">
                                                                    {formatNumber(item.remaining_quantity)}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </Fragment>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Tampilan Mobile (Cards) */}
                                <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {groupedBatchStocks.map((group) => {
                                        const isMultiple = group.length > 1;
                                        const firstItem = group[0];
                                        const isExpanded = expandedGroups[firstItem.product_id] || false;
                                        
                                        const totalRemaining = group.reduce((sum, item) => sum + parseFloat(item.remaining_quantity.toString()), 0);
                                        const totalInitial = group.reduce((sum, item) => sum + parseFloat(item.initial_quantity.toString()), 0);
                                        const uniqueSuppliers = Array.from(new Set(group.map(item => item.incoming_product?.supplier?.supplier_name || '-')));
                                        const supplierText = uniqueSuppliers.length > 1 ? 'Berbagai Supplier' : uniqueSuppliers[0];
                                        
                                        return (
                                            <div key={`mobile-group-${firstItem.product_id}`} className={`flex flex-col rounded-xl border transition-all duration-200 ${isExpanded ? 'border-primary/50 shadow-md ring-1 ring-primary/20' : 'border-border/60 bg-card shadow-sm hover:shadow-md hover:border-primary/30'}`}>
                                                <div 
                                                    className={`p-4 flex flex-col gap-3 ${isMultiple ? 'cursor-pointer hover:bg-muted/30' : ''}`}
                                                    onClick={isMultiple ? () => toggleGroup(firstItem.product_id) : undefined}
                                                >
                                                    <div className="flex justify-between items-start gap-2">
                                                        <div className="flex flex-col gap-1 flex-1">
                                                            {isMultiple ? (
                                                                <span className="inline-flex w-fit items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider border border-primary/20 mb-1">
                                                                    <Layers className="w-3 h-3" /> {group.length} Batch
                                                                </span>
                                                            ) : (
                                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                                    {getStatusBadge(firstItem.expired_status)}
                                                                    <span className="text-[10px] font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md border border-border/40">
                                                                        {getRemainingDays(firstItem.expired_date)}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            <h4 className="font-semibold text-lg text-foreground leading-tight line-clamp-2">
                                                                {firstItem.product?.product_name || '-'}
                                                            </h4>
                                                            <p className="text-sm text-muted-foreground mt-0.5">
                                                                Supplier: {isMultiple ? <span className="italic opacity-80">{supplierText}</span> : <span className="font-medium text-foreground/80">{supplierText}</span>}
                                                            </p>
                                                        </div>
                                                        {isMultiple && (
                                                            <div className={`p-1.5 rounded-full transition-colors ${isExpanded ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                                                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    {!isMultiple && (
                                                        <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground bg-muted/30 p-2 rounded-lg border border-border/30 mt-1">
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] uppercase tracking-wider font-semibold opacity-70">Batch Number</span>
                                                                <span className="font-mono text-foreground font-medium">{firstItem.batch_no}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    <div className="flex items-end justify-between pt-3 mt-1 border-t border-border/30">
                                                        <div className="flex flex-col">
                                                            <span className="text-xs text-muted-foreground mb-0.5">Kuantitas Awal</span>
                                                            <span className="text-base font-semibold text-foreground">{formatNumber(totalInitial)}</span>
                                                        </div>
                                                        <div className="flex flex-col items-end">
                                                            <span className="text-xs text-muted-foreground mb-0.5">Sisa Stok</span>
                                                            <span className="text-lg font-bold text-primary">{formatNumber(totalRemaining)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {isMultiple && isExpanded && (
                                                    <div className="bg-muted/20 border-t border-border/50 flex flex-col p-3 gap-3 rounded-b-xl shadow-inner">
                                                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1">Rincian Batch Produk</p>
                                                        {group.map((item) => (
                                                            <div key={`mobile-item-${item.id}`} className="flex flex-col p-3 rounded-lg border border-border/60 bg-card shadow-sm gap-2 relative">
                                                                <div className="flex justify-between items-start">
                                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                                        {getStatusBadge(item.expired_status)}
                                                                        <span className="text-[10px] font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded border border-border/40">
                                                                            {getRemainingDays(item.expired_date)}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-2 mt-1">
                                                                    <div className="flex flex-col">
                                                                        <span className="text-[10px] text-muted-foreground uppercase">Supplier</span>
                                                                        <span className="text-sm font-medium line-clamp-1">{item.incoming_product?.supplier?.supplier_name || '-'}</span>
                                                                    </div>
                                                                    <div className="flex flex-col items-end">
                                                                        <span className="text-[10px] text-muted-foreground uppercase">Batch</span>
                                                                        <span className="font-mono text-xs text-primary bg-primary/5 px-1.5 py-0.5 rounded border border-primary/20">{item.batch_no}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between items-center mt-2 pt-2 border-t border-border/40">
                                                                    <div className="flex flex-col">
                                                                        <span className="text-xs text-muted-foreground mb-0.5">Awal</span>
                                                                        <span className="text-sm font-semibold">{formatNumber(item.initial_quantity)}</span>
                                                                    </div>
                                                                    <div className="flex flex-col items-end">
                                                                        <span className="text-xs text-muted-foreground mb-0.5">Sisa</span>
                                                                        <span className="text-sm font-bold text-primary">{formatNumber(item.remaining_quantity)}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                    <div className="p-4 border-t border-border/50 bg-muted/10">
                        <Pagination links={batchStocks.links} />
                    </div>
                </div>
            </div>
        </>
    );
}

BatchStocksIndex.layout = {
    breadcrumbs: [
        {
            title: 'Stok & Kedaluwarsa',
            href: '/batch-stocks',
        },
    ],
};
