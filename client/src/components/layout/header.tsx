import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../language-switcher';
import { ThemeToggle } from '../theme-toggle';
import { useAuth } from "@/hooks/use-auth";
import { BellIcon, LanguagesIcon, Home, Activity, Droplets, Moon, Brain, FileText, Menu } from "lucide-react";
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
  SheetTrigger 
} from "@/components/ui/sheet";

const navItems = [
  { path: "/", label: "Início", icon: Home },
  { path: "/activity", label: "Atividades", icon: Activity },
  { path: "/nutrition", label: "Água", icon: Droplets },
  { path: "/sleep", label: "Sono", icon: Moon },
  { path: "/mental", label: "Mental", icon: Brain },
  { path: "/exams", label: "Exames", icon: FileText }
];

export function Header() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

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
    <header className="bg-white dark:bg-[#1a2127] border-b border-blue-100 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600 dark:text-emerald-400">LifeTrek</h1>
          </div>

          <nav className="hidden md:flex md:space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link 
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    location === item.path
                      ? "text-blue-600 dark:text-emerald-400"
                      : "text-slate-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-emerald-400"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative text-slate-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-gray-300"
            >
              <BellIcon className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-blue-500 dark:bg-red-500"></span>
            </Button>

            <ThemeToggle />
            <LanguageSwitcher />

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="text-slate-600 dark:text-gray-300">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="border-r border-blue-50 dark:border-gray-800">
                <SheetHeader>
                  <SheetTitle className="text-blue-600 dark:text-white">Menu</SheetTitle>
                </SheetHeader>
                <nav className="mt-4">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link 
                        key={item.path}
                        href={item.path}
                        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          location === item.path
                            ? "text-blue-600 dark:text-emerald-400"
                            : "text-slate-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-emerald-400"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative flex items-center">
                  <Avatar className="h-8 w-8 border border-blue-100 dark:border-gray-700">
                    <AvatarImage src={user?.avatar || undefined} alt={user?.name || user?.username || ''} />
                    <AvatarFallback className="bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-gray-200">
                      {user?.name ? getInitials(user.name) : user?.username?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="border border-blue-100 dark:border-gray-700">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-slate-800 dark:text-white">{user?.name || user?.username}</span>
                    <span className="text-xs text-slate-500 dark:text-gray-400">{user?.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-blue-100 dark:bg-gray-700" />
                <DropdownMenuItem className="text-slate-700 dark:text-gray-200 focus:bg-blue-50 dark:focus:bg-gray-700">Profile Settings</DropdownMenuItem>
                <DropdownMenuItem className="text-slate-700 dark:text-gray-200 focus:bg-blue-50 dark:focus:bg-gray-700">Preferences</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-blue-100 dark:bg-gray-700" />
                <DropdownMenuItem onClick={handleLogout} className="text-blue-600 dark:text-red-400 focus:bg-blue-50 dark:focus:bg-gray-700">Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}