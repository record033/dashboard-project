import { $api } from '@/lib/axios';

export interface AuthResponse {
  access_token: string;
}

export const AuthService = {
  async register(email: string, password: string, firstName: string, lastName: string) {
    const { data } = await $api.post<AuthResponse>('/auth/register', { email, password, firstName, lastName });
    return data;
  },

  async login(email: string, password: string) {
    const { data } = await $api.post<AuthResponse>('/auth/login', { email, password });
    return data;
  },

  async logout() {
    await $api.post('/auth/logout');
  },
};