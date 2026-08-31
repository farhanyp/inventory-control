@extends('reports.layout')

@section('title', 'Laporan Barang Masuk')
@section('subtitle', 'Periode: ' . $startDate->format('d M Y') . ' - ' . $endDate->format('d M Y'))

@section('content')
    <table>
        <thead>
            <tr>
                <th width="5%">No</th>
                <th width="15%">Tanggal</th>
                <th width="15%">Invoice</th>
                <th width="20%">Supplier</th>
                <th width="20%">Produk</th>
                <th width="10%">Qty</th>
                <th width="15%">Total (Rp)</th>
            </tr>
        </thead>
        <tbody>
            @php $grandTotal = 0; @endphp
            @forelse($incomings as $index => $item)
                @php $grandTotal += $item->total; @endphp
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td class="text-center">{{ $item->incoming_date->format('d/m/Y') }}</td>
                    <td>{{ $item->invoice_number }}</td>
                    <td>{{ $item->supplier->supplier_name ?? '-' }}</td>
                    <td>{{ $item->product->product_name ?? '-' }}</td>
                    <td class="text-right">
                        {{ number_format($item->quantity, 0, ',', '.') }}
                    </td>
                    <td class="text-right">{{ number_format($item->total, 0, ',', '.') }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="7" class="text-center">Tidak ada transaksi barang masuk pada periode ini.</td>
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
