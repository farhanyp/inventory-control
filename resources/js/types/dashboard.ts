import { Product } from './product';
import { BatchStock } from './batch-stock';
import { IncomingProduct } from './incoming-product';

export interface DashboardMetrics {
    totalProducts: number;
    lowStockCount: number;
    expiringCount: number;
}

export interface DashboardProps {
    metrics: DashboardMetrics;
    lowStockTop: Product[];
    expiringTop: BatchStock[];
    recentIncoming: IncomingProduct[];
}
