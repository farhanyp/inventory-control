import type { User } from './auth';
import type { Product } from './product';

export interface SalesDetail {
    id: number;
    sales_id: number;
    product_id: number;
    batch_id: number;
    batch_no: string;
    expired_date: string;
    quantity: number | string;
    selling_price: number | string;
    subtotal: number | string;
    product?: Product;
}

export interface Sales {
    id: number;
    transaction_number: string;
    transaction_date: string;
    customer_name: string | null;
    payment_method: 'Cash' | 'Transfer';
    total: number | string;
    paid_amount: number | string;
    change_amount: number | string;
    description: string | null;
    created_by: string;
    created_at: string;
    creator?: User;
    details?: SalesDetail[];
}
