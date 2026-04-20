import { create } from 'zustand';

interface NotificationState {
  message: string | null;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
  show: (message: string, type?: 'success' | 'error' | 'info') => void;
  hide: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  message: null,
  type: 'success',
  isVisible: false,
  show: (message, type = 'success') => {
    set({ message, type, isVisible: true });
    setTimeout(() => set({ isVisible: false }), 3000);
  },
  hide: () => set({ isVisible: false }),
}));
