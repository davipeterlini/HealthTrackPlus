import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Suspense, ReactElement } from "react";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";
import { DevModeProvider } from "./hooks/use-dev-mode";
import { ThemeProvider } from "./hooks/use-theme";
import { DashboardSettingsProvider } from "./hooks/use-dashboard-settings";
import { DeviceProvider } from "./providers/device-provider";
import { pageImport } from "./utils/code-splitting";

// Import LoadingScreen
import LoadingScreen from "@/components/ui/loading-screen";

// Optimized lazy loading of pages using code splitting utility
const NotFound = pageImport(() => import("@/pages/not-found"));
const AuthPage = pageImport(() => import("@/pages/auth-page"));
const DashboardPage = pageImport(() => import("@/pages/dashboard-page"));
const ExamsPage = pageImport(() => import("@/pages/exams-page"));
const ActivityPage = pageImport(() => import("@/pages/activity-page"));
const NutritionPage = pageImport(() => import("@/pages/nutrition-page"));
const VideosPage = pageImport(() => import("@/pages/videos-page"));
const SettingsPage = pageImport(() => import("@/pages/settings-page"));
const MentalPage = pageImport(() => import("@/pages/mental-page"));
const SleepPage = pageImport(() => import("@/pages/sleep-page"));
const HydrationPage = pageImport(() => import("@/pages/hydration-page"));
const MedicationPage = pageImport(() => import("@/pages/medication-page"));
const WomensHealthPage = pageImport(() => import("@/pages/womens-health-page"));
const IntegrationsPage = pageImport(() => import("@/pages/integrations-page"));
const FastingPage = pageImport(() => import("@/pages/fasting-page"));
const SubscriptionPage = pageImport(() => import("@/pages/subscription-page"));
const NotificationsPage = pageImport(() => import("@/pages/notifications-page"));
const HealthPlanSetup = pageImport(() => import("@/pages/health-plan-setup").then(module => ({ default: module.HealthPlanSetup })));
const BabyGrowthPage = pageImport(() => import("@/pages/baby-growth-page"));
const PregnancyPage = pageImport(() => import("@/pages/pregnancy-page"));

// Preload commonly accessed pages
import { preloadComponent } from "./utils/code-splitting";

// Preload the dashboard and auth pages as they're frequently accessed
if (typeof window !== 'undefined') {
  setTimeout(() => {
    preloadComponent(() => import("@/pages/dashboard-page"));
    preloadComponent(() => import("@/pages/auth-page"));
  }, 1000);
}

function Router(): ReactElement {
  return (
    <Suspense fallback={<LoadingScreen />}>
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
    </Suspense>
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
