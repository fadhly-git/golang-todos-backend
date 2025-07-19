export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface CardType {
    id: string;
    title: string;
    description: string;
    column: string;
    // Optional properties yang mungkin diperlukan untuk UI
    createdAt?: string;
    updatedAt?: string;
}

export type ColumnType = 'todo' | 'doing' | 'done' | string;