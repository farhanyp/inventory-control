import { useState, Fragment } from 'react';
import { Head } from '@inertiajs/react';
import type { IncomingProduct, Supplier, Product, IncomingProductsIndexProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Plus, ChevronDown, ChevronUp, Layers, PackagePlus } from 'lucide-react';
import { CreateDialog } from './create-dialog';
import { EditDialog } from './edit-dialog';
import { DeleteDialog } from './delete-dialog';
import { CannotDeleteDialog } from './cannot-delete-dialog';
import { Pagination } from '@/components/pagination';
import { formatDate, formatCurrency, formatNumber } from '@/lib/utils';
import { groupByKey } from '@/lib/helpers';
import type { ExpandedGroups } from './types';

export default function IncomingProductsIndex({ incomingProducts, suppliers, products }: IncomingProductsIndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isCannotDeleteOpen, setIsCannotDeleteOpen] = useState(false);
    const [selectedIncoming, setSelectedIncoming] = useState<IncomingProduct | null>(null);
    const [expandedGroups, setExpandedGroups] = useState<ExpandedGroups>({});

    const handleOpenCreate = () => {
        setIsCreateOpen(true);
    };

    const handleOpenEdit = (incoming: IncomingProduct) => {
        setSelectedIncoming(incoming);
        setIsEditOpen(true);
    };

    const handleOpenDelete = (incoming: IncomingProduct) => {
        setSelectedIncoming(incoming);
        
        let isUsed = false;
        if (incoming.batch_stocks && incoming.batch_stocks.length > 0) {
            const batch = incoming.batch_stocks[0];
            if (Number(batch.remaining_quantity) < Number(batch.initial_quantity)) {
                isUsed = true;
            }
        }
        
        if (isUsed) {
            setIsCannotDeleteOpen(true);
        } else {
            setIsDeleteOpen(true);
        }
    };

    const toggleGroup = (productId: number) => {
        setExpandedGroups(prev => ({ ...prev, [productId]: !prev[productId] }));
    };

    const groupedIncoming = groupByKey(incomingProducts.data, 'product_id');

    return (
        <>
            <Head title="Barang Masuk" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
                <div className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm text-card-foreground shadow-sm flex flex-col">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 md:p-6 gap-4 border-b border-border/50 bg-gradient-to-r from-card to-muted/20">
                        <div className="flex flex-col gap-1.5">
                            <h3 className="text-lg md:text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                                <PackagePlus className="w-5 h-5 text-primary" />
                                Transaksi Barang Masuk
                            </h3>
                            <p className="text-sm text-muted-foreground">Kelola riwayat transaksi penerimaan dan pengadaan stok (Restock).</p>
                        </div>
                        <Button onClick={handleOpenCreate} className="flex items-center gap-2 h-10 px-5 shadow-sm w-full sm:w-auto">
                            <Plus className="w-4 h-4" />
                            Tambah Transaksi
                        </Button>
                    </div>
                    
                    <div className="p-4 md:p-6 bg-muted/5">
                        {groupedIncoming.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border/60 rounded-xl bg-card/50">
                                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                                    <PackagePlus className="w-6 h-6 text-muted-foreground/50" />
                                </div>
                                <h4 className="text-base font-medium text-foreground mb-1">Belum ada riwayat transaksi barang masuk.</h4>
                                <p className="text-sm text-muted-foreground max-w-sm">Data pengadaan stok masih kosong. Silakan tambah transaksi baru.</p>
                            </div>
                        ) : (
                            <>
                                {/* Desktop View (Table) */}
                                <div className="hidden md:block relative w-full overflow-auto rounded-md border border-border/50">
                                    <table className="w-full caption-bottom text-sm">
                                        <thead className="[&_tr]:border-b bg-muted/30">
                                            <tr className="border-b transition-colors hover:bg-muted/50">
                                                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground w-12"></th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-32">Tgl Masuk</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Produk</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Supplier</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Invoice</th>
                                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Kuantitas</th>
                                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Total</th>
                                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground w-32">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="[&_tr:last-child]:border-0 bg-card">
                                            {groupedIncoming.map((group) => {
                                                const isMultiple = group.length > 1;
                                                const firstItem = group[0];
                                                const isExpanded = expandedGroups[firstItem.product_id] || false;
                                                
                                                const totalQty = group.reduce((sum, item) => sum + parseFloat(item.quantity.toString()), 0);
                                                const totalAmount = group.reduce((sum, item) => sum + parseFloat(item.total.toString()), 0);
                                                const uniqueSuppliers = Array.from(new Set(group.map(item => item.supplier?.supplier_name || '-')));
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
                                                            <td className="p-4 align-middle text-muted-foreground whitespace-nowrap">
                                                                {isMultiple ? (
                                                                    <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider border border-primary/20">
                                                                        <Layers className="w-3 h-3" /> {group.length} Transaksi
                                                                    </span>
                                                                ) : (
                                                                    formatDate(firstItem.incoming_date)
                                                                )}
                                                            </td>
                                                            <td className="p-4 align-middle font-medium">
                                                                {firstItem.product?.product_name || '-'}
                                                            </td>
                                                            <td className="p-4 align-middle">
                                                                {isMultiple ? <span className="italic opacity-80">{supplierText}</span> : firstItem.supplier?.supplier_name || '-'}
                                                            </td>
                                                            <td className="p-4 align-middle text-muted-foreground">
                                                                {isMultiple ? '-' : firstItem.invoice_number}
                                                            </td>
                                                            <td className="p-4 align-middle text-right font-semibold">
                                                                {formatNumber(totalQty)}
                                                            </td>
                                                            <td className="p-4 align-middle text-right font-bold text-primary whitespace-nowrap">
                                                                {formatCurrency(totalAmount)}
                                                            </td>
                                                            <td className="p-4 align-middle text-right">
                                                                {!isMultiple && (
                                                                    <div className="flex justify-end gap-2">
                                                                        <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleOpenEdit(firstItem); }} className="h-8 px-3 text-xs bg-card hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-colors">
                                                                            <Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit
                                                                        </Button>
                                                                        <Button variant="destructive" size="sm" onClick={(e) => { e.stopPropagation(); handleOpenDelete(firstItem); }} className="h-8 px-3 text-xs opacity-90 hover:opacity-100">
                                                                            <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Hapus
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </td>
                                                        </tr>
                                                        {isMultiple && isExpanded && group.map((item) => (
                                                            <tr key={`desktop-item-${item.id}`} className="border-b transition-colors bg-muted/20 hover:bg-muted/30">
                                                                <td className="p-3"></td>
                                                                <td className="p-3 align-middle text-sm text-muted-foreground whitespace-nowrap">
                                                                    {formatDate(item.incoming_date)}
                                                                </td>
                                                                <td className="p-3 align-middle text-sm">
                                                                    <span className="text-muted-foreground">Batch: </span>
                                                                    <span className="font-mono bg-background px-1.5 py-0.5 rounded text-xs border border-border/50">{item.batch_no}</span>
                                                                </td>
                                                                <td className="p-3 align-middle text-sm text-muted-foreground">
                                                                    {item.supplier?.supplier_name || '-'}
                                                                </td>
                                                                <td className="p-3 align-middle text-sm text-muted-foreground">
                                                                    {item.invoice_number}
                                                                </td>
                                                                <td className="p-3 align-middle text-right text-sm font-medium">
                                                                    {formatNumber(item.quantity)}
                                                                </td>
                                                                <td className="p-3 align-middle text-right text-sm font-medium whitespace-nowrap">
                                                                    {formatCurrency(item.total)}
                                                                </td>
                                                                <td className="p-3 align-middle text-right">
                                                                    <div className="flex justify-end gap-1.5">
                                                                        <Button variant="outline" size="icon" className="h-7 w-7 hover:bg-primary/5 hover:text-primary hover:border-primary/30" onClick={(e) => { e.stopPropagation(); handleOpenEdit(item); }}>
                                                                            <Pencil className="w-3 h-3" />
                                                                        </Button>
                                                                        <Button variant="destructive" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); handleOpenDelete(item); }}>
                                                                            <Trash2 className="w-3 h-3" />
                                                                        </Button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </Fragment>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile View (Cards) */}
                                <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {groupedIncoming.map((group) => {
                                        const isMultiple = group.length > 1;
                                        const firstItem = group[0];
                                        const isExpanded = expandedGroups[firstItem.product_id] || false;
                                        
                                        const totalQty = group.reduce((sum, item) => sum + parseFloat(item.quantity.toString()), 0);
                                        const totalAmount = group.reduce((sum, item) => sum + parseFloat(item.total.toString()), 0);
                                        const uniqueSuppliers = Array.from(new Set(group.map(item => item.supplier?.supplier_name || '-')));
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
                                                                    <Layers className="w-3 h-3" /> {group.length} Transaksi
                                                                </span>
                                                            ) : (
                                                                <span className="text-xs font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 w-fit rounded-md border border-border/40 mb-1">
                                                                    {formatDate(firstItem.incoming_date)}
                                                                </span>
                                                            )}
                                                            <h4 className="font-semibold text-lg text-foreground leading-tight line-clamp-2">
                                                                {firstItem.product?.product_name || '-'}
                                                            </h4>
                                                            <p className="text-sm text-muted-foreground mt-0.5">
                                                                Supplier: {isMultiple ? <span className="italic">{supplierText}</span> : <span className="font-medium text-foreground/80">{supplierText}</span>}
                                                            </p>
                                                        </div>
                                                        {isMultiple && (
                                                            <div className={`p-1.5 rounded-full transition-colors ${isExpanded ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                                                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    {!isMultiple && (
                                                        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground bg-muted/30 p-2 rounded-lg border border-border/30 mt-1">
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] uppercase tracking-wider font-semibold opacity-70">Invoice</span>
                                                                <span className="font-medium text-foreground">{firstItem.invoice_number}</span>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] uppercase tracking-wider font-semibold opacity-70">Batch</span>
                                                                <span className="font-mono text-foreground">{firstItem.batch_no}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    <div className="flex items-end justify-between pt-3 mt-1 border-t border-border/30">
                                                        <div className="flex flex-col">
                                                            <span className="text-xs text-muted-foreground mb-0.5">Kuantitas</span>
                                                            <span className="text-base font-bold text-foreground">{formatNumber(totalQty)}</span>
                                                        </div>
                                                        <div className="flex flex-col items-end">
                                                            <span className="text-xs text-muted-foreground mb-0.5">Total Harga</span>
                                                            <span className="text-base font-bold text-primary">{formatCurrency(totalAmount)}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    {!isMultiple && (
                                                        <div className="flex justify-end gap-2 pt-3 mt-1 border-t border-border/30">
                                                            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleOpenEdit(firstItem); }} className="h-8 px-3 text-xs flex-1 sm:flex-none bg-card hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-colors">
                                                                <Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit
                                                            </Button>
                                                            <Button variant="destructive" size="sm" onClick={(e) => { e.stopPropagation(); handleOpenDelete(firstItem); }} className="h-8 px-3 text-xs flex-1 sm:flex-none opacity-90 hover:opacity-100">
                                                                <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Hapus
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {isMultiple && isExpanded && (
                                                    <div className="bg-muted/20 border-t border-border/50 flex flex-col p-3 gap-3 rounded-b-xl shadow-inner">
                                                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1">Rincian Transaksi</p>
                                                        {group.map((item) => (
                                                            <div key={`mobile-item-${item.id}`} className="flex flex-col p-3 rounded-lg border border-border/60 bg-card shadow-sm gap-2 relative">
                                                                <div className="flex justify-between items-start">
                                                                    <span className="text-xs font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded border border-border/40">
                                                                        {formatDate(item.incoming_date)}
                                                                    </span>
                                                                    <span className="text-xs text-muted-foreground font-medium">Inv: <span className="text-foreground">{item.invoice_number}</span></span>
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-2 mt-1">
                                                                    <div className="flex flex-col">
                                                                        <span className="text-[10px] text-muted-foreground uppercase">Supplier</span>
                                                                        <span className="text-sm font-medium line-clamp-1">{item.supplier?.supplier_name || '-'}</span>
                                                                    </div>
                                                                    <div className="flex flex-col items-end">
                                                                        <span className="text-[10px] text-muted-foreground uppercase">Batch</span>
                                                                        <span className="font-mono text-xs text-primary bg-primary/5 px-1.5 py-0.5 rounded border border-primary/20">{item.batch_no}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between items-center mt-2 pt-2 border-t border-border/40">
                                                                    <div className="flex flex-col">
                                                                        <span className="text-sm font-semibold">{formatNumber(item.quantity)} <span className="text-xs font-normal text-muted-foreground">unit</span></span>
                                                                    </div>
                                                                    <div className="flex flex-col items-end">
                                                                        <span className="text-sm font-bold text-primary">{formatCurrency(item.total)}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-border/40">
                                                                    <Button variant="outline" size="sm" className="h-7 px-3 text-xs flex-1 bg-card hover:bg-primary/5 hover:text-primary hover:border-primary/30" onClick={(e) => { e.stopPropagation(); handleOpenEdit(item); }}>
                                                                        <Pencil className="w-3 h-3 mr-1.5" /> Edit
                                                                    </Button>
                                                                    <Button variant="destructive" size="sm" className="h-7 px-3 text-xs flex-1 opacity-90 hover:opacity-100" onClick={(e) => { e.stopPropagation(); handleOpenDelete(item); }}>
                                                                        <Trash2 className="w-3 h-3 mr-1.5" /> Hapus
                                                                    </Button>
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
                        <Pagination links={incomingProducts.links} />
                    </div>
                </div>
            </div>

            <CreateDialog 
                open={isCreateOpen} 
                onOpenChange={setIsCreateOpen}
                suppliers={suppliers}
                products={products}
            />

            <EditDialog 
                open={isEditOpen} 
                onOpenChange={setIsEditOpen} 
                incomingProduct={selectedIncoming}
                suppliers={suppliers}
                products={products}
            />

            <DeleteDialog 
                open={isDeleteOpen} 
                onOpenChange={setIsDeleteOpen} 
                incomingProduct={selectedIncoming} 
            />

            <CannotDeleteDialog 
                open={isCannotDeleteOpen} 
                onOpenChange={setIsCannotDeleteOpen} 
                incomingProduct={selectedIncoming} 
            />
        </>
    );
}

IncomingProductsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Barang Masuk',
            href: '/incoming-products',
        },
    ],
};
