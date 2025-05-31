import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Interface para os ajustes do dashboard
interface DashboardSettings {
  showWaterTracker: boolean;
  showSleepTracker: boolean;
  showActivityTracker: boolean;
  showNutritionTracker: boolean;
  showMentalHealthTracker: boolean;
  showMedicationTracker: boolean;
  showWomensHealthTracker: boolean;
  showVideoSubscription: boolean;
  compactView: boolean;
  enableDragAndDrop: boolean;
}

// Valores padrão
const defaultSettings: DashboardSettings = {
  showWaterTracker: true,
  showSleepTracker: true,
  showActivityTracker: true,
  showNutritionTracker: true,
  showMentalHealthTracker: true,
  showMedicationTracker: true,
  showWomensHealthTracker: true,
  showVideoSubscription: true,
  compactView: true,
  enableDragAndDrop: true,
};

// Tipo do contexto
interface DashboardSettingsContextType {
  settings: DashboardSettings;
  updateSettings: (updates: Partial<DashboardSettings>) => void;
  resetSettings: () => void;
}

// Criação do contexto
const DashboardSettingsContext = createContext<DashboardSettingsContextType | undefined>(undefined);

// Provider para o contexto
export function DashboardSettingsProvider({ children }: { children: ReactNode }) {
  // Tentar carregar configurações do localStorage
  const getInitialSettings = (): DashboardSettings => {
    try {
      const storedSettings = localStorage.getItem('dashboardSettings');
      return storedSettings ? JSON.parse(storedSettings) : defaultSettings;
    } catch (error) {
      console.error('Error loading dashboard settings from localStorage:', error);
      return defaultSettings;
    }
  };

  const [settings, setSettings] = useState<DashboardSettings>(getInitialSettings);

  // Atualizar uma ou mais configurações
  const updateSettings = (updates: Partial<DashboardSettings>) => {
    setSettings(prev => {
      const newSettings = { ...prev, ...updates };
      // Salvar no localStorage
      localStorage.setItem('dashboardSettings', JSON.stringify(newSettings));
      return newSettings;
    });
  };

  // Resetar para valores padrão
  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.setItem('dashboardSettings', JSON.stringify(defaultSettings));
  };

  useEffect(() => {
    // Inicialmente, salva as configurações no localStorage se ainda não existirem
    if (!localStorage.getItem('dashboardSettings')) {
      localStorage.setItem('dashboardSettings', JSON.stringify(settings));
    }
  }, []);

  return (
    <DashboardSettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </DashboardSettingsContext.Provider>
  );
}

// Hook customizado para usar o contexto
export function useDashboardSettings() {
  const context = useContext(DashboardSettingsContext);
  if (context === undefined) {
    throw new Error('useDashboardSettings must be used within a DashboardSettingsProvider');
  }
  return context;
}