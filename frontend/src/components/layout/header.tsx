import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../language-switcher';
import { ThemeToggle } from '../theme-toggle';
import { NotificationsDropdown } from '../notifications-dropdown';
import { DevModeHeaderToggle } from '../dev-mode-header-toggle';
import { useAuth } from "@/hooks/use-auth";
import { useDashboardSettings } from "@/hooks/use-dashboard-settings";
import { BellIcon, Home, Activity, Droplets, Moon, Brain, FileText, Menu, Settings, HelpCircle, LogOut, X, Pill, PieChart, Film, Target, Timer, Crown, Heart, Baby } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetTitle, 
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";

const getNavItems = (t: any, settings: any = {}) => {
  // Valores padrão para settings caso não seja definido
  const defaultSettings = {
    showActivityTracker: true,
    showWaterTracker: true,
    showSleepTracker: true,
    showMentalHealthTracker: true,
    showMedicationTracker: true,
    showWomensHealthTracker: true,
    showVideoSubscription: true,
  };
  
  // Usar os settings passados ou os padrões
  const effectiveSettings = settings || defaultSettings;
  
  const baseItems = [
    { path: "/", label: t('navigation.home'), icon: Home, alwaysShow: true },
  ];
  
  const conditionalItems = [
    { 
      path: "/activity", 
      label: t('navigation.activity'), 
      icon: Activity, 
      show: effectiveSettings.showActivityTracker 
    },
    { 
      path: "/nutrition", 
      label: t('navigation.water'), 
      icon: Droplets, 
      show: effectiveSettings.showWaterTracker 
    },
    { 
      path: "/sleep", 
      label: t('navigation.sleep'), 
      icon: Moon, 
      show: effectiveSettings.showSleepTracker 
    },
    { 
      path: "/mental", 
      label: t('navigation.mental'), 
      icon: Brain, 
      show: effectiveSettings.showMentalHealthTracker 
    },
    { 
      path: "/medication", 
      label: t('navigation.medication'), 
      icon: Pill, 
      show: effectiveSettings.showMedicationTracker 
    },
    { 
      path: "/womens-health", 
      label: t('navigation.womens'), 
      icon: PieChart, 
      show: effectiveSettings.showWomensHealthTracker 
    },
    { 
      path: "/exams", 
      label: t('navigation.exams'), 
      icon: FileText, 
      alwaysShow: true 
    },
    { 
      path: "/videos", 
      label: t('navigation.videos'), 
      icon: Film, 
      show: effectiveSettings.showVideoSubscription 
    },
    { 
      path: "/fasting", 
      label: t('navigation.fasting', 'Jejum'), 
      icon: Timer, 
      show: true 
    },
    { 
      path: "/baby-growth", 
      label: t('navigation.baby', 'Bebê'), 
      icon: Baby, 
      show: true 
    },
    { 
      path: "/pregnancy", 
      label: t('navigation.pregnancy', 'Gravidez'), 
      icon: Heart, 
      show: true 
    }
  ];
  
  // Adiciona itens condicionais apenas se estiverem habilitados ou sempre visíveis
  return [
    ...baseItems,
    ...conditionalItems.filter(item => item.alwaysShow || item.show)
  ];
};

export function Header() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const { settings } = useDashboardSettings();
  
  // Get translated navigation items with visibility based on dashboard settings
  const navItems = getNavItems(t, settings);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Função para determinar se a tela é menor que determinado tamanho
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="bg-white dark:bg-[#1a2127] border-b border-blue-100 dark:border-gray-800 shadow-sm sticky top-0 z-50">
      <div className="w-full px-3 sm:px-4 md:px-6 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo - sempre à esquerda */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600 dark:text-emerald-400">LifeTrek</h1>
            </Link>
          </div>

          {/* Menu de navegação para telas grandes - centro */}
          <nav className="hidden lg:flex items-center justify-center flex-1 mx-8">
            <div className="flex items-center space-x-1 xl:space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-1.5 px-2 xl:px-3 py-2 rounded-md transition-colors whitespace-nowrap ${
                      location === item.path
                        ? "text-blue-600 dark:text-emerald-400 bg-blue-50 dark:bg-gray-800 font-medium"
                        : "text-slate-600 dark:text-gray-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:text-emerald-400 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="text-xs xl:text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Controles sempre à direita */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Notificações */}
            <NotificationsDropdown />

            {/* Toggle de tema */}
            <ThemeToggle />
            
            {/* Alternador de idioma */}
            <LanguageSwitcher />

            {/* Modo desenvolvedor */}
            <DevModeHeaderToggle />

            {/* Menu de navegação móvel - visível em telas menores que lg */}
            <div className="lg:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg bg-blue-600 text-white hover:bg-blue-700 dark:bg-gray-800 dark:text-emerald-400 dark:hover:bg-gray-700 shadow-sm">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-white dark:bg-[#1a2127] border-r border-blue-50 dark:border-gray-800 w-[90vw] max-w-sm py-6">
                <div className="flex items-center justify-between mb-6">
                  <SheetTitle className="text-xl font-bold text-blue-600 dark:text-emerald-400">
                    LifeTrek
                  </SheetTitle>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-slate-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-emerald-400 hover:bg-blue-50 dark:hover:bg-gray-800">
                      <X className="h-5 w-5" />
                    </Button>
                  </SheetClose>
                </div>
                
                <nav className="flex flex-col space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link 
                        key={item.path}
                        href={item.path}
                        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                          location === item.path
                            ? "text-blue-600 dark:text-emerald-400 bg-blue-50 dark:bg-gray-800 font-semibold shadow-sm"
                            : "text-slate-600 dark:text-gray-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:text-emerald-400 dark:hover:bg-gray-800"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span className="text-base font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
                
                <div className="mt-8">
                  <div className="border-t border-blue-100 dark:border-gray-700 pt-6">
                    <h3 className="px-4 text-sm font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                      {t('navigation.account')}
                    </h3>
                    <div className="space-y-2">
                      <Link 
                        href="/health-plan-setup" 
                        className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-600 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-800 dark:hover:text-emerald-400 transition-all duration-200"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Target className="h-5 w-5 flex-shrink-0" />
                        <span className="text-base">Plano de Saúde</span>
                      </Link>
                      <Link 
                        href="/profile" 
                        className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-600 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-800 dark:hover:text-emerald-400 transition-all duration-200"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <FileText className="h-5 w-5 flex-shrink-0" />
                        <span className="text-base">{t('navigation.profile')}</span>
                      </Link>
                      <Link 
                        href="/settings" 
                        className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-600 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-800 dark:hover:text-emerald-400 transition-all duration-200"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Settings className="h-5 w-5 flex-shrink-0" />
                        <span className="text-base">{t('navigation.settings')}</span>
                      </Link>
                      <button 
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200"
                      >
                        <LogOut className="h-5 w-5 flex-shrink-0" />
                        <span className="text-base">{t('navigation.logout')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            </div>

            {/* Avatar do usuário - apenas para desktop */}
            <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative flex items-center p-1">
                  <Avatar className="h-8 w-8 border border-blue-100 dark:border-gray-700">
                    <AvatarImage src={user?.avatar || undefined} alt={user?.name || user?.username || ''} />
                    <AvatarFallback className="bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-gray-200 text-xs">
                      {user?.name ? getInitials(user.name) : user?.username?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="border border-blue-100 dark:border-gray-700 w-48">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-800 dark:text-white">{user?.name || user?.username}</span>
                    <span className="text-xs text-slate-500 dark:text-gray-400">{user?.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-blue-100 dark:bg-gray-700" />
                <DropdownMenuItem>
                  <Link href="/profile" className="flex items-center w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    <span className="text-sm">{t('navigation.profile')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/settings" className="flex items-center w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    <span className="text-sm">{t('navigation.settings')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span className="text-sm">{t('navigation.logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;