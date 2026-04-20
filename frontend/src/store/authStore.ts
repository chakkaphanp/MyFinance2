import { create } from 'zustand';

export type Currency = 'USD' | 'THB';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  loadFromStorage: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  currency: 'USD',
  setCurrency: (currency) => {
    localStorage.setItem('currency', currency);
    set({ currency });
  },
  setAuth: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },
  loadFromStorage: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const currency = (localStorage.getItem('currency') as Currency) || 'USD';
    if (token && user) {
      set({ token, user: JSON.parse(user), currency });
    } else {
      set({ currency });
    }
  },
}));
