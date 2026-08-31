import { useState } from 'react';
import { Head } from '@inertiajs/react';
import type { Supplier } from '@/types';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { CreateDialog } from './create-dialog';
import { EditDialog } from './edit-dialog';
import { DeleteDialog } from './delete-dialog';
import { CannotDeleteDialog } from './cannot-delete-dialog';

interface SuppliersIndexProps {
    suppliers: {
        data: Supplier[];
        current_page: number;
        last_page: number;
    };
}

export default function SuppliersIndex({ suppliers }: SuppliersIndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isCannotDeleteOpen, setIsCannotDeleteOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

    const handleOpenCreate = () => {
        setIsCreateOpen(true);
    };

    const handleOpenEdit = (supplier: Supplier) => {
        setSelectedSupplier(supplier);
        setIsEditOpen(true);
    };

    const handleOpenDelete = (supplier: Supplier) => {
        setSelectedSupplier(supplier);
        if (supplier.incoming_products_count && supplier.incoming_products_count > 0) {
            setIsCannotDeleteOpen(true);
        } else {
            setIsDeleteOpen(true);
        }
    };

    return (
        <>
            <Head title="Supplier" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="rounded-xl border border-border bg-card text-card-foreground shadow">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 gap-4">
                        <div>
                            <h3 className="text-lg font-semibold leading-none tracking-tight">Supplier Produk</h3>
                            <p className="text-sm text-muted-foreground mt-2">Kelola daftar supplier yang tersedia.</p>
                        </div>
                        <Button onClick={handleOpenCreate} className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Tambah Supplier
                        </Button>
                    </div>
                    <div className="p-6 pt-0">
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 w-16 px-4 text-center align-middle font-medium text-muted-foreground">No</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Kode</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nama Supplier</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">No. Telepon</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Alamat</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {suppliers.data.map((supplier, index) => (
                                        <tr key={supplier.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 text-center align-middle">{(suppliers.current_page - 1) * 10 + index + 1}</td>
                                            <td className="p-4 align-middle">{supplier.supplier_code}</td>
                                            <td className="p-4 align-middle">{supplier.supplier_name}</td>
                                            <td className="p-4 align-middle">{supplier.phone_number || '-'}</td>
                                            <td className="p-4 align-middle">{supplier.address || '-'}</td>
                                            <td className="p-4 align-middle text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="icon" onClick={() => handleOpenEdit(supplier)}>
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="destructive" size="icon" onClick={() => handleOpenDelete(supplier)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {suppliers.data.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="h-24 text-center text-muted-foreground">
                                                Belum ada data supplier.
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
            />

            <EditDialog 
                open={isEditOpen} 
                onOpenChange={setIsEditOpen} 
                supplier={selectedSupplier} 
            />

            <DeleteDialog 
                open={isDeleteOpen} 
                onOpenChange={setIsDeleteOpen} 
                supplier={selectedSupplier} 
            />

            <CannotDeleteDialog 
                open={isCannotDeleteOpen} 
                onOpenChange={setIsCannotDeleteOpen} 
                supplier={selectedSupplier} 
            />
        </>
    );
}

SuppliersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Supplier',
            href: '/suppliers',
        },
    ],
};
