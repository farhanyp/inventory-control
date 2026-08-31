<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Settings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ApplicationController extends Controller
{
    public function edit(): Response
    {
        $settings = Settings::first();
        
        return Inertia::render('settings/application', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $settings = Settings::first();

        $validated = $request->validate([
            'application_name' => 'required|string|max:150',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
            'address' => 'nullable|string',
            'phone_number' => 'nullable|string|max:30',
            'email' => 'nullable|email|max:100',
        ], [
            'application_name.required' => 'Nama aplikasi wajib diisi.',
            'logo.image' => 'File logo harus berupa gambar.',
            'logo.mimes' => 'Format gambar yang didukung adalah jpeg, png, jpg, svg.',
            'logo.max' => 'Ukuran maksimal logo adalah 2MB.',
            'email.email' => 'Format email tidak valid.',
        ]);

        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($settings && $settings->logo) {
                Storage::disk('public')->delete($settings->logo);
            }
            
            $path = $request->file('logo')->store('logos', 'public');
            $validated['logo'] = $path;
        } else {
            // keep old logo if not uploading new one
            if ($settings) {
                $validated['logo'] = $settings->logo;
            }
        }

        if ($settings) {
            $settings->update($validated);
        } else {
            Settings::create($validated);
        }

        \Illuminate\Support\Facades\Cache::forget('app_settings');

        return redirect()->back()->with('success', 'Pengaturan aplikasi berhasil disimpan.');
    }
}
