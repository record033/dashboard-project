import { $api } from '@/lib/axios';
import { get } from 'http';

export interface RecordItem {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  authorId: number;
  author?: {
    email: string;
    firstName: string;
    lastName: string;
  }
}

export const RecordsService = {
  async getAll() {
    const { data } = await $api.get<RecordItem[]>('/records');
    return data;
  },

  async getById(id: number) {
    const { data } = await $api.get<RecordItem>(`/records/${id}`);
    return data;
  },

  async create(title: string, content: string) {
    const { data } = await $api.post<RecordItem>('/records', { title, content });
    return data;
  },

  async delete(id: number) {
    await $api.delete(`/records/${id}`);
  },
};