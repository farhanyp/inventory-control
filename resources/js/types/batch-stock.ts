import type { Product } from './product';
import type { IncomingProduct } from './incoming-product';

export interface BatchStock {
    id: number;
    product_id: number;
    batch_no: string;
    expired_date: string | null;
    initial_quantity: number | string;
    remaining_quantity: number | string;
    purchase_price: number | string;
    incoming_source_id: number | null;
    product?: Product;
    incoming_product?: IncomingProduct;
    expired_status?: 'Aman' | 'Peringatan' | 'Hampir Expired' | 'Expired';
}

export interface PaginatedBatchStocks {
    data: BatchStock[];
    current_page: number;
    last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
}

export interface BatchStocksIndexProps {
    batchStocks: PaginatedBatchStocks;
}
