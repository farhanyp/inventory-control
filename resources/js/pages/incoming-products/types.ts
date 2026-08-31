import type { IncomingProduct } from '@/types';

export type ExpandedGroups = Record<number, boolean>;
export type GroupedIncomingProducts = Record<number, IncomingProduct[]>;
