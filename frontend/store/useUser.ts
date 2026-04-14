import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface UserStore {
  user: User | null;
  token: string | null;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  setUser: (user: User, token: string) => void;
  clearUser: () => void;
}

export const useUser = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      hasHydrated: false,

      setHasHydrated: (state) => set({ hasHydrated: state }),

      setUser: (user, token) => set({ user, token }),
      clearUser: () => set({ user: null, token: null }),
    }),
    {
      name: 'user-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
