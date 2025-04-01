import { useAuth } from "@/hooks/use-auth";
import { useDevMode } from "@/hooks/use-dev-mode";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { TwoFactorForm } from "@/components/auth/two-factor-form";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AuthPage() {
  const { user, refetchUser } = useAuth();
  const { skipAuth } = useDevMode();
  const [, navigate] = useLocation();
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  
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
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <TwoFactorForm onBack={() => setShowTwoFactor(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-gray-50 dark:bg-gray-900">
      {/* Auth form section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md bg-white dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">HealthTrack</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your comprehensive health monitoring solution
              </p>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm onRequestTwoFactor={() => setShowTwoFactor(true)} />
              </TabsContent>
              <TabsContent value="register">
                <RegisterForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Hero section */}
      <div className="hidden md:w-1/2 md:flex bg-primary items-center justify-center">
        <div className="max-w-lg px-8 py-12 text-white">
          <h2 className="text-3xl font-bold mb-6">Take control of your health journey</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Track medical exams and receive AI-powered insights</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Monitor physical activity and visualize your progress</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Track sleep patterns, water intake, and nutrition</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Access integrative medicine video content and courses</span>
            </li>
          </ul>
          <div className="mt-8 text-sm opacity-80">
            <p>Join thousands of users who have improved their health with our comprehensive tracking and personalized insights.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
