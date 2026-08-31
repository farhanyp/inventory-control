export interface DateFilterForm {
    start_date: string;
    end_date: string;
}

export type ReportType = 'stock' | 'incoming' | 'sales' | 'expired';

export interface ReportConfig {
    id: ReportType;
    title: string;
    description: string;
    icon: string;
    requiresDateRange: boolean;
    endpoint: string;
}
