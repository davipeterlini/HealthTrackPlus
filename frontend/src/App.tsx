import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import ExamsPage from "@/pages/exams-page";
import ActivityPage from "@/pages/activity-page";
import NutritionPage from "@/pages/nutrition-page";
import VideosPage from "@/pages/videos-page";
import SettingsPage from "@/pages/settings-page";
import MentalPage from "@/pages/mental-page";
import SleepPage from "@/pages/sleep-page";
import HydrationPage from "@/pages/hydration-page";
import MedicationPage from "@/pages/medication-page";
import WomensHealthPage from "@/pages/womens-health-page";
import IntegrationsPage from "@/pages/integrations-page";
import FastingPage from "@/pages/fasting-page";
import SubscriptionPage from "@/pages/subscription-page";
import NotificationsPage from "@/pages/notifications-page";
import { HealthPlanSetup } from "@/pages/health-plan-setup";
import BabyGrowthPage from "@/pages/baby-growth-page";
import PregnancyPage from "@/pages/pregnancy-page";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";
import { DevModeProvider } from "./hooks/use-dev-mode";
import { ThemeProvider } from "./hooks/use-theme";
import { DashboardSettingsProvider } from "./hooks/use-dashboard-settings";
import { DeviceProvider } from "./providers/device-provider";

import { ReactElement } from "react";

function Router(): ReactElement {
  return (
    <Switch>
      <ProtectedRoute path="/" component={DashboardPage} />
      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      <ProtectedRoute path="/exams" component={ExamsPage} />
      <ProtectedRoute path="/activity" component={ActivityPage} />
      <ProtectedRoute path="/nutrition" component={NutritionPage} />
      <ProtectedRoute path="/videos" component={VideosPage} />
      <ProtectedRoute path="/mental" component={MentalPage} />
      <ProtectedRoute path="/sleep" component={SleepPage} />
      <ProtectedRoute path="/hydration" component={HydrationPage} />
      <ProtectedRoute path="/medication" component={MedicationPage} />
      <ProtectedRoute path="/womens-health" component={WomensHealthPage} />
      <ProtectedRoute path="/fasting" component={FastingPage} />
      <ProtectedRoute path="/baby-growth" component={BabyGrowthPage} />
      <ProtectedRoute path="/pregnancy" component={PregnancyPage} />
      <ProtectedRoute path="/health-plan-setup" component={HealthPlanSetup} />
      <ProtectedRoute path="/subscription" component={SubscriptionPage} />
      <ProtectedRoute path="/notifications" component={NotificationsPage} />
      <ProtectedRoute path="/settings" component={SettingsPage} />
      <ProtectedRoute path="/integrations" component={IntegrationsPage} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <DevModeProvider>
          <AuthProvider>
            <DeviceProvider>
              <DashboardSettingsProvider>
                <WouterRouter>
                  <Router />
                  <Toaster />
                </WouterRouter>
              </DashboardSettingsProvider>
            </DeviceProvider>
          </AuthProvider>
        </DevModeProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
