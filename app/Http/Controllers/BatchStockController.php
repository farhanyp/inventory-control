<?php

namespace App\Http\Controllers;

use App\Models\BatchStock;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BatchStockController extends Controller
{
    public function index()
    {
        // 1. Dapatkan 10 produk yang memiliki stok tersisa, diurutkan berdasarkan tanggal kedaluwarsa terdekat
        $paginatedProducts = Product::select('product.*')
            ->whereHas('batchStocks', function($query) {
                $query->where('remaining_quantity', '>', 0)
                      ->whereNotNull('expired_date');
            })
            ->addSelect(['min_expired_date' => BatchStock::selectRaw('MIN(expired_date)')
                ->whereColumn('product_id', 'product.id')
                ->where('remaining_quantity', '>', 0)
                ->whereNotNull('expired_date')
            ])
            ->orderBy('min_expired_date', 'asc')
            ->paginate(10);

        // 2. Ambil semua batch dari 10 produk tersebut yang memiliki stok
        $batchStocksData = BatchStock::with(['product', 'incomingProduct.supplier'])
            ->where('remaining_quantity', '>', 0)
            ->whereNotNull('expired_date')
            ->whereIn('product_id', $paginatedProducts->pluck('id'))
            ->orderByRaw('expired_date ASC, remaining_quantity ASC')
            ->get();

        // 3. Buat paginator manual menggunakan data Total & Current Page yang akurat dari Product
        $batchStocks = new \Illuminate\Pagination\LengthAwarePaginator(
            $batchStocksData,
            $paginatedProducts->total(),
            $paginatedProducts->perPage(),
            $paginatedProducts->currentPage(),
            ['path' => \Illuminate\Pagination\Paginator::resolveCurrentPath()]
        );

        return Inertia::render('batch-stocks/index', [
            'batchStocks' => $batchStocks,
        ]);
    }

}
