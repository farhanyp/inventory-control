import { useState } from 'react';
import { Head } from '@inertiajs/react';
import type { Reseller } from '@/types';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { CreateDialog } from './create-dialog';
import { EditDialog } from './edit-dialog';
import { DeleteDialog } from './delete-dialog';
import { CannotDeleteDialog } from './cannot-delete-dialog';

interface ResellersIndexProps {
    resellers: {
        data: Reseller[];
        current_page: number;
        last_page: number;
    };
}

export default function ResellersIndex({ resellers }: ResellersIndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isCannotDeleteOpen, setIsCannotDeleteOpen] = useState(false);
    const [selectedReseller, setSelectedReseller] = useState<Reseller | null>(null);

    const handleOpenCreate = () => {
        setIsCreateOpen(true);
    };

    const handleOpenEdit = (reseller: Reseller) => {
        setSelectedReseller(reseller);
        setIsEditOpen(true);
    };

    const handleOpenDelete = (reseller: Reseller) => {
        setSelectedReseller(reseller);
        if (reseller.sales_count && reseller.sales_count > 0) {
            setIsCannotDeleteOpen(true);
        } else {
            setIsDeleteOpen(true);
        }
    };

    return (
        <>
            <Head title="Reseller" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="rounded-xl border border-border bg-card text-card-foreground shadow">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 gap-4">
                        <div>
                            <h3 className="text-lg font-semibold leading-none tracking-tight">Data Reseller</h3>
                            <p className="text-sm text-muted-foreground mt-2">Kelola daftar reseller atau konsumen Anda.</p>
                        </div>
                        <Button onClick={handleOpenCreate} className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Tambah Reseller
                        </Button>
                    </div>
                    <div className="p-6 pt-0">
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 w-16 px-4 text-center align-middle font-medium text-muted-foreground">No</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Kode Reseller</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nama Reseller</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">No. Telepon</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {resellers.data.map((reseller, index) => (
                                        <tr key={reseller.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 text-center align-middle">{(resellers.current_page - 1) * 10 + index + 1}</td>
                                            <td className="p-4 align-middle font-mono text-sm">{reseller.reseller_code}</td>
                                            <td className="p-4 align-middle">{reseller.reseller_name}</td>
                                            <td className="p-4 align-middle">{reseller.phone_number || '-'}</td>
                                            <td className="p-4 align-middle text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="icon" onClick={() => handleOpenEdit(reseller)}>
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="destructive" size="icon" onClick={() => handleOpenDelete(reseller)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {resellers.data.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="h-24 text-center text-muted-foreground">
                                                Belum ada data reseller.
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
                reseller={selectedReseller} 
            />

            <DeleteDialog 
                open={isDeleteOpen} 
                onOpenChange={setIsDeleteOpen} 
                reseller={selectedReseller} 
            />

            <CannotDeleteDialog 
                open={isCannotDeleteOpen} 
                onOpenChange={setIsCannotDeleteOpen} 
                reseller={selectedReseller} 
            />
        </>
    );
}

ResellersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Reseller',
            href: '/resellers',
        },
    ],
};
