import { usePage } from '@inertiajs/react';

import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    const { name, appSettings } = usePage<any>().props;

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md overflow-hidden">
                {appSettings?.logo ? (
                    <img 
                        src={`/storage/${appSettings.logo}`} 
                        alt={name} 
                        className="w-full h-full object-contain" 
                    />
                ) : (
                    <AppLogoIcon className="size-8 fill-current text-[var(--foreground)] dark:text-white" />
                )}
            </div>
            <div className="ml-2 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {name}
                </span>
            </div>
        </>
    );
}
