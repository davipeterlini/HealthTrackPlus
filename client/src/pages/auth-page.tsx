import { useAuth } from "@/hooks/use-auth";
import { useDevMode } from "@/hooks/use-dev-mode";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { TwoFactorForm } from "@/components/auth/two-factor-form";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { CheckCircle } from "lucide-react";

export default function AuthPage() {
  const { user, refetchUser } = useAuth();
  const { skipAuth } = useDevMode();
  const [, navigate] = useLocation();
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const { t } = useTranslation();
  
  useEffect(() => {
    // Check for URL parameters
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    
    // If there's an error, clear it from the URL
    if (error) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Try to refresh user data on page load
    if (refetchUser) {
      refetchUser().catch(err => console.error("Failed to refresh user data:", err));
    }
  }, [refetchUser]);
  
  // Redireciona automaticamente se o modo de desenvolvimento estiver ativado
  useEffect(() => {
    if (skipAuth) {
      navigate("/dashboard");
    }
  }, [skipAuth, navigate]);
  
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  
  if (showTwoFactor) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        {/* Theme and Language Controls */}
        <div className="absolute top-4 right-4 flex space-x-2 z-10">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg dark:bg-gray-800">
          <h2 className="text-2xl font-semibold text-blue-600 dark:text-emerald-500 mb-6 text-center">{t('auth.twoFactorTitle')}</h2>
          <TwoFactorForm onBack={() => setShowTwoFactor(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col-reverse md:flex-row bg-white dark:bg-gray-800 relative">
      {/* Theme and Language Controls */}
      <div className="absolute top-4 right-4 flex space-x-2 z-10">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>
      
      {/* Auth form section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-blue-600 dark:text-emerald-400 mb-2">{t('auth.appName')}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('auth.appDescription')}
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger 
                value="login" 
                className="data-[state=active]:text-blue-500 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none data-[state=active]:font-medium dark:data-[state=active]:text-emerald-500 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:border-emerald-500"
              >
                {t('auth.login')}
              </TabsTrigger>
              <TabsTrigger 
                value="register" 
                className="data-[state=active]:text-blue-500 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none data-[state=active]:font-medium dark:data-[state=active]:text-emerald-500 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:border-emerald-500"
              >
                {t('auth.register')}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm onRequestTwoFactor={() => setShowTwoFactor(true)} />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Hero section */}
      <div className="hidden md:w-1/2 md:flex bg-gradient-to-br from-blue-400 to-blue-600 items-center justify-center dark:bg-gradient-to-br dark:from-emerald-500 dark:to-emerald-700">
        <div className="max-w-lg px-8 py-12 text-white">
          <h2 className="text-3xl font-bold mb-6">{t('auth.heroTitle')}</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <CheckCircle className="h-6 w-6 mr-2 flex-shrink-0 text-blue-200 dark:text-emerald-200" />
              <span>{t('auth.heroFeature1')}</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-6 w-6 mr-2 flex-shrink-0 text-blue-200 dark:text-emerald-200" />
              <span>{t('auth.heroFeature2')}</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-6 w-6 mr-2 flex-shrink-0 text-blue-200 dark:text-emerald-200" />
              <span>{t('auth.heroFeature3')}</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-6 w-6 mr-2 flex-shrink-0 text-blue-200 dark:text-emerald-200" />
              <span>{t('auth.heroFeature4')}</span>
            </li>
          </ul>
          <div className="mt-8 text-sm opacity-90">
            <p>{t('auth.heroSubtext')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
