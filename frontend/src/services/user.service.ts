import { $api } from '@/lib/axios';

export interface UserItem {
    id: number;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export const UsersService = {
    async getAll() {
        const { data } = await $api.get<UserItem[]>('/users');
        return data;
    },

    async delete(id: number) {
        await $api.delete(`/users/${id}`);
    },

    async update(id: number, data: Partial<UserItem>) {
        await $api.patch(`/users/${id}`, data);
    },
};
