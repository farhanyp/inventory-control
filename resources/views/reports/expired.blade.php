@extends('reports.layout')

@section('title', 'Laporan Barang Kedaluwarsa')
@section('subtitle', 'Menampilkan batch produk yang sudah kedaluwarsa atau mendekati kedaluwarsa')

@section('content')
    <table>
        <thead>
            <tr>
                <th width="5%">No</th>
                <th width="25%">Nama Produk</th>
                <th width="15%">No. Batch</th>
                <th width="15%">Kedaluwarsa</th>
                <th width="15%">Sisa Stok</th>
                <th width="25%">Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse($batchStocks as $index => $batch)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>{{ $batch->product->product_name }}</td>
                    <td class="text-center">{{ $batch->batch_no }}</td>
                    <td class="text-center">{{ $batch->expired_date ? $batch->expired_date->format('d/m/Y') : '-' }}</td>
                    <td class="text-right">
                        {{ number_format($batch->remaining_quantity, 0, ',', '.') }} 
                        {{ $batch->product->unit->unit_name ?? '' }}
                    </td>
                    <td class="text-center">
                        @php
                            $status = $batch->expired_status;
                            $class = '';
                            if ($status === 'Expired') $class = 'text-danger';
                            elseif ($status === 'Hampir Expired') $class = 'text-danger';
                            elseif ($status === 'Peringatan') $class = 'text-warning';
                            else $class = 'text-success';
                        @endphp
                        <strong class="{{ $class }}">{{ $status }}</strong>
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" class="text-center">Tidak ada batch produk yang kedaluwarsa atau mendekati kedaluwarsa saat ini.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
@endsection
