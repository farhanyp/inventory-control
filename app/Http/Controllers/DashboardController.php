<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\BatchStock;
use App\Models\IncomingProduct;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        // Total Active Products
        $totalProducts = Product::where('status', 'active')->count();

        // Low Stock Products
        $productsWithStock = Product::withSum('batchStocks as total_stock', 'remaining_quantity')
            ->where('status', 'active')
            ->get();
            
        $lowStockProducts = $productsWithStock->filter(function ($product) {
            $stock = $product->total_stock ?? 0;
            return $stock <= $product->min_stock;
        });

        $lowStockCount = $lowStockProducts->count();
        $lowStockTop = $lowStockProducts->sortBy('total_stock')->take(5)->values();

        // Expiring Batches (<= 30 days and remaining_quantity > 0)
        $thirtyDays = Carbon::now()->addDays(30)->startOfDay();
        $expiringQuery = BatchStock::with('product')
            ->whereNotNull('expired_date')
            ->where('expired_date', '<=', $thirtyDays)
            ->where('remaining_quantity', '>', 0);

        $expiringCount = $expiringQuery->count();
        $expiringTop = (clone $expiringQuery)->orderBy('expired_date', 'asc')->take(5)->get();

        // Recent Incoming
        $recentIncoming = IncomingProduct::with(['product', 'supplier'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('dashboard', [
            'metrics' => [
                'totalProducts' => $totalProducts,
                'lowStockCount' => $lowStockCount,
                'expiringCount' => $expiringCount,
            ],
            'lowStockTop' => $lowStockTop,
            'expiringTop' => $expiringTop,
            'recentIncoming' => $recentIncoming,
        ]);
    }
}
