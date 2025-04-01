import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../language-switcher';
import { ThemeToggle } from '../theme-toggle';
import { useAuth } from "@/hooks/use-auth";
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
import { BellIcon, Menu } from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";

const navItems = [
  { path: "/", label: "Dashboard" },
  { path: "/exams", label: "Medical Exams" },
  { path: "/activity", label: "Activity" },
  { path: "/nutrition", label: "Nutrition & Sleep" },
  { path: "/videos", label: "Videos" }
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
    <header className="bg-white dark:bg-gray-900 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <h1 className="text-xl font-bold text-primary cursor-pointer">HealthTrack</h1>
              </Link>
            </div>
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              {navItems.map((item) => (
                <div key={item.path}>
                  <Link href={item.path}>
                    <div
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer ${
                        location === item.path
                          ? "border-primary text-primary dark:text-primary-foreground"
                          : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      {item.label}
                    </div>
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          <div className="hidden md:ml-4 md:flex md:items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative text-gray-400 hover:text-gray-500"
            >
              <BellIcon className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="ml-3 relative flex items-center">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar || undefined} alt={user?.name || user?.username || ''} />
                    <AvatarFallback>{user?.name ? getInitials(user.name) : user?.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{user?.name || user?.username}</span>
                    <span className="text-xs text-gray-500">{user?.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Preferences
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-500">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open main menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle className="text-left text-primary text-xl font-bold">HealthTrack</SheetTitle>
                </SheetHeader>
                <nav className="mt-6 flex flex-col space-y-1">
                  {navItems.map((item) => (
                    <div key={item.path}>
                      <Link href={item.path}>
                        <div 
                          className={`px-3 py-2 text-base font-medium rounded-md cursor-pointer ${
                            location === item.path
                              ? "bg-primary-50 dark:bg-primary-900/20 text-primary dark:text-primary-foreground"
                              : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.label}
                        </div>
                      </Link>
                    </div>
                  ))}
                </nav>

                <div className="mt-auto pt-6 border-t border-gray-200">
                  <div className="flex items-center px-3 py-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.avatar || undefined} alt={user?.name || user?.username || ''} />
                      <AvatarFallback>{user?.name ? getInitials(user.name) : user?.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <p className="text-base font-medium text-gray-800 dark:text-gray-100">{user?.name || user?.username}</p>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{user?.email}</p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <Button variant="ghost" className="w-full justify-start px-3">
                      Profile Settings
                    </Button>
                    <Button variant="ghost" className="w-full justify-start px-3">
                      Preferences
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start px-3"
                      onClick={handleLogout}
                    >
                      Sign out
                    </Button>
                    <div className="mt-2 px-3 pt-2 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Tema</span>
                        <ThemeToggle />
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex items-center space-x-1">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}