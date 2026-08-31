export interface Reseller {
    id: number;
    reseller_code: string;
    reseller_name: string;
    phone_number: string | null;
    address: string | null;
    created_at: string;
    sales_count?: number;
}
