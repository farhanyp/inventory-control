import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import { ReportCard } from './components/ReportCard';
import { DateFilterForm } from './components/DateFilterForm';
import { Package, ArrowRightLeft, ShoppingCart, AlertTriangle, Printer } from 'lucide-react';
import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';

export default function ReportsIndex() {
    const [incomingStartDate, setIncomingStartDate] = useState('');
    const [incomingEndDate, setIncomingEndDate] = useState('');
    const [salesStartDate, setSalesStartDate] = useState('');
    const [salesEndDate, setSalesEndDate] = useState('');

    const handlePrintStock = () => {
        window.open('/reports/stock', '_blank');
    };

    const handlePrintIncoming = () => {
        const query = new URLSearchParams();
        if (incomingStartDate) query.append('start_date', incomingStartDate);
        if (incomingEndDate) query.append('end_date', incomingEndDate);
        window.open(`/reports/incoming?${query.toString()}`, '_blank');
    };

    const handlePrintSales = () => {
        const query = new URLSearchParams();
        if (salesStartDate) query.append('start_date', salesStartDate);
        if (salesEndDate) query.append('end_date', salesEndDate);
        window.open(`/reports/sales?${query.toString()}`, '_blank');
    };

    const handlePrintExpired = () => {
        window.open('/reports/expired', '_blank');
    };

    return (
        <>
            <Head title="Modul Laporan" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <Heading
                    title="Modul Laporan"
                    description="Cetak dokumen laporan stok, barang masuk, penjualan, dan kedaluwarsa."
                />

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 mt-4">
                    <ReportCard
                        title="Laporan Stok Barang"
                        description="Menampilkan posisi persediaan saat ini secara mendalam, yaitu dipecah per nomor batch, sisa stok yang tersedia, dan tanggal kedaluwarsanya."
                        icon={<Package className="w-6 h-6" />}
                        onPrint={handlePrintStock}
                    />

                    <ReportCard
                        title="Laporan Barang Masuk"
                        description="Menampilkan daftar semua penerimaan barang dari supplier beserta total nilai barang."
                        icon={<ArrowRightLeft className="w-6 h-6" />}
                        requiresDateRange
                    >
                        <DateFilterForm
                            startDate={incomingStartDate}
                            endDate={incomingEndDate}
                            onStartDateChange={setIncomingStartDate}
                            onEndDateChange={setIncomingEndDate}
                            onPrint={handlePrintIncoming}
                        />
                    </ReportCard>

                    <ReportCard
                        title="Laporan Penjualan"
                        description="Menampilkan rekapitulasi transaksi barang keluar atau omset penjualan berdasarkan rentang waktu."
                        icon={<ShoppingCart className="w-6 h-6" />}
                        requiresDateRange
                    >
                        <DateFilterForm
                            startDate={salesStartDate}
                            endDate={salesEndDate}
                            onStartDateChange={setSalesStartDate}
                            onEndDateChange={setSalesEndDate}
                            onPrint={handlePrintSales}
                        />
                    </ReportCard>

                    <ReportCard
                        title="Laporan Barang Kedaluwarsa"
                        description="Menampilkan daftar khusus batch-batch produk frozen food yang statusnya sudah melewati tanggal kedaluwarsa atau yang hampir kedaluwarsa."
                        icon={<AlertTriangle className="w-6 h-6 text-red-500" />}
                        onPrint={handlePrintExpired}
                    />
                </div>
            </div>
        </>
    );
}
