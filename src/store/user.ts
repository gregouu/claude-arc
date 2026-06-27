import { create } from 'zustand';

interface UserState {
  firstName: string;
  lastName: string;
  club: string;
  licenseNumber: string;
  setUser: (user: Partial<Omit<UserState, 'setUser'>>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  firstName: 'Greg',
  lastName: 'D.',
  club: '',
  licenseNumber: '',
  setUser: (user) => set(user),
}));
