import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../language-switcher';
import { ThemeToggle } from '../theme-toggle';
import { NotificationsDropdown } from '../notifications-dropdown';
import { DevModeHeaderToggle } from '../dev-mode-header-toggle';
import { useAuth } from "@/hooks/use-auth";
import { useDashboardSettings } from "@/hooks/use-dashboard-settings";
import { useResponsive } from "@/hooks/use-responsive";
import { BREAKPOINTS } from "@/contexts/device-context";
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
  const { settings, updateSettings } = useDashboardSettings();
  const { isMobile, isTablet, isDesktop, windowWidth, matches, getFontSize, getIconSize } = useResponsive();
  
  // Determinar dinamicamente quais ícones mostrar com base no espaço disponível e nas configurações
  const { compactView } = settings;
  
  // Lógica avançada para determinar a visibilidade dos ícones
  const showNotifications = compactView 
    ? matches('xxs', '>=') 
    : true; // Exibir notificações somente se tiver espaço ou se compactView = false
    
  const showLanguageSwitcher = compactView 
    ? matches('xxs', '>=') 
    : true; // Exibir seletor de idioma somente se tiver espaço ou se compactView = false
    
  const showDevMode = compactView 
    ? matches('xs', '>=') 
    : true; // Exibir modo dev somente se tiver espaço ou se compactView = false
    
  const showAvatar = compactView 
    ? matches('md', '>=') 
    : true; // Mostrar avatar somente se tiver espaço ou se compactView = false
    
  // Ajustar automaticamente para o modo compacto em telas muito pequenas
  useEffect(() => {
    // Ajustar automaticamente para modo compacto em telas menores que 'xs'
    if (windowWidth < BREAKPOINTS.xs && !compactView) {
      updateSettings({ compactView: true });
    }
  }, [windowWidth, compactView, updateSettings]);
  
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

  return (
    <header className="bg-white dark:bg-[#1a2127] border-b border-blue-100 dark:border-gray-800 shadow-sm sticky top-0 z-50 w-full max-w-full overflow-x-hidden">
      <div className="flex items-center justify-between w-full max-w-full px-1.5 xxs:px-2.5 xs:px-3.5 sm:px-4 md:px-6 h-12 xxs:h-14 md:h-16 overflow-hidden box-border">
        {/* Logo - sempre à esquerda */}
        <div className="flex items-center flex-shrink-0 min-w-0">
          <Link href="/" className="flex items-center">
            <h1 className="text-sm xxs:text-base xs:text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-blue-600 dark:text-emerald-400 whitespace-nowrap">LifeTrek</h1>
          </Link>
        </div>

        {/* Menu de navegação para telas médias e grandes - centro */}
        <nav className="hidden md:flex items-center space-x-2 lg:space-x-4 xl:space-x-6 overflow-hidden mx-auto px-2 flex-grow flex-shrink justify-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link 
                key={item.path}
                href={item.path}
                className={`flex items-center gap-1.5 px-2 lg:px-3 py-1.5 lg:py-2 rounded-md transition-colors whitespace-nowrap ${
                  location === item.path
                    ? "text-blue-600 dark:text-emerald-400 bg-blue-50 dark:bg-gray-800 font-medium"
                    : "text-slate-600 dark:text-gray-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:text-emerald-400 dark:hover:bg-gray-800"
                }`}
              >
                <Icon className={`${getIconSize('sm')} flex-shrink-0`} />
                <span className="text-xs lg:text-sm font-medium truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Controles sempre à direita */}
        <div className="flex items-center gap-0.5 xxs:gap-1 xs:gap-1.5 md:gap-2 flex-shrink-0">
          {/* Notificações - exibição dinâmica */}
          {showNotifications && (
            <div>
              <NotificationsDropdown />
            </div>
          )}

          {/* Toggle de tema - sempre visível */}
          <ThemeToggle />
          
          {/* Alternador de idioma - exibição dinâmica */}
          {showLanguageSwitcher && (
            <div>
              <LanguageSwitcher />
            </div>
          )}

          {/* Modo desenvolvedor - exibição dinâmica */}
          {showDevMode && (
            <div>
              <DevModeHeaderToggle />
            </div>
          )}

          {/* Menu de navegação móvel - sempre visível em telas pequenas */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 xxs:h-8 xxs:w-8 rounded-full bg-blue-600 text-white hover:bg-blue-700 dark:bg-gray-800 dark:text-emerald-400 dark:hover:bg-gray-700 flex-shrink-0">
                  <Menu className="h-3.5 w-3.5 xxs:h-4 xxs:w-4 flex-shrink-0" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-white dark:bg-[#1a2127] border-r border-blue-50 dark:border-gray-800 w-[90vw] xxs:w-[85vw] sm:w-[75vw] max-w-xs py-3 xxs:py-4 overflow-y-auto overflow-x-hidden">
                <div className="flex items-center justify-between mb-3 xxs:mb-4">
                  <SheetTitle className="text-base xxs:text-lg font-semibold text-blue-600 dark:text-white">
                    {t('navigation.menu')}
                  </SheetTitle>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="h-7 xxs:h-8 w-7 xxs:w-8 text-slate-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-emerald-400 flex-shrink-0">
                      <X className="h-3.5 xxs:h-4 w-3.5 xxs:w-4 flex-shrink-0" />
                    </Button>
                  </SheetClose>
                </div>
                
                <nav className="flex flex-col space-y-0.5 xxs:space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link 
                        key={item.path}
                        href={item.path}
                        className={`flex items-center gap-2 xxs:gap-3 px-2 xxs:px-3 py-1.5 xxs:py-2 rounded-md transition-colors ${
                          location === item.path
                            ? "text-blue-600 dark:text-emerald-400 bg-blue-50 dark:bg-gray-800"
                            : "text-slate-600 dark:text-gray-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:text-emerald-400 dark:hover:bg-gray-800"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Icon className="h-3.5 w-3.5 xxs:h-4 xxs:w-4 flex-shrink-0" />
                        <span className="text-xs xxs:text-sm font-medium truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
                
                <div className="mt-4 xxs:mt-5 xs:mt-6">
                  <div className="border-t border-blue-100 dark:border-gray-700 pt-3 xxs:pt-4">
                    <h3 className="px-2 xxs:px-3 text-[10px] xxs:text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('navigation.account')}
                    </h3>
                    <div className="mt-2 xxs:mt-3 space-y-0.5 xxs:space-y-1">
                      <Link 
                        href="/health-plan-setup" 
                        className="flex items-center gap-2 xxs:gap-3 px-2 xxs:px-3 py-1.5 xxs:py-2 rounded-md text-slate-600 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-800 dark:hover:text-emerald-400"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Target className="h-3.5 w-3.5 xxs:h-4 xxs:w-4" />
                        <span className="text-xs xxs:text-sm">Plano de Saúde</span>
                      </Link>
                      <Link 
                        href="/profile" 
                        className="flex items-center gap-2 xxs:gap-3 px-2 xxs:px-3 py-1.5 xxs:py-2 rounded-md text-slate-600 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-800 dark:hover:text-emerald-400"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <FileText className="h-3.5 w-3.5 xxs:h-4 xxs:w-4" />
                        <span className="text-xs xxs:text-sm">{t('navigation.profile')}</span>
                      </Link>
                      <Link 
                        href="/settings" 
                        className="flex items-center gap-2 xxs:gap-3 px-2 xxs:px-3 py-1.5 xxs:py-2 rounded-md text-slate-600 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-800 dark:hover:text-emerald-400"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Settings className="h-3.5 w-3.5 xxs:h-4 xxs:w-4" />
                        <span className="text-xs xxs:text-sm">{t('navigation.settings')}</span>
                      </Link>
                      <button 
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 xxs:gap-3 px-2 xxs:px-3 py-1.5 xxs:py-2 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300"
                      >
                        <LogOut className="h-3.5 w-3.5 xxs:h-4 xxs:w-4" />
                        <span className="text-xs xxs:text-sm">{t('navigation.logout')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Avatar do usuário - exibição dinâmica */}
          {showAvatar && (
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative flex items-center p-0.5 md:p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                  <Avatar className="h-7 w-7 md:h-8 md:w-8 border border-blue-100 dark:border-gray-700">
                    <AvatarImage src={user?.avatar || undefined} alt={user?.name || user?.username || ''} />
                    <AvatarFallback className="bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-gray-200 text-[10px] md:text-xs font-medium">
                      {user?.name ? getInitials(user.name) : user?.username?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="border border-blue-100 dark:border-gray-700 w-48 mt-1 shadow-lg rounded-md z-50">
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
          )}
          
          {/* Botão de configuração para ajustar os ícones visíveis - sempre visível */}
          <div className="ml-1 xxs:ml-1.5">
            <Link href="/settings">
              <Button variant="ghost" size="icon" className="h-7 w-7 xxs:h-8 xxs:w-8 rounded-full text-slate-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                <Settings className="h-3.5 w-3.5 xxs:h-4 xxs:w-4 flex-shrink-0" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;