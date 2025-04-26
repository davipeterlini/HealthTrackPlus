import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { 
  LayoutDashboard,
  FileText,
  Activity,
  Droplets,
  Film,
  Moon,
  Brain,
  Pill,
  PieChart
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import { useDashboardSettings } from "@/hooks/use-dashboard-settings";

// Interface para os itens do menu
interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
  show?: boolean;
  alwaysShow?: boolean;
}

export function MobileNav() {
  const [location] = useLocation();
  const { t } = useTranslation();
  const { settings } = useDashboardSettings();
  
  // Função para gerar os itens do menu com base nas configurações do dashboard
  const getNavItems = () => {
    const defaultSettings = {
      showActivityTracker: true,
      showWaterTracker: true,
      showSleepTracker: true,
      showMentalHealthTracker: true,
      showMedicationTracker: true,
      showWomensHealthTracker: true,
      showVideoSubscription: true,
    };
    
    const effectiveSettings = settings || defaultSettings;
    
    // Itens básicos que sempre aparecem
    const baseItems = [
      { path: "/", label: t('navigation.home'), icon: LayoutDashboard, alwaysShow: true },
      { path: "/exams", label: t('navigation.exams'), icon: FileText, alwaysShow: true },
    ];
    
    // Itens condicionais baseados nas configurações
    const conditionalItems = [
      { 
        path: "/activity", 
        label: t('navigation.activity'), 
        icon: Activity, 
        show: effectiveSettings.showActivityTracker,
        alwaysShow: false 
      },
      { 
        path: "/nutrition", 
        label: t('navigation.water'), 
        icon: Droplets, 
        show: effectiveSettings.showWaterTracker,
        alwaysShow: false 
      },
      { 
        path: "/sleep", 
        label: t('navigation.sleep'), 
        icon: Moon, 
        show: effectiveSettings.showSleepTracker,
        alwaysShow: false 
      },
      { 
        path: "/mental", 
        label: t('navigation.mental'), 
        icon: Brain, 
        show: effectiveSettings.showMentalHealthTracker,
        alwaysShow: false 
      },
      { 
        path: "/medication", 
        label: t('navigation.medication'), 
        icon: Pill, 
        show: effectiveSettings.showMedicationTracker,
        alwaysShow: false 
      },
      { 
        path: "/womens-health", 
        label: t('navigation.womens'), 
        icon: PieChart, 
        show: effectiveSettings.showWomensHealthTracker,
        alwaysShow: false 
      },
      { 
        path: "/videos", 
        label: t('navigation.videos'), 
        icon: Film,
        show: effectiveSettings.showVideoSubscription,
        alwaysShow: false 
      }
    ];
    
    // Combinar itens base com os condicionais
    const allItems = [
      ...baseItems,
      ...conditionalItems.filter(item => item.alwaysShow || item.show)
    ];
    
    // Limitar a 5 itens para o menu inferior
    return allItems.slice(0, 5);
  };
  
  const navItems = getNavItems();
  
  return (
    <div className="block sm:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1a2127] border-t border-blue-100 dark:border-gray-800 shadow-lg z-10">
      <div className="grid grid-cols-5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <div key={item.path} className="flex justify-center">
              <Link href={item.path} className={`flex flex-col items-center px-1 py-2 responsive-transition ${
                isActive 
                  ? 'text-blue-600 dark:text-emerald-400 font-medium' 
                  : 'text-slate-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-emerald-300'
              }`}>
                <Icon className="responsive-icon-sm" />
                <span className="responsive-text-xs mt-1 text-center truncate max-w-[60px]">{item.label}</span>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
