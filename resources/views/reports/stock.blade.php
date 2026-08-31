@extends('reports.layout')

@section('title', 'Laporan Stok Barang')
@section('subtitle', 'Menampilkan posisi persediaan barang per batch saat ini')

@section('content')
    <table>
        <thead>
            <tr>
                <th width="5%">No</th>
                <th width="30%">Nama Produk</th>
                <th width="20%">Kategori</th>
                <th width="15%">No. Batch</th>
                <th width="15%">Kedaluwarsa</th>
                <th width="15%">Sisa Stok</th>
            </tr>
        </thead>
        <tbody>
            @forelse($batchStocks as $index => $batch)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>{{ $batch->product->product_name }}</td>
                    <td>{{ $batch->product->category->category_name ?? '-' }}</td>
                    <td class="text-center">{{ $batch->batch_no }}</td>
                    <td class="text-center">{{ $batch->expired_date ? $batch->expired_date->format('d/m/Y') : '-' }}</td>
                    <td class="text-right">
                        {{ number_format($batch->remaining_quantity, 0, ',', '.') }} 
                        {{ $batch->product->unit->unit_name ?? '' }}
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" class="text-center">Data stok tidak tersedia.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
@endsection
