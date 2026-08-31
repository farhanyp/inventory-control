<?php

namespace App\Http\Controllers;

use App\Models\IncomingProduct;
use App\Models\Supplier;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class IncomingProductController extends Controller
{
    public function index()
    {
        // 1. Dapatkan 10 produk yang memiliki riwayat transaksi masuk (agar total akurat)
        $paginatedProducts = Product::whereHas('incomingProducts')->paginate(10);

        // 2. Ambil semua barang masuk dari 10 produk tersebut
        $incomingProductsData = IncomingProduct::with(['supplier', 'product', 'creator', 'batchStocks'])
            ->whereIn('product_id', $paginatedProducts->pluck('id'))
            ->orderBy('id', 'desc')
            ->get();

        // 3. Buat paginator manual dengan perhitungan akurat dari Product
        $incomingProducts = new \Illuminate\Pagination\LengthAwarePaginator(
            $incomingProductsData,
            $paginatedProducts->total(),
            $paginatedProducts->perPage(),
            $paginatedProducts->currentPage(),
            ['path' => \Illuminate\Pagination\Paginator::resolveCurrentPath()]
        );

        $suppliers = Supplier::orderBy('supplier_name')->get();
        $products = Product::orderBy('product_name')->get();

        return Inertia::render('incoming-products/index', [
            'incomingProducts' => $incomingProducts,
            'suppliers' => $suppliers,
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $minStock = 0.01;
        if ($request->filled('product_id')) {
            $product = Product::find($request->product_id);
            if ($product) {
                $minStock = $product->min_stock;
            }
        }

        $messages = [
            'incoming_date.required' => 'Tanggal masuk wajib diisi.',
            'incoming_date.date' => 'Format tanggal masuk tidak valid.',
            'supplier_id.required' => 'Supplier wajib dipilih.',
            'supplier_id.exists' => 'Supplier yang dipilih tidak valid.',
            'product_id.required' => 'Produk wajib dipilih.',
            'product_id.exists' => 'Produk yang dipilih tidak valid.',
            'expired_date.date' => 'Format tanggal kedaluwarsa tidak valid.',
            'expired_date.after_or_equal' => 'Tanggal kedaluwarsa tidak boleh sebelum tanggal barang masuk.',
            'quantity.required' => 'Kuantitas wajib diisi.',
            'quantity.numeric' => 'Kuantitas harus berupa angka.',
            'quantity.min' => 'Kuantitas minimal harus ' . $minStock . ' (sesuai batas stok minimal produk).',
            'purchase_price.required' => 'Harga beli wajib diisi.',
            'purchase_price.numeric' => 'Harga beli harus berupa angka.',
            'purchase_price.min' => 'Harga beli tidak boleh kurang dari 0.',
        ];

        $validated = $request->validate([
            'incoming_date'  => 'required|date',
            'supplier_id'    => 'required|exists:supplier,id',
            'product_id'     => 'required|exists:product,id',
            'expired_date'   => 'nullable|date|after_or_equal:incoming_date',
            'quantity'       => 'required|numeric|min:' . $minStock,
            'purchase_price' => 'required|numeric|min:0',
            'description'    => 'nullable|string',
        ], $messages);

        $validated['total'] = $validated['quantity'] * $validated['purchase_price'];
        $validated['created_by'] = Auth::id();
        $validated['created_at'] = now();

        $incomingProduct = IncomingProduct::create($validated);

        // Automatically create Batch Stock
        \App\Models\BatchStock::create([
            'product_id' => $incomingProduct->product_id,
            'batch_no' => $incomingProduct->batch_no,
            'expired_date' => $incomingProduct->expired_date,
            'initial_quantity' => $incomingProduct->quantity,
            'remaining_quantity' => $incomingProduct->quantity,
            'purchase_price' => $incomingProduct->purchase_price,
            'incoming_source_id' => $incomingProduct->id,
        ]);

        return redirect()->back()->with('success', 'Barang Masuk berhasil ditambahkan.');
    }

    public function update(Request $request, IncomingProduct $incomingProduct)
    {
        $minStock = 0.01;
        if ($request->filled('product_id')) {
            $product = Product::find($request->product_id);
            if ($product) {
                $minStock = $product->min_stock;
            }
        }

        $messages = [
            'incoming_date.required' => 'Tanggal masuk wajib diisi.',
            'incoming_date.date' => 'Format tanggal masuk tidak valid.',
            'supplier_id.required' => 'Supplier wajib dipilih.',
            'supplier_id.exists' => 'Supplier yang dipilih tidak valid.',
            'product_id.required' => 'Produk wajib dipilih.',
            'product_id.exists' => 'Produk yang dipilih tidak valid.',
            'expired_date.date' => 'Format tanggal kedaluwarsa tidak valid.',
            'expired_date.after_or_equal' => 'Tanggal kedaluwarsa tidak boleh sebelum tanggal barang masuk.',
            'quantity.required' => 'Kuantitas wajib diisi.',
            'quantity.numeric' => 'Kuantitas harus berupa angka.',
            'quantity.min' => 'Kuantitas minimal harus ' . $minStock . ' (sesuai batas stok minimal produk).',
            'purchase_price.required' => 'Harga beli wajib diisi.',
            'purchase_price.numeric' => 'Harga beli harus berupa angka.',
            'purchase_price.min' => 'Harga beli tidak boleh kurang dari 0.',
        ];

        $validated = $request->validate([
            'incoming_date'  => 'required|date',
            'supplier_id'    => 'required|exists:supplier,id',
            'product_id'     => 'required|exists:product,id',
            'expired_date'   => 'nullable|date|after_or_equal:incoming_date',
            'quantity'       => 'required|numeric|min:' . $minStock,
            'purchase_price' => 'required|numeric|min:0',
            'description'    => 'nullable|string',
        ], $messages);

        $validated['total'] = $validated['quantity'] * $validated['purchase_price'];

        $incomingProduct->update($validated);

        // Update corresponding Batch Stock
        $batchStock = \App\Models\BatchStock::where('incoming_source_id', $incomingProduct->id)->first();
        if ($batchStock) {
            // Adjust remaining quantity based on the difference (if quantity changed)
            // But since this is a simple system, let's just reset initial and remaining.
            // (In a real system, you'd calculate difference and apply to remaining).
            // For now, we will just sync initial quantity and adjust remaining if not used.
            $diff = $incomingProduct->quantity - $batchStock->initial_quantity;
            $batchStock->update([
                'product_id' => $incomingProduct->product_id,
                'expired_date' => $incomingProduct->expired_date,
                'initial_quantity' => $incomingProduct->quantity,
                'remaining_quantity' => $batchStock->remaining_quantity + $diff,
                'purchase_price' => $incomingProduct->purchase_price,
            ]);
        }

        return redirect()->back()->with('success', 'Barang Masuk berhasil diperbarui.');
    }

    public function destroy(IncomingProduct $incomingProduct)
    {
        try {
            $incomingProduct->delete();
            return redirect()->back()->with('success', 'Barang Masuk berhasil dihapus.');
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() == '23000') {
                return back()->withErrors(['message' => 'Data Barang Masuk ini tidak dapat dihapus karena stoknya sudah digunakan pada transaksi penjualan atau data lain.']);
            }
            return back()->withErrors(['message' => 'Terjadi kesalahan saat menghapus data.']);
        }
    }
}
