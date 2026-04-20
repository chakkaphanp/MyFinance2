import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}

export const authAPI = {
  login: (data: LoginRequest) => api.post('/auth/login', data),
  register: (data: RegisterRequest) => api.post('/auth/register', data),
};

export const transactionAPI = {
  create: (data: any) => api.post('/transactions', data),
  list: (page: number = 1, pageSize: number = 20) =>
    api.get('/transactions', { params: { page, pageSize } }),
  get: (id: string) => api.get(`/transactions/${id}`),
  update: (id: string, data: any) => api.put(`/transactions/${id}`, data),
  delete: (id: string) => api.delete(`/transactions/${id}`),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getCategoryBreakdown: (month?: number, year?: number) =>
    api.get('/dashboard/category-breakdown', { params: { month, year } }),
  getMonthlyTrend: (months: number = 6) =>
    api.get('/dashboard/monthly-trend', { params: { months } }),
};
