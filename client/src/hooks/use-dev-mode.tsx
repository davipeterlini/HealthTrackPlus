import { createContext, useContext, useState, ReactNode } from "react";

type DevModeContextType = {
  skipAuth: boolean;
  toggleSkipAuth: () => void;
};

const DevModeContext = createContext<DevModeContextType | null>(null);

export function DevModeProvider({ children }: { children: ReactNode }) {
  const [skipAuth, setSkipAuth] = useState(false);

  const toggleSkipAuth = () => {
    setSkipAuth(prev => !prev);
  };

  return (
    <DevModeContext.Provider value={{ skipAuth, toggleSkipAuth }}>
      {children}
    </DevModeContext.Provider>
  );
}

export function useDevMode() {
  const context = useContext(DevModeContext);
  if (!context) {
    throw new Error("useDevMode must be used within a DevModeProvider");
  }
  return context;
}