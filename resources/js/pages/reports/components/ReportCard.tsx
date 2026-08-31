import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

interface ReportCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    requiresDateRange?: boolean;
    children?: React.ReactNode;
    onPrint?: () => void;
}

export function ReportCard({
    title,
    description,
    icon,
    requiresDateRange = false,
    children,
    onPrint
}: ReportCardProps) {
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        {icon}
                    </div>
                    <div>
                        <CardTitle className="text-lg">{title}</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground mt-1">
                            {description}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-end">
                {requiresDateRange ? (
                    children
                ) : (
                    <Button onClick={onPrint} className="w-full flex items-center justify-center gap-2 mt-4">
                        <Printer className="w-4 h-4" /> Cetak Laporan
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
