export interface Category {
    id: number;
    category_name: string;
    products_count?: number;
}

export interface CategoriesIndexProps {
    categories: {
        data: Category[];
        current_page: number;
        last_page: number;
    };
}

export interface CategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export interface CategoryActionDialogProps extends CategoryDialogProps {
    category: Category | null;
}
