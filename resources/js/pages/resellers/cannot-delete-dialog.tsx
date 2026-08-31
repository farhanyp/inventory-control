import React from 'react';
import { ShieldAlert, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog';
import type { Reseller } from '@/types';

interface ResellerActionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    reseller: Reseller | null;
}

export function CannotDeleteDialog({ open, onOpenChange, reseller }: ResellerActionDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0 shadow-2xl rounded-2xl">
                <div className="flex flex-col items-center text-center p-6 pt-10 pb-8 bg-gradient-to-b from-red-50/50 to-background dark:from-red-950/20 dark:to-background">
                    {/* Icon Container */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-red-100 dark:bg-red-900/30 rounded-full animate-ping opacity-75"></div>
                        <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/50 border-4 border-white dark:border-background shadow-sm">
                            <ShieldAlert className="w-10 h-10 text-red-600 dark:text-red-500" />
                        </div>
                    </div>

                    {/* Text Content */}
                    <h2 className="text-2xl font-bold text-foreground tracking-tight mb-2">
                        Tindakan Ditolak
                    </h2>
                    <p className="text-muted-foreground text-sm max-w-sm leading-relaxed mb-6">
                        Reseller <strong className="text-foreground font-semibold">"{reseller?.reseller_name}"</strong> tidak dapat dihapus karena masih terhubung dengan data penjualan yang ada di sistem.
                    </p>

                    {/* Relation Info Card */}
                    <div className="w-full bg-card border border-border/50 rounded-xl p-4 mb-8 shadow-sm flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Receipt className="w-5 h-5 text-primary" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-medium text-foreground">Penjualan Terkait</p>
                                <p className="text-xs text-muted-foreground">Masih menggunakan reseller ini</p>
                            </div>
                        </div>
                        <div className="bg-primary text-primary-foreground font-bold px-3 py-1 rounded-md text-sm">
                            {reseller?.sales_count} Data
                        </div>
                    </div>

                    {/* Action */}
                    <div className="w-full">
                        <Button 
                            className="w-full rounded-xl h-12 text-base font-medium shadow-sm hover:shadow transition-all" 
                            size="lg"
                            onClick={() => onOpenChange(false)}
                        >
                            Saya Mengerti
                        </Button>
                        <p className="text-xs text-muted-foreground mt-4">
                            Ubah atau hapus data penjualan terkait terlebih dahulu untuk dapat menghapus reseller ini.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
