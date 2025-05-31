import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type DevModeContextType = {
  skipAuth: boolean;
  toggleSkipAuth: () => void;
  setSkipAuth: (value: boolean) => void;
};

const DevModeContext = createContext<DevModeContextType | null>(null);

export function DevModeProvider({ children }: { children: ReactNode }) {
  // Definir valor inicial como true temporariamente para facilitar o desenvolvimento
  const [skipAuth, setSkipAuth] = useState(() => {
    const savedDevMode = localStorage.getItem('dev_mode_skip_auth');
    return savedDevMode !== null ? savedDevMode === 'true' : true;
  });

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

  const handleSetSkipAuth = (value: boolean) => {
    localStorage.setItem('dev_mode_skip_auth', String(value));
    setSkipAuth(value);
  };

  return (
    <DevModeContext.Provider value={{ skipAuth, toggleSkipAuth, setSkipAuth: handleSetSkipAuth }}>
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