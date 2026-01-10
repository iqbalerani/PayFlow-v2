import { create } from 'zustand';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

interface UIState {
  isLoading: boolean;
  notifications: Notification[];

  // Actions
  setLoading: (isLoading: boolean) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  isLoading: false,
  notifications: [],

  setLoading: (isLoading) => set({ isLoading }),

  addNotification: (notification) => {
    const id = Date.now().toString();
    const newNotification = { ...notification, id };

    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));

    // Auto-remove after duration (default 5s)
    const duration = notification.duration || 5000;
    setTimeout(() => {
      get().removeNotification(id);
    }, duration);
  },

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  showSuccess: (message, duration) =>
    get().addNotification({ type: 'success', message, duration }),

  showError: (message, duration) =>
    get().addNotification({ type: 'error', message, duration }),

  showInfo: (message, duration) =>
    get().addNotification({ type: 'info', message, duration }),

  showWarning: (message, duration) =>
    get().addNotification({ type: 'warning', message, duration }),
}));
