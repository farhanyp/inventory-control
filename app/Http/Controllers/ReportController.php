<?php

namespace App\Http\Controllers;

use App\Models\BatchStock;
use App\Models\IncomingProduct;
use App\Models\Sales;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('reports/Index');
    }

    public function stock()
    {
        $batchStocks = BatchStock::with('product')
            ->where('remaining_quantity', '>', 0)
            ->orderBy('product_id')
            ->orderBy('expired_date')
            ->get();

        $pdf = Pdf::loadView('reports.stock', compact('batchStocks'));
        return $pdf->stream('laporan-stok-' . date('Y-m-d') . '.pdf');
    }

    public function incoming(Request $request)
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $startDate = $request->start_date ? Carbon::parse($request->start_date)->startOfDay() : Carbon::now()->startOfMonth();
        $endDate = $request->end_date ? Carbon::parse($request->end_date)->endOfDay() : Carbon::now()->endOfDay();

        $incomings = IncomingProduct::with(['product', 'supplier'])
            ->whereBetween('incoming_date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])
            ->orderBy('incoming_date', 'desc')
            ->get();

        $pdf = Pdf::loadView('reports.incoming', compact('incomings', 'startDate', 'endDate'));
        return $pdf->stream('laporan-barang-masuk-' . date('Y-m-d') . '.pdf');
    }

    public function sales(Request $request)
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $startDate = $request->start_date ? Carbon::parse($request->start_date)->startOfDay() : Carbon::now()->startOfMonth();
        $endDate = $request->end_date ? Carbon::parse($request->end_date)->endOfDay() : Carbon::now()->endOfDay();

        $sales = Sales::with(['creator', 'reseller'])
            ->whereBetween('transaction_date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])
            ->orderBy('transaction_date', 'desc')
            ->get();

        $pdf = Pdf::loadView('reports.sales', compact('sales', 'startDate', 'endDate'));
        return $pdf->stream('laporan-penjualan-' . date('Y-m-d') . '.pdf');
    }

    public function expired()
    {
        // Get batches that are not aman (aman is either no expiry date or more than 30 days remaining)
        $batchStocks = BatchStock::with('product')
            ->where('remaining_quantity', '>', 0)
            ->whereNotNull('expired_date')
            ->where('expired_date', '<=', Carbon::today()->addDays(30))
            ->orderBy('expired_date', 'asc')
            ->get();

        $pdf = Pdf::loadView('reports.expired', compact('batchStocks'));
        return $pdf->stream('laporan-barang-kedaluwarsa-' . date('Y-m-d') . '.pdf');
    }
}
