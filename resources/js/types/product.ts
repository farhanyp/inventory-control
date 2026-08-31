import type { Category } from './category';
import type { Unit } from './unit';

export interface Product {
    id: number;
    product_code: string;
    product_name: string;
    category_id: number;
    unit_id: number;
    purchase_price: number | string;
    selling_price: number | string;
    min_stock: number | string;
    status: 'active' | 'inactive';
    category?: Category;
    unit?: Unit;
    incoming_products_count?: number;
    sales_details_count?: number;
}
