import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type DevModeContextType = {
  skipAuth: boolean;
  toggleSkipAuth: () => void;
};

const DevModeContext = createContext<DevModeContextType | null>(null);

export function DevModeProvider({ children }: { children: ReactNode }) {
  // Definir valor inicial como true temporariamente para facilitar o desenvolvimento
  const [skipAuth, setSkipAuth] = useState(true);

  // Efeito para salvar a preferência do modo de desenvolvedor no localStorage
  useEffect(() => {
    const savedDevMode = localStorage.getItem('dev_mode_skip_auth');
    if (savedDevMode !== null) {
      setSkipAuth(savedDevMode === 'true');
    }
  }, []);

  const toggleSkipAuth = () => {
    setSkipAuth(prev => {
      const newValue = !prev;
      localStorage.setItem('dev_mode_skip_auth', String(newValue));
      return newValue;
    });
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