import type { User } from './auth';

export interface UsersIndexProps {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
    };
    roles: { name: string; value: string }[];
}
