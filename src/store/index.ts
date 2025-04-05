import { create } from 'zustand';
import { Session } from '@/types/session';

interface State {
  session: Session | null;
  setSession: (session: Session | null) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const useStore = create<State>((set) => ({
  session: null,
  setSession: (session) => set({ session }),
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));

export { useStore };
export default useStore;
