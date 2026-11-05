import { create } from 'zustand';
import { STORAGE_KEY_ACCESS_TOKEN, STORAGE_KEY_ADMIN_INFO } from '@/lib/constants';

type AdminInfo = {
  id: number;
  name: string;
  email: string;
};

type AuthState = {
  token: string | null;
  adminInfo: AdminInfo | null;
  isAuthenticated: boolean;
  login: (token: string, adminInfo: AdminInfo) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => {
  const token = localStorage.getItem(STORAGE_KEY_ACCESS_TOKEN);
  const stored = localStorage.getItem(STORAGE_KEY_ADMIN_INFO);
  const adminInfo = stored ? (JSON.parse(stored) as AdminInfo) : null;

  return {
    token,
    adminInfo,
    isAuthenticated: !!token,
    login: (token, adminInfo) => {
      localStorage.setItem(STORAGE_KEY_ACCESS_TOKEN, token);
      localStorage.setItem(STORAGE_KEY_ADMIN_INFO, JSON.stringify(adminInfo));
      set({ token, adminInfo, isAuthenticated: true });
    },
    logout: () => {
      localStorage.removeItem(STORAGE_KEY_ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEY_ADMIN_INFO);
      set({ token: null, adminInfo: null, isAuthenticated: false });
    },
  };
});
