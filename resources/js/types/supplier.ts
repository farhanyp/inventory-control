export interface Supplier {
    id: number;
    supplier_code: string;
    supplier_name: string;
    phone_number: string;
    address: string;
    incoming_products_count?: number;
}
