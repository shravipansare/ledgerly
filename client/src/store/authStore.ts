import { create } from "zustand";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem("ledgerly_user") || "null"),
  token: localStorage.getItem("ledgerly_token"),
  isAuthenticated: !!localStorage.getItem("ledgerly_token"),
  login: (user, token) => {
    localStorage.setItem("ledgerly_user", JSON.stringify(user));
    localStorage.setItem("ledgerly_token", token);
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem("ledgerly_user");
    localStorage.removeItem("ledgerly_token");
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
