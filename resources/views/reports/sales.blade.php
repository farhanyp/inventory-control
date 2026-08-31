@extends('reports.layout')

@section('title', 'Laporan Penjualan')
@section('subtitle', 'Periode: ' . $startDate->format('d M Y') . ' - ' . $endDate->format('d M Y'))

@section('content')
    <table>
        <thead>
            <tr>
                <th width="5%">No</th>
                <th width="15%">Tanggal</th>
                <th width="15%">No. Transaksi</th>
                <th width="25%">Pelanggan</th>
                <th width="15%">Metode Bayar</th>
                <th width="10%">Kasir</th>
                <th width="15%">Total (Rp)</th>
            </tr>
        </thead>
        <tbody>
            @php $grandTotal = 0; @endphp
            @forelse($sales as $index => $item)
                @php $grandTotal += $item->total; @endphp
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td class="text-center">{{ $item->transaction_date->format('d/m/Y') }}</td>
                    <td class="text-center">{{ $item->transaction_number }}</td>
                    <td>{{ $item->reseller?->name ?: 'Umum' }}</td>
                    <td class="text-center">{{ $item->payment_method->value }}</td>
                    <td>{{ $item->creator->name ?? '-' }}</td>
                    <td class="text-right">{{ number_format($item->total, 0, ',', '.') }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="7" class="text-center">Tidak ada transaksi penjualan pada periode ini.</td>
                </tr>
            @endforelse
        </tbody>
        <tfoot>
            <tr>
                <th colspan="6" class="text-right">Total Keseluruhan (Rp)</th>
                <th class="text-right">{{ number_format($grandTotal, 0, ',', '.') }}</th>
            </tr>
        </tfoot>
    </table>
@endsection
