<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use App\Enums\ProductStatus;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['category', 'unit'])->withCount(['incomingProducts', 'salesDetails'])->orderBy('id', 'desc')->paginate(10);
        $categories = Category::orderBy('category_name')->get();
        $units = Unit::orderBy('unit_name')->get();

        return Inertia::render('products/index', [
            'products' => $products,
            'categories' => $categories,
            'units' => $units,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_name' => 'required|string|max:255',
            'category_id'  => 'required|exists:category,id',
            'unit_id'      => 'required|exists:unit,id',
            'purchase_price' => 'required|numeric|min:0',
            'selling_price'  => 'required|numeric|min:0',
            'min_stock'    => 'required|numeric|min:0',
            'status'       => ['required', Rule::enum(ProductStatus::class)],
        ]);

        Product::create($validated);

        return redirect()->back()->with('success', 'Product created successfully.');
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'product_name' => 'required|string|max:255',
            'category_id'  => 'required|exists:category,id',
            'unit_id'      => 'required|exists:unit,id',
            'purchase_price' => 'required|numeric|min:0',
            'selling_price'  => 'required|numeric|min:0',
            'min_stock'    => 'required|numeric|min:0',
            'status'       => ['required', Rule::enum(ProductStatus::class)],
        ]);

        $product->update($validated);

        return redirect()->back()->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        try {
            $product->delete();
            return redirect()->back()->with('success', 'Produk berhasil dihapus.');
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() == '23000') {
                return back()->withErrors(['message' => 'Produk ini tidak dapat dihapus karena masih terhubung dengan data lain (misalnya transaksi).']);
            }
            return back()->withErrors(['message' => 'Terjadi kesalahan saat menghapus data.']);
        }
    }
}
