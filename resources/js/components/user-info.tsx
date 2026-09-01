import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import type { User } from '@/types';

export function UserInfo({
    user,
    showEmail = false,
}: {
    user: User;
    showEmail?: boolean;
}) {
    const getInitials = useInitials();

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                {user.roles && Array.isArray(user.roles) && user.roles.length > 0 && (
                    <span className="truncate text-xs text-muted-foreground capitalize">
                        {String((user.roles[0] as any).name).toUpperCase() === 'MANAGEMENT' 
                            ? 'Pimpinan' 
                            : String((user.roles[0] as any).name).toUpperCase() === 'STAFF' 
                                ? 'Sales Admin' 
                                : String((user.roles[0] as any).name)}
                    </span>
                )}
                {showEmail && (
                    <span className="truncate text-xs text-muted-foreground">
                        {user.email}
                    </span>
                )}
            </div>
        </>
    );
}
