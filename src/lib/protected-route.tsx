import { Route } from "react-router-dom";
import { useAuth } from "./auth";
import { useLocation } from "react-router";
import LoadingScreen from "./LoadingScreen";


interface ProtectedRouteProps {
  component: any;
  path?: string;
}

export function ProtectedRoute({ component: Component, ...rest }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  // Temporarily disable authentication check
  const authEnabled = false;

  useEffect(() => {
    if (authEnabled && !isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <Route {...rest} component={Component} />;
}