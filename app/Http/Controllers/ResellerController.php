<?php

namespace App\Http\Controllers;

use App\Models\Reseller;
use Illuminate\Http\Request;

class ResellerController extends Controller
{
    public function index()
    {
        $resellers = Reseller::withCount('sales')->orderBy('id', 'desc')->paginate(10);

        return \Inertia\Inertia::render('resellers/index', [
            'resellers' => $resellers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'reseller_name' => 'required|string|max:120',
            'phone_number' => 'nullable|string|max:30',
            'address' => 'nullable|string',
        ]);

        $lastReseller = Reseller::orderBy('id', 'desc')->first();
        $nextId = 1;
        if ($lastReseller && preg_match('/RSL-(\d+)/', $lastReseller->reseller_code, $matches)) {
            $nextId = intval($matches[1]) + 1;
        } elseif ($lastReseller) {
            $nextId = $lastReseller->id + 1;
        }
        $validated['reseller_code'] = 'RSL-' . str_pad($nextId, 3, '0', STR_PAD_LEFT);

        Reseller::create($validated);

        return redirect()->back()->with('success', 'Reseller created successfully.');
    }

    public function update(Request $request, Reseller $reseller)
    {
        $validated = $request->validate([
            'reseller_name' => 'required|string|max:120',
            'phone_number' => 'nullable|string|max:30',
            'address' => 'nullable|string',
        ]);

        $reseller->update($validated);

        return redirect()->back()->with('success', 'Reseller updated successfully.');
    }

    public function destroy(Reseller $reseller)
    {
        try {
            $reseller->delete();
            return redirect()->back()->with('success', 'Reseller berhasil dihapus.');
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() == '23000') {
                return back()->withErrors(['message' => 'Reseller ini tidak dapat dihapus karena masih terhubung dengan data penjualan.']);
            }
            return back()->withErrors(['message' => 'Terjadi kesalahan saat menghapus data.']);
        }
    }
}
