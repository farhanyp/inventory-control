import { useState } from 'react';
import { Head } from '@inertiajs/react';
import type { Category, CategoriesIndexProps } from '@/types/category';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Plus, Tags } from 'lucide-react';
import { CreateDialog } from './create-dialog';
import { EditDialog } from './edit-dialog';
import { DeleteDialog } from './delete-dialog';
import { CannotDeleteDialog } from './cannot-delete-dialog';

export default function CategoriesIndex({ categories }: CategoriesIndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isCannotDeleteOpen, setIsCannotDeleteOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const handleOpenCreate = () => {
        setIsCreateOpen(true);
    };

    const handleOpenEdit = (category: Category) => {
        setSelectedCategory(category);
        setIsEditOpen(true);
    };

    const handleOpenDelete = (category: Category) => {
        setSelectedCategory(category);
        if (category.products_count && category.products_count > 0) {
            setIsCannotDeleteOpen(true);
        } else {
            setIsDeleteOpen(true);
        }
    };

    return (
        <>
            <Head title="Kategori" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
                <div className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm text-card-foreground shadow-sm flex flex-col">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 md:p-6 gap-4 border-b border-border/50 bg-gradient-to-r from-card to-muted/20">
                        <div className="flex flex-col gap-1.5">
                            <h3 className="text-lg md:text-xl font-bold tracking-tight flex items-center gap-2">
                                <Tags className="w-5 h-5 text-primary" />
                                Kategori Produk
                            </h3>
                            <p className="text-sm text-muted-foreground">Kelola daftar kategori yang tersedia.</p>
                        </div>
                        <Button onClick={handleOpenCreate} className="flex items-center gap-2 shadow-sm w-full sm:w-auto">
                            <Plus className="w-4 h-4" />
                            Tambah Kategori
                        </Button>
                    </div>
                    
                    <div className="p-4 md:p-6 bg-muted/5">
                        {/* Tampilan Desktop (Tabel) */}
                        <div className="hidden md:block relative w-full overflow-auto rounded-md border border-border/50">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b bg-muted/30">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-24">No</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nama Kategori</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground w-48">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0 bg-card">
                                    {categories.data.map((category, index) => (
                                        <tr key={category.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle">
                                                <span className="inline-flex items-center rounded-md bg-muted/60 px-2 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-border/40">
                                                    {(categories.current_page - 1) * 10 + index + 1}
                                                </span>
                                            </td>
                                            <td className="p-4 align-middle font-medium">{category.category_name}</td>
                                            <td className="p-4 align-middle text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="sm" onClick={() => handleOpenEdit(category)} className="h-8 px-3 text-xs bg-card hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-colors">
                                                        <Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit
                                                    </Button>
                                                    <Button variant="destructive" size="sm" onClick={() => handleOpenDelete(category)} className="h-8 px-3 text-xs opacity-90 hover:opacity-100">
                                                        <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Hapus
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Tampilan Mobile (Card) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:hidden gap-4">
                            {categories.data.map((category, index) => (
                                <div key={category.id} className="group relative flex flex-col justify-between p-5 rounded-xl border border-border/60 bg-card shadow-sm hover:shadow-md transition-all hover:border-primary/30 gap-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded border border-border/40 w-fit">No: {(categories.current_page - 1) * 10 + index + 1}</span>
                                            <h4 className="font-semibold text-lg text-foreground mt-1 group-hover:text-primary transition-colors line-clamp-2">{category.category_name}</h4>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2 pt-4 border-t border-border/30">
                                        <Button variant="outline" size="sm" onClick={() => handleOpenEdit(category)} className="h-8 px-3 text-xs bg-card hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-colors">
                                            <Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleOpenDelete(category)} className="h-8 px-3 text-xs opacity-90 hover:opacity-100">
                                            <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Hapus
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {categories.data.length === 0 && (
                            <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border/60 rounded-xl bg-card/50">
                                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                                    <Tags className="w-6 h-6 text-muted-foreground/50" />
                                </div>
                                <h4 className="text-base font-medium text-foreground mb-1">Belum ada kategori</h4>
                                <p className="text-sm text-muted-foreground max-w-sm">Data kategori produk masih kosong. Silakan tambah kategori baru untuk memulai.</p>
                                <Button onClick={handleOpenCreate} variant="outline" className="mt-4">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Tambah Kategori Pertama
                                </Button>
                            </div>
                        )}
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
                category={selectedCategory} 
            />

            <DeleteDialog 
                open={isDeleteOpen} 
                onOpenChange={setIsDeleteOpen} 
                category={selectedCategory} 
            />

            <CannotDeleteDialog 
                open={isCannotDeleteOpen} 
                onOpenChange={setIsCannotDeleteOpen} 
                category={selectedCategory} 
            />
        </>
    );
}

CategoriesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Kategori',
            href: '/categories',
        },
    ],
};
