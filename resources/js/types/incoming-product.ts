import type { Supplier } from './supplier';
import type { Product } from './product';
import type { User } from './auth';

export interface IncomingProduct {
    id: number;
    incoming_date: string;
    invoice_number: string;
    supplier_id: number;
    product_id: number;
    batch_no: string;
    expired_date: string | null;
    quantity: number | string;
    purchase_price: number | string;
    total: number | string;
    description: string | null;
    created_by: string | null;
    created_at: string | null;
    supplier?: Supplier;
    product?: Product;
    creator?: User;
    batch_stocks?: { initial_quantity: number; remaining_quantity: number }[];
}

export interface PaginatedIncomingProducts {
    data: IncomingProduct[];
    current_page: number;
    last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
}

export interface IncomingProductsIndexProps {
    incomingProducts: PaginatedIncomingProducts;
    suppliers: Supplier[];
    products: Product[];
}
