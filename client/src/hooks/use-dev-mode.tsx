import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DevModeState {
  isEnabled: boolean;
  bypassAuth: boolean;
  toggleDevMode: () => void;
  toggleBypassAuth: () => void;
  disableDevMode: () => void;
}

export const useDevMode = create<DevModeState>()(
  persist(
    (set) => ({
      isEnabled: true, // Habilitado por padrão conforme solicitado
      bypassAuth: false,
      toggleDevMode: () => set((state) => ({ isEnabled: !state.isEnabled })),
      toggleBypassAuth: () => set((state) => ({ bypassAuth: !state.bypassAuth })),
      disableDevMode: () => set({ isEnabled: false, bypassAuth: false }),
    }),
    {
      name: 'dev-mode-storage',
    }
  )
);