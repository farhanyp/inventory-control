import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

interface DateFilterFormProps {
    startDate: string;
    endDate: string;
    onStartDateChange: (val: string) => void;
    onEndDateChange: (val: string) => void;
    onPrint: () => void;
}

export function DateFilterForm({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    onPrint
}: DateFilterFormProps) {
    return (
        <div className="flex flex-col gap-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="startDate">Tanggal Awal</Label>
                    <Input 
                        type="date" 
                        id="startDate" 
                        value={startDate} 
                        onChange={(e) => onStartDateChange(e.target.value)} 
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="endDate">Tanggal Akhir</Label>
                    <Input 
                        type="date" 
                        id="endDate" 
                        value={endDate} 
                        onChange={(e) => onEndDateChange(e.target.value)} 
                    />
                </div>
            </div>
            <Button onClick={onPrint} className="w-full flex items-center justify-center gap-2">
                <Printer className="w-4 h-4" /> Cetak Laporan
            </Button>
        </div>
    );
}
