import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../language-switcher';
import { ThemeToggle } from '../theme-toggle';
import { useAuth } from "@/hooks/use-auth";
import { useDashboardSettings } from "@/hooks/use-dashboard-settings";
import { BellIcon, Home, Activity, Droplets, Moon, Brain, FileText, Menu, Settings, HelpCircle, LogOut, X, Pill, PieChart, Film } from "lucide-react";
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
    <header className="bg-white dark:bg-[#1a2127] border-b border-blue-100 dark:border-gray-800 shadow-sm sticky top-0 z-50 responsive-header">
      <div className="responsive-content-container">
        <div className="flex items-center justify-between h-14 xs:h-16">
          {/* Logo - mais compacto em telas pequenas */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <h1 className="responsive-title-md text-blue-600 dark:text-emerald-400">LifeTrek</h1>
            </Link>
          </div>

          {/* Menu de navegação para telas médias e grandes */}
          <nav className="responsive-desktop-menu responsive-gap">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link 
                  key={item.path}
                  href={item.path}
                  className={`responsive-nav-link responsive-hover responsive-transition ${
                    location === item.path
                      ? "text-blue-600 dark:text-emerald-400 bg-blue-50 dark:bg-gray-800"
                      : "text-slate-600 dark:text-gray-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:text-emerald-400 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon className="responsive-icon-sm flex-shrink-0 mr-1.5" />
                  <span className="responsive-text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Ações e controles para todos os tamanhos de tela */}
          <div className="flex items-center responsive-gap-xs">
            {/* Notificações, visível em desktop */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hidden md:flex text-slate-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-gray-300 responsive-button-icon-sm"
            >
              <BellIcon className="responsive-icon-sm" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-blue-500 dark:bg-red-500"></span>
            </Button>

            {/* Toggle de tema - todos os tamanhos */}
            <ThemeToggle />
            
            {/* Alternador de idioma - todos os tamanhos */}
            <LanguageSwitcher />

            {/* Menu de navegação móvel */}
            <div className="responsive-mobile-menu">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="responsive-button-icon-sm bg-blue-600 text-white hover:bg-blue-700 dark:bg-gray-800 dark:text-emerald-400 dark:hover:bg-gray-700">
                    <Menu className="responsive-icon-sm" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-white dark:bg-[#1a2127] border-r border-blue-50 dark:border-gray-800 w-[75vw] max-w-xs">
                  <div className="flex items-center justify-between responsive-mb">
                    <SheetTitle className="responsive-title-sm text-blue-600 dark:text-white">
                      {t('navigation.menu')}
                    </SheetTitle>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon" className="responsive-button-icon-sm text-slate-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-emerald-400">
                        <X className="responsive-icon-sm" />
                      </Button>
                    </SheetClose>
                  </div>
                  
                  <nav className="flex flex-col space-y-1">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link 
                          key={item.path}
                          href={item.path}
                          className={`responsive-nav-item responsive-transition ${
                            location === item.path
                              ? "text-blue-600 dark:text-emerald-400 bg-blue-50 dark:bg-gray-800"
                              : "text-slate-600 dark:text-gray-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:text-emerald-400 dark:hover:bg-gray-800"
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Icon className="responsive-icon" />
                          <span className="responsive-text">{item.label}</span>
                        </Link>
                      );
                    })}
                  </nav>
                  
                  <div className="responsive-mt">
                    <div className="border-t border-blue-100 dark:border-gray-700 pt-4">
                      <h3 className="px-3 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('navigation.account')}
                      </h3>
                      <div className="mt-3 space-y-1">
                        {/* Links de usuário no menu móvel */}
                        <Link 
                          href="/profile" 
                          className="responsive-nav-item text-slate-600 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-800 dark:hover:text-emerald-400"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <FileText className="responsive-icon-sm" />
                          <span className="responsive-text">{t('navigation.profile')}</span>
                        </Link>
                        <Link 
                          href="/settings" 
                          className="responsive-nav-item text-slate-600 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-800 dark:hover:text-emerald-400"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Settings className="responsive-icon-sm" />
                          <span className="responsive-text">{t('navigation.settings')}</span>
                        </Link>
                        <button 
                          onClick={() => {
                            handleLogout();
                            setMobileMenuOpen(false);
                          }}
                          className="w-full responsive-nav-item text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300"
                        >
                          <LogOut className="responsive-icon-sm" />
                          <span className="responsive-text">{t('navigation.logout')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Menu de configurações para telas médias e grandes */}
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="responsive-button-icon-sm text-slate-600 dark:text-gray-300">
                    <Menu className="responsive-icon-sm" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border border-blue-100 dark:border-gray-700 w-48">
                  <DropdownMenuItem>
                    <Link href="/profile" className="flex items-center w-full">
                      <FileText className="mr-2 responsive-icon-sm" />
                      <span className="responsive-text">{t('navigation.profile')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/settings" className="flex items-center w-full">
                      <Settings className="mr-2 responsive-icon-sm" />
                      <span className="responsive-text">{t('navigation.settings')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/help" className="flex items-center w-full">
                      <HelpCircle className="mr-2 responsive-icon-sm" />
                      <span className="responsive-text">{t('navigation.help')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
                    <LogOut className="mr-2 responsive-icon-sm" />
                    <span className="responsive-text">{t('navigation.logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Avatar do usuário - apenas para desktop */}
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative flex items-center p-1 xs:p-1.5">
                    <Avatar className="h-7 w-7 xs:h-8 xs:w-8 border border-blue-100 dark:border-gray-700">
                      <AvatarImage src={user?.avatar || undefined} alt={user?.name || user?.username || ''} />
                      <AvatarFallback className="bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-gray-200 responsive-text-sm">
                        {user?.name ? getInitials(user.name) : user?.username?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border border-blue-100 dark:border-gray-700 w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="responsive-text-md font-medium text-slate-800 dark:text-white">{user?.name || user?.username}</span>
                      <span className="responsive-text-sm text-slate-500 dark:text-gray-400">{user?.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-blue-100 dark:bg-gray-700" />
                  
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
                    <LogOut className="mr-2 responsive-icon-sm" />
                    <span className="responsive-text">{t('navigation.logout')}</span>
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