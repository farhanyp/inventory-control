export function groupByKey<T>(items: T[], key: keyof T): T[][] {
    const grouped = items.reduce((acc, item) => {
        const k = String(item[key]);
        if (!acc[k]) acc[k] = [];
        acc[k].push(item);
        return acc;
    }, {} as Record<string, T[]>);
    return Object.values(grouped);
}
