import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../language-switcher';
import { ThemeToggle } from '../theme-toggle';
import { useAuth } from "@/hooks/use-auth";
import { BellIcon, LanguagesIcon, Home, Activity, Droplets, Moon, Brain, FileText, Menu, Settings, HelpCircle, LogOut, X } from "lucide-react";
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
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";

const getNavItems = (t: any) => [
  { path: "/", label: t('navigation.home'), icon: Home },
  { path: "/activity", label: t('navigation.activity'), icon: Activity },
  { path: "/nutrition", label: t('navigation.water'), icon: Droplets },
  { path: "/sleep", label: t('navigation.sleep'), icon: Moon },
  { path: "/mental", label: t('navigation.mental'), icon: Brain },
  { path: "/exams", label: t('navigation.exams'), icon: FileText }
];

export function Header() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  
  // Get translated navigation items
  const navItems = getNavItems(t);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {/* Logo - mais compacto em telas pequenas */}
            <Link href="/" className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-emerald-400">LifeTrek</h1>
            </Link>
          </div>

          {/* Menu de navegação para telas médias e grandes */}
          <nav className="hidden md:flex md:items-center md:space-x-4 lg:space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link 
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-1.5 px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium rounded-md transition-colors ${
                    location === item.path
                      ? "text-blue-600 dark:text-emerald-400 bg-blue-50 dark:bg-gray-800"
                      : "text-slate-600 dark:text-gray-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:text-emerald-400 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Ações e controles para todos os tamanhos de tela */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-4">
            {/* Controles de tema, idioma e menu para dispositivos móveis */}
            <div className="md:hidden flex items-center gap-2">
              {/* Toggle de tema - visível em telas pequenas */}
              <ThemeToggle />
              
              {/* Alternador de idioma */}
              <LanguageSwitcher />
              
              {/* Menu de navegação móvel - agora ultimo na ordem em telas pequenas */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-gray-800 dark:text-emerald-400 dark:hover:bg-gray-700 h-8 w-8">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="border-r border-blue-50 dark:border-gray-800 w-[75vw] max-w-xs">
                  <div className="flex items-center justify-between mb-6">
                    <SheetTitle className="text-xl text-blue-600 dark:text-white">
                      {t('navigation.menu')}
                    </SheetTitle>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <X className="h-4 w-4" />
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
                          className={`flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                            location === item.path
                              ? "text-blue-600 dark:text-emerald-400 bg-blue-50 dark:bg-gray-800"
                              : "text-slate-600 dark:text-gray-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:text-emerald-400 dark:hover:bg-gray-800"
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Icon className="h-5 w-5" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </nav>
                  
                  <div className="mt-8 space-y-1">
                    <div className="border-t border-blue-100 dark:border-gray-700 pt-4">
                      <h3 className="px-3 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('navigation.account')}
                      </h3>
                      <div className="mt-3 space-y-1">
                        {/* Links de usuário no menu móvel */}
                        <Link 
                          href="/profile" 
                          className="flex items-center px-3 py-2 text-sm font-medium text-slate-600 dark:text-gray-300 rounded-lg hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-800 dark:hover:text-emerald-400"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <FileText className="mr-3 h-4 w-4" />
                          {t('navigation.profile')}
                        </Link>
                        <Link 
                          href="/settings" 
                          className="flex items-center px-3 py-2 text-sm font-medium text-slate-600 dark:text-gray-300 rounded-lg hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-800 dark:hover:text-emerald-400"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Settings className="mr-3 h-4 w-4" />
                          {t('navigation.settings')}
                        </Link>
                        <button 
                          onClick={() => {
                            handleLogout();
                            setMobileMenuOpen(false);
                          }}
                          className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          {t('navigation.logout')}
                        </button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Notificações, visível em todas as telas */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hidden md:flex text-slate-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-gray-300 h-8 w-8"
            >
              <BellIcon className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-blue-500 dark:bg-red-500"></span>
            </Button>

            {/* Toggle de tema - apenas para desktop */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            
            {/* Alternador de idioma - apenas para desktop */}
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>

            {/* Menu de configurações para telas médias e grandes */}
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-slate-600 dark:text-gray-300 h-8 w-8">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border border-blue-100 dark:border-gray-700 w-48">
                  <DropdownMenuItem>
                    <Link href="/profile" className="flex items-center w-full">
                      <FileText className="mr-2 h-4 w-4" />
                      {t('navigation.profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/settings" className="flex items-center w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      {t('navigation.settings')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/help" className="flex items-center w-full">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      {t('navigation.help')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('navigation.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Avatar do usuário - apenas para desktop */}
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative flex items-center p-1 sm:p-1.5">
                    <Avatar className="h-7 w-7 sm:h-8 sm:w-8 border border-blue-100 dark:border-gray-700">
                      <AvatarImage src={user?.avatar || undefined} alt={user?.name || user?.username || ''} />
                      <AvatarFallback className="bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-gray-200 text-xs sm:text-sm">
                        {user?.name ? getInitials(user.name) : user?.username?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border border-blue-100 dark:border-gray-700 w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-800 dark:text-white">{user?.name || user?.username}</span>
                      <span className="text-xs text-slate-500 dark:text-gray-400">{user?.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-blue-100 dark:bg-gray-700" />
                  
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('navigation.logout')}
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