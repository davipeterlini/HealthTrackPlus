import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../language-switcher';
import { ThemeToggle } from '../theme-toggle';
import { NotificationsDropdown } from '../notifications-dropdown';
import { DevModeHeaderToggle } from '../dev-mode-header-toggle';
import { useAuth } from "@/hooks/use-auth";
import { useDashboardSettings } from "@/hooks/use-dashboard-settings";
import { useResponsive } from "@/hooks/use-responsive";
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
  const { isMobile, getFontSize, getIconSize } = useResponsive();
  
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
    <header className="bg-white dark:bg-[#1a2127] border-b border-blue-100 dark:border-gray-800 shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between w-full px-2 xxs:px-3 xs:px-4 md:px-6 h-12 xxs:h-14 md:h-16">
        {/* Logo - sempre à esquerda */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <h1 className="text-sm xxs:text-base xs:text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-blue-600 dark:text-emerald-400">LifeTrek</h1>
          </Link>
        </div>

        {/* Menu de navegação para telas médias e grandes - centro */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link 
                key={item.path}
                href={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  location === item.path
                    ? "text-blue-600 dark:text-emerald-400 bg-blue-50 dark:bg-gray-800 font-medium"
                    : "text-slate-600 dark:text-gray-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:text-emerald-400 dark:hover:bg-gray-800"
                }`}
              >
                <Icon className={`${getIconSize('sm')} flex-shrink-0`} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Controles sempre à direita */}
        <div className="flex items-center gap-0.5 xxs:gap-1 xs:gap-1.5 md:gap-2">
          {/* Notificações - hide on very small screens */}
          <div className="hidden xxs:block">
            <NotificationsDropdown />
          </div>

          {/* Toggle de tema */}
          <ThemeToggle />
          
          {/* Alternador de idioma - hide on very small screens */}
          <div className="hidden xxs:block">
            <LanguageSwitcher />
          </div>

          {/* Modo desenvolvedor - hide on small screens */}
          <div className="hidden xs:block">
            <DevModeHeaderToggle />
          </div>

          {/* Menu de navegação móvel - sempre visível em telas pequenas */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 xxs:h-8 xxs:w-8 rounded-full bg-blue-600 text-white hover:bg-blue-700 dark:bg-gray-800 dark:text-emerald-400 dark:hover:bg-gray-700">
                  <Menu className="h-3.5 w-3.5 xxs:h-4 xxs:w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-white dark:bg-[#1a2127] border-r border-blue-50 dark:border-gray-800 w-[90vw] xxs:w-[85vw] max-w-xs py-3 xxs:py-4">
                <div className="flex items-center justify-between mb-3 xxs:mb-4">
                  <SheetTitle className="text-base xxs:text-lg font-semibold text-blue-600 dark:text-white">
                    {t('navigation.menu')}
                  </SheetTitle>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="h-7 xxs:h-8 w-7 xxs:w-8 text-slate-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-emerald-400">
                      <X className="h-3.5 xxs:h-4 w-3.5 xxs:w-4" />
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
                        <Icon className="h-3.5 w-3.5 xxs:h-4 xxs:w-4" />
                        <span className="text-xs xxs:text-sm font-medium">{item.label}</span>
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
    </header>
  );
}

export default Header;