import { useState } from 'react';
import { Head } from '@inertiajs/react';
import type { Product, Category, Unit } from '@/types';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { CreateDialog } from './create-dialog';
import { EditDialog } from './edit-dialog';
import { DeleteDialog } from './delete-dialog';
import { CannotDeleteDialog } from './cannot-delete-dialog';

interface ProductsIndexProps {
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
    };
    categories: Category[];
    units: Unit[];
}

export default function ProductsIndex({ products, categories, units }: ProductsIndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isCannotDeleteOpen, setIsCannotDeleteOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const handleOpenCreate = () => {
        setIsCreateOpen(true);
    };

    const handleOpenEdit = (product: Product) => {
        setSelectedProduct(product);
        setIsEditOpen(true);
    };

    const handleOpenDelete = (product: Product) => {
        setSelectedProduct(product);
        const incomingCount = product.incoming_products_count || 0;
        const salesCount = product.sales_details_count || 0;
        
        if (incomingCount > 0 || salesCount > 0) {
            setIsCannotDeleteOpen(true);
        } else {
            setIsDeleteOpen(true);
        }
    };

    return (
        <>
            <Head title="Produk" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="rounded-xl border border-border bg-card text-card-foreground shadow">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 gap-4">
                        <div>
                            <h3 className="text-lg font-semibold leading-none tracking-tight">Produk</h3>
                            <p className="text-sm text-muted-foreground mt-2">Kelola daftar produk yang tersedia.</p>
                        </div>
                        <Button onClick={handleOpenCreate} className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Tambah Produk
                        </Button>
                    </div>
                    <div className="p-6 pt-0">
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 w-16 px-4 text-center align-middle font-medium text-muted-foreground whitespace-nowrap">No</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">Kode</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">Nama Produk</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">Kategori</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">Satuan</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground whitespace-nowrap">Harga Beli</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground whitespace-nowrap">Harga Jual</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground whitespace-nowrap">Stok Minimal</th>
                                        <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground whitespace-nowrap">Status</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground whitespace-nowrap">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {products.data.map((product, index) => (
                                        <tr key={product.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 text-center align-middle">{(products.current_page - 1) * 10 + index + 1}</td>
                                            <td className="p-4 align-middle whitespace-nowrap">{product.product_code}</td>
                                            <td className="p-4 align-middle whitespace-nowrap font-medium">{product.product_name}</td>
                                            <td className="p-4 align-middle whitespace-nowrap">{product.category?.category_name || '-'}</td>
                                            <td className="p-4 align-middle whitespace-nowrap">{product.unit?.unit_name || '-'}</td>
                                            <td className="p-4 align-middle whitespace-nowrap text-right">
                                                Rp {parseFloat(product.purchase_price.toString()).toLocaleString('id-ID')}
                                            </td>
                                            <td className="p-4 align-middle whitespace-nowrap text-right">
                                                Rp {parseFloat(product.selling_price.toString()).toLocaleString('id-ID')}
                                            </td>
                                            <td className="p-4 align-middle whitespace-nowrap text-right">
                                                {parseFloat(product.min_stock.toString()).toLocaleString('id-ID')}
                                            </td>
                                            <td className="p-4 align-middle text-center whitespace-nowrap">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {product.status === 'active' ? 'Aktif' : 'Nonaktif'}
                                                </span>
                                            </td>
                                            <td className="p-4 align-middle text-right whitespace-nowrap">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="icon" onClick={() => handleOpenEdit(product)}>
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="destructive" size="icon" onClick={() => handleOpenDelete(product)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {products.data.length === 0 && (
                                        <tr>
                                            <td colSpan={10} className="h-24 text-center text-muted-foreground">
                                                Belum ada data produk.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <CreateDialog 
                open={isCreateOpen} 
                onOpenChange={setIsCreateOpen}
                categories={categories}
                units={units}
            />

            <EditDialog 
                open={isEditOpen} 
                onOpenChange={setIsEditOpen} 
                product={selectedProduct}
                categories={categories}
                units={units}
            />

            <DeleteDialog 
                open={isDeleteOpen} 
                onOpenChange={setIsDeleteOpen} 
                product={selectedProduct} 
            />

            <CannotDeleteDialog 
                open={isCannotDeleteOpen} 
                onOpenChange={setIsCannotDeleteOpen} 
                product={selectedProduct} 
            />
        </>
    );
}

ProductsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Produk',
            href: '/products',
        },
    ],
};
