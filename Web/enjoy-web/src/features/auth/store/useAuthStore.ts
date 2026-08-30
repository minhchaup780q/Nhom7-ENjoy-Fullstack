import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken?: string) => void;
  setAccessToken: (accessToken: string) => void;
  setHasPassword: (hasPassword: boolean) => void;
  logout: () => void;
}

const ACCESS_TOKEN_KEY = 'enjoy_access_token';
const REFRESH_TOKEN_KEY = 'enjoy_refresh_token';
// Thông tin cơ bản của user nếu sau này cần lưu (hiện tại chỉ có email, sau này có thể decode chuỗi accessToken lấy thêm userID, role...)
const USER_KEY = 'enjoy_user';

const initialAccessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
const initialRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
const initialUserStr = localStorage.getItem(USER_KEY);

let initialUser: User | null = null;
if (initialUserStr) {
  try {
    initialUser = JSON.parse(initialUserStr);
  } catch {
    initialUser = null;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  accessToken: initialAccessToken,
  refreshToken: initialRefreshToken,
  isAuthenticated: !!initialAccessToken,

  setAuth: (user: User, accessToken: string, refreshToken?: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    set({
      user,
      accessToken,
      refreshToken: refreshToken || null,
      isAuthenticated: true,
    });
  },

  setAccessToken: (newAccessToken: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
    set({ accessToken: newAccessToken });
  },

  setHasPassword: (hasPassword: boolean) => {
    set((state) => {
      const updatedUser = state.user ? { ...state.user, hasPassword } : null;
      if (updatedUser) {
        localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      }
      return { user: updatedUser };
    });
  },

  logout: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },
}));
