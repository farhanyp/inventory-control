import { Link, usePage } from '@inertiajs/react';
import { Archive, ArrowRightLeft, FileText, FolderGit2, LayoutGrid, Package, Scale, ShoppingCart, Tags, Truck, Users, X } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavGroup } from '@/types';

const navGroups: NavGroup[] = [
    {
        title: 'Utama',
        items: [
            {
                title: 'Dasbor',
                href: dashboard(),
                icon: LayoutGrid,
            }
        ]
    },
    {
        title: 'Master Data',
        items: [
            {
                title: 'Kategori',
                href: '/categories',
                icon: Tags,
                roles: ['ADMIN'],
            },
            {
                title: 'Satuan',
                href: '/units',
                icon: Scale,
                roles: ['ADMIN'],
            },
            {
                title: 'Supplier',
                href: '/suppliers',
                icon: Truck,
                roles: ['ADMIN'],
            },
            {
                title: 'Reseller',
                href: '/resellers',
                icon: Users,
                roles: ['ADMIN'],
            },
            {
                title: 'Produk',
                href: '/products',
                icon: Package,
                roles: ['MANAGEMENT', 'ADMIN'],
            },
        ]
    },
    {
        title: 'Transaksi & Stok',
        items: [
            {
                title: 'Barang Masuk',
                href: '/incoming-products',
                icon: ArrowRightLeft,
                roles: ['MANAGEMENT', 'ADMIN'],
            },
            {
                title: 'Stok & Kedaluwarsa',
                href: '/batch-stocks',
                icon: Archive,
                roles: ['MANAGEMENT', 'ADMIN'],
            },
            {
                title: 'Penjualan',
                href: '/sales',
                icon: ShoppingCart,
                roles: ['MANAGEMENT', 'STAFF'],
            },
        ]
    },
    {
        title: 'Manajemen & Laporan',
        items: [
            {
                title: 'Manajemen Pengguna',
                href: '/users',
                icon: Users,
                roles: ['MANAGEMENT'],
            },
            {
                title: 'Laporan',
                href: '/reports',
                icon: FileText,
                roles: ['MANAGEMENT'],
            }
        ]
    }
];


// const footerNavItems: NavItem[] = [
//     {
//         title: 'Repository',
//         href: 'https://github.com/laravel/react-starter-kit',
//         icon: FolderGit2,
//     },
//     {
//         title: 'Documentation',
//         href: 'https://laravel.com/docs/starter-kits#react',
//         icon: BookOpen,
//     },
// ];

export function AppSidebar() {
    const { auth, expiringStockCount } = usePage().props as any;
    const user = auth?.user;
    const userRole = user?.roles?.[0]?.name?.toUpperCase() || 'GUEST';
    const { setOpenMobile, isMobile } = useSidebar();

    const visibleNavGroups = navGroups.map(group => {
        const filteredItems = group.items.map(item => {
            if (item.title === 'Stok & Kedaluwarsa') {
                return { ...item, badge: expiringStockCount };
            }
            return item;
        }).filter((item) => {
            if (!item.roles || item.roles.length === 0) return true;
            return item.roles.includes(userRole);
        });

        return { ...group, items: filteredItems };
    }).filter(group => group.items.length > 0);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <div className="flex items-center justify-between w-full">
                    <SidebarMenu className="flex-1 w-auto">
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <Link href={dashboard()} prefetch>
                                    <AppLogo />
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                    {isMobile && (
                        <button
                            type="button"
                            onClick={() => setOpenMobile(false)}
                            className="p-1.5 ml-2 rounded-md text-sidebar-foreground/70 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent transition-colors shrink-0"
                            aria-label="Tutup sidebar"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </SidebarHeader>

            <SidebarContent>
                <NavMain groups={visibleNavGroups} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
