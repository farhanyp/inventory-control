<?php

namespace App\Http\Controllers;

use App\Models\BatchStock;
use App\Models\Product;
use App\Models\Sales;
use App\Models\SalesDetail;
use App\Models\StockHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SalesController extends Controller
{
    public function index()
    {
        $sales = Sales::with(['creator', 'reseller'])->latest('created_at')->paginate(10);
        
        // Get active products that have remaining stock > 0 for Cashier modal
        $products = Product::where('status', 'active')
            ->withSum(['batchStocks as total_stock' => function ($query) {
                $query->where('remaining_quantity', '>', 0);
            }], 'remaining_quantity')
            ->havingRaw('COALESCE(total_stock, 0) > 0')
            ->get();

        $resellers = \App\Models\Reseller::orderBy('reseller_name', 'asc')->get();

        return Inertia::render('sales/index', [
            'sales' => $sales,
            'products' => $products,
            'resellers' => $resellers,
        ]);
    }



    public function store(Request $request)
    {
        $validated = $request->validate([
            'transaction_date' => 'required|date',
            'customer_name' => 'nullable|string|max:120',
            'payment_method' => 'required|in:Cash,Transfer',
            'paid_amount' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:product,id',
            'items.*.quantity' => 'required|numeric|min:1',
        ]);

        try {
            DB::beginTransaction();

            // 1. Generate Transaction Number
            $lastRecord = Sales::orderBy('id', 'desc')->first();
            $lastNumber = $lastRecord ? intval(substr($lastRecord->transaction_number, 4)) : 0;
            $transactionNumber = 'TRX-' . str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);

            // Calculate overall total from items
            $overallTotal = 0;
            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);
                $overallTotal += ($product->selling_price * $item['quantity']);
            }

            // Validasi uang bayar
            if ($validated['paid_amount'] < $overallTotal) {
                throw new \Exception("Jumlah uang bayar (Rp " . number_format($validated['paid_amount'], 0, ',', '.') . ") kurang dari total belanja (Rp " . number_format($overallTotal, 0, ',', '.') . ").");
            }

            // Handle Reseller (Find or Create)
            $reseller = null;
            if (!empty($validated['customer_name'])) {
                $reseller = \App\Models\Reseller::where('reseller_name', $validated['customer_name'])->first();
                if (!$reseller) {
                    $lastReseller = \App\Models\Reseller::orderBy('id', 'desc')->first();
                    $nextId = 1;
                    if ($lastReseller && preg_match('/RSL-(\d+)/', $lastReseller->reseller_code, $matches)) {
                        $nextId = intval($matches[1]) + 1;
                    } elseif ($lastReseller) {
                        $nextId = $lastReseller->id + 1;
                    }
                    $resellerCode = 'RSL-' . str_pad($nextId, 3, '0', STR_PAD_LEFT);

                    $reseller = \App\Models\Reseller::create([
                        'reseller_code' => $resellerCode,
                        'reseller_name' => $validated['customer_name']
                    ]);
                }
            }

            $changeAmount = $validated['paid_amount'] - $overallTotal;

            // 2. Create Sales Record
            $sales = Sales::create([
                'transaction_number' => $transactionNumber,
                'transaction_date' => $validated['transaction_date'],
                'reseller_id' => $reseller ? $reseller->id : null,
                'payment_method' => $validated['payment_method'],
                'total' => $overallTotal,
                'paid_amount' => $validated['paid_amount'],
                'change_amount' => $changeAmount,
                'description' => $validated['description'] ?? null,
                'created_by' => auth()->id(),
            ]);

            // 3. Process items with FEFO
            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);
                $qtyNeeded = $item['quantity'];

                // Get batches for this product, ordered by expired_date ASC (FEFO)
                $batches = BatchStock::where('product_id', $product->id)
                    ->where('remaining_quantity', '>', 0)
                    ->orderBy('expired_date', 'asc') // Nulls first typically in mysql, but we assume expired_date is always populated.
                    ->get();

                $totalAvailable = $batches->sum('remaining_quantity');
                if ($totalAvailable < $qtyNeeded) {
                    throw new \Exception("Stok tidak mencukupi untuk produk: " . $product->product_name . ". Sisa: " . $totalAvailable);
                }

                foreach ($batches as $batch) {
                    if ($qtyNeeded <= 0) break;

                    $qtyToTake = min($qtyNeeded, $batch->remaining_quantity);
                    $subtotal = $qtyToTake * $product->selling_price;

                    // Create Sales Detail (record exactly from which batch we took)
                    SalesDetail::create([
                        'sales_id' => $sales->id,
                        'reseller_id' => $reseller ? $reseller->id : null,
                        'product_id' => $product->id,
                        'batch_id' => $batch->id,
                        'batch_no' => $batch->batch_no,
                        'expired_date' => $batch->expired_date,
                        'quantity' => $qtyToTake,
                        'selling_price' => $product->selling_price,
                        'subtotal' => $subtotal,
                    ]);

                    // Deduct Batch
                    $oldStock = $batch->remaining_quantity;
                    $batch->remaining_quantity -= $qtyToTake;
                    $batch->save();

                    // Record Stock History
                    StockHistory::create([
                        'history_date' => $validated['transaction_date'],
                        'product_id' => $product->id,
                        'batch_id' => $batch->id,
                        'type' => 'out',
                        'ref_table' => 'sales_detail',
                        'ref_id' => $sales->id, // or the detail ID, but sales_id is fine to group
                        'incoming_quantity' => 0,
                        'outgoing_quantity' => $qtyToTake,
                        'final_stock' => $batch->remaining_quantity,
                        'description' => 'Penjualan ' . $transactionNumber,
                        'created_by' => auth()->id(),
                    ]);

                    $qtyNeeded -= $qtyToTake;
                }
            }

            DB::commit();

            return redirect()->route('sales.show', $sales->id)
                ->with('message', 'Transaksi Penjualan berhasil disimpan.');
                
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }

    public function show(Sales $sale)
    {
        $sale->load(['details.product', 'creator']);
        return Inertia::render('sales/show', [
            'sale' => $sale,
        ]);
    }
}
