import { useState } from 'react';
import { Head } from '@inertiajs/react';
import type { Unit } from '@/types';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { CreateDialog } from './create-dialog';
import { EditDialog } from './edit-dialog';
import { DeleteDialog } from './delete-dialog';
import { CannotDeleteDialog } from './cannot-delete-dialog';

interface UnitsIndexProps {
    units: {
        data: Unit[];
        current_page: number;
        last_page: number;
    };
}

export default function UnitsIndex({ units }: UnitsIndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isCannotDeleteOpen, setIsCannotDeleteOpen] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

    const handleOpenCreate = () => {
        setIsCreateOpen(true);
    };

    const handleOpenEdit = (unit: Unit) => {
        setSelectedUnit(unit);
        setIsEditOpen(true);
    };

    const handleOpenDelete = (unit: Unit) => {
        setSelectedUnit(unit);
        if (unit.products_count && unit.products_count > 0) {
            setIsCannotDeleteOpen(true);
        } else {
            setIsDeleteOpen(true);
        }
    };

    return (
        <>
            <Head title="Satuan" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="rounded-xl border border-border bg-card text-card-foreground shadow">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 gap-4">
                        <div>
                            <h3 className="text-lg font-semibold leading-none tracking-tight">Satuan Produk</h3>
                            <p className="text-sm text-muted-foreground mt-2">Kelola daftar satuan yang tersedia.</p>
                        </div>
                        <Button onClick={handleOpenCreate} className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Tambah Satuan
                        </Button>
                    </div>
                    <div className="p-6 pt-0">
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 w-16 px-4 text-center align-middle font-medium text-muted-foreground">No</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nama Satuan</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {units.data.map((unit, index) => (
                                        <tr key={unit.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 text-center align-middle">{(units.current_page - 1) * 10 + index + 1}</td>
                                            <td className="p-4 align-middle">{unit.unit_name}</td>
                                            <td className="p-4 align-middle text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="icon" onClick={() => handleOpenEdit(unit)}>
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="destructive" size="icon" onClick={() => handleOpenDelete(unit)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {units.data.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="h-24 text-center text-muted-foreground">
                                                Belum ada data satuan.
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
                unit={selectedUnit} 
            />

            <DeleteDialog 
                open={isDeleteOpen} 
                onOpenChange={setIsDeleteOpen} 
                unit={selectedUnit} 
            />

            <CannotDeleteDialog 
                open={isCannotDeleteOpen} 
                onOpenChange={setIsCannotDeleteOpen} 
                unit={selectedUnit} 
            />
        </>
    );
}

UnitsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Satuan',
            href: '/units',
        },
    ],
};
