// Interface para os dados de BigNumbers do Dashboard
export interface DashboardStats {
  activeMinutes: {
    value: number;
    change: number; // porcentagem de alteração (positiva ou negativa)
    trend: 'up' | 'down'; // indica se o valor está subindo ou descendo
  };
  calories: {
    value: number;
    remaining: number; // calorias restantes para atingir a meta
    trend: 'up' | 'down';
  };
  sleep: {
    value: number; // em horas
    change: number; // minutos a mais ou a menos
    trend: 'up' | 'down';
  };
  heartRate: {
    value: number; // BPM
    status: 'normal' | 'high' | 'low';
    trend: 'up' | 'down';
  };
  weeklyActivity: {
    days: {
      day: string; // Nome do dia (Dom, Seg, etc)
      shortDay: string; // Abreviação (D, S, etc)
      steps: number;
      cals: number;
      active: number; // minutos ativos
    }[];
  };
  hydration: {
    current: number; // ml consumidos
    goal: number; // meta em ml
  };
}