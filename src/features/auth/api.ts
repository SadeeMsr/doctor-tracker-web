import { api } from '@/lib/api-client';

import type { LoginInput, User } from './types';

export const authApi = {
  login: (input: LoginInput) => api.post<{ data: User }>('/auth/login', input),
  logout: () => api.post<void>('/auth/logout'),
  me: () => api.get<{ data: User }>('/auth/me'),
};
