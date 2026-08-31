import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export function Pagination({ links }: { links: PaginationLink[] }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="flex flex-wrap items-center justify-center gap-1 mt-6">
            {links.map((link, index) => {
                const isPrevious = link.label.includes('Previous');
                const isNext = link.label.includes('Next');
                const label = isPrevious ? <ChevronLeft className="w-4 h-4" /> : isNext ? <ChevronRight className="w-4 h-4" /> : <span dangerouslySetInnerHTML={{ __html: link.label }} />;

                return link.url ? (
                    <Button
                        key={index}
                        asChild
                        variant={link.active ? "default" : "outline"}
                        size="sm"
                        className={`min-w-9 h-9 px-3 ${link.active ? 'pointer-events-none' : ''}`}
                    >
                        <Link href={link.url} preserveScroll>
                            {label}
                        </Link>
                    </Button>
                ) : (
                    <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        disabled
                        className="min-w-9 h-9 px-3 opacity-50"
                    >
                        {label}
                    </Button>
                );
            })}
        </div>
    );
}
