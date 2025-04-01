import { Switch, Route } from "wouter";
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
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";
import { DevModeProvider } from "./hooks/use-dev-mode";
import { DevModeToggle } from "./components/dev-mode-toggle";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={DashboardPage} />
      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      <ProtectedRoute path="/exams" component={ExamsPage} />
      <ProtectedRoute path="/activity" component={ActivityPage} />
      <ProtectedRoute path="/nutrition" component={NutritionPage} />
      <ProtectedRoute path="/videos" component={VideosPage} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DevModeProvider>
        <AuthProvider>
          <Router />
          <DevModeToggle />
          <Toaster />
        </AuthProvider>
      </DevModeProvider>
    </QueryClientProvider>
  );
}

export default App;
