import { create } from 'zustand';
import authService, { User } from '../services/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  login: (message: string, signature: string) => Promise<void>;
  testLogin: (walletAddress: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: true }),

  setToken: (token) => set({ token }),

  login: async (message, signature) => {
    try {
      const response = await authService.verify(message, signature);
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Login error:', error);
      set({ isAuthenticated: false, isLoading: false });
      throw error;
    }
  },

  testLogin: async (walletAddress) => {
    try {
      const response = await authService.testLogin(walletAddress);
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Test login error:', error);
      set({ isAuthenticated: false, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    }
  },

  initialize: () => {
    const token = authService.getToken();
    const user = authService.getStoredUser();

    if (token && user) {
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      set({ isLoading: false });
    }
  },
}));
