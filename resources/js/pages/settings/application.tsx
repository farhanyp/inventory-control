import { Head, useForm, router } from '@inertiajs/react';
import SettingsLayout from '@/layouts/settings/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { ApplicationSettings } from '@/types';
import Heading from '@/components/heading';
import { useState, useRef } from 'react';
import { Loader2 } from 'lucide-react';

interface Props {
    settings: ApplicationSettings | null;
}

export default function ApplicationSettingsPage({ settings }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewLogo, setPreviewLogo] = useState<string | null>(
        settings?.logo ? `/storage/${settings.logo}` : null
    );

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        application_name: settings?.application_name || '',
        logo: null as File | null,
        address: settings?.address || '',
        phone_number: settings?.phone_number || '',
        email: settings?.email || '',
    });

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('logo', file);

            // Preview image
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewLogo(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // We use POST instead of PATCH because we're uploading files
        post('/settings/application', {
            preserveScroll: true,
            onSuccess: () => {
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        });
    };

    return (
        <>
            <Head title="Pengaturan Aplikasi" />

            <div className="space-y-6">
                <Heading
                    title="Aplikasi"
                    description="Kelola informasi utama aplikasi seperti nama, logo, alamat, dan kontak."
                    variant="small"
                />

                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="application_name">Nama Aplikasi</Label>
                        <Input
                            id="application_name"
                            value={data.application_name}
                            onChange={(e) => setData('application_name', e.target.value)}
                            disabled={processing}
                            required
                            maxLength={150}
                        />
                        {errors.application_name && (
                            <p className="text-sm text-destructive">{errors.application_name}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="logo">Logo Aplikasi</Label>

                        <div className="flex items-start gap-6">
                            <div className="flex-shrink-0">
                                {previewLogo ? (
                                    <div className="w-24 h-24 rounded-lg border overflow-hidden bg-muted flex items-center justify-center">
                                        <img
                                            src={previewLogo}
                                            alt="Logo Preview"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-24 h-24 rounded-lg border border-dashed border-muted-foreground/25 bg-muted flex items-center justify-center text-muted-foreground text-xs text-center p-2">
                                        Belum ada logo
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 space-y-2">
                                <Input
                                    id="logo"
                                    type="file"
                                    accept="image/jpeg,image/png,image/jpg,image/svg+xml"
                                    onChange={handleLogoChange}
                                    ref={fileInputRef}
                                    disabled={processing}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Format: JPG, PNG, SVG. Maks 2MB. Logo akan digunakan di header web dan laporan cetak.
                                </p>
                                {errors.logo && (
                                    <p className="text-sm text-destructive">{errors.logo}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            maxLength={100}
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">{errors.email}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone_number">No. Telepon / WhatsApp</Label>
                        <Input
                            id="phone_number"
                            value={data.phone_number}
                            onChange={(e) => setData('phone_number', e.target.value)}
                            disabled={processing}
                            maxLength={30}
                        />
                        {errors.phone_number && (
                            <p className="text-sm text-destructive">{errors.phone_number}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Alamat Perusahaan</Label>
                        <Textarea
                            id="address"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            disabled={processing}
                            rows={3}
                        />
                        {errors.address && (
                            <p className="text-sm text-destructive">{errors.address}</p>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <Button type="submit" disabled={processing}>
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Simpan Pengaturan
                        </Button>

                        {recentlySuccessful && (
                            <p className="text-sm font-medium text-green-600 dark:text-green-400">
                                Berhasil disimpan.
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </>
    );
}
