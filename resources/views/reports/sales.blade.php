@extends('reports.layout')

@section('title', 'Laporan Barang Keluar')
@section('subtitle', 'Periode: ' . $startDate->format('d M Y') . ' - ' . $endDate->format('d M Y'))

@section('content')
    <style>
        .row-header { background-color: #e8f0fe; font-weight: bold; }
        .row-item td { background-color: #fafafa; font-size: 10px; }
        .row-item td:first-child { border-left: 3px solid #4a6fa5; padding-left: 10px; }
        .summary-row { background-color: #f0f0f0; font-style: italic; font-size: 10px; }
    </style>

    <table>
        <thead>
            <tr>
                <th width="4%">No</th>
                <th width="13%">Tanggal</th>
                <th width="16%">No. Pesanan</th>
                <th width="25%">Pelanggan (Reseller)</th>
                <th width="18%">Sales Admin</th>
                <th width="14%">Nama Barang</th>
                <th width="10%">Qty Keluar</th>
            </tr>
        </thead>
        <tbody>
            @forelse($sales as $index => $item)
                @if($item->details && $item->details->count() > 0)
                    @foreach($item->details as $detailIndex => $detail)
                        <tr>
                            @if($detailIndex === 0)
                                <td class="text-center" rowspan="{{ $item->details->count() }}">{{ $index + 1 }}</td>
                                <td class="text-center" rowspan="{{ $item->details->count() }}">{{ $item->transaction_date->format('d/m/Y') }}</td>
                                <td class="text-center" rowspan="{{ $item->details->count() }}">{{ $item->transaction_number }}</td>
                                <td rowspan="{{ $item->details->count() }}">{{ $item->reseller?->reseller_name ?: 'Umum' }}</td>
                                <td rowspan="{{ $item->details->count() }}">{{ $item->creator->name ?? '-' }}</td>
                            @endif
                            <td>{{ $detail->product?->product_name ?? '-' }}</td>
                            <td class="text-center">{{ number_format($detail->quantity, 0, ',', '.') }}</td>
                        </tr>
                    @endforeach
                @else
                    <tr>
                        <td class="text-center">{{ $index + 1 }}</td>
                        <td class="text-center">{{ $item->transaction_date->format('d/m/Y') }}</td>
                        <td class="text-center">{{ $item->transaction_number }}</td>
                        <td>{{ $item->reseller?->reseller_name ?: 'Umum' }}</td>
                        <td>{{ $item->creator->name ?? '-' }}</td>
                        <td class="text-center" colspan="2">-</td>
                    </tr>
                @endif
            @empty
                <tr>
                    <td colspan="7" class="text-center">Tidak ada data barang keluar pada periode ini.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
@endsection
